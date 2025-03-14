// src/components/JobCard.js
import React from 'react';
import './JobCard.css';

function JobCard({ job, onClick, isSelected, showActions = true }) {
  const categoryColors = {
    'Software Developer': '#3563E9',
    'DevOps Engineer': '#8B5CF6',
    'Data Analyst': '#10B981',
    'UI/UX Designer': '#F59E0B',
    'Project Manager': '#EC4899'
  };
  
  return (
    <div 
      className={`job-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <div className="job-company">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{job.company}</span>
        </div>
      </div>
      
      <div className="job-card-body">
        <div className="job-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{job.location}</span>
        </div>
        
        {job.category && job.category.length > 0 && (
          <div className="job-categories">
            {job.category.map(cat => (
              <span 
                key={cat} 
                className="job-category"
                style={{ 
                  backgroundColor: `${categoryColors[cat] || '#6B7280'}15`,
                  color: categoryColors[cat] || '#6B7280',
                  borderColor: `${categoryColors[cat] || '#6B7280'}30`
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        )}
        
        {job.description && (
          <p className="job-description">
            {job.description.length > 150 
              ? `${job.description.substring(0, 150)}...` 
              : job.description}
          </p>
        )}
      </div>
      
      {showActions && (
        <div className="job-card-footer">
          <a 
            href={job.link} 
            className="btn btn-primary job-apply-btn"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Apply Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

export default JobCard;