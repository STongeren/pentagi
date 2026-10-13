import type { ColumnDef } from '@tanstack/react-table';

import { Copy, Ellipsis, RefreshCw, ShieldCheck, Trash } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import {
    AppHeader,
    AppHeaderAction,
    AppHeaderActions,
    AppHeaderContent,
    AppHeaderTitle,
} from '@/components/layouts/app/app-header';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { ErrorState } from '@/components/shared/error-state';
import { LoadingState } from '@/components/shared/loading-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';
import { DataTable, DataTableColumnHeader } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
    getDnsTxtRecordName,
    getTargetStatusDisplay,
    isTargetPending,
    TARGET_METHOD_LABELS,
    type VerifiedTarget,
} from '@/features/targets/targets-utils';
import { useTargets } from '@/features/targets/use-targets';
import { TargetVerificationMethod } from '@/graphql/types';
import { useAppForm } from '@/hooks/use-app-form';
import { useTableState } from '@/hooks/use-table-state';
import { copyToClipboard } from '@/lib/clipboard';
import { formatTableDate } from '@/lib/utils/format';

// A registrable domain: labels of letters/digits/hyphens separated by dots, at
// least one dot. Stricter normalization (IDN, registrable suffix) is the
// backend's job; this only blocks obvious junk before the request.
const DOMAIN_PATTERN = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/;

const addTargetFormSchema = z.object({
    method: z.nativeEnum(TargetVerificationMethod),
    target: z
        .string()
        .trim()
        .toLowerCase()
        .refine((value) => DOMAIN_PATTERN.test(value), 'Enter a valid domain, e.g. example.com'),
});

type AddTargetFormInput = z.input<typeof addTargetFormSchema>;
type AddTargetFormValues = z.output<typeof addTargetFormSchema>;

const ADD_TARGET_DEFAULTS: AddTargetFormInput = { method: TargetVerificationMethod.DnsTxt, target: '' };

