const demoEndpoints = {
  GET_AMOUNT_OF_QUESTION: '',
}

const geminiEndpoints = {
  SEND_MESSAGE: '/ai/answer',
}
const authEndpoints = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
};
const tourGuideEndpoints = {
  GET_TOUR_GUIDES: '/tour-guides',
  GET_TOUR_GUIDE_DETAIL: '/tour-guides/detail',
  CREATE_TOUR: '/tour-guides/tour',
  UPDATE_TOUR_GUIDE_PROFILE: '/tour-guides/profile',
  UPDATE_AVAILABLE_DATES: '/tour-guides/available-dates',
  UPDATE_WORK_DAYS: '/tour-guides/work-days',
  BOOK_TOUR: '',
};
const tourEndpoints = {
  GET_TOURS: '/tours',
}
const reviewEndpoints = {
  GET_REVIEWS: '/reviews',
}
const userEndpoints = {
  GET_PROFILE: '/users/private/me',
  BOOKING: '/bookings',
}
export default {
  demoEndpoints,
  geminiEndpoints,
  authEndpoints,
  tourGuideEndpoints,
  reviewEndpoints,
  tourEndpoints,
  userEndpoints,
}

