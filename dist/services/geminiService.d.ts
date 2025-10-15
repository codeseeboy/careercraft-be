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
 * Feature 1: Analyzes resume text.
 */
export declare const analyzeResume: (resumeText: string) => Promise<ResumeAnalysisResult>;
/**
 * Feature 2: Generates a personalized learning roadmap.
 */
export declare const generateLearningRoadmap: (params: LearningRoadmapParams) => Promise<LearningRoadmapResult>;
/**
 * Feature 3: Creates an assessment test.
 */
export declare const createAssessment: (params: AssessmentParams) => Promise<AssessmentResult>;
/**
 * Feature 4: General purpose chatbot.
 */
export declare const generalChat: (userPrompt: string) => Promise<ChatResult>;
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
export declare const analyzeSkinCondition: (params: SkinAnalysisParams) => Promise<SkinAnalysisResult>;
interface SymptomAnalysisParams {
    symptoms: string;
    additionalInfo?: {
        age?: number;
        gender?: string;
        existingConditions?: string[];
        currentMedications?: string[];
    };
    userId?: string;
    timestamp?: string;
}
interface SymptomAnalysisResult {
    extractedSymptoms: Array<{
        name: string;
        severity?: string;
        duration?: string;
    }>;
    possibleConditions: Array<{
        name: string;
        probability: number;
        urgency: string;
        description: string;
    }>;
    specialistRecommendation?: string;
    urgencyLevel: string;
    recommendations: string[];
    followUpQuestions?: string[];
}
/**
 * Feature 6: Analyze symptoms and provide health insights.
 */
export declare const analyzeSymptoms: (params: SymptomAnalysisParams) => Promise<SymptomAnalysisResult>;
export {};
