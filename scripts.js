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

        // Function to handle plant selection
        function selectSuggestion(plant) {
            const input = document.getElementById('plantName').value = plant;
            const suggestionBox = document.getElementById('suggestions').innerHTML = ''; // Clear suggestions
        }

        // Function to add a new plant
        function addPlant() {
            const plantName = document.getElementById('plantName').value;
            
            // Check if the plant name is valid (non-empty)
            if (plantName.trim() === '') {
                alert('Please enter a plant name!');
                return;
            }

            // Check if the plant is already in the list
            const plantExists = existingPlants.includes(plantName);
            if (!plantExists) {
                alert('This plant is not in our suggestions, but we will add it manually!');
                existingPlants.push(plantName); // Add to suggestions
            }

            // Create a new plant object
            const newPlant = {
                name: plantName,
                lastWatered: 'Never',
                dateAdded: new Date().toLocaleDateString()
            };

            // Add it to the myPlants array
            myPlants.push(newPlant);

            // Clear the input box
            document.getElementById('plantName').value = '';

            // Update display
            showPlants();
        }

        // Function to display added plants
        function showPlants() {
            console.log(myPlants); // You can add this to display the plants on the page
        }

        // Function to water a plant
        function waterPlant(plantIndex) {
            // Update the last watered date
            myPlants[plantIndex].lastWatered = new Date().toLocaleDateString();
            
            // Update what shows on the page
            showPlants();
        }

        // Function to delete a plant
        function deletePlant(plantIndex) {
            // Ask if they're sure
            if (confirm('Are you sure you want to delete this plant?')) {
                // Remove it from the array
                myPlants.splice(plantIndex, 1);
                
                // Update what shows on the page
                showPlants();
            }
        }

        // Function to edit plant
        function editPlant(plantIndex) {
            // get current name
            const currentName = myPlants[plantIndex].name;
            // Ask user for new name (pre-filled with current name)
            const newName = prompt('Enter new plant name:', currentName);
    
    // If they clicked Cancel or entered nothing, don't change anything
            if (newName === null || newName.trim() === '') {
                return;
            }  
    
    // Update the plant's name
            myPlants[plantIndex].name = newName.trim();
    
    // Update what shows on the page
            showPlants();
}

        // function to add notes

        // function to add photos
        

        

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
