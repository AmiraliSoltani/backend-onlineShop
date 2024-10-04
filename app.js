//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const fs = require("fs"); // Import file system module to read JSON file
const path = require("path");

const app = express();
const cors = require("cors"); // Enable CORS

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your React app origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable cookies and authorization headers
};

app.use(cors(corsOptions));
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Connect to MongoDB Atlas

mongoose.connect(
  "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

// Define the Category schema and model

const categorySchema = new mongoose.Schema({
  categoryPicture: String,
  iconPic: String,
  description: String,
  id: Number,
  order: Number,
  parentId: Number,
  title: String,
  search: [[String]] // This defines search as an array of arrays of strings
});

// Define the Search schema and model
const searchSchema = new mongoose.Schema({
  fullSearchObject: { type: mongoose.Schema.Types.Mixed, required: true }, // Store the whole object
  count: { type: Number, default: 1 }, // Track how many times this search term has been used
});



const Search = mongoose.model("Search", searchSchema);



const Category = mongoose.model("Category", categorySchema);

// Assuming your index.html is in the same directory as your Node.js script
const indexPath = path.join(__dirname, "index.html");

app.get("/", function (req, res) {
  res.sendFile(indexPath);
});

// Route to get the most frequent search terms
// Route to get the most frequent search objects
app.get("/top-searches", async (req, res) => {
  try {
    // Find the top search objects ordered by count in descending order
    const topSearches = await Search.find().sort({ count: -1 }).limit(10); // You can change the limit as needed

    res.status(200).json(topSearches); // Return the full objects
  } catch (error) {
    console.error("Error fetching top search objects:", error);
    res.status(500).json({ error: "Error fetching top search objects" });
  }
});

// Route to track search objects
// Route to track search objects
app.post("/search", async (req, res) => {
  const fullSearchObject = req.body; // Full object sent in the request body
  const searchTerm = fullSearchObject.term; // Extract the term from the object

  try {
    // Check if a search record with the same term already exists
    let searchRecord = await Search.findOne({ "fullSearchObject.term": searchTerm });

    if (searchRecord) {
      // If the search term exists, increment its count
      searchRecord.count += 1;
      await searchRecord.save();
    } else {
      // If the search term doesn't exist, create a new record with the full object
      searchRecord = new Search({ fullSearchObject: fullSearchObject });
      await searchRecord.save();
    }

    // Check the total number of search records
    const searchCount = await Search.countDocuments();

    if (searchCount > 1000) {
      // If more than 1000 records, remove the least frequent one
      await Search.findOneAndDelete({}, { sort: { count: 1 } });
    }

    res.status(200).json({ message: "Search object tracked successfully!" });
  } catch (error) {
    console.error("Error tracking search object:", error);
    res.status(500).json({ error: "Error tracking search object" });
  }
});



// Get all categories
app.get("/categories", function (req, res) {
  Category.find()
    .then((foundCategories) => {
      console.log(foundCategories);
      res.send(foundCategories);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error while fetching categories");
    });
});

// Get a specific category by ID
app.get("/categories/:id", function (req, res) {
  const categoryId = req.params.id;

  Category.findOne({ id: categoryId })
    .then((foundCategory) => {
      if (foundCategory) {
        console.log(foundCategory);
        res.send(foundCategory);
      } else {
        res.status(404).send("Category not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error while fetching category");
    });
});

// Route to insert categories from JSON file
// Route to insert categories from Postman (request body)
app.post("/insert-categories", async (req, res) => {
  try {
    const categoriesArray = req.body; // Expecting an array of categories in the request body
    console.log("body",categoriesArray,"body",req.body)

console.log("categoriesArray",categoriesArray,"body",req.body)
    // Insert categories into the database
    await Category.insertMany(categoriesArray);

    res.status(200).json({ message: "Categories inserted successfully!" });
  } catch (error) {
    console.error("Error inserting categories:", error);
    res.status(500).json({ error: "Error inserting categories" });
  }
});


// DELETE all categories
app.delete("/categories", async (req, res) => {
  try {
    console.log("Deleting all categories...");
    // Deletes all categories
    await Category.deleteMany({});
    res.status(200).json({ message: "All categories deleted" });
  } catch (err) {
    console.error("Error while deleting categories:", err);
    res.status(500).json({ error: "Error while deleting categories" });
  }
});

// MongoDB connection status listeners
const db = mongoose.connection;

// Event listener for successful connection
db.once("connected", () => {
  console.log("Connected to MongoDB Atlas");
});

// Event listener for connection errors
db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Set the port and start the server
const port = process.env.PORT || 3010;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
