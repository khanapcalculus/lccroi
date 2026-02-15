import React, { useState, useEffect } from 'react';
import { matchingAPI, studentAPI } from '../services/api';
import './MatchingSuggestions.css';

function MatchingSuggestions() {
  const [recommendations, setRecommendations] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [matches, setMatches] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recsResponse, studentsResponse] = await Promise.all([
        matchingAPI.getRecommendations(),
        studentAPI.getActive()
      ]);
      
      setRecommendations(recsResponse.data.data || []);
      setStudents(studentsResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    setSelectedSubject(''); // Reset subject selection
    setMatches([]); // Clear previous matches
    setSearchPerformed(false); // Reset search state
    
    // Find and set the selected student data
    const student = students.find(s => s._id === studentId);
    setSelectedStudentData(student);
  };

  const handleFindMatch = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedSubject) {
      alert('Please select both student and subject');
      return;
    }

    try {
      setSearchLoading(true);
      const response = await matchingAPI.findMatch(selectedStudent, selectedSubject);
      const matchData = response.data.matches || [];
      setMatches(matchData);
      setSearchPerformed(true);
      
      // Show helpful message if no tutors teach this subject
      if (matchData.length === 0 && response.data.message) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error finding matches:', error);
      alert('Error finding matches. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#48bb78';
    if (score >= 65) return '#ed8936';
    if (score >= 50) return '#ecc94b';
    return '#f56565';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 65) return 'Good Match';
    if (score >= 50) return 'Fair Match';
    return 'Poor Match';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="matching-suggestions">
      <h1 className="page-title">Matching & Optimization</h1>

      {/* Manual Match Finder */}
      <div className="card">
        <h2>🔍 Find Best Match</h2>
        <form onSubmit={handleFindMatch} className="match-finder-form">
          <div className="form-row">
            <div className="form-group">
              <label>Select Student</label>
              <select
                value={selectedStudent}
                onChange={handleStudentChange}
                required
              >
                <option value="">Choose a student...</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name} - {student.gradeLevel}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                required
                disabled={!selectedStudentData}
              >
                <option value="">
                  {selectedStudentData ? 'Choose a subject...' : 'Select student first'}
                </option>
                {selectedStudentData?.subjectsNeeded?.map((subject, index) => (
                  <option key={index} value={subject.name}>
                    {subject.name} (Current: {subject.currentGrade} → Target: {subject.targetGrade})
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={searchLoading}
            >
              {searchLoading ? 'Searching...' : '🎯 Find Match'}
            </button>
          </div>
        </form>

        {searchPerformed && matches.length === 0 && (
          <div className="no-matches-message">
            <div className="empty-state">
              <h3>❌ No Tutors Found</h3>
              <p>No active tutors teach <strong>{selectedSubject}</strong></p>
              <p>Please add tutors with expertise in this subject or select a different subject.</p>
            </div>
          </div>
        )}

        {matches.length > 0 && (
          <div className="match-results">
            <h3>Top Matches Found: {matches.length}</h3>
            <div className="matches-grid">
              {matches.map((match, index) => (
                <div key={index} className="match-card">
                  <div className="match-rank">#{index + 1}</div>
                  <div className="match-score" style={{ color: getScoreColor(match.matchScore) }}>
                    <div className="score-number">{match.matchScore}</div>
                    <div className="score-label">{getScoreLabel(match.matchScore)}</div>
                  </div>
                  
                  <div className="match-info">
                    <h4>{match.tutor.name}</h4>
                    <p className="tutor-details">
                      📧 {match.tutor.email}<br/>
                      💼 {match.tutor.experience} years experience<br/>
                      💵 ${match.tutor.hourlyRate}/hour
                    </p>

                    <div className="score-breakdown">
                      <h5>Score Breakdown:</h5>
                      <div className="breakdown-grid">
                        <div className="breakdown-item">
                          <span>Profit Margin:</span>
                          <strong>{Math.round(match.scoreBreakdown.profitMargin)}</strong>
                        </div>
                        <div className="breakdown-item">
                          <span>Improvement:</span>
                          <strong>{Math.round(match.scoreBreakdown.studentImprovement)}</strong>
                        </div>
                        <div className="breakdown-item">
                          <span>Satisfaction:</span>
                          <strong>{Math.round(match.scoreBreakdown.satisfaction)}</strong>
                        </div>
                        <div className="breakdown-item">
                          <span>Availability:</span>
                          <strong>{Math.round(match.scoreBreakdown.availability)}</strong>
                        </div>
                        <div className="breakdown-item">
                          <span>Expertise:</span>
                          <strong>{Math.round(match.scoreBreakdown.subjectExpertise)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="profit-projection">
                      <h5>💰 Profit Projection:</h5>
                      <div className="profit-details">
                        <div>Per Session: <strong>${match.projectedProfit.perSession}</strong></div>
                        <div>Per Week: <strong>${match.projectedProfit.perWeek}</strong></div>
                        <div>Per Month: <strong>${match.projectedProfit.perMonth}</strong></div>
                        <div>Margin: <strong>{match.projectedProfit.profitMargin}%</strong></div>
                      </div>
                    </div>

                    <div className="match-recommendation">
                      {match.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Auto-Generated Recommendations */}
      <div className="card">
        <h2>🎯 Automated Recommendations</h2>
        <p className="card-description">
          These are automatically generated best matches for all active students based on 
          our optimization algorithm.
        </p>
        
        {recommendations.length === 0 ? (
          <div className="empty-state">
            <p>No recommendations available. Make sure you have active students and tutors.</p>
          </div>
        ) : (
          <div className="recommendations-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Best Tutor</th>
                  <th>Match Score</th>
                  <th>Profit/Month</th>
                  <th>Tutor Rate</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((rec, index) => (
                  <tr key={index}>
                    <td>{rec.student.name}</td>
                    <td><strong>{rec.subject}</strong></td>
                    <td>
                      <span className={`priority-badge priority-${rec.priority}`}>
                        {rec.priority}/5
                      </span>
                    </td>
                    <td>{rec.bestMatch.tutor.name}</td>
                    <td>
                      <div className="score-cell" style={{ color: getScoreColor(rec.bestMatch.matchScore) }}>
                        <strong>{rec.bestMatch.matchScore}</strong>
                        <small>{getScoreLabel(rec.bestMatch.matchScore)}</small>
                      </div>
                    </td>
                    <td>
                      <strong className="profit-highlight">
                        ${rec.bestMatch.projectedProfit.perMonth}
                      </strong>
                      <small>({rec.bestMatch.projectedProfit.profitMargin}% margin)</small>
                    </td>
                    <td>${rec.bestMatch.tutor.hourlyRate}/hr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      {recommendations.length > 0 && (
        <div className="card">
          <h2>📊 Optimization Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-label">Total Recommendations</div>
              <div className="summary-value">{recommendations.length}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total Monthly Profit</div>
              <div className="summary-value profit-highlight">
                ${recommendations.reduce((sum, rec) => 
                  sum + (rec.bestMatch.projectedProfit.perMonth || 0), 0
                ).toFixed(2)}
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Average Match Score</div>
              <div className="summary-value">
                {(recommendations.reduce((sum, rec) => 
                  sum + rec.bestMatch.matchScore, 0
                ) / recommendations.length).toFixed(1)}
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-label">High Priority Matches</div>
              <div className="summary-value">
                {recommendations.filter(rec => rec.priority >= 4).length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchingSuggestions;
