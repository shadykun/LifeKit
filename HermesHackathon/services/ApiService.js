import { Platform } from 'react-native';


const BASE_URL = `http://ec2-63-178-67-11.eu-central-1.compute.amazonaws.com:8000`; 

const get = async (endpoint) => {
  // Asigură-te că nu ai dublu slash //
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const fullUrl = `${BASE_URL}/${cleanEndpoint}`;
  
  console.log(`[API Request] Încerc să accesez: ${fullUrl}`);
  
  try {
    // Adăugăm un timeout de 5 secunde ca să nu aștepți la infinit
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(fullUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[API Fail] ${fullUrl} | Eroare:`, error.message);
    throw error;
  }
};

export const ApiService = {
  getCourses: () => get('courses/'), 
  getCourseById: (id) => get(`courses/${id}`),
  getAccounts: () => get('accounts/'),
  
  getQuizzes: () => get('quizzes/'),
  getFlashcards: () => get('flashcards/'),

  getTexts: () => get('texts/'),
  getTextById: (id) => get(`texts/${id}`),

  getImages: () => get('images/'),
  getImageById: (id) => get(`images/${id}`),

  getVideos: () => get('videos/'),
  getVideoById: (id) => get(`videos/${id}`),
};