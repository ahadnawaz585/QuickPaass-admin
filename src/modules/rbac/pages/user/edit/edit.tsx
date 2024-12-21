"use client"
import React, { useEffect, useState } from 'react';
import UserForm from '@/modules/rbac/components/userForm/userForm';
import withPermission from '@/components/HOC/withPermission';
import UserService from '@/modules/rbac/services/user.service';
import { useRouter, useParams } from 'next/navigation';
import { UserCreateData, UserData } from '@/types/schema/user';
// import sidebarService from '@/frontend/utilities/sidebar';
const Component: React.FC = () => {

    const router = useRouter();
    const { id }:any = useParams();
    const userId: string = Array.isArray(id) ? id[0] : id;
    const userService: UserService = new UserService();
    const [formData, setFormData] = useState<UserCreateData>();


    // useEffect(() => {
    //     // Hide the sidebar when the component mounts
    //     sidebarService.toggleSidebars(false);

    //     // Clean up: Reset sidebar when component unmounts
    //     return () => {
    //         sidebarService.toggleSidebars(false);
    //     };
    // }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await userService.getById(userId);
                setFormData(user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [userId]);

    const updateUser = async (userId: string, data: UserCreateData) => {
        try {
            await userService.updateuser(userId, data);
            router.push("/admin/user")
        } catch (error) {
            console.error("error creating user", error);
        }
    }

    const handleSubmit = (userData: UserCreateData) => {
        updateUser(userId, userData);
    };

    const onDiscard = () => {
        router.push("/admin//user")
    };


    return (
        <div>

            {formData && <UserForm type='edit' onDiscard={onDiscard} heading='Edit User' initialData={formData} onSubmit={handleSubmit} />}
        </div>
    );
}

const EditUser = withPermission(Component, "user.create.*");
export default EditUser;
