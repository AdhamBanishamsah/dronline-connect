
import React, { useState, useEffect } from "react";
import { Image, X } from "lucide-react";

interface FileUploadProps {
  onUpload: (files: string[]) => void;
  maxFiles?: number;
  accept?: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
  initialFiles?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  maxFiles = 5,
  accept = "image/*",
  label,
  description,
  icon = <Image size={24} className="text-medical-primary" />,
  initialFiles = [],
}) => {
  const [files, setFiles] = useState<string[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (initialFiles.length > 0) {
      setFiles(initialFiles);
    }
  }, [initialFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Check if adding these files would exceed the limit
      if (files.length + fileArray.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} files.`);
        return;
      }
      
      // Convert files to data URLs for preview
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setFiles(prev => {
            const newFiles = [...prev, dataUrl];
            onUpload(newFiles);
            return newFiles;
          });
        };
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const fileArray = Array.from(e.dataTransfer.files);
      
      // Filter by accepted types if specified
      const validFiles = accept !== "*" 
        ? fileArray.filter(file => {
            const fileType = file.type.split('/')[0];
            const acceptedTypes = accept.split(',').map(type => type.trim().replace('*', ''));
            return acceptedTypes.some(type => file.type.includes(type));
          })
        : fileArray;
      
      // Check for max files
      if (files.length + validFiles.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} files.`);
        return;
      }
      
      // Process valid files
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setFiles(prev => {
            const newFiles = [...prev, dataUrl];
            onUpload(newFiles);
            return newFiles;
          });
        };
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onUpload(newFiles); // Make sure this is called with the updated files array
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-medical-primary bg-medical-secondary bg-opacity-20" : "border-gray-300"
        } transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          {icon}
          <h3 className="mt-2 text-sm font-medium text-gray-900">{label}</h3>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
          <div className="mt-4">
            <label className="cursor-pointer bg-medical-secondary text-medical-primary px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors">
              Select File
              <input
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
                multiple={maxFiles > 1}
              />
            </label>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {files.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={file}
                alt={`Uploaded file ${index + 1}`}
                className="h-24 w-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                aria-label="Remove file"
              >
                <X size={16} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
