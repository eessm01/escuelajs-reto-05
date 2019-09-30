const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://us-central1-escuelajs-api.cloudfunctions.net/characters/';


/**
 * Function that processes the information to render it
 * @param {string} JSON format data 
 */
const processData = data => {
  const characters = data.results;
  let output = characters
    .map(character => {
      return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `;
    })
    .join("");
  let newItem = document.createElement("section");
  newItem.classList.add("Items");
  newItem.innerHTML = output;
  $app.appendChild(newItem);
}

/**
 * Get the character information through a request to the API
 * @param {string} api API url
 */
const getData = async (api) => {
  let data;
  try {
    const response = await fetch(api);  
    data = await response.json();
    localStorage.setItem('next_fetch', data.info.next);
  }
  catch(error) {
    console.log(error);
  }
  return data;
}


/**
 * Load data depending on the api url
 */
const loadData = async () => {
  const next_fetch = localStorage.getItem('next_fetch');
  let data;
  if (next_fetch === null) {
    data = await getData(API);
  } else if (next_fetch === ""){
    alert("Lo sentimos, ya no hay imágenes que mostrar!");
    intersectionObserver.unobserve($observe);
  } else {
    data = await getData(next_fetch);
  }
  if (data) {
    processData(data);
  }
}


/**
 * Create the intersection observer by calling its constructor
 */
const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  } 
}, {
  rootMargin: '0px 0px 100% 0px',
});

/**
 * Adds a div element called observer to the Intersection observer
 */
intersectionObserver.observe($observe);


/**
 * When the document is loading, the local storage is cleaned
 */
window.onload = () => {
  localStorage.clear();
};