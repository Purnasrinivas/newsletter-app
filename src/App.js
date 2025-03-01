import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Jobs from './pages/Jobs/Jobs';
import Subscribe from './pages/Subscribe/Subscribe';
import Newsletter from './pages/Newsletter/Newsletter';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/subscribe" element={<Subscribe />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
