import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { createRole, Role } from '@/types/schema/role'

class RoleService extends BaseService {
  private baseUrl = environment.apiUrl + "/role";

  getAllRoles() {
    return axiosInstance
      .get<Role[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all roles", error);
        throw error;
      });
  }

  getTotalRoles() {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching total roles", error);
        throw error;
      });
  }

  getRoles(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching roles", error);
        throw error;
      });
  }

  getById(id: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching Roles", error);
        throw error;
      });
  }

  getRoleById(id: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getRoleById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching Roles", error);
        throw error;
      });
  }

  getRoleByName(name: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getByName`, { name })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching roles", error);
        throw error;
      });
  }

  createRole(roleData: createRole) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, roleData)
      .catch((error) => {
        console.error("Error creating role", error);
        throw error;
      });
  }

  changeRole(role: String) {
    return axiosInstance
      .put<Role>(`${this.baseUrl}/changeRole`, { role })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error changing role", error);
        throw error;
      });
  }

  updateRole( id: string,role: createRole) {
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

  searchRole(data: string[] | string, page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/search`, {
        searchTerm: data,
        page,
        pageSize,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error searching role:", error);
        throw error;
      });
  }
}

export default RoleService;
