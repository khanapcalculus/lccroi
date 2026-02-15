# 📡 LCC 360 API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Currently, the API does not require authentication. For production, implement JWT or OAuth2.

---

## Health Check

### Get API Status
```
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "LCC 360 Tutor Resource Optimization System API is running",
  "version": "1.0.0",
  "timestamp": "2026-02-15T10:00:00.000Z"
}
```

---

## Tutors

### Get All Tutors
```
GET /tutors
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "phone": "555-0100",
      "hourlyRate": 30,
      "experience": 5,
      "status": "active",
      "subjects": [
        {
          "name": "Mathematics",
          "proficiencyLevel": 9
        }
      ],
      "availability": [
        {
          "dayOfWeek": "Monday",
          "startTime": "14:00",
          "endTime": "18:00"
        }
      ],
      "performanceMetrics": {
        "averageStudentImprovement": 15,
        "averageParentRating": 4.5,
        "totalSessionsCompleted": 50,
        "reliabilityScore": 9
      }
    }
  ]
}
```

### Get Active Tutors
```
GET /tutors/active
```

Returns only tutors with `status: "active"`

### Get Single Tutor
```
GET /tutors/:id
```

**Response:**
```json
{
  "success": true,
  "data": { /* tutor object */ }
}
```

### Create Tutor
```
POST /tutors
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "555-0100",
  "hourlyRate": 30,
  "experience": 5,
  "status": "active",
  "subjects": [
    {
      "name": "Mathematics",
      "proficiencyLevel": 9
    }
  ],
  "availability": [
    {
      "dayOfWeek": "Monday",
      "startTime": "14:00",
      "endTime": "18:00"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tutor created successfully",
  "data": { /* created tutor object */ }
}
```

### Update Tutor
```
PUT /tutors/:id
Content-Type: application/json
```

**Request Body:** Same as create, all fields optional

**Response:**
```json
{
  "success": true,
  "message": "Tutor updated successfully",
  "data": { /* updated tutor object */ }
}
```

### Delete Tutor
```
DELETE /tutors/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Tutor deleted successfully"
}
```

---

## Students

### Get All Students
```
GET /students
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Sarah Johnson",
      "email": "sarah.j@example.com",
      "phone": "555-0200",
      "parentName": "Mary Johnson",
      "parentEmail": "mary.j@example.com",
      "parentPhone": "555-0201",
      "gradeLevel": "10th Grade",
      "learningStyle": "visual",
      "status": "active",
      "subjectsNeeded": [
        {
          "name": "Mathematics",
          "currentGrade": "B",
          "targetGrade": "A",
          "priority": 5
        }
      ],
      "availability": [
        {
          "dayOfWeek": "Monday",
          "startTime": "15:00",
          "endTime": "17:00"
        }
      ],
      "budget": {
        "maxHourlyRate": 40,
        "sessionsPerWeek": 2
      }
    }
  ]
}
```

### Get Active Students
```
GET /students/active
```

Returns only students with `status: "active"`

### Get Single Student
```
GET /students/:id
```

### Create Student
```
POST /students
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah.j@example.com",
  "phone": "555-0200",
  "parentName": "Mary Johnson",
  "parentEmail": "mary.j@example.com",
  "parentPhone": "555-0201",
  "gradeLevel": "10th Grade",
  "learningStyle": "visual",
  "status": "active",
  "subjectsNeeded": [
    {
      "name": "Mathematics",
      "currentGrade": "B",
      "targetGrade": "A",
      "priority": 5
    }
  ],
  "availability": [
    {
      "dayOfWeek": "Monday",
      "startTime": "15:00",
      "endTime": "17:00"
    }
  ],
  "budget": {
    "maxHourlyRate": 40,
    "sessionsPerWeek": 2
  }
}
```

### Update Student
```
PUT /students/:id
```

### Delete Student
```
DELETE /students/:id
```

---

## Matching

### Find Best Match
```
POST /matching/find-match
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentId": "507f1f77bcf86cd799439012",
  "subject": "Mathematics"
}
```

