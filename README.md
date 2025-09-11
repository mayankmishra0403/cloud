# Cloud Storage App

A modern React-based cloud storage application built with Appwrite backend for secure file management.

## 🚀 Features

- **User Authentication**
  - Email/password registration and login
  - Google OAuth integration
  - Secure session management

- **File Management**
  - Upload individual files
  - Upload entire folders with directory structure
  - Download files
  - Delete files
  - Folder navigation with breadcrumb trail

- **Modern UI/UX**
  - Responsive design for all devices
  - Glassmorphism design with gradient backgrounds
  - Smooth animations and hover effects
  - Professional dashboard layout

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router
- **Backend:** Appwrite (Authentication, Storage, Database)
- **Styling:** Custom CSS with modern design patterns
- **File Management:** Appwrite Storage API

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/cloud-storage-app.git
cd cloud-storage-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure Appwrite:
   - Update `src/appwrite.js` with your Appwrite project details
   - Set your project ID and endpoint
   - Update the bucket ID for storage

4. Start the development server:
```bash
npm start
```

## ⚙️ Configuration

Update the following in `src/appwrite.js`:
```javascript
client
  .setEndpoint('YOUR_APPWRITE_ENDPOINT')
  .setProject('YOUR_PROJECT_ID');

// Update bucket ID in FileBrowser.js
const BUCKET_ID = 'YOUR_BUCKET_ID';
```

## 🌟 Key Components

- `App.js` - Main application with routing and authentication
- `Login.js` - Authentication component with sign up/login
- `FileBrowser.js` - File management dashboard
- `appwrite.js` - Appwrite client configuration

## 📱 Screenshots

- Modern login/signup interface
- File upload with drag & drop
- Folder navigation and management
- Responsive dashboard design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Live Demo

[Add your deployed app URL here]
# cloud
