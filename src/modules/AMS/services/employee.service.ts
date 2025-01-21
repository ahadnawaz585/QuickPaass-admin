import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { Employee } from "@/types/AMS/employee";
import * as FileSaver from "file-saver";

class EmployeeService extends BaseService {
  private baseUrl = environment.apiUrl + "/employee";

  getAllEmployees() {
    return axiosInstance
      .get<Employee[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all employees", error);
        throw error;
      });
  }

  getAllFilterEmployees(filterParams: { [key: string]: any }) {
    return axiosInstance
      .get<Employee[]>(`${this.baseUrl}/get`, { params: filterParams })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching all employees", error);
        throw error;
      });
  }
  

  getTotalEmployees() {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching total employees", error);
        throw error;
      });
  }

  getEmployees(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching employees", error);
        throw error;
      });
  }

  getEmployeeById(id: string) {
    return axiosInstance
      .post<Employee>(`${this.baseUrl}/getById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching employee by ID", error);
        throw error;
      });
  }

  getEmployeeByCode(code: string) {
    return axiosInstance
      .post<Employee>(`${this.baseUrl}/getByCode`, { code })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching employee by ID", error);
        throw error;
      });
  }

  createEmployee(employeeData: Employee) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, employeeData)
      .catch((error) => {
        console.error("Error creating employee", error);
        throw error;
      });
  }

  updateEmployee(id: string, employeeData: Employee) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id, data: employeeData })
      .catch((error) => {
        console.error("Error updating employee", error);
        throw error;
      });
  }

  deleteEmployee(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting employee", error);
        throw error;
      });
  }

  restoreEmployee(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring employee", error);
        throw error;
      });
  }

  searchEmployees(searchTerm: string[], page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/search`, {
        searchTerm,
        page,
        pageSize,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error searching employees", error);
        throw error;
      });
  }

  getDeletedEmployees(page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/getDeleted`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching deleted employees", error);
        throw error;
      });
  }

  getFrequentEmployees() {
    return axiosInstance
      .get<Employee[]>(`${this.baseUrl}/getFrequent`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching frequent employees", error);
        throw error;
      });
  }

  // New methods for file management
  getFiles(employeeId: string) {
    return axiosInstance
      .post<{ fileName: string; filePath: string }[]>(`${this.baseUrl}/files`, {
        employeeId,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching files for employee", error);
        throw error;
      });
  }

  deleteFiles(employeeId: string, fileName: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/filesDel`, { employeeId, fileName })
      .catch((error) => {
        console.error("Error deleting file for employee", error);
        throw error;
      });
  }

  uploadFile(formData: FormData) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/updateFile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((error) => {
        console.error("Error uploading file for employee", error);
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

  generateExcel() {
    return axiosInstance
      .get(`${this.baseUrl}/getExcel`, { responseType: "blob" }) // Add responseType: 'blob'
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error generating Excel file:", error);
        throw error;
      });
  }
}

export default EmployeeService;
