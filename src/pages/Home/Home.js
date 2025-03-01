import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Find Your Next Career Opportunity</h1>
        <p>Browse and apply to the latest job openings</p>
        <Link to="/jobs" className="cta-button">Post a Job</Link>
      </div>
    </div>
  );
}

export default Home; 