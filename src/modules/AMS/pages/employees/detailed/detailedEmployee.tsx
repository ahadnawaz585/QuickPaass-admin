"use client"
import React, { useEffect, useState } from "react";
import EmployeeForm from "@/modules/AMS/components/employeeForm/employeeForm";
import EmployeeService from "@/modules/AMS/services/employee.service";
import withPermission from "@/components/HOC/withPermission";
import Loader from "@/components/shared/loader/loader";
import { useRouter, useParams } from 'next/navigation';
import DetailedEmployeeComponent from "@/modules/AMS/components/detailedEmployee/DetailedEmployee";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Employee } from "@/types/AMS/employee";
import DynamicSnackbar from "@/components/shared/snackbar/snackbar";
import DialogueComponent from "@/components/shared/dialogue/dialogue";

const Component = () => {
    const service = new EmployeeService();
    const [employeeData, setEmployeeData] = useState<Employee | undefined | null>(null);
    const { id }: any = useParams();
    const employeeId: string = Array.isArray(id) ? id[0] : id;
    const router = useRouter();
    const [snackbarText, setSnackbarText] = useState<string>("");
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogAction, setDialogAction] = useState<"edit" | "delete" | null>(null);

    useEffect(() => {
        if (employeeId) {
            fetchData(id);
        }
    }, []);

    const fetchData = async (id: string) => {
        try {
            const data = await service.getEmployeeById(id);
            setEmployeeData(data);
        } catch (error) {
            setSnackbarText("Failed to fetch employee data.");
        }
    };

    const handleEdit = () => {
        setDialogAction("edit");
        setDialogOpen(true);
    };

    const handleDelete = () => {
        setDialogAction("delete");
        setDialogOpen(true);
    };

    const confirmAction = async (confirmed: boolean) => {
        setDialogOpen(false);

        if (!confirmed) {
            setSnackbarText("Action cancelled.");
            return;
        }

        if (dialogAction === "edit") {
            router.push(`/admin/ams/employee/edit/${employeeId}`);
        }

        if (dialogAction === "delete") {
            try {
                await service.deleteEmployee(employeeId);
                setSnackbarText("Employee deleted successfully.");
                router.push(`/admin/ams/employee/`);
            } catch (error) {
                setSnackbarText("Failed to delete employee.");
            }
        }
    };

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {employeeData ? (
                    <DetailedEmployeeComponent onDelete={handleDelete} onEdit={handleEdit} employee={employeeData} />
                ) : (
                    <Loader />
                )}
            </LocalizationProvider>

            {snackbarText && <DynamicSnackbar text={snackbarText} />}

            {dialogOpen && (
                <DialogueComponent
                    heading={dialogAction === "edit" ? "Confirm Edit" : "Confirm Delete"}
                    question={
                        dialogAction === "edit"
                            ? "Are you sure you want to edit this employee?"
                            : "Are you sure you want to delete this employee?"
                    }
                    onClose={confirmAction}
                    showYesOrNo={true}
                />
            )}
        </>
    );
};

const DetailedEmployee = withPermission(Component, "employee.read.*");
export default DetailedEmployee;
