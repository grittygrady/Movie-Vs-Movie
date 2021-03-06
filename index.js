'use strict'
/* STORE */
const STORE = {
  page: "landing",
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
      STORE.page = 'preview';
      render();
    }).catch(function (error) {
      alert('Something went wrong, please try again.');
    });
}




/*** RENDER FUNCTIONS ***/
function render() {
  if (STORE.page === "landing") {
    $('main').html(generateLanding());
  } else if (STORE.page === 'preview') {
    $('main').html(generateMoviePreview());
  } else if (STORE.page === 'quizPage1') {
    $('main').html(generateQuiz());
  } else if (STORE.page === 'quizPage2') {
    $('main').html(generateQuiz());
  } else if (STORE.page === 'quizPage3') {
    $('main').html(generateQuiz());
  } else if (STORE.page === 'calculateWinner') {
    $('main').html(calculateWinner());
  } else if (STORE.page === "tieResults") {
    $('main').html(coinToss());
  }
}


/*** TEMPLATE GENERATION FUNCTIONS ***/
function generateLanding() {
  return `<div class="start-page">
  <h2>Enter 2 movies and we'll help decide what to watch!</h2>
  <form id="movie-search">
    <label for="movie1" class="movie-form">Movie 1:</label>
    <input type="text" name="movie1" id="movie1" placeholder="Search for a movie" required>
    <br>
    <label for="movie2" class="movie-form">Movie 2:</label>
    <input type="text" name="movie2" id="movie2" placeholder="Search for a movie" required>
    <br>
    <button type="submit" value="Submit" class="btn" id="submitMovie">Submit</button>
  </form>
</div>`
}

function generateMoviePreview() {
  if (movieChoice1[0].Response === "False" || movieChoice2[0].Response === "False") {
    return `<div><h2>Sorry, we couldn't find one of those movies. Double check your spelling and try again!</h2><button class="btn" id="restartQuiz">Retry</button></div>`
  } else {
    return `<div><div class="movie-grid"><article><h3 class="movie-title">${movieChoice1[0].Title}</h3>
  <img src="${movieChoice1[0].Poster}" class="movie-poster">
  <p class="plot">${movieChoice1[0].Plot}</p>
  </article>
  <article><h3>${movieChoice2[0].Title}</h3>
  <img src="${movieChoice2[0].Poster}">
  <p>${movieChoice2[0].Plot}</p>
  </article></div>
  <button class="btn start-quiz">Let's Go!</button>
  <h4>Didn't find what you're looking for? Double check your spelling and try again!</h4>
  <button class="btn" id="restartQuiz">Restart the quiz</button>
  </div>`;
  }
}

function generateQuiz() {
  return `<div class="quiz-portion">
  <h2>${STORE.question[questionNumber]}</h2>
  <form class="quiz-form">
      
      <input type="radio" name="answer" value="high" id="high" required>
      <label for="high" class="answers">${STORE.answer[questionNumber][0]}</label>
      <input type="radio" name="answer" value="medium" id="medium" required>
      <label for="medium" class="answers">${STORE.answer[questionNumber][1]}</label>
      <input type="radio" name="answer" value="low" id="low" required>
      <label for="low" class="answers">${STORE.answer[questionNumber][2]}</label>
      <br>
      <button type="submit" class="btn submitButton" id="submitAnswer">Submit</button>
  </form>
</div>`;
}

/*** EVENT LISTENER FUNCTIONS ***/
function formListener() {
  $('main').on('click', '#submitMovie', function (event) {
    event.preventDefault();
    const searchTerm1 = $('#movie1').val();
    const searchTerm2 = $('#movie2').val();
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
    if (STORE.page === 'quizPage1') {
      criticWeight(selected);
    } else if (STORE.page === 'quizPage2') {
      movieLength(selected);
    } else if (STORE.page === 'quizPage3') {
      adultOrFamily(selected);
    } else if (STORE.page === 'calculateWinner') {
      calculateWinner();
    }
  });
}

function restartQuiz() {
  $('main').on('click', '#restartQuiz', function (event) {
    movie1Score = 0;
    movie2Score = 0;
    questionNumber = 0;
    movieChoice1.pop();
    movieChoice2.pop();
    event.preventDefault();
    STORE.page = 'landing';
    render();
  });
}

function coinTossListener() {
  $('main').on('click', '#coinToss', function (event) {
    coinToss();
    STORE.page = "tieResults";
    render();
  });
}

/*** HELPER FUNCTIONS ***/

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
}

