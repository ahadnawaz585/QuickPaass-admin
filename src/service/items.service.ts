import { axiosInstance } from "../utils/header";
import { Item } from "@/types/app/schema";
import { paginatedData } from "../types/paginatedData";
import { BaseService } from "../utils/base.service";
import { environment } from "@/environment/environment";

class ItemService extends BaseService {
  // private baseUrl = apiUrl + "item";
  private baseUrl = environment.apiUrl + "/item";

  getItem(page: number, pageSize: number): Promise<paginatedData> {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, {
        page,
        pageSize,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting Item:", error);
        throw error;
      });
  }


  getTotalItem(): Promise<number> {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting all Item:", error);
        throw error;
      });
  }

  getDeletedItem(page: number, pageSize: number): Promise<paginatedData> {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/getDeleted`, {
        page,
        pageSize,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting Item:", error);
        throw error;
      });
  }

  getAllItem(): Promise<Item[]> {
    return axiosInstance
      .get<Item[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting all Item:", error);
        throw error;
      });
  }

  getOutOfStockItems(): Promise<Item[]> {
    return axiosInstance
      .get<Item[]>(`${this.baseUrl}/getOutOfStock`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting out of stock Item:", error);
        throw error;
      });
  }

  updateItem(updatedData: Item, id: string) {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id: id, data: updatedData })
      .catch((error) => {
        console.error("Error updating Item:", error);
        throw error;
      });
  }

  createItem(newData: Item) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, newData)
      .catch((error) => {
        console.error("Error creating Item:", error);
        throw error;
      });
  }

  retoreItem(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .catch((error) => {
        console.error("Error restoring Item:", error);
        throw error;
      });
  }

  deleteItem(id: string) {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .catch((error) => {
        console.error("Error deleting Item:", error);
        throw error;
      });
  }

  getItemById(id: string) {
    return axiosInstance
      .post<Item>(`${this.baseUrl}/getById`, { id })
      .catch((error) => {
        console.error("Error getting Item by id:", error);
        throw error;
      });
  }

  searchItems(searchTerm: string[], page: number, pageSize: number) {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/search`, {
        searchTerm,
        page,
        pageSize,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting item:", error);
        throw error;
      });
  }
}

export default ItemService;
