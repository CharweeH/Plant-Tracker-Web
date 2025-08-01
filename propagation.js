import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


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
const db = getFirestore(app);
const auth = getAuth(app);
const authButtonContainer = document.getElementById('authButtonContainer');

onAuthStateChanged(auth, (user) => {
    const authButtonContainer = document.getElementById('authButtonContainer');

    if (user) {
        console.log("User signed in:", user.uid);

        // ✅ Update button to "Sign Out"
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
    } else {
        console.log("User signed out");

        // ✅ Update button to "Login / Register"
        if (authButtonContainer) {
            authButtonContainer.innerHTML = `
                <a href="authentication.html" class="btn btn-primary">
                    <i class="bi bi-person-heart"></i> Login / Register
                </a>
            `;
        }
    }
});