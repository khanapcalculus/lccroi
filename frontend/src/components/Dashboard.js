import React, { useState, useEffect } from 'react';
import { tutorAPI, studentAPI, matchingAPI } from '../services/api';
import WeightAdjuster from './WeightAdjuster';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalTutors: 0,
    activeTutors: 0,
    totalStudents: 0,
    activeStudents: 0,
  });
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tutors
      const tutorsResponse = await tutorAPI.getAll();
      const tutors = tutorsResponse.data.data || [];
      
      // Fetch students
      const studentsResponse = await studentAPI.getAll();
      const students = studentsResponse.data.data || [];
      
      // Fetch revenue projections
      const revenueResponse = await matchingAPI.getProjectedRevenue();
      const revenueData = revenueResponse.data.projections || {};
      
      setStats({
        totalTutors: tutors.length,
        activeTutors: tutors.filter(t => t.status === 'active').length,
        totalStudents: students.length,
        activeStudents: students.filter(s => s.status === 'active').length,
      });
      
      setRevenue(revenueData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card stat-tutors">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <h3>Tutors</h3>
            <div className="stat-number">{stats.activeTutors}</div>
            <div className="stat-label">Active ({stats.totalTutors} total)</div>
          </div>
        </div>

        <div className="stat-card stat-students">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>Students</h3>
            <div className="stat-number">{stats.activeStudents}</div>
            <div className="stat-label">Active ({stats.totalStudents} total)</div>
          </div>
        </div>

        <div className="stat-card stat-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Monthly Revenue</h3>
            <div className="stat-number">
              ${revenue?.monthlyRevenue?.toLocaleString() || '0'}
            </div>
            <div className="stat-label">Projected</div>
          </div>
        </div>

        <div className="stat-card stat-profit">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Monthly Profit</h3>
            <div className="stat-number">
              ${revenue?.monthlyProfit?.toLocaleString() || '0'}
            </div>
            <div className="stat-label">
              {revenue?.averageProfitMargin || '0'}% Margin
            </div>
          </div>
        </div>
      </div>

      {revenue && (
        <div className="card">
          <h2>📊 Revenue Projections</h2>
          <div className="revenue-details">
            <div className="revenue-item">
              <span className="revenue-label">Potential Matches:</span>
              <span className="revenue-value">{revenue.potentialMatches}</span>
            </div>
            <div className="revenue-item">
              <span className="revenue-label">Active Tutors:</span>
              <span className="revenue-value">{revenue.activeTutors}</span>
            </div>
            <div className="revenue-item">
              <span className="revenue-label">Active Students:</span>
              <span className="revenue-value">{revenue.activeStudents}</span>
            </div>
            <div className="revenue-item">
              <span className="revenue-label">Average Profit Margin:</span>
              <span className="revenue-value highlight">
                {revenue.averageProfitMargin}%
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2>🎯 Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn" onClick={() => window.location.reload()}>
            🔄 Refresh Data
          </button>
          <button className="action-btn">
            📊 View Full Report
          </button>
          <button className="action-btn">
            ⚙️ System Settings
          </button>
        </div>
      </div>

      <div className="card">
        <h2>ℹ️ System Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Optimization Algorithm:</strong> Weighted Multi-Factor Matching
          </div>
          <div className="info-item">
            <strong>Factors Considered:</strong> Profit, Improvement, Satisfaction, Availability, Expertise
          </div>
          <div className="info-item">
            <strong>Status:</strong> <span className="badge badge-success">Operational</span>
          </div>
        </div>
      </div>

      {/* Algorithm Weight Configuration */}
      <div className="card">
        <WeightAdjuster />
      </div>
    </div>
  );
}

export default Dashboard;
