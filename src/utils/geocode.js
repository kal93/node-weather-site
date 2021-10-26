const request = require("postman-request");

const mapBoxToken =
  "pk.eyJ1Ijoiam9obmRvZXVwcyIsImEiOiJja3YxeDAyeGowMzI0MnRvMHZ1a3VzZjlvIn0.qlcdNsrI4rVFjnwIvLWR8A";

const geoCode = (addr, callback) => {
  const geoCodeApiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    addr
  )}.json?access_token=${mapBoxToken}`;
  console.log(geoCodeApiUrl);
  // trigger api request
  request({ url: geoCodeApiUrl, json: true }, (error, response) => {
    if (error) {
      callback("Low level os error", undefined);
    } else if (response.body.features.length === 0) {
      callback("Location not found", undefined);
    } else {
      callback(undefined, {
        lng: response.body.features[0].center[0],
        lat: response.body.features[0].center[1],
        location: response.body.features[0].place_name,
      });
    }
  });
};

module.exports = { geoCode };
