import React, { useEffect, useRef } from 'react';
import './Feature.css';
import Admob from '../Images/Admob.png';
import Biometric from '../Images/Biometric.png';
import Deeplink from '../Images/Deeplink.png';
import Custom from '../Images/Custom.png';
import Firebase from '../Images/Firebase.png';
import Google from '../Images/Google.png';

const FeatureCard = ({ img, title, para, index }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (cardRef.current) {
                cardRef.current.style.opacity = '1';
                cardRef.current.style.transform = 'translateY(0)';
              }
            }, index * 150); // Staggered animation delay
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);
  
  // Optional mouse parallax effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate distance from center
    const distanceX = (mouseX - centerX) / 20;
    const distanceY = (mouseY - centerY) / 20;
    
    // Apply subtle transformation
    const icon = card.querySelector('.feature-icon');
    
    if (icon) {
      icon.style.transform = `translateX(${distanceX * 0.5}px) translateY(${distanceY * 0.5}px)`;
    }
  };
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    const icon = cardRef.current.querySelector('.feature-icon');
    
    if (icon) {
      icon.style.transform = 'translateX(0) translateY(0)';
    }
  };
  
  return (
    <div 
      className="feature-card" 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="feature-icon">
        <img src={img} alt={title} />
      </div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-para">{para}</p>
    </div>
  );
};

const Feature = () => {
  // Feature data array to make it easier to manage
  const featureData = [
    {
      img: Firebase,
      title: "Firebase Push Notification",
      para: "Integrate Firebase to send notifications to all app users directly from the Web2App Control Panel."
    },
    {
      img: Admob,
      title: "Admob Ads",
      para: "Integrate Admob to display ads and boost revenue, unlocking full potential for your website to app solution."
    },
    {
      img: Google,
      title: "Native Google Sign-in",
      para: "Enable Google sign-in for seamless native authentication, making it easy for users to access your web app."
    },
    {
      img: Biometric,
      title: "Biometric Authentication",
      para: "Enhance security for your entire app or specific parts with fingerprint and face recognition authentication."
    },
    {
      img: Custom,
      title: "Custom CSS & JS",
      para: "Add custom CSS or Javascript code to customize the website-to-app experience with extra features and styling."
    },
    {
      img: Deeplink,
      title: "Deep Linking",
      para: "Automatically open your app when your website's URL is clicked in other apps for a seamless user experience."
    }
  ];

  const sectionRef = useRef(null);
  
  useEffect(() => {
    // Optional parallax scrolling effect
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView) {
        const scrollPosition = window.scrollY;
        const sectionTop = rect.top + scrollPosition;
        const offset = (scrollPosition - sectionTop) * 0.05;
        
        // Apply subtle parallax to the grid overlay
        if (section.querySelector('.feature-grid-overlay')) {
          section.querySelector('.feature-grid-overlay').style.transform = 
            `translateY(${offset}px)`;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='feature-section' ref={sectionRef}>
      <div className="feature-grid-overlay"></div>
      <div className="feature-top">
        <h2 className="feature-heading">Top <span>Features</span> of Web2App Builder</h2>
        <p className="feature-para">
          Explore Web2App's powerful tools to easily convert your website into a fully functional 
          mobile app with advanced capabilities and sophisticated customization options.
        </p>
      </div>
      <div className="feature-card-container">
        {featureData.map((feature, index) => (
          <FeatureCard
            key={index}
            img={feature.img}
            title={feature.title}
            para={feature.para}
            index={index}
          />
        ))}
      </div>
    </div> 
  );
};

export default Feature;