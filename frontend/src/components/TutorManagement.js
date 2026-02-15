import React, { useState, useEffect } from 'react';
import { tutorAPI } from '../services/api';
import AvailabilitySelector from './AvailabilitySelector';
import TutorSubjectSelector from './TutorSubjectSelector';
import './TutorManagement.css';

function TutorManagement() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hourlyRate: '',
    experience: '',
    status: 'active',
    subjects: [],
    availability: [],
  });

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await tutorAPI.getAll();
      setTutors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      alert('Error loading tutors');
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

  const handleSubjectsChange = (newSubjects) => {
    setFormData(prev => ({
      ...prev,
      subjects: newSubjects
    }));
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
        hourlyRate: parseFloat(formData.hourlyRate),
        experience: parseFloat(formData.experience) || 0,
      };

      if (editingTutor) {
        await tutorAPI.update(editingTutor._id, dataToSubmit);
        alert('Tutor updated successfully!');
      } else {
        await tutorAPI.create(dataToSubmit);
        alert('Tutor created successfully!');
      }
      
      setShowForm(false);
      setEditingTutor(null);
      resetForm();
      fetchTutors();
    } catch (error) {
      console.error('Error saving tutor:', error);
      alert('Error saving tutor: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (tutor) => {
    setEditingTutor(tutor);
    setFormData({
      name: tutor.name,
      email: tutor.email,
      phone: tutor.phone,
      hourlyRate: tutor.hourlyRate,
      experience: tutor.experience || 0,
      status: tutor.status,
      subjects: tutor.subjects || [],
      availability: tutor.availability || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tutor?')) {
      try {
        await tutorAPI.delete(id);
        alert('Tutor deleted successfully!');
        fetchTutors();
      } catch (error) {
        console.error('Error deleting tutor:', error);
        alert('Error deleting tutor');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      hourlyRate: '',
      experience: '',
      status: 'active',
      subjects: [],
      availability: [],
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTutor(null);
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
    <div className="tutor-management">
      <div className="page-header">
        <h1 className="page-title">Tutor Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          ➕ Add New Tutor
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingTutor ? 'Edit Tutor' : 'Add New Tutor'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hourly Rate ($) *</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                  />
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
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <TutorSubjectSelector
                  subjects={formData.subjects}
                  onChange={handleSubjectsChange}
                  label="Subjects Taught"
                />
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
                  {editingTutor ? 'Update' : 'Create'} Tutor
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
        <h2>All Tutors ({tutors.length})</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Rate</th>
                <th>Experience</th>
                <th>Subjects</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map(tutor => (
                <tr key={tutor._id}>
                  <td>{tutor.name}</td>
                  <td>{tutor.email}</td>
                  <td>{tutor.phone}</td>
                  <td>${tutor.hourlyRate}/hr</td>
                  <td>{tutor.experience || 0} years</td>
                  <td>
                    {tutor.subjects?.map(s => s.name).join(', ') || 'None'}
                  </td>
                  <td>
                    <span className={`badge badge-${
                      tutor.status === 'active' ? 'success' : 
                      tutor.status === 'on-leave' ? 'warning' : 'danger'
                    }`}>
                      {tutor.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-icon"
                      onClick={() => handleEdit(tutor)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon"
                      onClick={() => handleDelete(tutor._id)}
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

export default TutorManagement;
