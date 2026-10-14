package targetverify

import (
	"context"
	"errors"
	"strings"
	"testing"
)

func TestTargetverify_NormalizeTarget_CanonicalisesValidHosts(t *testing.T) {
	cases := map[string]string{
		"EXAMPLE.com":                      "example.com",
		"https://Acme-Staging.dev/login":   "acme-staging.dev",
		"api.acme.dev:443":                 "api.acme.dev",
		"user@mail.example.org":            "mail.example.org",
		"example.com.":                     "example.com",
		"  shop.mybrand.io  ":              "shop.mybrand.io",
		"http://a.b.c.example.co.uk/x?y=1": "a.b.c.example.co.uk",
	}
	for in, want := range cases {
		got, err := NormalizeTarget(in)
		if err != nil {
			t.Errorf("NormalizeTarget(%q) returned error: %v", in, err)
			continue
		}
		if got != want {
			t.Errorf("NormalizeTarget(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestTargetverify_NormalizeTarget_RejectsUnverifiableInput(t *testing.T) {
	for _, in := range []string{
		"",
		"   ",
		"*.example.com",
		"10.0.0.5",
		"2001:db8::1",
		"localhost",
		"-bad.example.com",
		"bad-.example.com",
		"http://",
	} {
		if got, err := NormalizeTarget(in); err == nil {
			t.Errorf("NormalizeTarget(%q) = %q, want error", in, got)
		}
	}
}

func TestTargetverify_GenerateToken_IsPrefixedAndRandom(t *testing.T) {
	a, err := GenerateToken()
	if err != nil {
		t.Fatalf("GenerateToken: %v", err)
	}
	if !strings.HasPrefix(a, "nullhawk-verify=") {
		t.Errorf("token %q missing prefix", a)
	}
	if len(a) != len("nullhawk-verify=")+32 {
		t.Errorf("token %q has length %d, want prefix+32 hex", a, len(a))
	}
	b, _ := GenerateToken()
	if a == b {
		t.Errorf("two generated tokens are identical: %q", a)
	}
}

func fixedLookuper(records []string, err error) TXTLookuper {
	return func(ctx context.Context, name string) ([]string, error) { return records, err }
}

func TestTargetverify_VerifyDNSTXT_PassesWhenTokenPublished(t *testing.T) {
	token := "nullhawk-verify=abc123"
	lookup := fixedLookuper([]string{"v=spf1 -all", "  nullhawk-verify=abc123  "}, nil)
	if err := VerifyDNSTXT(context.Background(), lookup, "example.com", token); err != nil {
		t.Errorf("expected pass, got %v", err)
	}
}

func TestTargetverify_VerifyDNSTXT_FailsClosedOnLookupError(t *testing.T) {
	lookup := fixedLookuper(nil, errors.New("no such host"))
	if err := VerifyDNSTXT(context.Background(), lookup, "example.com", "nullhawk-verify=abc123"); err == nil {
		t.Error("expected error on lookup failure, got nil (must fail closed)")
	}
}

func TestTargetverify_VerifyDNSTXT_FailsWhenNoRecordMatches(t *testing.T) {
	lookup := fixedLookuper([]string{"v=spf1 -all", "nullhawk-verify=WRONG"}, nil)
	if err := VerifyDNSTXT(context.Background(), lookup, "example.com", "nullhawk-verify=abc123"); err == nil {
		t.Error("expected error when no TXT record matches, got nil")
	}
}

func TestTargetverify_Verify_UnimplementedMethodsFailClosed(t *testing.T) {
	lookup := fixedLookuper([]string{"anything"}, nil)
	for _, m := range []Method{MethodHTTPFile, MethodEmail, Method("bogus")} {
		if err := Verify(context.Background(), m, lookup, "example.com", "nullhawk-verify=abc123"); err == nil {
			t.Errorf("method %q: expected error, got nil", m)
		}
	}
}

func TestTargetverify_TXTRecordName_UsesDedicatedLabel(t *testing.T) {
	if got := TXTRecordName("example.com"); got != "_nullhawk-verify.example.com" {
		t.Errorf("TXTRecordName = %q, want _nullhawk-verify.example.com", got)
	}
}
