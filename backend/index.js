const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const multer = require("multer");
const cors = require("cors");

const app = express();
const PORT = 3000;
let isProcessing = false;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configure file storage
fs.ensureDirSync('uploads');

// Set up multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const runCommand = (command, cwd) => {
    return new Promise((resolve, reject) => {
        exec(command, { cwd, maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error executing: ${command}\n`, stderr);
                return reject(new Error(stderr));
            }
            console.log(`✅ Success: ${command}\n${stdout}`);
            resolve(stdout);
        });
    });
};


const deleteFolder = async (folderPath) => {
    try {
        await fs.remove(folderPath);
        console.log(`🗑️ Deleted: ${folderPath}`);
    } catch (error) {
        console.error(`❌ Failed to delete: ${folderPath}\nError: ${error.message}`);
    }
};

// Main APK generation endpoint
app.post("/generate-apk", upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "googleServices", maxCount: 1 }
]), async (req, res) => {
    if (isProcessing) {
        return res.status(429).json({ error: "Server is currently processing another request. Try again later." });
    }

    isProcessing = true;

    try {
        const { appName, url } = req.body;
        const iconPath = req.files.icon ? req.files.icon[0].path : "";
        const googleServicesPath = req.files.googleServices ? req.files.googleServices[0].path : "";
        if (!appName || !url) {
            isProcessing = false;
            return res.status(400).json({ error: "App name and URL are required" });
        }

        const sanitizedAppName = appName.replace(/[^a-zA-Z0-9]/g, "");
        const projectBasePath = path.join(__dirname, "cordova_projects");
        const projectPath = path.join(projectBasePath, sanitizedAppName);
        fs.ensureDirSync(projectBasePath);

        if (fs.existsSync(projectPath)) {
            await deleteFolder(projectPath);
        }
        fs.ensureDirSync(projectPath);

        // Create Cordova Project
        await runCommand(`cordova create "${projectPath}" "com.example.${sanitizedAppName}" "${sanitizedAppName}"`, projectBasePath);
        await runCommand("cordova platform add android", projectPath);
        if (googleServicesPath) {
            await runCommand("cordova plugin add cordova-plugin-firebasex", projectPath);
            const androidAppPath = path.join(projectPath, "platforms/android/app");
            const destGoogleServicesInApp = path.join(androidAppPath, "google-services.json");
            const destGoogleServicesInRoot = path.join(projectPath, "google-services.json");

            // Ensure the directories exist
            fs.ensureDirSync(androidAppPath);

            // Copy to Android app directory
            fs.copySync(googleServicesPath, destGoogleServicesInApp);

            // Copy to project root directory
            fs.copySync(googleServicesPath, destGoogleServicesInRoot);
            const gradleFilePath = path.join(projectPath, "platforms/android/build.gradle");

        const newGradleContent = `buildscript {
apply from: 'CordovaLib/cordova.gradle'
apply from: 'repositories.gradle'
repositories repos
dependencies {
    classpath "com.android.tools.build:gradle:\${cordovaConfig.AGP_VERSION}"
    classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:\${cordovaConfig.KOTLIN_VERSION}"
    classpath 'com.google.gms:google-services:4.3.15' 
    // NOTE: Do not place your application dependencies here; they belong
    // in the individual module build.gradle files
}

cdvHelpers.verifyCordovaConfigForBuild()
}

allprojects {
def hasRepositoriesGradle = file('repositories.gradle').exists()
if (hasRepositoriesGradle) {
    apply from: 'repositories.gradle'
} else {
    apply from: "\${project.rootDir}/repositories.gradle"
}

repositories repos
}

task clean(type: Delete) {
delete rootProject.buildDir
}`;

        fs.writeFileSync(gradleFilePath, newGradleContent.trim(), "utf-8");

        }
        if (iconPath) {
            const destIconPath = path.join(projectPath, "icon.png");
            fs.copySync(iconPath, destIconPath);
        }
        
        // Create WebView HTML
        const indexHtmlContent = `
      <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Redirect with Token</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="cordova.js"></script>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
    }
  </style>
</head>
<body>
${googleServicesPath && (`
     <script>
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {

FirebasePlugin.hasPermission(function(result) {
    if (result) {
        console.log("Permission granted");
    } else {
        console.log("Permission denied");
        // You can try to request permission here
        FirebasePlugin.grantPermission(function() {
            console.log("Permission granted after request");
        }, function(error) {
            console.error("Permission request failed:", error);
        });
    }
}, function(error) {
    console.error("Error checking permission:", error);
});

      FirebasePlugin.getToken(function (token) {
        const url = "${url}?token=" + encodeURIComponent(token);
        window.location.href = url; // load directly in Cordova WebView
      }, function (error) {
        alert("Error getting FCM token: " + error);
      });
    }
  </script>
    `)}
 
</body>
</html>

        `;
        fs.writeFileSync(`${projectPath}/www/index.html`, indexHtmlContent);
        const configXmlPath = path.join(projectPath, "config.xml");


        const newConfigXml = `<?xml version='1.0' encoding='utf-8'?>
        <widget id="com.example.${sanitizedAppName}" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
            <name>${sanitizedAppName}</name>
            <description>Sample Apache Cordova App</description>
            <author email="dev@cordova.apache.org" href="https://cordova.apache.org">
                Apache Cordova Team
            </author>
            <platform name="android">
                   <!-- App Icon -->
    <icon src="icon.png" />

    <!-- Splash Screen Preferences -->
    <preference name="SplashScreen" value="screen" />
    <preference name="SplashScreenDelay" value="3000" /> <!-- Splash screen delay in ms -->
    <preference name="AutoHideSplashScreen" value="true" />
    
    <!-- Set Android-specific splash screen behavior -->
    <preference name="AndroidWindowSplashScreenAnimatedIcon" value="icon.png" />
    <preference name="AndroidWindowSplashScreenBackgroundColor" value="#FFFFFF" /> <!-- Background color -->
            </platform>
            ${googleServicesPath ? (`<plugin name="cordova-plugin-firebasex" spec="18.0.7" /> \n   <access origin="${url}" /> />`):
                (`<content src="${url}" />`)
            }
           <allow-navigation href="https://*/*" />
            <allow-intent href="http://*/*" />
            <allow-intent href="https://*/*" />
        </widget>`;
        fs.writeFileSync(configXmlPath, newConfigXml, "utf-8");
        
        
        // Build APK
        await runCommand("cordova build android", projectPath);
        // Send APK
        const apkPath = path.join(projectPath, "platforms/android/app/build/outputs/apk/debug/app-debug.apk");
        if (fs.existsSync(apkPath)) {
            res.download(apkPath, `${sanitizedAppName}.apk`, async (err) => {
                if (!err) {
                    setTimeout(() => deleteFolder(projectPath), 300000); // 5 mins
                    (async () => {
                        try {
                            if (iconPath) fs.unlinkSync(iconPath);
        
                            const uploadsDir = path.join(__dirname, "uploads");
                            if (await fs.pathExists(uploadsDir)) {
                                const files = await fs.readdir(uploadsDir);
                                await Promise.all(
                                    files.map(file => fs.remove(path.join(uploadsDir, file)))
                                );
                                console.log(`🧹 Cleared uploads folder:`, files);
                            } else {
                                console.log(`📂 uploads folder does not exist, skipping`);
                            }
                        } catch (e) {
                            console.error("❌ Error while clearing uploads folder:", e.message);
                        }
                    })();
                } else {
                    console.error(`❌ Failed to send APK: ${err.message}`);
                }
            });
        } else {
            throw new Error("APK file not found");
        }
    } catch (error) {
        console.error("🚨 Error:", error.message);
        res.status(500).json({ error: error.message});
    } finally {
        isProcessing = false;
    }
});
const unzipper = require("unzipper");

app.post("/generate-apk-zip", upload.fields([{ name: "icon" }, { name: "zipFile" }]), async (req, res) => {
    if (isProcessing) {
        return res.status(429).json({ error: "Server is currently processing another request. Try again later." });
    }

    isProcessing = true;

    try {
        const { appName } = req.body;
        const iconPath = req.files["icon"] ? req.files["icon"][0].path : "";
        const zipFilePath = req.files["zipFile"] ? req.files["zipFile"][0].path : "";

        if (!appName || !zipFilePath) {
            isProcessing = false;
            return res.status(400).json({ error: "App name and ZIP file are required" });
        }

        const sanitizedAppName = appName.replace(/[^a-zA-Z0-9]/g, "");
        const projectBasePath = path.join(__dirname, "cordova_projects");
        const projectPath = path.join(projectBasePath, sanitizedAppName);

        fs.ensureDirSync(projectBasePath);

        if (fs.existsSync(projectPath)) {
            await deleteFolder(projectPath);
        }

        fs.ensureDirSync(projectPath);

        // Step 1: Create Cordova Project
        await runCommand(`cordova create "${projectPath}" "com.example.${sanitizedAppName}" "${sanitizedAppName}"`, projectBasePath);
        await runCommand("cordova platform add android", projectPath);
   

        // Step 2: Extract ZIP contents into www folder
        const wwwPath = path.join(projectPath, "www");
        fs.ensureDirSync(wwwPath);

        await fs.createReadStream(zipFilePath).pipe(unzipper.Extract({ path: wwwPath })).promise();

        // Check if index.html exists
        if (!fs.existsSync(path.join(wwwPath, "index.html"))) {
            throw new Error("ZIP file must contain an index.html file in the root.");
        }
        if (iconPath) {
            const destIconPath = path.join(projectPath, "icon.png");
            fs.copySync(iconPath, destIconPath);
        }
        const configXmlPath = path.join(projectPath, "config.xml");
        const newConfigXml = `<?xml version='1.0' encoding='utf-8'?>
        <widget id="com.example.${sanitizedAppName}" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
            <name>${sanitizedAppName}</name>
            <description>Sample Apache Cordova App</description>
            <author email="dev@cordova.apache.org" href="https://cordova.apache.org">
                Apache Cordova Team
            </author>
            <platform name="android">
                   <!-- App Icon -->
    <icon src="icon.png" />

    <!-- Splash Screen Preferences -->
    <preference name="SplashScreen" value="screen" />
    <preference name="SplashScreenDelay" value="3000" /> <!-- Splash screen delay in ms -->
    <preference name="AutoHideSplashScreen" value="true" />
    
    <!-- Set Android-specific splash screen behavior -->
    <preference name="AndroidWindowSplashScreenAnimatedIcon" value="icon.png" />
    <preference name="AndroidWindowSplashScreenBackgroundColor" value="#FFFFFF" /> <!-- Background color -->
            </platform>
            <access origin="*" />
            <allow-intent href="http://*/*" />
            <allow-intent href="https://*/*" />
        </widget>`;
        fs.writeFileSync(configXmlPath, newConfigXml, "utf-8");
        // Step 4: Build APK
        await runCommand("cordova build android", projectPath);

        // Step 5: Send APK to client
        const apkPath = path.join(projectPath, "platforms/android/app/build/outputs/apk/debug/app-debug.apk");
        if (fs.existsSync(apkPath)) {
            res.download(apkPath, `${sanitizedAppName}.apk`, async (err) => {
                if (!err) {
                    console.log(`📂 Scheduled deletion in 5 minutes: ${projectPath}`);
                    setTimeout(() => deleteFolder(projectPath), 300000);
                    (async () => {
                        try {
                            if (iconPath) fs.unlinkSync(iconPath);
        
                            const uploadsDir = path.join(__dirname, "uploads");
                            if (await fs.pathExists(uploadsDir)) {
                                const files = await fs.readdir(uploadsDir);
                                await Promise.all(
                                    files.map(file => fs.remove(path.join(uploadsDir, file)))
                                );
                                console.log(`🧹 Cleared uploads folder:`, files);
                            } else {
                                console.log(`📂 uploads folder does not exist, skipping`);
                            }
                        } catch (e) {
                            console.error("❌ Error while clearing uploads folder:", e.message);
                        }
                    })();
                    fs.unlinkSync(zipFilePath);
                } else {
                    console.error(`❌ Failed to send APK: ${err.message}`);
                }
            });
        } else {
            throw new Error("APK file not found");
        }
    } catch (error) {
        console.error("🚨 Error:", error);
        res.status(500).json({ error: "Failed to generate APK", details: error.toString() });
    } finally {
        isProcessing = false;
    }
});

// Prevent crashes from uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("🛑 Uncaught Exception:", err);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
})