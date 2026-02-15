import React, { useState } from 'react';
import './SubjectSelector.css';

const ALL_SUBJECTS = [
  // Elementary (K-5)
  'Math', 'Reading', 'Writing', 'Science', 'Social Studies', 
  'English', 'Spelling', 'Phonics', 'Basic Arithmetic',
  
  // Middle School (6-8)
  'Pre-Algebra', 'Algebra I', 'Geometry', 'Physical Science', 
  'Biology', 'Geography', 'Spanish', 'French',
  
  // High School (9-12)
  'Algebra II', 'Trigonometry', 'Pre-Calculus', 'Calculus', 'Statistics',
  'English', 'Literature', 'Writing', 'Composition',
  'Physics', 'Chemistry', 'Environmental Science',
  'US History', 'World History', 'Government', 'Economics',
  'German', 'Chinese', 'Computer Science', 'Psychology', 'Art', 'Music',
  
  // College
  'Calculus I', 'Calculus II', 'Calculus III', 'Differential Equations',
  'Linear Algebra', 'Probability',
  'Physics I', 'Physics II', 'Organic Chemistry',
  'Microbiology', 'Anatomy', 'Physiology',
  'English Composition', 'Creative Writing',
  'Microeconomics', 'Macroeconomics', 'Accounting', 'Finance',
  'Data Structures', 'Algorithms',
  'Sociology', 'Philosophy', 'History',
  
  // AP
  'AP Calculus AB', 'AP Calculus BC', 'AP Statistics',
  'AP Physics 1', 'AP Physics 2', 'AP Physics C', 
  'AP Chemistry', 'AP Biology', 'AP Environmental Science',
  'AP English Language', 'AP English Literature',
  'AP US History', 'AP World History', 'AP European History',
  'AP Government', 'AP Economics', 'AP Psychology',
  'AP Computer Science A', 'AP Computer Science Principles',
  'AP Spanish', 'AP French', 'AP Chinese', 'AP Art History',
  
  // IB
  'IB Math Analysis', 'IB Math Applications',
  'IB Physics', 'IB Chemistry', 'IB Biology',
  'IB English A', 'IB English B',
  'IB History', 'IB Economics', 'IB Psychology',
  'IB Computer Science', 'IB Spanish', 'IB French',
  
  // IGCSE
  'IGCSE Mathematics', 'IGCSE Additional Mathematics',
  'IGCSE Physics', 'IGCSE Chemistry', 'IGCSE Biology',
  'IGCSE English Language', 'IGCSE English Literature',
  'IGCSE History', 'IGCSE Geography', 'IGCSE Economics',
  'IGCSE Computer Science', 'IGCSE Spanish', 'IGCSE French',
  
  // GCSE
  'GCSE Mathematics', 'GCSE Further Mathematics',
  'GCSE Physics', 'GCSE Chemistry', 'GCSE Biology',
  'GCSE English Language', 'GCSE English Literature',
  'GCSE History', 'GCSE Geography', 'GCSE Business Studies',
  'GCSE Computer Science', 'GCSE Spanish', 'GCSE French'
].sort();

function TutorSubjectSelector({ subjects, onChange, label = "Subjects Taught" }) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [proficiency, setProficiency] = useState(7);

  const handleAddSubject = () => {
    if (!selectedSubject) {
      alert('Please select a subject');
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
      proficiencyLevel: parseInt(proficiency)
    };

    onChange([...subjects, newSubject]);

    // Reset form
    setSelectedSubject('');
    setProficiency(7);
  };

  const handleRemoveSubject = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="subject-selector">
      <h3>{label}</h3>
      
      <div className="subject-form">
        <div className="form-row-tutor-subjects">
          <div className="form-group-inline">
            <label>Subject *</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="subject-select"
            >
              <option value="">Select a subject...</option>
              {ALL_SUBJECTS.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="form-group-inline">
            <label>Proficiency Level (1-10)</label>
            <div className="proficiency-input-group">
              <input
                type="range"
                min="1"
                max="10"
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
                className="proficiency-slider"
              />
              <span className="proficiency-value">{proficiency}/10</span>
            </div>
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
            <div key={index} className="subject-card tutor-subject-card">
              <div className="subject-header">
                <span className="subject-name">{subject.name}</span>
                <span className={`proficiency-badge proficiency-${Math.ceil(subject.proficiencyLevel / 2)}`}>
                  {subject.proficiencyLevel}/10
                </span>
              </div>
              <div className="proficiency-bar">
                <div 
                  className="proficiency-fill"
                  style={{ width: `${subject.proficiencyLevel * 10}%` }}
                ></div>
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

export default TutorSubjectSelector;
