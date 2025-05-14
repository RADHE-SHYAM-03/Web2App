import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import './Descard.css';

const Descard = (props) => {
  const number = props.name.split('.')[0];
  const title = props.name.split('. ')[1];
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  
  const { ref: inViewRef, inView: cardInView } = useInView({
    triggerOnce: false,
    threshold: 0.1
  });
  
  // Combine refs
  const setRefs = (node) => {
    cardRef.current = node;
    inViewRef(node);
  };
  
  useEffect(() => {
    if (cardInView) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, (parseInt(number) - 1) * 250);
      
      return () => clearTimeout(timer);
    }
  }, [cardInView, number]);
  
  // Optional: Add parallax effect on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current || !isHovered) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    
    card.style.transform = `translateY(${isVisible ? '0' : '40px'}) 
                           scale(${isHovered ? '1.02' : isVisible ? '1' : '0.95'}) 
                           perspective(1000px) 
                           rotateX(${rotateX}deg) 
                           rotateY(${rotateY}deg)`;
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = isVisible ? 
        'translateY(0) scale(1) perspective(1000px) rotateX(0) rotateY(0)' : 
        'translateY(40px) scale(0.95) perspective(1000px) rotateX(0) rotateY(0)';
    }
  };
  
  return (
    <div 
      className={`desc-card ${isVisible ? 'desc-card-animated' : ''}`}
      ref={setRefs}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="desc-card-number">{number}</div>
      <div className="desc-card-img-container">
        <img src={props.img} alt={title} />
      </div>
      <h3>{title}</h3>
      <p className="desc-card-para">{props.para}</p>
    </div>
  );
};

export default Descard;