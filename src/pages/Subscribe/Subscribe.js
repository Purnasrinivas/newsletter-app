import React, { useState } from 'react';
import { addSubscriber } from '../../services/api';
import './Subscribe.css';

const jobCategories = [
  'Software Developer',
  'DevOps Engineer',
  'Data Analyst',
  'UI/UX Designer',
  'Project Manager'
];

function Subscribe() {
  const [subscriber, setSubscriber] = useState({
    email: '',
    name: '',
    categories: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubscriber(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setSubscriber(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const subscriberData = {
        email: subscriber.email.trim(),
        name: subscriber.name.trim(),
        categories: subscriber.categories
      };

      await addSubscriber(subscriberData);
      
      setSubmitSuccess(true);
      setSubscriber({
        email: '',
        name: '',
        categories: []
      });
    } catch (error) {
      console.error('Error subscribing:', error);
      alert(error.message || 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="subscribe-page">
      <div className="subscribe-container">
        <div className="subscribe-content">
          <h1>Subscribe to Job Updates</h1>
          <p className="subscribe-description">
            Get the latest job opportunities delivered straight to your inbox. 
            Select the categories you're interested in to receive personalized newsletters.
          </p>
          
          {submitSuccess && (
            <div className="success-message">
              Thank you for subscribing! You'll start receiving job newsletters soon.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="subscribe-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={subscriber.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="subscribe-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={subscriber.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="subscribe-input"
              />
            </div>
            
            <div className="form-group">
              <label>Categories of Interest</label>
              <p className="category-help-text">Select all categories you're interested in receiving updates about.</p>
              <div className="categories-grid">
                {jobCategories.map(category => (
                  <button
                    key={category}
                    type="button"
                    className={`category-button ${subscriber.categories.includes(category) ? 'selected' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting || subscriber.categories.length === 0}
              className="subscribe-button"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
        
        <div className="subscribe-image">
          <div className="image-placeholder">
            <img src="/images/newsletter-example.jpg" alt="Newsletter example" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscribe;