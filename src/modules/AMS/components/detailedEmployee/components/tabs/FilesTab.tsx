import React, { useState, useEffect } from 'react';
import { Employee } from "@/types/AMS/employee";
import EmployeeService from '@/modules/AMS/services/employee.service';
import { environment } from "@/environment/environment";
import FileUploadSection from './FileUploadSection';
import FileCard from './FileCard';
import FileModal from '@/components/shared/fileModal/fileModal';
import '../../styles/FilesTab.scss';

interface FilesTabProps {
  employee: Employee;
}

interface FileInfo {
  fileName: string;
  filePath: string;
}

const FilesTab: React.FC<FilesTabProps> = ({ employee }) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const maxFileSize = 5 * 1024 * 1024;
  const employeeService = new EmployeeService();

  useEffect(() => {
    fetchFiles();
  }, [employee.id]);

  const fetchFiles = async () => {
    try {
      const fetchedFiles = await employeeService.getFiles(employee.id);
      setFiles(fetchedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
  
    setUploading(true);
    const formData = new FormData();
    formData.append('employeeId', employee.id); // Ensure employee.id is populated
    formData.append('employeeName', employee.name); // Ensure employee.name is populated
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
  
    try {
      await employeeService.uploadFile(formData);
      await fetchFiles();
      setSelectedFiles([]); // Clear selected files after upload
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await employeeService.deleteFiles(employee.id, fileName);
        await fetchFiles();
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const handleFileClick = (file: FileInfo) => {
    setSelectedFileUrl(`${environment.apiUrl}/${file.filePath}`);
    setSelectedFileName(file.fileName);
    setModalOpen(true);
  };

  return (
    <div className="files-tab__container">
      <div className="files-tab__header">
        <h3>Documents</h3>
      </div>

    { <FileUploadSection
      maxFileSize={maxFileSize}
        isDragging={isDragging}
        selectedFiles={selectedFiles}
        uploading={uploading}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFileSelect={handleFileSelect}
        onUpload={handleUpload}
        maxFiles={5} // Limit to 5 files
      />}

      <div className="files-tab__files-grid">
        {files.map((file, index) => (
          <FileCard
            key={index}
            fileName={file.fileName}
            onDelete={() => handleDelete(file.fileName)}
            onClick={() => handleFileClick(file)}
          />
        ))}
      </div>

      <FileModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        fileUrl={selectedFileUrl}
        fileName={selectedFileName}
      />
    </div>
  );
};

export default FilesTab;
