import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSingleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleMultipleFilesChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleSingleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', 1); // Add user ID to the form data

    try {
      const response = await axios.post('http://localhost:3001/api/uploads/upload-single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Single file upload success:', response.data);
    } catch (error) {
      console.error('Single file upload error:', error);
    }
  };

  const handleMultipleFilesUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }
    formData.append('userId', 1); // Add user ID to the form data

    try {
      const response = await axios.post('http://localhost:3001/api/uploads/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Multiple files upload success:', response.data);
    } catch (error) {
      console.error('Multiple files upload error:', error);
    }
  };

  return (
    <div>
      <h2>Single File Upload</h2>
      <input type="file" onChange={handleSingleFileChange} />
      <button onClick={handleSingleFileUpload}>Upload Single File</button>

      <h2>Multiple Files Upload</h2>
      <input type="file" multiple onChange={handleMultipleFilesChange} />
      <button onClick={handleMultipleFilesUpload}>Upload Multiple Files</button>
    </div>
  );
};

export default FileUpload;
