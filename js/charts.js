// Charts

// Fetch and Parse CSV Data
function fetchAndProcessCSV() {
  fetch("/data/Rounds Played.csv")
    .then((response) => response.text())
    .then((csvText) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (results) {
          let avgData = aggregateAverageData(results.data);
          let monthlyData = aggregateMonthlyData(results.data);
          updateBarChart(avgData);
          updateAreaChart(monthlyData);
        },
      });
    })
    .catch((error) => console.error("Error fetching CSV:", error));
}

// Aggregate Data for Average Rounds Played Per Day
function aggregateAverageData(data) {
  let sumData = {
    Sunday: { totalRounds: 0, count: 0 },
    Monday: { totalRounds: 0, count: 0 },
    Tuesday: { totalRounds: 0, count: 0 },
    Wednesday: { totalRounds: 0, count: 0 },
    Thursday: { totalRounds: 0, count: 0 },
    Friday: { totalRounds: 0, count: 0 },
    Saturday: { totalRounds: 0, count: 0 },
  };

  data.forEach((row) => {
    if (sumData.hasOwnProperty(row.Day)) {
      sumData[row.Day].totalRounds += row["Rounds Played"];
      sumData[row.Day].count += 1;
    }
  });

  let avgData = {};
  for (let day in sumData) {
    avgData[day] =
      sumData[day].count > 0
        ? Math.round(sumData[day].totalRounds / sumData[day].count)
        : 0;
  }

  return Object.values(avgData);
}

// Aggregate Data for Total Rounds Played Per Month
function aggregateMonthlyData(data) {
  let monthlyTotals = new Array(12).fill(0);
  const currentYear = new Date().getFullYear(); // Get the current year

  data.forEach((row) => {
    const date = new Date(row.Date);
    const year = date.getFullYear();
    const month = date.getMonth();
    if (year === currentYear) {
      monthlyTotals[month] += parseInt(row["Rounds Played"]);
    }
  });

  return monthlyTotals;
}


// Update Bar Chart
function updateBarChart(data) {
  var barChartOptions = {
    series: [
      {
        name: "Average Rounds Played",
        data: data,
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    colors: [
      "#184e77",
      "#1e6091",
      "#1a759f",
      "#168aad",
      "#34a0a4",
      "#52b69a",
      "#76c893",
    ],
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        horizontal: false,
        columnWidth: "40%",
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    yaxis: { title: { text: "Average Rounds Played" } },
  };

  var barChart = new ApexCharts(
    document.querySelector("#bar-chart"),
    barChartOptions
  );
  barChart.render();
}

// Update Area Chart
function updateAreaChart(monthlyData) {
  var options = {
    series: [{ name: "Rounds Per Month", data: monthlyData }],
    chart: {
      height: 350,
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { width: [5, 7, 5], curve: "straight", dashArray: [0, 8, 5] },
    legend: {
      tooltipHoverFormatter: function (val, opts) {
        return (
          val +
          " - " +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          ""
        );
      },
    },
    markers: { size: 0, hover: { sizeOffset: 6 } },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "March",
        "April",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " Rounds";
        },
      },
    },
    grid: { borderColor: "#f1f1f1" },
  };

  var areaChart = new ApexCharts(
    document.querySelector("#area-chart"),
    options
  );
  areaChart.render();
}

// Initialize the Process
fetchAndProcessCSV();
