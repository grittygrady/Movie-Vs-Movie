'use strict'
/* STORE */
const STORE = {
  page: "start",

}

/*** GLOBAL VARIABLES ***/
const apikey = 'd00e9638';
const searchURL = 'https://www.omdbapi.com/?';

const movieChoice1 = [];
const movieChoice2 = [];

/*** FORMAT FUNCTIONS ***/
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
  return queryItems.join('&');
}

/*** FETCH FUNCTION ***/
function getMovieData(query1, query2) {
  const params1 = {
    apikey: apikey,
    t: query1
  };
  const params2 = {
    apikey: apikey,
    t: query2
  }
  const queryString1 = formatQueryParams(params1)
  const queryString2 = formatQueryParams(params2)
  const url1 = searchURL + '&' + queryString1;
  const url2 = searchURL + '&' + queryString2;

  Promise.all([
      fetch(url1),
      fetch(url2)
    ])
    .then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(function (data) {
      movieChoice1.push(data[0]);
      movieChoice2.push(data[1]);
      renderMoviePreview();
    }).catch(function (error) {
      alert('error');
    });
  STORE.page = 'preview';
  
}




/*** RENDER FUNCTIONS ***/
function renderMoviePreview() {
  if (STORE.page === 'preview') {
  $('main').html(generateMoviePreview());
  }
}


/*** TEMPLATE GENERATION FUNCTIONS ***/
function generateMoviePreview() {
  return `<article><h3>${movieChoice1[0].Title}</h3>
  <img src="${movieChoice1[0].Poster}">
  <p>${movieChoice1[0].Plot}</p>
  </article>
  <article><h3>${movieChoice2[0].Title}</h3>
  <img src="${movieChoice2[0].Poster}">
  <p>${movieChoice2[0].Plot}</p>
  </article>`
}
console.log(movieChoice1);
console.log(movieChoice2);


/*** EVENT HANDLER FUNCTIONS ***/
function formListener() {
  $('form').on('submit', function (event) {
    event.preventDefault();
    console.log('Form Submitted'); //FOR TESTING PURPOSES
    $('.start-page').addClass("hidden");
    const searchTerm1 = $('#movie1').val();
    const searchTerm2 = $('#movie2').val();
    console.log(searchTerm1);
    console.log(searchTerm2); //FOR TESTING PURPOSES
    getMovieData(searchTerm1, searchTerm2);
  });
}



/*** HELPER FUNCTIONS ***/



/*** INITIALIZER FUNCTION ***/


function initialize() {
  console.log('Ready, awaiting input');
  formListener();
  renderMoviePreview();
}



$(initialize);