import React from 'react';
import { InsertDriveFile, Delete } from '@mui/icons-material';

interface FileCardProps {
  fileName: string;
  onDelete: () => void;
  onClick: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ fileName, onDelete, onClick }) => {
  return (
    <div className="files-tab__file-card">
      <div className="files-tab__file-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          <Delete className="h-4 w-4" />
        </button>
      </div>
      <div
        className="cursor-pointer"
        onClick={onClick}
      >
        <InsertDriveFile className="files-tab__file-icon" />
        <p className="files-tab__file-name">{fileName}</p>
      </div>
    </div>
  );
};

export default FileCard;