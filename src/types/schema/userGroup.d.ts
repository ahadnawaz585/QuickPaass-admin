// import { Company } from "./company";
import { Group } from "./group";

export interface UserGroup {
  id?: string;
  userId: string;
  groupId: string;
  active: boolean;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  isDeleted?: Date | null | undefined;
}

export interface UserDetailGroup {
  id?: string;
  userId: string;
  groupId: string;
  active: boolean;
  role:Role
  group: Group;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  isDeleted?: Date | null | undefined;
}

export interface UserDetailCompany {
  id?: string;
  userId: string;
  groupId: string;
  active: boolean;
//   company:Company
  group: Group;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  isDeleted?: Date | null | undefined;
}
