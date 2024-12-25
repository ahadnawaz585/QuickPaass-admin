import React from 'react';

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="info-item">
    <p className="info-item__label">{label}</p>
    <p className="info-item__value">{value}</p>
  </div>
);

export default InfoItem;