import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styles from './SkillManager.module.css';

const SkillManager = () => {
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/skills`);
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError('Failed to fetch skills');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/skills/${id}`, updatedData);
      fetchSkills();
    } catch (error) {
      console.error('Failed to update skill:', error);
      setError('Failed to update skill');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/skills/${id}`);
      fetchSkills();
    } catch (error) {
      console.error('Failed to delete skill:', error);
      setError('Failed to delete skill');
    }
  };

  const handleCreate = async (newSkill) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/skills`, newSkill);
      fetchSkills();
    } catch (error) {
      console.error('Failed to create new skill:', error);
      setError('Failed to create new skill');
    }
  };

  return (
    <div className={styles.skillManager}>
      <h2>Manage Skills</h2>
      {error && <div className={styles.error}>{error}</div>}
      {isLoading && <div className={styles.loading}>Loading...</div>}
      <NewSkillForm onCreate={handleCreate} />
      <div className={styles.skillGrid}>
        {skills.map(skill => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

const SkillCard = ({ skill, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSkill, setEditedSkill] = useState(skill);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedSkill(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'level' ? parseInt(value) : value)
    }));
  };

  const handleSubmit = () => {
    onUpdate(skill.id, editedSkill);
    setIsEditing(false);
  };

  return (
    <motion.div 
      className={styles.skillCard}
      whileHover={{ scale: 1.05 }}
    >
      {isEditing ? (
        <>
          <input
            name="name"
            value={editedSkill.name}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="number"
            name="level"
            value={editedSkill.level}
            onChange={handleInputChange}
            className={styles.input}
            min="0"
            max="100"
          />
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="is_current"
              checked={editedSkill.is_current}
              onChange={handleInputChange}
            />
            Current Skill
          </label>
          <button onClick={handleSubmit} className={styles.button}>Save</button>
          <button onClick={() => setIsEditing(false)} className={styles.button}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{skill.name}</h3>
          <p>Level: {skill.level}</p>
          <p>Current: {skill.is_current ? 'Yes' : 'No'}</p>
          <button onClick={() => setIsEditing(true)} className={styles.button}>Edit</button>
          <button onClick={() => onDelete(skill.id)} className={styles.button}>Delete</button>
        </>
      )}
    </motion.div>
  );
};

const NewSkillForm = ({ onCreate }) => {
  const [newSkill, setNewSkill] = useState({ name: '', level: 0, is_current: true });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'level' ? parseInt(value) : value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newSkill);
    setNewSkill({ name: '', level: 0, is_current: true });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.newSkillForm}>
      <input
        name="name"
        value={newSkill.name}
        onChange={handleInputChange}
        placeholder="Skill Name"
        className={styles.input}
        required
      />
      <input
        type="number"
        name="level"
        value={newSkill.level}
        onChange={handleInputChange}
        placeholder="Skill Level (0-100)"
        className={styles.input}
        min="0"
        max="100"
        required
      />
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          name="is_current"
          checked={newSkill.is_current}
          onChange={handleInputChange}
        />
        Current Skill
      </label>
      <button type="submit" className={styles.button}>Add New Skill</button>
    </form>
  );
};

export default SkillManager;