import type { ErrorLike } from '@apollo/client';

import { useMutation, useQuery } from '@apollo/client/react';
import { useCallback } from 'react';

import type { TargetVerificationMethod } from '@/graphql/types';

import {
    CheckTargetVerificationDocument,
    DeleteVerifiedTargetDocument,
    RequestTargetVerificationDocument,
    VerifiedTargetsDocument,
} from '@/graphql/types';

import { type VerifiedTarget } from './targets-utils';

interface UseTargetsResult {
    checkTarget: (id: string) => Promise<undefined | VerifiedTarget>;
    deleteTarget: (id: string) => Promise<void>;
    error: ErrorLike | undefined;
    isChecking: boolean;
    isDeleting: boolean;
    isLoading: boolean;
    isRequesting: boolean;
    refetch: () => void;
    requestTarget: (target: string, method: TargetVerificationMethod) => Promise<undefined | VerifiedTarget>;
    targets: VerifiedTarget[];
}

// Data layer for the verified-targets settings page. The query has no
// subscription on the backend yet (v1), so mutations refetch `verifiedTargets`
// to keep the Apollo cache in sync.
export function useTargets(): UseTargetsResult {
    const { data, error, loading: isLoading, refetch } = useQuery(VerifiedTargetsDocument);
    const [requestTargetVerification, { loading: isRequesting }] = useMutation(RequestTargetVerificationDocument);
    const [checkTargetVerification, { loading: isChecking }] = useMutation(CheckTargetVerificationDocument);
    const [deleteVerifiedTarget, { loading: isDeleting }] = useMutation(DeleteVerifiedTargetDocument);

    const requestTarget = useCallback(
        async (target: string, method: TargetVerificationMethod) => {
            const result = await requestTargetVerification({
                refetchQueries: ['verifiedTargets'],
                variables: { method, target },
            });

            return result.data?.requestTargetVerification;
        },
        [requestTargetVerification],
    );

    const checkTarget = useCallback(
        async (id: string) => {
            const result = await checkTargetVerification({
                refetchQueries: ['verifiedTargets'],
                variables: { id },
            });

            return result.data?.checkTargetVerification;
        },
        [checkTargetVerification],
    );

    const deleteTarget = useCallback(
        async (id: string) => {
            await deleteVerifiedTarget({
                refetchQueries: ['verifiedTargets'],
                variables: { id },
            });
        },
        [deleteVerifiedTarget],
    );

    return {
        checkTarget,
        deleteTarget,
        error,
        isChecking,
        isDeleting,
        isLoading,
        isRequesting,
        refetch,
        requestTarget,
        targets: data?.verifiedTargets ?? [],
    };
}
