// Openweathermap API. Do not share it publicly.
const api = "8e5830007843e1890b12617e60963309"; //Replace with your API

iconImg = document.getElementById("weather-icon");
loc = document.querySelector("#location");
tempC = document.querySelector(".c");
tempF = document.querySelector(".f");
desc = document.querySelector(".desc");
sunriseDOM = document.querySelector(".sunrise");
sunsetDOM = document.querySelector(".sunset");

var updateInterval = 6000;
var timeStampValues = [];
var indoorTempValues = [];
var outdoorTempValues = [];
let long;
let lat;

// setup the range slider and bubble
const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach((wrap) => {
  const range = wrap.querySelector(".range");
  const bubble = wrap.querySelector(".bubble");

  range.addEventListener("input", () => {
    setBubble(range, bubble);
  });
  setBubble(range, bubble);
});

// sets the range bubble and functions as the alerter
function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  console.log(val);
  // check if the arduino data temperature is higher than the wanted temperature
  socket.on("data", function (data) {
    console.log(data);
    if (data >= val) {
      alert("Temperature is higher than wanted temperature!");
    } else if (data <= val) {
      alert("Temperature is lower than wanted temperature!");
    }
  });
}

window.addEventListener("load", () => {
  // Accesing Geolocation of User
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // Storing Longitude and Latitude in variables
      long = position.coords.longitude;
      lat = position.coords.latitude;

      //Draw Line Chart
      const chart = new Chart("tempChart", {
        type: "line",
        data: {
          labels: timeStampValues,
          datasets: [
            {
              label: "Outdoor temp",
              borderColor: "rgba(0,0,255,1)",
              data: outdoorTempValues,
              //  lineTension: 0,
              fill: false,
            },
            {
              label: "Indoor temp",
              borderColor: "rgba(255,0,0,1)",
              data: indoorTempValues,
              //   lineTension: 0,
              fill: false,
            },
          ],
        },
      });

      updateData();

      //Start updating the data at specific intervals
      const interval = setInterval(function () {
        updateData();
        chart.data.datasets[0].data = outdoorTempValues;
        chart.data.datasets[1].data = indoorTempValues;
        chart.update();
      }, updateInterval);
    });
  }
});

function updateData() {
  const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;
  // Using fetch to get data
  fetch(base)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { temp, feels_like } = data.main;
      const place = data.name;
      const { description, icon } = data.weather[0];
      const { sunrise, sunset } = data.sys;

      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      const fahrenheit = (temp * 9) / 5 + 32;

      // Converting Epoch(Unix) time to GMT
      const sunriseGMT = new Date(sunrise * 1000);
      const sunsetGMT = new Date(sunset * 1000);

      // Interacting with DOM to show data
      iconImg.src = iconUrl;
      loc.textContent = `${place}`;
      desc.textContent = `${description}`;
      tempC.textContent = `${temp.toFixed(2)} °C`;
      tempF.textContent = `${fahrenheit.toFixed(2)} °F`;
      sunriseDOM.textContent = `${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
      sunsetDOM.textContent = `${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;

      //Update Chart Data
      var today = new Date();
      var time = today.getHours() + ":" + today.getMinutes();
      outdoorTempValues.push(temp);
      var socket = io();
      socket.on("data", function (data) {
        // Reading the data from the sensor
        console.log(data);
        document.getElementById("sample").innerHTML = data;
        data = data.split("").splice(1 - 1, 4); // getting rid of the °C
        data = Number(data.join(""));
        indoorTempValues.push(data); // Push data from sensor
      });
      timeStampValues.push(time);
    });
}
