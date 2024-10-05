//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Enable body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up CORS headers manually
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();  // Continue to the next middleware or route handler
});
// Connect to MongoDB Atlas
mongoose.connect(
  "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

// Assuming your index.html is in the same directory as your Node.js script
const indexPath = path.join(__dirname, "index.html");

app.get("/", function (req, res) {
  res.sendFile(indexPath);
});

// Import and set up category routes
const categoriesHandler = require('./api/categories');
app.use('/categories', categoriesHandler);

// Import and set up product routes
const productsHandler = require('./api/products');
app.use('/products', productsHandler);


const productHandler = require('./api/product/[id]');
app.use('/product/:id', productHandler); // Route expects 'id' as a parameter


// Import and set up search routes
const searchHandler = require('./api/search');
app.use('/search', searchHandler);

// MongoDB connection status listeners
const db = mongoose.connection;

db.once("connected", () => {
  console.log("Connected to MongoDB Atlas");
});

db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Set the port and start the server
const port = process.env.PORT || 3010;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});






// //jshint esversion:6

// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const mongoose = require("mongoose");
// const fs = require("fs"); // Import file system module to read JSON file
// const path = require("path");

// const app = express();
// const cors = require("cors"); // Enable CORS

// app.use(bodyParser.json());
// app.use(cors()); // Enable CORS for all routes
// const corsOptions = {
//   origin: "http://localhost:3000", // Replace with your React app origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Enable cookies and authorization headers
// };

// app.use(cors(corsOptions));
// app.set("view engine", "ejs");

// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// // Connect to MongoDB Atlas

// mongoose.connect(
//   "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//   }
// );

// // Define the Category schema and model

// const categorySchema = new mongoose.Schema({
//   categoryPicture: String,
//   iconPic: String,
//   description: String,
//   id: Number,
//   order: Number,
//   parentId: Number,
//   title: String,
//   search: [[String]] // This defines search as an array of arrays of strings
// });

// // Define the Search schema and model
// const searchSchema = new mongoose.Schema({
//   fullSearchObject: { type: mongoose.Schema.Types.Mixed, required: true }, // Store the whole object
//   count: { type: Number, default: 1 }, // Track how many times this search term has been used
// });



// const Search = mongoose.model("Search", searchSchema);



// const Category = mongoose.model("Category", categorySchema);

// // Assuming your index.html is in the same directory as your Node.js script
// const indexPath = path.join(__dirname, "index.html");

// app.get("/", function (req, res) {
//   res.sendFile(indexPath);
// });

// // Route to get the most frequent search terms
// // Route to get the most frequent search objects
// app.get("/top-searches", async (req, res) => {
//   try {
//     // Find the top search objects ordered by count in descending order
//     const topSearches = await Search.find().sort({ count: -1 }).limit(10); // You can change the limit as needed

//     res.status(200).json(topSearches); // Return the full objects
//   } catch (error) {
//     console.error("Error fetching top search objects:", error);
//     res.status(500).json({ error: "Error fetching top search objects" });
//   }
// });

// // Route to track search objects
// // Route to track search objects
// app.post("/search", async (req, res) => {
//   const fullSearchObject = req.body; // Full object sent in the request body
//   const searchTerm = fullSearchObject.term; // Extract the term from the object

//   try {
//     // Check if a search record with the same term already exists
//     let searchRecord = await Search.findOne({ "fullSearchObject.term": searchTerm });

//     if (searchRecord) {
//       // If the search term exists, increment its count
//       searchRecord.count += 1;
//       await searchRecord.save();
//     } else {
//       // If the search term doesn't exist, create a new record with the full object
//       searchRecord = new Search({ fullSearchObject: fullSearchObject });
//       await searchRecord.save();
//     }

//     // Check the total number of search records
//     const searchCount = await Search.countDocuments();

//     if (searchCount > 1000) {
//       // If more than 1000 records, remove the least frequent one
//       await Search.findOneAndDelete({}, { sort: { count: 1 } });
//     }

//     res.status(200).json({ message: "Search object tracked successfully!" });
//   } catch (error) {
//     console.error("Error tracking search object:", error);
//     res.status(500).json({ error: "Error tracking search object" });
//   }
// });



// // Get all categories
// app.get("/categories", function (req, res) {
//   Category.find()
//     .then((foundCategories) => {
//       console.log(foundCategories);
//       res.send(foundCategories);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error while fetching categories");
//     });
// });

// // Get a specific category by ID
// app.get("/categories/:id", function (req, res) {
//   const categoryId = req.params.id;

//   Category.findOne({ id: categoryId })
//     .then((foundCategory) => {
//       if (foundCategory) {
//         console.log(foundCategory);
//         res.send(foundCategory);
//       } else {
//         res.status(404).send("Category not found");
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error while fetching category");
//     });
// });

// // Route to insert categories from JSON file
// // Route to insert categories from Postman (request body)
// app.post("/insert-categories", async (req, res) => {
//   try {
//     const categoriesArray = req.body; // Expecting an array of categories in the request body
//     console.log("body",categoriesArray,"body",req.body)

// console.log("categoriesArray",categoriesArray,"body",req.body)
//     // Insert categories into the database
//     await Category.insertMany(categoriesArray);

//     res.status(200).json({ message: "Categories inserted successfully!" });
//   } catch (error) {
//     console.error("Error inserting categories:", error);
//     res.status(500).json({ error: "Error inserting categories" });
//   }
// });


