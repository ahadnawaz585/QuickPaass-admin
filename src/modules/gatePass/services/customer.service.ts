import { axiosInstance } from "../../../utils/header";
import { Customer } from "@/types/gatePass/schema";
import { FrequentCustomer, paginatedData } from "@/types/gatePass/paginatedData";
import { BaseService } from "../../../utils/base.service";
import { environment } from "@/environment/environment";

class CustomerService extends BaseService {
  private baseUrl = environment.apiUrl + "/customer";

  getCustomer(page: number, pageSize: number): Promise<paginatedData> {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, {
        page,
        pageSize,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting customer:", error);
        throw error;
      });
  }

  getDeletedCustomer(page: number, pageSize: number): Promise<paginatedData> {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/getDeleted`, {
        page,
        pageSize,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting customer:", error);
        throw error;
      });
  }

  getAllCustomer(): Promise<Customer[]> {
    return axiosInstance
      .get<Customer[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting all customer:", error);
        throw error;
      });
  }

  getFrequentCustomer(): Promise<FrequentCustomer[]> {
    return axiosInstance
      .get<FrequentCustomer[]>(`${this.baseUrl}/getFrequent`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting all customer:", error);
        throw error;
      });
  }

  getTotalCustomer(): Promise<number> {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting total customer:", error);
        throw error;
      });
  }


  updateCustomer(updatedData: Customer, id: string) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id: id, data: updatedData })
      .catch((error) => {
        console.error("Error updating customer:", error);
        throw error;
      });
  }

  createCustomer(newData: Customer) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, newData)
      .catch((error) => {
        console.error("Error creating customer:", error);
        throw error;
      });
  }

  retoreCustomer(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring customer:", error);
        throw error;
      });
  }

  deleteCustomer(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting customer:", error);
        throw error;
      });
  }

  getCustomerById(id: string):Promise<Customer>{
    return axiosInstance
      .post<Customer>(`${this.baseUrl}/getById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting customer by id:", error);
        throw error;
      });
  }

  searchCustomers(searchTerm: string[], page: number, pageSize: number) {
      return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/search`, { searchTerm, page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting customer:", error);
        throw error;
      });
  }
}

export default CustomerService;
