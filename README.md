# Web2App 📱

> **A system that converts any website into a fully functional Android application**

[![Made with Apache Cordova](https://img.shields.io/badge/Made%20with-Apache%20Cordova-blue)](https://cordova.apache.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Push%20Notifications-Firebase%20FCM-orange)](https://firebase.google.com/docs/cloud-messaging)
[![React.js](https://img.shields.io/badge/Frontend-React.js-61DAFB)](https://reactjs.org/)

## 🌟 Overview

Web2App is an innovative solution that automates the conversion of websites into fully functional Android applications. Built as a final year project for Computer Engineering Diploma at Govt. Polytechnic Panchkula, this system eliminates the need for extensive mobile app development by providing a simple, user-friendly interface for web-to-app conversion.

## ✨ Key Features

- 🔄 **Automated Web-to-App Conversion** - Convert any website to Android app instantly
- 🎨 **Complete Customization** - Custom app names, icons, and themes
- 📲 **Push Notifications** - Real-time notifications via Firebase Cloud Messaging (FCM)
- 🌐 **WebView Integration** - Seamless website display within native app
- 📱 **User-Friendly Interface** - No technical expertise required
- ⚡ **Quick APK Generation** - Generate downloadable APK files instantly
- 🔧 **Dual Input Methods** - Build from URL or HTML files

## 🛠️ Technologies Used

### Frontend
- **Apache Cordova** - Cross-platform mobile app development
- **React.js** - User interface framework
- **Cordova WebView** - Website content display

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework

### Services
- **Firebase Cloud Messaging (FCM)** - Push notification service

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Apache Cordova CLI
- Android SDK
- Firebase account (for push notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/web2app.git
   cd web2app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase (Optional for push notifications)**
   - Create a Firebase project
   - Download `google-services.json`
   - Place it in the project root

4. **Start the development server**
   ```bash
   npm start
   ```

## 📖 How to Use

### Method 1: Build App from URL

1. **Click "Build"** → Choose **"From URL"**

2. **Fill the form:**
   - **URL:** Enter website URL (e.g., `https://example.com`)
   - **App Name:** Choose your app name
   - **App Icon:** Upload PNG image (512x512 recommended)

3. **Optional:** Enable Firebase notifications
   - Upload `google-services.json`
   - Toggle "Enable Firebase Notification"

4. **Click "Generate APK"** to build your app

### Method 2: Build App from HTML Files

1. **Prepare your files:**
   - Create `index.html` (mandatory main entry file)
   - Add CSS, JS, images, and other assets
   - Zip all files with `index.html` at root level

2. **Click "Build"** → Choose **"From HTML"**

3. **Fill the inputs:**
   - **App Name:** e.g., MyHTMLApp
   - **App Icon:** Upload PNG image
   - **HTML ZIP File:** Upload your project zip

4. **Generate APK**

## 🔔 Push Notifications Setup

### For Developers Hosting Notification Server

1. **Create Node.js server** (`server.js`):

```javascript
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json"))
});

app.post("/notify", async (req, res) => {
  const { token, title, body } = req.body;
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      android: {
        notification: { sound: 'default' }
      }
    });
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (err) {
    console.error("FCM Error:", err);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

2. **Add Firebase Admin SDK Key:**
   - Download `serviceAccountKey.json` from Firebase Console
   - Place in project root

3. **Send notifications from your website:**

```javascript
try {
  const res = await fetch("http://localhost:3000/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, title, body })
  });
  const data = await res.json();
  console.log(data.message || data.error);
} catch (error) {
  console.error("Failed to send notification:", error);
}
```

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Firebase     │
│   (React.js)    │◄──►│   (Node.js)     │◄──►│      FCM        │
│                 │    │                 │    │                 │
│ - User Interface│    │ - API Handling  │    │ - Push Notifs   │
│ - App Builder   │    │ - App Config    │    │ - Cloud Service │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────-----
│  Generated App      │
│   (Cordova)         │
│                     │
│ - WebView           │
│ - Custom Branding   │
│ - Push Notifications│
└─────────────────-----
```

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Testing** - Individual component testing
- **Integration Testing** - System component interaction
- **User Acceptance Testing** - Real user feedback

### Test Results
- ✅ WebView Loading: Passed
- ✅ App Customization: Passed  
- ✅ Backend API Response: Passed
- ⚠️ Push Notification Delays: Mostly Passed (minor delays addressed)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔮 Future Enhancements

- [ ] **Offline Support** - Cache content for offline access
- [ ] **iOS Support** - Expand to iOS platform
- [ ] **Performance Optimization** - Improve WebView rendering
- [ ] **App Analytics** - User behavior tracking
- [ ] **Advanced Features** - Social media integration, in-app purchases
- [ ] **Progressive Web App (PWA)** support

## 📊 Performance Metrics

- **Conversion Time:** < 2 minutes average
- **APK Size:** Optimized based on website complexity
- **Push Notification Delivery:** ~3-5 seconds average
- **Cross-Device Compatibility:** 95%+ Android devices

---

⭐ **Star this repository if you find it useful!**


<h1><a href="https://drive.google.com/file/d/1TeN5XdX26RJ_jBQsHTL1XwsrsHldKgNR/view" >Click Here for more information.🔗<a/></h1>
