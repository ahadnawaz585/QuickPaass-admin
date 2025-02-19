import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { LeaveAllocation } from "@/types/AMS/leave";

class LeaveAllocService extends BaseService {
  private baseUrl = environment.apiUrl + "/leave/leave-allocations";

  getAllLeaveAllocations() {
    return axiosInstance
      .get<LeaveAllocation[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all leave allocations", error);
        throw error;
      });
  }

  getAllLeaveAllocationsByEmployeeId(employeeId:string) {
    return axiosInstance
      .post<LeaveAllocation[]>(`${this.baseUrl}/getByEmployeeId`,{employeeId})
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all leave allocations", error);
        throw error;
      });
  }

  getLeaveAllocations(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching leave allocations", error);
        throw error;
      });
  }

  createLeaveAllocation(leaveAllocData: LeaveAllocation) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, leaveAllocData)
      .catch((error) => {
        console.error("Error creating leave allocation", error);
        throw error;
      });
  }

  updateLeaveAllocation(id: string, leaveAllocData: LeaveAllocation) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id, data: leaveAllocData })
      .catch((error) => {
        console.error("Error updating leave allocation", error);
        throw error;
      });
  }

  deleteLeaveAllocation(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting leave allocation", error);
        throw error;
      });
  }

  restoreLeaveAllocation(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring leave allocation", error);
        throw error;
      });
  }
}

export default LeaveAllocService;
