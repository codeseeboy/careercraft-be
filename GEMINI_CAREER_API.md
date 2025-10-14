# Gemini Career API Integration

This backend now includes Gemini AI-powered career assistance features integrated into your existing Node.js/Express.js application.

## New Features Added

### 1. Resume Analysis
- **Endpoint**: `POST /api/career/analyze-resume`
- **Description**: Analyzes a resume PDF and provides ATS score, feedback, and suggestions
- **Content-Type**: `multipart/form-data`
- **Body**: Resume PDF file (field name: `resume`)
- **Response**:
```json
{
  "score": 75,
  "reason": "Good technical skills but lacks specific industry experience",
  "suggestions": [
    "Add more specific project examples",
    "Include relevant certifications",
    "Highlight quantifiable achievements"
  ]
}
```

### 2. Learning Roadmap Generation
- **Endpoint**: `POST /api/career/generate-roadmap`
- **Description**: Creates a personalized learning roadmap based on resume analysis and job requirements
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "score": 65,
  "reason": "Candidate lacks experience with cloud deployment and advanced database management",
  "jobDescription": "Senior Node.js Engineer. Must have 5+ years experience with Node.js, Express, PostgreSQL, and AWS deployment using CI/CD pipelines.",
  "resumeText": "I am a junior developer with 1 year of experience in Node.js and MongoDB."
}
```
- **Response**:
```json
{
  "learningRoadmap": [
    {
      "skill": "PostgreSQL",
      "reasoning": "Required for senior role database management",
      "resources": {
        "books": ["PostgreSQL: Up and Running", "Learning PostgreSQL"],
        "youtube": [
          {
            "title": "PostgreSQL Tutorial for Beginners",
            "creator": "freeCodeCamp"
          }
        ]
      }
    }
  ]
}
```

### 3. Assessment Creation
- **Endpoint**: `POST /api/career/create-assessment`
- **Description**: Generates skill assessment questions for specific topics
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "topic": "React Hooks",
  "level": "beginner",
  "questionCount": 3
}
```
- **Response**:
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
    }
  ]
}
```

### 4. AI Chatbot
- **Endpoint**: `POST /api/chat/ask`
- **Description**: General purpose AI chat for career-related questions
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "prompt": "Explain the concept of event looping in Node.js in simple terms."
}
```
- **Response**:
```json
{
  "response": "The event loop is Node.js's way of handling multiple operations..."
}
```

## Setup Instructions

### 1. Environment Configuration
Add your Gemini API key to the `.env` file:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 2. Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Replace `YOUR_GEMINI_API_KEY_HERE` in your `.env` file

### 3. File Structure
The integration added these new files:
```
src/
├── controllers/
│   ├── careerController.ts
│   └── chatController.ts
├── middleware/
│   └── uploadMiddleware.ts
├── routes/
│   ├── career.routes.ts
│   └── chat.routes.ts
└── services/
    └── geminiService.ts
```

## Testing the API

### Test Resume Analysis
```bash
curl -X POST http://localhost:5000/api/career/analyze-resume \
-F "resume=@path/to/your/resume.pdf"
```

### Test Learning Roadmap
```bash
curl -X POST http://localhost:3000/api/career/generate-roadmap \
-H "Content-Type: application/json" \
-d '{
    "score": 65,
    "reason": "Candidate lacks experience with cloud deployment",
    "jobDescription": "Senior Developer role requiring AWS and Docker",
    "resumeText": "Junior developer with basic web development skills"
}'
```

### Test Assessment Creation
```bash
curl -X POST http://localhost:3000/api/career/create-assessment \
-H "Content-Type: application/json" \
-d '{
    "topic": "JavaScript ES6",
    "level": "intermediate",
    "questionCount": 5
}'
```

### Test AI Chat
```bash
curl -X POST http://localhost:3000/api/chat/ask \
-H "Content-Type: application/json" \
-d '{
    "prompt": "What are the best practices for Node.js error handling?"
}'
```

## Dependencies Added
- `@google/generative-ai`: Google's Generative AI SDK
- `multer`: File upload middleware
- `pdf-parse`: PDF text extraction
- `@types/multer`: TypeScript types for multer
- `@types/pdf-parse`: TypeScript types for pdf-parse

## Error Handling
All endpoints include proper error handling and return appropriate HTTP status codes:
- `400`: Bad Request (missing required fields)
- `500`: Internal Server Error (API failures, parsing errors)

## Security Considerations
- File uploads are limited to 10MB
- Only PDF files are accepted for resume analysis
- API key is stored securely in environment variables
- Input validation is performed on all endpoints