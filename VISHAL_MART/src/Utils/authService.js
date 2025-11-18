import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
const API_URL = 'http://localhost:3000/api/users';
const saveToken = async (token) => {
  await AsyncStorage.setItem('userToken', token);
};
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data.token) {
    await saveToken(response.data.token);
  }
  return response.data;
};
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  if (response.data.token) {
    await saveToken(response.data.token);
  }
  return response.data;
};
export const logout = async () => {
  await AsyncStorage.removeItem('userToken');
};
export const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};