import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Employee } from '@/types/AMS/employee';
import EmployeeOption from './EmployeeOptions';
import { getEmployeeLabel } from './employeeUtils';

interface EmployeeAutocompleteProps {
  employees: Employee[];
  value: string;
  onChange: (employeeId: string) => void;
  searchType: 'name' | 'code';
}

const EmployeeAutocomplete: React.FC<EmployeeAutocompleteProps> = ({
  employees,
  value,
  onChange,
  searchType,
}) => {
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = employees.filter((emp) =>
        searchType === 'name'
          ? emp.name.toLowerCase().includes(searchQuery.toLowerCase())
          : emp.code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }, 300); // Adjust debounce delay (e.g., 300ms)

    return () => clearTimeout(timeoutId);
  }, [searchQuery, employees, searchType]);

  const selectedEmployee = employees.find((emp) => emp.id === value);

  return (
    <Autocomplete
      value={selectedEmployee || null}
      onChange={(_, newValue) => onChange(newValue?.id || '')}
      options={filteredEmployees}
      getOptionLabel={(option) => getEmployeeLabel(option, searchType)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={searchType === 'name' ? 'Search by Employee Name' : 'Search by Employee Code'}
          fullWidth
          margin="normal"
          required
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}
      renderOption={(props, option) => (
        <EmployeeOption key={option.id} option={option} searchType={searchType} props={props} />
      )}
      isOptionEqualToValue={(option, value) => option.id === value.id}
    />
  );
};

export default EmployeeAutocomplete;
