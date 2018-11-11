var topics = [];
var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC';
var gif = '';
var randomGifArray;
var wasRandom = false;
var favoritesIDs = [];
var favoritesArray = [];

var app = {
  offSet: 0,

  init: function () {
    var button;
    topics = JSON.parse(localStorage.getItem("topics"));
    favoritesIDs = JSON.parse(localStorage.getItem("favs"));
    if (!favoritesIDs) favoritesIDs = [];
    if (!topics) topics = ['space', 'octonauts', 'nature cat', 'sharks', 'fajitas', 'peanut butter', 'fish'];  // things my kid likes
    this.fetchFavorites();
    this.fetchRandomGifs();
    $('#buttonDiv').html('<button type="button" class="btn btn-success rounded" id="favButton">Favorites</button><button type="button" class="btn btn-info rounded" id="randomButton">Random</button>')
    for (i = 0; i < topics.length; i++) {
      button = $('<button type="button" class="btn btn-primary rounded">');
      button.text(topics[i])
        .addClass('gifButton')
      $('#buttonDiv').append(button)
    }
    $('#favButton').on('click', function () {
      $('#images').empty();
      app.drawCards(favoritesArray);
      $('#moreButton').remove();
    });
    $('#randomButton').on('click', function () {
      $('#images').empty();
      app.drawCards(randomGifArray);
      app.fetchRandomGifs();
    });
    $('.gifButton').on('click', function () {
      app.offSet = 0;
      wasRandom = false;
      $('#images').empty();
      app.fetchGifs($(this).text());
    });
  },

  drawModal: function (gifID) {
    $.ajax({
      url: 'http://api.giphy.com/v1/gifs/' + gifID + '?api_key=dc6zaTOxFJmzC',
      method: 'GET'
    }).done(function (response) {
      var star = $('<img>');
      if (response.data.title === '') response.data.title = 'Unknown';  // if item is blank, write unknown
      if (response.data.source_tld === '') response.data.source_tld = 'Unknown';
      if (favoritesIDs.indexOf(response.data.id) === -1) { // sets favorite icon to appropriate status
        star.attr('src','assets/images/star-empty.jpeg')
      } else {
        star.attr('src','assets/images/star.jpeg')
      }
      star.attr('id','makeFav')
        .attr('value',response.data.id)
      $('.modal-title').html(response.data.title)
        .append(star)
      gif = $('<img class="img-fluid">');
      gif.attr('src', 'https://i.giphy.com/' + gifID + '.gif')
      $('.modal-body').html(gif)
      var footerHTML = $('<ul style="list-style-type:none">')
        .append('<li> Rated: [' + response.data.rating.toUpperCase() + ']</li>')
        .append('<li> Uploaded: ' + response.data.import_datetime + '</li>')
        .append('<li> Trended: ' + response.data.trending_datetime + '</li>')
        .append('<li> Giphy ID#: ' + response.data.id + '</li>')
        .append('<li> Source: ' + response.data.source_tld + '</li>')
        .append('<li> <a href="' + response.data.url + '" target="_blank">Giphy Link</a></li>')
      $('.modal-footer').html(footerHTML)
      $('#makeFav').on('click', function () {
        if (favoritesIDs.indexOf($(this).attr('value')) === -1) { // swaps favorite icon and adds or removes from array
          $(this).attr('src','assets/images/star.jpeg')
          favoritesIDs.push($(this).attr('value'));
        } else {
          $(this).attr('src','assets/images/star-empty.jpeg')
          favoritesIDs.splice(favoritesIDs.indexOf($(this).attr('value')),1);
        }
        app.fetchFavorites();
        localStorage.setItem("favs", JSON.stringify(favoritesIDs));
      });
    });
  },

  drawCards: function (data, searchText) {
    if (data.length !== 0) {
      for (i = 0; i < data.length; i++) {
        if (i % 5 === 0) { // new row on 1st and 6th cols
          var gifRow = $('<div class="row no-gutters">');
        }
        gif = $('<img>');
        var gifCard = $('<div class="card rounded text-center">')
        if ((i % 5 === 3) || (i % 5 === 4)) { // cols 4,5,9,10 responsiveness
          var gifCol = $('<div class="col-6 col-md">')
        } else {
          var gifCol = $('<div class="col-4 col-md">')
        }
        gif.attr('src', data[i].images.fixed_height_still.url)
          .attr('id', data[i].id)
          .attr('switch', data[i].images.fixed_height.url)
          .attr('value', i + app.offSet)
          .addClass('gif img-fluid card-img-top')
        $(gifCard).addClass('back' + [Math.floor(Math.random() * 6)]) // random background colors
          .append(gif)
          .append('<h6 class="card-title text-left">' + data[i].title + '</h6>')
          .append('<button type="button" class="btn btn-primary" value="' + data[i].id + '" id="modal-' + data[i].id + '" data-toggle="modal" data-target="#gifModal">Embiggen</button>')
        $(gifCol).append(gifCard)
        $(gifRow).append(gifCol);
        if ((i === 4) || (i === data.length - 1)) { // ends row after 5th col or end of array
          if ((i + 1) % 5 !== 0) {
            for (h = 0; h < (5 - (data.length) % 5); h++) { // add extra cols if array < 10 
              $(gifRow).append('<div class="col">'); 
            }
          }
          $('#images').append(gifRow);
        }
      }
      for (i = 0; i < data.length; i++) {
        $('#' + data[i].id).on('click', function () { // switches still image with animated
          var tempURL = $(this).attr('src');
          $(this).attr('src', $(this).attr('switch'))
          $(this).attr('switch', tempURL)
        })
        $('#modal-' + data[i].id).on('click', function () {
          app.drawModal($(this).attr('value'));
        })
      }
      app.offSet += 10; // updates offset for next 10 images
      $('#images').append('<div class="row" id="moreRow"><div class="col text-center"><button type="button" id="moreButton" value="' + searchText + '" class="btn btn-primary rounded">MORE PLEASE!</button></div>')
      $('#moreButton').on('click', function () {
        $('#moreRow').remove();
        if (wasRandom === true) {
          app.drawCards(randomGifArray);
          app.fetchRandomGifs();
        } else {
          app.fetchGifs($(this).attr('value'));
        }
      })
    } else {
      $('#images').append('<div class="row" id="moreRow"><div class="col text-center"><p>NO MORE IMAGES</p></div>')
    }
  },

  fetchFavorites: function () {
    favoritesArray = [];
    if (favoritesIDs) {
      for (i = 0; i < favoritesIDs.length; i++) {
        $.ajax({
          url: 'http://api.giphy.com/v1/gifs/' + favoritesIDs[i] + '?api_key=dc6zaTOxFJmzC',
          method: 'GET'
        }).done(function (response) {
          favoritesArray.push(response.data);
        });
      }
    }
  },

  fetchRandomGifs: function (element) { 
    randomGifArray = [];
    for (i = 0; i < 10; i++) { // API only allows 1 random image request
      $.ajax({
        url: 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC',
        method: 'GET'
      }).done(function (response) {
        randomGifArray.push(response.data);
      });
    }
    wasRandom = true;
  },

  fetchSingleRandom: function (element) {
    $.ajax({
      url: 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&rating=g&tag=dancing',
      method: 'GET'
    }).done(function (response) {
      $(element).append('<img class="img-fluid" src="' + response.data.fixed_width_small_url + '">')
    });
  },

  fetchGifs: function (searchText) {
    $.ajax({
      url: queryURL + '&limit=10' + '&offset=' + this.offSet + '&q=' + searchText,
      method: 'GET'
    }).done(function (response) {
      app.drawCards(response.data, searchText);
    });
  },
}

$(document).ready(function () {
  app.init();
  app.fetchSingleRandom('#bannerGif1');
  app.fetchSingleRandom('#bannerGif2');
  $('#addButton').on("keypress", function (e) {
    if (e.keyCode == 13) {
      topics.push($(this).val());
      localStorage.setItem("topics", JSON.stringify(topics));
      app.init();
      $(this).val('')
    }
  });
});