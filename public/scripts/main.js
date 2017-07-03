$(function () {

  $.getJSON("https://api.myjson.com/bins/a6g8v", function (json) {

    createTable(json);

  });

  var $loginButton = $("#loginButton");
  var $logOutButton = $("#logOutButton");



  firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
      $("#e-mail").val("");
      $("#password").val("");
      $("#panelsignin").hide();
      $(".buttonComment").show();
      $("#logOutButton").show();

    } else {
      $("#panelsignin").show();
      $(".buttonComment").hide();
      $("#logOutButton").hide();
    }
  });

  $loginButton.on('click', function () {
    var $email = $("#e-mail");
    var $password = $("#password");

    firebase.auth().signInWithEmailAndPassword($email.val(), $password.val());
  });


  $logOutButton.on('click', function () {
    firebase.auth().signOut();

  })


  function createTable(json) {

    $("#map").children().hide();

    for (var i = 0; i < json.matches.length; i++) {

      var tr = document.createElement('tr');

      tr.insertCell().innerHTML = json.matches[i].teams.home.name;
      tr.insertCell().innerHTML = json.matches[i].teams.away.name;
      tr.insertCell().innerHTML = '<button class="btn btn-info mybutton" data-index="' + i + '">More Info</button>';

      $('#matches').append(tr);
    }

    $('.mybutton').on('click', function () {
      $("#matches").slideUp();
      drawInfo(json, $(this).attr('data-index'));
    })

  }

  function drawInfo(json, index) {

    $('#match').empty();

    var details = $('<div/>').addClass('details');
    var logos = $('<div/>').addClass('logos');
    var logo = $('<div/>').addClass('escut');
    var logo2 = $('<div/>').addClass('escut');
    var vs = $('<div/>').addClass('vs');
    var name = $('<div/>').addClass('name');
    var name2 = $('<div/>').addClass('name');
    var field = $('<div/>').addClass('field');
    var map = $('<div/>').addClass('map');
    var botons = $('<div/>').addClass('botons');
    var button = $('<button class="btn btn-success mapButton">Show map</button>');
    var buttonHide = $('<button class="btn btn-success  hideInfo button2">Hide Info</button>');
    var buttonBack = $('<button class="btn btn-success back">Back</button>');
    var buttonComment = $('<button class="btn btn-success buttonComment"> Comment</button>');
    var comments = $(`
      <div class="postComment">
        Name: <input type="text">
        <button type="button" id="submitComment">Submit</button>
        <br>
        <textarea rows="10" placeholder="Enter text here..."></textarea>
        <br>
        
      </div>`);

    var allComments = $('<div id="allComments"></div>');
    //    var oneComment = $(`<div class="oneComment">
    //      <div class="postName"></div>
    //    <div class="postCommentPost"> </div>
    //  
    //</div>`
    //    );



    logo.append('<img src="images/' + json.matches[index].teams.home.logo + '">');
    logo.append(name);
    logo2.append('<img src="images/' + json.matches[index].teams.away.logo + '">');
    logo2.append(name2);
    vs.append('vs');
    logos.append(logo, vs, logo2);
    map.append('<iframe src="' + json.matches[index].field.map + '"></iframe>');
    name.append(json.matches[index].teams.home.name);
    name2.append(json.matches[index].teams.away.name);
    botons.append(button, buttonHide, buttonBack, buttonComment);
    comments.append(allComments);


    field.append(json.matches[index].field.name);


    $('#match').append(logos, field, botons, map, comments);

    map.hide();
    buttonHide.hide();
    comments.hide();


    if (firebase.auth().currentUser == null) {

      buttonComment.hide();
    }

    $(".mapButton").on("click", function () {

      map.show();
      $(this).hide();
      buttonHide.show();

    });

    $(".button2").on("click", function () {

      buttonHide.hide();
      button.show();
      map.hide();
      buttonBack.show();


    });

    var firebaseRoute = "/posts/game" + index;

    $(".back").on("click", function () {

      $("#matches").slideDown();
      $('#match').empty();
      firebase.database().ref(firebaseRoute).off("value");
    });


    $(".buttonComment").on("click", function () {
      comments.toggle();

    });



    $("#submitComment").on("click", function () {
      var name = $(".postComment").find("input").val();
      var postComment = $(".postComment").find("textarea").val();

      var dataToSave = {
        "name": name,
        "postComment": postComment
      }

      firebase.database().ref(firebaseRoute).push(dataToSave);

      $(".postComment").find("textarea").val("");
      $(".postComment").find("input").val("");

    });

    firebase.database().ref(firebaseRoute).on("value", function (snapshot) {
      var data = snapshot.val();
      console.log(data);
      console.log("cambio database: " + firebaseRoute);
      console.log("");

      $("#allComments").empty();


      for (var key in data) {
        console.log(data[key].postComment);


        var oneComment = $('<div class="oneComment">' + data[key].name + " said: " + data[key].postComment + '</div>');

        allComments.append(oneComment);


      }


    })

  }

});
