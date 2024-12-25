import React from 'react';
import '../styles/ActionButtons.scss';

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  return (
    <div className="action-buttons">
      <button 
        onClick={onEdit}
        className="action-buttons__btn action-buttons__btn--edit"
      >
        Edit
      </button>
      <button 
        onClick={onDelete}
        className="action-buttons__btn action-buttons__btn--delete"
      >
        Delete
      </button>
    </div>
  );
};

export default ActionButtons;