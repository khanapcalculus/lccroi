import React, { useState } from 'react';
import './SubjectSelector.css';

const SUBJECTS_BY_GRADE = {
  'K-5 (Elementary)': [
    'Math', 'Reading', 'Writing', 'Science', 'Social Studies', 
    'English', 'Spelling', 'Phonics', 'Basic Arithmetic'
  ],
  '6-8 (Middle School)': [
    'Pre-Algebra', 'Algebra I', 'Geometry', 'English', 'Reading',
    'Writing', 'Science', 'Biology', 'Physical Science', 
    'Social Studies', 'History', 'Geography', 'Spanish', 'French'
  ],
  '9-12 (High School)': [
    'Algebra I', 'Algebra II', 'Geometry', 'Trigonometry', 
    'Pre-Calculus', 'Calculus', 'Statistics',
    'English', 'Literature', 'Writing', 'Composition',
    'Physics', 'Chemistry', 'Biology', 'Environmental Science',
    'US History', 'World History', 'Government', 'Economics',
    'Spanish', 'French', 'German', 'Chinese',
    'Computer Science', 'Psychology', 'Art', 'Music'
  ],
  'College': [
    'Calculus I', 'Calculus II', 'Calculus III', 'Differential Equations',
    'Linear Algebra', 'Statistics', 'Probability',
    'Physics I', 'Physics II', 'Chemistry', 'Organic Chemistry',
    'Biology', 'Microbiology', 'Anatomy', 'Physiology',
    'English Composition', 'Literature', 'Creative Writing',
    'Microeconomics', 'Macroeconomics', 'Accounting', 'Finance',
    'Computer Science', 'Data Structures', 'Algorithms',
    'Psychology', 'Sociology', 'Philosophy', 'History'
  ],
  'AP': [
    'AP Calculus AB', 'AP Calculus BC', 'AP Statistics',
    'AP Physics 1', 'AP Physics 2', 'AP Physics C', 
    'AP Chemistry', 'AP Biology', 'AP Environmental Science',
    'AP English Language', 'AP English Literature',
    'AP US History', 'AP World History', 'AP European History',
    'AP Government', 'AP Economics', 'AP Psychology',
    'AP Computer Science A', 'AP Computer Science Principles',
    'AP Spanish', 'AP French', 'AP Chinese', 'AP Art History'
  ],
  'IB': [
    'IB Math Analysis', 'IB Math Applications',
    'IB Physics', 'IB Chemistry', 'IB Biology',
    'IB English A', 'IB English B',
    'IB History', 'IB Economics', 'IB Psychology',
    'IB Computer Science', 'IB Spanish', 'IB French'
  ],
  'IGCSE': [
    'IGCSE Mathematics', 'IGCSE Additional Mathematics',
    'IGCSE Physics', 'IGCSE Chemistry', 'IGCSE Biology',
    'IGCSE English Language', 'IGCSE English Literature',
    'IGCSE History', 'IGCSE Geography', 'IGCSE Economics',
    'IGCSE Computer Science', 'IGCSE Spanish', 'IGCSE French'
  ],
  'GCSE': [
    'GCSE Mathematics', 'GCSE Further Mathematics',
    'GCSE Physics', 'GCSE Chemistry', 'GCSE Biology',
    'GCSE English Language', 'GCSE English Literature',
    'GCSE History', 'GCSE Geography', 'GCSE Business Studies',
    'GCSE Computer Science', 'GCSE Spanish', 'GCSE French'
  ]
};

function SubjectSelector({ gradeLevel, subjects, onChange, label = "Subjects" }) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [currentGrade, setCurrentGrade] = useState('');
  const [targetGrade, setTargetGrade] = useState('');
  const [priority, setPriority] = useState(3);

  const availableSubjects = SUBJECTS_BY_GRADE[gradeLevel] || [];

  const handleAddSubject = () => {
    if (!selectedSubject) {
      alert('Please select a subject');
      return;
    }

    if (!currentGrade || !targetGrade) {
      alert('Please enter current and target grades');
      return;
    }

    // Check for duplicates
    const isDuplicate = subjects.some(s => s.name === selectedSubject);
    if (isDuplicate) {
      alert('This subject has already been added');
      return;
    }

    const newSubject = {
      name: selectedSubject,
      currentGrade,
      targetGrade,
      priority: parseInt(priority)
    };

    onChange([...subjects, newSubject]);

    // Reset form
    setSelectedSubject('');
    setCurrentGrade('');
    setTargetGrade('');
    setPriority(3);
  };

  const handleRemoveSubject = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="subject-selector">
      <h3>{label}</h3>
      
      <div className="subject-form">
        <div className="form-row-subjects">
          <div className="form-group-inline">
            <label>Subject *</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="subject-select"
            >
              <option value="">Select a subject...</option>
              {availableSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="form-group-inline">
            <label>Current Grade *</label>
            <input
              type="text"
              value={currentGrade}
              onChange={(e) => setCurrentGrade(e.target.value)}
              placeholder="e.g., B, 75%, C+"
              className="grade-input"
            />
          </div>

          <div className="form-group-inline">
            <label>Target Grade *</label>
            <input
              type="text"
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
              placeholder="e.g., A, 90%, A+"
              className="grade-input"
            />
          </div>

          <div className="form-group-inline">
            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              <option value="1">1 - Low</option>
              <option value="2">2</option>
              <option value="3">3 - Medium</option>
              <option value="4">4</option>
              <option value="5">5 - High</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleAddSubject}
            className="btn-add-subject"
          >
            ➕ Add
          </button>
        </div>
      </div>

      <div className="subjects-list">
        {subjects.length === 0 ? (
          <div className="empty-subjects">
            No subjects added yet. Use the form above to add subjects.
          </div>
        ) : (
          subjects.map((subject, index) => (
            <div key={index} className="subject-card">
              <div className="subject-header">
                <span className="subject-name">{subject.name}</span>
                <span className={`priority-indicator priority-${subject.priority}`}>
                  Priority {subject.priority}
                </span>
              </div>
              <div className="subject-grades">
                <span className="grade-info">
                  Current: <strong>{subject.currentGrade}</strong>
                </span>
                <span className="arrow">→</span>
                <span className="grade-info">
                  Target: <strong>{subject.targetGrade}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSubject(index)}
                className="btn-remove-subject"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SubjectSelector;
