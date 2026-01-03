import React, { useState } from 'react';
import FeedbackForm from './FeedbackForm';
import './FeedbackButton.css';

const FeedbackButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="feedback-button"
        onClick={() => setIsOpen(true)}
        aria-label="Submit Feedback"
      >
        💬 Feedback
      </button>

      {isOpen && (
        <div className="feedback-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="feedback-modal-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <FeedbackForm
              onSuccess={() => setIsOpen(false)}
              onCancel={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;