// // DELETE all categories
// app.delete("/categories", async (req, res) => {
//   try {
//     console.log("Deleting all categories...");
//     // Deletes all categories
//     await Category.deleteMany({});
//     res.status(200).json({ message: "All categories deleted" });
//   } catch (err) {
//     console.error("Error while deleting categories:", err);
//     res.status(500).json({ error: "Error while deleting categories" });
//   }
// });


// const productSchema = new mongoose.Schema({
//   id: {
//     type: Number,
//     unique: true, // Ensure the id is unique
//     required: true, // Make it required
//   },
//   title: String,
//   comments: [
//     {
//       vote: Number,
//       memberName: String,
//       date: {
//         day: Number,
//         month: Number,
//         year: Number,
//       },
//       srcOfAvatar: Number,
//       data: {
//         title: String,
//         body: String,
//       },
//     },
//   ],
//   title_En: String,
//   description: String,
//   price: Number,
//   off: String,
//   offerTime: String,
//   categoryId: Number,
//   categoryAttributes: [
//     {
//       id: String,  // id of the category attribute
//       items: [
//         {
//           id: Number,  // id of the item
//           attItem: Number,  // attItem inside the item
//         },
//       ],
//       count: Number, // count of items
//     },
//   ],
//   guarantee: {
//     hasGuarantee: Boolean,
//     guranteeDate: String,
//     guranteeName: String,
//   },
//   productPic: {
//     grey: String,
//     grey2: String,
//     grey3: String,
//     grey4: String,
//   },
//   videoUrl: String,
//   vote: Number,
//   dailyRentalRate: [Number],
//   visited: Number,
//   sold: Number,
//   productHighlights: String,
//   specifications: {
//     material: String,
//     fit: String,
//     suitableSeason: String,
//     pattern: String,
//     occasion: String,
//     sleeveLength: String,
//     collarType: String,
//     closureType: String,
//     careInstructions: String,
//   },
// });


// // Create the Product model
// const Product = mongoose.model("Product", productSchema);
// app.get("/product/:id", async (req, res) => {
//   const productId = req.params.id;  // Get the custom ID from request params
//   try {
//     const foundProduct = await Product.findOne({ id: productId });  // Find product by custom 'id'
//     if (foundProduct) {
//       // Increment the visited count if needed
//       foundProduct.visited = (foundProduct.visited || 0) + 1;
//       await foundProduct.save();
//       res.send(foundProduct);
//     } else {
//       res.status(404).send(`Product with ID ${productId} not found`);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error while fetching product");
//   }
// });

// app.patch("/product/:id", async (req, res) => {
//   const productId = req.params.id;  // Custom 'id'
//   const { vote, data, srcOfAvatar, memberName } = req.body;

//   try {
//     const updatedProduct = await Product.findOneAndUpdate(
//       { id: productId },  // Query by custom 'id'
//       {
//         $push: {
//           comments: {
//             vote: vote,
//             memberName: memberName,
//             date: {
//               day: new Date().getDate(),
//               month: new Date().getMonth() + 1,
//               year: new Date().getFullYear(),
//             },
//             srcOfAvatar: srcOfAvatar,
//             data: {
//               title: data.title,
//               body: data.body,
//             },
//           },
//         },
//       },
//       { new: true }  // Return the updated document
//     );

//     if (updatedProduct) {
//       res.status(200).send(updatedProduct);
//     } else {
//       res.status(404).send(`Product with ID ${productId} not found`);
//     }
//   } catch (error) {
//     console.error("Error updating product: ", error);
//     res.status(500).send("Error while updating product");
//   }
// });

// app.patch("/product/:id/visit", async (req, res) => {
//   const productId = req.params.id;  // Custom 'id'

//   try {
//     const updatedProduct = await Product.findOneAndUpdate(
//       { id: productId },  // Find the product by custom 'id'
//       { $inc: { visited: 1 } },  // Increment the 'visited' field by 1
//       { new: true }  // Return the updated document
//     );

//     if (updatedProduct) {
//       res.status(200).send(updatedProduct);
//     } else {
//       res.status(404).send(`Product with ID ${productId} not found`);
//     }
//   } catch (error) {
//     console.error("Error updating visit count: ", error);
//     res.status(500).send("Error while updating visit count");
//   }
// });

// app.get("/products", async (req, res) => {
//   try {
//     const products = await Product.find();  // Fetch all products from the database
//     res.status(200).send(products);  // Send the products as a response
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).send("Error while fetching products");
//   }
// });

// app.post("/products", async (req, res) => {
//   const productData = req.body; // The product data sent in the request body

//   try {
//     const newProduct = new Product(productData); // Create a new product instance with the data
//     await newProduct.save(); // Save the new product to the database

//     res.status(201).send(newProduct); // Respond with the newly created product
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).send("Error while creating product");
//   }
// });


// // MongoDB connection status listeners
// const db = mongoose.connection;

// // Event listener for successful connection
// db.once("connected", () => {
//   console.log("Connected to MongoDB Atlas");
// });

// // Event listener for connection errors
// db.on("error", (err) => {
//   console.error(`MongoDB connection error: ${err}`);
// });

// // Set the port and start the server
// const port = process.env.PORT || 3010;
// app.listen(port, function () {
//   console.log(`Server started on port ${port}`);
// });
