# ⚡ Quick Start Guide

Get LCC 360 up and running in 5 minutes!

## Prerequisites

- ✅ Node.js installed
- ✅ MongoDB installed and running

## Installation (3 Commands)

```bash
# 1. Install backend dependencies
cd backend && npm install

# 2. Install frontend dependencies
cd ../frontend && npm install

# 3. Done! Ready to start
```

## Running (2 Terminals)

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

## Access the System

🌐 **Frontend:** http://localhost:3000
🔌 **Backend API:** http://localhost:5000/api

## First Steps

1. **Create a Tutor**
   - Go to "Tutors" tab
   - Click "Add New Tutor"
   - Fill in details and save

2. **Create a Student**
   - Go to "Students" tab
   - Click "Add New Student"
   - Fill in details and save

3. **Find Matches**
   - Go to "Matching" tab
   - Select a student and subject
   - Click "Find Match"
   - See recommendations!

## Common Issues

**MongoDB not running?**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Port 5000 in use?**
- Edit `backend/.env` and change `PORT=5000` to `PORT=5001`

**Need help?** Check `SETUP_GUIDE.md` for detailed troubleshooting.

---

That's it! You're ready to optimize your tutoring business! 🚀
