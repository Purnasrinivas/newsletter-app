import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Jobs from './pages/Jobs/Jobs';
import JobPost from './pages/JobPost/JobPost';
import Newsletter from './pages/Newsletter/Newsletter';
import Subscribe from './pages/Subscribe/Subscribe';
import Admin from './pages/Admin/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <ToastProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Jobs />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/post-job" element={<JobPost />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
