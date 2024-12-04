import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { AppFeature } from "@/types/schema/appFeature";

class AppFeatureService extends BaseService {
  private baseUrl = environment.apiUrl + "/appFeature";

  getAllAppFeature() {
    return axiosInstance
      .get<AppFeature[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all features", error);
        throw error;
      });
  }

  getTotalAppFeature() {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching total features", error);
        throw error;
      });
  }

  getAppFeature(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching features", error);
        throw error;
      });
  }

  getAppFeatureByParent(parent: string):Promise<AppFeature[]> {
    return axiosInstance
      .post<AppFeature[]>(`${this.baseUrl}/getByParent`, { parent })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching features", error);
        throw error;
      });
  }

  createAppFeature(featureData: AppFeature) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, featureData)
      .catch((error) => {
        console.error("Error creating feature", error);
        throw error;
      });
  }

  updateAppFeature(feature: AppFeature, id: string) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id, data: feature })
      .catch((error) => {
        console.error("Error updating feature", error);
        throw error;
      });
  }

  deleteAppFeature(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting feature", error);
        throw error;
      });
  }

  restoreAppFeature(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring feature", error);
        throw error;
      });
  }
}

export default AppFeatureService;
