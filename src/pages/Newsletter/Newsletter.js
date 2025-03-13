import React, { useState, useEffect } from 'react';
import { getJobs, sendNewsletter, updateJob } from '../../services/api';
import './Newsletter.css';

function Newsletter() {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsletterContent, setNewsletterContent] = useState({
    subject: 'Latest Job Opportunities',
    intro: 'Here are the latest job opportunities:',
    outro: 'Best regards,\nJob Newsletter Team'
  });
  const [isEditingContent, setIsEditingContent] = useState(false);

  const jobCategories = [
    'Software Developer',
    'DevOps Engineer',
    'Data Analyst',
    'UI/UX Designer',
    'Project Manager'
  ];

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

  useEffect(() => {
    loadJobs();
    // Poll every 30 seconds
    const interval = setInterval(loadJobs, 30000);
    return () => clearInterval(interval);
  }, []);

  // Group jobs by category
  const jobsByCategory = jobs.reduce((acc, job) => {
    if (!job.category || !Array.isArray(job.category)) return acc;
    
    job.category.forEach(cat => {
      if (!acc[cat]) acc[cat] = [];
      // Only add the job if it's not already in this category's array
      if (!acc[cat].some(j => j._id === job._id)) {
        acc[cat].push(job);
      }
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
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="newsletter-page">
      <h1>Newsletter Manager</h1>
      
      <div className="newsletter-content-editor">
        <h2>Newsletter Template</h2>
        <button onClick={toggleEditContent} className="edit-content-button">
          {isEditingContent ? 'Preview' : 'Edit'}
        </button>
        
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
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="outro">Conclusion</label>
              <textarea
                id="outro"
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
            <p><strong>Introduction:</strong> {newsletterContent.intro}</p>
            <p><strong>Conclusion:</strong> {newsletterContent.outro}</p>
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
                          <button type="button" onClick={handleJobUpdate} className="save-button">
                            Save
                          </button>
                          <button type="button" onClick={handleCancelEdit} className="cancel-button">
                            Cancel
                          </button>
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