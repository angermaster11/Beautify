import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setScore(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('https://beautifybackend-production.up.railway.app/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setScore(response.data.score);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while processing the image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-brand">BeautyScore™</h1>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <div className="hero-text">
            <h1>Discover Your <span className="highlight">Beauty Score</span></h1>
            <p>Upload your photo and let our AI analyze your beauty with precision</p>
          </div>
        </div>

        <div className="upload-section">
          <div className="card">
            <h2>Upload Your Photo</h2>
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="file-input-container">
                <label htmlFor="file-upload" className="file-upload-label">
                  {selectedFile ? selectedFile.name : 'Choose an image...'}
                  <input 
                    id="file-upload" 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="file-input"
                  />
                </label>
              </div>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <>
                    <span className="spinner"></span> Analyzing...
                  </>
                ) : (
                  'Get Your Beauty Score'
                )}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {score !== null && (
              <div className="result-section">
                <div className="score-display">
                  <h3>Your Beauty Score</h3>
                  <div className="score-value">{score.toFixed(3)}</div>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                </div>
                {selectedFile && (
                  <div className="image-preview">
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Preview" 
                    />
                    <div className="image-overlay"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3>BeautyScore™</h3>
            <p>The most advanced AI beauty analysis platform</p>
          </div>
          <div className="footer-right">
            <p>© {new Date().getFullYear()} Reva Industries</p>
            <p>Created with ❤️ for beautiful people</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;