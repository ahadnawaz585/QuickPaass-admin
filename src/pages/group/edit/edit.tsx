"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import withPermission from '@/components/HOC/withPermission';

import Loader from '@/components/shared/loader/Loader';
import GroupRoleFormComponent from '@/components/shared/groupRoleForm/groupRoleForm';

import { createGroup, RoleGroup, UserGroups } from '@/types/schema/group';
import GroupService from '@/service/group.service';
import { UserDetailCompany, UserDetailGroup, UserGroup } from '@/types/schema/userGroup';
import { groupRole } from '@/types/schema/groupRoleForm';
// import sidebarService from '@/frontend/utilities/sidebar';
const Component = () => {
    const groupService: GroupService = new GroupService();
    const router = useRouter();
    const { id }:any = useParams();
    const groupId: string = Array.isArray(id) ? id[0] : id;
    const [initialValues, setInitialValues] = useState<groupRole>({ name: '', users: [], groups: [], roles: [] });

    // useEffect(() => {
    //     // Hide the sidebar when the component mounts
    //     sidebarService.toggleSidebars(false);

    //     // Clean up: Reset sidebar when component unmounts
    //     return () => {
    //         sidebarService.toggleSidebars(false);
    //     };
    // }, []);

    useEffect(() => {
        fetchData(groupId);
    }, [groupId]);

    const fetchData = async (id: string) => {
        try {
            const data = await groupService.getGroupById(id);
            const users = data.userGroups
                .map((userGroup: UserGroups) => userGroup?.user?.id)
                .filter((userId: string | undefined) => typeof userId === 'string');
            const roles = data.groupRoles
                .map((groupRole: UserDetailGroup) => groupRole?.role?.id)
                .filter((groupId: string | undefined) => typeof groupId === 'string');
            // const companies = data.companyGroups
            //     .map((companyGroup: UserDetailCompany) => companyGroup?.company?.id)
            //     .filter((companyId: string | undefined) => typeof companyId === 'string');

            setInitialValues({ name: data.name, users, groups: [], roles});
        } catch (error) {
            console.error("Error fetching group", error);
        }
    };

    const updateGroup = async (data: createGroup) => {
        try {
            await groupService.updateGroup(groupId, data);
            router.push("/admin/group");
        } catch (error) {
            console.error("Error updating group", error);
        }
    };

    const handleSelect = (selectedUsers: groupRole) => {
        const users: createGroup = {
            name: selectedUsers.name,
            users: selectedUsers.users,
            roles: selectedUsers.roles || [],
            // companies: selectedUsers.companies || []
        };
        updateGroup(users);
    };

    const onDiscard = () => {
        router.push("/admin/group");
    };

    return (
        <div>
            {initialValues.name ? (
                <GroupRoleFormComponent
                    showRole={true}
                    showGroup={false}
                    initialValues={initialValues}
                    onDiscard={onDiscard}
                    heading='Edit Group'
                    onSelect={handleSelect}
                     />
            ) : (
                <Loader />
            )}
        </div>
    );
};

const EditGroupComponent = withPermission(Component, "group.update.*");
export default EditGroupComponent;
