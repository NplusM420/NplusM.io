import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './AdminDashboard.module.css';
import ProjectManager from './AdminComponents/ProjectManager';
import SkillManager from './AdminComponents/SkillManager';
import BlogManager from './AdminComponents/BlogManager';
import TimelineManager from './AdminComponents/TimelineManager';
import ServiceManager from './AdminComponents/ServiceManager';
import ProfileManager from './AdminComponents/ProfileManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileManager />;
      case 'projects':
        return <ProjectManager />;
      case 'skills':
        return <SkillManager />;
      case 'posts':
        return <BlogManager />;
      case 'timeline':
        return <TimelineManager />;
      case 'services':
        return <ServiceManager />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className={styles.adminDashboard}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? styles.active : ''}>Profile</button>
        <button onClick={() => setActiveTab('projects')} className={activeTab === 'projects' ? styles.active : ''}>Projects</button>
        <button onClick={() => setActiveTab('skills')} className={activeTab === 'skills' ? styles.active : ''}>Skills</button>
        <button onClick={() => setActiveTab('posts')} className={activeTab === 'posts' ? styles.active : ''}>Blog Posts</button>
        <button onClick={() => setActiveTab('timeline')} className={activeTab === 'timeline' ? styles.active : ''}>Timeline</button>
        <button onClick={() => setActiveTab('services')} className={activeTab === 'services' ? styles.active : ''}>Services</button>
      </div>
      <div className={styles.content}>
        {renderActiveComponent()}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;