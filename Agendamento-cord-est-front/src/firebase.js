import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Substitua com as credenciais do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAw5NU0v69UvxUgN5UEMiQGyx-u_fLzZHo",
  authDomain: "sistema-agendamento-5f13b.firebaseapp.com",
  projectId: "sistema-agendamento-5f13b",
  storageBucket: "sistema-agendamento-5f13b.firebasestorage.app",
  messagingSenderId: "935288855374",
  appId: "1:935288855374:web:9920a0a610da6351d9dc1f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };