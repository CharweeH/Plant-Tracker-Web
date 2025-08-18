// Firestore + Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
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
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

const myPropagations = [];
const authButtonContainer = document.getElementById('authButtonContainer');

// =======================
// your log in has entirely disappeared from this page
// =======================
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user.uid);

    authButtonContainer.innerHTML = `
      <button class="btn btn-outline-danger" id="signOutBtn">
        <i class="bi bi-box-arrow-right"></i> Sign Out
      </button>
    `;
    document.getElementById('signOutBtn').addEventListener('click', async () => {
      try {
        await signOut(auth);
        console.log("User signed out");
      } catch (err) {
        console.error("Sign-out error:", err);
      }
    });

    loadPropagations();
  } else {
    console.log("User signed out");
    authButtonContainer.innerHTML = `
      <a href="authentication.html" class="btn btn-primary">
        <i class="bi bi-person-heart"></i> Login / Register
      </a>
    `;

    myPropagations.length = 0;
    showPropagations();
  }


// this doesn't have firebase yet just the js 

// propagation.js
document.addEventListener("DOMContentLoaded", () => {
  const addPropagationBtn = document.getElementById("addPropagationBtn");

  // Add Plant
  addPropagationBtn.addEventListener("click", () => {
    const container = document.querySelector(".card-body");

    // button for new card doesn't work

    // Template for a new plant card
    const newPlantCard = document.createElement("div");
    newPlantCard.classList.add("card", "mt-3");
    newPlantCard.innerHTML = `
      <div class="card-header">
        <i class="fi fi-rr-hand-holding-seeding"></i> New Propagation
      </div>
      <div class="card-body">
        <form>
          <div class="form-group row mb-2">
            <label class="col-sm-3 col-form-label">Plant Type</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" placeholder="Plant Type">
            </div>
          </div>
          <div class="form-group row mb-2">
            <label class="col-sm-3 col-form-label">Plant Name</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" placeholder="Plant Name">
            </div>
          </div>
          <div class="form-group row mb-2">
            <label class="col-sm-3 col-form-label">Propagation Date</label>
            <div class="col-sm-9">
              <input type="date" class="form-control">
            </div>
          </div>
          <fieldset class="form-group mb-2">
            <div class="row">
              <legend class="col-form-label col-sm-3 pt-0">Method</legend>
              <div class="col-sm-9">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="method" value="water" checked>
                  <label class="form-check-label">Water</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="method" value="soil">
                  <label class="form-check-label">Soil</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="method" value="air">
                  <label class="form-check-label">Air</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="method" value="other">
                  <label class="form-check-label">Other</label>
                </div>
              </div>
            </div>
          </fieldset>
          <div class="form-group row mb-2">
            <div class="col-sm-3">Health</div>
            <div class="col-sm-9">
              <div class="form-check">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label">Doing well</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label">Needs attention</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label">Growing roots</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label">Other</label>
              </div>
            </div>
          </div>
          <div class="form-group row mb-2">
            <label class="col-sm-3 col-form-label">Notes</label>
            <div class="col-sm-9">
              <textarea class="form-control" rows="3" placeholder="Add any notes about the plant"></textarea>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-9 offset-sm-3 d-flex gap-2">
              <button type="submit" class="btn btn-primary btn-sm">
                <i class="bi bi-save"></i> Save
              </button>
              <button type="button" class="btn btn-warning btn-sm edit-btn">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button type="button" class="btn btn-danger btn-sm delete-btn">
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    `;

    container.appendChild(newPlantCard);
    attachEventListeners(newPlantCard);
  });

  // Attach events to Edit + Delete buttons
  function attachEventListeners(card) {
    const form = card.querySelector("form");
    const editBtn = card.querySelector(".edit-btn");
    const deleteBtn = card.querySelector(".delete-btn");

    // Save button (just prevents page reload for now)
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Plant saved!");
    });

    // Edit button → toggle readonly
    editBtn.addEventListener("click", () => {
      const inputs = form.querySelectorAll("input, textarea");
      inputs.forEach(input => {
        if (input.hasAttribute("readonly")) {
          input.removeAttribute("readonly");
          input.classList.add("border-warning");
        } else {
          input.setAttribute("readonly", true);
          input.classList.remove("border-warning");
        }
      });
    });

    // Delete button
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this plant?")) {
        card.remove();
      }
    });
  }

  // Attach listeners to any existing plant cards already in the HTML
  document.querySelectorAll(".card").forEach(card => {
    if (card.querySelector("form")) {
      attachEventListeners(card);
    }
  });
});


