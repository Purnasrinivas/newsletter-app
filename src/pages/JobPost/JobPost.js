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
    console.log('Category clicked:', category);
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
      console.log('Submitting job with categories:', job.category);
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
      <h1>Post a Job</h1>
      {submitSuccess && (
        <div className="success-message">
          Job posted successfully! Check the Newsletter tab.
        </div>
      )}
      <form onSubmit={handleSubmit} className="job-post-form">
        <input
          type="text"
          name="title"
          value={job.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
          className="job-post-input"
        />
        <input
          type="text"
          name="company"
          value={job.company}
          onChange={handleChange}
          placeholder="Company"
          required
          className="job-post-input"
        />
        <input
          type="text"
          name="location"
          value={job.location}
          onChange={handleChange}
          placeholder="Location (default: Remote)"
          className="job-post-input"
        />
        <textarea
          name="description"
          value={job.description}
          onChange={handleChange}
          placeholder="Job Description"
          required
          className="job-post-textarea"
        />
        <input
          type="url"
          name="link"
          value={job.link}
          onChange={handleChange}
          placeholder="Application Link (https://...)"
          required
          className="job-post-input"
        />
        
        <div className="categories-section">
          <h3>Job Categories (Required)</h3>
          <p className="category-help-text">Select all categories that apply to this job posting.</p>
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