"use client"
// React hooks
import React, { useState, Suspense, useEffect } from 'react';
import PageEvent from '@mui/material/Pagination';
import { useRouter } from 'next/navigation';

import Loader from '@/components/shared/loader/loader';
const TableComponent = React.lazy(() => import('@/components/shared/table/table'));
const DialogueComponent = React.lazy(() => import('@/components/shared/dialogue/dialogue'));
const DynamicSnackbar = React.lazy(() => import('@/components/shared/snackbar/snackbar'));
const ContentHeaderComponent = React.lazy(() => import('@/components/shared/contentHeader/contentHeader'));

import RoleService from '@/service/role.service';
import { Role } from '@/types/schema/role';
// import sidebarService from '@/frontend/utilities/sidebar';
import withPermission from '@/components/HOC/withPermission';

const Component = () => {
    const roleService: RoleService = new RoleService();
    const columns: string[] = ['name'];
    const columnMappings: { [key: string]: string } = { 'name': 'Name' };

    const [currentPage, setCurrentPage] = useState(1);
    const [roleData, setRoleData] = useState<Role[]>([]);
    const [pageSize, setPageSize] = useState(15);
    const [totalSize, setTotalSize] = useState(100);
    const [noDataMessage, setNoDataMessage] = useState("No Role exists");
    const [loadingData, setLoadingData] = useState(true);
    const [tableData, setTableData] = useState(roleData);
    const [searchArray, setSearchArray] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>('');
    const [searching, setSearching] = useState<boolean>(false);

    const router = useRouter();
    const page = currentPage;

    // useEffect(() => {
    //     // Hide the sidebar when the component mounts
    //     sidebarService.toggleSidebars(false);

    //     // Clean up: Reset sidebar when component unmounts
    //     return () => {
    //         sidebarService.toggleSidebars(true);
    //     };
    // }, []);

    useEffect(() => {
        if (searching) {
            searchRoles(searchArray);
        } else {
            fetchData();
        }
    }, [currentPage, pageSize, searchArray, searching]);

    const updateRoleData = (data: { data: Role[], totalSize: number }) => {
        setLoadingData(false);
        setRoleData(data.data);
        setTotalSize(data.totalSize);
        setTableData(data.data);
    };

    const fetchData = async () => {
        try {
            const paginatedData = await roleService.getRoles(page, pageSize);
            updateRoleData(paginatedData);
            setSearching(false);

        } catch (error) {
            setLoadingData(false);
            console.error('Error fetching roles:', error);
            setSnackbarText('Error fetching roles! Please Try Again!');
            setSnackbarOpen(true);
        }
    };

    const searchRoles = async (searchArray: string[]) => {
        try {
            const searchData = await roleService.searchRole(searchArray, page, pageSize);
            updateRoleData(searchData);
            setSearching(true);
        } catch (error) {
            setLoadingData(false);
            console.error('Error searching roles:', error);
            setSnackbarText('Error searching roles! Please Try Again!');
            setSnackbarOpen(true);
        }
    }

    const deleteRole = async (id: string) => {
        try {
            await roleService.deleteRole(id);
            setSnackbarText('Deleted role Successfully!');
            setSnackbarOpen(true);
            fetchData();
        } catch (error) {
            console.error('Error deleting roles:', error);
            setSnackbarText('Error deleting roles! Please Try Again!');
            setSnackbarOpen(true);
        }
    }

    const handlePageChange = (event: typeof PageEvent, page: number) => {
        setCurrentPage(page + 1);
        if (searching) {
            searchRoles(searchArray);
        } else {
            fetchData();
        }
    };

    const handleRowSelected = (id: any) => {
        router.push(`/admin/role/${id}`);
    };

    const handleEditRow = (id: any) => {
        router.push(`/admin/role/edit/${id}`);
    };

    const handleDeleteRow = (id: any) => {
        deleteRole(id);
    };

    const handleSearchArrayChange = (searchArray: string[]) => {
        setSearchArray(searchArray);
        searchRoles(searchArray);
    };

    const handleButtonClicked = () => {
        router.push('/admin/role/new');
    };

    const handlePageSizeChange = (pageSize: number) => {
        setPageSize(pageSize);
        setCurrentPage(1);

        if (searching) {
            searchRoles(searchArray);
        } else {
            fetchData();
        }
    };

    return (
        <div>
            <Suspense fallback={<Loader />}>
                <ContentHeaderComponent
                    searchPlaceholder="Search Roles"
                    buttonText="Add Role"
                    buttonIcon="add"
                    buttonClass="primary"
                    feature="role.create.*"
                    headerTitle="Roles"
                    search={true}
                    onButtonClick={handleButtonClicked}
                    onSearchArrayChange={handleSearchArrayChange}
                />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <TableComponent
                    editPermission="role.update.*"
                    deletePermission="role.delete.*"
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
            <Suspense fallback={<Loader />}>
                {snackbarOpen && <DynamicSnackbar text={snackbarText} />}
            </Suspense>
        </div>
    );
};

const RoleComponent = withPermission(Component, "role.read.*");
export default RoleComponent;
