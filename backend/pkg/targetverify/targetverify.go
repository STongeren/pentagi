// Package targetverify proves that a user controls a target before any flow is
// allowed to run against it. It has no dependency on the database, controller or
// tool layers so both the GraphQL resolver and the flow-creation guard can import
// it without an import cycle. The checks are fail-closed: any error means "not
// verified", never "assume ok".
package targetverify

import (
	"context"
	"crypto/rand"
	"crypto/subtle"
	"encoding/hex"
	"fmt"
	"net"
	"strings"
	"time"
)

// Method is the challenge type. The string values match the
// TARGET_VERIFICATION_METHOD enum in the verified_targets migration.
type Method string

const (
	MethodDNSTXT   Method = "dns_txt"
	MethodHTTPFile Method = "http_file"
	MethodEmail    Method = "email"
)

// TokenPrefix tags the challenge value so an operator can see what a stray TXT
// record is for. The full token is TokenPrefix + random hex.
const TokenPrefix = "nullhawk-verify="

// dnsLabel is prepended to the domain to form the record name the user publishes,
// e.g. _nullhawk-verify.example.com. A dedicated label avoids clobbering the
// domain's own TXT records (SPF, DMARC, ...).
const dnsLabel = "_nullhawk-verify."

// lookupTimeout bounds a single DNS lookup; public resolvers can hang.
const lookupTimeout = 10 * time.Second

// GenerateToken returns a fresh challenge value to publish. 16 random bytes is
// 128 bits of entropy, far beyond guessing range for a public TXT record.
func GenerateToken() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", fmt.Errorf("generate verification token: %w", err)
	}
	return TokenPrefix + hex.EncodeToString(b), nil
}

// TXTRecordName is the DNS name the user must publish the token at.
func TXTRecordName(domain string) string {
	return dnsLabel + domain
}

// NormalizeTarget turns user input into the canonical registrable host used as
// the stored target and compared at gate time. It strips a scheme, any path,
// port and userinfo, lowercases, and rejects values that cannot be verified by a
// DNS-TXT challenge (empty, wildcards, bare IP addresses). Normalisation is
// deliberately strict: the gate compares the flow's target against this exact
// string, so a loose normaliser would let an unverified host slip through.
func NormalizeTarget(raw string) (string, error) {
	s := strings.TrimSpace(strings.ToLower(raw))
	if s == "" {
		return "", fmt.Errorf("empty target")
	}
	if i := strings.Index(s, "://"); i >= 0 {
		s = s[i+3:]
	}
	if i := strings.Index(s, "@"); i >= 0 { // strip userinfo
		s = s[i+1:]
	}
	if i := strings.IndexAny(s, "/?#"); i >= 0 { // strip path/query/fragment
		s = s[:i]
	}
	if h, _, err := net.SplitHostPort(s); err == nil { // strip :port when present
		s = h
	}
	s = strings.Trim(s, ".")
	if s == "" {
		return "", fmt.Errorf("target has no host")
	}
	if strings.ContainsAny(s, "*") {
		return "", fmt.Errorf("wildcard targets cannot be DNS-verified: %q", raw)
	}
	if net.ParseIP(s) != nil {
		return "", fmt.Errorf("IP targets cannot use DNS-TXT verification: %q", s)
	}
	if !isDNSName(s) {
		return "", fmt.Errorf("not a valid domain: %q", s)
	}
	return s, nil
}

// isDNSName reports whether s is a syntactically valid dotted hostname: at least
// two labels, each 1-63 chars of [a-z0-9-], not starting or ending with a hyphen,
// and a final label (the TLD) that is at least two chars and not all-numeric — the
// last rule keeps version strings like "v2.0" from being read as domains.
func isDNSName(s string) bool {
	if len(s) > 253 || !strings.Contains(s, ".") {
		return false
	}
	labels := strings.Split(s, ".")
	for _, label := range labels {
		if l := len(label); l == 0 || l > 63 {
			return false
		}
		if label[0] == '-' || label[len(label)-1] == '-' {
			return false
		}
		for i := 0; i < len(label); i++ {
			c := label[i]
			if !(c >= 'a' && c <= 'z' || c >= '0' && c <= '9' || c == '-') {
				return false
			}
		}
	}
	tld := labels[len(labels)-1]
	if len(tld) < 2 {
		return false
	}
	allDigits := true
	for i := 0; i < len(tld); i++ {
		if tld[i] < '0' || tld[i] > '9' {
			allDigits = false
			break
		}
	}
	return !allDigits
}

// TXTLookuper reads the TXT records at a name. It is the single seam the DNS
// check depends on, so tests drive it without touching the network and callers
// can route it through a controlled resolver.
type TXTLookuper func(ctx context.Context, name string) ([]string, error)

// ResolverLookuper adapts a *net.Resolver (nil = net.DefaultResolver) into a
// TXTLookuper with a bounded deadline.
func ResolverLookuper(res *net.Resolver) TXTLookuper {
	if res == nil {
		res = net.DefaultResolver
	}
	return func(ctx context.Context, name string) ([]string, error) {
		ctx, cancel := context.WithTimeout(ctx, lookupTimeout)
		defer cancel()
		return res.LookupTXT(ctx, name)
	}
}

// VerifyDNSTXT returns nil only when the token is published as a TXT record at
// _nullhawk-verify.<domain>. Any lookup error is returned (fail-closed); the
// token is compared in constant time. The lookup egresses to public DNS, not to
// the target, so it is safe to run before the target is trusted.
func VerifyDNSTXT(ctx context.Context, lookup TXTLookuper, domain, token string) error {
	name := TXTRecordName(domain)
	records, err := lookup(ctx, name)
	if err != nil {
		return fmt.Errorf("could not read TXT at %s: %w", name, err)
	}
	want := []byte(strings.TrimSpace(token))
	for _, r := range records {
		if subtle.ConstantTimeCompare([]byte(strings.TrimSpace(r)), want) == 1 {
			return nil
		}
	}
	return fmt.Errorf("no matching TXT record at %s", name)
}

// Verify dispatches on method. http_file and email are not implemented yet and
// fail closed rather than silently passing.
func Verify(ctx context.Context, method Method, lookup TXTLookuper, domain, token string) error {
	switch method {
	case MethodDNSTXT:
		return VerifyDNSTXT(ctx, lookup, domain, token)
	case MethodHTTPFile, MethodEmail:
		return fmt.Errorf("verification method %q not implemented yet", method)
	default:
		return fmt.Errorf("unknown verification method %q", method)
	}
}
