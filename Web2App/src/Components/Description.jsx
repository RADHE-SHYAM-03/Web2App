import React, { useEffect, useRef } from 'react';
import Url from "../Images/Url.png";
import Download from "../Images/Download.png";
import Processing from "../Images/Processing.png";
import './Description.css';
import Descard from './Descard';
const Description = () => {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    // Optional: Parallax scrolling effect for the background
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView) {
        const scrollPosition = window.scrollY;
        const sectionTop = rect.top + scrollPosition;
        const offset = (scrollPosition - sectionTop) * 0.05;
        
        if (section.querySelector('.description-grid-overlay')) {
          section.querySelector('.description-grid-overlay').style.transform = 
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
    <div className="description-container" ref={sectionRef}>
      <div className="description-grid-overlay"></div>
      <div className='description-container-top'> 
        <div className="description-title-container">
          <div className="description-title-bg"></div>
          <h2 id="how-it-works">How it <span>works</span></h2>
        </div>
        <p className="description-subtitle">
          Converting your website to an Android app is simple and straightforward with our elegant three-step process.
        </p>
      </div>
      <div className="description-container-bottom">
        <Descard 
          name="1. Submit your website URL" 
          img={Url} 
          para="Enter the website address you would like to transform into a premium Android application." 
        />
        <Descard 
          name="2. Processing" 
          img={Processing} 
          para="Our advanced system automatically converts your website into a fully functional, beautifully designed Android application." 
        />
        <Descard 
          name="3. Download your APP" 
          img={Download} 
          para="You're all set! Simply download your new application and install it on your device to experience your website in a whole new way." 
        />
      </div>
    </div>
  );
};

export default Description;