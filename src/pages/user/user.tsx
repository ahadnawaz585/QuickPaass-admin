// react hooks
"use client"
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import PageEvent from '@mui/material/Pagination';
import { useRouter } from 'next/navigation';

import Loader from '@/components/shared/loader/Loader';
const TableComponent = React.lazy(() => import('@/components/shared/table/table'));
const DynamicSnackbar = React.lazy(() => import('@/components/shared/snackbar/snackbar'));
const ContentHeaderComponent = React.lazy(() => import('@/components/shared/contentHeader/contentHeader'));

import UserService from '@/service/user.service';
import { User } from '@/types/schema/user';
// import sidebarService from '@/frontend/utilities/sidebar';
import withPermission from '@/components/HOC/withPermission';

const Component = () => {
    const userService = new UserService();
    const columns: string[] = ['username'];
    const columnMappings: { [key: string]: string } = { 'username': 'UserName' };

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [userData, setUserData] = useState<User[]>([]);
    const [pageSize, setPageSize] = useState<number>(15);
    const [totalSize, setTotalSize] = useState<number>(100);
    const [noDataMessage, setNoDataMessage] = useState<string>("No User exists");
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [tableData, setTableData] = useState<User[]>(userData);
    const [searchArray, setSearchArray] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>('');
    const [searching, setSearching] = useState<boolean>(false);

    const router = useRouter();

    // useEffect(() => {
    //     sidebarService.toggleSidebars(false);
    //     return () => {
    //         sidebarService.toggleSidebars(true);
    //     };
    // }, []);

    useEffect(() => {
        if (searching) {
            searchUsers(searchArray);
        } else {
            fetchData();
        }
    }, [currentPage, pageSize, searchArray, searching]);

    const updateUsersData = (data: { data: User[], totalSize: number }) => {
        setLoadingData(false);
        setUserData(data.data);
        setTotalSize(data.totalSize);
        setTableData(data.data);
    };

    const fetchData = useCallback(async () => {
        try {
            const paginatedData = await userService.getUsers(currentPage, pageSize);
            updateUsersData(paginatedData);
            setSearching(false);
        } catch (error) {
            setLoadingData(false);
            console.error('Error fetching users:', error);
            setSnackbarText('Error fetching Users ! Please Try Again !');
            setSnackbarOpen(true);
        }
    }, [currentPage, pageSize, userService]);

    const searchUsers = useCallback(async (searchArray: string[]) => {
        try {
            const searchData = await userService.searchUser(searchArray, currentPage, pageSize);
            updateUsersData(searchData);
            setSearching(true);
        } catch (error) {
            setLoadingData(false);
            console.error('Error searching users:', error);
            setSnackbarText('Error searching User ! Please Try Again !');
            setSnackbarOpen(true);
        }
    }, [currentPage, pageSize, searchArray, userService]);

    const deleteUser = async (id: string) => {
        try {
            await userService.deleteUser(id);
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
            searchUsers(searchArray);
        } else {
            fetchData();
        }
    };

    const handleRowSelected = (id: string) => {
        router.push(`/setting/user/${id}`);
    };

    const handleEditRow = (id: string) => {
        router.push(`/setting/user/edit/${id}`);
    };

    const handleDeleteRow = (id: string) => {
        deleteUser(id);
    };

    const handleSearchArrayChange = (searchArray: string[]) => {
        setSearchArray(searchArray);
        searchUsers(searchArray);
    };

    const handleButtonClicked = () => {
        router.push('/setting/user/new');
    };

    const handlePageSizeChange = (pageSize: number) => {
        setPageSize(pageSize);
        setCurrentPage(1); // Reset current page to 1 when page size changes
        if (searching) {
            searchUsers(searchArray);
        } else {
            fetchData();
        }
    };

    return (
        <div>
            <Suspense fallback={<Loader />}>
                <div>
                    <ContentHeaderComponent
                        searchPlaceholder="Search Users"
                        buttonText="Add User"
                        buttonIcon="add"
                        buttonClass="primary"
                        feature='user.create.*'
                        headerTitle="Users"
                        search={true}
                        onButtonClick={handleButtonClicked}
                        onSearchArrayChange={handleSearchArrayChange}
                    />
                </div>
            </Suspense>
            <>
                <Suspense fallback={<Loader />}>
                    <TableComponent
                        editPermission='user.update.*'
                        deletePermission='user.delete.*'
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
                {snackbarOpen && <Suspense fallback={<Loader />}><DynamicSnackbar text={snackbarText} /></Suspense>}
            </>
        </div>
    );
};

const UserComponent = withPermission(Component, "user.read.*");
export default UserComponent;
