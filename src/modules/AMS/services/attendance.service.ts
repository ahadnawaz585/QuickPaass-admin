import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { Attendance} from "@/types/AMS/attendance";
import { AttendanceStatus } from "../pages/attendance/component/ManualAttendance";

class AttendanceService extends BaseService {
  private baseUrl = environment.apiUrl + "/attendance";

  getAllAttendances() {
    return axiosInstance
      .get<Attendance[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all Attendances", error);
        throw error;
      });
  }

  getTotalAttendances() {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching total Attendances", error);
        throw error;
      });
  }

  getAttendances(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching Attendances", error);
        throw error;
      });
  }

  getAttendanceById(id: string) {
    return axiosInstance
      .post<Attendance>(`${this.baseUrl}/getById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching Attendance by ID", error);
        throw error;
      });
  }

  createAttendance(AttendanceData: Attendance) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, AttendanceData)
      .catch((error) => {
        console.error("Error creating Attendance", error);
        throw error;
      });
  }


  checkAttendance(employeeId:string,status:AttendanceStatus){
    return axiosInstance
    .post<void>(`${this.baseUrl}/checkAttendance`, {employeeId,status})
    .catch((error) => {
      console.error("Error checking Attendance", error);
      throw error;
    });
  }

  markAttendance(AttendanceData: Attendance){
    return axiosInstance
    .post<void>(`${this.baseUrl}/markAttendance`, AttendanceData)
    .catch((error) => {
      console.error("Error marking Attendance", error);
      throw error;
    });
  }

  updateAttendance(id: string, AttendanceData: Attendance) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id, data: AttendanceData })
      .catch((error) => {
        console.error("Error updating Attendance", error);
        throw error;
      });
  }

  deleteAttendance(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting Attendance", error);
        throw error;
      });
  }

  restoreAttendance(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring Attendance", error);
        throw error;
      });
  }

  searchAttendances(searchTerm: string[], page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/search`, {
        searchTerm,
        page,
        pageSize,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error searching Attendances", error);
        throw error;
      });
  }

  getDeletedAttendances(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/getDeleted`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching deleted Attendances", error);
        throw error;
      });
  }

  generatePDF(id: string): Promise<Blob> {
    return axiosInstance
      .post(`${this.baseUrl}/getCard`, { id }, { responseType: "blob" })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error generating PDF:", error);
        throw error;
      });
  }
}

export default AttendanceService;
