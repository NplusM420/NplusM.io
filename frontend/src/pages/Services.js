import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import styles from './Services.module.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.servicesContainer}>
      <Helmet>
        <title>Services - NplusM.IO</title>
        <meta name="description" content="Explore the range of web development and technology services offered by Nicholas Massey." />
        <meta property="og:title" content="Services - NplusM.IO" />
        <meta property="og:description" content="Discover the professional web development and technology services provided by Nicholas Massey." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nplusm.io/services" />
        <meta property="og:image" content="https://nplusm.io/services-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Services - NplusM.IO" />
        <meta name="twitter:description" content="Learn about the comprehensive web development and technology services offered by Nicholas Massey." />
        <meta name="twitter:image" content="https://nplusm.io/services-twitter-image.jpg" />
      </Helmet>
      <header className={styles.header}>
        <h1 className={styles.title}>My Services</h1>
        <p className={styles.subtitle}>Professional solutions to help your business grow</p>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading services...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <motion.div 
              key={service.id} 
              className={`${styles.serviceCard} ${activeService === service.id ? styles.active : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveService(activeService === service.id ? null : service.id)}
            >
              {service.image_url && service.image_url !== '' && (
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}${service.image_url}`} 
                  alt={service.title} 
                  className={styles.serviceImage} 
                  loading="lazy"
                  srcSet={`${process.env.REACT_APP_BACKEND_URL}${service.image_url} 1x, ${process.env.REACT_APP_BACKEND_URL}${service.image_url.replace('.', '@2x.')} 2x`}
                />
              )}
              <div className={styles.serviceIcon}>{service.icon}</div>
              <h2 className={styles.serviceTitle}>{service.title}</h2>
              <p className={styles.serviceDescription}>{service.description}</p>
              <AnimatePresence>
                {activeService === service.id && service.features && (
                  <motion.ul 
                    className={styles.serviceFeatures}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {service.features.map((feature, index) => (
                      <motion.li 
                        key={index} 
                        className={styles.serviceFeature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {feature}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div 
        className={styles.ctaSection}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className={styles.ctaText}>Ready to start your project?</p>
        <Link to="/contact" className={styles.ctaButton}>Get in Touch</Link>
      </motion.div>
    </div>
  );
};

export default Services;