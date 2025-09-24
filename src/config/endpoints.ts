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

export default {
  demoEndpoints,
  geminiEndpoints,
  authEndpoints
}

