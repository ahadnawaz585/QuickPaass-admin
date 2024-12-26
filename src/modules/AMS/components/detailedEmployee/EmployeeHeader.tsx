import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Import QRCode component
import { Employee } from "@/types/AMS/employee";
import { calculateAge, calculateWorkDuration } from '@/utils/date';
import InfoItem from './components/InfoItem';
import Barcode from 'react-barcode';
import ImageModal from './components/ImageModal';
import ActionButtons from './components/ActionButton';
import './styles/EmployeeHeader.scss';

interface EmployeeHeaderProps {
  employee: Employee;
  onPrint: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ employee, onEdit, onDelete ,onPrint}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const age = calculateAge(employee.dob.toString());
  const workDuration = calculateWorkDuration(employee.joiningDate.toString());

  return (
    <>
      <div className="employee-header">
        <div className="employee-header__top">
          <h1 className="text-lg text-gray-600">Employee Details</h1>
          <ActionButtons onEdit={onEdit} onDelete={onDelete} onPrint={onPrint} />
        </div>

        <div className="employee-header__profile">
          <div
            className="employee-header__image-container"
            onClick={() => setShowImageModal(true)}
          >
            <div className="employee-header__image">
              <img
                src={employee.image}
                alt={`${employee.name} ${employee.surname}`}
              />
            </div>
          </div>

          <div className="employee-header__info">
            <div className="employee-header__title">
              <h2>{`${employee.name} ${employee.surname}`}</h2>
              <p>{employee.designation}</p>
              <p>{employee.department}</p>
              <div className="employee-header__qr">
                {/* <Barcode value={employee.code} width={1} height={30} /> */}
                <QRCodeSVG value={employee.code} size={80} />
              </div>

            </div>

            <div>
              <InfoItem label="Employee Code" value={employee.code} />
              {/* Display the QR code for the employee code */}
              <InfoItem label="Age" value={`${age} years`} />
              <InfoItem label="Work Duration" value={workDuration} />
            </div>

            <div>
              <InfoItem label="Contact" value={employee.contactNo} />
              <InfoItem label="Blood Group" value={employee.bloodGroup} />
              <InfoItem label="Address" value={employee.address} />
            </div>

          </div>
        </div>
      </div>

      {showImageModal && (
        <ImageModal
          imageUrl={employee?.image || ''}
          alt={`${employee.name} ${employee.surname}`}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </>
  );
};

export default EmployeeHeader;
