//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

// mongoose.connect("mongodb://127.0.0.1:27017/onlineShop", {
//   useNewUrlParser: true,
// });

mongoose.connect(
  "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

const productSchema = new mongoose.Schema({
  title: String,
  _id: Number,
  comments: [
    {
      vote: Number,
      memberName: String,
      date: {
        day: Number,
        month: Number,
        year: Number,
      },
      srcOfAvatar: Number,
      data: {
        title: String,
        body: String,
      },
    },
  ],
  title_En: String,
  description: String,
  price: Number,
  off: String,
  offerTime: String,
  categoryId: Number,
  categoryAttributes: [
    {
      id: String,
      items: [
        {
          id: Number,
          attItem: Number,
        },
      ],
      count: Number,
    },
  ],
  guarantee: {
    hasGuarantee: Boolean,
    guranteeDate: String,
    guranteeName: String,
  },
  productPic: {
    grey: String,
    grey2: String,
    grey3: String,
    grey4: String,
  },
  videoUrl: String,
  vote: Number,
  dailyRentalRate: [Number],
  visited: Number,
  sold: Number,
});

const Product = mongoose.model("products", productSchema);
app.get("/", function (req, res) {
  res.send("hi");
});
app.get("/products", function (req, res) {
  // Use the "Product" model to find all products
  Product.find()
    .then((foundProducts) => {
      console.log(foundProducts);
      res.send(foundProducts); // Send the products as a response
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error while fetching products");
    });
});

app.get("/products/:id", function (req, res) {
  const productId = req.params.id;

  // Use the "Product" model to find the specific product by ID
  Product.findById(productId)
    .then((foundProduct) => {
      if (foundProduct) {
        console.log(foundProduct);
        res.send(foundProduct);
      } else {
        res.status(404).send("Product not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error while fetching product");
    });
});

app.get("/products/category/:categoryId", function (req, res) {
  const categoryId = req.params.categoryId;

  // Use the "Product" model to find products based on the category ID
  Product.find({ categoryId: categoryId })
    .then((foundProducts) => {
      console.log(foundProducts);
      res.send(foundProducts);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error while fetching products");
    });
});

const categorySchema = new mongoose.Schema({
  categoryPicture: String,
  iconPic: String,
  description: String,
  id: Number,
  order: Number,
  parentId: Number,
  title: String,
});

const Category = mongoose.model("categories", categorySchema);

app.get("/categories", function (req, res) {
  // Use the "Category" model to find all categories
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

app.get("/categories/:id", function (req, res) {
  const categoryId = req.params.id;

  // Use the "Category" model to find the specific category by ID
  // Use the "Product" model to find the specific product by custom ID
  Category.findOne({ id: categoryId })
    .then((foundCategory) => {
      if (foundCategory) {
        console.log(foundCategory);
        res.send(foundCategory);
      } else {
        res.status(404).send("category not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error while fetching category");
    });
});

const db = mongoose.connection;

// Event listener for successful connection
db.once("connected", () => {
  console.log("Connected to MongoDB Atlas");
});

// Event listener for connection errors
db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

const port =3010;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});