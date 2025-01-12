import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { LeaveConfiguration } from "@/types/AMS/leave";

class LeaveConfigService extends BaseService {
  private baseUrl = environment.apiUrl + "/leave/leave-configurations";

  getAllLeaveConfigurations() {
    return axiosInstance
      .get<LeaveConfiguration[]>(`${this.baseUrl}/getAll`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all leave configurations", error);
        throw error;
      });
  }

  getLeaveConfigurations(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching leave configurations", error);
        throw error;
      });
  }

  getLeaveConfigurationById(id: string) {
    return axiosInstance
      .post<LeaveConfiguration>(`${this.baseUrl}/getById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching leave configuration by ID", error);
        throw error;
      });
  }

  createLeaveConfiguration(leaveConfigData: LeaveConfiguration) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, leaveConfigData)
      .catch((error) => {
        console.error("Error creating leave configuration", error);
        throw error;
      });
  }

  updateLeaveConfiguration(id: string, leaveConfigData: LeaveConfiguration) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id, data: leaveConfigData })
      .catch((error) => {
        console.error("Error updating leave configuration", error);
        throw error;
      });
  }

  deleteLeaveConfiguration(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting leave configuration", error);
        throw error;
      });
  }

  restoreLeaveConfiguration(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring leave configuration", error);
        throw error;
      });
  }
}

export default LeaveConfigService;
