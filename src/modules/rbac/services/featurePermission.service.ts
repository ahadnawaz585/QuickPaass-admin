import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { createFeaturePermission ,FeaturePermission} from "@/types/schema/featurePermission";

class FeaturePermissionService extends BaseService {
  private baseUrl = environment.apiUrl + "/featurePermission";

  getAllFeaturePermission() {
    return axiosInstance
      .get<FeaturePermission[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all permissions", error);
        throw error;
      });
  }

  getFeaturePermission(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching permissions", error);
        throw error;
      });
  }

  getAllowedFeatures(parentType:string,parentId:string):Promise<{id:string, allowedFeatures: string[] }> {
    return axiosInstance
      .post(`${this.baseUrl}/allowedFeatures`, { parentType,parentId })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching permissions", error);
        throw error;
      });
  }

  createFeaturePermission(permissionData: createFeaturePermission) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, permissionData)
      .catch((error) => {
        console.error("Error creating permissions", error);
        throw error;
      });
  }

  updateFeaturePermission( id: string,permission: createFeaturePermission) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id, data: permission })
      .catch((error) => {
        console.error("Error updating permissions", error);
        throw error;
      });
  }

  deleteAppFeature(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting permissions", error);
        throw error;
      });
  }

  restoreFeaturePermission(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring feature", error);
        throw error;
      });
  }
}

export default FeaturePermissionService;
