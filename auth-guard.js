import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./firebase-init.js";

// Hide document immediately to avoid flash of protected content
document.documentElement.style.display = 'none';

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isLoginPage = path.endsWith('login.html');
  const isHomePage = path.endsWith('home.html') || path.endsWith('index.html') || path === '' || path.endsWith('/');

  if (user) {
    if (isLoginPage) {
      window.location.href = 'Dashboard.html';
    } else {
      document.documentElement.style.display = '';
    }
  } else {
    if (!isLoginPage && !isHomePage) {
      window.location.href = 'login.html';
    } else {
      document.documentElement.style.display = '';
    }
  }
});
