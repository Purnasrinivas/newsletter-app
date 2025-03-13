import React, { useState } from 'react';
import { submitJob } from '../../services/api';
import './JobPost.css';

const jobCategories = [
  'Software Developer',
  'DevOps Engineer',
  'Data Analyst',
  'UI/UX Designer',
  'Project Manager'
];

function JobPost() {
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: 'Remote',
    description: '',
    link: '',
    category: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prevJob => ({
      ...prevJob,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setJob(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      if (job.category.length === 0) {
        throw new Error('Please select at least one job category');
      }
      
      const jobData = {
        title: job.title.trim(),
        company: job.company.trim(),
        description: job.description.trim(),
        link: job.link.trim(),
        location: job.location?.trim() || 'Remote',
        category: job.category
      };

      const savedJob = await submitJob(jobData);
      console.log('Job saved successfully:', savedJob);
      
      setSubmitSuccess(true);
      alert('Job posted successfully! Check the Newsletter tab.');
      setJob({
        title: '',
        company: '',
        location: 'Remote',
        description: '',
        link: '',
        category: []
      });
    } catch (error) {
      console.error('Error posting job:', error);
      alert(error.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="job-post-page">
      <h1>Post a New Job</h1>
      
      
      {submitSuccess && (
        <div className="success-message">
          Job posted successfully! Check the Newsletter tab.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="job-post-form">
        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={job.title}
            onChange={handleChange}
            placeholder="e.g. Senior React Developer"
            required
            className="job-post-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={job.company}
            onChange={handleChange}
            placeholder="Company Name"
            required
            className="job-post-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={job.location}
            onChange={handleChange}
            placeholder="e.g. Remote, New York, etc."
            className="job-post-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={job.description}
            onChange={handleChange}
            placeholder="Describe the job responsibilities, requirements, etc."
            required
            className="job-post-textarea"
          />
        </div>

        <div className="form-group categories-section">
          <label>Job Categories (Required)</label>
          <p className="helper-text">Select one or more categories for this job</p>
          
          <div className="categories-grid">
            {jobCategories.map(category => (
              <button
                key={category}
                type="button"
                className={`category-button ${job.category.includes(category) ? 'selected' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="link">Application Link</label>
          <input
            type="url"
            id="link"
            name="link"
            value={job.link}
            onChange={handleChange}
            placeholder="https://..."
            required
            className="job-post-input"
          />
        </div>
        
        <button 
          type="submit"
          disabled={isSubmitting || job.category.length === 0}
          className="submit-button"
        >
          {isSubmitting ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}

export default JobPost;