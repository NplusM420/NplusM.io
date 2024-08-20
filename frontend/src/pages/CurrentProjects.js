import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styles from './CurrentProjects.module.css';

const CurrentProjects = () => {
  const [currentProjects, setCurrentProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentProjects();
  }, []);

  const fetchCurrentProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects?current=true`);
      setCurrentProjects(response.data);
    } catch (error) {
      console.error('Error fetching current projects:', error);
      setError('Failed to load current projects. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading current projects...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.currentProjectsContainer}>
      <h2 className={styles.title}>Current Projects</h2>
      {currentProjects.length === 0 ? (
        <p className={styles.noProjects}>No current projects at the moment.</p>
      ) : (
        <div className={styles.projectGrid}>
          {currentProjects.map(project => (
            <motion.div 
              key={project.id} 
              className={styles.projectCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <p className={styles.projectStatus}>Status: {project.status}</p>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className={styles.progressText}>Progress: {project.progress}%</p>
              {project.image_url && (
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}${project.image_url}`} 
                  alt={project.title} 
                  className={styles.projectImage} 
                />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentProjects;