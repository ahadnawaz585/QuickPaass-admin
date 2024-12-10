"use client"
import React,{useEffect} from 'react';
// import sidebarService from '@/frontend/utilities/sidebar';
const UserForm = React.lazy(()=>import('@/components/shared/userForm/userForm'))
import withPermission from '@/components/HOC/withPermission';
import UserService from '@/service/user.service';
import { useRouter } from 'next/navigation';
import { UserCreateData, UserData } from '@/types/schema/user';
const Component: React.FC = () => {

    const router = useRouter();
    const userService: UserService = new UserService();


    // useEffect(() => {
    //     // Hide the sidebar when the component mounts
    //     sidebarService.toggleSidebars(false);

    //     // Clean up: Reset sidebar when component unmounts
    //     return () => {
    //         sidebarService.toggleSidebars(false);
    //     };
    // }, []);

    const createUser = async (data: UserCreateData) => {
        try {
            await userService.createuser(data);
            router.push("/user")
        } catch (error) {
            console.error("error creating user", error);
        }
    }

    const handleSubmit = (userData: UserCreateData) => {
        createUser(userData);
    };

    const onDiscard = () => {
        router.push("/user")
    };

    return (
        <div>

            <UserForm type='new' onDiscard={onDiscard} heading='New User' onSubmit={handleSubmit} />
        </div>
    );
}

const NewUser = withPermission(Component, "user.create.*");
export default NewUser;
