import React, { useState } from 'react';
import './JobEditForm.css';

function JobEditForm({ job, onSave, onCancel }) {
  const [editedJob, setEditedJob] = useState({...job});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedJob);
  };

  return (
    <form onSubmit={handleSubmit} className="job-edit-form">
      <div className="form-group">
        <label>Job Title</label>
        <input
          name="title"
          value={editedJob.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Company</label>
        <input
          name="company"
          value={editedJob.company}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Location</label>
        <input
          name="location"
          value={editedJob.location}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={editedJob.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Application Link</label>
        <input
          name="link"
          value={editedJob.link}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="save-button">Save Changes</button>
        <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
      </div>
    </form>
  );
}

export default JobEditForm;