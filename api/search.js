const mongoose = require("mongoose");
const cors = require("micro-cors")({
  allowMethods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowHeaders: ["Authorization", "Content-Type"],
  origin: "http://localhost:3000", // Replace with the origin of your React app
});

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

// Define the Search schema and model
const searchSchema = new mongoose.Schema({
  fullSearchObject: { type: mongoose.Schema.Types.Mixed, required: true }, // Store the whole object
  count: { type: Number, default: 1 }, // Track how many times this search term has been used
});

const Search = mongoose.model("Search", searchSchema);

// Middleware to set CORS headers and handle preflight requests (OPTIONS)
async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");  // Replace with your domain if needed
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PATCH, POST, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Route to get the most frequent search objects
  if (req.method === "GET") {
    try {
      const topSearches = await Search.find().sort({ count: -1 }).limit(10); // Change limit as needed
      res.status(200).json(topSearches);
    } catch (error) {
      console.error("Error fetching top search objects:", error);
      res.status(500).json({ error: "Error fetching top search objects" });
    }
  }

  // Route to track search objects
  else if (req.method === "POST") {
    const fullSearchObject = req.body; // Full object sent in the request body
    const searchTerm = fullSearchObject.term; // Extract the term from the object

    try {
      let searchRecord = await Search.findOne({
        "fullSearchObject.term": searchTerm,
      });

      if (searchRecord) {
        searchRecord.count += 1;
        await searchRecord.save();
      } else {
        searchRecord = new Search({ fullSearchObject });
        await searchRecord.save();
      }

      // Check if more than 1000 records exist, and delete the least used
      const searchCount = await Search.countDocuments();
      if (searchCount > 1000) {
        await Search.findOneAndDelete({}, { sort: { count: 1 } });
      }

      res.status(200).json({ message: "Search object tracked successfully!" });
    } catch (error) {
      console.error("Error tracking search object:", error);
      res.status(500).json({ error: "Error tracking search object" });
    }
  }

  // Handle unsupported methods
  else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

// Apply CORS to the handler
const corsHandler = cors(handler);

// Export the CORS-enabled handler
module.exports = corsHandler;



// const mongoose = require("mongoose");
// const cors = require("micro-cors")();

// mongoose.connect(
//   "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//   }
// );

// // Define the Search schema and model
// const searchSchema = new mongoose.Schema({
//   fullSearchObject: { type: mongoose.Schema.Types.Mixed, required: true }, // Store the whole object
//   count: { type: Number, default: 1 }, // Track how many times this search term has been used
// });

// const Search = mongoose.model("Search", searchSchema);

// // Route to get the most frequent search objects
// async function getTopSearches(req, res) {
//   try {
//     const topSearches = await Search.find().sort({ count: -1 }).limit(10); // You can change the limit as needed
//     res.status(200).json(topSearches); // Return the full objects
//   } catch (error) {
//     console.error("Error fetching top search objects:", error);
//     res.status(500).json({ error: "Error fetching top search objects" });
//   }
// }

// // Route to track search objects
// async function trackSearch(req, res) {
//   const fullSearchObject = req.body; // Full object sent in the request body
//   const searchTerm = fullSearchObject.term; // Extract the term from the object

//   try {
//     let searchRecord = await Search.findOne({ "fullSearchObject.term": searchTerm });

//     if (searchRecord) {
//       searchRecord.count += 1;
//       await searchRecord.save();
//     } else {
//       searchRecord = new Search({ fullSearchObject: fullSearchObject });
//       await searchRecord.save();
//     }

//     const searchCount = await Search.countDocuments();
//     if (searchCount > 1000) {
//       await Search.findOneAndDelete({}, { sort: { count: 1 } });
//     }

//     res.status(200).json({ message: "Search object tracked successfully!" });
//   } catch (error) {
//     console.error("Error tracking search object:", error);
//     res.status(500).json({ error: "Error tracking search object" });
//   }
// }

// const corsHandler = cors((req, res) => {
//   if (req.method === "GET") {
//     return getTopSearches(req, res);
//   } else if (req.method === "POST") {
//     return trackSearch(req, res);
//   } else {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }
// });

// // Use CommonJS module export syntax

// // Apply CORS to the handler and export it
// module.exports = corsHandler;
