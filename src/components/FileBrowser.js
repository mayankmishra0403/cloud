import React, { useState, useEffect } from 'react';
import { storage, account } from '../appwrite';
import './FileBrowser.css';

const FileBrowser = ({ setUser }) => {
  const BUCKET_ID = '68c134880025ebc4944a';
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [localUser, setLocalUser] = useState(null);
  const [currentPath, setCurrentPath] = useState('');

  // Get user info
  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await account.get();
        setLocalUser(userData);
      } catch (err) {
        console.error('Error getting user:', err);
      }
    };
    getUser();
  }, []);

  // List files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await storage.listFiles(BUCKET_ID);
        setFiles(res.files);
      } catch (err) {
        setError('Failed to fetch files');
      }
    };
    fetchFiles();
  }, [currentPath]);

  // Upload file
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fileName = currentPath ? `${currentPath}/${file.name}` : file.name;
      await storage.createFile(BUCKET_ID, 'unique()', file);
      // Refresh file list
      const res = await storage.listFiles(BUCKET_ID);
      setFiles(res.files);
    } catch (err) {
      setError('Upload failed: ' + err.message);
    }
    setUploading(false);
    e.target.value = ''; // Reset file input
  };

  // Upload folder
  const handleFolderUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    setError('');
    
    try {
      for (const file of files) {
        const relativePath = file.webkitRelativePath;
        const fileName = currentPath ? `${currentPath}/${relativePath}` : relativePath;
        await storage.createFile(BUCKET_ID, 'unique()', file);
      }
      
      // Refresh file list
      const res = await storage.listFiles(BUCKET_ID);
      setFiles(res.files);
    } catch (err) {
      setError('Folder upload failed: ' + err.message);
    }
    
    setUploading(false);
    e.target.value = ''; // Reset file input
  };

  // Download file
  const handleDownload = async (fileId, name) => {
    try {
      const result = storage.getFileDownload(BUCKET_ID, fileId);
      window.open(result.href, '_blank');
    } catch (err) {
      setError('Download failed: ' + err.message);
    }
  };

  // Delete file
  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
      // Refresh file list
      const res = await storage.listFiles(BUCKET_ID);
      setFiles(res.files);
    } catch (err) {
      setError('Delete failed: ' + err.message);
    }
  };

  // Navigate to folder
  const navigateToFolder = (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
  };

  // Navigate back
  const navigateBack = () => {
    if (currentPath) {
      const pathParts = currentPath.split('/');
      pathParts.pop();
      setCurrentPath(pathParts.join('/'));
    }
  };

  // Get folders in current directory
  const getFolders = () => {
    const folders = new Set();
    files.forEach(file => {
      const fileName = file.name;
      const relativePath = currentPath ? fileName.replace(currentPath + '/', '') : fileName;
      
      if (relativePath.includes('/') && relativePath !== fileName) {
        const folderName = relativePath.split('/')[0];
        folders.add(folderName);
      }
    });
    return Array.from(folders);
  };

  // Get files in current directory (not in subfolders)
  const getCurrentFiles = () => {
    return files.filter(file => {
      const fileName = file.name;
      const relativePath = currentPath ? fileName.replace(currentPath + '/', '') : fileName;
      return !relativePath.includes('/') || relativePath === fileName;
    });
  };

  // Logout
  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null); // Clear user state in parent component
    } catch (err) {
      setError('Logout failed: ' + err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-browser">
      <div className="dashboard-header">
        <div>
          <h2>Cloud Storage Dashboard</h2>
          {localUser && <p style={{ margin: 0, color: '#718096' }}>Welcome, {localUser.name}!</p>}
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="upload-section">
        <div className="upload-controls">
          <label htmlFor="file-upload" className="upload-area">
            <input
              id="file-upload"
              type="file"
              onChange={handleUpload}
              disabled={uploading}
            />
            <div className="upload-text">
              {uploading ? (
                <>
                  <span className="loading-spinner"></span>
                  Uploading...
                </>
              ) : (
                '📄 Click to upload file'
              )}
            </div>
          </label>

          <label htmlFor="folder-upload" className="upload-area">
            <input
              id="folder-upload"
              type="file"
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleFolderUpload}
              disabled={uploading}
            />
            <div className="upload-text">
              📁 Upload Folder
            </div>
          </label>
        </div>
      </div>

      <div className="files-section">
        <div className="files-header-container">
          <div className="breadcrumb">
            <button onClick={() => setCurrentPath('')} className="breadcrumb-btn">
              🏠 Home
            </button>
            {currentPath && (
              <>
                {currentPath.split('/').map((folder, index, arr) => (
                  <span key={index}>
                    <span className="breadcrumb-separator"> / </span>
                    <button 
                      onClick={() => setCurrentPath(arr.slice(0, index + 1).join('/'))}
                      className="breadcrumb-btn"
                    >
                      {folder}
                    </button>
                  </span>
                ))}
              </>
            )}
          </div>
          {currentPath && (
            <button onClick={navigateBack} className="back-btn">
              ← Back
            </button>
          )}
        </div>

        <h3 className="files-header">
          {currentPath ? `Files in ${currentPath}` : 'Your Files'} 
          ({getFolders().length + getCurrentFiles().length})
        </h3>
        
        {getFolders().length === 0 && getCurrentFiles().length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <p>No files or folders here. Upload files or create folders above!</p>
          </div>
        ) : (
          <div className="files-grid">
            {/* Folders */}
            {getFolders().map(folder => (
              <div key={folder} className="file-card folder-card">
                <div className="folder-icon">📁</div>
                <div className="file-name">{folder}</div>
                <div className="file-actions">
                  <button 
                    onClick={() => navigateToFolder(folder)}
                    className="action-btn open-btn"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
            
            {/* Files */}
            {getCurrentFiles().map(file => (
              <div key={file.$id} className="file-card">
                <div className="file-icon">📄</div>
                <div className="file-name">{file.name.split('/').pop()}</div>
                <div style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {formatFileSize(file.sizeOriginal)} • {new Date(file.$createdAt).toLocaleDateString()}
                </div>
                <div className="file-actions">
                  <button 
                    onClick={() => handleDownload(file.$id, file.name)} 
                    className="action-btn download-btn"
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => handleDelete(file.$id)} 
                    className="action-btn delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileBrowser;
