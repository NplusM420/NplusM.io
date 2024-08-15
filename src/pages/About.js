import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import styles from './About.module.css';

const About = () => {
  const [skills, setSkills] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [profile, setProfile] = useState({ bio: '', image_url: '' });
  const bioRef = useRef(null);
  const skillsRef = useRef(null);
  const timelineRef = useRef(null);

  const bioInView = useInView(bioRef, { once: true, threshold: 0.2 });
  const skillsInView = useInView(skillsRef, { once: true, threshold: 0.2 });
  const timelineInView = useInView(timelineRef, { once: true, threshold: 0.2 });

  useEffect(() => {
    fetchSkills();
    fetchTimelineEvents();
    fetchProfile();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/skills`);
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchTimelineEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/timeline`);
      setTimelineEvents(response.data);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/about`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <div className={styles.aboutContainer}>
      <Helmet>
        <title>About Nicholas Massey - NplusM.IO</title>
        <meta name="description" content="Learn about Nicholas Massey's journey, skills, and experiences in web development and technology." />
        <meta property="og:title" content="About Nicholas Massey - NplusM.IO" />
        <meta property="og:description" content="Discover Nicholas Massey's professional background, technical skills, and career milestones in the world of web development." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nplusm.io/about" />
        <meta property="og:image" content="https://nplusm.io/about-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Nicholas Massey - NplusM.IO" />
        <meta name="twitter:description" content="Explore Nicholas Massey's professional journey and diverse skill set in web development and technology." />
        <meta name="twitter:image" content="https://nplusm.io/about-twitter-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Person",
            "name": "Nicholas Massey",
            "url": "https://nplusm.io",
            "sameAs": [
              "https://github.com/nplusm",
              "https://linkedin.com/in/nplusm",
              "https://twitter.com/AThinkingMind"
            ],
            "jobTitle": "Web Developer",
            "worksFor": {
              "@type": "Organization",
              "name": "NplusM.IO"
            }
          })}
        </script>
      </Helmet>
      <motion.header 
        className={styles.header}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.title}>About Me</h1>
        <p className={styles.subtitle}>Passionate developer, lifelong learner, and tech enthusiast</p>
      </motion.header>

      <div className={styles.content}>
        <motion.section 
          ref={bioRef}
          className={styles.bio}
          initial={{ opacity: 0, x: -50 }}
          animate={bioInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={`${process.env.REACT_APP_BACKEND_URL}${profile.image_url}`} 
            alt="Nicholas Massey" 
            className={styles.profileImage}
            loading="lazy"
            srcSet={`${process.env.REACT_APP_BACKEND_URL}${profile.image_url} 1x, ${process.env.REACT_APP_BACKEND_URL}${profile.image_url.replace('.', '@2x.')} 2x`}
          />
          <div className={styles.bioText}>
            <h2>Hello, I'm Nicholas</h2>
            <p>{profile.bio}</p>
          </div>
        </motion.section>

        <motion.section 
          ref={skillsRef}
          className={styles.skills}
          initial={{ opacity: 0, y: 50 }}
          animate={skillsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2>Skills</h2>
          <div className={styles.skillsGrid}>
            {skills.map((skill, index) => (
              <motion.div 
                key={skill.id} 
                className={styles.skillItem}
                initial={{ opacity: 0, y: 20 }}
                animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CircularProgressbar
                  value={skill.level}
                  text={`${skill.level}%`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathTransitionDuration: 1.5,
                    pathColor: `rgba(100, 255, 218, ${skill.level / 100})`,
                    textColor: '#64ffda',
                    trailColor: '#0a192f',
                  })}
                />
                <span className={styles.skillName}>{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          ref={timelineRef}
          className={styles.timeline}
          initial={{ opacity: 0, y: 50 }}
          animate={timelineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2>My Journey</h2>
          <div className={styles.timelineContent}>
            {timelineEvents.map((event, index) => (
              <motion.div 
                key={event.id} 
                className={styles.timelineItem}
                initial={{ opacity: 0, x: -50 }}
                animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.timelineMarker}></div>
                <div className={styles.timelineInfo}>
                  <span className={styles.timelineYear}>{new Date(event.start_date).getFullYear()}</span>
                  <h3>{event.role} at {event.company}</h3>
                  <p>{event.experience}</p>
                  {event.link && (
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className={styles.timelineLink}>
                      Learn More
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;