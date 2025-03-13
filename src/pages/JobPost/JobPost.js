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
          placeholder="Company Name"
          required
          className="job-post-input"
        />
        <input
          type="text"
          name="location"
          value={job.location}
          onChange={handleChange}
          placeholder="Job Location (e.g. Remote, New York)"
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
        
        <div className="form-group">
          <label>Job Categories (Required)</label>
          <p className="helper-text">Select one or more categories for this job</p>
          
          {/* Category Selection - Multiple Select Dropdown */}
          <select 
            multiple
            value={job.category}
            onChange={(e) => {
              const selectedCategories = Array.from(e.target.selectedOptions, option => option.value);
              setJob(prev => ({
                ...prev,
                category: selectedCategories
              }));
            }}
            className="category-select"
            required
          >
            {jobCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          {/* Alternative Category Selection - Checkboxes */}
          <div className="categories-grid">
            {jobCategories.map(category => (
              <div key={category} className="category-checkbox">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={job.category.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <label htmlFor={`category-${category}`}>{category}</label>
              </div>
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