import React, { Suspense } from 'react';
const TableComponent = React.lazy(() => import('@/components/shared/table/table'));
import Loader from '@/components/shared/loader/loader';
import { Employee } from '@/types/AMS/employee';

interface EmployeeTableProps {
    tableData: Employee[];
    currentPage: number;
    pageSize: number;
    totalSize: number;
    noDataMessage: string;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onRowSelected: (id: string) => void;
    onEditRow: (id: string) => void;
    onDeleteRow: (id: string) => void;
}

const columns: string[] = ['code', 'name', 'surname', 'designation', 'department', 'address', 'contactNo', 'company', 'image'];
const columnMappings: { [key: string]: string } = {
    'name': 'Name',
    'surname': 'Surname',
    'address': 'Address',
    'contactNo': 'Contact',
    'company': 'Company',
    'code': 'Code',
    'designation': 'Designation',
    'department': 'Department',
    'image': 'Image'
};

const EmployeeTable: React.FC<EmployeeTableProps> = ({
    tableData,
    currentPage,
    pageSize,
    totalSize,
    noDataMessage,
    onPageChange,
    onPageSizeChange,
    onRowSelected,
    onEditRow,
    onDeleteRow
}) => (
    <Suspense fallback={<Loader />}>
        <TableComponent
            editPermission='employee.update.*'
            deletePermission='employee.delete.*'
            handlePageSizeChange={onPageSizeChange}
            tableData={tableData}
            tableColumns={columns}
            columnMappings={columnMappings}
            totalSize={totalSize}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onRowSelected={onRowSelected}
            onEditRow={onEditRow}
            onDeleteRow={onDeleteRow}
            noDataMessage={noDataMessage}
        />
    </Suspense>
);