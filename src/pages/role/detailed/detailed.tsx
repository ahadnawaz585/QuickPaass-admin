"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import withPermission from '@/components/HOC/withPermission';
import RoleService from '@/service/role.service';
import Loader from '@/components/shared/loader/loader';
import UserRoleService from '@/service/userRole.service';
import GroupRoleService from '@/service/groupRole.service';
import { createRole, detailedRole, UserRole, UserRoles } from '@/types/schema/role'; // Import UserRoles
import RoleDetailsTable from '@/components/shared/roleGroupTable/roleGroupTable';
import { GroupRole } from '@/types/schema/groupRole';
import FeaturePermissionComponent from '@/components/shared/permission/permission';
// import sidebarService from '@/frontend/utilities/sidebar';

const Component = () => {
    const userRoleService: UserRoleService = new UserRoleService();
    const groupRoleService: GroupRoleService = new GroupRoleService();
    const roleService: RoleService = new RoleService();
    const router = useRouter();
    const { id }:any = useParams();
    const roleId: string = Array.isArray(id) ? id[0] : id;
    const [data, setData] = useState<detailedRole | null>(null);

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
            setData(data);
            // const users = data.userRoles
            //     .map((userRole: UserRoles) => userRole.user.id)
            //     .filter((userId: string | undefined) => typeof userId === 'string');
            // setInitialValues({ name: data.name, users });
        } catch (error) {
            console.error("Error fetching role", error);
        }
    }

    const updateUserRole = async (id: string, obj: UserRole) => {
        try {
            await userRoleService.updateRole(id, obj);
            setData(null);
        } catch (error) {
            console.error("error updating userRole: ", error);
        }
    }

    const updateGroupRole = async (id: string, obj: GroupRole) => {
        try {
            await groupRoleService.updateRole(id, obj);
            setData(null);

        } catch (error) {
            console.error("error updating groupRole: ", error);
        }
    }

    const handleDelete = async(id: string, tab: string) => {
        if (tab === "Users") {
            await  userRoleService.deleteRole(id);
        } else if (tab === "Groups") {
            await  groupRoleService.deleteRole(id);
        }
        await fetchData(roleId);

    };

    const handleInfoClick = (tab: string, id: string) => {

        if (tab === "Users") {
            router.push(`/admin/user/${id}`)
        } else if (tab === "Groups") {
            router.push(`/admin/group/${id}`)
        } 
    }


  const handleEdit= async () => {
        router.push(`/admin/role/edit/${roleId}`)
    }

    const handleDeleteClick = async () => {
        try {
            await roleService.deleteRole(roleId);
            router.push(`/admin/role/`)
        } catch (error) {
            console.error(error);
        }
    }


    const handleSwitchChange = async (id: string, isActive: boolean, tab: string, childId: string) => {
        if (tab === "Users") {
            const obj: UserRole = {
                roleId: roleId,
                userId: childId,
                active: isActive,
            };
            await updateUserRole(id, obj);

        } else if (tab === "Groups") {
            const obj: GroupRole = {
                roleId: roleId,
                groupId: childId,
                active: isActive
            };

            await updateGroupRole(id, obj);
        }
        await fetchData(roleId);
    }


    return (
        <div>
            {data ? (
                <> <RoleDetailsTable editPermissions='role.edit.*' deletePermissions='role.delete.*' onDeleteClick={handleDeleteClick} onEditClick={handleEdit} onInfoClick={handleInfoClick} onDelete={handleDelete} onSwitchChange={handleSwitchChange} role={data} />
                    <FeaturePermissionComponent id={roleId} type='Role' /></>
            ) : (
                <Loader />
            )}
        </div>
    );
};

const DetailedRoleComponent = withPermission(Component, "role.read.*");
export default DetailedRoleComponent;
