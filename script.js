 // Plants Directory Script
        // This array will store all our plants 

        // Array of house plant data
const plants = [
  {
    name: 'Spider Plant',
    type: 'Indoor',
    description: 'The Spider Plant is a low-maintenance, air-purifying plant that thrives in indirect light and requires moderate watering.',
    image: 'https://plus.unsplash.com/premium_photo-1664543258866-f1362a2c7195?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BpZGVyJTIwcGxhbnR8ZW58MHx8MHx8fDA%3D'
  },
  {
    name: 'Snake Plant',
    type: 'Indoor',
    description: 'Snake plants are known for their upright, sword-like leaves. They can tolerate low light and irregular watering.',
    image: 'https://plus.unsplash.com/premium_photo-1673969608395-9281e5e4395f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c25ha2UlMjBwbGFudHxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Fiddle Leaf Fig',
    type: 'Indoor',
    description: 'Fiddle Leaf Figs have large, glossy leaves that make a statement in any room. They thrive in bright, indirect light and need regular watering.',
    image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmlkZGxlJTIwbGVhZiUyMGZpZ3xlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Pothos',
    type: 'Indoor',
    description: 'Pothos is an adaptable, trailing vine that can grow in various lighting conditions. It\'s perfect for beginners and can thrive in low to bright light.',
    image: 'https://images.unsplash.com/photo-1596724878582-76f1a8fdc24f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG90aG9zfGVufDB8fDB8fHww'
  },
  {
    name: 'Peace Lily',
    type: 'Indoor',
    description: 'Peace Lilies are well-loved for their white blooms and air-purifying qualities. They thrive in low to medium light and need to be watered regularly.',
    image: 'https://plus.unsplash.com/premium_photo-1676117273363-2b13dbbc5385?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVhY2UlMjBsaWx5fGVufDB8fDB8fHww'
  },
  {
    name: 'ZZ Plant',
    type: 'Indoor',
    description: 'ZZ plants are extremely low-maintenance. They can thrive in almost any environment, including low light and infrequent watering.',
    image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8enolMjBwbGFudHxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Aloe Vera',
    type: 'Succulent',
    description: 'Aloe Vera is not only decorative but also known for its soothing gel, which is used for treating burns and skin irritations. It prefers bright light and dry conditions.',
    image: 'https://images.unsplash.com/photo-1613372978247-de50228e8033?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWxvZSUyMHZlcmF8ZW58MHx8MHx8fDA%3D'
  },
  {
    name: 'Monstera Deliciosa',
    type: 'Indoor',
    description: 'Known for its unique split leaves, the Monstera is a popular houseplant that can tolerate a variety of lighting conditions but prefers bright, indirect light.',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TW9uc3RlcmElMjBkZWxpY2lvc2F8ZW58MHx8MHx8fDA%3D'
  },
  {
    name: 'Gerbera Daisy',
    type: 'Indoor/Outdoor',
    description: 'Gerbera Daisies are known for their vibrant, colorful blooms. They do well in bright light and add a pop of color to any space.',
    image: 'https://images.unsplash.com/photo-1613800172017-6b2b3787fdb8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2VyYmVyYSUyMGRhaXN5fGVufDB8fDB8fHww'
  },
  {
    name: 'Chinese Evergreen',
    type: 'Indoor',
    description: 'Chinese Evergreen is a low-maintenance plant that\'s perfect for beginners. It can tolerate low light and requires minimal watering.',
    image: 'https://www.gardenista.com/wp-content/uploads/2017/02/Chinese-Evergreen.jpg'
  },
  {
    name: 'Bamboo Palm',
    type: 'Indoor',
    description: 'Bamboo Palm has slender bamboo-like stems and dark green leaves. It’s an excellent air purifier and does well in low to medium light.',
    image: 'https://media.istockphoto.com/id/1225189610/photo/bamboo-palm-growing-in-a-pot-decorative-indoor-plant.jpg?s=612x612&w=is&k=20&c=HeN5RWmkbpSa7ugqYQHPlew9L4dc9-RjFD72WcJoI4o='
  },
  {
    name: 'English Ivy',
    type: 'Indoor/Outdoor',
    description: 'English Ivy is a hardy vine that can be grown in both indoor and outdoor settings. It thrives in cool, moist environments and needs regular watering.',
    image: 'https://images.unsplash.com/photo-1657401923955-efe43f7d1196?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZW5nbGlzaCUyMGl2eXxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Dracaena',
    type: 'Indoor',
    description: 'Dracaena plants are easy to care for and can grow in low light. They are ideal for brightening up any room with their tall, sleek appearance.',
    image: 'https://www.ikea.com/gb/en/images/products/dracaena-marginata-potted-plant-dragon-tree-4-stem__1334408_pe946782_s5.jpg?f=s'
  },
  {
    name: 'Rubber Plant',
    type: 'Indoor',
    description: 'Rubber plants have large, glossy leaves and are perfect for adding a bold statement to any room. They thrive in bright, indirect light and require moderate watering.',
    image: 'https://images.unsplash.com/photo-1669392597221-bbfd4b6e13ff?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cnViYmVyJTIwcGxhbnR8ZW58MHx8MHx8fDA%3D'
  },
  {
    name: 'Cast Iron Plant',
    type: 'Indoor',
    description: 'Cast Iron plants are extremely hardy and can survive in low light, low humidity, and even neglectful care. They are perfect for beginners.',
    image: 'https://images.unsplash.com/photo-1521208140295-4cf4d8f90c74?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FzdCUyMGlyb24lMjBwbGFudHxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Areca Palm',
    type: 'Indoor',
    description: 'Areca Palms have feathery, arching fronds and thrive in bright, indirect light. They require moderate watering and make a beautiful addition to any room.',
    image: 'https://images.unsplash.com/photo-1630565945904-7e4220cadd0e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXJlY2ElMjBwbGFudHxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Hoya (Wax Plant)',
    type: 'Indoor',
    description: 'Hoya plants are known for their thick, waxy leaves and fragrant flowers. They thrive in bright, indirect light and require little maintenance.',
    image: 'https://images.unsplash.com/photo-1640039985592-df9c2e3f2605?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG95YXxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Calathea',
    type: 'Indoor',
    description: 'Calatheas are known for their stunning, patterned leaves. They thrive in indirect light and require consistent moisture and humidity.',
    image: 'https://images.unsplash.com/photo-1596724878443-2b4069812ff5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FsYXRoZWF8ZW58MHx8MHx8fDA%3D'
  },
  {
    name: 'Bird of Paradise',
    type: 'Indoor',
    description: 'Bird of Paradise plants are known for their large, exotic leaves and can bloom into beautiful flowers when well-cared for. They need bright light and regular watering.',
    image: 'https://images.unsplash.com/photo-1631122751597-cdc5d56d561e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmlyZCUyMG9mJTIwcGFyYWRpc2V8ZW58MHx8MHx8fDA%3D'
  }
];

// Function to display the plants
function displayPlants() {
  const plantDirectory = document.getElementById('plant-directory');
  plantDirectory.innerHTML = ''; // Clear the existing content

  plants.forEach(plant => {
    // Create plant card element
    const plantCard = document.createElement('div');
    plantCard.classList.add('plant-card');

    // Create the image element
    const plantImage = document.createElement('img');
    plantImage.src = plant.image;
    plantImage.alt = plant.name;

    // Set the image size to a percentage (e.g., 50% width of the container)
    plantImage.style.width = '50%';  // Set width as 50% of its parent container
    plantImage.style.height = 'auto';  // Maintain the aspect ratio

    // Add content to the plant card
    plantCard.innerHTML = `
      <h3>${plant.name}</h3>
      <p><strong>Type:</strong> ${plant.type}</p>
      <p><strong>Description:</strong> ${plant.description}</p>
    `;

    // Append the image first, followed by the plant details
    plantCard.insertBefore(plantImage, plantCard.firstChild);

    // Append the plant card to the directory
    plantDirectory.appendChild(plantCard);
  });
}

// Call displayPlants when the DOM content is loaded
document.addEventListener("DOMContentLoaded", displayPlants);