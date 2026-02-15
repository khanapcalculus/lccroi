import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import AvailabilitySelector from './AvailabilitySelector';
import './StudentManagement.css';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    gradeLevel: 'K-5 (Elementary)',
    learningStyle: 'mixed',
    status: 'active',
    subjectsNeeded: [],
    availability: [],
    sessionsPerWeek: 1
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll();
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error loading students');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubject = () => {
    const name = prompt('Enter subject name:');
    const currentGrade = prompt('Enter current grade (e.g., B, 75%):');
    const targetGrade = prompt('Enter target grade (e.g., A, 90%):');
    const priority = prompt('Enter priority level (1-5):');
    
    if (name && currentGrade && targetGrade) {
      setFormData(prev => ({
        ...prev,
        subjectsNeeded: [...prev.subjectsNeeded, {
          name,
          currentGrade,
          targetGrade,
          priority: parseInt(priority) || 3
        }]
      }));
    }
  };

  const handleAvailabilityChange = (newAvailability) => {
    setFormData(prev => ({
      ...prev,
      availability: newAvailability
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSubmit = {
        ...formData,
        sessionsPerWeek: parseInt(formData.sessionsPerWeek) || 1
      };

      if (editingStudent) {
        await studentAPI.update(editingStudent._id, dataToSubmit);
        alert('Student updated successfully!');
      } else {
        await studentAPI.create(dataToSubmit);
        alert('Student created successfully!');
      }
      
      setShowForm(false);
      setEditingStudent(null);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error saving student: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      parentName: student.parentName,
      parentEmail: student.parentEmail,
      parentPhone: student.parentPhone,
      gradeLevel: student.gradeLevel || 'K-5 (Elementary)',
      learningStyle: student.learningStyle,
      status: student.status,
      subjectsNeeded: student.subjectsNeeded || [],
      availability: student.availability || [],
      sessionsPerWeek: student.sessionsPerWeek || 1
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(id);
        alert('Student deleted successfully!');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      gradeLevel: 'K-5 (Elementary)',
      learningStyle: 'mixed',
      status: 'active',
      subjectsNeeded: [],
      availability: [],
      sessionsPerWeek: 1
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="student-management">
      <div className="page-header">
        <h1 className="page-title">Student Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          ➕ Add New Student
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit}>
              <h3>Student Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Student Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Student Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Student Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Grade Level *</label>
                  <select
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="K-5 (Elementary)">K-5 (Elementary)</option>
                    <option value="6-8 (Middle School)">6-8 (Middle School)</option>
                    <option value="9-12 (High School)">9-12 (High School)</option>
                    <option value="College">College</option>
                    <option value="AP">AP</option>
                    <option value="IB">IB</option>
                    <option value="IGCSE">IGCSE</option>
                    <option value="GCSE">GCSE</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Learning Style</label>
                  <select
                    name="learningStyle"
                    value={formData.learningStyle}
                    onChange={handleInputChange}
                  >
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                    <option value="reading-writing">Reading/Writing</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                  </select>
                </div>
              </div>

              <h3>Parent Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Parent Name *</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Parent Email *</label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Parent Phone *</label>
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <h3>Session Frequency</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Sessions Per Week *</label>
                  <select
                    name="sessionsPerWeek"
                    value={formData.sessionsPerWeek}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">Once a Week</option>
                    <option value="2">Twice a Week</option>
                  </select>
                </div>
              </div>
              
              <div className="pricing-info">
                <strong>Published Rate:</strong> {
                  formData.gradeLevel === 'K-5 (Elementary)' ? (formData.sessionsPerWeek == 1 ? '$18/hr' : '$17/hr') :
                  formData.gradeLevel === '6-8 (Middle School)' ? (formData.sessionsPerWeek == 1 ? '$19/hr' : '$18/hr') :
                  formData.gradeLevel === '9-12 (High School)' ? (formData.sessionsPerWeek == 1 ? '$21/hr' : '$20/hr') :
                  formData.gradeLevel === 'College' ? (formData.sessionsPerWeek == 1 ? '$25/hr' : '$23/hr') :
                  '$20/hr'
                }
              </div>

              <div className="form-section">
                <h3>Subjects Needed</h3>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleAddSubject}
                >
                  ➕ Add Subject
                </button>
                <div className="subject-list">
                  {formData.subjectsNeeded.map((subject, index) => (
                    <div key={index} className="subject-item">
                      <div>
                        <strong>{subject.name}</strong><br/>
                        Current: {subject.currentGrade} → Target: {subject.targetGrade}
                        (Priority: {subject.priority}/5)
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            subjectsNeeded: prev.subjectsNeeded.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Availability Schedule</h3>
                <AvailabilitySelector
                  availability={formData.availability}
                  onChange={handleAvailabilityChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Update' : 'Create'} Student
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <h2>All Students ({students.length})</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Parent</th>
                <th>Frequency</th>
                <th>Subjects</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>
                    {student.name}<br/>
                    <small>{student.email}</small>
                  </td>
                  <td>{student.gradeLevel}</td>
                  <td>
                    {student.parentName}<br/>
                    <small>{student.parentEmail}</small>
                  </td>
                  <td>
                    {student.sessionsPerWeek || 1}x/week
                  </td>
                  <td>
                    {student.subjectsNeeded?.map(s => s.name).join(', ') || 'None'}
                  </td>
                  <td>
                    <span className={`badge badge-${
                      student.status === 'active' ? 'success' : 
                      student.status === 'graduated' ? 'info' : 'danger'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-icon"
                      onClick={() => handleEdit(student)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon"
                      onClick={() => handleDelete(student._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentManagement;
