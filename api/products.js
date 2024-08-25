// api/products.js

const mongoose = require("mongoose");
const cors = require("micro-cors")();

// Import your Mongoose model

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

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Use the "Product" model to find all products
    const foundProducts = await Product.find();
    console.log(foundProducts);
    res.status(200).json(foundProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while fetching products" });
  }
}

const updateProductSpecifications = async () => {
  await Product.updateOne(
    { _id: 1 },
    {
      $set: {
        specifications: [
          { key: "Material", value: "Cotton" },
          { key: "Suitable Season", value: "Spring and Autumn" },
          { key: "Fit", value: "Regular" },
          { key: "Color", value: "Red" },
          { key: "Size", value: "S, M, L, XL" },
          { key: "Pattern", value: "Solid" },
          { key: "Neckline", value: "Round Neck" },
          { key: "Sleeve Length", value: "Long Sleeve" },
          { key: "Care Instructions", value: "Machine Washable" },
          { key: "Origin", value: "Made in Turkey" }
        ]
      }
    }
  );
};

updateProductSpecifications().then(() => {
  console.log('Product specifications updated successfully');
}).catch(err => {
  console.error('Error updating product specifications:', err);
});
// Apply CORS middleware to the handler
const corsHandler = cors(handler);

// Export the modified handler
export default corsHandler;

// {
//   "routes": [
//     { "src": "/products", "dest": "/api/products.js" },
//     { "src": "/categories", "dest": "/api/categories.js" },
//     { "src": "/(.*)", "dest": "/index.html" }
//   ],
