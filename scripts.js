       // FireStore Setup
       // Import Firebase SDK modules from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
       
       // This array will store all our plants
        //let myPlants = [];

const existingPlants = ['Aloe Vera', 'Basil', 'Cactus', 'Fern', 'Rose', 'Tulip'];
const myPlants = [];

        // Function to show suggestions
    function showSuggestions() {
        const input = document.getElementById('plantName');
        const suggestionBox = document.getElementById('suggestions');
        const query = input.value.toLowerCase();
            
            // Clear previous suggestions
        suggestionBox.innerHTML = '';
            
        if (query === '') {
            suggestionBox.style.display = 'none';
            return;
        }
            
            // Filter existing plants based on user input
        const filteredPlants = existingPlants.filter(plant => plant.toLowerCase().includes(query));

         // If there are no suggestions, hide the suggestion box
        if (filteredPlants.length === 0) {
            suggestionBox.style.display = 'none';
        } else {
            // Show the suggestion box
            suggestionBox.style.display = 'block';
        
            
            // Display suggestions
        filteredPlants.forEach(plant => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.textContent = plant;
            suggestionItem.onclick = () => selectSuggestion(plant);
             suggestionBox.appendChild(suggestionItem);
         });
      }
    }

    async function loadPlantsFromFirestore() {
        myPlants.length = 0; // Clear array
        const querySnapshot = await getDocs(collection(db, "plants"));
        querySnapshot.forEach((docSnap) => {
            const plant = docSnap.data();
            plant.id = docSnap.id;
            myPlants.push(plant);
        });
        showPlants();
    }

    // Call this when the page loads
    window.onload = () => {
        loadPlantsFromFirestore();
    };

        // Function to handle plant selection
        function selectSuggestion(plant) {
            const input = document.getElementById('plantName').value = plant;
            const suggestionBox = document.getElementById('suggestions').innerHTML = ''; // Clear suggestions
        }

        // Function to add a new plant
        async function addPlant() {
    const plantName = document.getElementById('plantName').value;

    if (plantName.trim() === '') {
        alert('Please enter a plant name!');
        return;
    }

    const plantExists = existingPlants.includes(plantName);
    if (!plantExists) {
        alert('This plant is not in our suggestions, but we will add it manually!');
        existingPlants.push(plantName);
    }

    const newPlant = {
        name: plantName,
        lastWatered: 'Never',
        dateAdded: new Date().toLocaleDateString()
    };

    try {
        const docRef = await addDoc(collection(db, "plants"), newPlant);
        newPlant.id = docRef.id; // Save Firestore document ID
        myPlants.push(newPlant); // Add to local array
        console.log("Plant added with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding plant: ", e);
    }

    document.getElementById('plantName').value = '';
    showPlants();
}

        // Function to display added plants
        //function showPlants() {
            //console.log(myPlants); // You can add this to display the plants on the page
        //}

        // Function to water a plant
        async function waterPlant(plantIndex) {
            const plant = myPlants[plantIndex];
            const newDate = new Date().toLocaleDateString();
            plant.lastWatered = newDate;

            // Update Firestore
            const docRef = doc(db, "plants", plant.id);
            await updateDoc(docRef, {
                lastWatered: newDate
            });

            showPlants();
        }

        // Function to delete a plant
        async function deletePlant(plantIndex) {
            if (!confirm('Are you sure you want to delete this plant?')) return;

            const plant = myPlants[plantIndex];
            const docRef = doc(db, "plants", plant.id);
            await deleteDoc(docRef); // Remove from Firestore

            myPlants.splice(plantIndex, 1); // Remove locally
            showPlants();
        }

        // Function to edit plant
        async function editPlant(plantIndex) {
            const plant = myPlants[plantIndex];
            const newName = prompt('Enter new plant name:', plant.name);

            if (!newName || newName.trim() === '') return;
            plant.name = newName.trim();

            const docRef = doc(db, "plants", plant.id);
            await updateDoc(docRef, {
                name: plant.name
            });

            showPlants();
        }

        // function to add notes

        function notesPlant(plantIndex) {
            const currentNotes = myPlants[plantIndex].notes || '';
            const newNotes = prompt('Enter notes for this plant:', currentNotes);
            if (newNotes !== null) {
                myPlants[plantIndex].notes = newNotes.trim();
            }
            showPlants();
        }

        // function to add photo

        // Function to display all plants on the page
        function showPlants() {
            const plantList = document.getElementById('plantList');
            
            // If no plants, show empty message
            if (myPlants.length === 0) {
                plantList.innerHTML = `
                    <div class="empty-message">
                        No plants yet! Add your first plant above.
                    </div>
                `;
                return;
            }

            // Build HTML for all plants
            let html = '';
            for (let i = 0; i < myPlants.length; i++) {
                const plant = myPlants[i];
                html += `
                    <div class="plant">
                        <div class="plant-info">
                            <div class="plant-name">${plant.name}</div>
                            <div class="last-watered">Last watered: ${plant.lastWatered}</div>
                        </div>
                        <div>
                            <button class="water-button" onclick="waterPlant(${i})">
                                💧 Water
                            </button>
                            <button class="notes-button" onclick="notesPlant(${i})">
                                📝 Notes
                            </button> 
                            <button class="edit-button" onclick="editPlant(${i})">
                                ✏️ Edit
                            </button>
                            <button class="delete-button" onclick="deletePlant(${i})">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                `;
            }
            
            // Put the HTML on the page
            plantList.innerHTML = html;
        }

        // Allow Enter key to add plants
        document.getElementById('plantName').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                addPlant();
            }
        });

window.addPlant = addPlant;
window.waterPlant = waterPlant;
window.deletePlant = deletePlant;
window.editPlant = editPlant;
window.notesPlant = notesPlant;
window.showSuggestions = showSuggestions;
