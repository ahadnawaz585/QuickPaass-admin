import { Role } from "./role";

export interface UserRole {
  id?: string;
  userId: string;
  roleId: string;
  active: boolean;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  isDeleted?: Date | null | undefined;
}

export interface UserDetailRole {
  id?: string;
  userId: string;
  roleId: string;
  active: boolean;
  role: Role;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  isDeleted?: Date | null | undefined;
}
