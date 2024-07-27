import { environment } from 'src/environments/environment';

const API_BASE_URL = environment.apiUrl;

const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  allergic: '/allergic',
  chat: '/chat/hash-info',
  user: '/users',
  text_input: '/text-inputs',
  voice_input: '/voice-inputs',
  prescription: {
    base: '/prescriptions',
    generate_diagnosis: '/generate-diagnosis',
    generate_medicine: '/generate-medicine',
    sickness: '/sicknesses',
  },
  medicine: '/medicines',
  prescription_medicine: '/prescription-medicines',
  ai_record: '/ai-record',
  department: '/departments',
  admin: {
    base: '/admin',
    findSickness: '/findMostSicknessByAgeGroup',
    findUser: '/findUserByAgeGroup',
    getAverage: '/getAverageVisitByAgeGroup',
  },
};

export { API_BASE_URL, API_ENDPOINTS };
