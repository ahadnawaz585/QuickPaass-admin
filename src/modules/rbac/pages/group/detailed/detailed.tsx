"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import withPermission from '@/components/HOC/withPermission';
import GroupService from '@/modules/rbac/services/group.service';
import Loader from '@/components/shared/loader/loader';
import GroupRoleService from '@/modules/rbac/services/groupRole.service';
import UserGroupService from '@/modules/rbac/services/userGroup.service';
import { Group, RoleGroup } from '@/types/schema/group';
// import sidebarService from '@/frontend/utilities/sidebar';
const FeaturePermissionComponent = React.lazy(() => import('@/modules/rbac/components/permission/permission'))
// import FeaturePermissionComponent from '../../permission/permission';
import RoleDetailsTable from '@/modules/rbac/components/roleGroupTable/roleGroupTable';
// import CompanyGroupService from '@/frontend/services/companyGroup.service';
import { UserGroup } from '@/types/schema/userGroup';
import { GroupRole } from '@/types/schema/groupRole';
// import { CompanyGroup } from '@/types/company';


const Component = () => {
    const userGroupService: UserGroupService = new UserGroupService();
    const groupRoleService: GroupRoleService = new GroupRoleService();
    // const companyGroupService: CompanyGroupService = new CompanyGroupService();
    const groupService: GroupService = new GroupService();
    const router = useRouter();
    const { id }:any = useParams();
    const groupId: string = Array.isArray(id) ? id[0] : id;
    const [data, setData] = useState<RoleGroup | null>(null);


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

    const updateUserGroup = async (id: string, obj: UserGroup) => {
        try {
            await userGroupService.updateGroup(id, obj);
            reRender();
        } catch (error) {
            console.error("error updating userGroup: ", error);
        }

    }


    const updateGroupRole = async (id: string, obj: GroupRole) => {
        try {
            await groupRoleService.updateRole(id, obj);
            reRender();
        } catch (error) {
            console.error("error updating Group role: ", error);
        }

    }

    // const updateGroupCompany = async (id: string, obj: CompanyGroup) => {
    //     try {
    //         await companyGroupService.updateGroup(id, obj);
    //         reRender();
    //     } catch (error) {
    //         console.error("error updating Group role: ", error);
    //     }

    // }

    const fetchData = async (id: string) => {
        try {
            const data = await groupService.getGroupById(id);
            setData(data);
            // console.log(data);
            // const users = data.userRoles
            //     .map((userRole: UserRoles) => userRole.user.id)
            //     .filter((userId: string | undefined) => typeof userId === 'string');
            // setInitialValues({ name: data.name, users });
        } catch (error) {
            console.error("Error fetching group", error);
        }
    }


    const reRender = () => {
        setData(null);
        fetchData(groupId);
    }

    const handleSwitchChange = async (id: string, isActive: boolean, tab: string, childId: string) => {
        if (tab === "Users") {
            const obj: UserGroup = {
                groupId: groupId,
                userId: childId,
                active: isActive,
            };

            await updateUserGroup(id, obj);

        } else if (tab === "Roles") {
            const obj: GroupRole = {
                roleId: childId,
                groupId: groupId,
                active: isActive
            };

            await updateGroupRole(id, obj);
        // } else if (tab === "Companies") {
        //     const obj: CompanyGroup = {
        //         companyId: childId,
        //         groupId: groupId,
        //         active: isActive
        //     };


        //     await updateGroupCompany(id, obj);
        }
    }


    const handleInfoClick = (tab: string, id: string) => {

        if (tab === "Users") {
            router.push(`/admin/user/${id}`)
        } else if (tab === "Roles") {
            router.push(`/admin/role/${id}`)
        // } else if (tab === "Companies") {
        //     router.push(`/company/${id}`)
        }
    }

    const handleDelete = async (id: string, tab: string) => {
        if (tab === "Users") {
            await userGroupService.deleteGroup(id);
        } else if (tab === "Roles") {
            await groupRoleService.deleteRole(id);
        // } else if (tab === "Companies") {
        //     await companyGroupService.deleteGroup(id);
        }
        await fetchData(groupId);

    };


    const handleEdit= async () => {
        router.push(`/admin/group/edit/${groupId}`)
    }

    const handleDeleteClick = async () => {
        try {
            await groupService.deleteGroup(groupId);
            router.push(`/admin/group/`)
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <div>
            {data ? (
                <> <RoleDetailsTable onDeleteClick={handleDeleteClick} editPermissions='group.edit.*' deletePermissions='group.delete.*' onEditClick={handleEdit}  onDelete={handleDelete} onSwitchChange={handleSwitchChange} role={data} onInfoClick={handleInfoClick} />
                    <FeaturePermissionComponent id={groupId} type='Group' /></>
            ) : (
                <Loader />
            )}
        </div>
    );
};

const DetailedGroupComponent = withPermission(Component, "group.read.*");
export default DetailedGroupComponent;
