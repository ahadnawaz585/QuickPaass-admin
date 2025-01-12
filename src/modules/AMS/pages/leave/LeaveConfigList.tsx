"use client"
import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import styles from './styles/LeaveManagement.module.scss';
import LeaveConfigService from '../../services/leaveConfig.service';
import { LeaveConfiguration } from '@/types/AMS/leave';
import { formatDate } from '@/utils/date';

const leaveConfigService = new LeaveConfigService();

interface LeaveConfigFormData {
  name: string;
  description: string;
  maxDays: number;
}

export const LeaveConfigList = () => {
  const [configs, setConfigs] = useState<LeaveConfiguration[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LeaveConfigFormData>({
    name: '',
    description: '',
    maxDays: 0,
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const data = await leaveConfigService.getAllLeaveConfigurations();
      setConfigs(data);
    } catch (error) {
      console.error('Error loading configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (config?: LeaveConfiguration) => {
    if (config) {
      setFormData({
        name: config.name,
        description: config.description || '',
        maxDays: config.maxDays,
      });
      setEditId(config.id);
    } else {
      setFormData({ name: '', description: '', maxDays: 0 });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', description: '', maxDays: 0 });
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await leaveConfigService.updateLeaveConfiguration(editId, formData as LeaveConfiguration);
      } else {
        await leaveConfigService.createLeaveConfiguration(formData as LeaveConfiguration);
      }
      handleClose();
      loadConfigs();
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await leaveConfigService.deleteLeaveConfiguration(id);
      loadConfigs();
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      minWidth: 150 
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 2,
      minWidth: 200 
    },
    { 
      field: 'maxDays', 
      headerName: 'Max Days', 
      type: 'number',
      width: 120,
      align: 'center',
      headerAlign: 'center'
    },
    
    {
      field: 'createdAt',
      headerName: 'Created At',
    //   type: 'dateTime',
      width: 180,
       renderCell: (params) => formatDate(params.value)
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Leave Configurations</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Configuration
        </Button>
      </div>

      <div className={styles.dataGridContainer}>
        <DataGrid
          rows={configs}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Configuration' : 'New Configuration'}</DialogTitle>
        <DialogContent>
          <div className={styles.formContainer}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
            <TextField
              label="Max Days"
              type="number"
              value={formData.maxDays}
              onChange={(e) => setFormData({ ...formData, maxDays: parseInt(e.target.value) })}
              fullWidth
              required
              margin="normal"
              inputProps={{ min: 0 }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.name || formData.maxDays < 0}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};