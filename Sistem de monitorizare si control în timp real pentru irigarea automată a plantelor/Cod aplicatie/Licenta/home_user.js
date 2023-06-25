$(document).ready(function() {
    console.log( "ready!" );
/*cererea ajax pentru a obține numele utilizatorului si al afisa pe pagina principala de utilizator*/
$.ajax({
  url: "home_user.php"
}).done(function(data) {
    data = JSON.parse(data);
     $("#user_name").html(("<img src='image/hi.png' >"+", " +(data[0]['nume_utilizator'])+"<b><h2>Bun venit în sistemul de monitorizare și control al udării pentru planta Kalanchoe!</h2><p>Îngrijește-ți plantele în ghivece cu dragoste și atenție pentru a le menține sănătoase și frumoase.</p></b>"));
     $("#user_name").css("font-family", " Courier New","cursive");
    
    });

});