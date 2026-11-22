
"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type {
  ManagedUser,
  ManagedUserRole,
  ManageUsersPermissions,
  ManageUsersResponse,
  UserRoleFilter,
} from "./manage-users-types";

// ======================================
// Helpers
// ======================================

const ALL_ROLES: ManagedUserRole[] = [
  "customer",
  "owner",
  "admin",
];

const EMPTY_PERMISSIONS: ManageUsersPermissions = {
  canAssignAdmin: false,
  canManageAdmins: false,
  canDeleteUsers: false,
};

function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured."
    );
  }

  return url.replace(/\/+$/, "");
}

async function getToken() {
  const result = await authClient.token();
  const token = result.data?.token;

  if (!token) {
    throw new Error(
      "Session expired. Please sign in again."
    );
  }

  return token;
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

function getRoleStyles(role: ManagedUserRole) {
  switch (role) {
    case "admin":
      return "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300";

    case "owner":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";

    default:
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
  }
}

function getAllowedRoles(
  user: ManagedUser,
  permissions: ManageUsersPermissions
): ManagedUserRole[] {
  if (user.isPrimaryAdmin) {
    return [user.role];
  }

  // Regular Admin cannot modify Admins.
  if (
    user.role === "admin" &&
    !permissions.canManageAdmins
  ) {
    return ["admin"];
  }

  if (permissions.canAssignAdmin) {
    return ALL_ROLES;
  }

  // Regular Admin can change
  // Customer <-> Owner.
  return ["customer", "owner"];
}

type RoleDialogData = {
  user: ManagedUser;
  nextRole: ManagedUserRole;
};

// ======================================
// Manage Users Component
// ======================================

export function ManageUsersTable() {
  const [users, setUsers] =
    useState<ManagedUser[]>([]);

  const [permissions, setPermissions] =
    useState<ManageUsersPermissions>(
      EMPTY_PERMISSIONS
    );

  const [pagination, setPagination] =
    useState<
      ManageUsersResponse["pagination"] | null
    >(null);

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState<UserRoleFilter>("all");

  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  const [roleDialog, setRoleDialog] =
    useState<RoleDialogData | null>(null);

  const [deleteDialog, setDeleteDialog] =
    useState<ManagedUser | null>(null);

  const [deleteText, setDeleteText] =
    useState("");

  const [busy, setBusy] = useState(false);

  const searchTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  // ====================================
  // Search Timer
  // ====================================

  function stopSearchTimer() {
    if (searchTimer.current !== null) {
      clearTimeout(searchTimer.current);
      searchTimer.current = null;
    }
  }

  // ====================================
  // Fetch Users
  // ====================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers():
      Promise<ManageUsersResponse> {
      const token = await getToken();

      if (controller.signal.aborted) {
        throw new Error("Request cancelled.");
      }

      const params = new URLSearchParams({
        page: String(page),
        role: roleFilter,
      });

      if (search) {
        params.set("q", search);
      }

      const response = await fetch(
        `${getApiUrl()}/admin/users?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        }
      );

      const result =
        (await response.json()) as ManageUsersResponse;

      if (
        !response.ok ||
        !result.success ||
        !Array.isArray(result.users) ||
        !result.pagination
      ) {
        throw new Error(
          result.error ||
            "Unable to load registered users."
        );
      }

      return result;
    }

    void fetchUsers()
      .then((result) => {
        if (controller.signal.aborted) return;

        const lastPage = Math.max(
          1,
          result.pagination.totalPages
        );

        // Handle an empty last page after
        // deleting a user.
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }

        setUsers(result.users);
        setPagination(result.pagination);

        setPermissions(
          result.permissions || EMPTY_PERMISSIONS
        );

        setError("");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load users."
        );

        setUsers([]);
        setPagination(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [page, roleFilter, search, refreshKey]);

  // Clear search timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimer.current !== null) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);

  // ====================================
  // Refresh
  // ====================================

  function refreshUsers() {
    stopSearchTimer();

    setLoading(true);
    setError("");

    setRefreshKey((current) => current + 1);
  }

  // ====================================
  // Search
  // ====================================

  function applySearch(value: string) {
    const nextSearch = value.trim();

    setLoading(true);
    setError("");
    setExpandedId(null);

    setPage(1);
    setSearch(nextSearch);

    if (
      nextSearch === search &&
      page === 1
    ) {
      setRefreshKey((current) => current + 1);
    }
  }

  function handleSearchChange(value: string) {
    setSearchInput(value);
    stopSearchTimer();

    searchTimer.current = setTimeout(() => {
      applySearch(value);
    }, 450);
  }

  function handleSearchSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    stopSearchTimer();

    applySearch(searchInput);
  }

  // ====================================
  // Filter Roles
  // ====================================

  function handleRoleFilter(
    nextRole: UserRoleFilter
  ) {
    stopSearchTimer();

    setRoleFilter(nextRole);
    setPage(1);
    setSearch(searchInput.trim());

    setExpandedId(null);
    setLoading(true);
    setError("");
  }

  function clearFilters() {
    stopSearchTimer();

    setSearchInput("");
    setSearch("");
    setRoleFilter("all");
    setPage(1);
    setExpandedId(null);

    setLoading(true);
    setError("");
    setRefreshKey((current) => current + 1);
  }

  // ====================================
  // Pagination
  // ====================================

  function handlePageChange(nextPage: number) {
    if (
      loading ||
      nextPage < 1 ||
      nextPage === page ||
      (pagination &&
        nextPage > pagination.totalPages)
    ) {
      return;
    }

    stopSearchTimer();

    setLoading(true);
    setError("");
    setExpandedId(null);

    setPage(nextPage);
  }

  // ====================================
  // Open Role Confirmation
  // ====================================

  function openRoleDialog(
    user: ManagedUser,
    nextRole: ManagedUserRole
  ) {
    if (busy || user.isPrimaryAdmin) return;

    const allowed = getAllowedRoles(
      user,
      permissions
    );

    if (
      !allowed.includes(nextRole) ||
      nextRole === user.role
    ) {
      return;
    }

    setRoleDialog({
      user,
      nextRole,
    });
  }

  // ====================================
  // Confirm Role Change
  // ====================================

  async function confirmRoleChange() {
    const selection = roleDialog;

    if (!selection || busy) return;

    setBusy(true);

    try {
      const token = await getToken();

      const response = await fetch(
        `${getApiUrl()}/admin/users/${encodeURIComponent(
          selection.user.id
        )}/role`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            role: selection.nextRole,
          }),
        }
      );

      const result = (await response
        .json()
        .catch(() => null)) as {
        success?: boolean;
        message?: string;
        error?: string;
      } | null;

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
            `Unable to change role (HTTP ${response.status}).`
        );
      }

      toast.success(
        result.message || "User role updated.",
        {
          description:
            "The affected user must sign in again.",
        }
      );

      setRoleDialog(null);
      refreshUsers();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to update role."
      );
    } finally {
      setBusy(false);
    }
  }

  // ====================================
  // Open Delete Dialog
  // ====================================

  function openDeleteDialog(user: ManagedUser) {
    if (
      busy ||
      !permissions.canDeleteUsers ||
      user.isPrimaryAdmin
    ) {
      return;
    }

    setDeleteText("");
    setDeleteDialog(user);
  }

  // ====================================
  // Confirm Permanent Deletion
  // ====================================

  async function confirmDeleteUser() {
    const user = deleteDialog;

    if (
      !user ||
      busy ||
      user.isPrimaryAdmin ||
      deleteText !== "DELETE"
    ) {
      return;
    }

    setBusy(true);

    try {
      const token = await getToken();

      const response = await fetch(
        `${getApiUrl()}/admin/users/${encodeURIComponent(
          user.id
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = (await response
        .json()
        .catch(() => null)) as {
        success?: boolean;
        message?: string;
        error?: string;
      } | null;

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
            `Unable to delete user (HTTP ${response.status}).`
        );
      }

      toast.success(
        result.message ||
          "User deleted successfully."
      );

      setDeleteDialog(null);
      setDeleteText("");

      refreshUsers();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to delete user."
      );
    } finally {
      setBusy(false);
    }
  }

  // ====================================
  // UI
  // ====================================

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Users
              size={22}
              className="text-primary"
            />
            Registered Users
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            View accounts, change roles, and manage
            registered GearRento users.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshUsers}
          disabled={loading || busy}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={
              loading ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto]">

          <form
            onSubmit={handleSearchSubmit}
            className="relative min-w-0"
          >
            <label
              htmlFor="manage-users-search"
              className="sr-only"
            >
              Search users
            </label>

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              id="manage-users-search"
              type="search"
              value={searchInput}
              maxLength={100}
              onChange={(event) =>
                handleSearchChange(
                  event.target.value
                )
              }
              placeholder="Search name or email..."
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
            />
          </form>

          <div>
            <label
              htmlFor="manage-users-role-filter"
              className="sr-only"
            >
              Filter by role
            </label>

            <select
              id="manage-users-role-filter"
              value={roleFilter}
              onChange={(event) =>
                handleRoleFilter(
                  event.target.value as UserRoleFilter
                )
              }
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="owner">Owners</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent"
          >
            Clear Filters
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {pagination
            ? `${pagination.total} matching users`
            : "Search updates automatically."}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-border bg-card">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={28}
              className="animate-spin text-primary"
            />

            <p className="text-sm text-muted-foreground">
              Loading registered users...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-card p-7"
        >
          <h3 className="font-semibold text-destructive">
            Unable to Load Users
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={refreshUsers}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        users.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <UserRound
              size={44}
              className="mx-auto text-muted-foreground"
            />

            <h3 className="mt-4 text-lg font-semibold">
              No Users Found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try a different search or role filter.
            </p>
          </div>
        )}

      {/* Users Table */}
      {!loading &&
        !error &&
        users.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-237.5 text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-4 font-semibold">
                      User
                    </th>
                    <th className="px-4 py-4 font-semibold">
                      Current Role
                    </th>
                    <th className="px-4 py-4 font-semibold">
                      Email Status
                    </th>
                    <th className="px-4 py-4 font-semibold">
                      Joined
                    </th>
                    <th className="px-4 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {users.map((user) => {
                    const expanded =
                      expandedId === user.id;

                    const allowedRoles =
                      getAllowedRoles(
                        user,
                        permissions
                      );

                    const canChangeRole =
                      !user.isPrimaryAdmin &&
                      allowedRoles.some(
                        (item) =>
                          item !== user.role
                      );

                    const canDelete =
                      permissions.canDeleteUsers &&
                      !user.isPrimaryAdmin;

                    return (
                      <Fragment key={user.id}>
                        <tr className="transition-colors hover:bg-muted/30">

                          {/* User */}
                          <td className="px-4 py-4 align-middle">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
                                {user.name.charAt(0).toUpperCase() || "U"}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold">
                                  {user.name}
                                </p>

                                <p className="mt-1 max-w-64 truncate text-xs text-muted-foreground">
                                  {user.email}
                                </p>

                                {user.isPrimaryAdmin && (
                                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400">
                                    <ShieldCheck size={13} />
                                    Main Admin
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Current Role */}
                          <td className="px-4 py-4 align-middle">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getRoleStyles(user.role)}`}
                            >
                              {user.role}
                            </span>
                          </td>

                          {/* Email */}
                          <td className="px-4 py-4 align-middle">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                user.emailVerified
                                  ? "text-emerald-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {user.emailVerified && (
                                <CheckCircle2 size={15} />
                              )}

                              {user.emailVerified
                                ? "Verified"
                                : "Not Verified"}
                            </span>
                          </td>

                          {/* Joined */}
                          <td className="px-4 py-4 align-middle text-muted-foreground">
                            {formatDate(user.createdAt)}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4 align-middle">
                            <div className="flex items-center justify-end gap-2">

                              {/* Change Role */}
                              {canChangeRole ? (
                                <select
                                  aria-label={`Change role for ${user.name}`}
                                  value={user.role}
                                  disabled={busy}
                                  onChange={(event) =>
                                    openRoleDialog(
                                      user,
                                      event.target.value as ManagedUserRole
                                    )
                                  }
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold outline-none focus:border-primary disabled:opacity-50"
                                >
                                  {allowedRoles.map(
                                    (targetRole) => (
                                      <option
                                        key={targetRole}
                                        value={targetRole}
                                      >
                                        {targetRole ===
                                        user.role
                                          ? `Current: ${targetRole}`
                                          : `Make ${targetRole}`}
                                      </option>
                                    )
                                  )}
                                </select>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Protected
                                </span>
                              )}

                              {/* Details */}
                              <button
                                type="button"
                                aria-expanded={expanded}
                                onClick={() =>
                                  setExpandedId(
                                    expanded ? null : user.id
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-accent"
                              >
                                Details

                                {expanded ? (
                                  <ChevronUp size={14} />
                                ) : (
                                  <ChevronDown size={14} />
                                )}
                              </button>

                              {/* Delete */}
                              {canDelete && (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() =>
                                    openDeleteDialog(user)
                                  }
                                  className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-50"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Details */}
                        {expanded && (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-4 sm:p-5"
                            >
                              <div className="grid gap-4 rounded-xl bg-muted/50 p-4 text-sm sm:grid-cols-2">
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    User ID
                                  </p>
                                  <p className="mt-1 break-all font-medium">
                                    {user.id}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Account Type
                                  </p>
                                  <p className="mt-1 capitalize font-medium">
                                    {user.accountType}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Email
                                  </p>
                                  <p className="mt-1 break-all font-medium">
                                    {user.email}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Joined
                                  </p>
                                  <p className="mt-1 font-medium">
                                    {formatDate(user.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Pagination */}
      {!loading &&
        !error &&
        pagination &&
        pagination.totalPages > 1 && (
          <nav
            aria-label="Users pagination"
            className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"
          >
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of{" "}
              {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={loading || page <= 1}
                onClick={() =>
                  handlePageChange(page - 1)
                }
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <button
                type="button"
                disabled={
                  loading ||
                  page >= pagination.totalPages
                }
                onClick={() =>
                  handlePageChange(page + 1)
                }
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </nav>
        )}

      {/* ==================================
          Change Role Confirmation Dialog
      ================================== */}

      <AlertDialog
        open={roleDialog !== null}
        onOpenChange={(open) => {
          if (!open && !busy) {
            setRoleDialog(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm Role Change
            </AlertDialogTitle>

            <AlertDialogDescription>
              You are changing this users permissions.
              The affected user will need to sign in again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {roleDialog && (
            <div className="space-y-3 rounded-xl bg-muted/50 p-4 text-sm">
              <p className="font-semibold">
                {roleDialog.user.name}
              </p>

              <p className="break-all text-muted-foreground">
                {roleDialog.user.email}
              </p>

              <p>
                Current Role:{" "}
                <strong className="capitalize">
                  {roleDialog.user.role}
                </strong>
              </p>

              <p>
                New Role:{" "}
                <strong className="capitalize text-primary">
                  {roleDialog.nextRole}
                </strong>
              </p>

              <p className="text-xs leading-5 text-muted-foreground">
                Existing rental records are preserved.
                Removing an Owner role withdraws
                their active equipment listings.
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>
              Cancel
            </AlertDialogCancel>

            <button
              type="button"
              onClick={() =>
                void confirmRoleChange()
              }
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {busy && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              Confirm Change
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ==================================
          Delete User Confirmation Dialog
      ================================== */}

      <AlertDialog
        open={deleteDialog !== null}
        onOpenChange={(open) => {
          if (!open && !busy) {
            setDeleteDialog(null);
            setDeleteText("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 size={20} />
              Delete User Permanently?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This deletes the account, login
              credentials, and database sessions.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteDialog && (
            <div className="space-y-4">

              <div className="rounded-xl bg-muted/50 p-4">
                <p className="font-semibold">
                  {deleteDialog.name}
                </p>

                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {deleteDialog.email}
                </p>

                <p className="mt-2 text-xs capitalize text-muted-foreground">
                  Role: {deleteDialog.role}
                </p>
              </div>

              <p className="text-sm leading-6 text-muted-foreground">
                Historical bookings, payments, and
                audit records are retained. Equipment
                listings owned by this account are
                withdrawn from public availability.
                Existing rentals may need an Admin
                to arrange a handover.
              </p>

              <div>
                <label
                  htmlFor="delete-user-text"
                  className="mb-2 block text-sm font-semibold"
                >
                  Type DELETE to confirm
                </label>

                <input
                  id="delete-user-text"
                  type="text"
                  value={deleteText}
                  autoComplete="off"
                  spellCheck={false}
                  disabled={busy}
                  onChange={(event) =>
                    setDeleteText(
                      event.target.value
                    )
                  }
                  placeholder="DELETE"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-destructive"
                />
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>
              Cancel
            </AlertDialogCancel>

            <button
              type="button"
              onClick={() =>
                void confirmDeleteUser()
              }
              disabled={
                busy ||
                deleteText !== "DELETE"
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={16} />
              )}

              Delete Permanently
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
