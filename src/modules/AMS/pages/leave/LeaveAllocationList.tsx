"use client"
import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import EmployeeAutocomplete from '@/components/shared/EmployeeAutoComplete/EmployeeAutoComplete';
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { LeaveAnalytics } from './components/LeaveAnalytics';
import styles from './styles/LeaveAllocationList.module.scss';
import LeaveAllocService from '../../services/leaveAlloc.service';
import EmployeeService from '../../services/employee.service';
import LeaveConfigService from '../../services/leaveConfig.service';
import { LeaveAllocation, LeaveConfiguration } from '@/types/AMS/leave';
import { Employee } from '@/types/AMS/employee';
import { formatDate } from '@/utils/date';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

// Extend Day.js with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const leaveAllocService = new LeaveAllocService();
const employeeService = new EmployeeService();
const leaveConfigService = new LeaveConfigService();

const initialFormData = {
    employeeId: '',
    leaveConfigId: '',
    assignedDays: 0,
    note: '',
    allocationStartDate: dayjs().tz("Asia/Karachi"),
    allocationEndDate: dayjs().tz("Asia/Karachi"),
};

export const LeaveAllocationList = () => {
    const [allocations, setAllocations] = useState<LeaveAllocation[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [configs, setConfigs] = useState<LeaveConfiguration[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<any>>(initialFormData);
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    // Calculate end date based on start date and assigned days
    useEffect(() => {
        if (formData.allocationStartDate && formData.assignedDays > 0) {
            const endDate = dayjs(formData.allocationStartDate).add(formData.assignedDays - 1, 'days');
            setFormData(prev => ({
                ...prev,
                allocationEndDate: endDate
            }));
        }
    }, [formData.allocationStartDate, formData.assignedDays]);

    // Update dates and assigned days when leave type changes
    useEffect(() => {
        if (formData.leaveConfigId) {
            const selectedConfig = configs.find(config => config.id === formData.leaveConfigId);
            if (selectedConfig) {
                const startDate = dayjs().tz("Asia/Karachi");
                const assignedDays = selectedConfig.maxDays || 0;
                const endDate = startDate.add(assignedDays - 1, 'days');
                
                setFormData(prev => ({
                    ...prev,
                    assignedDays,
                    allocationStartDate: startDate,
                    allocationEndDate: endDate
                }));
            }
        }
    }, [formData.leaveConfigId, configs]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [allocsData, empsData, configsData] = await Promise.all([
                leaveAllocService.getAllLeaveAllocations(),
                employeeService.getAllFilterEmployees({ filter: true }),
                leaveConfigService.getAllLeaveConfigurations(),
            ]);

            const enhancedAllocations = allocsData.map(alloc => ({
                ...alloc,
                employeeName: empsData.find(e => e.id === alloc.employeeId)?.name || 'N/A',
                configName: configsData.find(c => c.id === alloc.leaveConfigId)?.name || 'N/A'
            }));

            setAllocations(enhancedAllocations);
            setEmployees(empsData);
            setConfigs(configsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (allocation?: LeaveAllocation) => {
        if (allocation) {
            setFormData({
                employeeId: allocation.employeeId || '',
                leaveConfigId: allocation.leaveConfigId || '',
                assignedDays: allocation.assignedDays || 0,
                note: allocation.note || '',
                allocationStartDate: dayjs(allocation.allocationStartDate),
                allocationEndDate: allocation.allocationEndDate ? dayjs(allocation.allocationEndDate) : dayjs().tz("Asia/Karachi"),
            });
            setEditId(allocation.id);
        } else {
            setFormData(initialFormData);
            setEditId(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData(initialFormData);
        setEditId(null);
    };

    const handleSubmit = async () => {
        try {
            const dataToSubmit:any = {
                ...formData,
                allocationStartDate: formData.allocationStartDate.toISOString(),
                allocationEndDate: formData.allocationEndDate.toISOString(),
            };

            if (editId) {
                await leaveAllocService.updateLeaveAllocation(editId, dataToSubmit);
            } else {
                await leaveAllocService.createLeaveAllocation(dataToSubmit);
            }
            handleClose();
            loadData();
        } catch (error) {
            console.error('Error saving allocation:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await leaveAllocService.deleteLeaveAllocation(id);
            loadData();
        } catch (error) {
            console.error('Error deleting allocation:', error);
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
            field: 'configName',
            headerName: 'Leave Type',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'assignedDays',
            headerName: 'Assigned Days',
            type: 'number',
            width: 130,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'allocationStartDate',
            headerName: 'Start Date',
            width: 130,
            renderCell: (params) => formatDate(params.value)
        },
        {
            field: 'allocationEndDate',
            headerName: 'End Date',
            width: 130,
            renderCell: (params) => params.value ? formatDate(params.value) : 'N/A',
        },
        {
            field: 'note',
            headerName: 'Note',
            flex: 1,
            minWidth: 200,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => [
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
            <div className={styles.pageContainer}>
                <div className={styles.mainContent}>
                    <div className={styles.header}>
                        <h2>Leave Allocations</h2>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpen()}
                        >
                            Add Allocation
                        </Button>
                    </div>

                    <div className={styles.dataGridContainer}>
                        <DataGrid
                            rows={allocations}
                            columns={columns}
                            loading={loading}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10 },
                                },
                                density: "compact",
                                sorting: {
                                    sortModel: [{ field: 'allocationStartDate', sort: 'desc' }],
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
                </div>

                <div className={styles.sidePanel}>
                    <LeaveAnalytics allocations={allocations} />
                </div>

                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle>{editId ? 'Edit Allocation' : 'New Allocation'}</DialogTitle>
                    <DialogContent>
                        <div className={styles.formContainer}>
                            <EmployeeAutocomplete
                                employees={employees}
                                value={formData.employeeId}
                                onChange={(employeeId) => setFormData(prev => ({ ...prev, employeeId }))}
                                searchType="name"
                            />

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Leave Type</InputLabel>
                                <Select
                                    value={formData.leaveConfigId || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, leaveConfigId: e.target.value }))}
                                    required
                                >
                                    {configs.map((config) => (
                                        <MenuItem key={config.id} value={config.id}>
                                            {config.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Assigned Days"
                                type="number"
                                value={formData.assignedDays || 0}
                                onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    assignedDays: parseInt(e.target.value) || 0 
                                }))}
                                fullWidth
                                required
                                margin="normal"
                                inputProps={{ min: 0 }}
                            />

                            <div className={styles.dateFields}>
                                <DatePicker
                                    label="Start Date"
                                    value={formData.allocationStartDate}
                                    onChange={(date) => setFormData(prev => ({
                                        ...prev,
                                        allocationStartDate: date || dayjs().tz("Asia/Karachi")
                                    }))}
                                    className={styles.dateField}
                                    views={['day', 'month', 'year']}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: { fullWidth: true, required: true }
                                    }}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={formData.allocationEndDate}
                                    disabled
                                    className={styles.dateField}
                                    views={['day', 'month', 'year']}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: { fullWidth: true }
                                    }}
                                />
                            </div>

                            <TextField
                                label="Note"
                                value={formData.note || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                                fullWidth
                                multiline
                                rows={3}
                                margin="normal"
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={!formData.employeeId || !formData.leaveConfigId || formData.assignedDays <= 0}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </LocalizationProvider>
    );
};