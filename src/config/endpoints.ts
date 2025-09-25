const demoEndpoints = {
    GET_AMOUNT_OF_QUESTION: '',
}

const geminiEndpoints = {
    TEXT_GENERATION:
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
}
const authEndpoints = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
};
const tourGuideEndpoints = {
  GET_TOUR_GUIDES: '/tour-guides',
  GET_TOUR_GUIDE_BY_ID: '' ,
  BOOK_TOUR: '',
  GET_BOOKED_TOURS: '' ,
};
export default {
  demoEndpoints,
  geminiEndpoints,
  authEndpoints,
  tourGuideEndpoints,
}

