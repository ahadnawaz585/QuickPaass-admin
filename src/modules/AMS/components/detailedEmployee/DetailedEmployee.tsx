import React, { useState } from 'react';
import { Employee } from "@/types/AMS/employee";
import EmployeeHeader from './EmployeeHeader';
import AttendanceTab from './components/tabs/AttendanceTab';
import LeavesTab from './components/tabs/LeavesTab';
import FilesTab from './components/tabs/FilesTab';
import TimetableTab from './components/tabs/TimeTableTab';
import TabButton from './components/TabButton';
import './styles/DetailedEmployee.scss';

interface DetailedEmployeeProps {
  employee: Employee;
  onPrint: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DetailedEmployee: React.FC<DetailedEmployeeProps> = ({ 
  employee, 
  onEdit, 
  onPrint,
  onDelete 
}) => {
  const [activeTab, setActiveTab] = useState('attendance');

  const tabs = [
    { id: 'attendance', label: 'Attendance' },
    { id: 'leaves', label: 'Leaves' },
    { id: 'files', label: 'Files' },
    { id: 'timetable', label: 'Timetable' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'attendance':
        return <AttendanceTab />;
      case 'leaves':
        return <LeavesTab />;
      case 'files':
        return <FilesTab employee={employee} />;
      case 'timetable':
        return <TimetableTab />;
      default:
        return null;
    }
  };

  return (
    <div className="detailed-employee">
      <EmployeeHeader 
        employee={employee} 
        onPrint={onPrint}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      
      <div className="detailed-employee__tabs">
        <div className="detailed-employee__nav">
          <nav>
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
        </div>
        
        <div className="detailed-employee__content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DetailedEmployee;