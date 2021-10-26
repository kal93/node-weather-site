console.log("Client js loaded...");

fetch("https://puzzle.mead.io/puzzle").then((response) => {
  response.json().then((data) => {
    console.log(data);
  });
});

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const message1 = document.querySelector("#message-1");
const message2 = document.querySelector("#message-2");

weatherForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const location = search.value;
  console.log("Testing....", location);
  searchWeatherByLocation(location, (data) => {
    console.log(data, "<<<");
  });
});

const searchWeatherByLocation = (location, callback) => {
  message1.textContent = "Loading...";
  fetch(`/weather?address=${location}`).then((response, error) => {
    response.json().then((data) => {
      if (data.error) {
        console.log("Error...", data.error);
        message2.innerHTML = data.error;
        message1.innerHTML = "";
      } else {
        console.log("Data", data);
        message1.innerHTML = `Current temperature at ${data.location} is ${
          data.foreCastData.temperate
        } ${"o".sup()} C and forecast is 
          ${data.foreCastData.weather_description} with ${
          data.foreCastData.precip
        }% change of rain. Humidity is ${
          data.foreCastData.humidity
        } and it feels like ${data.foreCastData.feelslike} ${"o".sup()} C.`;
        message2.innerHTML = "";
      }
      callback(data);
    });
  });
};
