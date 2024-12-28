import React from 'react';
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
  const selectedEmployee = employees.find(emp => emp.id === value);

  return (
    <Autocomplete
      value={selectedEmployee || null}
      onChange={(_, newValue) => {
        onChange(newValue?.id || '');
      }}
      options={employees}
      getOptionLabel={(option) => getEmployeeLabel(option, searchType)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={searchType === 'name' ? "Search by Employee Name" : "Search by Employee Code"}
          fullWidth
          margin="normal"
          required
        />
      )}
      renderOption={(props, option) => (
        <EmployeeOption
          key={option.id}
          option={option}
          searchType={searchType}
          props={props}
        />
      )}
      isOptionEqualToValue={(option, value) => option.id === value.id}
    />
  );
};

export default EmployeeAutocomplete;