$(document).ready(function() {
  console.log("ready!");

  $("#checkperioada").change(function(event) {
    console.log(this.checked);
    if (this.checked) {
      $("#perioada").removeClass('hidden');
    } else {
      $("#perioada").addClass('hidden');
    }
  });
 var toggleSwitch = $("#udaremanuala #stare");
  var statusPompa = $("#statuspompa");

  // Verificați dacă există o valoare stocată pentru starea butonului
  var savedState = localStorage.getItem("pompaState");
  if (savedState) {
   toggleSwitch.prop("checked", savedState === "1");
    ActualizareMesajDeStare(savedState === "1");
  }

toggleSwitch.change(function(event) {
    var isChecked = $(this).prop("checked");
    ActualizareMesajDeStare(isChecked);

    // Salvăm starea butonului în localStorage
    var stateValue = isChecked ? "1" : "0";
    localStorage.setItem("pompaState", stateValue);

    $.ajax({
      url: 'Update_state.php',
      type: 'GET',
      data: {
        state: stateValue,
        timmer: 0,
        IdSensor: 1
      }
    }).done(function(data) {
      // Răspunsul cu succes al cererii AJAX
    });
  });

  function ActualizareMesajDeStare(isChecked) {
    if (isChecked) {
      statusPompa.text("Pompa este pornită");
      setTimeout(function() {
        toggleSwitch.prop("checked", false); // Dezactivăm butonul după 10 secunde
        ActualizareMesajDeStare(false);
        localStorage.setItem("pompaState", "0");
      }, 25000); // 10 secunde
    } else {
      statusPompa.text("Pompa este oprită");
    }
  }

  $(".selecttipudare").change(function(event) {
    console.log($(this).val());
    if ($(this).val() == 'op1') {
      $("#udareperiodica").removeClass('hidden');
      $("#udaresenzori").addClass('hidden');
      $("#udaremanuala").addClass('hidden');
      $("#btnload1").removeClass('hidden');
      $("#btnload2").addClass('hidden');

    } else if ($(this).val() == 'op2') {
      $("#udareperiodica").addClass('hidden');
      $("#udaresenzori").removeClass('hidden');
      $("#btnload2").removeClass('hidden');
      $("#btnload1").addClass('hidden');
      $("#udaremanuala").addClass('hidden');
    } else {
      $("#udareperiodica").addClass('hidden');
      $("#udaresenzori").addClass('hidden');
      $("#btnload1").addClass('hidden');
      $("#btnload2").addClass('hidden');
      $("#udaremanuala").removeClass('hidden');
    }
  });

  function ObțineȘiActualizeazăDatele() {
    $.ajax({
      url: "test.php"
    }).done(function(data) {
      console.log(data);
      data = JSON.parse(data);
      $("#sol").html("Umiditatea solului " + data[0]['UmiditateSol']);
      $("#plant1").html("Umiditatea aer " + data[0]['UmiditateAer'] + "%");
      $("#temp1").html("Temperatura " + data[0]['Temperatura'] + "°C");
      $("#nivel").html("Nivelul de apă din rezervor " + data[0]['NivelApa']);

      if (data[0]['UmiditateSol'] == 1) {
        $("#dry1").show();
        $("#wet1").hide();
        $("#sol").append(" - solul este uscat  ");
      } else {
        $("#wet1").show();
        $("#dry1").hide();
        $("#sol").append(" - solul este umed");
      }
      if (data[0]['NivelApa'] < 170) {
        $("#level2").show();
        $("#level1").hide();
        $("#nivel").append(" - Nivelul de apa din rezervor este scăzut - adaugă apă în rezervor");
        $("#nivel").append("<p><i class='fas fa-exclamation-triangle' style='color: red; font-weight: bold;'> Programul nu va porni pentru că nu există suficientă apă pentru a uda.</p>");
      } else {
        $("#level1").show();
        $("#level2").hide();
        $("#nivel").append(" - Există suficientă apă în rezervor");
      }

      if (data[0]['UmiditateAer'] < 40) {
        $("#dry").show();
        $("#wet").hide();
        $("#middle").hide();
        $("#plant1").append(" - umiditatea aerului este scăzută");
      } else if (data[0]['UmiditateAer'] >= 40 && data[0]['UmiditateAer'] < 60) {
        $("#wet").hide();
        $("#dry").hide();
        $("#middle").show();
        $("#plant1").append(" - umiditatea aerului este moderată");
      } else if (data[0]['UmiditateAer'] >= 60) {
        $("#wet").show();
        $("#dry").hide();
        $("#middle").hide();
        $("#plant1").append(" - umiditatea aerului este ridicată");
      }

      if (data[0]['Temperatura'] < 10) {
        $("#dry2").show();
        $("#wet2").hide();
        $("#middle2").hide();
        $("#temp1").append(" - temperatura este scăzută");
      } else if (data[0]['Temperatura'] > 10 && data[0]['Temperatura'] < 30) {
        $("#wet2").hide();
        $("#dry2").hide();
        $("#middle2").show();
        $("#temp1").append(" - temperatura este moderată");
      } else if (data[0]['Temperatura'] > 30) {
        $("#wet2").show();
        $("#dry2").hide();
        $("#middle2").hide();
        $("#temp1").append(" - temperatura este ridicată");
      }
    });
  }

  // Apelarea funcției inițiale pentru a obține și actualiza datele la încărcarea paginii
  ObțineȘiActualizeazăDatele();

  // Actualizare automată a datelor la fiecare 5 secunde
  setInterval(ObțineȘiActualizeazăDatele, 5000);

  $("#btnload1").click(function() {
    var dateSelectate = $("#dateSelectate").val();
    console.log("data de udare selectat:", dateSelectate);

    if (dateSelectate !== "") {
      if ($("#checkperioada").is(':checked')) {
        var intervalUdare = $("#selectperioada").val();
        console.log("Interval de udare selectat:", intervalUdare);
        $.ajax({
          url: "Update_state_periodic.php",
          type: "GET",
          data: {
            intervalUdare: intervalUdare,
            dataSelectata: dateSelectate,
            state: 0,
            timer: 0,
            IdSensor: 1,
          },
          success: function(response) {
            console.log("Cererea a fost trimisă cu succes");
            // Efectuați alte acțiuni după ce cererea a fost trimisă cu succes
          },
          error: function(xhr, status, error) {
            console.error("Eroare în timpul trimiterii cererii:", error);
            // Efectuați alte acțiuni în caz de eroare
          }
        });
      } else {


        $.ajax({
          url: "Update_state_periodic.php",
          type: "GET",
          data: {
            intervalUdare: 0,
            dataSelectata: dateSelectate,
            state: 1,
            timer: 9,
            IdSensor: 1,
          },
          success: function(response) {
            console.log("Cererea a fost trimisă cu succes");
            // Efectuați alte acțiuni după ce cererea a fost trimisă cu succes
          },
          error: function(xhr, status, error) {
            console.error("Eroare în timpul trimiterii cererii:", error);
            // Efectuați alte acțiuni în caz de eroare
          }
        });
      }
    } else {
      alert('Introdu data');
    }

  });

  $("#btnload2").click(function() {

    console.log("udare automata");
    $.ajax({
      url: 'Update_state.php',
      type: 'GET',
      data: {
        state: 1,
        timmer: 2,
        IdSensor: 1
      }
    }).done(function(data) {});
  });
});