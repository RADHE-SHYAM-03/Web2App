import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Hero from "../Images/Hero.png";
import "./Herocontainer.css";
import Navbar from './Navbar'; 
import axios from 'axios';

const Herocontainer = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [appName, setAppName] = useState('');
  const [icon, setIcon] = useState(null);
  const [googleServiceFile, setGoogleServiceFile] = useState(null);
  const [donwloadLink, setDownloadLink] = useState('');
  const [projectZip, setProjectZip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [enableNotification, setEnableNotification] = useState(false);
  const [editableText, setEditableText] = useState('Generating Your APK...');
  const [messageText, setMessageText] = useState('Apk Downloaded Successfully!');
  const [showMessageText, setShowMessageText] = useState(false);
  const [enableDocumentOpening, setEnableDocumentOpening] = useState(true);
  const [documentFileTypes, setDocumentFileTypes] = useState(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']);
  
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  function cleanUrl(url) {
    return url.trim().replace(/\/+$/, '');
  }
  
  useEffect(() => {
    if (isLoading) {
      let counter = 0;
      const timer = setInterval(() => {
        if (counter % 3 === 0) setEditableText('Generating your APK...');
        if (counter % 3 === 1) setEditableText('Your APK will be ready in a few seconds...');
        if (counter % 3 === 2) setEditableText('Your APK will be downloaded shortly...');
        counter++;
      }, 3000); // Change text after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  async function BuildApk() {
    try {
      setIsLoading(true);
      if (selectedOption === 'url') {
        const formData = new FormData();
        formData.append("appName", appName.trim());
        formData.append("url", cleanUrl(urlInput));
        formData.append("googleServices", googleServiceFile);
        formData.append("icon", icon);
        formData.append("enableDocumentOpening", enableDocumentOpening);
        formData.append("documentFileTypes", JSON.stringify(documentFileTypes));

        const response = await axios.post("http://192.168.1.83:3000/generate-apk",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            responseType: "blob" // Important for handling file download
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Web2App.apk");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadLink(url);
        setShowMessageText(true);
        setMessageText('APK Downloaded Successfully! The app will open document files automatically after installation.');
        setTimeout(() => {
          setShowMessageText(false);
        }, 6000);
      } else {
        const formData = new FormData();
        formData.append("appName", appName);
        formData.append("icon", icon);
        formData.append("zipFile", projectZip);
        formData.append("enableDocumentOpening", enableDocumentOpening);
        formData.append("documentFileTypes", JSON.stringify(documentFileTypes));
        
        const response = await axios.post("http://192.168.1.83:3000/generate-apk-zip",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            responseType: "blob"
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Web2App.apk");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadLink(url);
        setShowMessageText(true);
        setMessageText('APK Downloaded Successfully! The app will open document files automatically after installation.');
        setTimeout(() => {
          setShowMessageText(false);
        }, 6000);
      }
    } catch (e) {
      console.error(e.message);
      setShowMessageText(true);
      setMessageText('Error: ' + e.message);
      setTimeout(() => {
        setShowMessageText(false);
        setMessageText('');
      }, 10000);
    } finally {
      setIsLoading(false);
      handleClosePrompt();
    }
  }

  const handleBuildClick = () => {
    setShowPrompt(true);
    setSelectedOption(null);
    setAppName('');
    setIcon(null);
    setGoogleServiceFile(null);
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
    setSelectedOption(null);
    setUrlInput('');
    setAppName('');
    setIcon(null);
    setGoogleServiceFile(null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleUrlChange = (e) => {
    setUrlInput(e.target.value);
  };

  const handleDocumentTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDocumentFileTypes([...documentFileTypes, value]);
    } else {
      setDocumentFileTypes(documentFileTypes.filter(type => type !== value));
    }
  };

  return (
    <>
      {/* Render Navbar with the build button handler */}
      <Navbar onBuildClick={handleBuildClick} />
      
      <div className={`message-container ${showMessageText ? 'active' : ''}`}>
        <p>{messageText}</p>
      </div>
      <div
        className={`main-container ${heroInView ? 'main-container-animated' : ''}`}
        ref={heroRef}
      >
        <div className={`hero-right ${heroInView ? 'hero-right-animated' : ''}`}>
          <h1>Convert your website to an <span>android application</span>.</h1>
          <p className="hero-paragraph">
            You can convert your website to an <span>Android application</span> with just your URL in minutes.
          </p>
          <div className="build-button-container">
            <button className="build-button" onClick={handleBuildClick}>
              BUILD APP
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              No coding required
            </div>
            <div className="hero-feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Ready in minutes
            </div>
            <div className="hero-feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Full customization
            </div>
            <div className="hero-feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Open document files
            </div>
          </div>
        </div>
        <div className={`hero-left ${heroInView ? 'hero-left-animated' : ''}`}>
          <img src={Hero} alt="hero-img" className="hero-image" />
        </div>
      </div>

      {/* Prompt Modal */}
      <div className={`prompt-modal ${showPrompt ? 'show' : ''}`}>
        <div className="prompt-content">
          {isLoading && (
            <div className="loader-container">
              <span className="loader"></span>
              <p>{editableText}</p>
            </div>
          )}

          <div className="prompt-header">
            <h3>{selectedOption ? (selectedOption === 'url' ? 'Enter Website URL' : 'Select Source Folder') : 'Choose your source'}</h3>
          </div>

          {!selectedOption ? (
            // Initial options
            <div className="prompt-options">
              <div className="prompt-option" onClick={() => handleOptionSelect('url')}>
                <div className="prompt-option-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </div>
                <div className="prompt-option-text">
                  <h4>Website URL</h4>
                  <p>Enter your website address to convert it to an Android app</p>
                </div>
              </div>
              <div className="prompt-option" onClick={() => handleOptionSelect('local')}>
                <div className="prompt-option-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div className="prompt-option-text">
                  <h4>Local Source Folder</h4>
                  <p>Convert your local web project to an Android app</p>
                </div>
              </div>
            </div>
          ) : (
            // URL input or local folder input based on selection
            <div className="prompt-input-container">

              {selectedOption === 'url' ? (
                <div className="url-input-group">

                  <input
                    type="text"
                    className="url-input"
                    placeholder="https://your-website.com"
                    value={urlInput}
                    onChange={handleUrlChange}
                  />
                  <input
                    type="text"
                    className="url-input"
                    placeholder="App Name"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                  <label type="text"
                    className="url-input"
                    htmlFor='icon_input'
                    style={{ color: '#d0d0d0', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    Choose Icon
                  </label>
                  <input
                    type="file"
                    accept="image/png"
                    className="url-input"
                    id='icon_input'
                    placeholder="App Icon"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
                        setIcon(file);
                      } else {
                        alert("Only PNG or JPG files are allowed.");
                        e.target.value = null; // Clear the input
                      }
                    }}
                  />
                  <p className="input-help">{icon ? icon.name : "Select File"}</p>
                  
                  {/* Document Files Opening Option */}
                  <div className="show-notification-div">
                    <div className={`enable-notification ${enableDocumentOpening ? 'enable' : ''}`} onClick={() => setEnableDocumentOpening(!enableDocumentOpening)}>
                    </div>
                    <p style={{ color: 'white' }}>Enable Document File Opening</p>
                  </div>
                  
                  {enableDocumentOpening && (
                    <div className="document-types-container" style={{ marginTop: '10px', color: 'white' }}>
                      <p style={{ marginBottom: '5px' }}>Select document types to open:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].map(type => (
                          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input
                              type="checkbox"
                              id={`file-type-${type}`}
                              value={type}
                              checked={documentFileTypes.includes(type)}
                              onChange={handleDocumentTypeChange}
                            />
                            <label htmlFor={`file-type-${type}`}>.{type}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="show-notification-div" style={{ marginTop: '10px' }}>
                    <div className={`enable-notification ${enableNotification ? 'enable' : ''}`} onClick={() => setEnableNotification(!enableNotification)}>
                    </div>
                    <p style={{ color: 'white' }}>Enable Firebase Notification</p>
                  </div>
                  
                  {enableNotification && (
                    <>
                    <label type="text"
                    className="url-input"
                    htmlFor='google_input'
                    onClick={() => alert("Make sure your google-services.json conatains the package com.example.your-app-name")}
                    style={{ color: '#d0d0d0', display: 'flex', alignItems: 'center', gap: '5px'  }}
                  >
                    Upload Google-Service.json
                  </label>
                  <input
                    type="file"
                     accept="application/json"
                    className="url-input"
                    id='google_input'
                    placeholder="App Icon"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && (file.type === 'application/json')) {
                        setGoogleServiceFile(file);
                      } else {
                        alert("Only Json files are allowed.");
                        e.target.value = null; // Clear the input
                      }
                    }}
                  />
                  <p className="input-help">{googleServiceFile ? googleServiceFile.name : "Select File"}</p>
                  </>)}

                  
                  {donwloadLink !== '' && (
                    <a style={{ color: 'white', cursor: 'pointer' }} href={donwloadLink}>Download</a>
                  )}

                </div>

              ) : (
                <div className="file-input-group">
                  <input
                    type="text"
                    className="url-input"
                    placeholder="App Name"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                  <label type="text"
                    className="url-input"
                    htmlFor='icon_input'
                    style={{ color: '#d0d0d0', display: 'flex', alignItems: 'center', gap: '5px'  }}
                    >
                    Choose File
                  </label>
                  <input
                    type="file"
                    accept='image/png'
                    className="url-input"
                    id='icon_input'
                    placeholder="App Icon"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
                        setIcon(file);
                      } else {
                        alert("Only PNG or JPG files are allowed.");
                        e.target.value = null; // Clear the input
                      }
                    }}
                  />
                  {icon === null ? (
                    <p className="input-help">Select your app Icon</p>
                  ) : (
                    <p className="input-help" style={{ fontSize: "16px" }}>{icon.name}</p>
                  )}
                  
                  {/* Document Files Opening Option */}
                  <div className="show-notification-div">
                    <div className={`enable-notification ${enableDocumentOpening ? 'enable' : ''}`} onClick={() => setEnableDocumentOpening(!enableDocumentOpening)}>
                    </div>
                    <p style={{ color: 'white' }}>Enable Document File Opening</p>
                  </div>
                  
                  {enableDocumentOpening && (
                    <div className="document-types-container" style={{ marginTop: '10px', color: 'white' }}>
                      <p style={{ marginBottom: '5px' }}>Select document types to open:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].map(type => (
                          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input
                              type="checkbox"
                              id={`file-type-local-${type}`}
                              value={type}
                              checked={documentFileTypes.includes(type)}
                              onChange={handleDocumentTypeChange}
                            />
                            <label htmlFor={`file-type-local-${type}`}>.{type}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <label className="file-input-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Choose File
                    <input type="file" accept='.zip, application/zip' style={{ display: 'none' }} 
                    onChange={ async (e) => {
                      const file = e.target.files[0];
                      const maxSize = 10 * 1024 * 1024; // 10MB
                    
                      if (
                        file &&
                        (file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip'))
                      ) {
                        if (file.size > maxSize) {
                          e.target.value = null;
                          alert("File size should be less than 10MB.");
                          return;
                        }
                    
                        try {
                          const zip = await JSZip.loadAsync(file);
                          const fileList = Object.keys(zip.files).map((f) => f.toLowerCase());
                          const hasIndexHtml = fileList.includes('index.html');
                    
                          if (hasIndexHtml) {
                            setProjectZip(file);
                          } else {
                            e.target.value = null;
                            alert("The ZIP file must contain an 'index.html' file.");
                          }
                        } catch (err) {
                          e.target.value = null;
                          alert("Failed to read the ZIP file.");
                          console.error(err);
                        }
                      } else {
                        e.target.value = null;
                        alert("Only ZIP files are allowed.");
                      }}
                      } />
                  </label>
                  {projectZip === null ? (
                    <p className="input-help">Upload your project zip containing index.html file</p>
                  ) : (
                    <p className="input-help" style={{ fontSize: "16px" }}>{projectZip.name}</p>
                  )}
                </div>
              )}

              <div className="prompt-action-buttons">
                <button className="action-button back-button" onClick={() => {
                  setSelectedOption(null);
                  setUrlInput('');
                  setIcon(null);
                  setAppName('');
                  setProjectZip(null);
                }}>
                  Back
                </button>
                <button
                  className="action-button proceed-button"
                  onClick={BuildApk}
                  disabled={selectedOption === 'url' && !urlInput}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          <div className="prompt-footer">
            <button className="prompt-close" onClick={handleClosePrompt}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Herocontainer;
