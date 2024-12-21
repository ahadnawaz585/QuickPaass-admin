"use client";

import React, { useEffect, useState, useMemo } from "react";
import withPermission from "@/components/HOC/withPermission";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import styles from "./analytics.module.scss";
import UserService from "@/modules/rbac/services/user.service";
import RoleService from "@/modules/rbac/services/role.service";
import GroupService from "@/modules/rbac/services/group.service";
import AppFeatureService from "@/modules/rbac/services/feature.service";
import ItemService from "@/modules/gatePass/services/items.service";
import GatePassService from "@/modules/gatePass/services/gatePass.service";
import CustomerService from "@/modules/gatePass/services/customer.service";
import { permission } from "@/auth/access.service";
import { ReportData } from "@/types/gatePass/paginatedData";

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
  const userService = new UserService();
  const roleService = new RoleService();
  const groupService = new GroupService();
  const featuresService = new AppFeatureService();
  const itemService = new ItemService();
  const gatePassService = new GatePassService();
  const customerService = new CustomerService();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalGatePasses, setTotalGatePasses] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalRoles, setTotalRoles] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [totalFeatures, setTotalFeatures] = useState(0);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAnalyticsGraphs, setShowAnalyticsGraphs] = useState(false);

  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        const hasPermission = await permission("analytics.read.*");
        setShowAnalyticsGraphs(await permission('analytics.graphs.*'))
        setShowAnalytics(hasPermission);

        if (hasPermission) {
          const [
            users,
            items,
            gatePasses,
            roles,
            groups,
            features,
            customers,
          ] = await Promise.all([
            userService.getTotalUser(),
            itemService.getTotalItem(),
            gatePassService.getTotalGatePass(),
            roleService.getTotalRoles(),
            groupService.getTotalGroups(),
            featuresService.getTotalAppFeature(),
            customerService.getTotalCustomer(),
          ]);

          setTotalUsers(users);
          setTotalItems(items);
          setTotalGatePasses(gatePasses);
          setTotalRoles(roles);
          setTotalGroups(groups);
          setTotalFeatures(features);
          setTotalCustomers(customers);

          const graphData = await gatePassService.getGatePassReport();
          setReportData(graphData);
        }
      } catch (error) {
        console.error("Error loading analytics data:", error);
      }
    };

    initializeAnalytics();
  }, []);

  const chartData = useMemo(() => ({
    labels: reportData.map((item) => item.month),
    datasets: [
      {
        label: "Gate Pass Count",
        data: reportData.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  }), [reportData]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Monthly Gate Pass Count" },
    },
  }), []);

  const pieChartData = useMemo(() => ({
    labels: ["Users", "Roles", "Groups", "Features", "Customers", "Gate Passes", "Items"],
    datasets: [
      {
        data: [totalUsers, totalRoles, totalGroups, totalFeatures, totalCustomers, totalGatePasses, totalItems],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }), [totalUsers, totalRoles, totalGroups, totalFeatures, totalCustomers, totalGatePasses, totalItems]);

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {showAnalytics && (
          <div className={styles.analytics}>
            <h2 className={styles.heading}>Dashboard Overview</h2>
            <div className={styles.dashboardOverview}>
              {[{ label: "Total Users", value: totalUsers },
                { label: "Total Roles", value: totalRoles },
                { label: "Total Groups", value: totalGroups },
                { label: "Total Features", value: totalFeatures },
                { label: "Total Customers", value: totalCustomers },
                { label: "Total Gate Passes", value: totalGatePasses },
                { label: "Total Items", value: totalItems },
              ].map(({ label, value }) => (
                <div key={label} className={styles.metric}>
                  <h3 className={styles.head}>{label}</h3>
                  <p className={styles.head}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {showAnalyticsGraphs && <div className={styles.analytics}>
          <h2 className={styles.heading}>Graphs</h2>
          <div className={styles.graphs}>
            <div className={styles.graph}>
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className={styles.graph}>
              <Pie data={pieChartData} />
            </div>
          </div>
        </div>}
      </main>
    </div>
  );
};

const AdminComponent = withPermission(Analytics, "analytics.read.*");

export default AdminComponent;
