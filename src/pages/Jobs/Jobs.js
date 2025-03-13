import React, { useState } from 'react';
import { submitJob } from '../../services/api';
import './Jobs.css';

const categories = [
  'Software Developer',
  'DevOps Engineer',
  'Data Analyst',
  'UI/UX Designer',
  'Project Manager'
];

function Jobs() {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    applyLink: '',
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

  const handleCategoryChange = (category) => {
    setJobData(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    console.log('Jobs component handleSubmit called');
    console.log('Current jobData:', jobData);

    try {
      // Format job data
      const formattedJobData = {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location || 'Remote',
        description: jobData.description,
        requirements: jobData.requirements || 'Not specified',
        link: jobData.applyLink,
        category: jobData.category  // Include the categories
      };
      
      console.log('Submitting formatted job data:', formattedJobData);
      const response = await submitJob(formattedJobData);
      console.log('Server response:', response);

      if (response.success) {
        alert('Job posted successfully! Check the Newsletter tab.');
        setJobData({
          title: '',
          company: '',
          location: '',
          description: '',
          requirements: '',
          applyLink: '',
          category: []
        });
      } else {
        throw new Error(response.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Failed to submit job:', error);
      alert('Failed to post job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobs-page">
      <h1>Post a New Job</h1>
      
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            placeholder="e.g. Senior React Developer"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="company">Company Name</label>
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
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            placeholder="e.g. Remote, New York, etc."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={jobData.description}
            onChange={handleChange}
            placeholder="Describe the job role, responsibilities, etc."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="requirements">Requirements</label>
          <textarea
            id="requirements"
            name="requirements"
            value={jobData.requirements}
            onChange={handleChange}
            placeholder="List the required skills, experience, etc."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="applyLink">Application Link</label>
          <input
            type="url"
            id="applyLink"
            name="applyLink"
            value={jobData.applyLink}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </div>

        {/* Category Selection */}
        <div className="form-group">
          <label>Job Categories (Select at least one)</label>
          <div className="category-options">
            {categories.map(category => (
              <div key={category} className="category-option">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={jobData.category.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <label htmlFor={`category-${category}`}>{category}</label>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading || jobData.category.length === 0}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}

export default Jobs;