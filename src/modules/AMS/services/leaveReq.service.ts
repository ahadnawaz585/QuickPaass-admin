import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { LeaveRequest } from "@/types/AMS/leave";

class LeaveReqService extends BaseService {
  private baseUrl = environment.apiUrl + "/leave/leave-requests";

  getAllLeaveRequests() {
    return axiosInstance
      .get<LeaveRequest[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all leave requests", error);
        throw error;
      });
  }

  getLeaveRequests(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching leave requests", error);
        throw error;
      });
  }

  getLeaveRequestsByEmployeeId(employeeId: string) {
    return axiosInstance
      .post<LeaveRequest[]>(`${this.baseUrl}/getEmployee`, { employeeId })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching leave requests by employee ID", error);
        throw error;
      });
  }

  createLeaveRequest(leaveRequestData: LeaveRequest) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, leaveRequestData)
      .catch((error) => {
        console.error("Error creating leave request", error);
        throw error;
      });
  }

  updateLeaveRequest(id: string, leaveRequestData: LeaveRequest) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id, data: leaveRequestData })
      .catch((error) => {
        console.error("Error updating leave request", error);
        throw error;
      });
  }

  deleteLeaveRequest(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting leave request", error);
        throw error;
      });
  }

  restoreLeaveRequest(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring leave request", error);
        throw error;
      });
  }
}

export default LeaveReqService;
