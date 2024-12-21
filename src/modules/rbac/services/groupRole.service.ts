import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { GroupRole } from "@/types/schema/groupRoleForm";

class GroupRoleService extends BaseService {
  private baseUrl = environment.apiUrl + "/groupRole";

  getAllGroupRoles() {
    return axiosInstance
      .get<GroupRole[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all GroupRoles", error);
        throw error;
      });
  }

  getTotalGroupRoles() {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching total GroupRoles", error);
        throw error;
      });
  }

  getGroupRoles(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching GroupRoles", error);
        throw error;
      });
  }

  getRoleById(id: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching GroupRoles", error);
        throw error;
      });
  }

  getRoleByUserId(id: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getByUserId`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching GroupRoles", error);
        throw error;
      });
  }

  getRoleByName(name: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getByName`, { name })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching GroupRoles", error);
        throw error;
      });
  }

  createRole(roleData: GroupRole) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, roleData)
      .catch((error) => {
        console.error("Error creating role", error);
        throw error;
      });
  }

  changeRole(role: String) {
    return axiosInstance
      .put<GroupRole>(`${this.baseUrl}/changeRole`, { role })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error changing role", error);
        throw error;
      });
  }

  updateRole( id: string,role: GroupRole) {
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

export default GroupRoleService;
