// Header.js

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSyncAlt, faComments, faAddressCard } from "@fortawesome/free-solid-svg-icons"; // Import necessary icons
import styles from "./Header.module.css"; // Import CSS module for header styles
import ContactUsModal from "./ContactUsModal"; // Import ContactUsModal component

const Header = () => {
  // URL for the locally served React app
  const feedbackFormURL = "http://localhost:3001"; // Replace with your actual local server URL
  const aboutPageURL = "http://localhost:3002/"; // Replace with the URL of your About page React app
  const [contactUsModalOpen, setContactUsModalOpen] = useState(false); // State for contact us modal

  return (
    <header className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 py-1">
      {/* Blue gradient background with four shades */}
      <div className="xl:container xl:mx-auto flex items-center sm:flex-row sm:justify-between text-center py-3">
        <img src="/Emblem_of_India.svg" width={40} height={40} alt="" />
        <div className="w-80 sm:order-2 flex justify-center items-center">
          {/* Updated style for the "News Analysis" title */}
          <div className={`${styles["animated-title"]} text-white font-bold text-xl sm:text-2xl`}>
            <span style={{ marginRight: "10px" }}>News</span>
            <span style={{ fontSize: "24px" }}>Analysis</span>
          </div>
        </div>
        <div className="order-3 flex justify-center items-center">
          <div className="flex gap-6">
            <div className="flex justify-center items-center space-x-12">
              <a
                href={aboutPageURL}
                className="hover:cursor-pointer hover:scale-[1.02] duration-300 text-white flex items-center"
              >
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" /> About
              </a>
              <a
                href="/"
                className="hover:cursor-pointer hover:scale-[1.02] duration-300 text-white flex items-center"
              >
                <FontAwesomeIcon icon={faSyncAlt} className="mr-1" /> Refresh
              </a>
              {/* Link to the locally served React app */}
              <a
                href={feedbackFormURL}
                className="hover:cursor-pointer hover:scale-[1.02] duration-300 text-white flex items-center"
              >
                <FontAwesomeIcon icon={faComments} className="mr-1" /> Feedback
              </a>
              <button
                onClick={() => setContactUsModalOpen(true)}
                className="hover:cursor-pointer hover:scale-[1.02] duration-300 text-white flex items-center"
              >
                <FontAwesomeIcon icon={faAddressCard} className="mr-1" /> Contact Us
              </button>
            </div>
            <img src="/G20.webp" width={90} height={90} alt="" />
          </div>
        </div>
      </div>
      {/* Divider */}
      <hr />
      {/* ContactUsModal component */}
      <ContactUsModal isOpen={contactUsModalOpen} onClose={() => setContactUsModalOpen(false)} />
    </header>
  );
};

export default Header;
