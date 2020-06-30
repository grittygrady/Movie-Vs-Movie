'use strict'



function formListener() {
  $('#movie-search').on('submit', function(event){
    event.preventDefault();
  });
}

$(formListener);