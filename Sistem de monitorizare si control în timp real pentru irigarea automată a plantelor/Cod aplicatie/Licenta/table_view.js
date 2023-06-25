$(document).ready(function() {
    // Obiect pentru a stoca instanțele de grafice create
    var grafic = {};

    // Funcție pentru crearea și actualizarea unui grafic utilizând AJAX
    function creareaSauActualizareaGraficului(graficId, interval, unit, label, parametruDeMediu, color) {
        var url = "grafic.php?interval=" + interval + "&unit=" + unit;

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(data) {
                var dateGrafic = [];
                var eticheteDate = [];

                // Extrage datele și etichetele de timp din datele JSON primite
                $.each(data, function(index, item) {
                    dateGrafic.push(parseFloat(item[parametruDeMediu]));

                    // Formatează eticheta de timp pentru axa x (doar ora)
                    var formatareTimp = moment(item.Timp, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss');
                    eticheteDate.push(formatareTimp);
                });

                // Verifică dacă există deja un grafic creat cu același ID
                if (grafic[graficId]) {
                    // Actualizează datele graficului existent
                    grafic[graficId].data.etichete = eticheteDate;
                    grafic[graficId].data.datasets[0].data = dateGrafic;
                    grafic[graficId].update(); // Actualizează graficul
                } else {
                    // Creează un grafic nou
                    var graficNou = new grafic(graficId, {
                        type: "line",
                        data: {
                            etichete: eticheteDate,
                            datasets: [{
                                label: label,
                                data: dateGrafic,
                                borderColor: color,
                                fill: false
                            }]
                        },
                        options: {
                            plugins: {
                                title: {
                                    display: true,
                                    text: "Analiza grafică a ultimelor " + interval + " " + unit + " pentru " + label
                                },
                                tooltip: {
                                    enabled: true,
                                    mode: "nearest",
                                    intersect: false,
                                    callbacks: {
                                        // Formatează eticheta tooltip-ului (afiseaza data)
                                        label: function(context) {
                                            var dataIndex = context.dataIndex;
                                            var tooltipLabel = data[dataIndex].Timp;
                                            var tooltipValue = context.dataset.data[dataIndex];
                                            var formattedDate = moment(tooltipLabel, 'YYYY-MM-DD HH:mm:ss').format('DD MMM, HH:mm:ss');
                                            var unitate = (context.dataset.label === "Temperatură") ? '°C' : ((context.dataset.label === "Umiditatea aerului") ? '%' : '');
                                            var tooltipString = formattedDate + '  \nValoare ' + tooltipValue + unitate;
                                            return tooltipString;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    display: true,
                                    title: {
                                        display: true,
                                        text: "Ora"
                                    }
                                },
                                y: {
                                    display: true,
                                    title: {
                                        display: true,
                                        text: label === "Nivelul apei din rezervor" ? "Valoare analogică" : "Valoarea"
                                    },
                                    ticks: {
                                        callback: function(value) {
                                            if (label === "Umiditatea solului") {
                                                return value === 1 ? "1(Uscat)" : value === 0 ? "0(Umed)" : null;
                                            } else {
                                                return label === "Temperatură" ? value + "°C" : (label === "Nivelul apei din rezervor" ? value : value + "%");

                                            }
                                        }
                                    }
                                }
                            },
                            legend: {
                                display: true
                            }
                        }
                    });

                    // Adaugă graficul la obiectul grafic
                    grafic[graficId] = graficNou;
                }
            },
            error: function(xhr, status, error) {
                console.log("Eroare în solicitarea AJAX: " + status + " - " + error);
            }
        });
    }
    // Funcția pentru crearea sau actualizarea unui grafic
    function creareaSauActualizareaGraficului1(graficId, interval, unit, label1, label2, parametruDeMediu1, parametruDeMediu2, color1, color2) {
        var url = "grafic.php?interval=" + interval + "&unit=" + unit;

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(data) {
                var dateGrafic1 = []; // Datele pentru umiditatea solului
                var dateGrafic2 = []; // Datele pentru nivelul apei din rezervor
                var eticheteDate = []; // Etichetele de timp

                // Extrage datele și etichetele de timp din datele JSON primite prin AJAX
                $.each(data, function(index, item) {
                    dateGrafic1.push(parseFloat(item[parametruDeMediu1]));
                    dateGrafic2.push(parseFloat(item[parametruDeMediu2]));
                    // Formatează eticheta de timp pentru axa x (doar ora)
                    var formatareTimp = moment(item.Timp, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss');
                    eticheteDate.push(formatareTimp);
                });

                // Verifică dacă există deja un grafic creat cu același ID
                if (grafic[graficId]) {
                    // Actualizează datele graficului existent
                    grafic[graficId].data.etichete = eticheteDate;
                    grafic[graficId].data.datasets[0].data = dateGrafic1;
                    grafic[graficId].data.datasets[1].data = dateGrafic2;
                    grafic[graficId].update(); // Actualizează graficul
                } else {
                    // Creează un grafic nou
                    var graficNou = new grafic(graficId, {
                        type: "line",
                        data: {
                            etichete: eticheteDate,
                            datasets: [{
                                label: label1,
                                data: dateGrafic1,
                                borderColor: color1,
                                fill: false,
                                yAxisID: "yLeft"
                            }, {
                                label: label2,
                                data: dateGrafic2,
                                borderColor: color2,
                                fill: false,
                                yAxisID: "yRight"
                            }]
                        },
                        options: {
                            // Configurările opționale ale graficului (titlu, tooltip-uri, etc.)
                            plugins: {
                                title: {
                                    display: true,
                                    text: "Analiza grafică a ultimelor " + interval + " " + unit + " pentru " + label1 + " și " + label2
                                },
                                tooltip: {
                                    enabled: true,
                                    mode: "nearest",
                                    intersect: false,
                                    callbacks: {
                                        // Formatează eticheta tooltip-ului (afiseaza data)
                                        label: function(context) {
                                            var dataIndex = context.dataIndex;
                                            var tooltipLabel = data[dataIndex].Timp;
                                            var tooltipValue = context.dataset.data[dataIndex];
                                            var formattedDate = moment(tooltipLabel, 'YYYY-MM-DD HH:mm:ss').format('DD MMM, HH:mm:ss');
                                            var tooltipString = formattedDate + '  \nValoare ' + tooltipValue;
                                            return tooltipString;
                                        }
                                    }
                                }
                            },
                            scales: {
                                yLeft: {
                                    position: "left",
                                    title: {
                                        display: true,
                                        text: "Valoarea pentru umiditatea solului"
                                    },
                                    ticks: {
                                        callback: function(value) {
                                            if (label1 === "Umiditatea solului") {
                                                return value === 1 ? "1(Uscat)" : value === 0 ? "0(Umed)" : null;
                                            } else {

                                            }
                                        }
                                    }
                                },
                                yRight: {
                                    position: "right",
                                    title: {
                                        display: true,
                                        text: "Valoare analogică pentru nivelul apei din rezervor"
                                    },
                                    ticks: {
                                        callback: function(value) {
                                            return label2 === "Nivelul apei din rezervor" ? value : null;
                                        }
                                    }
                                }
                            }
                        }
                    });

                    // Adaugă graficul la obiectul grafic
                    grafic[graficId] = graficNou;
                }
            },
            error: function(xhr, status, error) {
                console.log("Eroare în solicitarea AJAX: " + status + " - " + error);
            }
        });
    }


    // Inițializare grafice la încărcarea paginii
    creareaSauActualizareaGraficului("GraficTemperatura", 2, "ore", "Temperatură", "Temperatura", "red");
    creareaSauActualizareaGraficului("GraficUmiditateSol", 3, "ore", "Umiditatea solului", "UmiditateSol", "green");
    creareaSauActualizareaGraficului("GraficNivelApa", 3, "ore", "Nivelul apei din rezervor", "NivelApa", "yellow");
    creareaSauActualizareaGraficului("GraficUmiditateAer", 3, "ore", "Umiditatea aerului", "UmiditateAer", "blue");
    creareaSauActualizareaGraficului1("GraficeCombinate", 3, "ore", "Umiditatea solului", "Nivelul apei din rezervor", "UmiditateSol", "NivelApa", "blue", "red");

    // Actualizare automată a graficelor la fiecare 5 secunde
    setInterval(function() {
        creareaSauActualizareaGraficului("GraficTemperatura", 2, "ore", "Temperatură", "Temperatura", "red");
        creareaSauActualizareaGraficului("GraficUmiditateSol", 3, "ore", "Umiditatea solului", "UmiditateSol", "green");
        creareaSauActualizareaGraficului("GraficNivelApa", 3, "ore", "Nivelul de apă din rezervor", "NivelApa", "yellow");
        creareaSauActualizareaGraficului("GraficUmiditateAer", 3, "ore", "Umiditatea aerului", "UmiditateAer", "blue");
        creareaSauActualizareaGraficului1("GraficeCombinate", 3, "ore", "Umiditatea solului", "Nivelul de apă din rezervor", "UmiditateSol", "NivelApa", "blue", "red");
    }, 5000);


});