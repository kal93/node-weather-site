const request = require("postman-request");

const foreCast = (lng, lat, callback) => {
  const weatherApiUrl = `http://api.weatherstack.com/current?access_key=def3c3713414e0c8579c41aa2f94dd12&query=${lat},${lng}&units=m`;
  console.log(weatherApiUrl);
  request({ url: weatherApiUrl, json: true }, (error, response) => {
    if (error) {
      callback("Low level OS error", undefined);
    } else if (response.body.error) {
      callback("API Error, Location Not found", undefined);
    } else {
      callback(undefined, {
        weather_description: response.body.current.weather_descriptions[0],
        temperate: response.body.current.temperature,
        precip: response.body.current.precip,
      });
    }
  });
};

module.exports = { foreCast };
