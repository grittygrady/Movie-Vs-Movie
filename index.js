'use strict'
/* STORE */
const STORE = {
  page: "start",
  question: ["Do critic scores matter to you?", "Do you feel like a long movie or something shorter?", "Something family friendly or bring on the F-Bombs?"],
  answer: [
    ["A lot", "Somewhat", "Not at all"],
    ["Something longer", "Let's keep it shorter", "No preference"],
    ["Bring it on", "Family friendly", "No preference"]
  ]

}

/*** GLOBAL VARIABLES ***/
const apikey = 'd00e9638';
const searchURL = 'https://www.omdbapi.com/?';

const movieChoice1 = [];
const movieChoice2 = [];

/*** SCORES FOR QUIZ PORTION ***/
let movie1Score = 0;
let movie2Score = 0;
let questionNumber = 0;

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
  } else if (STORE.page === 'quizPage1') {
    $('main').html(generateQuiz());
  } else if (STORE.page === 'quizPage2') {
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
  return `<div class="quiz-portion">
  <h2>${STORE.question[questionNumber]}</h2>
  <form>
      <input type="radio" name="answer" value="high" required>
      <label for="high">${STORE.answer[questionNumber][0]}</label>
      <input type="radio" name="answer" value="medium" required>
      <label for="medium">${STORE.answer[questionNumber][1]}</label>
      <input type="radio" name="answer" value="low" required>
      <label for="low">${STORE.answer[questionNumber][2]}</label>
      <button type="submit" class="submitButton" id="submitAnswer">Submit</button>
  </form>
</div>`;
}
console.log(movieChoice1);
console.log(movieChoice2);


/*** EVENT LISTENER FUNCTIONS ***/
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
  $('main').on('click', '.start-quiz', function () {
    STORE.page = 'quizPage1';
    render();
  });
}

function submitAnswer() {
  $('main').on('click', '#submitAnswer', function (event) {
    event.preventDefault();
    let selected = $('input:checked').val();
    console.log(selected);
    if (STORE.page === 'quizPage1') {
      criticWeight(selected);
    } else if (STORE.page === 'quizPage2') {
      movieLength(selected);
    } else if (STORE.page === 'quizPage3') {
      adultOrFamily(selected);
    }
  });
}

// FUNCTION TO GENERATE A RESULTS PAGE

/*** HELPER FUNCTIONS ***/
/* COIN TOSS TO DETERMINE A TIE (MATH)
    
    FUNCTION TO CHANGE SCORE
    DETERMINE WINNER BY COMPARING SCORES
*/
//DETERMINE DIFFERENCE BETWEEN RATINGS
function criticWeight(selected) {
  if (movieChoice1[0].Ratings[1].Value > movieChoice2[0].Ratings[1].Value && selected === "high") {
    movie1Score += 2;
    questionNumber++;
  } else if (movieChoice1[0].Ratings[1].Value > movieChoice2[0].Ratings[1].Value && selected === "medium") {
    movie1Score++;
    questionNumber++;
  } else if (movieChoice2[0].Ratings[1].Value > movieChoice1[0].Ratings[1].Value && selected === "high") {
    movie2Score += 2;
    questionNumber++;
  } else if (movieChoice2[0].Ratings[1].Value > movieChoice2[0].Ratings[1].Value && selected === "medium") {
    movie2Score++;
    questionNumber++;
  } else {
    questionNumber++;
  }
  STORE.page = 'quizPage2';
  render();
  console.log(questionNumber);
  console.log(movie1Score);
  console.log(movie2Score);
}

//DETERMINE DIFFERENCE BETWEEN MOVIE LENGTHS
function movieLength(selected) {
  //  MAY USE THIS TO CLEAN UP CODE FOR READABILITY
  let movie1Runtime = parseInt(movieChoice1[0].Runtime);
  let movie2Runtime = parseInt(movieChoice2[0].Runtime);
  console.log(movie1Runtime);
  console.log(movie2Runtime);
  if (movieChoice1[0].Runtime > movieChoice2[0].Runtime && selected === "high") {
    movie1Score += 2;
    questionNumber++;
  } else if (movieChoice1[0].Runtime > movieChoice2[0].Runtime && selected === "medium") {
    movie1Score++;
    questionNumber++;
  } else if (movieChoice2[0].Runtime > movieChoice1[0].Runtime && selected === "high") {
    movie2Score += 2;
    questionNumber++;
  } else if (movieChoice2[0].Runtime > movieChoice1[0].Runtime && selected === "medium") {
    movie2Score++;
    questionNumber++;
  } else {
    questionNumber++
  }
  STORE.page = 'quizPage3';
  render();
  console.log(questionNumber);
  console.log(movie1Score);
  console.log(movie2Score);
}

// DETERMINE DIFFERENCE BETWEEN MPAA RATINGS
function adultOrFamily(selected) {
  
}




/*** INITIALIZER FUNCTION ***/
function initialize() {
  console.log('Ready, awaiting input');
  formListener();
  render();
  quizStart();
  submitAnswer();
}



$(initialize);