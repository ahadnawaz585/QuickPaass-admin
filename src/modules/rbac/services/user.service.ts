import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { User,UserCreateData, } from "@/types/schema/user";

class UserService extends BaseService {
  private baseUrl = environment.apiUrl + "/user";

  getAlluser() {
    return axiosInstance
      .get<User[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all users", error);
        throw error;
      });
  }

  getNonAssociatedUsers() {
    return axiosInstance
      .get<User[]>(`${this.baseUrl}/getNonAssociatedUsers`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all users", error);
        throw error;
      });
  }

  

  getUsers(page: number, pageSize: number): Promise<paginatedData> {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, {
        page,
        pageSize,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting users:", error);
        throw error;
      });
  }

  getTotalUser() {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching total users", error);
        throw error;
      });
  }

  getuser(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching users", error);
        throw error;
      });
  }

  getById(id: string) {
    return axiosInstance
      .post<UserCreateData>(`${this.baseUrl}/getById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching users", error);
        throw error;
      });
  }

  getLoggedInUserDetial(): Promise<string> {
    return axiosInstance
      .get<string>(`${this.baseUrl}/getLoggedInUser`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching users", error);
        throw error;
      });
  }

  checkPreviousPassword(password: string): Promise<boolean> {
    return axiosInstance
      .post<boolean>(`${this.baseUrl}/checkPassword`, { password })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error checking password", error);
        throw error;
      });
  }

  changePassword(password: string) {
    return axiosInstance
      .post(`${this.baseUrl}/changePassword`, { password })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error checking password", error);
        throw error;
      });
  }

  changeCompany(userId: string, companyId: string) {
    return axiosInstance
      .post(`${this.baseUrl}/changeCompany`, {
        userId,
        companyId,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error checking password", error);
        throw error;
      });
  }

  changeUserPassword(userId: string, password: string) {
    return axiosInstance
      .post(`${this.baseUrl}/changeUserPassword`, { userId, password })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error checking password", error);
        throw error;
      });
  }

  getDetailedUserById(id: string) {
    return axiosInstance
      .post<UserCreateData>(`${this.baseUrl}/getDetaileUserById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching user", error);
        throw error;
      });
  }

  createuser(userData: UserCreateData) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, userData)
      .catch((error) => {
        console.error("Error creating user", error);
        throw error;
      });
  }

  updateuser(id: string, user: UserCreateData) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id, data: user })
      .catch((error) => {
        console.error("Error updating user", error);
        throw error;
      });
  }

  deleteuser(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting user", error);
        throw error;
      });
  }

  restoreuser(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring user", error);
        throw error;
      });
  }

  searchUser(data: string[] | string, page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/search`, {
        searchTerm: data,
        page,
        pageSize,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error searching user:", error);
        throw error;
      });
  }
}

export default UserService;
