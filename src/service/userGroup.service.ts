import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { UserGroup } from "@/types/schema/userGroup";

class UserGroupService extends BaseService {
  private baseUrl = environment.apiUrl + "/userGroup";

  getAllUserGroups() {
    return axiosInstance
      .get<UserGroup[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all UserGroups", error);
        throw error;
      });
  }

  getTotalUserGroups() {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching total UserGroups", error);
        throw error;
      });
  }

  getUserGroups(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching UserGroups", error);
        throw error;
      });
  }

  getGroupById(id: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching UserGroups", error);
        throw error;
      });
  }

  getGroupByUserId(id: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getByUserId`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching UserGroups", error);
        throw error;
      });
  }

  getGroupByName(name: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getByName`, { name })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching UserGroups", error);
        throw error;
      });
  }

  createGroup(GroupData: UserGroup) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, GroupData)
      .catch((error) => {
        console.error("Error creating Group", error);
        throw error;
      });
  }

  changeGroup(Group: String) {
    return axiosInstance
      .put<UserGroup>(`${this.baseUrl}/changeGroup`, { Group })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error changing Group", error);
        throw error;
      });
  }

  updateGroup( id: string,Group: UserGroup) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id, data: Group })
      .catch((error) => {
        console.error("Error updating Group", error);
        throw error;
      });
  }

  deleteGroup(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting Group", error);
        throw error;
      });
  }

  restoreGroup(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring Group", error);
        throw error;
      });
  }
}

export default UserGroupService;
