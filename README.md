# LCC 360 - Tutor Resource Optimization System

A comprehensive web-based decision-making engine designed to optimize tutor-student matching for online tutoring companies. This system maximizes profit margins, improves student outcomes, and enhances satisfaction while minimizing costs.

## 🎯 System Objectives

1. **Maximize Profit Margin** - Optimize tutor-student pairings for maximum profitability
2. **Increase Student Grade Improvement** - Match students with tutors who deliver best results
3. **Improve Parent & Student Satisfaction** - Consider ratings and compatibility factors
4. **Minimize Tutor Cost** - Efficiently allocate resources while maintaining quality
5. **Automatic Matching** - AI-powered matching based on multiple factors

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- RESTful API for all operations
- MongoDB database with optimized schemas
- Weighted matching algorithm with 5-factor scoring system

### Frontend (React)
- Modern, responsive admin dashboard
- Tutor and student management interfaces
- Real-time matching suggestions and profit projections

## 📊 Matching Algorithm

The system uses a sophisticated weighted algorithm that considers:

| Factor | Default Weight | Description |
|--------|--------|-------------|
| **Profit Margin** | 25% | Calculates potential profit based on budget vs cost |
| **Student Improvement** | 30% | Historical performance and improvement rates |
| **Satisfaction** | 20% | Parent ratings and tutor reliability scores |
| **Availability** | 15% | Schedule compatibility between tutor and student |
| **Subject Expertise** | 10% | Tutor proficiency in required subject |

### 🎛️ Dynamic Weight Adjustment

**NEW FEATURE:** Admins can now adjust algorithm weights dynamically from the dashboard!

- Navigate to the Dashboard
- Scroll to "Algorithm Weight Configuration" section
- Use sliders or input fields to adjust weights
- Weights must sum to 100%
- Click "Save Weights" to apply changes
- Use "Normalize to 100%" to auto-adjust if needed
- Click "Reset to Defaults" to restore original values

**Formula:**
```
Match Score = (Profit × Weight₁) + (Improvement × Weight₂) + 
              (Satisfaction × Weight₃) + (Availability × Weight₄) + 
              (Expertise × Weight₅)
```

Where all weights sum to 1.0 (100%)

### Scoring System

- **80-100**: Highly Recommended - Excellent match across all factors
- **65-79**: Recommended - Strong match with good compatibility
- **50-64**: Acceptable - Decent match but may have limitations
- **35-49**: Not Ideal - Consider only if no better options
- **0-34**: Not Recommended - Poor match, seek alternatives

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd lccroi
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lcc360
   NODE_ENV=development
   ```

4. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on: `http://localhost:5000`

3. **Start Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on: `http://localhost:3000`

## 📡 API Endpoints

### Tutors
- `GET /api/tutors` - Get all tutors
- `GET /api/tutors/active` - Get active tutors
- `GET /api/tutors/:id` - Get specific tutor
- `POST /api/tutors` - Create new tutor
- `PUT /api/tutors/:id` - Update tutor
- `DELETE /api/tutors/:id` - Delete tutor

### Students
- `GET /api/students` - Get all students
- `GET /api/students/active` - Get active students
- `GET /api/students/:id` - Get specific student
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Matching
- `POST /api/matching/find-match` - Find best tutor match for a student
- `GET /api/matching/recommendations` - Get all automated recommendations
- `GET /api/matching/projected-revenue` - Calculate projected revenue

### Config (Algorithm Weights)
- `GET /api/config/weights` - Get current algorithm weights
- `PUT /api/config/weights` - Update algorithm weights
- `POST /api/config/weights/reset` - Reset weights to defaults

## 📋 Data Models

### Tutor Schema
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  subjects: [{ name: String, proficiencyLevel: Number }],
  hourlyRate: Number,
  availability: [{ dayOfWeek: String, startTime: String, endTime: String }],
  performanceMetrics: {
    averageStudentImprovement: Number,
    averageParentRating: Number,
    totalSessionsCompleted: Number,
    reliabilityScore: Number
  },
  experience: Number,
  status: String (active/inactive/on-leave)
}
```

### Student Schema
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  parentName: String,
  parentEmail: String,
  parentPhone: String,
  gradeLevel: String,
  subjectsNeeded: [{
    name: String,
    currentGrade: String,
    targetGrade: String,
    priority: Number
  }],
  learningStyle: String,
  availability: [{ dayOfWeek: String, startTime: String, endTime: String }],
  budget: {
    maxHourlyRate: Number,
    sessionsPerWeek: Number
  },
  status: String (active/inactive/graduated)
}
```

## 💻 Frontend Features

### Dashboard
- Real-time statistics (tutors, students, revenue, profit)
- Revenue projections and profit margins
- System information and status

### Tutor Management
- Add/Edit/Delete tutors
- Manage subjects and proficiency levels
- Set availability schedules
- Track performance metrics

### Student Management
- Add/Edit/Delete students
- Manage required subjects and priorities
- Set parent information and budget
- Configure availability

### Matching System
- Manual match finder for specific student-subject combinations
- Automated recommendations for all active students
- Detailed score breakdowns showing all factors
- Profit projections per match (per session, week, month)
- Visual indicators for match quality

## 🎨 UI/UX Features

- **Modern Design**: Beautiful gradient colors and smooth animations
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Intuitive**: Easy-to-use forms and navigation
- **Real-time Updates**: Live data refresh and calculations
- **Visual Feedback**: Color-coded scores and status badges

## 📈 Business Metrics

The system tracks and optimizes:
- Monthly revenue projections
- Profit margins per match
- Student improvement rates
- Parent satisfaction scores
- Tutor utilization rates
- Match success rates

## 🔒 Security Considerations

For production deployment, implement:
- User authentication and authorization
- Role-based access control (Admin, Manager, Staff)
- API rate limiting
- Input validation and sanitization
- HTTPS encryption
- Environment variable protection

## 🚀 Future Enhancements (Phase 2+)

- **Session Management**: Track actual sessions and outcomes
- **Analytics Dashboard**: Advanced reporting and visualizations
- **Email Notifications**: Automated alerts for matches and sessions
- **Payment Integration**: Handle invoicing and payments
- **Mobile App**: Native iOS/Android applications
- **AI Predictions**: Machine learning for outcome predictions
- **Calendar Integration**: Sync with Google Calendar, Outlook
- **Parent Portal**: Self-service portal for parents
- **Tutor Portal**: Time tracking and student progress views

## 📝 Testing

### Manual Testing

1. **Add Sample Tutors**
   - Create 3-5 tutors with different rates and subjects
   - Set availability schedules
   - Vary proficiency levels

2. **Add Sample Students**
   - Create 3-5 students with different budgets
   - Set required subjects
   - Configure availability

3. **Test Matching**
   - Use the "Find Best Match" feature
   - Review score breakdowns
   - Verify profit calculations

4. **Check Dashboard**
   - Verify statistics are accurate
   - Review revenue projections
   - Check automated recommendations

## 🛠️ Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If not, start MongoDB service
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod
```

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=5001

# Or kill process on port 5000
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -ti:5000 | xargs kill
```

### CORS Issues
- Ensure backend CORS is configured for frontend URL
- Check proxy setting in frontend/package.json

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Contact: LCC 360 Development Team

## 📄 License

Copyright © 2026 LCC 360. All rights reserved.

---

**Built with ❤️ for LCC 360**

*Making tutoring more efficient, profitable, and effective through data-driven decision making.*
