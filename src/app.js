const path = require("path");
const express = require("express");
const hbs = require("hbs");
const chalk = require("chalk");
const geoCode = require("./utils/geocode");
const foreCast = require("./utils/foreCast");

const log = console.log;

log(__dirname);
log(__filename);

log(path.join(__dirname, "../public"));

// 1.Define Paths for express configs
const app = express();
const port = process.env.PORT || 3000;

const pubDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// 2. Set up handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
// set handlebar configs for partials
hbs.registerPartials(partialsPath);

// 3. Set up static directory contents to serve
app.use(express.static(pubDirPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Maaz",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    name: "Maaz",
    helpText: "Help text",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Maaz",
    imagePath: "/img/robot.png",
  });
});

app.get("/weather", (req, res) => {
  log(req.query.address);
  if (!req.query.address) {
    return res.send({
      error: "Must provide address",
    });
  }
  geoCode.geoCode(req.query.address, (geoCodeError, geoCodeData) => {
    console.log(
      chalk.green.inverse("Geocode Results :"),
      JSON.stringify(geoCodeData)
    );
    console.log(chalk.red.inverse("Geocode Error :"), geoCodeError);
    if (geoCodeError) {
      return res.send({
        query: req.query.address,
        error: geoCodeError,
      });
    }
    foreCast.foreCast(
      geoCodeData.lng,
      geoCodeData.lat,
      (foreCastError, foreCastData) => {
        console.log(
          chalk.green.inverse("Forecast Results :"),
          JSON.stringify(foreCastData)
        );
        console.log(chalk.red.inverse("Forecaset Error :"), foreCastError);
        if (foreCastError) {
          return res.send({
            query: req.query.address,
            error: foreCastError,
          });
        }
        res.send({
          query: req.query.address,
          location: geoCodeData.location,
          foreCastData,
        });
      }
    );
  });
  //   res.send({
  //     address: req.query.address,
  //     foreCast: "Cloudy",
  //     location: "USA",
  //   });
});

app.get("/products", (req, res) => {
  log(req.query);
  if (!req.query.search) {
    return res.send({
      error: "Must provide a search term",
    });
  }
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    notFoundMsg: "Help article not found.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    notFoundMsg: "Page not found.",
  });
});
app.listen(port, () => {
  console.log(chalk.yellowBright.inverse("Server is up on port 3000"));
});
