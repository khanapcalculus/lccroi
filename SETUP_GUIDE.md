# 🚀 LCC 360 Setup Guide

This guide will walk you through setting up the LCC 360 Tutor Resource Optimization System from scratch.

## ⚙️ System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **Node.js**: v16.0.0 or higher
- **MongoDB**: v5.0 or higher
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB free

## 📥 Step 1: Install Prerequisites

### Installing Node.js

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Installing MongoDB

#### Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a service
5. Verify installation:
   ```bash
   mongosh --version
   ```

#### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

#### Linux (Ubuntu/Debian):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

## 📦 Step 2: Install Dependencies

### Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- express (^4.18.2) - Web framework
- mongoose (^8.0.3) - MongoDB ODM
- cors (^2.8.5) - Cross-origin resource sharing
- dotenv (^16.3.1) - Environment variables
- body-parser (^1.20.2) - Request body parsing
- nodemon (^3.0.2) - Development auto-restart

### Frontend Dependencies

```bash
cd ../frontend
npm install
```

This installs:
- react (^18.2.0) - UI library
- react-dom (^18.2.0) - React DOM renderer
- react-router-dom (^6.20.1) - Routing
- axios (^1.6.2) - HTTP client
- react-scripts (5.0.1) - Build tools

## 🔧 Step 3: Configure Environment

### Backend Configuration

Create `backend/.env` (or `backend/config.env`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/lcc360

# Optional: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lcc360
```

### Frontend Configuration (Optional)

Create `frontend/.env` if you need custom API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎬 Step 4: Start the Application

### Option 1: Manual Start (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
MongoDB Connected: localhost
LCC 360 Tutor Resource Optimization System
Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Browser will open automatically at `http://localhost:3000`

### Option 2: Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Then serve the build folder with a static server
```

## 🧪 Step 5: Verify Installation

### Test Backend API

Open your browser or use curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
{
  "success": true,
  "message": "LCC 360 Tutor Resource Optimization System API is running",
  "version": "1.0.0"
}
```

### Test Frontend

1. Open `http://localhost:3000`
2. You should see the LCC 360 Dashboard
3. Navigation should work (Dashboard, Tutors, Students, Matching)

## 📝 Step 6: Add Sample Data

### Add a Sample Tutor

1. Click on "👨‍🏫 Tutors" in the navigation
2. Click "➕ Add New Tutor"
3. Fill in the form:
   - Name: "John Smith"
   - Email: "john.smith@example.com"
   - Phone: "555-0100"
   - Hourly Rate: 30
   - Experience: 5
   - Status: Active
4. Click "Add Subject":
   - Subject: "Mathematics"
   - Proficiency: 9
5. Click "Add Time Slot":
   - Day: Monday
   - Start: 14:00
   - End: 18:00
6. Click "Create Tutor"

### Add a Sample Student

1. Click on "🎓 Students" in the navigation
2. Click "➕ Add New Student"
3. Fill in the student information:
   - Student Name: "Sarah Johnson"
   - Email: "sarah.j@example.com"
   - Phone: "555-0200"
   - Grade Level: "10th Grade"
4. Fill in parent information:
   - Parent Name: "Mary Johnson"
   - Email: "mary.j@example.com"
   - Phone: "555-0201"
5. Set budget:
   - Max Hourly Rate: 40
   - Sessions Per Week: 2
6. Click "Add Subject":
   - Subject: "Mathematics"
   - Current Grade: "B"
   - Target Grade: "A"
   - Priority: 5
7. Click "Add Time Slot":
   - Day: Monday
   - Start: 15:00
   - End: 17:00
8. Click "Create Student"

### Test Matching

1. Click on "🎯 Matching" in the navigation
2. In the "Find Best Match" section:
   - Select: "Sarah Johnson - 10th Grade"
   - Subject: "Mathematics"
   - Click "🎯 Find Match"
3. You should see:
   - John Smith as a match
   - Match score and breakdown
   - Profit projections

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Issue: Port 5000 Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution 1:** Change the port in `backend/.env`:
```env
PORT=5001
```

**Solution 2:** Kill the process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

### Issue: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
cd backend
rm -rf node_modules
npm install

# Same for frontend
cd ../frontend
rm -rf node_modules
npm install
```

### Issue: CORS Error in Browser

**Error:** `Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS`

**Solution:** Ensure CORS is enabled in `backend/server.js` (it should be by default):
```javascript
app.use(cors());
```

### Issue: Blank White Screen in Frontend

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Ensure backend is running
4. Clear browser cache
5. Try different browser

## 🔐 Security Setup (Before Production)

### 1. Secure MongoDB

```javascript
// backend/config/database.js
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add authentication if needed
      user: process.env.DB_USER,
      pass: process.env.DB_PASS
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
```

### 2. Add Rate Limiting

```bash
cd backend
npm install express-rate-limit
```

```javascript
// backend/server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Add Helmet for Security Headers

```bash
cd backend
npm install helmet
```

```javascript
// backend/server.js
const helmet = require('helmet');
app.use(helmet());
```

## 📊 Performance Optimization

### MongoDB Indexing

```javascript
// Add to backend/models/Tutor.js
tutorSchema.index({ email: 1 });
tutorSchema.index({ status: 1 });

// Add to backend/models/Student.js
studentSchema.index({ email: 1 });
studentSchema.index({ status: 1 });
```

### Enable Compression

```bash
cd backend
npm install compression
```

```javascript
// backend/server.js
const compression = require('compression');
app.use(compression());
```

## ✅ Verification Checklist

- [ ] Node.js installed and version verified
- [ ] MongoDB installed and running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Environment variables configured
- [ ] Backend starts without errors
- [ ] Frontend starts and opens in browser
- [ ] API health check returns success
- [ ] Can create a tutor
- [ ] Can create a student
- [ ] Matching algorithm works
- [ ] Dashboard shows statistics
- [ ] All pages load without errors

## 🎓 Next Steps

1. **Customize the System**
   - Adjust matching algorithm weights
   - Modify scoring thresholds
   - Customize UI colors and branding

2. **Add More Data**
   - Import existing tutors and students
   - Set up realistic schedules
   - Configure accurate pricing

3. **Deploy to Production**
   - Set up hosting (AWS, Heroku, DigitalOcean)
   - Configure production database
   - Set up domain and SSL
   - Enable backups

4. **Monitor and Optimize**
   - Track system performance
   - Analyze matching success rates
   - Gather user feedback
   - Iterate on features

## 📞 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review error messages carefully
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify all prerequisites are installed
6. Ensure all services are running

---

**Congratulations! 🎉**

Your LCC 360 Tutor Resource Optimization System is now set up and ready to use!
