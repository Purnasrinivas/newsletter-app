import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Job Board
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/jobs" className="nav-link">Post Job</Link>
          <Link to="/newsletter" className="nav-link">Newsletter</Link>
          <Link to="/subscribe" className="nav-link">Subscribe</Link>
        </nav>
      </div>
    </header>
  );}

export default Header;