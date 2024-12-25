import React from 'react';
import { CloudUpload, InsertDriveFile, Close } from '@mui/icons-material';

interface FileUploadSectionProps {
  isDragging: boolean;
  selectedFiles: File[];
  uploading: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  maxFiles: number; // Add maxFiles to control the number of allowed files
  maxFileSize: number; // Add maxFileSize to control the file size (5MB)
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  isDragging,
  selectedFiles,
  uploading,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onUpload,
  maxFiles,
  maxFileSize,
}) => {
  const removeFile = (index: number) => {
    const newFiles = Array.from(selectedFiles);
    newFiles.splice(index, 1);
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    const event = { target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>;
    onFileSelect(event);
  };

  // New file selection handler with size validation
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = [];

    for (const file of files) {
      if (file.size <= maxFileSize) {
        validFiles.push(file);
      } else {
        alert(`File ${file.name} exceeds the maximum size of 5MB.`);
      }
    }

    if (validFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      validFiles.forEach(file => dataTransfer.items.add(file));
      const event = { target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>;
      onFileSelect(event);
    }
  };

  return (
    <div className="space-y-6">
      {/* Only show file upload section if there are less than maxFiles */}
      {selectedFiles.length < maxFiles && (
        <div 
          className={`files-tab__upload-section group ${isDragging ? 'files-tab__upload-section--active' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="text-center">
            <CloudUpload className="mx-auto h-16 w-16 text-blue-500 group-hover:text-blue-600 transition-colors duration-200" />
            <p className="mt-4 text-lg text-gray-600">Drag and drop your files here</p>
            <p className="mt-2 text-sm text-gray-500">or</p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect} // Use the new file select handler
              className="hidden"
              id="file-upload"
              accept="*/*" // Allow any file type
            />
            <label
              htmlFor="file-upload"
              className="mt-4 inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-lg
                       hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
            >
              Browse Files
            </label>
            <p className="mt-2 text-xs text-gray-400">
              Any type of file (max {maxFiles} files, each file max {maxFileSize / (1024 * 1024)} MB)
            </p>
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-700">Selected Files</h4>
            <span className="text-sm text-gray-500">{selectedFiles.length} file(s)</span>
          </div>
          <ul className="divide-y divide-gray-100">
            {selectedFiles.map((file, index) => (
              <li key={index} className="py-3 flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <InsertDriveFile className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Close className="h-4 w-4 text-gray-500" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
            <button
              className="files-tab__upload-button inline-flex items-center"
              onClick={onUpload}
              disabled={uploading}
            >
              <CloudUpload className="h-5 w-5 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
