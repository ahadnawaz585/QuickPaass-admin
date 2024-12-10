import { ParentType } from "../enums/enums";

export interface FeaturePermission {
  id?: string;
  parentType: ParentType;
  parentId: string;
  featureId: string;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  isDeleted?: Date | null | undefined;
}

export interface createFeaturePermission {
  parentType: ParentType;
  parentId: string;
  allowedFeatures?: string[];
}