//DETERMINE DIFFERENCE BETWEEN MOVIE LENGTHS
function movieLength(selected) {
  let movie1Runtime = parseInt(movieChoice1[0].Runtime);
  let movie2Runtime = parseInt(movieChoice2[0].Runtime);
  if (movie1Runtime > movie2Runtime && selected === "high") {
    movie1Score += 2;
    questionNumber++;
  } else if (movie1Runtime < movie2Runtime && selected === "medium") {
    movie1Score += 2;
    questionNumber++;
  } else if (movie2Runtime > movie1Runtime && selected === "high") {
    movie2Score += 2;
    questionNumber++;
  } else if (movie2Runtime < movie1Runtime && selected === "medium") {
    movie2Score += 2;
    questionNumber++;
  } else {
    questionNumber++;
  }
  STORE.page = 'quizPage3';
  render();
}

// DETERMINE DIFFERENCE BETWEEN MPAA RATINGS
function adultOrFamily(selected) {
  let movie1Rating = movieChoice1[0].Rated;
  let movie2Rating = movieChoice2[0].Rated;
  if (selected === "low") {
    console.log("no preference");
  } else if (selected === "high" && movie1Rating === "R" || movie1Rating === "PG-13") {
    movie1Score += 2;
  } else if (selected === "high" && movie2Rating === "R" || movie2Rating === "PG-13") {
    movie2Score += 2;
  } else if (selected === "medium" && movie1Rating !== "R" || movie1Rating !== "PG-13") {
    movie1Score += 2;
  } else if (selected === "medium" && movie2Rating !== "R" || movie1Rating !== "PG-13") {
    movie2Score += 2;
  }
  STORE.page = 'calculateWinner';
  render();
}

//DETERMINE WINNER BY COMPARING SCORES
function calculateWinner() {
  if (movie1Score > movie2Score) {
    return `<div><h2>We Have a Winner!</h2><h3>${movieChoice1[0].Title}</h3>
    <div class="results-grid">
    <img src="${movieChoice1[0].Poster}" class="movie-poster">
    <p class="runtime-rating">Runtime: ${movieChoice1[0].Runtime} Rated ${movieChoice1[0].Rated}</p>
    <p class="rt-score">Rotten Tomatoes Score: ${movieChoice1[0].Ratings[1].Value}</p>
    <p class="plot">${movieChoice1[0].Plot}</p></div>
    <button class="btn" id="restartQuiz">Retake the quiz</button>
    </div>`
  } else if (movie2Score > movie1Score) {
    return `<div><h2>We Have a Winner!</h2><h3>${movieChoice2[0].Title}</h3>
    <div class="results-grid">
    <img src="${movieChoice2[0].Poster}" class="movie-poster">
    <p class="runtime-rating">Runtime: ${movieChoice2[0].Runtime} Rated ${movieChoice2[0].Rated}</p>
    <p class="rt-score">Rotten Tomatoes Score: ${movieChoice2[0].Ratings[1].Value}</p>
    <p class="plot">${movieChoice2[0].Plot}</p></div>
    <button class="btn" id="restartQuiz">Retake the quiz</button></div>`
  } else {
    return `<div><h2>It's a tie!</h2><button class="btn" id="restartQuiz">Retake the quiz</button>
    <br>
    <button class="btn" id="coinToss">Flip a coin!</button></div>`
  }
}

/* COIN TOSS TO DETERMINE A TIE BREAKER */
function coinToss() {
  let coinFlip = Math.round(Math.random()) + 1;
  if (coinFlip === 1) {
    return `<div><h2>We Have a Winner!</h2><h3 class="movie-title">${movieChoice1[0].Title}</h3><div class="results-grid">
    <img src="${movieChoice1[0].Poster}" class="movie-poster">
    <p class="runtime-rating">Runtime: ${movieChoice1[0].Runtime} Rated ${movieChoice1[0].Rated}</p>
    <p class="rt-score">Rotten Tomatoes Score: ${movieChoice1[0].Ratings[1].Value}</p>
    <p class="plot">${movieChoice1[0].Plot}</p></div>
    <button class="btn" id="restartQuiz">Retake the quiz</button>
    </div>`
  } else {
    return `<div><h2>We Have a Winner!</h2><h3 class="movie-title">${movieChoice2[0].Title}</h3><div class="results-grid">
    <img src="${movieChoice2[0].Poster}" class="movie-poster">
    <p class="runtime-rating">Runtime: ${movieChoice2[0].Runtime} Rated ${movieChoice2[0].Rated}</p>
    <p class="rt-score">Rotten Tomatoes Score: ${movieChoice2[0].Ratings[1].Value}</p>
    <p class="plot">${movieChoice2[0].Plot}</p></div>
    <button class="btn" id="restartQuiz">Retake the quiz</button></div>`
  }
}



/*** INITIALIZER FUNCTION ***/
function initialize() {
  formListener();
  render();
  quizStart();
  submitAnswer();
  restartQuiz();
  coinTossListener();
}



$(initialize);