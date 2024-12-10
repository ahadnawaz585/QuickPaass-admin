export interface GroupRole {
   id?:string;
    groupId: string;
    roleId: string;
    active:boolean;
    createdAt?: Date | null | undefined;
    updatedAt?: Date | null | undefined;
    isDeleted?: Date | null | undefined;
  }
  