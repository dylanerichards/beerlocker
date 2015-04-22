// Get the packages we need
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Beer = require("./models/beer");

// Connect to the beerlocker MongoDB
mongoose.connect("mongodb://localhost:27017/beerlocker");

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

// Create Express application
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));


// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.get("/", function(req, res) {
  res.json({ message: "You are running dangerously low on beer!" });
});

// Create a new route with the prefix /beers
var beersRoute = router.route("/beers");

// Create entpoint /api/beers for POSTS
beersRoute.post(function(req, res) {
  // Create a new instance of the Beer model
  var beer = new Beer();

  // Set the beer properties that came from the POST data
  beer.name = req.body.name;
  beer.type = req.body.type;
  beer.quantity = req.body.quantity;

  beer.save(function(err) {
    if(err)
      res.send(err);
    res.json({ message: "Beer added to the locker!", data: beer });
  });
});

// Create endpoint /api/beers for GET
beersRoute.get(function(req, res) {
  // Use the Beer model to find all beer
  Beer.find(function(err, beers) {
    if(err)
      res.send(err);

    res.json(beers);
  });
});

// Register all our routes with/api
app.use("/api", router);

// Start the server
app.listen(port);
console.log("Insert beer on port " + port);
