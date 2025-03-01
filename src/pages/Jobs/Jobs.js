import React, { useState, useEffect } from 'react';
import { submitJob } from '../../services/api';
import { setJobsComponentMounted } from '../../state/jobState';
import './Jobs.css';

console.log('Jobs component file loaded');

function Jobs() {
  console.log('Jobs component rendering');

  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    applyLink: ''
  });
  const [loading, setLoading] = useState(false);

  // Add debugging for form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Form field changed: ${name} = ${value}`);
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log('Jobs component mounted');
    setJobsComponentMounted(true);
    
    // Add debugging for navigation
    const handleBeforeUnload = () => {
      console.log('Jobs component about to unmount');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      console.log('Jobs component unmounting');
      setJobsComponentMounted(false);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
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
        applyLink: jobData.applyLink
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
          applyLink: ''
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
            placeholder="Remote"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={jobData.description}
            onChange={handleChange}
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
            placeholder="List job requirements..."
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

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}

export default Jobs; 