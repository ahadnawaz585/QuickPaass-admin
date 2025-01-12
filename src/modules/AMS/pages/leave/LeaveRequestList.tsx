"use client"
import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import styles from './styles/LeaveManagement.module.scss';
import LeaveReqService from '../../services/leaveReq.service';
import EmployeeService from '../../services/employee.service';
enum LeaveStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

interface LeaveRequest {
    id: string;
    employee: Employee;
    employeeId: string;
    reason?: string;
    startDate: Date;
    endDate: Date;
    status: LeaveStatus;
    image?: string;
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: Date;
}

import { Employee } from '@/types/AMS/employee';
import { formatTime } from '@/utils/date';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
const leaveReqService = new LeaveReqService();
const employeeService = new EmployeeService();
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs, { Dayjs } from "dayjs";
import EmployeeAutocomplete from '@/components/shared/EmployeeAutoComplete/EmployeeAutoComplete';

// Extend Day.js with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const LeaveRequestList = () => {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<any>>({
        employeeId: '',
        reason: '',
        startDate: dayjs().tz("Asia/Karachi"),
        endDate: dayjs().tz("Asia/Karachi"),
        status: LeaveStatus.PENDING,
    });
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [reqsData, empsData] = await Promise.all([
                leaveReqService.getAllLeaveRequests(),
                employeeService.getAllFilterEmployees({ filter: true })
            ]);

            // Enhance requests with employee names for better filtering
            const enhancedRequests = reqsData.map(req => {
                const employee = empsData.find(e => e.id === req.employeeId);
                return {
                    ...req,
                    employeeName: employee?.name || 'N/A',
                    employee: employee || {} as Employee, // Ensure `employee` is populated properly
                };
            });


            setRequests(enhancedRequests);
            setEmployees(empsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (request?: LeaveRequest) => {
        if (request) {
            setFormData({
                employeeId: request.employeeId,
                reason: request.reason,
                startDate: dayjs(request.startDate),
                endDate: dayjs(request.endDate),
                status: request.status,
                location: request.location,
            });
            setEditId(request.id);
        } else {
            setFormData({
                employeeId: '',
                reason: '',
                startDate: dayjs().tz("Asia/Karachi"),
                endDate: dayjs().tz("Asia/Karachi"),
                status: LeaveStatus.PENDING,
                location: '',
            });
            setEditId(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({});
        setEditId(null);
    };

    const handleSubmit = async () => {
        try {
            formData.startDate = formData.startDate.toDate();
            formData.endDate = formData.endDate.toDate();
            if (editId) {
                await leaveReqService.updateLeaveRequest(editId, formData as LeaveRequest);
            } else {
                await leaveReqService.createLeaveRequest(formData as LeaveRequest);
            }
            handleClose();
            loadData();
        } catch (error) {
            console.error('Error saving request:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await leaveReqService.deleteLeaveRequest(id);
            loadData();
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    };

    const handleStatusChange = async (id: string, status: LeaveStatus) => {
        try {
            const request = requests.find(r => r.id === id);
            if (request) {
                await leaveReqService.updateLeaveRequest(id, { ...request, status });
                loadData();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusChipColor = (status: LeaveStatus) => {
        switch (status) {
            case LeaveStatus.PENDING:
                return 'warning';
            case LeaveStatus.APPROVED:
                return 'success';
            case LeaveStatus.REJECTED:
                return 'error';
            default:
                return 'default';
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'employeeName',
            headerName: 'Employee',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            // type: 'date',
            width: 130,
            renderCell: (params) => formatTime(params.value),
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            // type: 'date',
            width: 130,
            renderCell: (params) => formatTime(params.value),
        },
        {
            field: 'reason',
            headerName: 'Reason',
            flex: 1,
            minWidth: 200,
        },
        {
            field: 'location',
            headerName: 'Location',
            width: 150,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={getStatusChipColor(params.value)}
                    size="small"
                />
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            getActions: (params) => [
                ...(params.row.status === LeaveStatus.PENDING ? [
                    <GridActionsCellItem
                        icon={<CheckIcon color="success" />}
                        label="Approve"
                        onClick={() => handleStatusChange(params.row.id, LeaveStatus.APPROVED)}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        icon={<CloseIcon color="error" />}
                        label="Reject"
                        onClick={() => handleStatusChange(params.row.id, LeaveStatus.REJECTED)}
                        showInMenu
                    />,
                ] : []),
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleOpen(params.row)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDelete(params.row.id)}
                />,
            ],
        },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Leave Requests</h2>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        New Request
                    </Button>
                </div>

                <div className={styles.dataGridContainer}>
                    <DataGrid
                        rows={requests}
                        columns={columns}
                        loading={loading}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                            sorting: {
                                sortModel: [{ field: 'startDate', sort: 'desc' }],
                            },
                            filter: {
                                filterModel: {
                                    items: [{ field: 'status', operator: 'equals', value: LeaveStatus.PENDING }],
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25, 50]}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                            },
                        }}
                        disableRowSelectionOnClick
                        autoHeight
                    />
                </div>

                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle>{editId ? 'Edit Request' : 'New Request'}</DialogTitle>
                    <DialogContent>
                        <div className={styles.formContainer}>
                            {/* <FormControl fullWidth margin="normal">
                            <InputLabel>Employee</InputLabel>
                            <Select
                                value={formData.employeeId}
                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                required
                            >
                                {employees.map((emp) => (
                                    <MenuItem key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}

                            <EmployeeAutocomplete
                                employees={employees}
                                value={formData.employeeId}
                                onChange={(employeeId:string) => setFormData({ ...formData, employeeId })}
                                searchType="name" // or "code", depending on your search preference
                            />

                            <div className={styles.dateFields}>
                                <DatePicker
                                    label="Start Date"
                                    value={formData.startDate}
                                    onChange={(date) => setFormData({ ...formData, startDate: date || new Date() })}
                                    className={styles.dateField}
                                    views={['day', 'month', 'year']}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: { fullWidth: true, required: true },
                                    }}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={formData.endDate}
                                    views={['day', 'month', 'year']}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: { fullWidth: true, required: true },
                                    }}
                                    onChange={(date) => setFormData({ ...formData, endDate: date || new Date() })}
                                    className={styles.dateField}
                                />
                            </div>

                            <TextField
                                label="Reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                fullWidth
                                multiline
                                rows={3}
                                margin="normal"
                                required
                            />

                            <TextField
                                label="Location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                fullWidth
                                margin="normal"
                            />

                            {editId && (
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as LeaveStatus })}
                                    >
                                        {Object.values(LeaveStatus).map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={!formData.employeeId || !formData.reason}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </LocalizationProvider>
    );
};