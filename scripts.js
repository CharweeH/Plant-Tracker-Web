// Firestore Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


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

async function fetchPlantsFromFirestore() {
  const querySnapshot = await getDocs(collection(db, 'plants'));
  // Return an array of objects like { name, imageUrl }
  return querySnapshot.docs
    .map(doc => {
      const data = doc.data();
      return {
        name: data.name,
        imageUrl: data.imageUrl || '', // make sure you have this field in Firestore
      };
    })
    .filter(plant => typeof plant.name === 'string' && plant.name.trim() !== '');
}

const myPlants = [];

onAuthStateChanged(auth, (user) => {
    const authButtonContainer = document.getElementById('authButtonContainer');
    const plantDirectoryNav = document.getElementById("plantDirectoryNav");
    const propagatingNav = document.getElementById("propagatingNav");

    if (user) {
        console.log("User signed in:", user.uid);

        // Show navbar items
        if (propagatingNav) propagatingNav.classList.remove("d-none");

        // Show Sign Out button
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

        // Load plants
        loadPlantsFromFirestore();

    } else {
        console.log("User signed out");

        // Hide navbar items
        if (propagatingNav) propagatingNav.classList.add("d-none");

        // Show Login/Register button
        if (authButtonContainer) {
            authButtonContainer.innerHTML = `
                <a href="authentication.html" class="btn btn-primary">
                    <i class="bi bi-person-heart"></i> Login / Register
                </a>
            `;
        }

        myPlants.length = 0;
        showPlants();
    }
});

// Escape HTML to avoid XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show suggestions under input
async function showSuggestions() {
  const existingPlants = await fetchPlantsFromFirestore(); // array of {name, imageUrl}
  const inputElem = document.getElementById('plantName');
  const suggestionBox = document.getElementById('suggestions');
  const query = inputElem.value.toLowerCase();

  const filteredPlants = existingPlants.filter(plant => 
    plant.name.toLowerCase().includes(query)
  );

  suggestionBox.innerHTML = '';

  if (!query || filteredPlants.length === 0) {
    suggestionBox.style.display = 'none';
    return;
  }

  suggestionBox.style.display = 'block';

  filteredPlants.forEach(plant => {
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('suggestion-item');
    suggestionItem.textContent = plant.name;
    suggestionItem.onclick = () => selectSuggestion(plant);
    suggestionBox.appendChild(suggestionItem);
  });
}

// Select a suggestion to input field
let selectedPlant = null;

function selectSuggestion(plant) {
  selectedPlant = plant; // Save selected plant object with imageUrl
  document.getElementById('plantName').value = plant.name;
  const suggestionBox = document.getElementById('suggestions');
  suggestionBox.innerHTML = '';
  suggestionBox.style.display = 'none';
}

// Load plants from Firestore to local array, then show
async function loadPlantsFromFirestore() {
    const user = auth.currentUser;
    if (!user) return;

    myPlants.length = 0;
    const querySnapshot = await getDocs(collection(db, "users", user.uid, "plants"));
    querySnapshot.forEach(docSnap => {
        const plant = docSnap.data();
        plant.id = docSnap.id;
        myPlants.push(plant);
    });
    showPlants();
}

// Notifications here maybe?

function addNotification(message) {
    const list = document.getElementById('notificationList');
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.textContent = message;
    list.prepend(item);
}

// Example usage
// addNotification("Don't forget to water your Fern!");


// Add a new plant, save to Firestore, update local & UI
async function addPlant() {
  const plantName = document.getElementById('plantName').value.trim();
  const user = auth.currentUser;
  if (!user) return await showAlert('You must be signed in.');

  if (!plantName) {
    await showAlert('Please enter a plant name!');
    return;
  }

  // Fetch existing plants from Firestore for validation
  const existingPlantsData = await fetchPlantsFromFirestore();
  const existingPlantNames = existingPlantsData.map(p => p.name.toLowerCase());

  if (!existingPlantNames.includes(plantName.toLowerCase())) {
    await showAlert('This plant is not in our suggestions, but will be added manually!');
    // You don't need to push here because existingPlantsData is local inside this function
  }


  // Use selectedPlant object if it matches the input
  let imageUrl = '';
  if (selectedPlant && selectedPlant.name.toLowerCase() === plantName.toLowerCase()) {
    imageUrl = selectedPlant.imageUrl || '';
  }

  // If you want, you can still handle manual additions here (when no image available)

  const newPlant = {
    name: plantName,
    lastWatered: 'Never',
    dateAdded: new Date().toLocaleDateString(),
    notes: '',
    imageUrl: imageUrl // add this new field
  };

  try {
    const docRef = await addDoc(collection(db, "users", user.uid, "plants"), newPlant);
    newPlant.id = docRef.id;
    myPlants.push(newPlant);
    selectedPlant = null; // reset selection
    document.getElementById('plantName').value = '';
    showPlants();
  } catch (e) {
    console.error('Error adding plant:', e);
    await showAlert('Failed to add plant. Please try again.');
  }
}


