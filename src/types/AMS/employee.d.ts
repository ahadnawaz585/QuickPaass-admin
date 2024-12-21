export interface Employee {
    id: string;
    name: string;
    surname: string;
    address: string;
    joiningDate: Date;
    bloodGroup: string;
    company: Company;
    imagePath?: string;
    code: string;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: Date;
  }
  