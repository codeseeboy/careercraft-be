# Job Listings API Setup Guide

## 🔧 Quick Setup Instructions

### 1. Get Your JSearch API Key
1. Visit [JSearch API on RapidAPI](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
2. Sign up/Login to RapidAPI
3. Subscribe to the JSearch API (free tier available)
4. Copy your API key from the "X-RapidAPI-Key" header

### 2. Configure Your API Key
1. Open `.env` file in your backend folder
2. Replace `your_api_key_here` with your actual RapidAPI key:
   ```
   RAPIDAPI_KEY=your_actual_api_key_here
   ```

### 3. Start the Server
```bash
npm run build
npm start
```

## 🚀 Available Endpoints

### 1. Basic Job Search
```
GET /api/jobs?query=developer&location=India&page=1
```

### 2. Advanced Job Search with Filters  
```
GET /api/jobs/search?query=frontend&location=Bangalore&employment_types=FULLTIME&remote_jobs_only=true
```

### 3. Get Job Details by ID
```
GET /api/jobs/ABC123XYZ
```

## 🌐 Frontend Features

Visit `http://localhost:5000` and click the "Job Listings" tab to:

- ✅ Search for jobs by keywords and location
- ✅ Filter by employment type (Full-time, Part-time, Contract, Internship)
- ✅ Filter by experience level (Entry, Mid, Senior)
- ✅ Show only remote jobs
- ✅ Navigate through multiple pages of results
- ✅ View detailed job information with apply links
- ✅ See required skills for each position

## 🔍 Example Searches

- **Software Developer Jobs in India**: `developer` + `India`
- **Remote Frontend Jobs**: `frontend developer` + `remote_jobs_only=true`
- **Data Science Internships**: `data scientist` + `INTERN` employment type
- **Entry-level positions**: Use `no_experience` in job requirements

## 🛠️ Troubleshooting

1. **"JSearch API key not configured"** - Add your RapidAPI key to `.env`
2. **"Service Unavailable"** - Check your internet connection and API limits
3. **"No jobs found"** - Try broader search terms or different locations

## 📝 Integration with Existing Features

The job listings work alongside your existing resume features:
- Upload resumes using the "Upload Resume" tab
- Get resume reviews using the "Resume Review" tab  
- Score resumes against job descriptions using the "Resume Score" tab
- Check request status using the "Check Status" tab
- **NEW**: Find job opportunities using the "Job Listings" tab

Perfect for college projects demonstrating full-stack development with real APIs!