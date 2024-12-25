import React from 'react';

interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`detailed-employee__tab-button ${
      isActive ? 'detailed-employee__tab-button--active' : 'detailed-employee__tab-button--inactive'
    }`}
  >
    {label}
  </button>
);

export default TabButton;