function SettingsTargets() {
    const {
        checkTarget,
        deleteTarget,
        error,
        isChecking,
        isDeleting,
        isLoading,
        isRequesting,
        refetch,
        requestTarget,
        targets,
    } = useTargets();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [challengeTarget, setChallengeTarget] = useState<null | VerifiedTarget>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingTarget, setDeletingTarget] = useState<null | VerifiedTarget>(null);
    const [checkingId, setCheckingId] = useState<null | string>(null);

    const { filter, pageIndex: currentPage, setFilter, setPage: handlePageChange } = useTableState();

    const addForm = useAppForm<AddTargetFormInput, unknown, AddTargetFormValues>({
        defaultValues: ADD_TARGET_DEFAULTS,
        schema: addTargetFormSchema,
    });

    const handleOpenAddDialog = useCallback(() => {
        addForm.reset(ADD_TARGET_DEFAULTS);
        setIsAddDialogOpen(true);
    }, [addForm]);

    const handleAdd = useCallback(async () => {
        const valid = await addForm.trigger();

        if (!valid) {
            return;
        }

        const values = addForm.getValues();

        try {
            const created = await requestTarget(values.target, values.method);

            setIsAddDialogOpen(false);
            addForm.reset(ADD_TARGET_DEFAULTS);

            if (created) {
                setChallengeTarget(created);
            }
        } catch (err) {
            toast.error('Failed to request verification', {
                description: err instanceof Error ? err.message : undefined,
            });
        }
    }, [addForm, requestTarget]);

    const handleCheck = useCallback(
        async (target: VerifiedTarget) => {
            setCheckingId(target.id);

            try {
                const updated = await checkTarget(target.id);

                if (updated?.status === 'verified') {
                    toast.success(`${updated.target} is now verified`);
                } else if (updated?.lastError) {
                    toast.error('Verification not complete', { description: updated.lastError });
                } else {
                    toast.info('Verification not complete yet', {
                        description: 'The DNS TXT record was not found. Allow time for DNS to propagate.',
                    });
                }
            } catch (err) {
                toast.error('Failed to check verification', {
                    description: err instanceof Error ? err.message : undefined,
                });
            } finally {
                setCheckingId(null);
            }
        },
        [checkTarget],
    );

    const handleDeleteDialogOpen = useCallback((target: VerifiedTarget) => {
        setDeletingTarget(target);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDelete = useCallback(
        async (id: string | undefined) => {
            if (!id) {
                return;
            }

            try {
                await deleteTarget(id);
                setDeletingTarget(null);
            } catch (err) {
                toast.error('Failed to delete target', {
                    description: err instanceof Error ? err.message : undefined,
                });
            }
        },
        [deleteTarget],
    );

    const handleCopy = useCallback(async (value: string, label: string) => {
        const success = await copyToClipboard(value);

        if (success) {
            toast.success(`${label} copied to clipboard`);

            return;
        }

        toast.error(`Failed to copy ${label.toLowerCase()} to clipboard`);
    }, []);

    const columns: ColumnDef<VerifiedTarget>[] = useMemo(
        () => [
            {
                accessorKey: 'target',
                cell: ({ row }) => (
                    <div
                        className="truncate font-medium"
                        title={row.original.target}
                    >
                        {row.original.target}
                    </div>
                ),
                enableHiding: false,
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Target"
                    />
                ),
                meta: { searchable: true },
                size: 280,
            },
            {
                accessorKey: 'method',
                cell: ({ row }) => (
                    <div className="text-sm whitespace-nowrap">{TARGET_METHOD_LABELS[row.original.method]}</div>
                ),
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Method"
                    />
                ),
                meta: { searchable: true },
                size: 120,
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => {
                    const statusDisplay = getTargetStatusDisplay(row.original.status);

                    return <Badge variant={statusDisplay.variant}>{statusDisplay.label}</Badge>;
                },
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Status"
                    />
                ),
                meta: { searchable: true },
                size: 120,
            },
            {
                accessorKey: 'createdAt',
                cell: ({ row }) => (
                    <div className="text-sm whitespace-nowrap">{formatTableDate(new Date(row.original.createdAt))}</div>
                ),
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Created"
                    />
                ),
                meta: { columnMenuLabel: 'Created' },
                size: 120,
                sortingFn: (rowA, rowB) =>
                    new Date(rowA.original.createdAt).getTime() - new Date(rowB.original.createdAt).getTime(),
            },
            {
                cell: ({ row }) => {
                    const target = row.original;
                    const isRowChecking = isChecking && checkingId === target.id;

                    return (
                        <div className="flex items-center justify-end gap-1">
                            {isTargetPending(target) ? (
                                <Button
                                    disabled={isRowChecking}
                                    onClick={() => handleCheck(target)}
                                    size="sm"
                                    variant="outline"
                                >
                                    {isRowChecking ? <Spinner variant="circle" /> : <RefreshCw />}
                                    Check
                                </Button>
                            ) : null}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        aria-label="Open menu"
                                        className="shrink-0"
                                        size="icon-sm"
                                        variant="ghost"
                                    >
                                        <Ellipsis />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="min-w-36"
                                >
                                    <DropdownMenuItem onClick={() => setChallengeTarget(target)}>
                                        <ShieldCheck />
                                        View DNS record
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        disabled={isDeleting && deletingTarget?.id === target.id}
                                        onClick={() => handleDeleteDialogOpen(target)}
                                    >
                                        {isDeleting && deletingTarget?.id === target.id ? (
                                            <>
                                                <Spinner variant="circle" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash />
                                                Delete
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
                enableHiding: false,
                header: () => null,
                id: 'actions',
                meta: { preventRowClick: true },
                size: 160,
            },
        ],
        [checkingId, deletingTarget, handleCheck, handleDeleteDialogOpen, isChecking, isDeleting],
    );

    const renderRowContextMenu = useCallback(
        (target: VerifiedTarget) => (
            <>
                <ContextMenuItem onClick={() => setChallengeTarget(target)}>
                    <ShieldCheck />
                    View DNS record
                </ContextMenuItem>
                {isTargetPending(target) ? (
                    <ContextMenuItem onClick={() => handleCheck(target)}>
                        <RefreshCw />
                        Check
                    </ContextMenuItem>
                ) : null}
                <ContextMenuSeparator />
                <ContextMenuItem
                    disabled={isDeleting && deletingTarget?.id === target.id}
                    onClick={() => handleDeleteDialogOpen(target)}
                >
                    <Trash />
                    {isDeleting && deletingTarget?.id === target.id ? 'Deleting...' : 'Delete'}
                </ContextMenuItem>
            </>
        ),
        [deletingTarget, handleCheck, handleDeleteDialogOpen, isDeleting],
    );

    const pageHeader = (
        <AppHeader>
            <AppHeaderContent>
                <AppHeaderTitle icon={<ShieldCheck className="size-4 shrink-0" />}>Target Verification</AppHeaderTitle>
            </AppHeaderContent>
            <AppHeaderActions>
                <AppHeaderAction
                    icon={<ShieldCheck />}
                    label="Add Target"
                    onClick={handleOpenAddDialog}
                    variant="secondary"
                />
            </AppHeaderActions>
        </AppHeader>
    );

    const renderBody = () => {
        if (isLoading && targets.length === 0) {
            return (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <LoadingState
                        description="Please wait while we fetch your verified targets"
                        title="Loading targets..."
                    />
                </div>
            );
        }

        if (error && targets.length === 0) {
            return (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <ErrorState
                        message={error.message}
                        onRetry={refetch}
                        title="Error loading targets"
                    />
                </div>
            );
        }

        if (targets.length === 0) {
            return (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <ShieldCheck />
                            </EmptyMedia>
                            <EmptyTitle>No verified targets</EmptyTitle>
                            <EmptyDescription>
                                Add a target and prove you control it before running a flow against it
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button
                                onClick={handleOpenAddDialog}
                                variant="secondary"
                            >
                                <ShieldCheck />
                                Add Target
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>
            );
        }

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <DataTable<VerifiedTarget>
                    columns={columns}
                    data={targets}
                    empty={{ entityName: 'targets' }}
                    filterPlaceholder="Filter targets..."
                    filterValue={filter}
                    label="Verified Targets"
                    onFilterChange={setFilter}
                    onPageChange={handlePageChange}
                    pageIndex={currentPage}
                    renderRowContextMenu={renderRowContextMenu}
                />
            </div>
        );
    };

    const recordName = challengeTarget ? getDnsTxtRecordName(challengeTarget.target) : '';

    return (
        <>
            {pageHeader}
            {renderBody()}

            <Dialog
                onOpenChange={setIsAddDialogOpen}
                open={isAddDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Target</DialogTitle>
                        <DialogDescription>
                            Enter a domain you control. We generate a challenge you publish to prove ownership.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="target-domain">Domain</Label>
                            <Controller
                                control={addForm.control}
                                name="target"
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input
                                            {...field}
                                            autoComplete="off"
                                            autoFocus
                                            id="target-domain"
                                            placeholder="example.com"
                                        />
                                        {fieldState.error ? (
                                            <p className="text-destructive text-sm">{fieldState.error.message}</p>
                                        ) : null}
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="target-method">Method</Label>
                            <Controller
                                control={addForm.control}
                                name="method"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger
                                            aria-label="Verification method"
                                            id="target-method"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={TargetVerificationMethod.DnsTxt}>
                                                    {TARGET_METHOD_LABELS[TargetVerificationMethod.DnsTxt]}
                                                </SelectItem>
                                                <SelectItem value={TargetVerificationMethod.HttpFile}>
                                                    {TARGET_METHOD_LABELS[TargetVerificationMethod.HttpFile]}
                                                </SelectItem>
                                                <SelectItem value={TargetVerificationMethod.Email}>
                                                    {TARGET_METHOD_LABELS[TargetVerificationMethod.Email]}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => setIsAddDialogOpen(false)}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isRequesting}
                            onClick={handleAdd}
                            variant="secondary"
                        >
                            {isRequesting ? <Spinner variant="circle" /> : null}
                            Request Verification
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                onOpenChange={(open) => !open && setChallengeTarget(null)}
                open={challengeTarget !== null}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Publish this DNS record</DialogTitle>
                        <DialogDescription>
                            Create a TXT record at your DNS provider, then click Check to verify ownership of{' '}
                            {challengeTarget?.target}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <Label>Name</Label>
                            <div className="flex items-center gap-2">
                                <code className="bg-muted flex-1 rounded p-2 text-sm break-all">{recordName}</code>
                                <Button
                                    aria-label="Copy record name"
                                    onClick={() => handleCopy(recordName, 'Record name')}
                                    size="icon-sm"
                                    variant="ghost"
                                >
                                    <Copy />
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label>Type</Label>
                            <code className="bg-muted rounded p-2 text-sm">TXT</code>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label>Value</Label>
                            <div className="flex items-center gap-2">
                                <code className="bg-muted flex-1 rounded p-2 text-sm break-all">
                                    {challengeTarget?.token}
                                </code>
                                <Button
                                    aria-label="Copy record value"
                                    onClick={() => handleCopy(challengeTarget?.token ?? '', 'Record value')}
                                    size="icon-sm"
                                    variant="ghost"
                                >
                                    <Copy />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => setChallengeTarget(null)}
                            variant="outline"
                        >
                            Close
                        </Button>
                        <Button
                            disabled={!challengeTarget || (isChecking && checkingId === challengeTarget.id)}
                            onClick={() => challengeTarget && handleCheck(challengeTarget)}
                            variant="secondary"
                        >
                            {challengeTarget && isChecking && checkingId === challengeTarget.id ? (
                                <Spinner variant="circle" />
                            ) : (
                                <RefreshCw />
                            )}
                            Check
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                cancelText="Cancel"
                confirmText="Delete"
                handleConfirm={() => handleDelete(deletingTarget?.id)}
                handleOpenChange={setIsDeleteDialogOpen}
                isOpen={isDeleteDialogOpen}
                itemName={deletingTarget?.target}
                itemType="target"
            />
        </>
    );
}

export default SettingsTargets;
