function fetchAndProcessCSV() {
  // Fetch CSV data from the server
  fetch("/data/Rounds Played.csv")
    .then((response) => response.text())
    .then((csvText) => {
      // Use PapaParse to convert CSV text to a JavaScript array
      Papa.parse(csvText, {
        header: true, // First row of CSV is headers
        dynamicTyping: true, // Automatically convert numbers
        skipEmptyLines: true,
        complete: function (results) {
          // Update the percentage change cards with the parsed data
          updatePercentageChangeCards(results.data);
        },
      });
    })
    .catch((error) => console.error("Error fetching CSV:", error));
}

function updatePercentageChangeCards(data) {
  // Calculate and update percentage changes for different periods
  const yesterdayChange = calculateChange(data, 1, "day");
  const lastWeekChange = calculateChange(data, 1, "week");
  const lastMonthChange = calculateChange(data, 1, "month");
  const lastYearChange = calculateChange(data, 1, "year");

  // Update the text content of HTML elements for each change
  document.querySelector(".weekly-change").innerHTML =
    formatChange(lastWeekChange);
  document.querySelector(".monthly-change").innerHTML =
    formatChange(lastMonthChange);
  document.querySelector(".yearly-change").innerHTML =
    formatChange(lastYearChange);
}

function calculateChange(data, amount, period) {
  // Calculate the start and end dates for the current and previous periods
  const { currentStart, currentEnd, previousStart, previousEnd } =
    getPeriodDates(amount, period);

  // Sum the rounds for the current and previous periods
  const currentRounds = sumRounds(data, currentStart, currentEnd);
  const previousRounds = sumRounds(data, previousStart, previousEnd);

  // Return the calculated percentage change
  return calculatePercentageChange(currentRounds, previousRounds);
}

function sumRounds(data, startDate, endDate) {
  // Sum rounds played between startDate and endDate
  return data
    .filter((row) => {
      const date = new Date(row.Date);
      return date >= startDate && date <= endDate;
    })
    .reduce((total, row) => total + row["Rounds Played"], 0);
}

function getPeriodDates(amount, period) {
  // Get the start and end dates for the current and previous periods
  const currentDate = new Date();
  let currentStart, currentEnd, previousStart, previousEnd;

  switch (period) {
    case "day":
      currentStart = new Date(currentDate);
      currentEnd = new Date(currentDate);
      previousStart = new Date(
        currentDate.setDate(currentDate.getDate() - amount)
      );
      previousEnd = new Date(previousStart);
      break;
    case "week":
      const currentWeekDay = currentDate.getDay();
      currentStart = new Date(
        currentDate.setDate(currentDate.getDate() - currentWeekDay)
      );
      currentEnd = new Date(currentStart);
      currentEnd.setDate(currentEnd.getDate() + 6);
      previousStart = new Date(
        currentStart.setDate(currentStart.getDate() - 7)
      );
      previousEnd = new Date(previousStart);
      previousEnd.setDate(previousEnd.getDate() + 6);
      break;
    case "month":
      currentStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      currentEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      previousStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      previousEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );
      break;
    case "year":
      currentStart = new Date(currentDate.getFullYear(), 0, 1);
      currentEnd = new Date(currentDate.getFullYear(), 11, 31);
      previousStart = new Date(currentDate.getFullYear() - 1, 0, 1);
      previousEnd = new Date(currentDate.getFullYear() - 1, 11, 31);
      break;
  }

  return { currentStart, currentEnd, previousStart, previousEnd };
}

function calculatePercentageChange(newVal, oldVal) {
  // Calculate the percentage change, avoiding division by zero
  return oldVal === 0 ? 0 : ((newVal - oldVal) / oldVal) * 100;
}

function formatDate(date) {
  // Format a JavaScript Date object into MM/DD/YY format
  return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
    .getDate()
    .toString()
    .padStart(2, "0")}/${date.getFullYear().toString().substring(2)}`;
}

function formatChange(change) {
  // Determine the icon based on whether the change is positive or negative
  const icon = change >= 0 ? "↑" : "↓";
  const colorClass = change >= 0 ? "text-green" : "text-red";

  // Format the percentage change as a string with an arrow and a color class
  const formattedChange = `${icon} ${Math.abs(change).toFixed(1)}%`;

  // Return the formatted string wrapped in a span with the appropriate color class
  return `<span class="${colorClass}">${formattedChange}</span>`;
}

// Call the function to start processing CSV data
fetchAndProcessCSV();
