import React, { useState, useEffect } from 'react';
import { getJobs, sendNewsletter } from '../../services/api';
import './Newsletter.css';

function Newsletter() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [newsletterContent, setNewsletterContent] = useState({
    subject: 'Latest Job Opportunities',
    intro: 'Here are the latest job opportunities:',
    outro: 'Best regards,\nJob Newsletter Team'
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'Software Developer', 'DevOps Engineer', 'Data Analyst', 'UI/UX Designer', 'Project Manager'];

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching jobs...');

      const jobsData = await getJobs();
      console.log('Received jobs:', jobsData);

      if (!Array.isArray(jobsData)) {
        throw new Error('Invalid jobs data received');
      }

      const sortedJobs = jobsData.sort((a, b) => 
        new Date(b.datePosted || Date.now()) - new Date(a.datePosted || Date.now())
      );

      console.log('Sorted jobs:', sortedJobs);
      setJobs(sortedJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadJobs();
  };

  useEffect(() => {
    loadJobs();
    // Don't poll too frequently in production
    const interval = setInterval(loadJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredJobs = selectedCategory === 'All' 
    ? jobs 
    : jobs.filter(job => job.category && job.category.includes(selectedCategory));

  const toggleJobSelection = (job) => {
    setSelectedJobs(prev => 
      prev.some(j => j._id === job._id) 
        ? prev.filter(j => j._id !== job._id)
        : [...prev, job]
    );
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSendNewsletter = async () => {
    try {
      const response = await sendNewsletter({
        subject: newsletterContent.subject,
        intro: newsletterContent.intro,
        jobs: selectedJobs,
        outro: newsletterContent.outro,
        category: selectedCategory !== 'All' ? selectedCategory : null
      });

      alert('Newsletter sent successfully!');
      setSelectedJobs([]);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      alert('Failed to send newsletter. Please try again.');
    }
  };

  return (
    <div className="newsletter-page">
      <div className="newsletter-header">
        <h1>Job Newsletter</h1>
        <p>Compose and send job newsletters to subscribers</p>
        
        <div className="newsletter-controls">
          <div className="category-selector">
            <label htmlFor="category-select">Filter by category:</label>
            <select 
              id="category-select" 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <button onClick={handleRefresh} className="refresh-button">
            Refresh Jobs
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredJobs.length === 0 ? (
        <div className="no-jobs-message">
          {jobs.length === 0 
            ? "No jobs available yet. Add jobs from the Post Job tab." 
            : `No jobs found in the "${selectedCategory}" category.`}
        </div>
      ) : (
        <div className="newsletter-section">
          <h2>Available Jobs ({filteredJobs.length})</h2>
          <div className="jobs-grid">
            {filteredJobs.map(job => (
              <div 
                key={job._id}
                className={`job-card ${selectedJobs.some(j => j._id === job._id) ? 'selected' : ''}`}
                onClick={() => toggleJobSelection(job)}
              >
                <div className="job-card-content">
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>
                  <p className="location">{job.location}</p>
                  
                  {job.category && job.category.length > 0 && (
                    <div className="job-categories">
                      {job.category.map(cat => (
                        <span key={cat} className="job-category-tag">{cat}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="job-card-overlay">
                  {selectedJobs.some(j => j._id === job._id) ? 'Selected' : 'Click to Select'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedJobs.length > 0 && (
        <div className="newsletter-section">
          <div className="newsletter-header-actions">
            <h2>Selected Jobs ({selectedJobs.length})</h2>
            <button onClick={handleEditToggle} className="edit-button">
              {isEditing ? 'Done Editing' : 'Edit Newsletter'}
            </button>
          </div>

          {isEditing ? (
            <div className="newsletter-editor">
              <input
                type="text"
                value={newsletterContent.subject}
                onChange={e => setNewsletterContent(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Newsletter Subject"
                className="newsletter-input"
              />
              <textarea
                value={newsletterContent.intro}
                onChange={e => setNewsletterContent(prev => ({ ...prev, intro: e.target.value }))}
                placeholder="Introduction Text"
                className="newsletter-textarea"
              />
              <div className="selected-jobs">
                {selectedJobs.map(job => (
                  <div key={job._id} className="selected-job-item">
                    <h3>{job.title}</h3>
                    <p>{job.company} - {job.location}</p>
                  </div>
                ))}
              </div>
              <textarea
                value={newsletterContent.outro}
                onChange={e => setNewsletterContent(prev => ({ ...prev, outro: e.target.value }))}
                placeholder="Closing Text"
                className="newsletter-textarea"
              />
            </div>
          ) : (
            <div className="selected-jobs">
              {selectedJobs.map(job => (
                <div key={job._id} className="selected-job-item">
                  <h3>{job.title}</h3>
                  <p>{job.company} - {job.location}</p>
                </div>
              ))}
            </div>
          )}

          <div className="newsletter-actions">
            <button onClick={() => setSelectedJobs([])} className="clear-button">
              Clear Selection
            </button>
            <button onClick={handleSendNewsletter} className="send-button">
              Send Newsletter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Newsletter;