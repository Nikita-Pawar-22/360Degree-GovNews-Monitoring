import React, { useState } from 'react';
import './FeedbackForm.css'; // Import CSS file
import feedbackImage from './image.jpg'; // Import your image file
import soundEffect from './Sound.mp3'; // Import your sound file

function FeedbackForm() {
  // State variables to store form data and success message
  const [websiteFeedback, setWebsiteFeedback] = useState({ name: '', email: '', message: '' });
  const [newsFeedback, setNewsFeedback] = useState({ name: '', email: '', message: '' });
  const [selectedOption, setSelectedOption] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const audioRef = React.useRef(null);

  // Function to handle form submission for website feedback
  const handleWebsiteFeedbackSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/website-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(websiteFeedback)
      });
      const data = await response.text();
      console.log(data);
      setSuccessMessage('Website feedback submitted successfully!');
      setWebsiteFeedback({ name: '', email: '', message: '' });
      // Play sound effect
      audioRef.current.play();
      // Hide success message after 3 seconds (3000 milliseconds)
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to handle form submission for news feedback
  const handleNewsFeedbackSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/news-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newsFeedback)
      });
      const data = await response.text();
      console.log(data);
      setSuccessMessage('News feedback submitted successfully!');
      setNewsFeedback({ name: '', email: '', message: '' });
      // Play sound effect
      audioRef.current.play();
      // Hide success message after 3 seconds (3000 milliseconds)
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(selectedOption === option ? '' : option);
  };

  return (
    <div className="container">
      <div className="feedback-image-container">
        <img src={feedbackImage} alt="Feedback Image" className="feedback-image" />
      </div>

      <div className="feedback-options">
        <button
          className={selectedOption === 'both' ? 'active' : ''}
          onClick={() => handleOptionSelect('both')}
        >
          Both Website and News
        </button>
        <button
          className={selectedOption === 'website' ? 'active' : ''}
          onClick={() => handleOptionSelect('website')}
        >
          Website Only
        </button>
        <button
          className={selectedOption === 'news' ? 'active' : ''}
          onClick={() => handleOptionSelect('news')}
        >
          News Only
        </button>
      </div>

      {selectedOption === 'both' || selectedOption === 'website' ? (
        <div className="feedback-section">
          <h3>Website Feedback</h3>
          <form onSubmit={handleWebsiteFeedbackSubmit}>
            <div className="form-group">
              <label htmlFor="websiteName">Name:</label>
              <input
                type="text"
                id="websiteName"
                value={websiteFeedback.name}
                onChange={(e) => setWebsiteFeedback({ ...websiteFeedback, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="websiteEmail">Email:</label>
              <input
                type="email"
                id="websiteEmail"
                value={websiteFeedback.email}
                onChange={(e) => setWebsiteFeedback({ ...websiteFeedback, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="websiteMessage">Message:</label>
              <textarea
                id="websiteMessage"
                value={websiteFeedback.message}
                onChange={(e) => setWebsiteFeedback({ ...websiteFeedback, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Submit Website Feedback</button>
          </form>
        </div>
      ) : null}

      {selectedOption === 'both' || selectedOption === 'news' ? (
        <div className="feedback-section">
          <h3>News Feedback</h3>
          <form onSubmit={handleNewsFeedbackSubmit}>
            <div className="form-group">
              <label htmlFor="newsName">Name:</label>
              <input
                type="text"
                id="newsName"
                value={newsFeedback.name}
                onChange={(e) => setNewsFeedback({ ...newsFeedback, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newsEmail">Email:</label>
              <input
                type="email"
                id="newsEmail"
                value={newsFeedback.email}
                onChange={(e) => setNewsFeedback({ ...newsFeedback, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newsMessage">Message:</label>
              <textarea
                id="newsMessage"
                value={newsFeedback.message}
                onChange={(e) => setNewsFeedback({ ...newsFeedback, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Submit News Feedback</button>
          </form>
        </div>
      ) : null}

      {/* Display success message if it's not empty */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Audio element for sound effect */}
      <audio ref={audioRef} src={soundEffect}></audio>
    </div>
  );
}

export default FeedbackForm;
