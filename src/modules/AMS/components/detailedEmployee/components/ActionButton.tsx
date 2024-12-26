import React from 'react';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/ActionButtons.scss';

interface ActionButtonsProps {
  onPrint: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete, onPrint }) => {
  return (
    <div className="action-buttons">
      <button 
        onClick={onPrint}
        className="action-buttons__btn action-buttons__btn--print"
      >
        <PrintIcon />
      </button>
      <button 
        onClick={onEdit}
        className="action-buttons__btn action-buttons__btn--edit"
      >
        <EditIcon />
      </button>
      <button 
        onClick={onDelete}
        className="action-buttons__btn action-buttons__btn--delete"
      >
        <DeleteIcon />
      </button>
    </div>
  );
};

export default ActionButtons;