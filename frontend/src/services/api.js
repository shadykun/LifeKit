import { API_BASE_URL } from '../config';

const request = async (method, endpoint, body) => {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}${detail ? `: ${detail}` : ''}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API] ${method} ${url} failed`, error);
    throw error;
  }
};

export const ApiService = {
  getCourses: () => request('GET', '/courses/'),
  getQuizzes: () => request('GET', '/quizzes/'),
  getQuestions: () => request('GET', '/questions/'),
  getFlashcards: () => request('GET', '/flashcards/'),
  getTexts: () => request('GET', '/texts/'),
  getImages: () => request('GET', '/images/'),
  getVideos: () => request('GET', '/videos/'),

  // `endpoint` is a collection path such as '/courses/' (see constants/adminSchemas).
  create: (endpoint, payload) => request('POST', endpoint, payload),
  deleteCourse: (id) => request('DELETE', `/courses/${id}`),

  getNearbyFirstAidCenters: ({ latitude, longitude, radius }) =>
    request(
      'GET',
      `/nearby/first-aid-centers?lat=${latitude}&lon=${longitude}&radius=${radius}`
    ),
};
