import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styles from './ServiceManager.module.css';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/services/${id}`, updatedData);
      fetchServices();
    } catch (error) {
      console.error('Failed to update service:', error);
      setError('Failed to update service');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/services/${id}`);
      fetchServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
      setError('Failed to delete service');
    }
  };

  const handleCreate = async (newService) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/services`, {
        ...newService,
        image_url: ''  // Initialize with empty string
      });
      fetchServices();
    } catch (error) {
      console.error('Failed to create new service:', error);
      setError('Failed to create new service');
    }
  };

  const handleServiceImageUpload = async (serviceId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/upload/service/${serviceId}`,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.path) {
        await handleUpdate(serviceId, { image_url: response.data.path });
      }
    } catch (error) {
      console.error('Failed to update service image:', error);
      setError('Failed to update service image');
    }
  };

  return (
    <div className={styles.serviceManager}>
      <h2>Manage Services</h2>
      {error && <div className={styles.error}>{error}</div>}
      <NewServiceForm onCreate={handleCreate} />
      {isLoading ? (
        <div className={styles.loading}>Loading services...</div>
      ) : (
        <div className={styles.serviceGrid}>
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onImageUpload={handleServiceImageUpload}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ServiceCard = ({ service, onUpdate, onDelete, onImageUpload }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState(service);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedService(prev => ({ ...prev, [name]: value }));
  };

  const handleFeaturesChange = (index, value) => {
    const newFeatures = [...editedService.features];
    newFeatures[index] = value;
    setEditedService(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = () => {
    onUpdate(service.id, editedService);
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(service.id, file);
    }
  };

  return (
    <motion.div 
      className={styles.serviceCard}
      whileHover={{ scale: 1.05 }}
    >
      {isEditing ? (
        <>
          <input
            name="title"
            value={editedService.title}
            onChange={handleInputChange}
            className={styles.input}
          />
          <textarea
            name="description"
            value={editedService.description}
            onChange={handleInputChange}
            className={styles.textarea}
          />
          <input
            name="icon"
            value={editedService.icon}
            onChange={handleInputChange}
            className={styles.input}
          />
          {editedService.features.map((feature, index) => (
            <input
              key={index}
              value={feature}
              onChange={(e) => handleFeaturesChange(index, e.target.value)}
              className={styles.input}
            />
          ))}
          <button onClick={() => setEditedService(prev => ({ ...prev, features: [...prev.features, ''] }))} className={styles.button}>Add Feature</button>
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className={styles.fileInput}
          />
          <button onClick={handleSubmit} className={styles.button}>Save</button>
          <button onClick={() => setIsEditing(false)} className={styles.button}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <div>{service.icon}</div>
          {service.image_url && (
            <img 
              src={`${process.env.REACT_APP_BACKEND_URL}${service.image_url}`} 
              alt={service.title} 
              className={styles.serviceImage} 
            />
          )}
          <ul>
            {service.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <button onClick={() => setIsEditing(true)} className={styles.button}>Edit</button>
          <button onClick={() => onDelete(service.id)} className={styles.button}>Delete</button>
        </>
      )}
    </motion.div>
  );
};

const NewServiceForm = ({ onCreate }) => {
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    icon: '',
    features: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newService);
    setNewService({
      title: '',
      description: '',
      icon: '',
      features: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.newServiceForm}>
      <input
        name="title"
        value={newService.title}
        onChange={handleInputChange}
        placeholder="Service Title"
        className={styles.input}
        required
      />
      <textarea
        name="description"
        value={newService.description}
        onChange={handleInputChange}
        placeholder="Service Description"
        className={styles.textarea}
        required
      />
      <input
        name="icon"
        value={newService.icon}
        onChange={handleInputChange}
        placeholder="Service Icon"
        className={styles.input}
        required
      />
      <button type="submit" className={styles.button}>Add New Service</button>
    </form>
  );
};

export default ServiceManager;