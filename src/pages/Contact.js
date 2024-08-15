import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaDiscord, FaTwitter, FaLinkedin, FaFacebook, FaTelegram } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, formData);
      setSubmitMessage(response.data.message);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitMessage('There was an error sending your message. Please try again later.');
    }
    setIsSubmitting(false);
  };

  const socialLinks = [
    { icon: <FaDiscord />, url: 'https://discordapp.com/users/289047511748837386', label: 'Discord' },
    { icon: <FaTwitter />, url: 'https://twitter.com/AThinkingMind', label: 'Twitter' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com/in/nplusm', label: 'LinkedIn' },
    { icon: <FaFacebook />, url: 'https://facebook.com/nicholasmassey', label: 'Facebook' },
    { icon: <FaTelegram />, url: 'https://t.me/nplusm420', label: 'Telegram' }
  ];

  return (
    <motion.div 
      className={styles.contactContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Contact Nicholas Massey - NplusM.IO</title>
        <meta name="description" content="Get in touch with Nicholas Massey for web development projects, collaborations, or inquiries." />
        <meta property="og:title" content="Contact Nicholas Massey - NplusM.IO" />
        <meta property="og:description" content="Reach out to Nicholas Massey for web development services, project discussions, or general inquiries." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nplusm.io/contact" />
        <meta property="og:image" content="https://nplusm.io/contact-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Nicholas Massey - NplusM.IO" />
        <meta name="twitter:description" content="Connect with Nicholas Massey for web development opportunities and collaborations." />
        <meta name="twitter:image" content="https://nplusm.io/contact-twitter-image.jpg" />
      </Helmet>
      <header className={styles.header}>
        <h1 className={styles.title}>Get in Touch</h1>
        <p className={styles.subtitle}>I'd love to hear from you. Let's create something great together!</p>
      </header>

      <div className={styles.contactContent}>
        <motion.form 
          className={styles.contactForm} 
          onSubmit={handleSubmit}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
              aria-required="true"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
              aria-required="true"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.label}>Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className={styles.input}
              aria-required="true"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className={styles.textarea}
              aria-required="true"
            ></textarea>
          </div>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          {submitMessage && <p className={styles.submitMessage} role="alert">{submitMessage}</p>}
        </motion.form>

        <motion.div 
          className={styles.contactInfo}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.infoItem}>
            <h3 className={styles.infoLabel}>Email</h3>
            <p className={styles.infoValue}>
              <a href="mailto:namassey05@gmail.com" className={styles.emailLink}>namassey05@gmail.com</a>
            </p>
          </div>
          <div className={styles.infoItem}>
            <h3 className={styles.infoLabel}>Social Links</h3>
            <div className={styles.socialLinks}>
              {socialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.socialLink}
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;