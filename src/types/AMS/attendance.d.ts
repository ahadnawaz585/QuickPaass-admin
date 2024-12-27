export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY'
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