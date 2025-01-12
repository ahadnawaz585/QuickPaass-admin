export enum LeaveStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
  }
  
  export interface LeaveRequest {
    id: string;
    employee: Employee; 
    employeeId: string;
    reason?: string;
    startDate: Date;
    endDate: Date;
    status: LeaveStatus; 
    image?: string; 
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: Date;
  }
  
  export interface LeaveConfiguration {
    id: string; 
    name: string; 
    description?: string; 
    maxDays: number; 
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: Date;
  }
  
  export interface LeaveAllocation {
    id: string; 
    employeeId: string;
    leaveConfigId?: string;
    assignedDays: number; 
    note?: string; 
    allocationStartDate: Date; // Added field for allocation start date
    allocationEndDate?: Date; // Added optional field for allocation end date
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: Date;
  }
  
  // Placeholder Employee interface (add fields as required)
  export interface Employee {
    id: string;
    name: string;
    // Add other fields as per your requirements
  }
  