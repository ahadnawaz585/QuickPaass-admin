"use client"
import React, { useEffect, useState } from "react";
import EmployeeForm from "@/modules/AMS/components/employeeForm/employeeForm";
import EmployeeService from "@/modules/AMS/services/employee.service";
import withPermission from "@/components/HOC/withPermission";
import Loader from "@/components/shared/loader/loader";
import { useRouter, useParams } from 'next/navigation';
import { generateEmployeeCode } from "@/modules/AMS/helper/generateCode";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Employee } from "@/types/AMS/employee";
const Component = () => {
    const service = new EmployeeService();
    const [employeeData, setEmployeeData] = useState<Employee | undefined | null>(null);
    const { id }: any = useParams();
    const employeeId: string = Array.isArray(id) ? id[0] : id;
    const router = useRouter();

    useEffect(() => {
        if (employeeId) {
            fetchData(id); 
        }
    },[]);

    const fetchData = async (id: string) => {
        try {
            const data = await service.getEmployeeById(id);
            setEmployeeData(data);
        } catch (error) {
            console.error();
        }
    };

    const handleFormSubmit = async (formData: any) => {
        try {
            console.log(formData);
            if (formData.joiningDate) {
                formData.joiningDate = formData.joiningDate.toDate(); // Assuming formData.joiningDate is a Dayjs object
            }
            if (formData.dob) {
                formData.dob = formData.dob.toDate(); // Assuming formData.joiningDate is a Dayjs object
            }
            if (formData.noOfChildrens) {
                formData.noOfChildrens = Number(formData.noOfChildrens);
            }

            formData.code = employeeData?.code;

            console.log(formData);
            await service.updateEmployee(employeeId, formData);
            router.push('/admin/ams/employee')
        } catch (error) {
            console.error("Error saving employee:", error);
        }
    };

    const handleDiscard = () => {
        router.push('/admin/ams/employee')
    };

    return (<>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {employeeData ? <EmployeeForm employee={employeeData} onSubmit={handleFormSubmit} onDiscard={handleDiscard} /> : (<Loader />
            )}</LocalizationProvider></>);
};

const UpdateEmployee = withPermission(Component, "employee.update.*");
export default UpdateEmployee;
