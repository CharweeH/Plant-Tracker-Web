import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIujG1gUO5qvKVfkRS6T-cKiOqjdV66v4",
  authDomain: "plant-tracker-web-app.firebaseapp.com",
  projectId: "plant-tracker-web-app",
  storageBucket: "plant-tracker-web-app.firebasestorage.app",
  messagingSenderId: "329956447825",
  appId: "1:329956447825:web:87243bf5d32b46ae59ca70",
  measurementId: "G-C2WDWKXK5M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Sign-in
async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google signed in:", user.displayName, user.email);
  } catch (error) {
    console.error("Google sign-in error:", error);
    alert("Failed to sign in with Google: " + error.message);
  }
}

// Email/Password Sign-up
async function signUpWithEmail(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Signed up:", userCredential.user.email);
  } catch (error) {
    console.error("Sign-up error:", error);
    alert("Sign-up failed: " + error.message);
  }
}

// Email/Password Log-in
async function logInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in:", userCredential.user.email);
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed: " + error.message);
  }
}

// Sign out
async function signOutUser() {
  await signOut(auth);
  console.log("User signed out");
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  const status = document.getElementById("authStatus");
  const authButtonContainer = document.getElementById('authButtonContainer');

  if (user) {
    console.log("User signed in:", user.uid);
    window.location.href = 'index.html';
    // Hide Google sign in button (if exists)
    if (document.getElementById("btnSignInGoogle")) {
      document.getElementById("btnSignInGoogle").style.display = "none";
    }

    // Inject sign out button dynamically
    if (authButtonContainer) {
      authButtonContainer.innerHTML = `
        <button class="btn btn-outline-danger" id="signOutBtn">
          <i class="bi bi-box-arrow-right"></i> Sign Out
        </button>
      `;

      document.getElementById('signOutBtn').addEventListener('click', async () => {
        try {
          await signOut(auth);
          console.log("User signed out");
        } catch (error) {
          console.error("Sign-out error:", error);
        }
      });
    }

    // Hide login/signup forms
    if (document.getElementById("emailLoginForm")) {
      document.getElementById("emailLoginForm").style.display = "none";
    }
    if (document.getElementById("emailSignUpForm")) {
      document.getElementById("emailSignUpForm").style.display = "none";
    }

  } else {
    console.log("User signed out");

    if (authButtonContainer) {
      authButtonContainer.innerHTML = `
        <a href="authentication.html" class="btn btn-primary">
          <i class="bi bi-person-heart"></i> Login / Register
        </a>
      `;
    }

    // Show Google sign-in button if it exists
    if (document.getElementById("btnSignInGoogle")) {
      document.getElementById("btnSignInGoogle").style.display = "inline-block";
    }

    showLogin();
  }
});

function showSignUp() {
  document.getElementById("emailLoginForm").style.display = "none";
  document.getElementById("emailSignUpForm").style.display = "block";
}

function showLogin() {
  document.getElementById("emailLoginForm").style.display = "block";
  document.getElementById("emailSignUpForm").style.display = "none";
}

// Expose functions for buttons and forms
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
window.signUpWithEmail = () => {
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;
  signUpWithEmail(email, password);
};
window.logInWithEmail = () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  logInWithEmail(email, password);
};
window.showSignUp = showSignUp;
window.showLogin = showLogin;