"use client"
import React, { useEffect, useState } from 'react';
import withPermission from '@/components/HOC/withPermission';

import styles from './analytics.module.scss';
import UserService from '@/service/user.service';
import RoleService from '@/service/role.service';
import GroupService from '@/service/group.service';
import AppFeatureService from '@/service/feature.service';

const  Analytics = () => {
  const userService: UserService = new UserService();
  const roleService: RoleService = new RoleService();
  const groupService: GroupService = new GroupService();
  const featuresService: AppFeatureService = new AppFeatureService();
//   const companyService: CompanyService = new CompanyService();

  const [totalUser, SetTotalUser] = useState<number>(0);
  const [totalCompany, SetTotalCompany] = useState<number>(0);
  const [totalRole, SetTotalRoles] = useState<number>(0);
  const [totalGroup, SetTotalGroups] = useState<number>(0);
  const [totalFeatures, SetTotalFeatures] = useState<number>(0);

  useEffect(() => {
    getTotal();
  })

//   useEffect(() => {
//     // Hide the sidebar when the component mounts
//     sidebarService.toggleSidebars(false);

//     // Clean up: Reset sidebar when component unmounts
//     return () => {
//       sidebarService.toggleSidebars(false);
//     };
//   }, []);

  const getTotal = async () => {
    SetTotalUser(await userService.getTotalUser());
    // SetTotalCompany(await companyService.getTotalCompany());
    SetTotalRoles(await roleService.getTotalRoles());
    SetTotalGroups(await groupService.getTotalGroups());
    SetTotalFeatures(await featuresService.getTotalAppFeature());
  }

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h2 className={styles.heading}>Dashboard Overview</h2>
        <div className={styles.dashboardOverview}>
          <div className={styles.metric}>
            <h3 className={styles.head}>Total Users</h3>
            <p className={styles.head}>{totalUser}</p>
          </div>
          <div className={styles.metric}>
            <h3 className={styles.head}>Total Roles</h3>
            <p className={styles.head}>{totalRole}</p>
          </div>
          <div className={styles.metric}>
            <h3 className={styles.head}>Total Groups</h3>
            <p className={styles.head}>{totalGroup}</p>
          </div>
          <div className={styles.metric}>
            <h3 className={styles.head}>Total Features</h3>
            <p className={styles.head}>{totalFeatures}</p>
          </div>
          {/* <div className={styles.metric}>
            <h3 className={styles.head}>Total Company</h3>
            <p className={styles.head}>{totalCompany}</p>
          </div> */}
        </div>
      </main>

    </div>
  );
};

const AdminComponent = withPermission( Analytics, 'setting.*');

export default AdminComponent;