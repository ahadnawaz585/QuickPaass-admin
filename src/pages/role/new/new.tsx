"use client"
import React, { useState,useEffect, Suspense } from 'react';
const GroupRoleFormComponent = React.lazy(() => import('@/components/shared/groupRoleForm/groupRoleForm'));
import { useRouter } from 'next/navigation';
import withPermission from '@/components/HOC/withPermission';
import RoleService from '@/service/role.service';
import Loader from '@/components/shared/loader/Loader';
import { createRole } from '@/types/schema/role';
// import sidebarService from '@/frontend/utilities/sidebar';

const Component = () => {
    const roleService: RoleService = new RoleService();
    const router = useRouter();

    // useEffect(() => {
    //     // Hide the sidebar when the component mounts
    //     sidebarService.toggleSidebars(false);

    //     // Clean up: Reset sidebar when component unmounts
    //     return () => {
    //         sidebarService.toggleSidebars(false);
    //     };
    // }, []);

    const createRole = async (data: createRole) => {
        try {
            await roleService.createRole(data);
            router.push("/role");
        } catch (error) {
            console.error("error creating role", error);
        }
    }

    const handleSelect = (selectedUsers: createRole) => {
        const users: createRole = {
            name: selectedUsers.name,
            users: selectedUsers.users,
            groups: selectedUsers.groups || []
        };
        createRole(users);
    };

    const onDiscard = () => {
        router.push("/role")
    };

    return (
        <Suspense fallback={<Loader />}><GroupRoleFormComponent  showRole={false} showGroup={true} onDiscard={onDiscard} heading='Add Role' onSelect={handleSelect} /></Suspense>
    );
};
const NewRoleComponent = withPermission(Component, "role.create.*");
export default NewRoleComponent;
