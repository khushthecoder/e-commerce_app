import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Agar aap Android Emulator use kar rahe hain,
// toh 'localhost' ki jagah '10.0.2.2' use karein.
// iOS Simulator par 'localhost' chal jaayega.
// Agar physical device par test kar rahe hain, toh apne computer ka IP address use karein.
const API_BASE_URL = 'http://10.0.2.2:3000/api'; 
// Ya 'http://localhost:3000/api' agar iOS simulator hai

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor: Har request ke saath token bhejne ke liye
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Backend mein iski zarurat padegi (future setup)
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;