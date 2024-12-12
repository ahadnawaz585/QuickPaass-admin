"use client"
// React hooks
import React, { useState, Suspense, useEffect } from 'react';
import PageEvent from '@mui/material/Pagination';
import { useRouter } from 'next/navigation';

import Loader from '@/components/shared/loader/loader';
const TableComponent = React.lazy(() => import('@/components/shared/table/table'));
const DialogueComponent = React.lazy(() => import('@/components/shared/dialogue/dialogue'));
const DynamicSnackbar = React.lazy(() => import('@/components/shared/snackbar/snackbar'))
const ContentHeaderComponent = React.lazy(() => import('@/components/shared/contentHeader/contentHeader'));

import { Group } from '@/types/schema/group';
import GroupService from '@/service/group.service';
// import sidebarService from '@/utilities/sidebar';
import withPermission from '@/components/HOC/withPermission';

const Component = () => {
    const groupService: GroupService = new GroupService();
    const columns: string[] = ['name'];
    const columnMappings: { [key: string]: string } = { 'name': 'Name' };

    const [currentPage, setCurrentPage] = useState(1);
    const [groupData, setGroupData] = useState<Group[]>([]);
    const [pageSize, setPageSize] = useState(15);
    const [totalSize, setTotalSize] = useState(100);
    const [noDataMessage, setNoDataMessage] = useState("No group exists");
    const [loadingData, setLoadingData] = useState(true);
    const [tableData, setTableData] = useState(groupData);
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
            searchGroups(searchArray);
        } else {
            fetchData();
        }
    }, [currentPage, pageSize, searchArray, searching]);

    const updateGroupData = (data: { data: Group[], totalSize: number }) => {
        setLoadingData(false);
        setGroupData(data.data);
        setTotalSize(data.totalSize);
        setTableData(data.data);
    };

    const fetchData = async () => {
        try {
            const paginatedData = await groupService.getGroups(page, pageSize);
            updateGroupData(paginatedData);
            setSearching(false);

        } catch (error) {
            setLoadingData(false);
            console.error('Error fetching groups:', error);
            setSnackbarText('Error fetching groups! Please Try Again!');
            setSnackbarOpen(true);
        }
    };

    const searchGroups = async (searchArray: string[]) => {
        try {
            const searchData = await groupService.searchGroup(searchArray, page, pageSize);
            updateGroupData(searchData);
            setSearching(true);
        } catch (error) {
            setLoadingData(false);
            console.error('Error searching groups:', error);
            setSnackbarText('Error searching groups! Please Try Again!');
            setSnackbarOpen(true);
        }
    }

    const deleteGroup = async (id: string) => {
        try {
            await groupService.deleteGroup(id);
            setSnackbarText('Deleted Group Successfully!');
            setSnackbarOpen(true);
            fetchData();
        } catch (error) {
            console.error('Error deleting groups:', error);
            setSnackbarText('Error deleting groups! Please Try Again!');
            setSnackbarOpen(true);
        }
    }

    const handlePageChange = (event: typeof PageEvent, page: number) => {
        setCurrentPage(page + 1);
        if (searching) {
            searchGroups(searchArray);
        } else {
            fetchData();
        }
    };

    const handleRowSelected = (id: any) => {
        router.push(`/admin/group/${id}`)
    };

    const handleEditRow = (id: any) => {
        router.push(`/admin/group/edit/${id}`)
    };

    const handleDeleteRow = (id: any) => {
        deleteGroup(id);
    };

    const handleSearchArrayChange = (searchArray: string[]) => {
        setSearchArray(searchArray);
        searchGroups(searchArray);
    };

    const handleButtonClicked = () => {
        router.push('/admin/group/new');
    };

    const handlePageSizeChange = (pageSize: number) => {
        setPageSize(pageSize);
        setCurrentPage(1);

        if (searching) {
            searchGroups(searchArray);
        } else {
            fetchData();
        }
    };


    return (
        <div>
            <Suspense fallback={<Loader />}>
                <div>
                    <ContentHeaderComponent
                        searchPlaceholder="Search groups"
                        buttonText="Add Groups"
                        buttonIcon="add"
                        buttonClass="primary"
                        feature='group.create.*'
                        headerTitle="Groups"
                        search={true}
                        onButtonClick={handleButtonClicked}
                        onSearchArrayChange={handleSearchArrayChange}
                    />
                </div>
            </Suspense>
            <>
                <Suspense fallback={<Loader />}>
                    <TableComponent
                        editPermission='group.update.*'
                        deletePermission='group.delete.*'
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
    )
}

const GroupComponent = withPermission(Component, "group.read.*");
export default GroupComponent;
