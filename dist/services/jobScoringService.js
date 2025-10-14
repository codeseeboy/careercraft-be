"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCourses = exports.markCourseCompleted = exports.addCourse = exports.getAssessmentHistory = exports.getUserBadges = exports.submitAssessment = exports.createCourseAssessment = exports.getCompletedCourses = void 0;
const geminiService = __importStar(require("./geminiService"));
/**
 * Retrieves user progress from local storage
 */
const getUserProgress = () => {
    if (typeof window !== 'undefined') {
        const storedProgress = localStorage.getItem('userProgress');
        if (storedProgress) {
            return JSON.parse(storedProgress);
        }
    }
    return {
        courses: [],
        assessments: [],
        badges: []
    };
};
/**
 * Saves user progress to local storage
 */
const saveUserProgress = (progress) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('userProgress', JSON.stringify(progress));
    }
};
/**
 * Retrieves completed courses
 */
const getCompletedCourses = () => {
    const userProgress = getUserProgress();
    return userProgress.courses.filter(course => course.completed);
};
exports.getCompletedCourses = getCompletedCourses;
/**
 * Creates an assessment for a specific course
 */
const createCourseAssessment = async (courseId) => {
    const userProgress = getUserProgress();
    const course = userProgress.courses.find(c => c.id === courseId);
    if (!course) {
        throw new Error('Course not found');
    }
    try {
        // Create assessment using the course title and skills
        const topic = course.title + ' with focus on ' + course.skills.join(', ');
        const result = await geminiService.createAssessment({
            topic,
            level: course.level || 'intermediate',
            questionCount: 5
        });
        const assessment = {
            courseId,
            questions: result.assessment.map(q => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
            })),
            completed: false,
            passed: false
        };
        // Save the assessment in progress
        userProgress.assessments.push(assessment);
        saveUserProgress(userProgress);
        return assessment;
    }
    catch (error) {
        console.error('Error creating assessment:', error);
        throw error;
    }
};
exports.createCourseAssessment = createCourseAssessment;
/**
 * Submits user answers for an assessment
 */
const submitAssessment = (courseId, answers) => {
    const userProgress = getUserProgress();
    const assessmentIndex = userProgress.assessments.findIndex(a => a.courseId === courseId && !a.completed);
    if (assessmentIndex === -1) {
        throw new Error('Assessment not found');
    }
    const assessment = userProgress.assessments[assessmentIndex];
    const totalQuestions = assessment.questions.length;
    let correctAnswers = 0;
    // Calculate score
    assessment.questions.forEach((question, index) => {
        const userAnswer = answers[index];
        question.userAnswer = userAnswer;
        if (userAnswer === question.correctAnswer) {
            correctAnswers++;
        }
    });
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 70; // 70% to pass
    // Update assessment
    assessment.completed = true;
    assessment.score = score;
    assessment.passed = passed;
    assessment.timestamp = Date.now();
    userProgress.assessments[assessmentIndex] = assessment;
    // If passed, create and award badge
    let badge;
    if (passed) {
        const course = userProgress.courses.find(c => c.id === courseId);
        if (course) {
            badge = {
                id: `badge-${courseId}-${Date.now()}`,
                title: `${course.title} Expert`,
                description: `Successfully completed assessment for ${course.title}`,
                earnedAt: Date.now(),
                courseId: courseId
            };
            userProgress.badges.push(badge);
        }
    }
    saveUserProgress(userProgress);
    return {
        passed,
        score,
        badge
    };
};
exports.submitAssessment = submitAssessment;
/**
 * Retrieves all earned badges
 */
const getUserBadges = () => {
    const userProgress = getUserProgress();
    return userProgress.badges;
};
exports.getUserBadges = getUserBadges;
/**
 * Retrieves assessment history
 */
const getAssessmentHistory = () => {
    const userProgress = getUserProgress();
    return userProgress.assessments.filter(a => a.completed);
};
exports.getAssessmentHistory = getAssessmentHistory;
/**
 * Adds a new course to user progress
 */
const addCourse = (course) => {
    const userProgress = getUserProgress();
    const newCourse = {
        ...course,
        completed: false
    };
    userProgress.courses.push(newCourse);
    saveUserProgress(userProgress);
    return newCourse;
};
exports.addCourse = addCourse;
/**
 * Marks a course as completed
 */
const markCourseCompleted = (courseId) => {
    const userProgress = getUserProgress();
    const courseIndex = userProgress.courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) {
        throw new Error('Course not found');
    }
    userProgress.courses[courseIndex].completed = true;
    saveUserProgress(userProgress);
    return userProgress.courses[courseIndex];
};
exports.markCourseCompleted = markCourseCompleted;
/**
 * Gets all courses (both completed and in-progress)
 */
const getAllCourses = () => {
    const userProgress = getUserProgress();
    return userProgress.courses;
};
exports.getAllCourses = getAllCourses;
//# sourceMappingURL=jobScoringService.js.map