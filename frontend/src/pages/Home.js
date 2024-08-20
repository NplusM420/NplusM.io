import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS3DRenderer, } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import styles from './Home.module.css';

function Home() {
  const canvasRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [isZoomingAllowed, setIsZoomingAllowed] = useState(false);
  const navigate = useNavigate();
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects?featured=true`);
      setProjects(response.data.slice(0, 6)); // Limit to 6 featured projects
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  const createEcosystemObjects = useCallback(() => {
    const objects = [];

    // Enlarged central sphere
    const centralGeometry = new THREE.IcosahedronGeometry(isMobile ? 3 : 4, 2);
    const centralMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x3498db, 
      wireframe: true,
      emissive: 0x3498db,
      emissiveIntensity: 0.5
    });
    const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
    objects.push(centralSphere);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = isMobile ? 500 : 1000;
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * (isMobile ? 30 : 40);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x64ffda,
      transparent: true,
      opacity: 0.8,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    objects.push(particlesMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);

    objects.push(ambientLight, pointLight);

    return objects;
  }, [isMobile]);

  const AdminButton = ({ scene, camera, renderer }) => {
    const buttonRef = useRef();
  
    useEffect(() => {
      if (!scene || !camera || !renderer) return;
  
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
  
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(20, 10, 0);
      scene.add(sphere);
      buttonRef.current = sphere;
  
      const handleClick = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(sphere);
        if (intersects.length > 0) {
          navigate('/login');
        }
      };
  
      renderer.domElement.addEventListener('click', handleClick);
  
      return () => {
        renderer.domElement.removeEventListener('click', handleClick);
        scene.remove(sphere);
      };
    }, [scene, camera, renderer]);
  
    return null;
  };

  const initThreeJsScene = useCallback(() => {
    if (!webGLSupported) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
  
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
  
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));

    const css3DRenderer = new CSS3DRenderer();
    css3DRenderer.setSize(window.innerWidth, window.innerHeight);
    css3DRenderer.domElement.style.position = 'absolute';
    css3DRenderer.domElement.style.top = '0';
    css3DRenderer.domElement.style.left = '0';
    css3DRenderer.domElement.style.pointerEvents = 'none';
    document.querySelector(`.${styles.homeContainer}`).appendChild(css3DRenderer.domElement);

    const ecosystemObjects = createEcosystemObjects();
    ecosystemObjects.forEach(obj => scene.add(obj));

    camera.position.z = isMobile ? 12 : 15;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = isMobile ? 40 : 50;
    controls.minDistance = isMobile ? 8 : 10;
    controls.enableZoom = false; // Disable zooming by default

    const animate = () => {
      requestAnimationFrame(animate);
      ecosystemObjects.forEach(obj => {
        if (obj.rotation) {
          obj.rotation.x += 0.001;
          obj.rotation.y += 0.001;
        }
      });
      
      controls.update();
      renderer.render(scene, camera);
      css3DRenderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      css3DRenderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    };

    const handleWheel = (event) => {
      if (isZoomingAllowed) {
        controls.enableZoom = true;
      } else {
        controls.enableZoom = false;
        event.preventDefault();
      }
    };

    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.dispose();
      css3DRenderer.domElement.remove();
    };
  }, [createEcosystemObjects, isZoomingAllowed, isMobile, webGLSupported]);

  useEffect(() => {
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebGLSupported(false);
    }
  
    fetchProjects();
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
  
    if (webGLSupported) {
      const cleanup = initThreeJsScene();
      return () => {
        cleanup();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [fetchProjects, initThreeJsScene, webGLSupported]); // Add webGLSupported here

  if (!webGLSupported) {
    return (
      <div className={styles.fallbackContainer}>
        <h1>Welcome to My Digital Ecosystem</h1>
        <p>Sorry, your device doesn't support 3D graphics. Please try on a desktop browser.</p>
        {/* Add static content or links here */}
      </div>
    );
  }

  return (
    <div className={styles.homeContainer}>
      <Helmet>
        <title>NplusM.IO - Digital Ecosystem and Portfolio</title>
        <meta name="description" content="Explore NplusM.IO's digital ecosystem, showcasing innovative projects and advanced skills in web development and technology." />
        <meta property="og:title" content="NplusM.IO - Digital Ecosystem and Portfolio" />
        <meta property="og:description" content="Dive into NplusM.IO's interactive 3D portfolio, featuring cutting-edge projects and a diverse skill set in web development and technology." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nplusm.io" />
        <meta property="og:image" content="https://nplusm.io/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NplusM.IO - Digital Ecosystem and Portfolio" />
        <meta name="twitter:description" content="Experience NplusM.IO's immersive 3D portfolio showcasing innovative projects and advanced tech skills." />
        <meta name="twitter:image" content="https://nplusm.io/twitter-image.jpg" />
      </Helmet>
      <canvas ref={canvasRef} className={styles.canvas} />
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.title}>Welcome to My Digital Ecosystem</h1>
        <p className={styles.subtitle}>Explore my skills and projects in this interactive 3D space</p>
        <nav className={styles.orbitalNav}>
          <Link to="/about" className={styles.navItem}>About</Link>
          <Link to="/portfolio" className={styles.navItem}>Portfolio</Link>
          <Link to="/contact" className={styles.navItem}>Contact</Link>
        </nav>
      </motion.div>
      <div 
        className={styles.zoomArea}
        onMouseEnter={() => setIsZoomingAllowed(true)}
        onMouseLeave={() => setIsZoomingAllowed(false)}
      ></div>
      <motion.section 
        className={styles.featuredProjects}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h2>Featured Projects</h2>
        <div className={styles.projectGrid}>
          {projects.map((project, index) => (
            <motion.div 
              key={project.id} 
              className={styles.projectCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
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
                <h3>{project.title}</h3>
                <p>{project.description.substring(0, 100)}...</p>
                <Link to={`/portfolio#${project.id}`} className={styles.projectLink}>Learn More</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
      {sceneRef.current && cameraRef.current && rendererRef.current && (
        <AdminButton 
          scene={sceneRef.current} 
          camera={cameraRef.current} 
          renderer={rendererRef.current}
        />
      )}
    </div>
  );
}

export default Home;