import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const singleFileInputRef = useRef(null);
  const multipleFilesInputRef = useRef(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/uploads/documents/1');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFiles(data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

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
      setFiles([...files, response.data.data[0]]);
      setSelectedFile(null)
      singleFileInputRef.current.value = '';
      
      
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
      setFiles([...files, ...response.data.files]);
      setSelectedFiles([])
      multipleFilesInputRef.current.value = '';
    } catch (error) {
      console.error('Multiple files upload error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/uploads/delete/${id}`);
      setFiles(files.filter(file => file.id !== id));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/uploads/download/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div>
      <h2>Single File Upload</h2>
      <input type="file" ref={singleFileInputRef} onChange={handleSingleFileChange} />
      <button onClick={handleSingleFileUpload}>Upload Single File</button>

      <h2>Multiple Files Upload</h2>
      <input type="file" ref={multipleFilesInputRef} multiple onChange={handleMultipleFilesChange} />
      <button onClick={handleMultipleFilesUpload}>Upload Multiple Files</button>

      <h2>Uploaded Files</h2>
      <div>
      
        {files.map((file) => (
          <div key={file.id} style={{ display: 'flex', alignItems: 'center' }}>
            <span>{file.filename}</span>
            <button onClick={() => handleDownload(file.id, file.filename)}>Download</button>
            <button onClick={() => handleDelete(file.id)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
