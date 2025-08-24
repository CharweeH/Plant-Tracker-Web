// =======================
// Firestore + Firebase Setup
// =======================
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

// =======================
// Auth State Listener
// =======================
onAuthStateChanged(auth, (user) => {
    const authButtonContainer = document.getElementById('authButtonContainer');
    const addPropagationBtn = document.getElementById("addPropagationBtn");
   
    if (user) {
        console.log("User signed in:", user.uid);

        // ✅ Show "Sign Out" button
        authButtonContainer.innerHTML = `
            <button class="btn btn-outline-danger" id="signOutBtn">
                <i class="bi bi-box-arrow-right"></i> Sign Out
            </button>
        `;

        if (addPropagationBtn) addPropagationBtn.style.display = "inline-block";

        document.getElementById('signOutBtn').addEventListener('click', async () => {
            try {
                await signOut(auth);
                console.log("User signed out");
            } catch (error) {
                console.error("Sign-out error:", error);
            }
        });

        // ✅ Load propagations
        loadPlantsFromFirestore();
    } else {
        console.log("User signed out");

        // ✅ Show Login button
        if (authButtonContainer) {
            authButtonContainer.innerHTML = `
                <a href="authentication.html" class="btn btn-primary">
                    <i class="bi bi-person-heart"></i> Login / Register
                </a>
            `;
        }

                // ✅ Hide Add Propagation button
        if (addPropagationBtn) addPropagationBtn.style.display = "none";

        const container = document.getElementById("propagationContainer");
        if (container) container.innerHTML = ""; // clear cards
    }
});

// =======================
// Load user's propagations
// =======================
async function loadPlantsFromFirestore() {
  const user = auth.currentUser;
  if (!user) return;

  const container = document.getElementById("propagationContainer");
  container.innerHTML = ""; // Clear old cards

  const propagationsRef = collection(db, "users", user.uid, "propagations");
  const snapshot = await getDocs(propagationsRef);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const newPlantCard = createPropagationCard(data, docSnap.id);
    container.appendChild(newPlantCard);
    attachEventListeners(newPlantCard, docSnap.id);
  });
}

// =======================
// Build a propagation card
// =======================
function createPropagationCard(data = {}, docId = null) {
  const newPlantCard = document.createElement("div");
  newPlantCard.classList.add("card", "mt-3");
  newPlantCard.dataset.id = docId || "";
 
  // Unique ID for collapse element
  const collapseId = "collapse-" + (docId || Date.now());

  newPlantCard.innerHTML = `
  <div class="card-header d-flex justify-content-between align-items-center" 
        data-bs-toggle="collapse" data-bs-target="#${collapseId}" 
        aria-expanded="false" style="cursor:pointer;">
    <span><i class="fi fi-rr-hand-holding-seeding"></i> ${data.plantName || "New Propagation"}</span>
    <i class="bi bi-chevron-down"></i>
  </div>
  
  <div id="${collapseId}" class="collapse">
    <div class="card-body">
      <form>
        <div class="form-group row mb-2">
          <label class="col-sm-3 col-form-label">Plant Type</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" name="plantType" value="${data.plantType || ""}" placeholder="Plant Type">
          </div>
        </div>
        <div class="form-group row mb-2">
          <label class="col-sm-3 col-form-label">Plant Name</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" name="plantName" value="${data.plantName || ""}" placeholder="Plant Name">
          </div>
        </div>
        <div class="form-group row mb-2">
          <label class="col-sm-3 col-form-label">Propagation Date</label>
          <div class="col-sm-9">
            <input type="date" class="form-control" name="propagationDate" value="${data.propagationDate || ""}">
          </div>
        </div>
        <fieldset class="form-group mb-2">
          <div class="row">
            <legend class="col-form-label col-sm-3 pt-0">Method</legend>
            <div class="col-sm-9">
              ${["water","soil","air","other"].map(method => `
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="method" value="${method}" 
                    ${data.method === method ? "checked" : ""}>
                  <label class="form-check-label">${method}</label>
                </div>
              `).join("")}
            </div>
          </div>
        </fieldset>
        <div class="form-group row mb-2">
          <div class="col-sm-3">Health</div>
          <div class="col-sm-9">
            ${["Doing well","Needs attention","Growing roots","Other"].map(h => `
              <div class="form-check">
                <input class="form-check-input" type="checkbox" name="health" value="${h}" 
                  ${data.health?.includes(h) ? "checked" : ""}>
                <label class="form-check-label">${h}</label>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="form-group row mb-2">
          <label class="col-sm-3 col-form-label">Notes</label>
          <div class="col-sm-9">
            <textarea class="form-control" rows="3" name="notes">${data.notes || ""}</textarea>
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
  return newPlantCard;
}

// =======================
// Attach Save/Edit/Delete
// =======================
function attachEventListeners(card, docId = null) {
  const form = card.querySelector("form");
  const editBtn = card.querySelector(".edit-btn");
  const deleteBtn = card.querySelector(".delete-btn");

  // Save to Firestore
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    const formData = new FormData(form);
    const data = {
      plantType: formData.get("plantType"),
      plantName: formData.get("plantName"),
      propagationDate: formData.get("propagationDate"),
      method: formData.get("method"),
      health: formData.getAll("health"),
      notes: formData.get("notes"),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (docId) {
        // Update existing
        const docRef = doc(db, "users", user.uid, "propagations", docId);
        await updateDoc(docRef, data);
        alert("Propagation updated!");
      } else {
        // New entry
        const docRef = await addDoc(collection(db, "users", user.uid, "propagations"), data);
        card.dataset.id = docRef.id;
        alert("Propagation saved!");
      }
    } catch (err) {
      console.error("Error saving:", err);
    }
  });

  // Edit button
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
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete this propagation?")) return;
    const user = auth.currentUser;
    if (!user) return;

    if (docId) {
      await deleteDoc(doc(db, "users", user.uid, "propagations", docId));
    }
    card.remove();
  });
}

// =======================
// Add New Propagation
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const addPropagationBtn = document.getElementById("addPropagationBtn");
  if (addPropagationBtn) {
    addPropagationBtn.addEventListener("click", () => {
      const container = document.getElementById("propagationContainer");
      const newCard = createPropagationCard();
      container.appendChild(newCard);
      attachEventListeners(newCard);
    });
  }
});
