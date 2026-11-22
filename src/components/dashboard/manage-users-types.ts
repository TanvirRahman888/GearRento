
export type ManagedUserRole =
  | "customer"
  | "owner"
  | "admin";

export type UserRoleFilter =
  | "all"
  | ManagedUserRole;

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;

  role: ManagedUserRole;
  accountType: string;
  createdAt: string | null;

  isPrimaryAdmin: boolean;
};

export type ManageUsersPermissions = {
  canAssignAdmin: boolean;
  canManageAdmins: boolean;
  canDeleteUsers: boolean;
};

export type ManageUsersResponse = {
  success: boolean;

  users: ManagedUser[];

  permissions: ManageUsersPermissions;

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  error?: string;
};
