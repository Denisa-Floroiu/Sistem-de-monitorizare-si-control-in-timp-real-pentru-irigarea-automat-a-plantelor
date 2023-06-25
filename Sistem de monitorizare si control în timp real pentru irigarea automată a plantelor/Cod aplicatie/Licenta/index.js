$(document).ready(function() {
  console.log("ready!");

  // Comută vizibilitatea formularului de logare
  $("#butonLogare").on("click", function() {
    $("#myFormular").toggleClass("hidden");
    $("#btn_login").toggleClass("hidden");
    $("#icon_logare").toggleClass("hidden");
  });

  // Comută vizibilitatea formularului de creare cont
  $("#butonInregistrare").on("click", function() {
    $("#myFormular").toggleClass("hidden");
    $("#btn_inregistrare").toggleClass("hidden");
    $("#icon_inregistrare").toggleClass("hidden");
    $("#user1").toggleClass("hidden");
  });

  // Realizează acțiunea de logare
  $("#submit_login").on("click", function() {
    $.ajax({
      url: "logare.php",
      type: "GET",
      data: {
        'email': $('#email').val(),
        'parola': $('#parola').val()
      }
    }).done(function(data) {
      data = JSON.parse(data);
      if (data["result"]) {
        window.location.href = "home_user.html";
      } else {
        $("#error_logare").removeClass("hidden");
      }
    });
  });

  // Realizează acțiunea de creare cont 
  $("#submit_inregistrare").on("click", function() {
    console.log("denisa1");
    $.ajax({
      url: "inregistrare.php",
      type: "GET",
      data: {
        'email': $('#email').val(),
        'parola': $('#parola').val(),
        'username': $('#username').val(),

      }
    }).done(function(data) {
      alert("Creare cont cu succes");
      $("#myFormular").toggleClass("hidden");
      $("#btn_inregistrare").toggleClass("hidden");
      $("#icon_inregistrare").toggleClass("hidden");
      $("#user1").toggleClass("hidden");
    });
  });

});
