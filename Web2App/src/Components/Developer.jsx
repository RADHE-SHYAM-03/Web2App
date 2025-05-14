import React, { useState, useEffect, useRef } from 'react';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import './Developer.css';

// Import local images
import Dev1 from "../Images/Dev1.jpg";
import Dev2 from "../Images/Dev2.jpg";
import Dev3 from "../Images/Dev3.jpg";
import Dev4 from "../Images/Dev4.jpg";

const DeveloperCard = ({ img, name, role, linkedin, github, instagram, index, cardType, size }) => {
  const [displayRole, setDisplayRole] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  
  // Enhanced mouse movement tracking for more realistic 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  // Type writer effect for role
  useEffect(() => {
    if (!isVisible) return;
    
    let isMounted = true;
    let timeout;
    
    const typeRole = () => {
      if (!isMounted) return;

      if (displayRole.length < role.length) {
        setDisplayRole(prevRole => role.slice(0, prevRole.length + 1));
        timeout = setTimeout(typeRole, 40 + Math.random() * 30);
      }
    };

    timeout = setTimeout(typeRole, 300 + index * 100);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [isVisible, role, index]);

  // Intersection observer for when card comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Enhanced 3D card transforms
  const rotateX = isHovered ? (mousePosition.y - 0.5) * 25 : 0;
  const rotateY = isHovered ? (mousePosition.x - 0.5) * -25 : 0;
  const translateZ = isHovered ? 50 : 0;
  const translateY = isHovered ? -20 : 0;
  
  // Light reflection effect based on mouse position
  const highlightX = (mousePosition.x * 100) + '%';
  const highlightY = (mousePosition.y * 100) + '%';

  // Apply different sizes based on the 'size' prop
  const cardSizeClass = `dev-card-size-${size}`;

  return (
    <div
      ref={cardRef}
      className={`dev-card dev-card-${cardType} ${cardSizeClass}`}
      style={{
        transform: `perspective(1000px) 
                   rotateX(${rotateX}deg) 
                   rotateY(${rotateY}deg) 
                   translateZ(${translateZ}px)
                   translateY(${translateY}px)`,
        opacity: isVisible ? 1 : 0,
        transition: isHovered 
          ? 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)' 
          : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="dev-card-content"
        style={{
          transform: isHovered ? `translateZ(10px)` : 'none',
        }}
      >
        <div 
          className="dev-card-front"
          style={{
            background: isHovered 
              ? `linear-gradient(to right, 
                  rgba(25, 25, 30, 0.2) 0%, 
                  rgba(35, 35, 40, 0.3) 50%, 
                  rgba(25, 25, 30, 0.2) 100%), 
                  rgba(25, 25, 30, 0.2)`
              : 'rgba(25, 25, 30, 0.2)',
          }}
        >
          <div className="dev-card-border"></div>
          <div 
            className="dev-card-blur"
            style={{
              transform: isHovered 
                ? `translateZ(-20px) scale(1.1) translate(${(mousePosition.x - 0.5) * -10}px, ${(mousePosition.y - 0.5) * -10}px)` 
                : 'translateZ(-20px)',
            }}
          ></div>
          
          <div 
            className="dev-card-shape"
            style={{
              transform: isHovered 
                ? `scale(1.15) rotate(${(mousePosition.x - 0.5) * 5 + 5}deg) translateZ(10px)` 
                : 'rotate(25deg)',
            }}
          ></div>
          <div 
            className="dev-card-shape-2"
            style={{
              transform: isHovered 
                ? `scale(1.2) rotate(${(mousePosition.y - 0.5) * -5 - 10}deg) translateZ(5px)` 
                : 'rotate(-15deg)',
            }}
          ></div>
          
          <div className="dev-card-header">
            <div className="dev-card-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="dev-card-line"></div>
          </div>
          
          <div className="dev-profile">
            <div 
              className="dev-avatar-container"
              style={{
                transform: isHovered 
                  ? `rotate(0deg) scale(1.05) translateZ(20px)` 
                  : 'rotate(-2deg)',
              }}
            >
              <img src={img} alt={name} className="dev-avatar" />
              <div className="dev-avatar-overlay"></div>
            </div>
            
            <div 
              className="dev-info"
              style={{
                transform: isHovered ? 'translateZ(15px)' : 'none',
              }}
            >
              <h3 className="dev-name">{name}</h3>
              <p className="dev-role">
                {displayRole}
                {displayRole.length < role.length && isVisible && (
                  <span className="dev-cursor">_</span>
                )}
              </p>
            </div>
          </div>
          
          <div 
            className="dev-socials"
            style={{
              transform: isHovered ? 'translateZ(25px)' : 'none',
            }}
          >
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="dev-social-link">
                <FaLinkedin className="dev-social-icon" />
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="dev-social-link">
                <FaGithub className="dev-social-icon" />
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="dev-social-link">
                <FaInstagram className="dev-social-icon" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Developer = () => {
  const developerData = [
    {
      img: Dev1,
      name: "Yunus Khan",
      role: "Lead Developer",
      linkedin: "https://www.linkedin.com/in/yunus-khan-6144312a2/",
      instagram: "https://www.instagram.com/im_mr_yunus",
      cardType: "primary",
      size: "large" 
    },
    {
      img: Dev2,
      name: "Bipashu Kumar",
      role: "Backend Developer",
      linkedin: "https://www.linkedin.com/in/bipashu-kumar-ba2164281/",
      instagram: "https://www.instagram.com/_im__vasu/",
      cardType: "secondary",
      size: "medium" 
    },
    {
      img: Dev4,
      name: "Shyam Dravid",
      role: "Front-End Developer",
      linkedin: "https://www.linkedin.com/in/radhe-shyam-6b5780236/",
      github: "https://github.com/RADHE-SHYAM-03",
      instagram: "https://instagram.com/sham_dravid_03",
      cardType: "accent",
      size: "medium" 
    },
    {
      img: Dev3,
      name: "Aditya Duhan",
      role: "Developer",
      instagram: "https://www.instagram.com/_vvv.adi_",
      cardType: "tertiary",
      size: "small" 
    }
  ];

  return (
    <div className="developer-section" id="developers">
      <div className="developer-grid-overlay"></div>
      <div className="depth-overlay"></div>
      
      <div className="developer-header" >
        <div className="developer-title-container">
          <div className="developer-subtitle">THE CREATORS</div>
          <h2 className="developer-title">
            Meet Our <span className="developer-title-highlight">Team</span>
          </h2>
        </div>
        <p className="developer-description">
          The creative minds behind Web2App, dedicated to transforming digital experiences.
        </p>
      </div>
      
      <div className="developer-grid">
        {developerData.map((developer, index) => (
          <DeveloperCard
            key={index}
            index={index}
            img={developer.img}
            name={developer.name}
            role={developer.role}
            linkedin={developer.linkedin}
            github={developer.github}
            instagram={developer.instagram}
            cardType={developer.cardType}
            size={developer.size}
          />
        ))}
      </div>
    </div> 
  );
};

export default Developer;