// Update lastWatered date in Firestore & local
async function waterPlant(index) {
    const plant = myPlants[index];
    const newDate = new Date().toLocaleDateString();

    try {
        const user = auth.currentUser;
        const docRef = doc(db, "users", user.uid, "plants", plant.id);
        await updateDoc(docRef, { lastWatered: newDate });
        plant.lastWatered = newDate;
        showPlants();
    } catch (e) {
        console.error('Error updating plant:', e);
        await showAlert('Failed to update watering date.');
    }
}

// Delete plant from Firestore & local, update UI
async function deletePlant(index) {
    const confirmed = await showConfirm(`Are you sure you want to delete "${myPlants[index].name}"?`);
    if (!confirmed) return;

    try {
        const plant = myPlants[index];
        const user = auth.currentUser;
const docRef = doc(db, "users", user.uid, "plants", plant.id);
        await deleteDoc(docRef);
        myPlants.splice(index, 1);
        showPlants();
    } catch (e) {
        console.error('Error deleting plant:', e);
        await showAlert('Failed to delete plant.');
    }
}

// Edit plant name, update Firestore & local array
async function editPlant(index) {
    const plant = myPlants[index];
    const newName = await showPrompt('Enter new plant name:', plant.name);

    if (!newName || newName.trim() === '') return;

    const trimmedName = newName.trim();

    // Avoid duplicates
   // if (myPlants.some((p, i) => i !== index && p.name.toLowerCase() === trimmedName.toLowerCase())) {
       // alert('Another plant with this name already exists!');
       // return;
    //}

    try {
        const user = auth.currentUser;
        const docRef = doc(db, "users", user.uid, "plants", plant.id);
       await updateDoc(docRef, { name: trimmedName });
       plant.name = trimmedName;
       showPlants();
    } catch (e) {
        console.error('Error editing plant:', e);
        await showAlert('Failed to edit plant name.');
    }
}

async function notesPlant(index) {
    const plant = myPlants[index];
    const currentNotes = plant.notes || '';
    const newNotes = await showNotes(`Enter notes for ${plant.name}:`, currentNotes);

    if (newNotes === null) {
        console.log('Note edit cancelled');
        return;
    }

    const trimmedNotes = newNotes.trim();

    if (trimmedNotes === currentNotes.trim()) {
        console.log('Notes unchanged, skipping update');
        return;
    }

    try {
        const user = auth.currentUser;
        const docRef = doc(db, "users", user.uid, "plants", plant.id);
        console.log('Saving notes for plant ID:', plant.id, 'Notes:', trimmedNotes);
        await updateDoc(docRef, { notes: trimmedNotes });
        plant.notes = trimmedNotes;
        showPlants();
        console.log('Notes updated successfully');
    } catch (e) {
        console.error('Error updating notes:', e);
        await showAlert('Failed to update notes.');
    }
}

