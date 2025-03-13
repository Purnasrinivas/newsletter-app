import React, { useState, useEffect } from 'react';
import { getJobs, sendNewsletter } from '../../services/api';
import './NewsletterComposer.css';

function NewsletterComposer() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [newsletterContent, setNewsletterContent] = useState({
    subject: '',
    intro: '',
    outro: ''
  });
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const jobsData = await getJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const toggleJobSelection = (job) => {
    setSelectedJobs(prev => 
      prev.includes(job) 
        ? prev.filter(j => j._id !== job._id)
        : [...prev, job]
    );
  };

  const generateNewsletterHTML = () => {
    return `
      <h1>Job Newsletter</h1>
      <p>${newsletterContent.intro || 'Here are the latest job opportunities:'}</p>
      
      ${selectedJobs.map(job => `
        <div class="job-listing">
          <h2>${job.title}</h2>
          <p><strong>Company:</strong> ${job.company}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p>${job.description}</p>
          <a href="${job.link}">Apply Now</a>
        </div>
      `).join('<hr>')}
      
      <p>${newsletterContent.outro || 'Best regards,<br>Job Newsletter Team'}</p>
    `;
  };

  const handleSendNewsletter = async () => {
    try {
      const response = await sendNewsletter({
        subject: newsletterContent.subject || 'New Job Opportunities Available',
        intro: newsletterContent.intro || 'Here are the latest job opportunities:',
        jobs: selectedJobs,
        outro: newsletterContent.outro || 'Best regards,\nJob Newsletter Team',
        categories: selectedJobs.flatMap(job => job.category || [])
      });
      
      if (response.success) {
        alert('Newsletter sent successfully!');
      } else {
        throw new Error(response.message || 'Failed to send newsletter');
      }
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      alert('Failed to send newsletter. Please try again.');
    }
  };

  return (
    <div className="newsletter-composer">
      <h1>Compose Newsletter</h1>
      
      <div className="composer-section">
        <h2>Newsletter Content</h2>
        <input
          type="text"
          placeholder="Newsletter Subject"
          value={newsletterContent.subject}
          onChange={e => setNewsletterContent(prev => ({ ...prev, subject: e.target.value }))}
        />
        <textarea
          placeholder="Introduction Text"
          value={newsletterContent.intro}
          onChange={e => setNewsletterContent(prev => ({ ...prev, intro: e.target.value }))}
        />
        <textarea
          placeholder="Closing Text"
          value={newsletterContent.outro}
          onChange={e => setNewsletterContent(prev => ({ ...prev, outro: e.target.value }))}
        />
      </div>
      

      <div className="composer-section">
        <h2>Select Jobs to Include</h2>
        <div className="jobs-grid">
          {jobs.map(job => (
            <div 
              key={job._id} 
              className={`job-card ${selectedJobs.includes(job) ? 'selected' : ''}`}
              onClick={() => toggleJobSelection(job)}
            >
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
);}
export default NewsletterComposer; 