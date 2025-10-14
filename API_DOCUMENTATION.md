# API Documentation

This document provides a comprehensive reference for all backend APIs in the system, with endpoints, request formats, response examples, and integration notes for frontend development.

## Table of Contents

- [1. File Management APIs](#1-file-management-apis)
  - [1.1. Upload Resume API](#11-upload-resume-api)
- [2. Resume Analysis APIs (Magical API)](#2-resume-analysis-apis-magical-api)
  - [2.1. Resume Review API](#21-resume-review-api)
  - [2.2. Resume Score API](#22-resume-score-api)
  - [2.3. Check Status API](#23-check-status-api)
- [3. Job Listings APIs (JSearch)](#3-job-listings-apis-jsearch)
  - [3.1. Get Job Listings API](#31-get-job-listings-api)
  - [3.2. Advanced Job Search API](#32-advanced-job-search-api)
  - [3.3. Get Job Details API](#33-get-job-details-api)
- [4. AI-Powered Career APIs (Gemini)](#4-ai-powered-career-apis-gemini)
  - [4.1. AI Resume Analysis API](#41-ai-resume-analysis-api)
  - [4.2. Learning Roadmap Generation API](#42-learning-roadmap-generation-api)
  - [4.3. Skill Assessment Creation API](#43-skill-assessment-creation-api)
  - [4.4. AI Career Chat API](#44-ai-career-chat-api)
- [5. Integration Examples](#5-integration-examples)
  - [5.1. Complete Resume Workflow](#51-complete-resume-workflow)
  - [5.2. Job Search Implementation](#52-job-search-implementation)
  - [5.3. AI Career Tools Integration](#53-ai-career-tools-integration)
- [6. Error Handling](#6-error-handling)

## 1. File Management APIs

### 1.1. Upload Resume API

Upload a resume file to Appwrite storage and get a public URL for further operations.

- **Endpoint**: `POST http://localhost:5000/api/upload`
- **Content-Type**: `multipart/form-data`

#### Request Body

```
resume: File (PDF, DOC, DOCX) - Max 5MB
```

#### Response Format (200 OK)

```json
{
  "message": "Resume uploaded successfully",
  "fileId": "unique-file-id",
  "url": "https://fra.cloud.appwrite.io/v1/storage/buckets/68e523d0003c6420bf83/files/{fileId}/download?project=68e51aee00233ae2cc4f"
}
```

#### Error Responses

- **400 Bad Request**: `{ "error": "No file uploaded. Please attach a resume file." }`
- **400 Bad Request**: `{ "error": "File size exceeds 5MB limit." }`
- **400 Bad Request**: `{ "error": "Invalid file type. Please use PDF, DOC, or DOCX format." }`
- **500 Internal Server Error**: `{ "error": "Failed to upload resume" }`

#### Frontend Integration Example

```javascript
async function uploadResume(file) {
  // Validate file size and type
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size too large. Please select a file smaller than 5MB.');
  }
  
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload resume');
  }
  
  return await response.json();
}
```

## 2. Resume Analysis APIs (Magical API)

### 2.1. Resume Review API

Get professional feedback on a resume using Magical API.

- **Endpoint**: `POST http://localhost:5000/api/review`
- **Content-Type**: `application/json` OR `multipart/form-data`

#### Request Body (JSON)

```json
{
  "url": "https://example.com/resume.pdf"
}
```

#### Request Body (Form Data)

```
resume: File (PDF, DOC, DOCX)
```

#### Response Format (200 OK)

```json
{
  "data": {
    "request_id": "abc123xyz",
    "status": "completed",
    "review": {
      "summary": "This resume effectively showcases the candidate's technical skills and project experience in full-stack development...",
      "recommendations": [
        "Add more quantifiable achievements to demonstrate impact",
        "Include a technical skills section organized by categories",
        "Make the education section more prominent"
      ]
    }
  }
}
```

#### Error Responses

- **400 Bad Request**: `{ "error": "Resume URL is required" }`
- **500 Internal Server Error**: `{ "error": "Error fetching resume review" }`

#### Frontend Integration Example

```javascript
// Using URL
async function getResumeReviewByUrl(url) {
  const response = await fetch('/api/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  
  return await response.json();
}

// Using File Upload
async function getResumeReviewByFile(file) {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await fetch('/api/review', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
}
```

### 2.2. Resume Score API

Score a resume against a specific job description to evaluate fit.

- **Endpoint**: `POST http://localhost:5000/api/score`
- **Content-Type**: `application/json` OR `multipart/form-data`

#### Request Body (JSON)

```json
{
  "url": "https://example.com/resume.pdf",
  "job_description": "We are seeking a Full Stack Developer with 3+ years of experience in React.js, Node.js, and PostgreSQL..."
}
```

#### Request Body (Form Data)

```
resume: File (PDF, DOC, DOCX)
job_description: String (Detailed job description text)
```

#### Response Format (200 OK)

```json
{
  "data": {
    "request_id": "abc123xyz",
    "status": "completed",
    "score": 7.5,
    "reason": "The resume demonstrates strong React.js skills and database experience, but lacks the required Node.js backend development experience for this role."
  }
}
```

#### Processing Response (202 Accepted)

```json
{
  "data": {
    "request_id": "abc123xyz",
    "status": "processing"
  }
}
```

#### Error Responses

- **400 Bad Request**: `{ "error": "Resume URL is required" }`
- **400 Bad Request**: `{ "error": "Job Description is required" }`
- **500 Internal Server Error**: `{ "error": "Error fetching resume score" }`

#### Frontend Integration Example

```javascript
// Using URL
async function scoreResumeByUrl(url, jobDescription) {
  const response = await fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: url,
      job_description: jobDescription
    })
  });
  
  return await response.json();
}

// Using File Upload
async function scoreResumeByFile(file, jobDescription) {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job_description', jobDescription);
  
  const response = await fetch('/api/score', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
}
```

### 2.3. Check Status API

Check the status of a previously submitted review or score request.

- **Endpoint**: `POST http://localhost:5000/api/status`
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "request_id": "abc123xyz"
}
```

#### Response Format (200 OK)

```json
{
  "data": {
    "request_id": "abc123xyz",
    "status": "completed",
    "score": 7.5,
    "reason": "The resume demonstrates strong React.js skills and database experience, but lacks the required Node.js backend development experience for this role."
  }
}
```

#### Processing Response

```json
{
  "data": {
    "request_id": "abc123xyz",
    "status": "processing"
  }
}
```

#### Error Responses

- **400 Bad Request**: `{ "error": "request_id is required" }`
- **500 Internal Server Error**: `{ "error": "Error fetching status" }`

#### Frontend Integration Example

```javascript
async function checkRequestStatus(requestId) {
  const response = await fetch('/api/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request_id: requestId })
  });
  
  return await response.json();
}
```

## 3. Job Listings APIs (JSearch)

### New: Analyze Resume Text from Editor (no file upload)

If your application has a live resume editor or builder (for example, the Resume Builder / Resume Editor in the `careercraft` folder), you can send the full resume text directly to the AI without uploading a file. This is ideal when users edit resumes inside the browser and you already have the resume content as text.

- **Endpoint**: `POST http://localhost:5000/api/career/analyze-text`
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "resumeText": "Full resume text extracted from the live editor or builder"
}
```

#### Response Format (200 OK)

```json
{
  "score": 75,
  "reason": "The resume demonstrates strong technical skills but lacks specific industry experience and quantifiable achievements.",
  "suggestions": [
    "Add more specific project examples with measurable outcomes",
    "Include relevant certifications and technical skills section",
    "Highlight quantifiable achievements in each role"
  ]
}
```

#### Error Responses

- **400 Bad Request**: `{ "error": "resumeText is required in request body and must be a non-empty string." }`
- **500 Internal Server Error**: `{ "error": "Failed to get a valid response from the AI model" }`

#### Frontend Integration: Resume Editor "Check ATS Score" Button

If you have a resume editor where the current resume preview is available as text (for example `editor.getContent()` or `document.getElementById('resumePreview').innerText`), use the following approach when the user clicks "Check ATS Score":

```javascript
async function checkATSSCoreFromEditor() {
  // Get the resume text from your editor or preview area
  const resumeText = document.getElementById('resumePreview').innerText.trim();

  if (!resumeText) {
    alert('Please add some content to your resume before checking ATS score.');
    return;
  }

  try {
    const response = await fetch('/api/career/analyze-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText })
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle known error messages
      alert(data.error || 'Failed to get ATS score');
      return;
    }

    // Display results to the user (adapt to your UI)
    document.getElementById('atsScoreResult').textContent = `Score: ${data.score}/100\nReason: ${data.reason}`;
    // If suggestions array exists, render it
    if (Array.isArray(data.suggestions)) {
      const ul = document.createElement('ul');
      data.suggestions.forEach(s => { const li = document.createElement('li'); li.textContent = s; ul.appendChild(li); });
      const container = document.getElementById('atsSuggestions');
      container.innerHTML = ''; container.appendChild(ul);
    }
  } catch (err) {
    console.error('ATS score request failed', err);
    alert('Network error: ' + err.message);
  }
}

// Example: attach to a button
document.getElementById('checkAtsButton').addEventListener('click', checkATSSCoreFromEditor);
```

#### Quick drop-in snippet for the Resume Builder (copy-paste)

Place this in your resume builder page (adjust IDs to match your editor):

```html
<!-- UI placeholders -->
<div id="resumePreview" contenteditable="true"></div>
<button id="checkAtsButton">Check ATS Score</button>
<div id="atsScoreResult"></div>
<div id="atsSuggestions"></div>

<script>
async function checkATSSCoreFromEditor() {
  const resumeText = document.getElementById('resumePreview').innerText.trim();
  if (!resumeText) { alert('Please enter resume content'); return; }
  const res = await fetch('http://localhost:5000/api/career/analyze-text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeText }) });
  const data = await res.json();
  if (!res.ok) { alert(data.error || 'Failed to get ATS score'); return; }
  document.getElementById('atsScoreResult').innerText = `Score: ${data.score}/100\n${data.reason}`;
  const ul = document.createElement('ul'); (data.suggestions||[]).forEach(s=>{ const li=document.createElement('li'); li.textContent=s; ul.appendChild(li); });
  const c = document.getElementById('atsSuggestions'); c.innerHTML=''; c.appendChild(ul);
}
document.getElementById('checkAtsButton').addEventListener('click', checkATSSCoreFromEditor);
</script>
```

### 3.1. Get Job Listings API

Search for job listings with basic filters.

- **Endpoint**: `GET http://localhost:5000/api/jobs`
- **Content-Type**: `application/json`

#### Query Parameters

| Parameter        | Type    | Required | Default     | Description                                                                                        |
| ---------------- | ------- | -------- | ----------- | -------------------------------------------------------------------------------------------------- |
| query            | string  | No       | "developer" | Job title or keywords                                                                              |
| location         | string  | No       | "India"     | Job location                                                                                       |
| page             | number  | No       | 1           | Page number for pagination                                                                         |
| num_pages        | number  | No       | 1           | Number of pages to retrieve                                                                        |
| remote_jobs_only | boolean | No       | false       | Filter for remote jobs                                                                             |
| employment_types | string  | No       | -           | Filter by employment type (FULLTIME, PARTTIME, CONTRACTOR, INTERN)                                 |
| job_requirements | string  | No       | -           | Filter by experience level (no_experience, under_3_years_experience, more_than_3_years_experience) |
| company_types    | string  | No       | -           | Filter by company type                                                                             |

#### Response Format (200 OK)

```json
{
  "data": [
    {
      "employer_name": "Company Name",
      "employer_logo": "https://example.com/logo.png",
      "job_title": "Software Developer",
      "job_description": "Detailed job description...",
      "job_city": "Mumbai",
      "job_state": "Maharashtra",
      "job_country": "India",
      "job_is_remote": true,
      "job_employment_type": "FULLTIME",
      "job_apply_link": "https://example.com/apply",
      "job_posted_at_datetime_utc": "2025-10-01T12:00:00.000Z",
      "job_required_skills": ["JavaScript", "React", "Node.js"],
      "job_min_salary": 50000,
      "job_max_salary": 100000,
      "job_salary_currency": "INR"
    },
    // Additional job listings...
  ],
  "search_metadata": {
    "search_query": "developer jobs in India",
    "filters_applied": {
      "remote_jobs_only": false,
      "employment_types": "all",
      "job_requirements": "all",
      "company_types": "all"
    }
  }
}
```

#### Error Responses

- **500 Internal Server Error**: `{ "error": "JSearch API key not configured" }`
- **503 Service Unavailable**: `{ "error": "Service Unavailable", "message": "Unable to reach JSearch API" }`

#### Frontend Integration Example

```javascript
async function searchJobs(params = {}) {
  const defaultParams = {
    query: 'developer',
    location: 'India',
    page: 1,
    num_pages: 1
  };
  
  const searchParams = new URLSearchParams({
    ...defaultParams,
    ...params
  });
  
  const response = await fetch(`/api/jobs?${searchParams.toString()}`);
  return await response.json();
}

// Example usage:
const jobResults = await searchJobs({
  query: 'React developer',
  location: 'Bangalore',
  remote_jobs_only: true,
  employment_types: 'FULLTIME'
});
```

### 3.2. Advanced Job Search API

Search for jobs with advanced filters.

- **Endpoint**: `GET http://localhost:5000/api/jobs/search`
- **Content-Type**: `application/json`

#### Query Parameters

| Parameter        | Type    | Required | Default         | Description            |
| ---------------- | ------- | -------- | --------------- | ---------------------- |
| query            | string  | No       | "developer"     | Job title or keywords  |
| location         | string  | No       | "India"         | Job location           |
| page             | number  | No       | 1               | Page number            |
| employment_types | string  | No       | "FULLTIME"      | Employment type        |
| job_requirements | string  | No       | "no_experience" | Experience level       |
| remote_jobs_only | boolean | No       | false           | Filter for remote jobs |
| salary_min       | number  | No       | -               | Minimum salary filter  |
| salary_max       | number  | No       | -               | Maximum salary filter  |
| company_types    | string  | No       | "all"           | Company type filter    |

#### Response Format

Same as Get Job Listings API

#### Error Responses

Same as Get Job Listings API

#### Frontend Integration Example

```javascript
async function advancedJobSearch(params = {}) {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/jobs/search?${searchParams.toString()}`);
  return await response.json();
}

// Example usage:
const filteredJobs = await advancedJobSearch({
  query: 'Data Scientist',
  location: 'Mumbai',
  employment_types: 'FULLTIME',
  job_requirements: 'under_3_years_experience',
  remote_jobs_only: true,
  salary_min: 75000,
  salary_max: 150000
});
```

### 3.3. Get Job Details API

Get detailed information for a specific job by ID.

- **Endpoint**: `GET http://localhost:5000/api/jobs/:id`
- **Content-Type**: `application/json`

#### URL Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| id        | string | Yes      | The unique job ID |

#### Response Format (200 OK)

```json
{
  "data": [
    {
      "employer_name": "Company Name",
      "employer_logo": "https://example.com/logo.png",
      "job_title": "Software Developer",
      "job_description": "Detailed job description...",
      "job_highlights": {
        "Qualifications": ["Bachelor's degree", "3+ years of experience"],
        "Responsibilities": ["Develop web applications", "Debug code"],
        "Benefits": ["Competitive salary", "Health insurance"]
      },
      "job_apply_link": "https://example.com/apply",
      "job_posted_at_datetime_utc": "2025-10-01T12:00:00.000Z",
      "job_required_skills": ["JavaScript", "React", "Node.js"]
    }
  ]
}
```

#### Error Responses

- **400 Bad Request**: `{ "error": "Job ID is required" }`
- **500 Internal Server Error**: `{ "error": "JSearch API key not configured" }`

#### Frontend Integration Example

```javascript
async function getJobDetails(jobId) {
  const response = await fetch(`/api/jobs/${jobId}`);
  return await response.json();
}

// Example usage:
const jobDetail = await getJobDetails('ABC123XYZ');
```

## 4. AI-Powered Career APIs (Gemini)

### 4.1. AI Resume Analysis API

Analyzes a resume PDF using AI and provides ATS score, feedback, and suggestions.

- **Endpoint**: `POST http://localhost:5000/api/career/analyze-resume`
- **Content-Type**: `multipart/form-data`

#### Request Body

```
resume: File (PDF only) - Max 10MB
```

#### Response Format (200 OK)

```json
{
  "score": 75,
  "reason": "The resume demonstrates strong technical skills but lacks specific industry experience and quantifiable achievements. The format is clean but could be improved for better ATS compatibility.",
  "suggestions": [
    "Add more specific project examples with measurable outcomes",
    "Include relevant certifications and technical skills section",
    "Highlight quantifiable achievements in each role",
    "Optimize resume format for better ATS compatibility",
    "Add a professional summary that aligns with target roles"
  ]
}
```

#### Error Responses

- **400 Bad Request**: `{ "error": "No resume file uploaded" }`
- **400 Bad Request**: `{ "error": "Only PDF files are allowed" }`
- **500 Internal Server Error**: `{ "error": "Failed to process resume" }`

#### Frontend Integration Example

```javascript
async function analyzeResumeWithAI(file) {
  // Validate file type
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed');
  }
  
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await fetch('/api/career/analyze-resume', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
}

// Example usage:
const fileInput = document.getElementById('resumeFile');
const analysisResult = await analyzeResumeWithAI(fileInput.files[0]);
```

### 4.2. Learning Roadmap Generation API

Creates a personalized learning roadmap based on resume analysis and job requirements.

- **Endpoint**: `POST http://localhost:5000/api/career/generate-roadmap`
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "score": 65,
  "reason": "Candidate lacks experience with cloud deployment and advanced database management",
  "jobDescription": "Senior Node.js Engineer. Must have 5+ years experience with Node.js, Express, PostgreSQL, and AWS deployment using CI/CD pipelines.",
  "resumeText": "I am a junior developer with 1 year of experience in Node.js and MongoDB."
}
```

#### Response Format (200 OK)

```json
{
  "learningRoadmap": [
    {
      "skill": "PostgreSQL",
      "reasoning": "Required for senior role database management - your resume mentions MongoDB experience but the job requires PostgreSQL",
      "resources": {
        "books": [
          "PostgreSQL: Up and Running by Regina O. Obe",
          "Learning PostgreSQL by Salahaldin Juba"
        ],
        "youtube": [
          {
            "title": "PostgreSQL Tutorial for Beginners",
            "creator": "freeCodeCamp"
          },
          {
            "title": "SQL vs NoSQL: PostgreSQL and MongoDB Compared",
            "creator": "Academind"
          }
        ]
      }
    },
    {
      "skill": "AWS Deployment",
      "reasoning": "Essential for the required cloud deployment skills in the job description",
      "resources": {
        "books": [
          "AWS Certified Developer Official Guide",
          "AWS in Action"
        ],
        "youtube": [
          {
            "title": "AWS Deployment Tutorial",
            "creator": "Amazon Web Services"
          },
          {
            "title": "Deploying Node.js Applications to AWS",
            "creator": "Traversy Media"
          }
        ]
      }
    },
    {
      "skill": "CI/CD Pipelines",
      "reasoning": "The job requires experience with CI/CD pipelines which is missing from your resume",
      "resources": {
        "books": [
          "Continuous Delivery with Jenkins",
          "GitLab CI/CD Pipeline Guide"
        ],
        "youtube": [
          {
            "title": "GitHub Actions - CI/CD Pipeline Tutorial",
            "creator": "Tech With Tim"
          },
          {
            "title": "CI/CD with Jenkins for Node.js Applications",
            "creator": "DevOps Directive"
          }
        ]
      }
    }
  ]
}
```

#### Error Responses

- **400 Bad Request**: `{ "error": "score, reason, jobDescription, and resumeText are required" }`
- **500 Internal Server Error**: `{ "error": "Failed to generate learning roadmap" }`

#### Frontend Integration Example

```javascript
async function generateLearningRoadmap(score, reason, jobDescription, resumeText) {
  const response = await fetch('/api/career/generate-roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      score,
      reason,
      jobDescription,
      resumeText
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate roadmap');
  }
  
  return await response.json();
}

// Example usage:
const roadmap = await generateLearningRoadmap(
  65,
  "Lacks cloud deployment experience",
  "Senior Developer role requiring AWS and Docker",
  "Junior developer with basic web development skills"
);
```

### 4.3. Skill Assessment Creation API

Generates skill assessment questions for specific topics.

- **Endpoint**: `POST http://localhost:5000/api/career/create-assessment`
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "topic": "React Hooks",
  "level": "intermediate",
  "questionCount": 5
}
```

**Notes**:

- `level` can be "beginner", "intermediate", or "advanced" (default: "intermediate")
- `questionCount` can be between 1-10 (default: 5)

#### Response Format (200 OK)

```json
{
  "assessment": [
    {
      "question": "What is the purpose of the useState hook in React?",
      "options": [
        "To manage component state",
        "To handle side effects",
        "To optimize performance",
        "To create refs"
      ],
      "correctAnswer": "To manage component state"
    },
    {
      "question": "Which React hook is used for performing side effects?",
      "options": [
        "useEffect",
        "useState",
        "useContext",
        "useReducer"
      ],
      "correctAnswer": "useEffect"
    },
    {
      "question": "When using the useEffect hook, what does the second argument (dependency array) control?",
      "options": [
        "When the effect should run",
        "How many times the component should render",
        "The return value of the effect",
        "The performance optimization level"
      ],
      "correctAnswer": "When the effect should run"
    },
    {
      "question": "What is the correct way to update an object state using useState?",
      "options": [
        "Using the spread operator to create a new object",
        "Directly modifying the object properties",
        "Using Object.assign() with the original object as target",
        "Setting the new value without any special handling"
      ],
      "correctAnswer": "Using the spread operator to create a new object"
    },
    {
      "question": "What is the benefit of using the useCallback hook?",
      "options": [
        "Memoizing functions to prevent unnecessary re-renders",
        "Creating stateful variables",
        "Accessing DOM elements directly",
        "Managing component lifecycle"
      ],
      "correctAnswer": "Memoizing functions to prevent unnecessary re-renders"
    }
  ]
}
```

#### Error Responses

- **400 Bad Request**: `{ "error": "topic is required" }`
- **500 Internal Server Error**: `{ "error": "Failed to create assessment" }`

#### Frontend Integration Example

```javascript
async function createSkillAssessment(topic, level = 'intermediate', questionCount = 5) {
  const response = await fetch('/api/career/create-assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic,
      level,
      questionCount
    })
  });
  
  return await response.json();
}

// Example usage:
const assessment = await createSkillAssessment('JavaScript ES6', 'beginner', 3);
```

### 4.4. AI Career Chat API

Get AI responses to career-related questions.

- **Endpoint**: `POST http://localhost:5000/api/chat/ask`
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "prompt": "What are the best practices for Node.js error handling?"
}
```

#### Response Format (200 OK)

```json
{
  "response": "The AI-generated response text in plain string format"
}
```

**Note for Resume ATS Score Integration:** When using this endpoint for ATS scoring, send the resume text with specific formatting instructions:

```javascript
const prompt = `You are an expert ATS score evaluator. Please analyze this resume and give it a score out of 100 based on ATS compatibility. Also provide 2-4 specific suggestions for improvement. Format your response like this: "Score: 75\n\nSuggestions:\n1. Add more keywords from job descriptions\n2. Quantify achievements with metrics"\n\nResume:\n${resumeText}`;

// The response will be formatted as instructed, which you can then parse:
// - Extract score with regex: responseText.match(/Score:\s*(\d+)/i)
// - Extract suggestions by splitting on "Suggestions:" and processing the list items
```

#### Error Responses

- **400 Bad Request**: `{ "error": "Prompt is required" }`
- **500 Internal Server Error**: `{ "error": "Failed to get a valid response from the AI model" }`

#### Frontend Integration Example

```javascript
async function askAICareerQuestion(question) {
  const response = await fetch('/api/chat/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: question })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get AI response');
  }
  
  return await response.json();
}

// Example usage:
const aiResponse = await askAICareerQuestion('How should I prepare for a technical interview?');
console.log(aiResponse.response); // The AI-generated answer
```

## 5. Integration Examples

### 5.1. Complete Resume Workflow

This example demonstrates the full resume upload, review, and scoring workflow:

```javascript
async function processResume(resumeFile, jobDescription) {
  try {
    // Step 1: Upload resume to get URL
    const uploadResult = await uploadResume(resumeFile);
    console.log("Resume uploaded successfully:", uploadResult.url);
    
    // Step 2: Submit for professional review
    const reviewResult = await getResumeReviewByUrl(uploadResult.url);
    console.log("Resume review received:", reviewResult);
    
    // Step 3: Score against job description
    const scoreResult = await scoreResumeByUrl(uploadResult.url, jobDescription);
    
    // Step 4: If processing, check status after delay
    if (scoreResult.data?.status === 'processing') {
      console.log("Score processing, waiting 30 seconds...");
      await new Promise(resolve => setTimeout(resolve, 30000));
      
      const finalResult = await checkRequestStatus(scoreResult.data.request_id);
      console.log("Final score result:", finalResult);
      return {
        url: uploadResult.url,
        review: reviewResult,
        score: finalResult
      };
    }
    
    // If completed immediately
    console.log("Score result:", scoreResult);
    return {
      url: uploadResult.url,
      review: reviewResult,
      score: scoreResult
    };
  } catch (error) {
    console.error("Error in resume workflow:", error);
    throw error;
  }
}
```

### 5.2. Job Search Implementation

Example of implementing job search with filters and pagination:

```javascript
class JobSearchService {
  constructor() {
    this.baseUrl = '/api/jobs';
  }
  
  // Basic search with minimal parameters
  async searchJobs(query, location, page = 1) {
    const params = new URLSearchParams({
      query,
      location,
      page
    });
    
    const response = await fetch(`${this.baseUrl}?${params.toString()}`);
    return await response.json();
  }
  
  // Advanced search with all filters
  async advancedSearch(options = {}) {
    const params = new URLSearchParams();
    
    // Add all provided options to query parameters
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const response = await fetch(`${this.baseUrl}/search?${params.toString()}`);
    return await response.json();
  }
  
  // Get specific job details
  async getJobDetails(jobId) {
    const response = await fetch(`${this.baseUrl}/${jobId}`);
    return await response.json();
  }
}

// Example usage:
const jobService = new JobSearchService();

// Simple search
const basicResults = await jobService.searchJobs('React developer', 'Bangalore');

// Advanced search
const advancedResults = await jobService.advancedSearch({
  query: 'Data Scientist',
  location: 'Mumbai',
  employment_types: 'FULLTIME',
  job_requirements: 'under_3_years_experience',
  remote_jobs_only: true,
  salary_min: 75000,
  company_types: 'startup'
});

// Get job details
const jobDetails = await jobService.getJobDetails('ABC123XYZ');
```

### 5.3. AI Career Tools Integration

Example of integrating all AI-powered career tools:

```javascript
class AICareerAssistant {
  constructor() {
    this.baseUrl = '/api';
  }
  
  // Resume analysis with Gemini AI
  async analyzeResume(pdfFile) {
    if (!pdfFile || pdfFile.type !== 'application/pdf') {
      throw new Error('Please provide a valid PDF file');
    }
    
    const formData = new FormData();
    formData.append('resume', pdfFile);
    
    const response = await fetch(`${this.baseUrl}/career/analyze-resume`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze resume');
    }
    
    return await response.json();
  }
  
  // Generate personalized learning roadmap
  async generateRoadmap(resumeData, jobDescription) {
    const response = await fetch(`${this.baseUrl}/career/generate-roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: resumeData.score,
        reason: resumeData.reason,
        jobDescription,
        resumeText: resumeData.text || ''
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate roadmap');
    }
    
    return await response.json();
  }
  
  // Create skill assessment
  async createAssessment(topic, level, questionCount) {
    const response = await fetch(`${this.baseUrl}/career/create-assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        level,
        questionCount
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create assessment');
    }
    
    return await response.json();
  }
  
  // Ask AI career question
  async askQuestion(question) {
    const response = await fetch(`${this.baseUrl}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: question })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get AI response');
    }
    
    return await response.json();
  }
}

// Example usage:
const careerAssistant = new AICareerAssistant();

// Full career guidance workflow
async function careerGuidanceWorkflow(resumeFile, jobDescription, skillToAssess) {
  try {
    // Step 1: Analyze resume with AI
    const analysisResult = await careerAssistant.analyzeResume(resumeFile);
    console.log("Resume Analysis:", analysisResult);
    
    // Step 2: Generate learning roadmap based on analysis
    const roadmapResult = await careerAssistant.generateRoadmap(analysisResult, jobDescription);
    console.log("Learning Roadmap:", roadmapResult);
    
    // Step 3: Create skill assessment for top skill from roadmap
    const skillToTest = skillToAssess || roadmapResult.learningRoadmap[0]?.skill || "JavaScript";
    const assessmentResult = await careerAssistant.createAssessment(skillToTest, "intermediate", 5);
    console.log("Skill Assessment:", assessmentResult);
    
    // Step 4: Get interview preparation advice from AI
    const questionResult = await careerAssistant.askQuestion(
      `How should I prepare for a ${skillToTest} technical interview? Give me specific tips.`
    );
    console.log("Interview Advice:", questionResult);
    
    return {
      analysis: analysisResult,
      roadmap: roadmapResult,
      assessment: assessmentResult,
      advice: questionResult
    };
  } catch (error) {
    console.error("Career guidance workflow error:", error);
    throw error;
  }
}
```

## 6. Error Handling

Comprehensive error handling for all API interactions:

```javascript
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

async function makeAPIRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new APIError(
        data.error || `API request failed with status ${response.status}`,
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    } else {
      // Network errors, JSON parsing errors, etc.
      throw new APIError(
        `Request failed: ${error.message}`,
        0,
        { originalError: error.message }
      );
    }
  }
}

// Error handling in UI
function displayAPIError(error) {
  if (error instanceof APIError) {
    switch (error.status) {
      case 400:
        // Bad request - show validation error
        showValidationError(error.message);
        break;
      case 401:
      case 403:
        // Authentication/authorization errors
        redirectToLogin();
        break;
      case 404:
        // Not found
        showNotFoundMessage();
        break;
      case 500:
        // Server error
        showServerErrorMessage(error.message);
        break;
      default:
        // Generic or network error
        showGenericErrorMessage(error.message);
    }
  } else {
    // Fallback for other error types
    showGenericErrorMessage(error.message);
  }
  
  // Log all errors (consider logging to a service in production)
  console.error('API Error:', error);
}
```

---

This API documentation provides all the details needed for frontend integration with the backend services. For any additional information or clarification, please refer to the backend code or contact the development team.
