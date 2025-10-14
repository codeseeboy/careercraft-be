interface Course {
    id: string;
    title: string;
    skills: string[];
    completed: boolean;
    level: 'beginner' | 'intermediate' | 'advanced';
}
interface Assessment {
    courseId: string;
    questions: {
        question: string;
        options: string[];
        correctAnswer: string;
        userAnswer?: string;
    }[];
    completed: boolean;
    score?: number;
    passed: boolean;
    timestamp?: number;
}
interface Badge {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    earnedAt: number;
    courseId: string;
}
/**
 * Retrieves completed courses
 */
export declare const getCompletedCourses: () => Course[];
/**
 * Creates an assessment for a specific course
 */
export declare const createCourseAssessment: (courseId: string) => Promise<Assessment>;
/**
 * Submits user answers for an assessment
 */
export declare const submitAssessment: (courseId: string, answers: {
    [questionIndex: number]: string;
}) => {
    passed: boolean;
    score: number;
    badge?: Badge;
};
/**
 * Retrieves all earned badges
 */
export declare const getUserBadges: () => Badge[];
/**
 * Retrieves assessment history
 */
export declare const getAssessmentHistory: () => Assessment[];
/**
 * Adds a new course to user progress
 */
export declare const addCourse: (course: Omit<Course, "completed">) => Course;
/**
 * Marks a course as completed
 */
export declare const markCourseCompleted: (courseId: string) => Course;
/**
 * Gets all courses (both completed and in-progress)
 */
export declare const getAllCourses: () => Course[];
export {};
