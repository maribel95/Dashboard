// ---------- OTHERS ----------

// Generar número aleatorio
function generarNumero(numero) {
  return (Math.random() * numero).toFixed(0);
}

// Crear color rgb aleatorio
function colorRGB() {
  var color =
    "(" +
    generarNumero(255) +
    "," +
    generarNumero(255) +
    "," +
    generarNumero(255) +
    ")";
  return "rgb" + color;
}
// Actualizamos datos de la review inicial
function actualizarDatosReview(nDatos, mediaMates, mediaReading, mediaWriting) {
  document.getElementById("numStudents").innerHTML = nDatos;
  document.getElementById("mathAverage").innerHTML = mediaMates;
  document.getElementById("readingAverage").innerHTML = mediaReading;
  document.getElementById("writtingAverage").innerHTML = mediaWriting;
}

// ---------- CHARTS ----------

// BAR CHART
function printBarChart(data, nombres, colores) {
  let barChartOptions = {
    series: [
      {
        data: data,
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: colores,
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        horizontal: false,
        columnWidth: "40%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: nombres,
    },
    yaxis: {
      title: {
        text: "Average Grade",
      },
    },
  };

  let barChart = new ApexCharts(
    document.querySelector("#bar-chart"),
    barChartOptions
  );
  barChart.render();
}

// AREA CHART
function printAreaChart(datosMujeres, datosHombres, colores) {
  let areaChartOptions = {
    series: [
      {
        name: "Women Writing Grades",
        data: datosMujeres,
      },
      {
        name: "Men Writing Grades",
        data: datosHombres,
      },
    ],
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: colores,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },

    markers: {
      size: 0,
    },

    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  let areaChart = new ApexCharts(
    document.querySelector("#area-chart"),
    areaChartOptions
  );
  areaChart.render();
}

// PIE CHART
function printPieChart(titulos,datos, colores) {
  let pieChartOptions = {
    series: datos,
    chart: {
      height: 350,
      width: 380,
      type: "pie",
    },
    colors: colores,
    labels: titulos,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  let pieChart = new ApexCharts(
    document.querySelector("#pie-chart"),
    pieChartOptions
  );
  pieChart.render();
}

// ---------- AJAX ----------

function CargarDatosGraficos() {
  $.ajax({ url: "php/conexionBBDD.php", type: "POST" }).done(function (resp) {
    if (resp.length > 0) {
      // Primer chart
      let data = JSON.parse(resp); // Parseamos los datos
      /* Dentro de data nos llega una matriz de tres dimensiones. Lo importante es la primera fila:
      data[0] contiene los datos de la primera consulta: las nota media de cada aspecto evaluado(mates, lectura y escritura)
      data[1] contiene los datos de la segunda consulta: la nota media de mates según el grupo al que pertenecen los estudiantes.
      data[2] contiene los datos de la tercera consulta: las notas de los examenes de escritura y los géneros de los estudiantes.
      data[3] contiene los datos de la cuarta consulta: agrupación del nivel educativo parental de los alumnos.
      */
      data[1].pop();               // Sacamos la primera fila porque no aporta información
      let rankingEtnias = [];      // Agruparemos los nombres de los grupos 
      let rankingNotas = [];       // Agruparemos las notas 
      let colores = [];            // Colores generados aleatoriamente para este chart
      for (let i = 0; i < data[1].length; i++) {
        rankingNotas.push(Number(data[1][i][1]).toFixed(2));
        rankingEtnias.push(data[1][i][0]);
        colores.push(colorRGB());
      }
      // Segundo chart
      data[2].shift();      // Sacamos la última fila porque no aporta información
      let notaHombres = []; // Agrupamos las notas por hombres
      let notaMujeres = []; // Agrupamos las notas por mujeres

      for (let i = 0; i < data[2].length ; i++
      ) {
        if (data[2][i][0] === "male") {
          if (notaHombres.length < 20) { // Como máximo recogeremos 20 muestras
            notaHombres.push(Number(data[2][i][1]));
          }
        } else {
          if (notaMujeres.length < 20) { // Como máximo recogeremos 20 muestras
            notaMujeres.push(Number(data[2][i][1]));
          }
        }
      }
      // Tercer chart
      data[3].shift(); // Sacamos la última fila porque no aporta información

      let tituloPadres = []; // Agrupamos los títulos de los padres 
      let numeroPadres =[];  // Agrupamos el número de padres por título
      let colores2 = []      // Nuevos colores para el tercer gráfico
      for(let i = 0; i < data[3].length; i++){
        tituloPadres.push( data[3][i][0].toUpperCase());
        numeroPadres.push(Number(data[3][i][1]));
        colores2.push(colorRGB());
      }
      // Actualizamos los datos del review
      actualizarDatosReview(
        data[0][0][0],
        Number(data[0][0][1]).toFixed(2),
        Number(data[0][0][2]).toFixed(2),
        Number(data[0][0][3]).toFixed(2)
      );
      // Creamos primer gráfico, de barras
      printBarChart(rankingNotas, rankingEtnias, colores);
      // Creamos segundo gráfico, función
      printAreaChart(notaMujeres, notaHombres, [colorRGB(), colorRGB()]);
      // Creamos tercer gráfico, en forma de pastel
      printPieChart(tituloPadres,numeroPadres,colores2);
    }
  });
}
// Finalmente llamamos a la función que crea los gráficos
CargarDatosGraficos();
