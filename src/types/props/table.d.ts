interface TableComponentProps {
    tableData: any[];
    tableColumns: string[];
    columnMappings: { [key: string]: string };
    showMenu?: boolean;
    totalSize: number;
    balancePermission?:string;
    currentPage: number;
    pageSize: number;
    editPermission: string;
    deletePermission: string;
    paginator?: boolean;
    noDataMessage?: string;
    handlePageSizeChange: (pageSize: number) => void;
    onPageChange: (event: typeof PageEvent, page: number) => void; // Fix the type here
    onRowSelected: (id: any) => void;
    onEditRow: (id: any) => void;
    onDeleteRow: (id: any) => void;
  }
  