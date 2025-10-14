import * as geminiService from './geminiService';

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

interface UserProgress {
  courses: Course[];
  assessments: Assessment[];
  badges: Badge[];
}

/**
 * Retrieves user progress from local storage
 */
const getUserProgress = (): UserProgress => {
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
const saveUserProgress = (progress: UserProgress): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userProgress', JSON.stringify(progress));
  }
};

/**
 * Retrieves completed courses
 */
export const getCompletedCourses = (): Course[] => {
  const userProgress = getUserProgress();
  return userProgress.courses.filter(course => course.completed);
};

/**
 * Creates an assessment for a specific course
 */
export const createCourseAssessment = async (courseId: string): Promise<Assessment> => {
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
    
    const assessment: Assessment = {
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
  } catch (error) {
    console.error('Error creating assessment:', error);
    throw error;
  }
};

/**
 * Submits user answers for an assessment
 */
export const submitAssessment = (courseId: string, answers: { [questionIndex: number]: string }): { 
  passed: boolean; 
  score: number; 
  badge?: Badge;
} => {
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
  let badge: Badge | undefined;
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

/**
 * Retrieves all earned badges
 */
export const getUserBadges = (): Badge[] => {
  const userProgress = getUserProgress();
  return userProgress.badges;
};

/**
 * Retrieves assessment history
 */
export const getAssessmentHistory = (): Assessment[] => {
  const userProgress = getUserProgress();
  return userProgress.assessments.filter(a => a.completed);
};

/**
 * Adds a new course to user progress
 */
export const addCourse = (course: Omit<Course, 'completed'>): Course => {
  const userProgress = getUserProgress();
  
  const newCourse: Course = {
    ...course,
    completed: false
  };
  
  userProgress.courses.push(newCourse);
  saveUserProgress(userProgress);
  
  return newCourse;
};

/**
 * Marks a course as completed
 */
export const markCourseCompleted = (courseId: string): Course => {
  const userProgress = getUserProgress();
  const courseIndex = userProgress.courses.findIndex(c => c.id === courseId);
  
  if (courseIndex === -1) {
    throw new Error('Course not found');
  }
  
  userProgress.courses[courseIndex].completed = true;
  saveUserProgress(userProgress);
  
  return userProgress.courses[courseIndex];
};

/**
 * Gets all courses (both completed and in-progress)
 */
export const getAllCourses = (): Course[] => {
  const userProgress = getUserProgress();
  return userProgress.courses;
};
