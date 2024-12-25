// import { CompanyGroup, CompanyGroupTab } from "./company";
import { UserGroup, UserDetailGroup } from "./userGroup";
import { UserRole, UserDetailRole } from "./userRole";

export interface profileUser {
  id?: string;
  username: string;
  password: string;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  isDeleted?: Date | null | undefined;
}

export interface User {
  id?: string;
  username: string;
  password: string;
  rememberMe?: boolean;
  employeeId?:string;
  // defaultCompanyId?: string;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  isDeleted?: Date | null | undefined;
}

export interface UserData {
  username: string;
  password: string;
  // defaultCompanyId?: string;
  userRole: string; // Change from userRoles to userRole
  userGroup: string; // Change from userGroups to userGroup
}

export interface UserCreateData {
  username: string;
  password: string;
  // defaultCompanyId?: string;
  userRole: string[]; // Change from userRoles to userRole
  userGroup: string[];
  // companyUser: string[]; // Change from userGroups to userGroup
}

export interface UserDetailData {
  username: string;
  // defaultCompanyId?: string;
  userRole: UserDetailRole[]; // Change from userRoles to userRole
  userGroup: UserDetailGroup[];
  // companyUser: CompanyGroupTab[]; // Change from userGroups to userGroup
}
