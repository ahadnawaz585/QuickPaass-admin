import { axiosInstance } from "@/utils/header";
import { BaseService } from "@/utils/base.service";
import { paginatedData } from "@/types/paginatedData";
import { environment } from "@/environment/environment";
import { Employee } from "@/types/AMS/employee";

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

  searchEmployees(searchTerm: string, page: number, pageSize: number) {
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
}

export default EmployeeService;
