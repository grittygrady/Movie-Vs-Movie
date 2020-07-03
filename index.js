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

/*** SCORES FOR QUIZ PORTION ***/
let movie1Score = 0;
let movie2Score = 0;

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
      render();
    }).catch(function (error) {
      alert('error');
    });
  STORE.page = 'preview';
  
}




/*** RENDER FUNCTIONS ***/
function render() {
  if (STORE.page === 'preview') {
  $('main').html(generateMoviePreview());
  } else if (STORE.page === 'quiz1') {
  $('main').html(generateQuiz());
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
  </article>
  <button class="start-quiz">Let's Go!</button>`;
}

/*** CREATE A FOR LOOP
 * LOOP THROUGH QUESTIONS IN STORE INSTEAD OF HARD CODING QUESTIONS
 */
function generateQuiz() {
  return `<div><h2>Do critic scores matter to you?</h2></div>`;
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

function quizStart() {
  $('main').on('click', '.start-quiz', function() {
    STORE.page = 'quiz1';
    render();
  });
}

// FUNCTION TO GENERATE A RESULTS PAGE

/*** HELPER FUNCTIONS ***/
/* COIN TOSS TO DETERMINE A TIE (MATH)
    DETERMINE DIFFERENCE BETWEEN RATINGS
    DETERMINE DIFFERENCE BETWEEN MOVIE LENGTHS
    DETERMINE DIFFERENCE BETWEEN BUDGETS
    FUNCTION TO CHANGE SCORE
    DETERMINE WINNER BY COMPARING SCORES
*/


/*** INITIALIZER FUNCTION ***/


function initialize() {
  console.log('Ready, awaiting input');
  formListener();
  render();
  quizStart();
}



$(initialize);