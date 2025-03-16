import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, disabled }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    disabled,
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        transition-colors duration-300
        ${isDragActive ? 'border-naruto-orange bg-naruto-orange/10' : 'border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-naruto-orange hover:bg-naruto-orange/5'}
      `}
    >
      <input {...getInputProps()} />
      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-sm text-gray-600">
        {isDragActive
          ? "Drop the image here..."
          : "Drag 'n' drop a food image, or click to select"}
      </p>
    </div>
  );
}