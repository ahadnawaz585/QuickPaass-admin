"use client"
import React, { useState, useEffect } from 'react';
// import sidebarService from '@/frontend/utilities/sidebar';
import { useRouter, useParams } from 'next/navigation';
import withPermission from '@/components/HOC/withPermission';
import RoleService from '@/service/role.service';
import Loader from '@/components/shared/loader/loader';
const GroupRoleFormComponent = React.lazy(() => import('@/components/shared/groupRoleForm/groupRoleForm'));
import { createRole, detailedRole, UserRoles } from '@/types/schema/role'; // Import UserRoles
import { UserDetailRole } from '@/types/schema/group';
import { UserDetailGroup } from '@/types/schema/userGroup';
import { groupRole } from '@/types/schema/groupRoleForm';

const Component = () => {
    const roleService: RoleService = new RoleService();
    const router = useRouter();
    const { id }:any = useParams();
    const roleId: string = Array.isArray(id) ? id[0] : id;
    const [initialValues, setInitialValues] = useState<{ name: string, users: string[], roles: string[], groups: string[], companies: string[] }>({ name: '', users: [], roles: [], groups: [], companies: [] });

    useEffect(() => {
        fetchData(roleId);
    }, [roleId]);

    // useEffect(() => {
    //     // Hide the sidebar when the component mounts
    //     sidebarService.toggleSidebars(false);

    //     // Clean up: Reset sidebar when component unmounts
    //     return () => {
    //         sidebarService.toggleSidebars(false);
    //     };
    // }, []);

    const fetchData = async (id: string) => {
        try {
            const data = await roleService.getRoleById(id);
            const users = data.userRoles
                .map((userRole: UserRoles) => userRole.user.id)
                .filter((userId: string | undefined) => typeof userId === 'string');
            const groups = data.groupRoles
                .map((groupRole: UserDetailGroup) => groupRole?.group?.id)
                .filter((groupId: string | undefined) => typeof groupId === 'string');
            setInitialValues({ name: data.name, users, roles: [], groups, companies: [] });
        } catch (error) {
            console.error("Error fetching role", error);
        }
    }

    const updateRole = async (data: createRole) => {
        try {
            await roleService.updateRole(roleId, data);
            router.push("/admin/role");
        } catch (error) {
            console.error("Error updating role", error);
        }
    }

    const handleSelect = (selectedUsers: groupRole) => {
        const users: createRole = {
            name: selectedUsers.name,
            users: selectedUsers.users,
            groups: selectedUsers.groups || []
        };

        updateRole(users);
    };

    const onDiscard = () => {
        router.push("/admin/role");
    };

    return (
        <div>
            {initialValues.name ? (
                <GroupRoleFormComponent
                    showRole={false}
                    showGroup={true}
                    initialValues={initialValues}
                    onDiscard={onDiscard}
                    heading='Edit Role'
                    onSelect={handleSelect}
                    />
            ) : (
                <Loader />
            )}
        </div>
    );
};

const EditRoleComponent = withPermission(Component, "role.update.*");
export default EditRoleComponent;
