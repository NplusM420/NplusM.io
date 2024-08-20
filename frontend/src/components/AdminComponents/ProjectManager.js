import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styles from './ProjectManager.module.css';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects`);
      console.log("Received project data:", response.data);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${id}`, updatedData);
      fetchProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
      setError('Failed to update project');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      setError('Failed to delete project');
    }
  };

  const handleCreate = async (newProject) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/projects`, newProject);
      fetchProjects();
    } catch (error) {
      console.error('Failed to create new project:', error);
      setError('Failed to create new project');
    }
  };

  const handleProjectImageUpload = async (projectId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/upload/project/${projectId}`,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.path) {
        await handleUpdate(projectId, { image_url: response.data.path });
      }
    } catch (error) {
      console.error('Failed to update project image:', error);
      setError('Failed to update project image');
    }
  };

  return (
    <div className={styles.projectManager}>
      <h2>Manage Projects</h2>
      {error && <div className={styles.error}>{error}</div>}
      <NewProjectForm onCreate={handleCreate} />
      {isLoading ? (
        <div className={styles.loading}>Loading projects...</div>
      ) : (
        <div className={styles.projectGrid}>
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onImageUpload={handleProjectImageUpload}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project, onUpdate, onDelete, onImageUpload }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProject(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    onUpdate(project.id, editedProject);
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(project.id, file);
    }
  };

  return (
    <motion.div 
      className={styles.projectCard}
      whileHover={{ scale: 1.05 }}
    >
      {isEditing ? (
        <>
          <input
            name="title"
            value={editedProject.title}
            onChange={handleInputChange}
            className={styles.input}
          />
          <textarea
            name="description"
            value={editedProject.description}
            onChange={handleInputChange}
            className={styles.textarea}
          />
          <input
            name="technologies"
            value={editedProject.technologies}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Technologies (comma-separated)"
          />
          <select
            name="status"
            value={editedProject.status}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
          <input
            type="date"
            name="start_date"
            value={editedProject.start_date}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="date"
            name="estimated_completion"
            value={editedProject.estimated_completion}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="number"
            name="progress"
            value={editedProject.progress}
            onChange={handleInputChange}
            className={styles.input}
            min="0"
            max="100"
          />
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="is_current"
              checked={editedProject.is_current}
              onChange={handleInputChange}
            />
            Current Project
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="is_featured"
              checked={editedProject.is_featured}
              onChange={handleInputChange}
            />
            Featured Project
          </label>
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
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <p>Technologies: {project.technologies}</p>
          <p>Status: {project.status}</p>
          <p>Start Date: {project.start_date}</p>
          <p>Estimated Completion: {project.estimated_completion}</p>
          <p>Progress: {project.progress}%</p>
          <p>Current Project: {project.is_current ? 'Yes' : 'No'}</p>
          <p>Featured Project: {project.is_featured ? 'Yes' : 'No'}</p>
          {project.image_url && (
            <img 
              src={`${process.env.REACT_APP_BACKEND_URL}${project.image_url}`} 
              alt={project.title} 
              className={styles.projectImage} 
            />
          )}
          <button onClick={() => setIsEditing(true)} className={styles.button}>Edit</button>
          <button onClick={() => onDelete(project.id)} className={styles.button}>Delete</button>
        </>
      )}
    </motion.div>
  );
};

const NewProjectForm = ({ onCreate }) => {
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    status: 'In Progress',
    start_date: '',
    estimated_completion: '',
    progress: 0,
    is_current: false,
    is_featured: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newProject);
    setNewProject({
      title: '',
      description: '',
      technologies: '',
      status: 'In Progress',
      start_date: '',
      estimated_completion: '',
      progress: 0,
      is_current: false,
      is_featured: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.newProjectForm}>
      <input
        name="title"
        value={newProject.title}
        onChange={handleInputChange}
        placeholder="Project Title"
        className={styles.input}
        required
      />
      <textarea
        name="description"
        value={newProject.description}
        onChange={handleInputChange}
        placeholder="Project Description"
        className={styles.textarea}
        required
      />
      <input
        name="technologies"
        value={newProject.technologies}
        onChange={handleInputChange}
        placeholder="Technologies (comma-separated)"
        className={styles.input}
      />
      <select
        name="status"
        value={newProject.status}
        onChange={handleInputChange}
        className={styles.select}
      >
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="On Hold">On Hold</option>
      </select>
      <input
        type="date"
        name="start_date"
        value={newProject.start_date}
        onChange={handleInputChange}
        className={styles.input}
      />
      <input
        type="date"
        name="estimated_completion"
        value={newProject.estimated_completion}
        onChange={handleInputChange}
        className={styles.input}
      />
      <input
        type="number"
        name="progress"
        value={newProject.progress}
        onChange={handleInputChange}
        placeholder="Progress (%)"
        className={styles.input}
        min="0"
        max="100"
      />
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          name="is_current"
          checked={newProject.is_current}
          onChange={handleInputChange}
        />
        Current Project
      </label>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          name="is_featured"
          checked={newProject.is_featured}
          onChange={handleInputChange}
        />
        Featured Project
      </label>
      <button type="submit" className={styles.button}>Add New Project</button>
    </form>
  );
};

export default ProjectManager;