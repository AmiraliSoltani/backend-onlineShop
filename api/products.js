// api/products.js

const mongoose = require("mongoose");

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

export default async function handler(req, res) {
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
