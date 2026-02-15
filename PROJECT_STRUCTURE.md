# 📁 LCC 360 Project Structure

```
lccroi/
│
├── backend/                          # Node.js + Express Backend
│   ├── config/
│   │   └── database.js              # MongoDB connection configuration
│   │
│   ├── controllers/                  # Request handlers
│   │   ├── tutorController.js       # Tutor CRUD operations
│   │   ├── studentController.js     # Student CRUD operations
│   │   └── matchingController.js    # Matching algorithm endpoints
│   │
│   ├── models/                       # MongoDB Schemas
│   │   ├── Tutor.js                 # Tutor data model
│   │   ├── Student.js               # Student data model
│   │   ├── Session.js               # Session data model
│   │   └── Performance.js           # Performance tracking model
│   │
│   ├── routes/                       # API Routes
│   │   ├── tutorRoutes.js           # Tutor endpoints
│   │   ├── studentRoutes.js         # Student endpoints
│   │   └── matchingRoutes.js        # Matching endpoints
│   │
│   ├── services/                     # Business Logic
│   │   └── matchingAlgorithm.js     # Core matching algorithm
│   │
│   ├── .gitignore                   # Git ignore rules
│   ├── config.env.example           # Environment variables template
│   ├── package.json                 # Backend dependencies
│   └── server.js                    # Express app entry point
│
├── frontend/                         # React Frontend
│   ├── public/
│   │   └── index.html               # HTML template
│   │
│   ├── src/
│   │   ├── components/              # React Components
│   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── TutorManagement.js   # Tutor CRUD interface
│   │   │   ├── TutorManagement.css
│   │   │   ├── StudentManagement.js # Student CRUD interface
│   │   │   ├── StudentManagement.css
│   │   │   ├── MatchingSuggestions.js # Matching interface
│   │   │   └── MatchingSuggestions.css
│   │   │
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   │
│   │   ├── App.js                   # Main App component
│   │   ├── App.css                  # Global styles
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Base styles
│   │
│   ├── .gitignore                   # Git ignore rules
│   └── package.json                 # Frontend dependencies
│
├── README.md                         # Main documentation
├── SETUP_GUIDE.md                   # Detailed setup instructions
├── QUICK_START.md                   # Quick start guide
├── API_DOCUMENTATION.md             # API reference
└── PROJECT_STRUCTURE.md             # This file
```

## 🔍 File Descriptions

### Backend Files

#### `server.js`
- Main Express application
- Middleware configuration (CORS, body-parser)
- Route registration
- Error handling
- Server initialization

#### `config/database.js`
- MongoDB connection logic
- Connection error handling
- Database status logging

#### Controllers
- **tutorController.js**: CRUD operations for tutors
  - `getAllTutors()` - Fetch all tutors
  - `getTutor()` - Get single tutor
  - `createTutor()` - Create new tutor
  - `updateTutor()` - Update tutor
  - `deleteTutor()` - Delete tutor
  - `getActiveTutors()` - Get active tutors only

- **studentController.js**: CRUD operations for students
  - Similar structure to tutorController

- **matchingController.js**: Matching algorithm endpoints
  - `findBestMatch()` - Find best tutor for student/subject
  - `getAllMatchRecommendations()` - Get all recommendations
  - `calculateProjectedRevenue()` - Revenue projections

#### Models
- **Tutor.js**: Tutor schema
  - Personal info (name, email, phone)
  - Subjects and proficiency levels
  - Hourly rate and experience
  - Availability schedule
  - Performance metrics
  - Status tracking

- **Student.js**: Student schema
  - Student info
  - Parent/guardian info
  - Grade level and learning style
  - Subjects needed with priorities
  - Budget constraints
  - Availability schedule
  - Performance tracking

- **Session.js**: Session tracking schema
  - Tutor-student pairing
  - Subject and schedule
  - Cost breakdown
  - Feedback and ratings
  - Performance metrics

- **Performance.js**: Historical performance tracking
  - Tutor-student compatibility
  - Grade improvements
  - Satisfaction scores
  - Revenue generated

#### Routes
- Define API endpoints
- Map endpoints to controller functions
- RESTful architecture

#### Services
- **matchingAlgorithm.js**: Core business logic
  - 5-factor weighted scoring system
  - Profit margin calculation
  - Student improvement prediction
  - Satisfaction scoring
  - Availability matching
  - Subject expertise evaluation

