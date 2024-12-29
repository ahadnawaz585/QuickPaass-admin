"use client"
// React hooks
import React, { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Loader from '@/components/shared/loader/loader';
const TableComponent = React.lazy(() => import('@/components/shared/table/table'));
const DialogueComponent = React.lazy(() => import('@/components/shared/dialogue/dialogue'));
const DynamicSnackbar = React.lazy(() => import('@/components/shared/snackbar/snackbar'));
const ContentHeaderComponent = React.lazy(() => import('@/components/shared/contentHeader/contentHeader'));

import RoleService from '@/modules/rbac/services/role.service';
import { Role } from '@/types/schema/role';
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
    const [loadingData, setLoadingData] = useState(true); // Start with loading true
    const [tableData, setTableData] = useState(roleData);
    const [searchArray, setSearchArray] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>('');
    const [searching, setSearching] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (searching) {
            searchRoles(searchArray);
        } else {
            fetchData();
        }
    }, [currentPage, pageSize, searchArray, searching]);

    const updateRoleData = (data: { data: Role[], totalSize: number }) => {
        setLoadingData(false); // Set loading to false after data is fetched
        setRoleData(data.data);
        setTotalSize(data.totalSize);
        setTableData(data.data);
    };

    const fetchData = async () => {
        setLoadingData(true); // Start loading when fetching new data
        try {
            const paginatedData = await roleService.getRoles(currentPage, pageSize);
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
        setLoadingData(true); // Start loading when performing a search
        try {
            const searchData = await roleService.searchRole(searchArray, currentPage, pageSize);
            updateRoleData(searchData);
            setSearching(true);
        } catch (error) {
            setLoadingData(false);
            console.error('Error searching roles:', error);
            setSnackbarText('Error searching roles! Please Try Again!');
            setSnackbarOpen(true);
        }
    };

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
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
            {/* Show loader while loading data */}
            {loadingData ? (
                <Suspense fallback={<Loader />}>
                    <Loader />
                </Suspense>
            ) : (
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
            )}
            <Suspense fallback={<Loader />}>
                {snackbarOpen && <DynamicSnackbar text={snackbarText} />}
            </Suspense>
        </div>
    );
};

const RoleComponent = withPermission(Component, "role.read.*");
export default RoleComponent;
