// AboutPage.js
import React from 'react';
import './AboutPage.css'; // Import CSS file for styling
import newsImage from './images/news-image.jpg'; // Import default news image
import howItWorksImage from './images/How_it_works.jpg'; // Import "How It Works" image
import stayInformedImage from './images/Stay_Informed.avif'; // Import "Stay Informed" image
import multilanguageImage from './images/Multilanguage_Support.webp'; // Import Multi-language Support image
import gifImage from './images/About.gif'; // Import GIF image

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="title-wrapper">
          <img src={gifImage} alt="GIF" className="gif-image" />
          <h1 className="about-title">Welcome to Gov360 NewsHub</h1>
        </div>
        <section className="about-section">
          <div className="section-content">
            <div className="image-wrapper">
              <img src={newsImage} alt="News" className="news-image" />
            </div>
            <div className="text-wrapper">
              <h2 className="section-title">About Gov360 NewsHub</h2>
              <p>
                Gov360 NewsHub is your one-stop solution for real-time news updates from across the internet, tailored specifically for the Government of India. Our smart system scours numerous sources, including text articles and video news, providing a comprehensive overview of current events.
              </p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <div className="section-content">
            <div className="image-wrapper">
              <img src={howItWorksImage} alt="How It Works" className="news-image" />
            </div>
            <div className="text-wrapper">
              <h2 className="section-title">How It Works</h2>
              <p>
                Our cutting-edge technology automatically classifies news articles into categories based on the ministry's jurisdiction. Each article undergoes sentiment analysis, assigning positive, neutral, or negative scores. If negative news is detected, alerts are promptly sent to the relevant government departments via email, ensuring swift responses when necessary.
              </p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <div className="section-content">
            <div className="image-wrapper">
              <img src={multilanguageImage} alt="Multi-Lingual Support" className="news-image" />
            </div>
            <div className="text-wrapper">
              <h2 className="section-title">Multi-Lingual Support</h2>
              <p>
                We understand the diverse linguistic landscape of India. That's why Gov360 NewsHub offers the option to fetch news articles in English, Hindi, and multiple regional languages, ensuring inclusivity and accessibility for all users.
              </p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <div className="section-content">
            <div className="image-wrapper">
              <img src={stayInformedImage} alt="Stay Informed" className="news-image" />
            </div>
            <div className="text-wrapper">
              <h2 className="section-title">Stay Informed</h2>
              <p>
                Gov360 NewsHub offers a visually appealing and user-friendly interface, making it effortless to stay updated on the latest developments. Simply refresh the page to load the most recent news, or sit back and let the system automatically update every hour.
              </p>
            </div>
          </div>
        </section>
        
        <section className="about-section last-section">
          <h2 className="section-title">Experience Gov360 NewsHub today and unlock the power of real-time news monitoring for the Government of India.</h2>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
