// Describes the "add content" forms of the admin panel: one entry per resource,
// with the collection endpoint it posts to and the fields of its form.
export const ADMIN_SCHEMAS = {
  course: {
    label: 'Cursuri (Courses)',
    endpoint: '/courses/',
    fields: [
      { name: 'title', label: 'Titlu Curs', placeholder: 'Ex: Primul ajutor hemoragii' },
      { name: 'description', label: 'Descriere', placeholder: 'Proceduri esențiale...', multiline: true },
      { name: 'parenting', label: 'Este modul de Parenting?', type: 'boolean', initialValue: false },
    ],
  },
  quiz: {
    label: 'Quiz-uri',
    endpoint: '/quizzes/',
    fields: [
      { name: 'course_id', label: 'ID Curs', placeholder: 'Ex: 49', keyboardType: 'numeric' },
      { name: 'title', label: 'Titlu Test', placeholder: 'Ex: Verificare rapidă' },
    ],
  },
  question: {
    label: 'Întrebări (Questions)',
    endpoint: '/questions/',
    fields: [
      { name: 'quiz_id', label: 'ID Quiz', placeholder: 'Ex: 16', keyboardType: 'numeric' },
      { name: 'question_text', label: 'Enunț Întrebare', placeholder: 'Care este prima acțiune...?', multiline: true },
      { name: 'answer1_text', label: 'Varianta 1', placeholder: 'Răspuns A' },
      { name: 'answer2_text', label: 'Varianta 2', placeholder: 'Răspuns B' },
      { name: 'answer3_text', label: 'Varianta 3', placeholder: 'Răspuns C' },
      { name: 'correct_answer', label: 'Index Corect (1-3)', placeholder: '1', keyboardType: 'numeric' },
      { name: 'answer_text', label: 'Explicație / Feedback', placeholder: 'Explicatie...', multiline: true },
    ],
  },
  flashcard: {
    label: 'Flashcards',
    endpoint: '/flashcards/',
    fields: [
      { name: 'course_id', label: 'ID Curs', placeholder: 'Ex: 49', keyboardType: 'numeric' },
      { name: 'front_text', label: 'Față', placeholder: 'Întrebare...' },
      { name: 'back_text', label: 'Spate', placeholder: 'Răspuns...', multiline: true },
    ],
  },
  text: {
    label: 'Texte / Lecții',
    endpoint: '/texts/',
    fields: [
      { name: 'course_id', label: 'ID Curs', placeholder: 'Ex: 49', keyboardType: 'numeric' },
      { name: 'body_content', label: 'Conținut Lecție', placeholder: 'Text...', multiline: true },
    ],
  },
  image: {
    label: 'Imagini',
    endpoint: '/images/',
    fields: [
      { name: 'course_id', label: 'ID Curs', placeholder: 'Ex: 49', keyboardType: 'numeric' },
      { name: 'url', label: 'URL Imagine', placeholder: 'https://...' },
      { name: 'alt_text', label: 'Descriere', placeholder: 'Descriere...' },
      { name: 'text_id', label: 'ID Text (Opțional)', placeholder: 'Ex: 49', keyboardType: 'numeric' },
    ],
  },
  video: {
    label: 'Video',
    endpoint: '/videos/',
    fields: [
      { name: 'course_id', label: 'ID Curs', placeholder: 'Ex: 49', keyboardType: 'numeric' },
      { name: 'url', label: 'URL Video', placeholder: 'https://...' },
      { name: 'duration', label: 'Durată (sec)', placeholder: '480', keyboardType: 'numeric' },
    ],
  },
};
