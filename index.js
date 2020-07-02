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
function getMovieData(query) {
  const params = {
    apikey: apikey,
    t: query
  };
  const queryString1 = formatQueryParams(params)
  const queryString2 = formatQueryParams(params)
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
    }).catch(function (error) {
      alert('error');
    });
  }


  console.log(movieChoice1);
  console.log(movieChoice2);
  /*** RENDER FUNCTIONS ***/



  /*** TEMPLATE GENERATION FUNCTIONS ***/




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
  }



  $(initialize);