import { Group, RoleGroup } from "./group";
import { GroupRole } from "./groupRole";
import { User } from "./user";
import { UserDetailGroup } from "./userGroup";

export interface createRole {
  name: string;
  users: string[];
  groups: string[];
} // role.ts

export interface Role {
  id?: string;
  name: string;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  isDeleted?: Date | null | undefined;
}

export interface User {
  id: string;
  username: string;
  password: string;
  defaultCompanyId?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  isDeleted?: string | null;
}

export interface UserRoles {
  id?: string;
  userId: string;
  roleId: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean | null;
  user: User;
}

export interface UserRole {
  id?: string;
  userId: string;
  roleId: string;
  active: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  isDeleted?: Date | null;
}

export interface detailedRole extends Role {
  userRoles: UserRoles[];
  groupRoles: UserDetailGroup[];
}
