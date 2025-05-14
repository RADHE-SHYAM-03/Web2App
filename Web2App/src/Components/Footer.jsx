import React from 'react';
import './Footer.css';
import Logo from '../Images/Logo.jpg';

const ModernFooter = () => {
  return (
    <div className="modern-footer-container">
      <div className="modern-footer-content">
        <div className="modern-footer-main">
          <div className="modern-footer-logo-section">
            <img src={Logo} className="modern-footer-logo" alt="Web2App Logo" />
            <h3 className="modern-footer-brand" id="contact">Web2App</h3>
            <p className="modern-footer-tagline">Convert websites to Android apps in minutes.</p>
          </div>
          
          <div className="modern-footer-links">
            <div className="modern-footer-link-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
            </div>
            
            <div className="modern-footer-link-column">
              <h4>Company</h4>
              <a href="#developers">Contact</a>
            </div>
            <div className="modern-footer-link-column">
              <h4>Resources</h4>
              <a href="https://drive.google.com/file/d/1TeN5XdX26RJ_jBQsHTL1XwsrsHldKgNR/view?usp=drivesdk " target='_blank'>Documentation</a>
            </div>
          </div>
        </div>
      </div>

      <div className="modern-footer-social">
        <a href="https://instagram.com/sham_dravid_03" className="modern-social-icon" aria-label="Instagram" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/radhe-shyam-6b5780236/" className="modern-social-icon" aria-label="LinkedIn" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
        <a href="https://github.com/RADHE-SHYAM-03" className="modern-social-icon" aria-label="GitHub" target='_blank'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
      </div>
      <div className="modern-footer-bottom">
        <div className="modern-footer-copyright">
          <p>© 2025 Web2App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
export default ModernFooter;