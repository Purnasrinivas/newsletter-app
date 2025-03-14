// src/pages/Admin/Admin.js
import React from 'react';
import './Admin.css';

function Admin() {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="page-description">
          Manage your newsletter settings and subscribers.
        </p>
      </div>
      
      <div className="admin-card">
        <div className="card-header">
          <h2>Newsletter Statistics</h2>
        </div>
        <div className="card-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">125</div>
              <div className="stat-label">Total Subscribers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">48</div>
              <div className="stat-label">Active Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">12</div>
              <div className="stat-label">Newsletters Sent</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">32%</div>
              <div className="stat-label">Open Rate</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="admin-card">
        <div className="card-header">
          <h2>Recent Activity</h2>
        </div>
        <div className="card-content">
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-title">Newsletter Sent</div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-title">New Subscriber</div>
                <div className="activity-time">5 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-title">New Job Posted</div>
                <div className="activity-time">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;