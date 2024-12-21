import { axiosInstance } from "../../../utils/header";
import { GatePass } from "@/types/gatePass/schema";
import { CreateGatePassItem, DetailedGatePass, paginatedData, ReportData } from "@/types/gatePass/paginatedData";
import { BaseService } from "../../../utils/base.service";
import { environment } from "@/environment/environment";
import { Status } from "@/enums/enum";

class GatePassService extends BaseService {
  // private baseUrl = environment.apiUrl + "/GatePass";
  private baseUrl = environment.apiUrl + "/GatePass";

  getGatePass(page: number, pageSize: number): Promise<paginatedData> {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/get`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting GatePass:", error);
        throw error;
      });
  }

  getDeletedGatePass(page: number, pageSize: number): Promise<paginatedData> {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/getDeleted`, { page, pageSize })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting GatePass:", error);
        throw error;
      });
  }

  getDatedGatePass(page: number, pageSize: number, from: Date, to: Date): Promise<paginatedData> {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/date`, { page, pageSize, from, to })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting dated GatePass:", error);
        throw error;
      });
  }

  getTotalGatePass(): Promise<number> {
    return axiosInstance
      .get<number>(`${this.baseUrl}/total`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting all GatePass:", error);
        throw error;
      });
  }

  getStatusGatePass(page: number, pageSize: number, status: Status): Promise<paginatedData> {
    return axiosInstance
      .post<paginatedData>(`${this.baseUrl}/status`, { page, pageSize, status })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting status GatePass:", error);
        throw error;
      });
  }

  getAllGatePass(): Promise<GatePass[]> {
    return axiosInstance
      .get<GatePass[]>(`${this.baseUrl}/get`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting all GatePass:", error);
        throw error;
      });
  }

  getGatePassReport(): Promise<ReportData[]> {
    return axiosInstance
      .get<ReportData[]>(`${this.baseUrl}/report`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting all GatePass:", error);
        throw error;
      });
  }

  updateGatePass( id: string,GatePass:GatePass, GatePassItem:CreateGatePassItem[]): Promise<void> {
    return axiosInstance
      .put<void>(`${this.baseUrl}/update`, { id, GatePass, GatePassItem })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error updating GatePass:", error);
        throw error;
      });
  }

  createGatePass(GatePass: GatePass,GatePassItem:CreateGatePassItem[]): Promise<void> {
    return axiosInstance
      .post<void>(`${this.baseUrl}/create`, {GatePass,GatePassItem})
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error creating GatePass:", error);
        throw error;
      });
  }

  restoreGatePass(id: string): Promise<void> {
    return axiosInstance
      .post<void>(`${this.baseUrl}/restore`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error restoring GatePass:", error);
        throw error;
      });
  }

  async approveGatePass(id: string): Promise<any> {
    try {
        const response = await axiosInstance.post<any>(`${this.baseUrl}/approve`, { id });
        //console.log("respose",response);
        //console.log("data",response.data);
        return response.data;
    } catch (error) {
        console.error("Error approving GatePass:", error);
        throw new Error("Failed to approve GatePass. Please try again later.");
    }
}


  printGatePass(id: string): Promise<Blob> {
    return axiosInstance
      .post(`${this.baseUrl}/pdf`, { id }, { responseType: "blob" })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error generating PDF:", error);
        throw error;
      });
  }

  deleteGatePass(id: string): Promise<void> {
    return axiosInstance
      .post<void>(`${this.baseUrl}/delete`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error deleting GatePass:", error);
        throw error;
      });
  }

  getGatePassById(id: string): Promise<DetailedGatePass> {
    return axiosInstance
      .post<DetailedGatePass>(`${this.baseUrl}/getById`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting GatePass by id:", error);
        throw error;
      });
  }

  getGatePassByCustomerId(id: string): Promise<DetailedGatePass[]> {
    return axiosInstance
      .post<DetailedGatePass[]>(`${this.baseUrl}/customerId`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting GatePass by id:", error);
        throw error;
      });
  }

  getGatePassByItemId(id: string): Promise<DetailedGatePass[]> {
    return axiosInstance
      .post<DetailedGatePass[]>(`${this.baseUrl}/itemId`, { id })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error getting GatePass by id:", error);
        throw error;
      });
  }
}

export default GatePassService;
