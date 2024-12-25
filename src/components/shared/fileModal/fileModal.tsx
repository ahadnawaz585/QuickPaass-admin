import React, { useState, useEffect } from 'react';
import { Close, Download ,InsertDriveFile} from '@mui/icons-material';

interface FileModalProps {
  open: boolean;
  handleClose: () => void;
  fileUrl: string;
  fileName: string;
}

const FileModal: React.FC<FileModalProps> = ({ open, handleClose, fileUrl, fileName }) => {
  const [isPreviewable, setIsPreviewable] = useState(false);

  useEffect(() => {
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    const previewableTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp4', 'webm', 'svg'];
    setIsPreviewable(previewableTypes.includes(fileExtension || ''));
  }, [fileUrl]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-4/5 h-4/5 p-6 relative overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{fileName}</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Close />
          </button>
        </div>

        <div className="mt-4">
          {isPreviewable ? (
            <div>
              {fileUrl.endsWith('.pdf') ? (
                <embed src={fileUrl} width="100%" height="700px" type="application/pdf" />
              ) : fileUrl.endsWith('.mp4') || fileUrl.endsWith('.webm') ? (
                <video src={fileUrl} width="100%" height="600px" controls />
              ) : fileUrl.endsWith('.svg') ? (
                <embed src={fileUrl} width="100%" height="600px" type="image/svg+xml" />
              ) : (
                <img src={fileUrl} alt={fileName} className="max-w-full max-h-[600px] object-contain mx-auto" />
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-gray-100 h-[200px] flex items-center justify-center mb-4">
                <InsertDriveFile className="h-20 w-20 text-gray-400" />
              </div>
              <a
                href={fileUrl}
                download={fileName}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="mr-2" />
                Download {fileName}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileModal;