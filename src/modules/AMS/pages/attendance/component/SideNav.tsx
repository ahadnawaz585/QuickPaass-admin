import React from 'react';
import './SideNav.scss';

interface SideNavProps {
  onCategorySelect: (status: AttendanceStatus) => void;
}

enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  ON_LEAVE = "ON_LEAVE",
}

const categories = [
  { label: "Present", status: AttendanceStatus.PRESENT },
  { label: "Absent", status: AttendanceStatus.ABSENT },
  { label: "Late", status: AttendanceStatus.LATE },
  { label: "On Leave", status: AttendanceStatus.ON_LEAVE },
];

const SideNav: React.FC<SideNavProps> = ({ onCategorySelect }) => {
  return (
    <div className="side-nav">
      <h2 className="side-nav__title">Employee Attendance</h2>
      <ul className="side-nav__list">
        {categories.map(({ label, status }) => (
          <li key={status} className="side-nav__item">
            <button className="side-nav__button" onClick={() => onCategorySelect(status)}>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
