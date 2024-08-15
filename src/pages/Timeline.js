import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import styles from './Timeline.module.css';

const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  const fetchTimelineEvents = async () => {
    setIsLoading(true);
    try {
      const [jobsResponse, projectsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/timeline`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects`)
      ]);

      const jobs = jobsResponse.data.map(job => ({
        ...job,
        type: 'job',
        date: job.start_date
      }));

      const projects = projectsResponse.data.map(project => ({
        ...project,
        type: 'project',
        date: project.start_date
      }));

      const allEvents = [...jobs, ...projects].sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(allEvents);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
    }
    setIsLoading(false);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'job':
        return '💼';
      case 'project':
        return '🚀';
      default:
        return '📅';
    }
  };

  return (
    <motion.div 
      className={styles.timelineContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Professional Timeline - NplusM.IO</title>
        <meta name="description" content="Explore Nicholas Massey's professional journey and key milestones in web development and technology." />
        <meta property="og:title" content="Professional Timeline - NplusM.IO" />
        <meta property="og:description" content="Discover the career path and significant projects of Nicholas Massey in the field of web development." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nplusm.io/timeline" />
        <meta property="og:image" content="https://nplusm.io/timeline-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Timeline - NplusM.IO" />
        <meta name="twitter:description" content="Follow Nicholas Massey's professional growth and achievements in web development and technology." />
        <meta name="twitter:image" content="https://nplusm.io/timeline-twitter-image.jpg" />
      </Helmet>
      <header className={styles.header}>
        <h1 className={styles.title}>My Journey</h1>
        <p className={styles.subtitle}>A timeline of my professional growth and key milestones</p>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading timeline...</div>
      ) : (
        <div className={styles.timeline}>
          {events.map((event, index) => (
            <motion.div 
              key={`${event.type}-${event.id}`} 
              className={styles.timelineItem}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.timelineContent}>
                <motion.div 
                  className={styles.timelineDate}
                  whileHover={{ scale: 1.1 }}
                >
                  {new Date(event.date).toLocaleDateString()}
                </motion.div>
                <div className={styles.timelineIcon}>{getEventIcon(event.type)}</div>
                <h2 className={styles.timelineTitle}>
                  {event.type === 'job' ? `${event.role} at ${event.company}` : event.title}
                </h2>
                <p className={styles.timelineDescription}>
                  {event.type === 'job' ? event.experience : event.description}
                </p>
                {event.type === 'job' && event.tasks && (
                  <div className={styles.timelineTasks}>
                    <h3>Key Responsibilities:</h3>
                    <ul>
                      {event.tasks.split(',').map((task, taskIndex) => (
                        <li key={taskIndex}>{task.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {event.type === 'project' && (
                  <div className={styles.timelineProjectDetails}>
                    <p><strong>Status:</strong> {event.status}</p>
                    <p><strong>Progress:</strong> {event.progress}%</p>
                    {event.technologies && (
                      <div className={styles.timelineTechnologies}>
                        {event.technologies.split(',').map(tech => (
                          <span key={tech.trim()} className={styles.tag}>{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {event.link && (
                  <a href={event.link} target="_blank" rel="noopener noreferrer" className={styles.timelineLink}>
                    Learn More
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Timeline;