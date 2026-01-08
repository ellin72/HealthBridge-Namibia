import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface FeedbackFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess, onCancel }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    feedbackType: 'GENERAL',
    category: '',
    title: '',
    description: '',
    rating: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const feedbackTypes = [
    { value: 'BUG', label: 'Bug Report' },
    { value: 'FEATURE_REQUEST', label: 'Feature Request' },
    { value: 'COMPLIMENT', label: 'Compliment' },
    { value: 'COMPLAINT', label: 'Complaint' },
    { value: 'GENERAL', label: 'General Feedback' }
  ];

  const categories = [
    { value: 'UI', label: 'User Interface' },
    { value: 'PERFORMANCE', label: 'Performance' },
    { value: 'FEATURE', label: 'Features' },
    { value: 'SUPPORT', label: 'Support' },
    { value: 'OTHER', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        // Reset form
        setFormData({
          feedbackType: 'GENERAL',
          category: '',
          title: '',
          description: '',
          rating: 0
        });
        alert('Thank you for your feedback!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-form">
      <h2>Submit Feedback</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="feedbackType">Feedback Type *</label>
          <select
            id="feedbackType"
            value={formData.feedbackType}
            onChange={(e) => setFormData({ ...formData, feedbackType: e.target.value })}
            required
          >
            {feedbackTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={5}
            maxLength={2000}
          />
        </div>

        <div className="form-group">
          <label>Rating (Optional)</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                className={`rating-star ${formData.rating >= rating ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, rating })}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
          )}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;

