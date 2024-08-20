import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Blog.module.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading posts...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.blogContainer}>
      <h1 className={styles.title}>Blog</h1>
      <div className={styles.postGrid}>
        {posts.map(post => (
          <div key={post.id} className={styles.postCard}>
            {post.image_url && (
              <img 
                src={`${process.env.REACT_APP_BACKEND_URL}${post.image_url}`} 
                alt={post.title} 
                className={styles.postImage} 
              />
            )}
            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.postExcerpt}>{post.content.substring(0, 150)}...</p>
            <Link to={`/blog/${post.id}`} className={styles.readMoreLink}>Read More</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;