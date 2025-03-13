import React, { useState, useEffect } from 'react';
import { getJobs, sendNewsletter, updateJob } from '../../services/api';
import './Newsletter.css';

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

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching jobs...');

      const jobsData = await getJobs();
      console.log('Received jobs:', jobsData);

      if (!Array.isArray(jobsData)) {
        console.error('Invalid jobs data format:', jobsData);
        throw new Error('Invalid response format');
      }

      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setError('Failed to load jobs. Please try again later.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Group jobs by category
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
      setEditingJob(null);
      await loadJobs(); // Refresh jobs list
      alert('Job updated successfully!');
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('Failed to update job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async (category) => {
    try {
      if (!jobsByCategory[category] || jobsByCategory[category].length === 0) {
        alert('No jobs available in this category');
        return;
      }

      const confirm = window.confirm(`Send newsletter for ${category} jobs?`);
      if (!confirm) return;

      setLoading(true);
      
      const newsletterData = {
        subject: `${newsletterContent.subject} - ${category}`,
        intro: newsletterContent.intro,
        outro: newsletterContent.outro,
        jobs: jobsByCategory[category],
        categories: [category]
      };
      
      const response = await sendNewsletter(newsletterData);
      alert(`Newsletter sent to ${response.subscriberCount || 0} subscribers!`);
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      alert('Failed to send newsletter: ' + error.message);
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

  if (loading && jobs.length === 0) {
    return <div className="loading">Loading jobs...</div>;
  }

  if (error && jobs.length === 0) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={loadJobs}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="newsletter-page">
      <h1>Job Newsletter</h1>
      
      <div className="newsletter-content-editor">
        <h2>Newsletter Content</h2>
        <button onClick={toggleEditContent} className="edit-content-button">
          {isEditingContent ? 'Save' : 'Edit Content'}
        </button>
        
        {isEditingContent ? (
          <div className="newsletter-form">
            <div className="form-group">
              <label>Subject Line Template</label>
              <input
                type="text"
                name="subject"
                value={newsletterContent.subject}
                onChange={handleNewsletterContentChange}
                className="newsletter-input"
              />
            </div>
            <div className="form-group">
              <label>Introduction</label>
              <textarea
                name="intro"
                value={newsletterContent.intro}
                onChange={handleNewsletterContentChange}
                className="newsletter-textarea"
              />
            </div>
            <div className="form-group">
              <label>Outro</label>
              <textarea
                name="outro"
                value={newsletterContent.outro}
                onChange={handleNewsletterContentChange}
                className="newsletter-textarea"
              />
            </div>
          </div>
        ) : (
          <div className="newsletter-preview">
            <p><strong>Subject:</strong> {newsletterContent.subject}</p>
            <p><strong>Intro:</strong> {newsletterContent.intro}</p>
            <p><strong>Outro:</strong> {newsletterContent.outro.split('\n').map((line, i) => (
              <span key={i}>{line}<br/></span>
            ))}</p>
          </div>
        )}
      </div>

      <div className="category-tabs">
        {jobCategories.map(category => (
          <div key={category} className="category-section">
            <h2>{category}</h2>
            <button 
              onClick={() => handleSendNewsletter(category)}
              className="send-newsletter-button"
              disabled={!jobsByCategory[category] || jobsByCategory[category].length === 0}
            >
              Send {category} Newsletter
            </button>
            
            <div className="jobs-grid">
              {jobsByCategory[category] && jobsByCategory[category].length > 0 ? (
                jobsByCategory[category].map(job => (
                  <div key={job._id} className="job-card">
                    {editingJob && editingJob._id === job._id ? (
                      <div className="job-edit-form">
                        <input
                          type="text"
                          name="title"
                          value={editingJob.title}
                          onChange={handleEditChange}
                          placeholder="Job Title"
                          className="edit-input"
                        />
                        <input
                          type="text"
                          name="company"
                          value={editingJob.company}
                          onChange={handleEditChange}
                          placeholder="Company"
                          className="edit-input"
                        />
                        <input
                          type="text"
                          name="location"
                          value={editingJob.location}
                          onChange={handleEditChange}
                          placeholder="Location"
                          className="edit-input"
                        />
                        <textarea
                          name="description"
                          value={editingJob.description}
                          onChange={handleEditChange}
                          placeholder="Description"
                          className="edit-textarea"
                        />
                        <input
                          type="url"
                          name="link"
                          value={editingJob.link}
                          onChange={handleEditChange}
                          placeholder="Application Link"
                          className="edit-input"
                        />
                        <div className="edit-actions">
                          <button onClick={handleJobUpdate} className="save-button">Save</button>
                          <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3>{job.title}</h3>
                        <p className="company">{job.company}</p>
                        <p className="location">{job.location}</p>
                        <div className="description-preview">
                          {job.description.length > 100 
                            ? job.description.substring(0, 100) + '...' 
                            : job.description}
                        </div>
                        <div className="job-actions">
                          <a href={job.link} target="_blank" rel="noopener noreferrer" className="apply-link">
                            View Application Link
                          </a>
                          <button onClick={() => handleJobEdit(job)} className="edit-button">
                            Edit
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-jobs-message">No jobs in this category</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Newsletter;