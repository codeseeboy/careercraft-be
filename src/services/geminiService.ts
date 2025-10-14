import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini model with the correct API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Use the currently available model based on API response
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Type definitions
interface ResumeAnalysisResult {
    score: number;
    reason: string;
    suggestions: string[];
}

interface LearningRoadmapParams {
    score: number;
    reason: string;
    jobDescription: string;
    resumeText: string;
}

interface LearningResource {
    books: string[];
    youtube: Array<{
        title: string;
        creator: string;
    }>;
}

interface LearningSkill {
    skill: string;
    reasoning: string;
    resources: LearningResource;
}

interface LearningRoadmapResult {
    learningRoadmap: LearningSkill[];
}

interface AssessmentParams {
    topic: string;
    level?: string;
    questionCount?: number;
}

interface AssessmentQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface AssessmentResult {
    assessment: AssessmentQuestion[];
}

interface ChatResult {
    response: string;
}

/**
 * A helper function to call the Gemini API and parse the JSON response.
 * @param prompt The prompt to send to the AI.
 * @returns The parsed JSON object from the AI's response.
 */
const callGeminiAndParseJson = async (prompt: string): Promise<any> => {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        // Clean the response to ensure it is valid JSON
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error('Gemini API call or JSON parsing failed:', error);
        throw new Error('Failed to get a valid response from the AI model.');
    }
};

/**
 * Feature 1: Analyzes resume text.
 */
export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysisResult> => {
    const prompt = `
        Act as an expert Applicant Tracking System (ATS).
        Analyze the following resume text and provide a score, a concise reason for the score, and actionable suggestions for improvement.
        Your response must be a single, minified JSON object with no extra text or formatting.
        The JSON object must have these exact keys: "score" (a number 0-100), "reason" (a brief string), "suggestions" (an array of strings).

        Resume Text: "${resumeText}"
    `;
    return callGeminiAndParseJson(prompt);
};

/**
 * Feature 2: Generates a personalized learning roadmap.
 */
export const generateLearningRoadmap = async (params: LearningRoadmapParams): Promise<LearningRoadmapResult> => {
    const { score, reason, jobDescription, resumeText } = params;
    const prompt = `
        You are a career development AI coach.
        A user's resume was scored ${score}/100 for the following reason: "${reason}".
        Based on their resume and the target job description below, create a learning roadmap to bridge their skill gaps.
        Your response must be a single, minified JSON object.
        The root key must be "learningRoadmap", which is an array of objects.
        Each object in the array represents a missing skill and must have these keys:
        - "skill": The name of the skill to learn.
        - "reasoning": Why this skill is critical for the target job.
        - "resources": An object with keys "books" (array of strings with book titles) and "youtube" (array of objects, each with "title" and "creator" for specific, searchable video tutorials).
        
        Resume Text: "${resumeText}"
        Job Description: "${jobDescription}"
    `;
    return callGeminiAndParseJson(prompt);
};

/**
 * Feature 3: Creates an assessment test.
 */
export const createAssessment = async (params: AssessmentParams): Promise<AssessmentResult> => {
    const { topic, level = 'intermediate', questionCount = 5 } = params;
    const prompt = `
        You are a quiz generator AI.
        Create an assessment for the topic "${topic}" at a "${level}" difficulty level. It should have exactly ${questionCount} questions.
        Your response must be a single, minified JSON object.
        The root key must be "assessment", which is an array of objects.
        Each object must have these keys: "question" (string), "options" (an array of 4 strings), and "correctAnswer" (the string of the correct option).
    `;
    return callGeminiAndParseJson(prompt);
};

/**
 * Feature 4: General purpose chatbot.
 */
export const generalChat = async (userPrompt: string): Promise<ChatResult> => {
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    return { response: response.text() };
};

interface SkinAnalysisParams {
    imageBase64: string;
    format?: string;
    userId?: string;
    timestamp?: string;
}

interface SkinCondition {
    name: string;
    confidence: number;
    severity: string;
    description?: string;
    recommendations?: string[];
}

interface SkinAnalysisResult {
    conditions: SkinCondition[];
    recommendations: string[];
}

/**
 * Feature 5: Skin condition analysis from image.
 */
export const analyzeSkinCondition = async (params: SkinAnalysisParams): Promise<SkinAnalysisResult> => {
    try {
        const { imageBase64, format } = params;
        
        // Create parts for the Gemini model
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: `image/${format || 'jpeg'}`
            }
        };
        
        const promptPart = {
            text: `
            You are an expert dermatologist AI assistant. Analyze the provided skin image and identify any visible skin conditions.
            Return your analysis as a JSON object with the following structure:
            {
                "conditions": [
                    {
                        "name": "Name of the skin condition",
                        "confidence": 0.95, // A number between 0-1 indicating confidence
                        "severity": "mild/moderate/severe",
                        "description": "Brief description of the condition"
                    },
                    // More conditions if identified
                ],
                "recommendations": [
                    "Recommendation 1",
                    "Recommendation 2",
                    // etc.
                ]
            }
            
            Important guidelines:
            - If no clear skin conditions are visible, provide an empty conditions array
            - Include practical recommendations for skincare
            - Do not diagnose serious medical conditions or provide medical advice
            - Focus on common skin conditions like acne, eczema, dry skin, etc.
            - Be precise and confident in your assessment when possible
            `
        };
        
        // Generate content with both image and prompt parts
        const result = await model.generateContent([imagePart, promptPart]);
        const response = await result.response;
        
        // Parse the response text to extract the JSON
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonData = JSON.parse(text);
        
        return jsonData;
    } catch (error) {
        console.error('Skin analysis failed:', error);
        throw new Error('Failed to analyze skin image');
    }
};