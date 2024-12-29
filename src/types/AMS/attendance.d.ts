export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  ON_LEAVE ='ON_LEAVE'
}

export interface Attendance {
  id?: string;
  employeeId: string;
  date: Date;
  status: AttendanceStatus;
  checkIn?: any;
  checkOut?: any;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: Date;
}