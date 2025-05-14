import React, { useState, useEffect } from 'react';
const ResponsiveViewportHandler = ({ children }) => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth <= 768,
    isSmallMobile: window.innerWidth <= 480,
    isExtraSmallMobile: window.innerWidth <= 360
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768,
        isSmallMobile: window.innerWidth <= 480,
        isExtraSmallMobile: window.innerWidth <= 360
      });
    };

    window.addEventListener('resize', handleResize);
    const initialTimer = setTimeout(() => {
      handleResize();
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(initialTimer);
    };
  }, []);
  return (
    <React.Fragment>
      {React.Children.map(children, child => {
        return React.isValidElement(child) 
          ? React.cloneElement(child, { viewport }) 
          : child;
      })}
    </React.Fragment>
  );
};
export default ResponsiveViewportHandler;