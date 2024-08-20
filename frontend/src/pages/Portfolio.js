import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import styles from './Portfolio.module.css';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setIsLoading(false);
  };

  const allTags = ['All', ...new Set(projects.flatMap(project => project.technologies.split(',').map(tech => tech.trim())))];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(project => project.technologies.includes(filter));

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className={styles.portfolioContainer}>
      <Helmet>
        <title>Portfolio - NplusM.IO</title>
        <meta name="description" content="Explore Nicholas Massey's portfolio of web development and technology projects." />
        <meta property="og:title" content="Portfolio - NplusM.IO" />
        <meta property="og:description" content="Discover a collection of innovative web development projects by Nicholas Massey." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nplusm.io/portfolio" />
        <meta property="og:image" content="https://nplusm.io/portfolio-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio - NplusM.IO" />
        <meta name="twitter:description" content="Browse through Nicholas Massey's impressive portfolio of web development projects." />
        <meta name="twitter:image" content="https://nplusm.io/portfolio-twitter-image.jpg" />
      </Helmet>
      <header className={styles.header}>
        <h1 className={styles.title}>My Portfolio</h1>
        <p className={styles.subtitle}>Explore my latest projects and creations</p>
      </header>

      <div className={styles.filters}>
        {allTags.map(tag => (
          <motion.button
            key={tag}
            className={`${styles.filterButton} ${filter === tag ? styles.active : ''}`}
            onClick={() => setFilter(tag)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tag}
          </motion.button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loadingSpinner}>Loading projects...</div>
      ) : (
        <motion.div 
        className={styles.projectGrid}
        layout
      >
        <AnimatePresence>
          {filteredProjects.map(project => (
            <motion.div 
              key={project.id} 
              className={styles.projectCard}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => handleProjectClick(project)}
              whileHover={{ scale: 1.05 }}
            >
              {project.image_url && (
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}${project.image_url}`} 
                  alt={project.title} 
                  className={styles.projectImage} 
                  loading="lazy"
                  srcSet={`${process.env.REACT_APP_BACKEND_URL}${project.image_url} 1x, ${process.env.REACT_APP_BACKEND_URL}${project.image_url.replace('.', '@2x.')} 2x`}
                />
              )}
              <div className={styles.projectInfo}>
                <h2 className={styles.projectTitle}>{project.title}</h2>
                <p className={styles.projectDescription}>{project.description.substring(0, 100)}...</p>
                <div className={styles.projectTags}>
                  {project.technologies.split(',').map(tech => (
                    <span key={tech.trim()} className={styles.tag}>{tech.trim()}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={e => e.stopPropagation()}
            >
              <h2>{selectedProject.title}</h2>
              {selectedProject.image_url && (
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}${selectedProject.image_url}`} 
                  alt={selectedProject.title} 
                  className={styles.modalImage} 
                  loading="lazy"
                  srcSet={`${process.env.REACT_APP_BACKEND_URL}${selectedProject.image_url} 1x, ${process.env.REACT_APP_BACKEND_URL}${selectedProject.image_url.replace('.', '@2x.')} 2x`}
                />
              )}
              <p>{selectedProject.description}</p>
              <div className={styles.projectDetails}>
                <p><strong>Status:</strong> {selectedProject.status}</p>
                <p><strong>Start Date:</strong> {new Date(selectedProject.start_date).toLocaleDateString()}</p>
                {selectedProject.estimated_completion && (
                  <p><strong>Estimated Completion:</strong> {new Date(selectedProject.estimated_completion).toLocaleDateString()}</p>
                )}
                <p><strong>Progress:</strong> {selectedProject.progress}%</p>
              </div>
              <h3>Goals</h3>
              <p>{selectedProject.goals}</p>
              <h3>Additional Information</h3>
              <p>{selectedProject.more_info}</p>
              {selectedProject.link && (
                <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                  View Project
                </a>
              )}
              <div className={styles.projectTags}>
                {selectedProject.technologies.split(',').map(tech => (
                  <span key={tech.trim()} className={styles.tag}>{tech.trim()}</span>
                ))}
              </div>
              <motion.button 
                className={styles.closeButton} 
                onClick={closeModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;