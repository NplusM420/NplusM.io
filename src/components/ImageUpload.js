import React, { useState } from 'react';
import axios from 'axios';
import styles from './ImageUpload.module.css';

const ImageUpload = ({ onUploadSuccess, uploadUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      onUploadSuccess(response.data.path);
      setError(null);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
    }
  };

  return (
    <div className={styles.imageUpload}>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {previewUrl && <img src={previewUrl} alt="Preview" className={styles.preview} />}
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ImageUpload;