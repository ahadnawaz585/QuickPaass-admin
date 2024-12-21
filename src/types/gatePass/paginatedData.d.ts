import { GatePassItem } from "./schema";

export interface paginatedData {
  data: any;
  totalSize: number;
}

export type Item = {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  serialNos: string[];
};

interface ItemForm {
  itemId: string;
  quantity: number;
  serialNos: string[];
  isExpanded: boolean;
}

export type DetailedGatePassComponent = {
  customerid:string;
  gatepassid: string;
  customername: string;
  issuedAt: string;
  validUntil: string | null;
  status: "pending" | "approved" | "rejected";
  gatepassnotes: string | null;
  location: string;
  vehicleNo: string;
  storeIncharge: string;
  items: GatePassItem[];
};

export type DetailedGatePass = {
  customerid:string;
  gatepassid: string;
  customername: string;
  issuedAt: string;
  validUntil: string | null;
  status: "pending" | "approved" | "rejected";
  gatepassnotes: string | null;
  location: string;
  vehicleNo: string;
  storeIncharge: string;
  items: CreateGatePassItem[];
};

export interface CreateGatePassItem {
  id?:string;
  itemId: string;
  quantity: number;
  serialNos: string[];
}

export type FormGatePass = {
  gatepassid: string;
  customername: string;
  issuedAt: string;
  validUntil: string | null;
  status: "pending" | "approved" | "rejected";
  gatepassnotes: string | null;
  location: string;
  vehicleNo: string;
  storeIncharge: string;
  items: Item[];
};

export interface FrequentCustomer {
  id: string;
  name: string;
  _count: {
    gatePasses: number;
  };
}

export interface ReportData {
    month: string;
    count: number;
  }
