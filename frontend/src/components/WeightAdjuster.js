import React, { useState, useEffect } from 'react';
import { configAPI } from '../services/api';
import './WeightAdjuster.css';

function WeightAdjuster() {
  const [weights, setWeights] = useState({
    profitMargin: 0.25,
    studentImprovement: 0.30,
    satisfaction: 0.20,
    availability: 0.15,
    subjectExpertise: 0.10
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = async () => {
    try {
      setLoading(true);
      const response = await configAPI.getWeights();
      if (response.data.data && response.data.data.weights) {
        setWeights(response.data.data.weights);
      }
    } catch (error) {
      console.error('Error fetching weights:', error);
      showMessage('Error loading weights', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWeightChange = (key, value) => {
    const numValue = parseFloat(value) || 0;
    setWeights(prev => ({
      ...prev,
      [key]: numValue
    }));
  };

  const getTotalWeight = () => {
    return Object.values(weights).reduce((sum, val) => sum + val, 0);
  };

  const getPercentage = (value) => {
    return (value * 100).toFixed(1);
  };

  const validateWeights = () => {
    const total = getTotalWeight();
    const tolerance = 0.001;
    
    if (Math.abs(total - 1.0) > tolerance) {
      showMessage(`Weights must sum to 100% (currently: ${(total * 100).toFixed(1)}%)`, 'error');
      return false;
    }

    for (const [key, value] of Object.entries(weights)) {
      if (value < 0 || value > 1) {
        showMessage(`${formatKey(key)} must be between 0% and 100%`, 'error');
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateWeights()) {
      return;
    }

    try {
      setSaving(true);
      await configAPI.updateWeights(weights, 'admin');
      showMessage('Weights updated successfully!', 'success');
      
      // Refresh to ensure we have the latest
      setTimeout(() => fetchWeights(), 1000);
    } catch (error) {
      console.error('Error saving weights:', error);
      showMessage(error.response?.data?.message || 'Error saving weights', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all weights to default values?')) {
      try {
        setSaving(true);
        await configAPI.resetWeights();
        showMessage('Weights reset to defaults', 'success');
        fetchWeights();
      } catch (error) {
        console.error('Error resetting weights:', error);
        showMessage('Error resetting weights', 'error');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleNormalize = () => {
    const total = getTotalWeight();
    if (total === 0) {
      showMessage('Cannot normalize zero weights', 'error');
      return;
    }

    const normalized = {};
    for (const [key, value] of Object.entries(weights)) {
      normalized[key] = value / total;
    }
    
    setWeights(normalized);
    showMessage('Weights normalized to 100%', 'info');
  };

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const formatKey = (key) => {
    const formatted = key.replace(/([A-Z])/g, ' $1').trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const weightDescriptions = {
    profitMargin: 'Higher weight prioritizes tutors that maximize profit margin',
    studentImprovement: 'Higher weight prioritizes tutors with best student improvement track record',
    satisfaction: 'Higher weight prioritizes tutors with highest parent and student satisfaction',
    availability: 'Higher weight prioritizes tutors with best schedule match',
    subjectExpertise: 'Higher weight prioritizes tutors with highest subject proficiency'
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const total = getTotalWeight();
  const isValid = Math.abs(total - 1.0) < 0.001;

  return (
    <div className="weight-adjuster">
      <div className="adjuster-header">
        <div>
          <h2>⚖️ Algorithm Weight Configuration</h2>
          <p className="adjuster-description">
            Adjust the importance of each factor in the matching algorithm.
            All weights must sum to 100%.
          </p>
        </div>
        <div className="total-display">
          <span className="total-label">Total:</span>
          <span className={`total-value ${isValid ? 'valid' : 'invalid'}`}>
            {(total * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="weights-grid">
        {Object.keys(weights).map(key => (
          <div key={key} className="weight-item">
            <div className="weight-header">
              <label>{formatKey(key)}</label>
              <span className="weight-percentage">{getPercentage(weights[key])}%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={weights[key]}
              onChange={(e) => handleWeightChange(key, e.target.value)}
              className="weight-slider"
            />
            
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={getPercentage(weights[key])}
              onChange={(e) => handleWeightChange(key, parseFloat(e.target.value) / 100)}
              className="weight-input"
            />
            
            <p className="weight-description">{weightDescriptions[key]}</p>
            
            <div className="weight-bar">
              <div 
                className="weight-bar-fill"
                style={{ width: `${getPercentage(weights[key])}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="adjuster-actions">
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!isValid || saving}
        >
          {saving ? '💾 Saving...' : '💾 Save Weights'}
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={handleNormalize}
          disabled={saving}
        >
          🔄 Normalize to 100%
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={saving}
        >
          ↩️ Reset to Defaults
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={fetchWeights}
          disabled={saving}
        >
          🔄 Refresh
        </button>
      </div>

      <div className="adjuster-info">
        <h3>📊 Current Formula:</h3>
        <div className="formula">
          <code>
            Match Score = 
            (Profit × {getPercentage(weights.profitMargin)}%) + 
            (Improvement × {getPercentage(weights.studentImprovement)}%) + 
            (Satisfaction × {getPercentage(weights.satisfaction)}%) + 
            (Availability × {getPercentage(weights.availability)}%) + 
            (Expertise × {getPercentage(weights.subjectExpertise)}%)
          </code>
        </div>
      </div>

      <div className="adjuster-tips">
        <h3>💡 Tips:</h3>
        <ul>
          <li><strong>Maximize Profit:</strong> Increase Profit Margin weight</li>
          <li><strong>Best Outcomes:</strong> Increase Student Improvement weight</li>
          <li><strong>Happy Clients:</strong> Increase Satisfaction weight</li>
          <li><strong>Easy Scheduling:</strong> Increase Availability weight</li>
          <li><strong>Expert Tutors:</strong> Increase Subject Expertise weight</li>
        </ul>
      </div>
    </div>
  );
}

export default WeightAdjuster;
