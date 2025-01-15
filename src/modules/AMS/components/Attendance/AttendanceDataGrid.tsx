import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { formatDate, formatTime } from "@/utils/date";
import CustomNoRowsOverlay from "../../../../components/shared/table/CustomNoRow";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Search, Close } from "@mui/icons-material";
import "./AttendanceDataGrid.scss";

export interface Attendance {
  id?: string;
  employeeId: string;
  date: Date;
  status: string;
  checkIn?: Date | null;
  checkOut?: Date | null;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date | undefined;
  isDeleted?: Date | undefined;
  employeeName: string;
  employeeSurname: string;
  designation: string;
}

type AttendanceDataGridProps = {
  attendances: Attendance[];
  showExtras?: boolean
  onRowClick: (params: any) => void;
  onDateRangeChange: (fromDate: Date | null, toDate: Date | null) => void; // Parent callback for date change
};

const AttendanceDataGrid: React.FC<AttendanceDataGridProps> = ({
  attendances,
  onRowClick,
  showExtras = true,
  onDateRangeChange,
}) => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  // Notify parent about the date range change
  // useEffect(() => {
  //   onDateRangeChange(fromDate, toDate);
  // }, [fromDate, toDate]);
  let columns: GridColDef[] = []; // Initialize the columns array

  if (showExtras) {
    columns.push(
      { field: "code", headerName: "Employee Code", width: 180 },
      { field: "employeeName", headerName: "First Name", width: 150 },
      { field: "employeeSurname", headerName: "Last Name", width: 150 },
      { field: "designation", headerName: "Designation", width: 150 },

    );
  }
  
  // Always push these columns regardless of `showExtras`
  columns.push(
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "date",
      headerName: "Date",
      width: 130,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "checkIn",
      headerName: "Check In",
      width: 130,
      renderCell: (params) => formatTime(params.value),
    },
    {
      field: "checkOut",
      headerName: "Check Out",
      width: 130,
      renderCell: (params) => formatTime(params.value),
    }
  );
  
  

  const handleDiscardFilters = () => {
    setFromDate(null);
    setToDate(null);
    onDateRangeChange(null, null);
  };

  return (
    <div>
      {/* Accordion for Date Range and Buttons */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div>Filters</div>
        </AccordionSummary>
        <AccordionDetails>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="row">
              <div className="datePicker">
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  views={["day", "month", "year"]} // Allow selecting day, month, and year
                  onChange={(newValue) => setFromDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true,
                    },
                  }}
                />
                <DatePicker
                  label="To Date"
                  value={toDate}
                  views={["day", "month", "year"]} // Allow selecting day, month, and year
                  onChange={(newValue) => setToDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true,
                    },
                  }}
                />
                <div className="buttons">
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={() => onDateRangeChange(fromDate, toDate)}
                  >
                    <Search color="primary" fontSize="small" />
                    Search
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={handleDiscardFilters}
                  >
                    <Close color="secondary" fontSize="small" />
                    Discard
                  </Button>
                </div>
              </div>
            </div>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>

      {/* Data Grid */}
      <div >
        <DataGrid
          rows={attendances}
          columns={columns}
          onRowClick={onRowClick}
          slotProps={{
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
          },
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          checkboxSelection
          keepNonExistentRowsSelected
          slots={{ noRowsOverlay: CustomNoRowsOverlay, toolbar: GridToolbar }}
          autoHeight
          initialState={{
            density: "compact",
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
        />
      </div>
    </div>
  );
};

export default AttendanceDataGrid;
