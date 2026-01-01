// ContactUsModal.js

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Import close icon
import styles from "./ContactUsModal.module.css"; // Import CSS module for modal styles

const ContactUsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Contact Us</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className={styles.body}>
          {/* Add contact details here */}
          <p>Email: nikita.pawar22@vit.edu</p>
          <p>Phone: 7499433290</p>
          <p>Address: Vishwakarma Institute of Technology, Pune</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUsModal;
