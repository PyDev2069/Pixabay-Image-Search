// Define constants for the API
const apiKey = '46142341-ffb0b739e32b3666c652f02eb'; // Replace this with your actual API key
const apiUrl = 'https://pixabay.com/api/';
let currentPage = 1;
const imagesPerPage = 42; // Number of images to display per page

// Get references to DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const imageContainer = document.getElementById('imageContainer');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const currentPageDisplay = document.getElementById('currentPage');
const cupLoader = document.querySelector('.cup');

prevPageButton.style.display = 'none';
nextPageButton.style.display = 'none';
currentPageDisplay.style.display = 'none'; // Hide the current page display

// Show the cup loader
function showLoader() {
  cupLoader.style.display = 'block';
}

// Hide the cup loader
function hideLoader() {
  cupLoader.style.display = 'none';
}

// Initially hide the cup loader
hideLoader(); 

// Event listener for the search button
searchButton.addEventListener('click', async () => {
  prevPageButton.style.display = 'none';
  nextPageButton.style.display = 'none';
  currentPageDisplay.style.display = 'none';
  currentPage = 1; // Reset to the first page on new search
  const query = searchInput.value.trim();
  if (query !== "") {
    imageContainer.innerHTML = ''; // Clear previous images
    showLoader();
    await fetchImages(query); // Fetch images for the new query
    hideLoader();
  } else {
    alert('Please enter a search term.');
  }
});

// Function to fetch images from the Pixabay API
async function fetchImages(query) {
  const url = `${apiUrl}?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${imagesPerPage}&page=${currentPage}`;
  try {
    const response = await fetch(url); // Fetch the images
    const data = await response.json(); // Parse the response as JSON
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Handle non-200 responses
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); // 500 ms delay
    if (data.hits.length > 0) {
      imageContainer.innerHTML = '';
      displayImages(data.hits); // Display the images if found
      prevPageButton.style.display = 'inline-block';
      nextPageButton.style.display = 'inline-block';
      currentPageDisplay.style.display = 'block'; // Show the current page display
      updatePaginationControls(); // Update pagination display
    } else {
      imageContainer.innerHTML = '<p>No images found.</p>'; // Handle no results
      currentPageDisplay.style.display = 'none'; // Hide the current page display
    }
  } catch (error) {
    console.error('Error fetching images:', error); // Log any errors
    imageContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>'; // User-friendly error message
    currentPageDisplay.style.display = 'none'; // Hide the current page display
  } finally {
    hideLoader();
  }
}

// Function to display images in the container and add click-to-download functionality
function displayImages(images) {
  images.forEach(image => {
    const imgWrapper = document.createElement('div'); // Create a wrapper div for the image
    imgWrapper.classList.add('image-wrapper'); // Assign class for styling
    
    const imgElement = document.createElement('img');
    imgElement.src = image.webformatURL; // Use the URL of the image
    imgElement.alt = image.tags; // Use the tags as alt text
    imgElement.style.width = '200px'; // Set a fixed width    
    imgElement.style.cursor = 'pointer'; // Set pointer cursor on hover

    // Add click event to download image directly
    imgElement.addEventListener('click', () => {
      downloadImage(image.largeImageURL); // Trigger the download function on click
    });

    imgWrapper.appendChild(imgElement); // Append the image to the wrapper
    imageContainer.appendChild(imgWrapper); // Append the wrapper to the container
  });
}

// Function to download image
function downloadImage(url) {
  fetch(url)
    .then(response => response.blob()) // Fetch the image as a blob
    .then(blob => {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob); // Create a URL for the blob
      downloadLink.setAttribute('download', 'image.jpg'); // Set download attribute with filename
      downloadLink.click(); // Programmatically trigger the download
    })
    .catch(err => console.error('Error downloading the image:', err)); // Handle errors
}

// Function to update pagination controls
function updatePaginationControls() {
  currentPageDisplay.innerText = `Page ${currentPage}`;
  prevPageButton.disabled = currentPage === 1; // Disable prev button on first page
}

// Event listeners for pagination buttons
prevPageButton.addEventListener('click', async () => {
  if (currentPage > 1) {
    currentPage--; // Decrement the page number
    imageContainer.innerHTML = '';
    prevPageButton.style.display = 'none';
    nextPageButton.style.display = 'none';
    currentPageDisplay.style.display = 'none';
    showLoader();
    await fetchImages(searchInput.value.trim()); // Refetch with the current query
    hideLoader();
    updatePaginationControls(); // Update pagination display
  }
});

nextPageButton.addEventListener('click', async () => {
  currentPage++; // Increment the page number
  imageContainer.innerHTML = '';
  prevPageButton.style.display = 'none';
  nextPageButton.style.display = 'none';
  currentPageDisplay.style.display = 'none';
  showLoader();
  await fetchImages(searchInput.value.trim()); // Refetch with the current query
  hideLoader();
  updatePaginationControls(); // Update pagination display
});
