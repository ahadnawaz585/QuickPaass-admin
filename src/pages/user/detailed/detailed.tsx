"use client"
import React, { useState, useEffect } from 'react';
import PageEvent from '@mui/material/Pagination';
import Loader from '@/components/shared/loader/loader';
import UserGroupService from '@/service/userGroup.service';
import UserRoleService from '@/service/userRole.service';
import UserService from '@/service/user.service';
import { UserCreateData } from '@/types/schema/user';
// import sidebarService from '@/frontend/utilities/sidebar';
import withPermission from '@/components/HOC/withPermission';
import { useRouter, useParams } from 'next/navigation';
import { UserRole } from '@/types/schema/role';
import { UserGroup } from '@/types/schema/userGroup';
const FeaturePermissionComponent = React.lazy(() => import('@/components/shared/permission/permission'))
const DetailedUserData = React.lazy(() => import('@/components/shared/detailedUser/detailedUser'))


import styles from "./detailed.module.scss";
// import CompanyUserService from '@/frontend/services/companyUser.service';
// import { CompanyGroup, CompanyUser, createCompany, createCompanyUser } from '@/types/company';

const Component = () => {
    const userService: UserService = new UserService();
    const userRoleService: UserRoleService = new UserRoleService();
    const userGroupService: UserGroupService = new UserGroupService();
    // const userCompanyService: CompanyUserService = new CompanyUserService();
    const [userRole, setUserRoles] = useState([]);
    const [userGroup, setUserGroups] = useState([]);
    const [companyUser, setCompanyUser] = useState([]);
    const [companyId, setCompanyId] = useState<string>('');
    const [userData, setUserData] = useState<UserCreateData | null>(null);

    const router = useRouter();
    const { id }:any = useParams();
    const userId = Array.isArray(id) ? id[0] : id;

    // useEffect(() => {
    //     // Hide the sidebar when the component mounts
    //     sidebarService.toggleSidebars(false);

    //     // Clean up: Reset sidebar when component unmounts
    //     return () => {
    //         sidebarService.toggleSidebars(false);
    //     };
    // }, []);

    useEffect(() => {
        fetchData(userId);
        getUserRole(userId);
        getUserGroup(userId);
        // getUserCompany(userId);
    }, [userId]);



    const handleDelete = async (id: string, tab: string) => {
        if (tab === "roles") {
            await userRoleService.deleteRole(id);
        } else if (tab === "groups") {
            await userGroupService.deleteGroup(id);}
        // } else if (tab === "companies") {
        //     await userCompanyService.deleteUser(id);
        // }

        await reRender();
    };


    const getUserRole = async (id: string) => {
        try {
            const data = await userRoleService.getRoleByUserId(id);
            setUserRoles(data);
        } catch (error) {
            console.log("error fetching user roles", error)
        }
    }

    const getUserGroup = async (id: string) => {
        try {
            const data = await userGroupService.getGroupByUserId(id);
            setUserGroups(data);
        } catch (error) {
            console.log("error fetching user roles", error)
        }
    }

    // const getUserCompany = async (id: string) => {
    //     try {
    //         const data = await userCompanyService.getCompanyByUserId(id);
    //         setCompanyUser(data);
    //     } catch (error) {
    //         console.log("error fetching company users", error)
    //     }
    // }


    const fetchData = async (id: string) => {
        try {
            const data = await userService.getDetailedUserById(id);
            setUserData(data);
            // setCompanyId(data?.defaultCompanyId || '');
        } catch (error) {
            console.log("error fetching userdata: ", error);
        }
    }

    const updateRole = async (id: string, data: UserRole) => {
        try {
            await userRoleService.updateRole(id, data);

        } catch (error) {
            console.log("error updating user role: ", error);
        }
    }

    const updateGroup = async (id: string, data: UserGroup) => {
        try {
            await userGroupService.updateGroup(id, data);
        } catch (error) {
            console.log("error updating user group: ", error);
        }
    }

    // const updateCompany = async (id: string, data: createCompanyUser) => {
    //     try {
    //         await userCompanyService.updateUser(id, data);
    //     } catch (error) {
    //         console.log("error updating company: ", error);
    //     }
    // }

    const handleSwitchChange = async (id: string, isActive: boolean, tab: string, childId: string) => {
        try {
            if (tab === "roles") {
                const role: UserRole = {
                    userId: userId,
                    roleId: childId,
                    active: isActive,
                };
                await updateRole(id, role);
            }

            if (tab === "groups") {
                const group: UserGroup = {
                    userId: userId,
                    groupId: childId,
                    active: isActive,
                };
                await updateGroup(id, group);
            }

            // if (tab === "companies") {
            //     const company: createCompanyUser = {
            //         userId: userId,
            //         companyId: childId,
            //         active: isActive,
            //     };
            //     await updateCompany(id, company);
            // }

            reRender();
        } catch (error) {
            console.log("Error updating user data: ", error);
        }
    };

    const handleInfoClick = (id: string, tab: string,) => {

        if (tab === "roles") {
            router.push(`/admin/role/${id}`)
        } else if (tab === "groups") {
            router.push(`/admin/group/${id}`)
        // } else if (tab === "companies") {
        //     router.push(`/company/${id}`)
        }
    }

    const reRender = async () => {
        setUserData(null);


        await fetchData(userId);
        await getUserRole(userId);
        await getUserGroup(userId);
        // await getUserCompany(userId);
    }

    const handleRowSelection = async (id: string) => {

        try {
            await userService.changeCompany(userId, id);
            reRender();
        } catch (error) {
            console.error(error);
        }
    }

    const handleEdit = async () => {
        router.push(`/admin/user/edit/${userId}`)
    }

    const handleDeleteClick = async () => {
        try {
            await userService.deleteuser(userId);
            router.push(`/admin/user/`)
        } catch (error) {
            console.error(error);
        }
    }

    if (!userData) return <Loader />;

    return (
        <div>

            <DetailedUserData
                editPermissions='user.edit.*'
                deletePermissions='user.delete.*'
                onDeleteClick={handleDeleteClick} onEditClick={handleEdit}
                onRowSelect={handleRowSelection}
                defaultCompanyId={companyId}
                onInfoClick={handleInfoClick}
                onDelete={handleDelete}
                userId={userId}
                data={{ username: userData.username, userRole, userGroup }}
                onSwitchChange={handleSwitchChange}
            />



            <FeaturePermissionComponent id={userId} type='User' />
        </div>
    )
}

const DetaileUser = withPermission(Component, "user.read.*");
export default DetaileUser;
