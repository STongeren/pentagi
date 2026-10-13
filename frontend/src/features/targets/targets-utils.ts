import type { VerifiedTargetFragmentFragment } from '@/graphql/types';

import { TargetVerificationMethod, TargetVerificationStatus } from '@/graphql/types';

export type VerifiedTarget = VerifiedTargetFragmentFragment;

type BadgeVariant = 'default' | 'destructive' | 'outline' | 'secondary';

// Prefix of the DNS TXT challenge the backend publishes as the token value.
export const TARGET_VERIFY_RECORD_PREFIX = '_nullhawk-verify';

export const TARGET_METHOD_LABELS: Record<TargetVerificationMethod, string> = {
    [TargetVerificationMethod.DnsTxt]: 'DNS TXT',
    [TargetVerificationMethod.Email]: 'Email',
    [TargetVerificationMethod.HttpFile]: 'HTTP file',
};

export const getTargetStatusDisplay = (status: TargetVerificationStatus): { label: string; variant: BadgeVariant } => {
    switch (status) {
        case TargetVerificationStatus.Expired:
            return { label: 'expired', variant: 'destructive' };
        case TargetVerificationStatus.Failed:
            return { label: 'failed', variant: 'destructive' };
        case TargetVerificationStatus.Pending:
            return { label: 'pending', variant: 'secondary' };
        case TargetVerificationStatus.Revoked:
            return { label: 'revoked', variant: 'outline' };
        case TargetVerificationStatus.Verified:
            return { label: 'verified', variant: 'default' };
        default:
            return { label: status, variant: 'secondary' };
    }
};

export const getDnsTxtRecordName = (domain: string): string => `${TARGET_VERIFY_RECORD_PREFIX}.${domain}`;

export const isTargetPending = (target: VerifiedTarget): boolean =>
    target.status === TargetVerificationStatus.Pending || target.status === TargetVerificationStatus.Failed;
