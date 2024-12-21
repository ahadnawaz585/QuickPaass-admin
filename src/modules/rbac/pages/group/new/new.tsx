"use client"
import React, { useState, Suspense, useEffect } from 'react';
const GroupRoleFormComponent = React.lazy(() => import('@/modules/rbac/components/groupRoleForm/groupRoleForm'));
import { useRouter } from 'next/navigation';
import withPermission from '@/components/HOC/withPermission';
import GroupService from '@/modules/rbac/services/group.service';
import Loader from '@/components/shared/loader/loader';
import { Group, createGroup } from '@/types/schema/group';
import { groupRole } from '@/types/schema/groupRoleForm';
// import sidebarService from '@/frontend/utilities/sidebar';
const Component = () => {

    // useEffect(() => {
    //     // Hide the sidebar when the component mounts
    //     sidebarService.toggleSidebars(false);

    //     // Clean up: Reset sidebar when component unmounts
    //     return () => {
    //         sidebarService.toggleSidebars(false);
    //     };
    // }, []);

    const groupService: GroupService = new GroupService();
    const router = useRouter();

    const createGroup = async (data: createGroup) => {
        try {
            await groupService.createGroup(data);
            router.push("/admin/group");
        } catch (error) {
            console.error("error creating group", error);
        }
    }

    const handleSelect = (selectedUsers: groupRole) => {
        const users: createGroup = {
            name: selectedUsers.name,
            users: selectedUsers.users,
            roles: selectedUsers?.roles || [],
            // companies: selectedUsers?.companies || []
        }
        createGroup(users);
    };

    const onDiscard = () => {
        router.push("/admin/group")
    };

    return (
        <Suspense fallback={<Loader />}><GroupRoleFormComponent  showRole={true} showGroup={false} onDiscard={onDiscard} heading='Add Group' onSelect={handleSelect} /></Suspense>
    );
};
const NewGroupComponent = withPermission(Component, "group.create.*");
export default NewGroupComponent;