### Frontend Files

#### `App.js`
- Main React component
- Navigation state management
- Page routing
- Layout structure

#### `App.css`
- Global styling
- Common component styles
- Responsive design rules
- Animation definitions

#### Components

##### Dashboard
- Overview statistics
- Revenue projections
- Quick actions
- System information

##### TutorManagement
- Tutor listing table
- Add/Edit tutor forms
- Subject management
- Availability scheduling
- Delete confirmation

##### StudentManagement
- Student listing table
- Add/Edit student forms
- Parent information
- Budget configuration
- Subject priorities

##### MatchingSuggestions
- Manual match finder
- Automated recommendations
- Score breakdowns
- Profit projections
- Match quality indicators

#### `services/api.js`
- Axios HTTP client
- API endpoint definitions
- Request/response handling
- Error handling

## 🔄 Data Flow

### Create Tutor Flow
```
User → TutorManagement UI → api.js → POST /api/tutors 
→ tutorRoutes → tutorController.createTutor() 
→ Tutor.create() → MongoDB → Response
```

### Find Match Flow
```
User → MatchingSuggestions UI → api.js 
→ POST /api/matching/find-match → matchingRoutes 
→ matchingController.findBestMatch() 
→ matchingAlgorithm.findBestMatch() 
→ Calculate scores → Return ranked matches
```

## 🎨 Styling Architecture

### CSS Organization
- **index.css**: Base styles, resets
- **App.css**: Global components (navbar, cards, forms, tables)
- **Component.css**: Component-specific styles

### Design System
- **Colors**: Purple gradient primary, semantic colors for status
- **Typography**: System fonts, hierarchical sizing
- **Spacing**: Consistent rem-based spacing
- **Components**: Cards, buttons, forms, tables, badges
- **Responsive**: Mobile-first breakpoints

## 🔐 Security Layers

### Current
- CORS enabled
- Input validation in schemas
- MongoDB injection prevention

### Recommended for Production
- JWT authentication
- Rate limiting
- Helmet security headers
- Input sanitization
- HTTPS enforcement
- Environment variable protection

## 📊 Database Schema Relations

```
Tutor ────┐
          ├──→ Session ←──→ Performance
Student ──┘
```

- **One-to-Many**: Tutor → Sessions
- **One-to-Many**: Student → Sessions
- **Many-to-Many**: Tutor ↔ Student (through Sessions)
- **One-to-Many**: Tutor-Student pair → Performance records

## 🚀 Deployment Structure

### Development
```
Backend: localhost:5000
Frontend: localhost:3000
MongoDB: localhost:27017
```

### Production (Recommended)
```
Backend: https://api.lcc360.com
Frontend: https://app.lcc360.com
MongoDB: MongoDB Atlas (cloud)
```

## 📦 Dependencies Summary

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: Cross-origin requests
- **dotenv**: Environment variables
- **body-parser**: Parse request bodies

### Frontend
- **react**: UI library
- **react-dom**: React rendering
- **react-router-dom**: Routing (not yet used)
- **axios**: HTTP client
- **react-scripts**: Build tooling

## 🔧 Configuration Files

### Backend
- `package.json`: Dependencies, scripts
- `config.env.example`: Environment template
- `.gitignore`: Git exclusions

### Frontend
- `package.json`: Dependencies, scripts, proxy config
- `.gitignore`: Git exclusions
- `public/index.html`: HTML shell

## 📈 Scalability Considerations

### Current Capacity
- Suitable for: 1-100 tutors, 1-500 students
- Single server deployment
- Local database

### Scale-Up Path
1. Add database indexing
2. Implement caching (Redis)
3. Load balancing
4. Database sharding
5. Microservices architecture
6. CDN for frontend assets

## 🧪 Testing Structure (Future)

```
backend/
├── tests/
│   ├── unit/
│   │   ├── models/
│   │   └── services/
│   └── integration/
│       └── api/

frontend/
├── src/
│   └── __tests__/
│       └── components/
```

## 📚 Additional Resources

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Express.js Guide**: https://expressjs.com/
- **React Documentation**: https://react.dev/
- **Mongoose Docs**: https://mongoosejs.com/

---

This structure is designed for:
- ✅ Easy navigation
- ✅ Clear separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Team collaboration
