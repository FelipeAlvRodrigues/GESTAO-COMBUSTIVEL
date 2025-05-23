import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // 🔥 Alterar caso esteja usando Localtunnel
});

export default api;
