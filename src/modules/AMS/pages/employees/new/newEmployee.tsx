"use client"
import React from "react";
import EmployeeForm from "@/modules/AMS/components/employeeForm/employeeForm";
import EmployeeService from "@/modules/AMS/services/employee.service";
import withPermission from "@/components/HOC/withPermission";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useRouter } from "next/navigation";
import { generateEmployeeCode } from "@/modules/AMS/helper/generateCode";
const Component = () => {
    const service = new EmployeeService();
    const router = useRouter();
    const handleFormSubmit = async (formData: any) => {
        try {
            if (formData.joiningDate ) {
                formData.joiningDate = formData.joiningDate.toDate(); // Assuming formData.joiningDate is a Dayjs object
            }
            if (formData.dob ) {
                formData.dob = formData.dob.toDate(); // Assuming formData.joiningDate is a Dayjs object
            }
            if(formData.noOfChildrens){
                formData.noOfChildrens = Number(formData.noOfChildrens);
            }

            formData.code = generateEmployeeCode(formData);
            
            console.log(formData);
            await service.createEmployee(formData);
            router.push('/admin/ams/employee')
        } catch (error) {
            console.error("Error saving employee:", error);
        }
    };

    const handleDiscard = () => {
        router.push('/admin/ams/employee')
    };

    return <>  <LocalizationProvider dateAdapter={AdapterDayjs}><EmployeeForm onSubmit={handleFormSubmit} onDiscard={handleDiscard} /></LocalizationProvider></>;
};

const NewEmployee = withPermission(Component,"employee.create.*");
export default NewEmployee;
