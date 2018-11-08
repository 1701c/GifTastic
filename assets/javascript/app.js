var topics = ['bulldog', 'octonauts', 'nature cat', 'parrot', 'stingray'];
var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC';
var gif = '';
var randomGifArray;
var wasRandom = false;

var app = {
  offSet: 0,

  init: function () {
    var button;
    $('#buttonDiv').html('<button type="button" class="btn btn-success rounded" if="favButton">Favorites</button><button type="button" class="btn btn-info rounded" id="randomButton">Random</button>')
    $('#randomButton').on('click', function() {
      $('#images').empty();
      app.drawCards(randomGifArray)
      app.fetchRandom2();
    });
    this.fetchRandom2();
    for (i = 0; i < topics.length; i++) {
      button = $('<button type="button" class="btn btn-primary rounded">');
      button.text(topics[i])
        .addClass('gifButton')
      $('#buttonDiv').append(button)
    }
    $('.gifButton').on('click', function() {
      app.offSet = 0;
      wasRandom = false;
      $('#images').empty();
      app.fetchGifs($(this).text());
    });
  },

  drawModal: function (gifID) {
    // console.log(gifID);
    $.ajax({
      url: 'http://api.giphy.com/v1/gifs/' + gifID + '?api_key=dc6zaTOxFJmzC',
      method: 'GET'
    }) .done (function(response) {
      console.log(response.data);
      $('.modal-title').text(response.data.title)
      gif = $('<img class="img-fluid">');
      gif.attr('src', 'https://i.giphy.com/' + gifID + '.gif')
      $('.modal-body').html(gif)
      if (response.data.source_tld === '') response.data.source_tld = 'Unknown';
      var footerHTML = $('<ul style="list-style-type:none">');
      footerHTML.append('<li> Rated: [' + response.data.rating.toUpperCase() + ']</li>')
      
      footerHTML.append('<li> Uploaded: ' + response.data.import_datetime + '</li>')
      footerHTML.append('<li> Trended: ' + response.data.trending_datetime + '</li>')
      
      footerHTML.append('<li> Giphy ID#: ' + response.data.id + '</li>')
      footerHTML.append('<li> Source: ' + response.data.source_tld + '</li>')
      footerHTML.append('<li> <a href="' + response.data.url + '" target="_blank">Giphy Link</a></li>')
      $('.modal-footer').html(footerHTML)
      
      
      // $('.modal-footer').html('<a href="https://i.giphy.com/' + gifID + '.gif" download>Direct Link</a><br>')
      // .append('<p>' + response.data.id + '<br></p><br>')
      // .append('<p>' + response.data.import_datetime + '</p><br>')
      // .append('<p>' + response.data.rating + '</p><br>')
      // .append('<p>' + response.data.source + '</p><br>')
      // .append('<p>' + response.data.trending_datetime + '</p>')

    });
  },

  drawCards: function (data, searchText) {
    console.log(data);
    if (data.length !== 0) {
      for (i = 0; i < data.length; i++) {
        if (i%5 === 0) {
          var gifRow = $('<div class="row no-gutters">');
        }
        gif = $('<img>');
        var gifCard = $('<div class="card rounded text-center">')
        if ((i%5===3) || (i%5===4)) {
          var gifCol = $('<div class="col-6 col-md">')
        } else {
          var gifCol = $('<div class="col-4 col-md">')
        }
        gif.attr('src', data[i].images.fixed_height_still.url)
          .attr('id', data[i].id)
          .attr('switch', data[i].images.fixed_height.url)
          .attr('value',i + app.offSet)
          .addClass('gif img-fluid card-img-top')
        $(gifCard).addClass('back' + [Math.floor(Math.random() * 6)])
          .append(gif)
          .append('<h6 class="card-title text-left">'+ data[i].title +'</h6>')
          // .append('<p class="card-text text-left">Score: ' + data[i]._score + '<br>Source: <a href="'+ data[i].source +'" target="_blank">'+ data[i].source_tld +'</a></p>')
          .append('<button type="button" class="btn btn-primary" value="' + data[i].id + '" id="modal-' + data[i].id + '" data-toggle="modal" data-target="#gifModal">Embiggen</button>')
        $(gifCol).append(gifCard)
        $(gifRow).append(gifCol);
        if ((i===4) || (i===data.length-1)) {
          if ((i+1)%5 !== 0) {
            for (h = 0; h < (5-(data.length)%5); h++) {
              $(gifRow).append('<div class="col">');
            }
          }         
          $('#images').append(gifRow);            
        }
      }
      for (i = 0; i < data.length; i++) {
        $('#' + data[i].id).on('click', function() {
          var tempURL = $(this).attr('src');
          $(this).attr('src',$(this).attr('switch'))
          $(this).attr('switch',tempURL)
        })
        $('#modal-' + data[i].id).on('click', function() {
          app.drawModal($(this).attr('value'));
        })
        }
      app.offSet += 10;
      $('#images').append('<div class="row" id="moreRow"><div class="col text-center"><button type="button" id="moreButton" value="' + searchText + '" class="btn btn-primary rounded">MORE PLEASE!</button></div>')
      $('#moreButton').on('click', function () {
        $('#moreRow').remove();
        console.log(wasRandom);
        if (wasRandom === true) {
          app.drawCards(randomGifArray);
          app.fetchRandom2();
        } else {
          app.fetchGifs($(this).attr('value'));
        }
      })
    } else {
      $('#images').append('<div class="row" id="moreRow"><div class="col text-center"><p>NO MORE IMAGES</p></div>')
    }
  },


  fetchRandom2: function (element) {
    var randomArray = [];
    for (i=0; i<10; i++) {
      $.ajax({
        url: 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC',
        method: 'GET'
      }) .done (function(response) {
        randomArray.push(response.data);
      });
    }
    randomGifArray = randomArray;
    wasRandom = true;
  },

  fetchRandom: function (element) {
      $.ajax({
        url: 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&rating=g&tag=dancing',
        method: 'GET'
      }) .done (function(response) {
        // console.log(response);
        $(element).append('<img class="img-fluid" src="' + response.data.fixed_width_small_url + '">')
      });
  },

  fetchGifs: function (searchText) {
    $.ajax({
      url: queryURL + '&limit=10' +  '&offset=' + this.offSet + '&q=' + searchText,
      method: 'GET'
    }) .done (function(response) {
      app.drawCards(response.data, searchText);
      // console.log(response.data);
    });
  },
}

$(document).ready(function () {
  app.init();
  app.fetchRandom('#bannerGif1');
  app.fetchRandom('#bannerGif2');
  $('#addButton').on("keypress", function(e) {
    if (e.keyCode == 13) {
      topics.push($(this).val());
      app.init();
    }
  });
});