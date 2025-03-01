import React, { useState, useEffect } from 'react';
import { getJobs } from '../src/services/api';
import './Newsletter.css';

function Newsletter() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [newsletterContent, setNewsletterContent] = useState({
    subject: 'Latest Job Opportunities',
    intro: 'Here are the latest job opportunities:',
    outro: 'Best regards,\nJob Newsletter Team'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching jobs...');
      const response = await fetch('/api/jobs');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received jobs data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Expected array of jobs but got:', data);
        throw new Error('Invalid jobs data received');
      }

      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setError(error.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Add auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadJobs, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleJobSelection = (job) => {
    setSelectedJobs(prev => 
      prev.includes(job) 
        ? prev.filter(j => j.id !== job.id)
        : [...prev, job]
    );
  };

  const handleSendNewsletter = async () => {
    try {
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: newsletterContent.subject,
          jobs: selectedJobs,
          intro: newsletterContent.intro,
          outro: newsletterContent.outro
        })
      });

      if (!response.ok) throw new Error('Failed to send newsletter');
      alert('Newsletter sent successfully!');
      setSelectedJobs([]);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      alert('Failed to send newsletter. Please try again.');
    }
  };

  // Add refresh button
  const handleRefresh = () => {
    loadJobs();
  };

  return (
    <div className="newsletter-page">
      <div className="newsletter-header">
        <h1>Job Newsletter</h1>
        <p>Compose and send job newsletters to subscribers</p>
        <button onClick={handleRefresh} className="refresh-button">
          Refresh Jobs
        </button>
      </div>

      {loading ? (
        <div className="loading-message">Loading jobs...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="no-jobs-message">No jobs available yet.</div>
      ) : (
        <div className="newsletter-section">
          <h2>Available Jobs ({jobs.length})</h2>
          <div className="jobs-grid">
            {jobs.map(job => (
              <div 
                key={job.id}
                className={`job-card ${selectedJobs.includes(job) ? 'selected' : ''}`}
                onClick={() => toggleJobSelection(job)}
              >
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <p>{job.location}</p>
                <div className="job-card-overlay">
                  {selectedJobs.includes(job) ? 'Selected' : 'Click to Select'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedJobs.length > 0 && (
        <div className="newsletter-section">
          <h2>Newsletter Content</h2>
          <div className="newsletter-editor">
            <input
              type="text"
              value={newsletterContent.subject}
              onChange={e => setNewsletterContent(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Newsletter Subject"
              disabled={!isEditing}
            />
            <textarea
              value={newsletterContent.intro}
              onChange={e => setNewsletterContent(prev => ({ ...prev, intro: e.target.value }))}
              placeholder="Introduction Text"
              disabled={!isEditing}
            />
            <div className="selected-jobs">
              {selectedJobs.map(job => (
                <div key={job.id} className="selected-job-item">
                  <h3>{job.title}</h3>
                  <p>{job.company} - {job.location}</p>
                  <p>{job.description}</p>
                </div>
              ))}
            </div>
            <textarea
              value={newsletterContent.outro}
              onChange={e => setNewsletterContent(prev => ({ ...prev, outro: e.target.value }))}
              placeholder="Closing Text"
              disabled={!isEditing}
            />
          </div>
          <div className="newsletter-actions">
            <button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Preview' : 'Edit'}
            </button>
            <button 
              onClick={handleSendNewsletter}
              disabled={isEditing}
              className="send-button"
            >
              Send Newsletter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Newsletter; 