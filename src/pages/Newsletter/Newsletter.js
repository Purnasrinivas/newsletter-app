import React, { useState, useEffect } from 'react';
import { getJobs, sendNewsletter, updateJob } from '../../services/api';
import JobCard from '../../components/JobCard';
import './Newsletter.css';
import { useToast } from '../../context/ToastContext';

const jobCategories = [
  'Software Developer',
  'DevOps Engineer',
  'Data Analyst',
  'UI/UX Designer',
  'Project Manager'
];

function Newsletter() {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [newsletterContent, setNewsletterContent] = useState({
    subject: 'Latest Job Opportunities',
    intro: 'Here are the latest job opportunities:',
    outro: 'Best regards,\nJob Newsletter Team'
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const jobsData = await getJobs();
      setJobs(jobsData);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    try {
      setLoading(true);
      const selectedJobs = activeCategory === 'all' 
        ? jobs 
        : jobs.filter(job => job.category && job.category.includes(activeCategory));
      
      await sendNewsletter({
        subject: newsletterContent.subject,
        intro: newsletterContent.intro,
        jobs: selectedJobs,
        outro: newsletterContent.outro,
        categories: [activeCategory]
      });
      
      addToast('Newsletter sent successfully!', 'success');
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      addToast(`Failed to send newsletter: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterContentChange = (e) => {
    const { name, value } = e.target;
    setNewsletterContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEditContent = () => {
    setIsEditingContent(!isEditingContent);
  };

  const handleJobEdit = (job) => {
    setEditingJob({...job});
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJobUpdate = async () => {
    if (!editingJob) return;
    
    try {
      setLoading(true);
      await updateJob(editingJob);
      setJobs(jobs.map(job => job._id === editingJob._id ? editingJob : job));
      setEditingJob(null);
      alert('Job updated successfully!');
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('Failed to update job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const jobsByCategory = jobs.reduce((acc, job) => {
    if (!job.category || !Array.isArray(job.category)) {
      return acc;
    }
    
    job.category.forEach(cat => {
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(job);
    });
    
    return acc;
  }, {});

  if (loading && jobs.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>Error Loading Jobs</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadJobs}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="newsletter-page">
      <div className="page-header">
        <h1>Newsletter Manager</h1>
        <button className="btn btn-primary refresh-btn" onClick={loadJobs}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4V10H7M23 20V14H17M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 13.9917 3.22426C12.5089 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1112 10.0083 20.7757C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refresh Jobs
        </button>
      </div>

      <div className="newsletter-content-card">
        <div className="card-header">
          <h2>Newsletter Content</h2>
          <button 
            className="btn btn-secondary"
            onClick={toggleEditContent}
          >
            {isEditingContent ? 'Done Editing' : 'Edit Content'}
          </button>
        </div>
        
        {isEditingContent ? (
          <div className="newsletter-form">
            <div className="form-group">
              <label htmlFor="subject">Subject Line</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={newsletterContent.subject}
                onChange={handleNewsletterContentChange}
                className="newsletter-input"
                placeholder="Newsletter Subject"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="intro">Introduction</label>
              <textarea
                id="intro"
                name="intro"
                value={newsletterContent.intro}
                onChange={handleNewsletterContentChange}
                className="newsletter-textarea"
                placeholder="Introduction text for the newsletter"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="outro">Closing Message</label>
              <textarea
                id="outro"
                name="outro"
                value={newsletterContent.outro}
                onChange={handleNewsletterContentChange}
                className="newsletter-textarea"
                placeholder="Closing message for the newsletter"
              />
            </div>
          </div>
        ) : (
          <div className="newsletter-preview">
            <div className="preview-item">
              <strong>Subject:</strong> {newsletterContent.subject}
            </div>
            <div className="preview-item">
              <strong>Introduction:</strong>
              <p>{newsletterContent.intro}</p>
            </div>
            <div className="preview-item">
              <strong>Closing:</strong>
              <p>{newsletterContent.outro}</p>
            </div>
          </div>
        )}
      </div>

      <div className="newsletter-actions">
        <button 
          className="btn btn-primary send-btn"
          onClick={handleSendNewsletter}
          disabled={loading || jobs.length === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Send Newsletter
        </button>
      </div>

      <div className="category-filter">
        <h2>Filter Jobs by Category</h2>
        <div className="category-tabs">
          <button 
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Jobs
          </button>
          {jobCategories.map(category => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="jobs-section">
        <h2>
          {activeCategory === 'all' 
            ? 'All Available Jobs' 
            : `${activeCategory} Jobs`}
        </h2>
        
        {jobs.length === 0 ? (
          <div className="no-jobs-message">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>No jobs available. Add some jobs to get started!</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {(activeCategory === 'all' 
              ? jobs 
              : (jobsByCategory[activeCategory] || [])
            ).map(job => (
              <div key={job._id} className="job-item">
                {editingJob && editingJob._id === job._id ? (
                  <div className="job-edit-form">
                    <input
                      type="text"
                      name="title"
                      value={editingJob.title}
                      onChange={handleEditChange}
                      className="edit-input"
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      name="company"
                      value={editingJob.company}
                      onChange={handleEditChange}
                      className="edit-input"
                      placeholder="Company"
                    />
                    <input
                      type="text"
                      name="location"
                      value={editingJob.location}
                      onChange={handleEditChange}
                      className="edit-input"
                      placeholder="Location"
                    />
                    <textarea
                      name="description"
                      value={editingJob.description}
                      onChange={handleEditChange}
                      className="edit-textarea"
                      placeholder="Job Description"
                    />
                    <input
                      type="text"
                      name="link"
                      value={editingJob.link}
                      onChange={handleEditChange}
                      className="edit-input"
                      placeholder="Application Link"
                    />
                    <div className="edit-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={handleJobUpdate}
                      >
                        Save
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <JobCard 
                    job={job} 
                    onClick={() => handleJobEdit(job)}
                    showActions={true}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Newsletter;