import React from 'react';
import {
    Bar as RechartsBar,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
    BarChart as RechartsBarChart,
} from 'recharts';
import { LeaveAllocation } from '@/types/AMS/leave';
import styles from './LeaveAnalytics.module.scss';
import BarChartIcon from '@mui/icons-material/BarChart'; // Rename to avoid conflict

interface LeaveAnalyticsProps {
    allocations: LeaveAllocation[];
}

export const LeaveAnalytics = ({ allocations }: LeaveAnalyticsProps) => {
    const monthlyData = allocations.reduce((acc: any[], curr) => {
        const month = new Date(curr.allocationStartDate).getMonth();
        const monthName = new Date(curr.allocationStartDate).toLocaleString('default', { month: 'short' });

        const existingMonth = acc.find((item) => item.month === monthName);
        if (existingMonth) {
            existingMonth.totalDays += curr.assignedDays;
            existingMonth.count += 1;
        } else {
            acc.push({
                month: monthName,
                totalDays: curr.assignedDays,
                count: 1,
            });
        }
        return acc;
    }, []);

    const leaveTypeData = allocations.reduce((acc: any[], curr) => {
        const existingType = acc.find((item) => item.type === curr?.leaveConfigId || '');
        if (existingType) {
            existingType.value += curr.assignedDays;
        } else {
            acc.push({
                type: curr?.leaveConfigId || '',
                value: curr.assignedDays,
            });
        }
        return acc;
    }, []);

    return (
        <div className={styles.analyticsContainer}>
            <div className={styles.card}>
                <h3>Monthly Leave Distribution</h3>
                <LineChart width={320} height={200} data={leaveTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Days Allocated" />
                </LineChart>
            </div>

            <div className={styles.card}>
                <h3>Leave Type Distribution</h3>
                <RechartsBarChart
                    width={300}
                    height={300}
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <RechartsBar dataKey="totalDays" fill="#8884d8" name="Total Days" />
                    <RechartsBar dataKey="count" fill="#82ca9d" name="Number of Allocations" />
                </RechartsBarChart>
            </div>

            <div className={styles.statsCards}>
                <div className={styles.statCard}>
                    <h4>Total Allocations</h4>
                    <p>{allocations.length}</p>
                </div>
                <div className={styles.statCard}>
                    <h4>Total Days Allocated</h4>
                    <p>{allocations.reduce((sum, curr) => sum + curr.assignedDays, 0)}</p>
                </div>
                <div className={styles.statCard}>
                    <h4>Average Days per Allocation</h4>
                    <p>
                        {(
                            allocations.reduce((sum, curr) => sum + curr.assignedDays, 0) /
                                allocations.length || 0
                        ).toFixed(1)}
                    </p>
                </div>
            </div>
        </div>
    );
};
