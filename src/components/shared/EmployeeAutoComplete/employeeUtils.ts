import { Employee } from '@/types/AMS/employee';

export const getEmployeeLabel = (employee: Employee, searchType: 'name' | 'code'): string => {
  if (searchType === 'name') {
    return `${employee.name} ${employee.surname} (${employee.code})`;
  }
  return employee.code;
};

export const formatEmployeeDisplay = (employee: Employee, searchType: 'name' | 'code'): string => {
  return searchType === 'name'
    ? `${employee.name} ${employee.surname} (${employee.code})`
    : `${employee.code} - ${employee.name} ${employee.surname}`;
};