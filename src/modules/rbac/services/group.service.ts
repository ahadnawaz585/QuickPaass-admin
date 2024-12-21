import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { createGroup, Group } from "@/types/schema/group";

class GroupService extends BaseService {
  private baseUrl = environment.apiUrl + "/group";

  getAllGroups() {
    return axiosInstance
      .get<Group[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all Groups", error);
        throw error;
      });
  }

  getTotalGroups() {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching total Groups", error);
        throw error;
      });
  }

  getGroups(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching Groups", error);
        throw error;
      });
  }

  getGroupByName(name: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getByName`, { name })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching groups", error);
        throw error;
      });
  }

  getGroupById(id: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getGroupById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching group", error);
        throw error;
      });
  }

  getById(id: string) {
    return axiosInstance
      .post(`${this.baseUrl}/getById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching groups", error);
        throw error;
      });
  }

  createGroup(GroupData: createGroup) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, GroupData)
      .catch((error) => {
        console.error("Error creating Group", error);
        throw error;
      });
  }

  changeGroup(Group: String) {
    return axiosInstance
      .put<Group>(`${this.baseUrl}/changeGroup`, { Group })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error changing Group", error);
        throw error;
      });
  }

  updateGroup( id: string,Group: Group) {
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

  searchGroup(data: string[] | string, page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/search`, {
        searchTerm: data,
        page,
        pageSize,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error searching Group:", error);
        throw error;
      });
  }
}

export default GroupService;
