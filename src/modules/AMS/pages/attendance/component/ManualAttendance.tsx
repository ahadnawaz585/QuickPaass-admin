import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY'
}

import { Employee } from '@/types/AMS/employee';
import EmployeeService from '@/modules/AMS/services/employee.service';
import EmployeeAutocomplete from '@/components/shared/EmployeeAutoComplete/EmployeeAutoComplete';
import SearchTypeToggle from './SearchTypeToggle';

interface ManualAttendanceProps {
  onSubmit: (employeeId: string, status: AttendanceStatus, date: Date) => void;
}

const ManualAttendance: React.FC<ManualAttendanceProps> = ({ onSubmit }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
  const [dateTime, setDateTime] = useState<Dayjs>(dayjs());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchType, setSearchType] = useState<'name' | 'code'>('name');
  const [loading, setLoading] = useState(false);
  const service = new EmployeeService();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await service.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId && dateTime) {
      onSubmit(employeeId, status, dateTime.toDate());
      setEmployeeId('');
      setDateTime(dayjs());
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="manual-attendance">
      <SearchTypeToggle 
        searchType={searchType}
        onSearchTypeChange={setSearchType}
      />
      
      <EmployeeAutocomplete
        employees={employees}
        value={employeeId}
        onChange={setEmployeeId}
        searchType={searchType}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={(e: SelectChangeEvent) =>
            setStatus(e.target.value as AttendanceStatus)
          }
          required
        >
          <MenuItem value={AttendanceStatus.PRESENT}>Present</MenuItem>
          <MenuItem value={AttendanceStatus.ABSENT}>Absent</MenuItem>
          <MenuItem value={AttendanceStatus.LATE}>Late</MenuItem>
          <MenuItem value={AttendanceStatus.HALF_DAY}>Half Day</MenuItem>
        </Select>
      </FormControl>

      <DateTimePicker
        label="Date & Time"
        value={dateTime}
        onChange={(newValue) => newValue && setDateTime(newValue)}
        slotProps={{
          textField: {
            fullWidth: true,
            margin: "normal",
            required: true
          }
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading || !employeeId}
      >
        Mark Attendance
      </Button>
    </Box>
  );
};

export default ManualAttendance;