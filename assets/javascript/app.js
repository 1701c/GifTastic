var topics = ['bulldog', 'octonauts', 'nature cat', 'parrot', 'stingray'];

var app = {
  init: function () {
    $('#buttonDiv').empty()
    var button;
    for (i = 0; i < topics.length; i++) {
      button = $('<button type="button" class="btn btn-primary rounded">');
      button.text(topics[i])
        .addClass('gifButton')
      $('#buttonDiv').append(button)
    }
    $('.gifButton').on('click', function() {
      app.fetchGifs($(this).text());
    });
  },

  fetchGifs: function (searchText) {
    var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=';
    $.ajax({
      url: queryURL + searchText,
      method: 'GET'
    }) .done (function(response) {
      console.log(response.data.length);
      for (i = 0; i < response.data.length; i++) {
        if (i%5 === 0) {
          var gifRow = $('<div class="row no-gutters">');
        }
        var gifCol = $('<div class="col text-center">');
        var gif = $('<img>');
        gif.attr('src', response.data[i].images.fixed_height_still.url)
          .attr('id', response.data[i].id)
          .attr('switch', response.data[i].images.fixed_height.url)
          .addClass('gif img-fluid')
        $(gifCol).append(gif)
          .append('<br>'+response.data[i].rating)
        $(gifRow).append(gifCol);
        if ((i===4) || (i===response.data.length-1)) {
          if ((i+1)%5 !== 0) {
            console.log('i+1 %5= ' + (i+1)%5);
            console.log('missing images ' + (5-(response.data.length)%5));
            for (h = 0; h < (5-(response.data.length)%5); h++) {
              console.log('insert image');
              $(gifRow).append('<div class="col">');
            }
          }         
          $('#images').append(gifRow);
          for (j = i-4; j < i+1; j++) {
            $('#' + response.data[j].id).on('click', function() {
              var tempURL = $(this).attr('src');
              $(this).attr('src',$(this).attr('switch'))
              $(this).attr('switch',tempURL)
            })
          }  
        }
      }  
    });
  },
}

$(document).ready(function () {
  app.init();
  $('#addButton').on("keypress", function(e) {
    if (e.keyCode == 13) {
      topics.push($(this).val());
      app.init();
    }
  });
});