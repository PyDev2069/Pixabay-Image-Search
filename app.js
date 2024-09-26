
const apiKey = '46142341-ffb0b739e32b3666c652f02eb'; 
const apiUrl = 'https://pixabay.com/api/';
let currentPage = 1;
const imagesPerPage = 42; 


const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const imageContainer = document.getElementById('imageContainer');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const currentPageDisplay = document.getElementById('currentPage');
const cupLoader = document.querySelector('.cup');

prevPageButton.style.display = 'none';
nextPageButton.style.display = 'none';
currentPageDisplay.style.display = 'none'; 


function showLoader() {
  cupLoader.style.display = 'block';
}


function hideLoader() {
  cupLoader.style.display = 'none';
}


hideLoader(); 


searchButton.addEventListener('click', async () => {
  prevPageButton.style.display = 'none';
  nextPageButton.style.display = 'none';
  currentPageDisplay.style.display = 'none';
  currentPage = 1; 
  const query = searchInput.value.trim();
  if (query !== "") {
    imageContainer.innerHTML = ''; 
    showLoader();
    await fetchImages(query); 
    hideLoader();
  } else {
    alert('Please enter a search term.');
  }
});


async function fetchImages(query) {
  const url = `${apiUrl}?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${imagesPerPage}&page=${currentPage}`;
  try {
    const response = await fetch(url); 
    const data = await response.json(); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); 
    if (data.hits.length > 0) {
      imageContainer.innerHTML = '';
      displayImages(data.hits); 
      prevPageButton.style.display = 'inline-block';
      nextPageButton.style.display = 'inline-block';
      currentPageDisplay.style.display = 'block'; 
      updatePaginationControls(); 
    } else {
      imageContainer.innerHTML = '<p>No images found.</p>'; 
      currentPageDisplay.style.display = 'none'; 
    }
  } catch (error) {
    console.error('Error fetching images:', error); 
    imageContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>'; 
    currentPageDisplay.style.display = 'none'; 
  } finally {
    hideLoader();
  }
}


function displayImages(images) {
  images.forEach(image => {
    const imgWrapper = document.createElement('div'); 
    imgWrapper.classList.add('image-wrapper'); 
    
    const imgElement = document.createElement('img');
    imgElement.src = image.webformatURL; 
    imgElement.alt = image.tags; 
    imgElement.style.width = '200px';    
    imgElement.style.cursor = 'pointer'; 

    
    imgElement.addEventListener('click', () => {
      downloadImage(image.largeImageURL); 
    });

    imgWrapper.appendChild(imgElement); 
    imageContainer.appendChild(imgWrapper); 
  });
}


function downloadImage(url) {
  fetch(url)
    .then(response => response.blob()) 
    .then(blob => {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob); 
      downloadLink.setAttribute('download', 'image.jpg'); 
      downloadLink.click(); 
    })
    .catch(err => console.error('Error downloading the image:', err)); 
}


function updatePaginationControls() {
  currentPageDisplay.innerText = `Page ${currentPage}`;
  prevPageButton.disabled = currentPage === 1; 
}
prevPageButton.addEventListener('click', async () => {
  if (currentPage > 1) {
    currentPage--; 
    imageContainer.innerHTML = '';
    prevPageButton.style.display = 'none';
    nextPageButton.style.display = 'none';
    currentPageDisplay.style.display = 'none';
    showLoader();
    await fetchImages(searchInput.value.trim()); 
    hideLoader();
    updatePaginationControls(); 
  }
});

nextPageButton.addEventListener('click', async () => {
  currentPage++; 
  imageContainer.innerHTML = '';
  prevPageButton.style.display = 'none';
  nextPageButton.style.display = 'none';
  currentPageDisplay.style.display = 'none';
  showLoader();
  await fetchImages(searchInput.value.trim()); 
  hideLoader();
  updatePaginationControls(); 
});
