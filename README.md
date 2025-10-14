# AI-Powered Career Assistant Backend

This is the backend service for the AI-powered career assistant application. It provides various APIs for career guidance, resume analysis, job matching, and skin analysis using advanced AI models.

## Features

- Resume Analysis and ATS Scoring
- Career Path Recommendations
- Job Matching and Skills Analysis
- Chat-based Career Guidance
- Skin Analysis with Gemini AI
- File Upload and Management

## Tech Stack

- Node.js with Express
- TypeScript
- Gemini AI Integration
- File Upload with Multer
- CORS enabled
- RESTful API Architecture

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm start
   ```

The server will start on port 5000 by default.

## API Documentation

Detailed API documentation can be found in the following files:
- API_DOCUMENTATION.md
- GEMINI_CAREER_API.md
- JOB_LISTINGS_SETUP.md

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/       # Business logic
├── routes/         # API routes
├── middleware/     # Custom middleware
└── index.ts        # App entry point
```

## Environment Variables

Create a `.env` file with the following variables:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
```

## License

MIT
