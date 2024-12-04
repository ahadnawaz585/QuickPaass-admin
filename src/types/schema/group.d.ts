// group.ts

import { User } from "./role";

export interface Group {
  id?: string;
  name: string;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  isDeleted?: Date | null | undefined;
}

export interface createGroup {
  name: string;
  users: string[];
  roles: string[];
  companies:string[]
}

export interface detailedGroups {
  id: string;
  userId: string;
  groupId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean | null;
  user: User;
  hi: string;
}

export interface RoleGroup {
  companyGroups: any;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean | null;
  userGroups: UserGroups[];
  groupRoles: UserDetailRole[];
}

export interface UserGroups {
  id?: string;
  userId: string;
  groupId: string;
  active: boolean;
  user: User;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  isDeleted?: Date | null | undefined;
}

export interface UserDetailRole {
  id?: string;
  userId: string;
  roleId: string;
  active: boolean;
  group: Group;
  role: Role;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  isDeleted?: Date | null;
}
