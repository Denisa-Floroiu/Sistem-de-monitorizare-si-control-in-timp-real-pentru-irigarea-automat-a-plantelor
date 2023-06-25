$(document).ready(function() {
  $('#submit-btn').on("click", function() {
    var name = $('#name').val();
    var comment = $('#comment').val();
    
/* cerere ajax pentru trimiterea feedback-urilor in baza de date */
    $.ajax({
      url: 'procesare_comentariu.php',
      type: 'GET',
      data: {
        name: name,
        comment: comment
      }      
    }).done(function(data) {
      alert("Trimitere feedback cu succes");
      $('#name').val('');
      $('#comment').val('');
    });  
  });
});
