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

        loadPlantsFromFirestore();
    } else {
        console.log("User signed out");

        if (authButtonContainer) {
            authButtonContainer.innerHTML = `
                <a href="authentication.html" class="btn btn-primary">
                    <i class="bi bi-person-heart"></i> Login / Register
                </a>
            `;
        }

        if (addPropagationBtn) addPropagationBtn.style.display = "none";

        const container = document.getElementById("propagationContainer");
        if (container) container.innerHTML = "";
    }
});

// =======================
// Load user's propagations
// =======================
async function loadPlantsFromFirestore() {
  const user = auth.currentUser;
  if (!user) return;

  const container = document.getElementById("propagationContainer");
  container.innerHTML = "";

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
 
  const collapseId = "collapse-" + (docId || Date.now());
  
  const standardMethods = ["Water","Soil","Air","Other"];
  const isCustomMethod = data.method && !standardMethods.includes(data.method);
  
  const standardHealth = ["Doing well","Needs attention","Growing roots","Other"];
  const customHealthValues = data.health ? data.health.filter(h => !standardHealth.includes(h)) : [];
  const hasCustomHealth = customHealthValues.length > 0;

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
              ${standardMethods.map(method => `
                <div class="form-check">
                  <input class="form-check-input method-radio" type="radio" name="method" value="${method}" 
                    ${data.method === method || (method === "Other" && isCustomMethod) ? "checked" : ""}>
                  <label class="form-check-label">${method}</label>
                </div>
              `).join("")}
              <input type="text" class="form-control mt-2 method-other-input" name="methodOther" 
                value="${isCustomMethod ? data.method : ""}" 
                placeholder="Please specify..." style="display: ${data.method === "Other" || isCustomMethod ? "block" : "none"};">
            </div>
          </div>
        </fieldset>
        <div class="form-group row mb-2">
          <div class="col-sm-3">Health</div>
          <div class="col-sm-9">
            ${standardHealth.map(h => `
              <div class="form-check">
                <input class="form-check-input health-checkbox" type="checkbox" name="health" value="${h}" 
                  ${data.health?.includes(h) || (h === "Other" && hasCustomHealth) ? "checked" : ""}>
                <label class="form-check-label">${h}</label>
              </div>
            `).join("")}
            <input type="text" class="form-control mt-2 health-other-input" name="healthOther" 
              value="${hasCustomHealth ? customHealthValues.join(', ') : ''}"
              placeholder="Please specify..." style="display: ${data.health?.includes("Other") || hasCustomHealth ? "block" : "none"};">
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
            <button type="submit" class="btn btn-primary btn-sm save-btn">
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
  </div>
  `;
  return newPlantCard;
}

// =======================
// Attach Save/Edit/Delete
// =======================
function attachEventListeners(card, docId = null) {
  const form = card.querySelector("form");

  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  const newSaveBtn = card.querySelector(".save-btn");
  const newEditBtn = card.querySelector(".edit-btn");
  const newDeleteBtn = card.querySelector(".delete-btn");

  // Save to Firestore
  newForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    newSaveBtn.disabled = true;
    newSaveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Saving...';
    
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      newSaveBtn.disabled = false;
      newSaveBtn.innerHTML = '<i class="bi bi-save"></i> Save';
      return;
    }

    const formData = new FormData(newForm);
    
    // Handle custom method
    let method = formData.get("method");
    if (method === "Other") {
      method = formData.get("methodOther") || "Other";
    }
    
    // Handle custom health
    let health = formData.getAll("health");
    const customHealth = formData.get("healthOther");
    if (health.includes("Other") || (customHealth && customHealth.trim())) {
      health = health.filter(h => h !== "Other");
      if (customHealth && customHealth.trim()) {
        health.push(customHealth.trim());
      }
    }
    
    const data = {
      plantType: formData.get("plantType"),
      plantName: formData.get("plantName"),
      propagationDate: formData.get("propagationDate"),
      method: method,
      health: health,
      notes: formData.get("notes"),
      updatedAt: new Date().toISOString(),
    };

    try {
      let currentDocId = card.dataset.id;
      
      if (currentDocId && currentDocId !== "") {
        const docRef = doc(db, "users", user.uid, "propagations", currentDocId);
        await updateDoc(docRef, data);
        alert("Propagation updated!");
      } else {
        const docRef = await addDoc(collection(db, "users", user.uid, "propagations"), data);
        card.dataset.id = docRef.id;
        alert("Propagation saved!");
      }
      
      const headerSpan = card.querySelector('.card-header span');
      headerSpan.innerHTML = `<i class="fi fi-rr-hand-holding-seeding"></i> ${data.plantName || "New Propagation"}`;
      
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error saving propagation. Please try again.");
    } finally {
      newSaveBtn.disabled = false;
      newSaveBtn.innerHTML = '<i class="bi bi-save"></i> Save';
    }
  });

  // Toggle Other input fields
  const methodRadios = card.querySelectorAll('.method-radio');
  const methodOtherInput = card.querySelector('.method-other-input');
  methodRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'Other') {
        methodOtherInput.style.display = 'block';
        methodOtherInput.focus();
      } else {
        methodOtherInput.style.display = 'none';
        methodOtherInput.value = '';
      }
    });
  });

  const healthCheckboxes = card.querySelectorAll('.health-checkbox');
  const healthOtherInput = card.querySelector('.health-other-input');
  healthCheckboxes.forEach(checkbox => {
    if (checkbox.value === 'Other') {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          healthOtherInput.style.display = 'block';
          healthOtherInput.focus();
        } else {
          healthOtherInput.style.display = 'none';
          healthOtherInput.value = '';
        }
      });
    }
  });

  // Edit button
  newEditBtn.addEventListener("click", () => {
    const inputs = newForm.querySelectorAll("input, textarea");
    const isEditing = newEditBtn.textContent.trim().includes("Cancel");
    
    inputs.forEach(input => {
      if (isEditing) {
        input.setAttribute("readonly", true);
        input.classList.remove("border-warning");
      } else {
        input.removeAttribute("readonly");
        input.classList.add("border-warning");
      }
    });
    
    newEditBtn.innerHTML = isEditing ? 
      '<i class="bi bi-pencil"></i> Edit' : 
      '<i class="bi bi-x-circle"></i> Cancel Edit';
  });

  // Delete button
  newDeleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete this propagation?")) return;
    
    const user = auth.currentUser;
    if (!user) return;

    const currentDocId = card.dataset.id;
    if (currentDocId && currentDocId !== "") {
      try {
        await deleteDoc(doc(db, "users", user.uid, "propagations", currentDocId));
        alert("Propagation deleted!");
      } catch (err) {
        console.error("Error deleting:", err);
        alert("Error deleting propagation.");
        return;
      }
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
      
      newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const collapse = newCard.querySelector('.collapse');
      if (collapse) {
        collapse.classList.add('show');
      }
      
      attachEventListeners(newCard);
    });
  }
});
