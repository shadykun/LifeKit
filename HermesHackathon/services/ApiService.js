import { Platform } from 'react-native';


const BASE_URL = `http://ec2-63-178-67-11.eu-central-1.compute.amazonaws.com:8000`; 

const get = async (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const fullUrl = `${BASE_URL}/${cleanEndpoint}`;
  console.log(`[API Request] GET ${fullUrl}`);
  
  try {
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`[API Fail] ${fullUrl}`, error);
    throw error;
  }
};

export const ApiService = {
  // 1. Courses (Modulele principale)
  getCourses: () => get('courses'), 
  getCourseById: (id) => get(`courses/${id}`),

  // 2. Chapters (Capitole)
  getChapters: () => get('chapters'),
  getChapterById: (id) => get(`chapters/${id}`),

  // 3. Quizzes (Containerele de teste)
  getQuizzes: () => get('quizzes'),
  getQuizById: (id) => get(`quizzes/${id}`),

  // 4. Questions (Întrebările efective din teste)
  getQuestions: () => get('questions'),
  getQuestionById: (id) => get(`questions/${id}`),

  // 5. Flashcards (Cartonașe de memorie)
  getFlashcards: () => get('flashcards'),
  getFlashcardById: (id) => get(`flashcards/${id}`),

  // 6. Multimedia - Texts (Pentru Scenarii)
  getTexts: () => get('texts'),
  getTextById: (id) => get(`texts/${id}`),

  // 7. Multimedia - Images (Pentru Scenarii)
  getImages: () => get('images'),
  getImageById: (id) => get(`images/${id}`),

  // 8. Multimedia - Videos (Pentru Scenarii Kids)
  getVideos: () => get('videos'),
  getVideoById: (id) => get(`videos/${id}`),
};