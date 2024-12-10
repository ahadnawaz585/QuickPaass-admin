import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { UserRole } from "@/types/schema/role";

class UserRoleService extends BaseService {
  private baseUrl = environment.apiUrl + "/userRole";

  getAllUserRoles() {
    return axiosInstance
      .get<UserRole[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all UserRoles", error);
        throw error;
      });
  }

  getTotalUserRoles() {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching total UserRoles", error);
        throw error;
      });
  }

  getUserRoles(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching UserRoles", error);
        throw error;
      });
  }

  getRoleById(id: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching UserRoles", error);
        throw error;
      });
  }

  getRoleByUserId(id: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getByUserId`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching UserRoles", error);
        throw error;
      });
  }

  getRoleByName(name: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getByName`, { name })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching UserRoles", error);
        throw error;
      });
  }

  createRole(roleData: UserRole) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, roleData)
      .catch((error) => {
        console.error("Error creating role", error);
        throw error;
      });
  }

  changeRole(role: String) {
    return axiosInstance
      .put<UserRole>(`${this.baseUrl}/changeRole`, { role })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error changing role", error);
        throw error;
      });
  }

  updateRole( id: string,role: UserRole) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id, data: role })
      .catch((error) => {
        console.error("Error updating role", error);
        throw error;
      });
  }

  deleteRole(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting role", error);
        throw error;
      });
  }

  restoreRole(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring role", error);
        throw error;
      });
  }
}

export default UserRoleService;
