import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import styles from './BlogManager.module.css';

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/blog`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to fetch blog posts');
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/blog/${id}`, updatedData);
      fetchPosts();
    } catch (error) {
      console.error('Failed to update blog post:', error);
      setError('Failed to update blog post');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/blog/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      setError('Failed to delete blog post');
    }
  };

  const handleCreate = async (newPost) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/blog`, newPost);
      fetchPosts();
    } catch (error) {
      console.error('Failed to create new blog post:', error);
      setError('Failed to create new blog post');
    }
  };

  return (
    <div className={styles.blogManager}>
      <h2>Manage Blog Posts</h2>
      {error && <div className={styles.error}>{error}</div>}
      <NewPostForm onCreate={handleCreate} />
      <div className={styles.postGrid}>
        {posts.map(post => (
          <BlogPostCard
            key={post.id}
            post={post}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

const BlogPostCard = ({ post, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(post);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdate(post.id, editedPost);
    setIsEditing(false);
  };

  return (
    <motion.div 
      className={styles.postCard}
      whileHover={{ scale: 1.05 }}
    >
      {isEditing ? (
        <>
          <input
            name="title"
            value={editedPost.title}
            onChange={handleInputChange}
            className={styles.input}
          />
          <textarea
            name="content"
            value={editedPost.content}
            onChange={handleInputChange}
            className={styles.textarea}
          />
          <input
            name="image_url"
            value={editedPost.image_url}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Image URL"
          />
          <button onClick={handleSubmit} className={styles.button}>Save</button>
          <button onClick={() => setIsEditing(false)} className={styles.button}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{post.title}</h3>
          <ReactMarkdown>{post.content.substring(0, 150)}...</ReactMarkdown>
          {post.image_url && <img src={post.image_url} alt={post.title} className={styles.postImage} />}
          <p>Created: {new Date(post.created_at).toLocaleDateString()}</p>
          <button onClick={() => setIsEditing(true)} className={styles.button}>Edit</button>
          <button onClick={() => onDelete(post.id)} className={styles.button}>Delete</button>
        </>
      )}
    </motion.div>
  );
};

const NewPostForm = ({ onCreate }) => {
  const [newPost, setNewPost] = useState({ title: '', content: '', image_url: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newPost);
    setNewPost({ title: '', content: '', image_url: '' });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.newPostForm}>
      <input
        name="title"
        value={newPost.title}
        onChange={handleInputChange}
        placeholder="Post Title"
        className={styles.input}
        required
      />
      <textarea
        name="content"
        value={newPost.content}
        onChange={handleInputChange}
        placeholder="Post Content (Markdown)"
        className={styles.textarea}
        required
      />
      <input
        name="image_url"
        value={newPost.image_url}
        onChange={handleInputChange}
        placeholder="Image URL"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Add New Post</button>
    </form>
  );
};

export default BlogManager;