// src/components/Checkbox/Checkbox.js
import React from 'react';
import './Checkbox.css';

function Checkbox({ id, label, checked, onChange, className = '' }) {
  return (
    <div className={`custom-checkbox ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="checkbox-input"
      />
      <label htmlFor={id} className="checkbox-label">
        <span className="checkbox-custom">
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
        {label}
      </label>
    </div>
  );
}

export default Checkbox;