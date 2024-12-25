"use client"
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import PageEvent from '@mui/material/Pagination';
import { useRouter } from 'next/navigation';

import Loader from '@/components/shared/loader/loader';
const TableComponent = React.lazy(() => import('@/components/shared/table/table'));
const DynamicSnackbar = React.lazy(() => import('@/components/shared/snackbar/snackbar'));
const ContentHeaderComponent = React.lazy(() => import('@/components/shared/contentHeader/contentHeader'));

import EmployeeService from '../../services/employee.service';
import { formatDate } from '@/utils/date';
import { Employee } from '@/types/AMS/employee';
import withPermission from '@/components/HOC/withPermission';

const Component = () => {
    const employeeService = new EmployeeService();
    const columns: string[] = ['code','name','surname','address','joiningDate','contactNo','designation','department','company','image'];
    const columnMappings: { [key: string]: string } = { 'name': 'Name' ,'surname': 'Surname','address':'Address','joiningDate':'Joining','contactNo':'Contact','company':'Company','code':'Code','designation':'Designation','department':'Department','image':'Image'};

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

    const router = useRouter();

    useEffect(() => {
        if (searching) {
            searchEmployees(searchArray);
        } else {
            fetchData();
        }
    }, []);

    const updateEmployeesData = (data: { data: Employee[], totalSize: number }) => {
        setLoadingData(false);
        setEmployeeData(data.data);
        setTotalSize(data.totalSize);
        setTableData(data.data);
    };

    const fetchData = useCallback(async () => {
        setLoadingData(true);
        try {
            const paginatedData = await employeeService.getEmployees(currentPage, pageSize);
            updateEmployeesData(paginatedData);
            setSearching(false);
        } catch (error) {
            setLoadingData(false);
            console.error('Error fetching employees:', error);
            setSnackbarText('Error fetching Employees ! Please Try Again !');
            setSnackbarOpen(true);
        }
    }, []);

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

    const deleteEmployee = async (id: string) => {
        try {
            await employeeService.deleteEmployee(id);
            setSnackbarText('Deleted user Successfully ! ');
            setSnackbarOpen(true);
            fetchData();
        } catch (error) {
            console.error('Error deleting users:', error);
            setSnackbarText('Error deleting user ! Please Try Again !');
            setSnackbarOpen(true);
        }
    };

    const handlePageChange = (event: typeof PageEvent, page: number) => {
        setCurrentPage(page + 1);
        if (searching) {
            searchEmployees(searchArray);
        } else {
            fetchData();
        }
    };

    const handleRowSelected = (id: string) => {
        router.push(`/admin/ams/employee/${id}`);
    };

    const handleEditRow = (id: string) => {
        router.push(`/admin/ams/employee/edit/${id}`);
    };

    const handleDeleteRow = (id: string) => {
        deleteEmployee(id);
    };

    const handleSearchArrayChange = (searchArray: string[]) => {
        setSearchArray(searchArray);
        searchEmployees(searchArray);
    };

    const handleButtonClicked = () => {
        router.push('/admin/ams/employee/new');
    };

    const handlePageSizeChange = (pageSize: number) => {
        setPageSize(pageSize);
        setCurrentPage(1); // Reset current page to 1 when page size changes
        if (searching) {
            searchEmployees(searchArray);
        } else {
            fetchData();
        }
    };

    return (
        <div>
            <Suspense fallback={<Loader />}>
                <div>
                    <ContentHeaderComponent
                        searchPlaceholder="Search Employees"
                        buttonText="Add Employee"
                        buttonIcon="add"
                        buttonClass="primary"
                        feature='employee.create.*'
                        headerTitle="Employees"
                        search={true}
                        onButtonClick={handleButtonClicked}
                        onSearchArrayChange={handleSearchArrayChange}
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
                            handlePageSizeChange={handlePageSizeChange}
                            tableData={tableData}
                            tableColumns={columns}
                            columnMappings={columnMappings}
                            totalSize={totalSize}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                            onRowSelected={handleRowSelected}
                            onEditRow={handleEditRow}
                            onDeleteRow={handleDeleteRow}
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
        </div>
    );
};

const EmployeeComponent = withPermission(Component, "employee.read.*");
export default EmployeeComponent;
