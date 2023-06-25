$(document).ready(function() {
  console.log("ready!");

    /*cerere ajax pentru obtinerea feedback-urilor*/
  $.ajax({
    url: "afisare_feedback.php"
  }).done(function(data) {
    data = JSON.parse(data);
    for (var i = 0; i < data.length; i++) {
      var nume = data[i].name;
      var comentariu = data[i].comment;
      var data1 = data[i].data;
      /*Afisare feedback-uri primite de la utilizatori */
      var feedbackHtml = '<div class="comentariu-container">';
      feedbackHtml += '<h3><i class="fa fa-user"></i>' + nume + '</h3>';
      feedbackHtml += '<textarea class="text-box" readonly>' + comentariu + '</textarea>';
      feedbackHtml += '<h2><i class="fas fa-calendar-alt">' + " " + data1 + '</h2>';
      feedbackHtml += '</div>';
      $('#feedback-container').append(feedbackHtml);
    }
  });

});
