package targetverify

import (
	"net"
	"strings"
)

// ExtractTargets pulls candidate network targets — domains, IP addresses and
// CIDR ranges — out of free-form flow input. It exists for the defense-in-depth
// guard in the flow-creation path: every candidate it returns must be an
// ownership-verified target or the flow is refused. It is therefore tuned to
// over-return rather than miss (a missed hostname would let an unverified attack
// through), while rejecting prose that holds no target at all ("scan it" -> none).
// Results are normalized, order-preserving and deduplicated.
func ExtractTargets(input string) []string {
	var out []string
	seen := make(map[string]struct{})
	add := func(v string) {
		if v == "" {
			return
		}
		if _, ok := seen[v]; ok {
			return
		}
		seen[v] = struct{}{}
		out = append(out, v)
	}

	for _, raw := range strings.FieldsFunc(input, isSeparator) {
		tok := strings.Trim(raw, ".,;:!?\"'()[]{}<>")
		if tok == "" {
			continue
		}
		// CIDR first (a bare IP also parses here only with a prefix).
		if _, _, err := net.ParseCIDR(tok); err == nil {
			add(strings.ToLower(tok))
			continue
		}
		if ip := net.ParseIP(tok); ip != nil {
			add(strings.ToLower(tok))
			continue
		}
		// Domain-shaped tokens go through the same strict normaliser the gate
		// stores and compares against, so what we extract matches what was verified.
		if norm, err := NormalizeTarget(tok); err == nil {
			add(norm)
		}
	}
	return out
}

// isSeparator splits on whitespace and the punctuation that surrounds targets in
// prose, but never on '.', '-', '/' or ':' which are part of domains, IPs, CIDRs
// and URLs.
func isSeparator(r rune) bool {
	switch r {
	case ' ', '\t', '\n', '\r', ',', ';', '!', '?', '"', '\'', '(', ')', '[', ']', '{', '}', '<', '>', '|', '\\':
		return true
	}
	return false
}
