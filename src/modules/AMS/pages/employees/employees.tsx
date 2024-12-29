"use client"
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import PageEvent from '@mui/material/Pagination';
import { useRouter } from 'next/navigation';
import * as FileSaver from 'file-saver';
import Loader from '@/components/shared/loader/loader';
const TableComponent = React.lazy(() => import('@/components/shared/table/table'));
const DynamicSnackbar = React.lazy(() => import('@/components/shared/snackbar/snackbar'));
const ContentHeaderComponent = React.lazy(() => import('@/components/shared/contentHeader/contentHeader'));
import EmployeeService from '../../services/employee.service';
import { Employee } from '@/types/AMS/employee';
import withPermission from '@/components/HOC/withPermission';

// MUI imports for icons
import { IconButton } from '@mui/material';
import { FileDownload, InsertDriveFile } from '@mui/icons-material';

// Import the DialogueComponent
import DialogueComponent from '@/components/shared/dialogue/dialogue';
import { parseEnv } from 'util';

const Component = () => {
    const employeeService = new EmployeeService();
    const columns: string[] = ['code', 'name', 'surname', 'designation', 'department', 'address', 'contactNo', 'company', 'image'];
    const columnMappings: { [key: string]: string } = { 'name': 'Name', 'surname': 'Surname', 'address': 'Address', 'contactNo': 'Contact', 'company': 'Company', 'code': 'Code', 'designation': 'Designation', 'department': 'Department', 'image': 'Image' };

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [employeeData, setEmployeeData] = useState<Employee[]>([]);
    const [pageSize, setPageSize] = useState<number>(15);
    const [totalSize, setTotalSize] = useState<number>(100);
    const [noDataMessage, setNoDataMessage] = useState<string>("No Employee exists");
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [tableData, setTableData] = useState<Employee[]>(employeeData);
    const [searchArray, setSearchArray] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>('');
    const [searching, setSearching] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false); // State for dialog visibility
    const [isDownloadConfirmed, setIsDownloadConfirmed] = useState<boolean>(false); // State for user's confirmation

    const router = useRouter();

    useEffect(() => {
        setDialogOpen(false);
        if (searching) {
            searchEmployees(searchArray);
        } else {
            fetchData(currentPage, pageSize);
        }
    }, []);

    const updateEmployeesData = (data: { data: Employee[], totalSize: number }) => {
        setLoadingData(false);
        setEmployeeData(data.data);
        setTotalSize(data.totalSize);
        setTableData(data.data);
    };

    const fetchData = useCallback(async (page: number, pageSize: number) => {
        console.log("Fetching data for page:", page, "for page size :", pageSize);
        setLoadingData(true);
        try {
            const paginatedData = await employeeService.getEmployees(page, pageSize);
            updateEmployeesData(paginatedData);
            setSearching(false);
        } catch (error) {
            setLoadingData(false);
            console.error('Error fetching employees:', error);
            setSnackbarText('Error fetching Employees! Please Try Again!');
            setSnackbarOpen(true);
        }
    }, [pageSize, employeeService]);


    const searchEmployees = useCallback(async (searchArray: string[]) => {
        setLoadingData(true);
        try {
            const searchData = await employeeService.searchEmployees(searchArray, currentPage, pageSize);
            updateEmployeesData(searchData);
            setSearching(true);
        } catch (error) {
            setLoadingData(false);
            console.error('Error searching employee:', error);
            setSnackbarText('Error searching User ! Please Try Again !');
            setSnackbarOpen(true);
        }
    }, [currentPage, pageSize, searchArray, employeeService]);

    const downloadExcel = async () => {
        try {
            const response = await employeeService.generateExcel(); // Ensure this returns a Blob
            const blob = new Blob([response], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            FileSaver.saveAs(blob, `${Date.now()}-employees.xlsx`);
            setSnackbarText('Excel downloaded successfully !!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error generating excel:", error);
        }
    };

    const deleteEmployee = async (id: string) => {
        try {
            await employeeService.deleteEmployee(id);
            setSnackbarText('Deleted user Successfully ! ');
            setSnackbarOpen(true);
            fetchData(currentPage, pageSize);
        } catch (error) {
            console.error('Error deleting users:', error);
            setSnackbarText('Error deleting user ! Please Try Again !');
            setSnackbarOpen(true);
        }
    };

    const handleDownloadClick = () => {
        setDialogOpen(true); // Open dialog when the download button is clicked
    };

    const handleDialogClose = (confirmed: boolean) => {
        setDialogOpen(false); // Close dialog
        if (confirmed) {
            downloadExcel(); // Proceed with download if confirmed
        }
    };

    return (
        <div>
            <Suspense fallback={<Loader />}>

                {/* Content Header */}
                <div>
                    <ContentHeaderComponent
                        searchPlaceholder="Search Employees"
                        buttonText="Add Employee"
                        buttonIcon="add"
                        buttonClass="primary"
                        feature='employee.create.*'
                        headerTitle="Employees"
                        search={true}
                        onButtonClick={() => router.push('/admin/ams/employee/new')}
                        onSearchArrayChange={(searchArray) => {
                            setSearchArray(searchArray);
                            searchEmployees(searchArray);
                        }}
                    />
                </div>

            </Suspense>

            {loadingData ? (
                <Loader />
            ) : (
                <>
                    <Suspense fallback={<Loader />}>
                        <TableComponent
                            editPermission='employee.update.*'
                            deletePermission='employee.delete.*'
                            handlePageSizeChange={(pageSize) => {
                                setPageSize(pageSize);
                                setCurrentPage(1);
                                fetchData(currentPage, pageSize);
                            }}
                            tableData={tableData}
                            tableColumns={columns}
                            columnMappings={columnMappings}
                            totalSize={totalSize}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onPageChange={(page) => {
                                const newPage = page; // Keep it 1-based as paginator passes 1-based page
                                setCurrentPage(newPage); // Update the state
                                console.log("page from paginator : ", newPage);
                                console.log("page in state before fetchData : ", currentPage); // This will show the previous value due to async state update
                                fetchData(newPage, pageSize); // Explicitly pass the correct page
                            }}

                            onRowSelected={(id) => router.push(`/admin/ams/employee/${id}`)}
                            onEditRow={(id) => router.push(`/admin/ams/employee/edit/${id}`)}
                            onDeleteRow={deleteEmployee}
                            noDataMessage={noDataMessage}
                        />
                    </Suspense>
                    {snackbarOpen && (
                        <Suspense fallback={<Loader />}>
                            <DynamicSnackbar text={snackbarText} />
                        </Suspense>
                    )}
                </>
            )}

            {/* Download Button - only shown when dialog is confirmed */}
                <IconButton
                draggable
                    onClick={handleDownloadClick}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        backgroundColor: '#4CAF50', // Green button
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        // padding: '10px 20px',
                        padding: '20px',
                        cursor: 'pointer',
                        zIndex: 1000,
                    }}
                >
                    <FileDownload />
                </IconButton>

            {/* Dialog Component */}
            {dialogOpen && <DialogueComponent
                heading="Download Excel"
                question="Do you want to download the employee data as an Excel file?"
                onClose={handleDialogClose}
                showYesOrNo={true}
            />}
        </div>
    );
};

const EmployeeComponent = withPermission(Component, "employee.read.*");
export default EmployeeComponent;
