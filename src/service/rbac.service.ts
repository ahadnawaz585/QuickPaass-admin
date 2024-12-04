import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { Role } from "@/types/schema/role";

class AccessService extends BaseService {
  private baseUrl = environment.apiUrl + "/access";

  getUserGroups() {
    return axiosInstance
      .get<Role[]>(`${this.baseUrl}/getUserGroup`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching groups", error);
        throw error;
      });
  }

  getUserRoles() {
    return axiosInstance
      .get<paginatedData>(`${this.baseUrl}/getUserRole`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching roles", error);
        throw error;
      });
  }

  getPermission(id: string, feature: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/getPermission`, { id, feature })
      .catch((error) => {
        console.error("Error getting Permission", error);
        throw error;
      });
  }

  checkPermission(feature: string) {
    return axiosInstance
      .post<boolean>(`${this.baseUrl}/checkPermission`, { feature })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting Permission", error);
        throw error;
      });
  }
}

export default AccessService;