**Response:**
```json
{
  "success": true,
  "student": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Sarah Johnson",
    "budget": 40
  },
  "subject": "Mathematics",
  "totalMatches": 3,
  "matches": [
    {
      "tutor": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Smith",
        "email": "john.smith@example.com",
        "hourlyRate": 30,
        "experience": 5,
        "subjects": [...]
      },
      "matchScore": 87.5,
      "scoreBreakdown": {
        "profitMargin": 90,
        "studentImprovement": 85,
        "satisfaction": 88,
        "availability": 100,
        "subjectExpertise": 90
      },
      "compatibilityFactors": {
        "profitMargin": "Excellent profit margin",
        "studentImprovement": "Excellent improvement potential",
        "satisfaction": "Excellent satisfaction rating",
        "availability": "Excellent schedule compatibility",
        "subjectExpertise": "Excellent subject expertise"
      },
      "projectedProfit": {
        "perSession": 4.5,
        "perWeek": 9,
        "perMonth": 36,
        "profitMargin": 15,
        "tutorCost": 30,
        "studentCharge": 34
      },
      "recommendation": "Highly Recommended - Excellent match across all factors"
    }
  ]
}
```

### Get All Recommendations
```
GET /matching/recommendations
```

**Response:**
```json
{
  "success": true,
  "totalRecommendations": 5,
  "data": [
    {
      "student": {
        "id": "507f1f77bcf86cd799439012",
        "name": "Sarah Johnson"
      },
      "subject": "Mathematics",
      "priority": 5,
      "bestMatch": {
        "tutor": {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Smith",
          "hourlyRate": 30
        },
        "matchScore": 87.5,
        "projectedProfit": {
          "perSession": 4.5,
          "perWeek": 9,
          "perMonth": 36,
          "profitMargin": 15
        }
      }
    }
  ]
}
```

### Get Projected Revenue
```
GET /matching/projected-revenue
```

**Response:**
```json
{
  "success": true,
  "projections": {
    "monthlyRevenue": 5440,
    "monthlyProfit": 816,
    "averageProfitMargin": 15,
    "potentialMatches": 15,
    "activeStudents": 10,
    "activeTutors": 5
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode)"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting. For production, implement:
- 100 requests per 15 minutes per IP
- 1000 requests per hour for authenticated users

---

## Pagination

Not currently implemented. For large datasets, add:

```
GET /tutors?page=1&limit=20
```

---

## Filtering & Sorting

Not currently implemented. Future endpoints:

```
GET /tutors?status=active&sort=hourlyRate
GET /students?gradeLevel=10th Grade&sort=-createdAt
```

---

## Webhooks (Future)

Future support for webhooks on events:
- Tutor created/updated
- Student created/updated
- Match recommended
- Session completed

---

## API Testing

### Using curl

```bash
# Health check
curl http://localhost:5000/api/health

# Get all tutors
curl http://localhost:5000/api/tutors

# Create a tutor
curl -X POST http://localhost:5000/api/tutors \
  -H "Content-Type: application/json" \
  -d '{"name":"John Smith","email":"john@example.com","phone":"555-0100","hourlyRate":30}'

# Find match
curl -X POST http://localhost:5000/api/matching/find-match \
  -H "Content-Type: application/json" \
  -d '{"studentId":"507f1f77bcf86cd799439012","subject":"Mathematics"}'
```

### Using Postman

1. Import collection from `postman_collection.json` (if provided)
2. Set base URL: `http://localhost:5000/api`
3. Test all endpoints

### Using JavaScript/Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Get all tutors
const tutors = await api.get('/tutors');

// Create student
const student = await api.post('/students', {
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  // ... other fields
});

// Find match
const matches = await api.post('/matching/find-match', {
  studentId: student.data.data._id,
  subject: 'Mathematics'
});
```

---

## Changelog

### v1.0.0 (2026-02-15)
- Initial API release
- Tutor CRUD operations
- Student CRUD operations
- Matching algorithm with 5-factor scoring
- Revenue projections
- Automated recommendations

---

## Support

For API issues or questions, contact the LCC 360 development team.
