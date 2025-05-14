import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Logo from '../Images/Logo.jpg';
import './Navbar.css';

const Navbar = ({ onBuildClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { ref: navbarRef, inView: navbarInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleBuildButtonClick = () => {
    if (onBuildClick) {
      onBuildClick();
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div 
        className={`navbar ${scrolled ? 'scrolled' : ''} ${navbarInView ? 'navbar-animated' : ''}`}
        ref={navbarRef}
      > 
        <div className="navbar-logo">
          <img src={Logo} id="site-logo" alt="Logo" />
          <h2>Web2App</h2>
        </div>
        
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
        </div>
        
        <ul id="navbar-ul" className={menuOpen ? 'show-menu' : ''}>
          <li><a href="#features"  id="nav-a">Features</a></li>
          <li><a href="#how-it-works"  id="nav-a">How It Works</a></li>
          <li><a href="#developers" id="nav-a">Contact</a></li>
          <li>
            <button id="nav-a-button" onClick={handleBuildButtonClick}>
              BUILD APP
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;