import { Status } from "../enums/schema";
export interface Customer {
    id?: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    isDeleted?: Date | null;
  }
  
  export interface Item {
    id?: string;
    name: string;
    description?: string | null;
    quantity?: number | null;
    unitPrice?: number | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    isDeleted?: Date | null;
  }


  
  export interface GatePass {
    id?: string;
    customerId: string;
    status: Status;
    notes?: string | null;
    location: string;
    vehicleNo: string;
    storeIncharge: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    isDeleted?: Date | null;
  }
  
  export interface GatePassItem {
    id?: string;
    gatePassId: string;
    itemId: string;
    quantity: number;
    serialNos: string[];
    createdAt?: Date | null;
    updatedAt?: Date | null;
    isDeleted?: Date | null;
  }
  

  