package targetverify

import (
	"reflect"
	"testing"
)

func TestTargetverify_ExtractTargets_PullsDomainsAndIPsFromProse(t *testing.T) {
	cases := []struct {
		in   string
		want []string
	}{
		{"scan it", nil},
		{"just say hello", nil},
		{"map acme-staging.dev and api.acme.dev for auth flaws", []string{"acme-staging.dev", "api.acme.dev"}},
		{"test https://shop.mybrand.io/login please", []string{"shop.mybrand.io"}},
		{"recon 10.0.4.0/24 and 10.0.0.5", []string{"10.0.4.0/24", "10.0.0.5"}},
		{"hit example.com, then example.com again", []string{"example.com"}},
		{"check EXAMPLE.com:8443/admin", []string{"example.com"}},
		{"enumerate 2001:db8::1 quietly", []string{"2001:db8::1"}},
	}
	for _, c := range cases {
		got := ExtractTargets(c.in)
		if !reflect.DeepEqual(got, c.want) {
			t.Errorf("ExtractTargets(%q) = %v, want %v", c.in, got, c.want)
		}
	}
}

func TestTargetverify_ExtractTargets_IgnoresVersionStringsAndWords(t *testing.T) {
	// "v2.0" looks domain-shaped but its TLD is numeric; a weak extractor that
	// let it through would block or mis-gate a legitimate flow.
	for _, in := range []string{"upgrade to v2.0 now", "the e-commerce logic", "run a.b scan"} {
		if got := ExtractTargets(in); len(got) != 0 {
			t.Errorf("ExtractTargets(%q) = %v, want no targets", in, got)
		}
	}
}
