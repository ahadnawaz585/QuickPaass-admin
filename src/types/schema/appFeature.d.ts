export interface AppFeature {
    name: string;
    parentFeatureId?: string;
    label:string;
    childs?: AppFeature[];
    createdAt?: Date | null | undefined;
    updatedAt?: Date | null | undefined;
    isDeleted?: Date | null | undefined;
  }


  
  export interface Feature {
    label: string;
    childs: AppFeature[];
  }
  
  