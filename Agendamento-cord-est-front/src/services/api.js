import axios from 'axios';
import { auth } from '../firebase'; // Importa o arquivo que criamos acima

const api = axios.create({
  // Se o seu FastAPI roda em outra porta, mude o número 8000 abaixo
  baseURL: 'http://localhost:8000', 
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;