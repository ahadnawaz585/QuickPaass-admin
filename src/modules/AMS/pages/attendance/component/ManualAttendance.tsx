import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LATE = 'LATE',
    HALF_DAY = 'HALF_DAY'
  }
import dayjs from 'dayjs';

interface ManualAttendanceProps {
  onSubmit: (employeeId: string, status: AttendanceStatus, date: Date) => void;
}

const ManualAttendance: React.FC<ManualAttendanceProps> = ({ onSubmit }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId && date) {
      onSubmit(employeeId, status, new Date(date));
      setEmployeeId('');
      setDate(dayjs().format('YYYY-MM-DD'));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="manual-attendance">
      <TextField
        fullWidth
        label="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={(e: SelectChangeEvent) => 
            setStatus(e.target.value as AttendanceStatus)
          }
        >
          <MenuItem value={AttendanceStatus.PRESENT}>Present</MenuItem>
          <MenuItem value={AttendanceStatus.ABSENT}>Absent</MenuItem>
          <MenuItem value={AttendanceStatus.LATE}>Late</MenuItem>
          <MenuItem value={AttendanceStatus.HALF_DAY}>Half Day</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Mark Attendance
      </Button>
    </Box>
  );
};

export default ManualAttendance;
