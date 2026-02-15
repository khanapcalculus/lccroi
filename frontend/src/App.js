import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import TutorManagement from './components/TutorManagement';
import StudentManagement from './components/StudentManagement';
import MatchingSuggestions from './components/MatchingSuggestions';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tutors':
        return <TutorManagement />;
      case 'students':
        return <StudentManagement />;
      case 'matching':
        return <MatchingSuggestions />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>LCC 360</h1>
          <span className="subtitle">Tutor Resource Optimization</span>
        </div>
        <div className="navbar-menu">
          <button 
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentPage('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={currentPage === 'tutors' ? 'active' : ''}
            onClick={() => setCurrentPage('tutors')}
          >
            👨‍🏫 Tutors
          </button>
          <button 
            className={currentPage === 'students' ? 'active' : ''}
            onClick={() => setCurrentPage('students')}
          >
            🎓 Students
          </button>
          <button 
            className={currentPage === 'matching' ? 'active' : ''}
            onClick={() => setCurrentPage('matching')}
          >
            🎯 Matching
          </button>
        </div>
      </nav>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
