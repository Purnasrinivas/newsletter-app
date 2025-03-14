import React, { useState } from 'react';
import { submitJob } from '../../services/api';
import './JobPost.css';
import { useToast } from '../../context/ToastContext';

const jobCategories = [
  'Software Developer',
  'DevOps Engineer',
  'Data Analyst',
  'UI/UX Designer',
  'Project Manager'
];

function JobPost() {
  const { addToast } = useToast();
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    link: '',
    category: []
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryToggle = (category) => {
    setJobData(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await submitJob(jobData);
      addToast('Job posted successfully!', 'success');
      setJobData({
        title: '',
        company: '',
        location: '',
        description: '',
        link: '',
        category: []
      });
    } catch (error) {
      console.error('Error submitting job:', error);
      addToast(`Failed to submit job: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      jobData.title.trim() !== '' &&
      jobData.company.trim() !== '' &&
      jobData.location.trim() !== '' &&
      jobData.description.trim() !== '' &&
      jobData.link.trim() !== '' &&
      jobData.category.length > 0
    );
  };

  return (
    <div className="job-post-page">
      <div className="page-header">
        <h1>Post a New Job</h1>
        <p className="page-description">
          Fill out the form below to post a new job opportunity to our newsletter.
        </p>
      </div>

      <form className="job-post-form" onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="form-section">
            <h2>Job Details</h2>
            
            <div className="form-group">
              <label htmlFor="title">Job Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="company">Company*</label>
              <input
                type="text"
                id="company"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Inc."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location*</label>
              <input
                type="text"
                id="location"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                placeholder="e.g. Remote, New York, NY"
                required
              />
            </div>
          </div>
          
          <div className="form-section">
            <h2>Job Description</h2>
            
            <div className="form-group">
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the job..."
                required
              />
              <p className="helper-text">Include responsibilities, requirements, and any other relevant information.</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="link">Application Link*</label>
              <input
                type="url"
                id="link"
                name="link"
                value={jobData.link}
                onChange={handleChange}
                placeholder="https://example.com/apply"
                required
              />
              <p className="helper-text">Direct link where candidates can apply for this position.</p>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Job Categories</h2>
            <p className="helper-text">Select at least one category that best describes this job.</p>
            
            <div className="categories-grid">
              {jobCategories.map(category => (
                <div 
                  key={category}
                  className={`category-button ${jobData.category.includes(category) ? 'selected' : ''}`}
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading || !isFormValid()}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}

export default JobPost;