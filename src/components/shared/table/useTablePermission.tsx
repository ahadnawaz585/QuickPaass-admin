import { useState, useEffect } from 'react';
import { permission } from '@/auth/access.service';

interface UseTablePermissionsProps {
  editPermission: string;
  deletePermission: string;
  balancePermission: string;
}

export const useTablePermissions = ({
  editPermission,
  deletePermission,
  balancePermission,
}: UseTablePermissionsProps) => {
  const [editAllowance, setEditAllowance] = useState(false);
  const [deleteAllowance, setDeleteAllowance] = useState(false);
  const [showBalanceColumns, setShowBalanceColumns] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      setEditAllowance(await permission(editPermission));
      setShowBalanceColumns(await permission(balancePermission));
      setDeleteAllowance(await permission(deletePermission));
    };
    checkPermissions();
  }, [editPermission, balancePermission, deletePermission]);

  return {
    editAllowance,
    deleteAllowance,
    showBalanceColumns,
  };
};