// Render plants list on page
function showPlants() {
  const plantList = document.getElementById('plantList');

  if (myPlants.length === 0) {
    plantList.innerHTML = `
      <div class="empty-message">
          No plants yet! Add your first plant above.
      </div>
    `;
    return;
  }

  let html = '';
  myPlants.forEach((plant, index) => {
    const wateredToday = plant.lastWatered === new Date().toLocaleDateString();
    html += `
      <div class="plant">
        ${plant.imageUrl ? `<img src="${plant.imageUrl}" alt="${escapeHtml(plant.name)}" class="plant-image">` : ''}
        <div class="plant-info">
          <div class="plant-name">${escapeHtml(plant.name)}</div>
          <div class="last-watered">Last watered: ${escapeHtml(plant.lastWatered)}${wateredToday ? ' 💧 (Today)' : ''}</div>
          ${plant.notes ? `<div class="notes">Notes: ${escapeHtml(plant.notes)}</div>` : ''}
        </div>
        <div class="plant-actions">
          <button onclick="waterPlant(${index})"><i class="fi fi-sr-watering-can-plant"></i> Water</button>
          <button onclick="notesPlant(${index})"><i class="bi bi-book-fill"></i> Notes</button>
          <button onclick="editPlant(${index})"><i class="bi bi-pencil-fill"></i> Edit</button>
          <button onclick="deletePlant(${index})"><i class="bi bi-trash-fill"></i> Delete</button>
        </div>
      </div>
    `;
  });
  plantList.innerHTML = html;
}

// Event Listeners after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadPlantsFromFirestore();

    document.getElementById('plantName').addEventListener('input', showSuggestions);
    document.getElementById('plantName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addPlant();
        }
    });

    // Hide suggestions when clicking outside input or suggestions
    document.addEventListener('click', (event) => {
        const input = document.getElementById('plantName');
        const suggestions = document.getElementById('suggestions');
        if (!input.contains(event.target) && !suggestions.contains(event.target)) {
            suggestions.style.display = 'none';
        }
    });
});

function showAlert(message) {
    return new Promise((resolve) => {
        document.getElementById('alertModalMessage').textContent = message;

        const modal = new bootstrap.Modal(document.getElementById('alertModal'));
        modal.show();

        const button = document.querySelector('#alertModal .btn-primary');
        const handler = () => {
            button.removeEventListener('click', handler);
            resolve();
        };

        button.addEventListener('click', handler);
    });
}

let confirmResolve;

function showConfirm(message) {
    return new Promise((resolve) => {
        document.getElementById('confirmModalMessage').textContent = message;
        confirmResolve = resolve;

        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();
    });
}

function resolveConfirm(choice) {
    confirmResolve?.(choice);
    confirmResolve = null;

    // Close modal
    const modalEl = document.getElementById('confirmModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}

let promptResolve;

function showPrompt(message, defaultValue = '') {
    return new Promise((resolve) => {
        document.getElementById('promptModalMessage').textContent = message;
        document.getElementById('promptInput').value = defaultValue;

        promptResolve = resolve;

        const modal = new bootstrap.Modal(document.getElementById('promptModal'));
        modal.show();
    });
}

function resolvePrompt(cancel = false) {
    const value = cancel ? null : document.getElementById('promptInput').value;

    // Log to verify value
    console.log('resolvePrompt returning:', value);

    // Resolve the stored promise
    if (promptResolve) {
        promptResolve(value);
        promptResolve = null;
    }

    // Close the modal
    const modalEl = document.getElementById('promptModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}

let notesResolve;

function showNotes(message, defaultValue = '') {
    return new Promise((resolve) => {
        document.getElementById('notesModalMessage').textContent = message;
        document.getElementById('notesTextarea').value = defaultValue;

        notesResolve = resolve;

        const modal = new bootstrap.Modal(document.getElementById('notesModal'));
        modal.show();
    });
}

function resolveNotes(value = undefined) {
    const inputValue = document.getElementById('notesTextarea').value;

    // Cancel returns null
    if (value === null) {
        notesResolve?.(null);
    } else {
        notesResolve?.(inputValue);
    }

    notesResolve = null;

    // Close modal
    const modalEl = document.getElementById('notesModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}



// Expose functions globally so buttons can call them
window.addPlant = addPlant;
window.waterPlant = waterPlant;
window.deletePlant = deletePlant;
window.editPlant = editPlant;
window.notesPlant = notesPlant;
window.showSuggestions = showSuggestions;
window.selectSuggestion = selectSuggestion;
window.resolvePrompt = resolvePrompt;
window.resolveConfirm = resolveConfirm;
window.resolveNotes = resolveNotes;
window.showAlert = showAlert;
window.showConfirm = showConfirm;
window.showPrompt = showPrompt;
window.showNotes = showNotes;