import React, { useState, useEffect, useRef } from 'react';
import './FeatureCard.css';

// Placeholder icon components - replace with your actual imports
const CloudIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
  </svg>
);

const DeviceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12" y2="18"></line>
  </svg>
);

const RocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 5.5-5.27 10.28-10 12.95z"></path>
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const FeatureCard = ({ title, description, icon, index, isLarge }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);
  
  // Mouse movement tracking for 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };
  
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

  // Calculate 3D transforms based on mouse position
  const rotateX = isHovered ? (mousePosition.y - 0.5) * 15 : 0;
  const rotateY = isHovered ? (mousePosition.x - 0.5) * -15 : 0;
  const translateZ = isHovered ? 20 : 0;
  
  const cardClasses = `feature-card ${isLarge ? 'feature-card-large' : ''} ${isVisible ? 'feature-card-visible' : ''}`;
  
  // Get random values for the floating shapes
  const getBlobStyles = () => {
    const angle = Math.random() * 360;
    const scale = 0.8 + Math.random() * 0.4;
    
    return {
      transform: `rotate(${angle}deg) scale(${scale})`,
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 80}%`,
    };
  };
  
  const blob1Style = getBlobStyles();
  const blob2Style = getBlobStyles();
  
  return (
    <div
      ref={cardRef}
      className={cardClasses}
      style={{
        transform: `perspective(1200px) 
                  rotateX(${rotateX}deg) 
                  rotateY(${rotateY}deg) 
                  translateZ(${translateZ}px)`,
        animationDelay: `${index * 0.15}s`
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="feature-card-inner">
        <div className="feature-card-blob blob1" style={blob1Style}></div>
        <div className="feature-card-blob blob2" style={blob2Style}></div>
        
        <div className="feature-card-number">{String(index + 1).padStart(2, '0')}</div>
        
        <div className="feature-icon-container" 
          style={{transform: isHovered ? 'translateZ(30px) scale(1.1)' : 'translateZ(0) scale(1)'}}>
          {icon}
        </div>
        
        <h3 className="feature-title"
          style={{transform: isHovered ? 'translateZ(25px)' : 'translateZ(0)'}}>
          {title}
        </h3>
        
        <p className="feature-description"
          style={{transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)'}}>
          {description}
        </p>
        
        <div className="feature-card-shine" 
          style={{
            opacity: isHovered ? 0.1 : 0,
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 255, 255, 0.8), transparent 80%)`
          }}></div>
      </div>
    </div>
  );
};

const FeatureCards = () => {
  const features = [
    {
      title: "Instant Android Conversion",
      description: "Transform your website into a feature-rich Android application with just a few clicks.",
      icon: <CloudIcon />,
      isLarge: true
    },
    {
      title: "Native-Like Performance",
      description: "Enjoy smooth, responsive interactions that feel like native Android applications.",
      icon: <RocketIcon />,
      isLarge: false
    },
    {
      title: "Cross-Platform Ready",
      description: "Create apps that work seamlessly across different Android devices and screen sizes.",
      icon: <DeviceIcon />,
      isLarge: false
    },
    {
      title: "No Coding Required",
      description: "Convert your website without writing a single line of code. It's that simple.",
      icon: <CodeIcon />,
      isLarge: true
    }
  ];

  return (
    <div className="features-container">
      <div className="features-grid-overlay"></div>
      <div className="features-glow"></div>
      
      <div className="features-header">
        <div className="features-subtitle">POWERFUL CAPABILITIES</div>
        <h2 className="features-title">
          Amazing <span className="features-highlight">Features</span>
        </h2>
        <p className="features-description">
          Discover how our platform transforms your website into a powerful Android application with these key features.
        </p>
      </div>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            index={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            isLarge={feature.isLarge}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureCard;