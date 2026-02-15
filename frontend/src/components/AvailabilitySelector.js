import React, { useState } from 'react';
import './AvailabilitySelector.css';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const TIME_SLOTS = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute of ['00', '30']) {
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute}`;
    TIME_SLOTS.push(timeStr);
  }
}

function AvailabilitySelector({ availability, onChange }) {
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '17:00'
  });

  const handleAddSlot = () => {
    // Validate times
    if (newSlot.startTime >= newSlot.endTime) {
      alert('End time must be after start time');
      return;
    }

    // Check for duplicates
    const isDuplicate = availability.some(slot => 
      slot.dayOfWeek === newSlot.dayOfWeek &&
      slot.startTime === newSlot.startTime &&
      slot.endTime === newSlot.endTime
    );

    if (isDuplicate) {
      alert('This time slot already exists');
      return;
    }

    onChange([...availability, { ...newSlot }]);
  };

  const handleRemoveSlot = (index) => {
    const updated = availability.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="availability-selector">
      <div className="add-slot-form">
        <div className="form-row">
          <div className="form-group-inline">
            <label>Day</label>
            <select
              value={newSlot.dayOfWeek}
              onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
              className="day-select"
            >
              {DAYS_OF_WEEK.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="form-group-inline">
            <label>Start Time</label>
            <select
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
              className="time-select"
            >
              {TIME_SLOTS.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div className="form-group-inline">
            <label>End Time</label>
            <select
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
              className="time-select"
            >
              {TIME_SLOTS.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleAddSlot}
            className="btn-add-slot"
          >
            ➕ Add
          </button>
        </div>
      </div>

      <div className="availability-list">
        {availability.length === 0 ? (
          <div className="empty-availability">
            No availability added yet. Use the form above to add time slots.
          </div>
        ) : (
          availability.map((slot, index) => (
            <div key={index} className="availability-item">
              <div className="slot-info">
                <span className="day-badge">{slot.dayOfWeek}</span>
                <span className="time-range">
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSlot(index)}
                className="btn-remove"
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

export default AvailabilitySelector;
