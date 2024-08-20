import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styles from './TimelineManager.module.css';

const TimelineManager = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/timeline`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      setError('Failed to fetch timeline events');
    } finally {
      setIsLoading(false);  // Add this line
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/timeline/${id}`, updatedData);
      fetchEvents();
    } catch (error) {
      console.error('Failed to update timeline event:', error);
      setError('Failed to update timeline event');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/timeline/${id}`);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete timeline event:', error);
      setError('Failed to delete timeline event');
    }
  };

  const handleCreate = async (newEvent) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/timeline`, newEvent);
      fetchEvents();
    } catch (error) {
      console.error('Failed to create new timeline event:', error);
      setError('Failed to create new timeline event');
    }
  };

  return (
    <div className={styles.timelineManager}>
      <h2>Manage Timeline</h2>
      {error && <div className={styles.error}>{error}</div>}
      {isLoading && <div className={styles.loading}>Loading...</div>}
      <NewEventForm onCreate={handleCreate} />
      <div className={styles.timelineGrid}>
        {events.map(event => (
          <TimelineCard
            key={event.id}
            event={event}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

const TimelineCard = ({ event, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdate(event.id, editedEvent);
    setIsEditing(false);
  };

  return (
    <motion.div 
      className={styles.timelineCard}
      whileHover={{ scale: 1.05 }}
    >
      {isEditing ? (
        <>
          <input
            name="company"
            value={editedEvent.company}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Company"
          />
          <input
            name="role"
            value={editedEvent.role}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Role"
          />
          <input
            type="date"
            name="start_date"
            value={editedEvent.start_date}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="date"
            name="end_date"
            value={editedEvent.end_date || ''}
            onChange={handleInputChange}
            className={styles.input}
          />
          <textarea
            name="tasks"
            value={editedEvent.tasks}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Tasks (comma-separated)"
          />
          <textarea
            name="experience"
            value={editedEvent.experience}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Experience"
          />
          <input
            name="link"
            value={editedEvent.link || ''}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Link"
          />
          <button onClick={handleSubmit} className={styles.button}>Save</button>
          <button onClick={() => setIsEditing(false)} className={styles.button}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{event.role} at {event.company}</h3>
          <p>From: {new Date(event.start_date).toLocaleDateString()}</p>
          <p>To: {event.end_date ? new Date(event.end_date).toLocaleDateString() : 'Present'}</p>
          <p>Tasks: {event.tasks}</p>
          <p>Experience: {event.experience}</p>
          {event.link && <p>Link: <a href={event.link} target="_blank" rel="noopener noreferrer">{event.link}</a></p>}
          <button onClick={() => setIsEditing(true)} className={styles.button}>Edit</button>
          <button onClick={() => onDelete(event.id)} className={styles.button}>Delete</button>
        </>
      )}
    </motion.div>
  );
};

const NewEventForm = ({ onCreate }) => {
  const [newEvent, setNewEvent] = useState({
    company: '',
    role: '',
    start_date: '',
    end_date: '',
    tasks: '',
    experience: '',
    link: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newEvent);
    setNewEvent({
      company: '',
      role: '',
      start_date: '',
      end_date: '',
      tasks: '',
      experience: '',
      link: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.newEventForm}>
      <input
        name="company"
        value={newEvent.company}
        onChange={handleInputChange}
        placeholder="Company"
        className={styles.input}
        required
      />
      <input
        name="role"
        value={newEvent.role}
        onChange={handleInputChange}
        placeholder="Role"
        className={styles.input}
        required
      />
      <input
        type="date"
        name="start_date"
        value={newEvent.start_date}
        onChange={handleInputChange}
        className={styles.input}
        required
      />
      <input
        type="date"
        name="end_date"
        value={newEvent.end_date}
        onChange={handleInputChange}
        className={styles.input}
      />
      <textarea
        name="tasks"
        value={newEvent.tasks}
        onChange={handleInputChange}
        placeholder="Tasks (comma-separated)"
        className={styles.textarea}
      />
      <textarea
        name="experience"
        value={newEvent.experience}
        onChange={handleInputChange}
        placeholder="Experience"
        className={styles.textarea}
      />
      <input
        name="link"
        value={newEvent.link}
        onChange={handleInputChange}
        placeholder="Link"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Add New Event</button>
    </form>
  );
};

export default TimelineManager;