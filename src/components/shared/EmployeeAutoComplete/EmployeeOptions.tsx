import React from 'react';
import { Box, Typography } from '@mui/material';
import { Employee } from '@/types/AMS/employee';

interface EmployeeOptionProps {
  option: Employee;
  searchType: 'name' | 'code';
  props: React.HTMLAttributes<HTMLLIElement>;
}

const EmployeeOption: React.FC<EmployeeOptionProps> = ({ option, searchType, props }) => {
  const { key, ...otherProps }:any = props;
  
  return (
    <Box component="li" key={option.id} {...otherProps}>
      <Typography>
        {searchType === 'name' 
          ? `${option.name} ${option.surname} (${option.code})`
          : `${option.code} - ${option.name} ${option.surname}`
        }
      </Typography>
    </Box>
  );
};

export default EmployeeOption;