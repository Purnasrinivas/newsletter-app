import React, { useState } from 'react';
import { subscribeToNewsletter } from '../../services/api';

function Subscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await subscribeToNewsletter(email);
      console.log('Subscription response:', response);
      setStatus({
        type: 'success',
        message: response.message || 'Successfully subscribed! Thank you for joining.'
      });
      setEmail(''); // Clear the input after success
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Failed to subscribe. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscribe-page">
      <h1>Subscribe to Job Updates</h1>
      <p>Get notified about new job opportunities</p>
      
      {status.message && (
        <div className={`alert ${status.type}`}>
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="subscribe-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="button"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '1rem',
            fontSize: '1.1rem',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </button>
      </form>
    </div>
  );
}

export default Subscribe; 