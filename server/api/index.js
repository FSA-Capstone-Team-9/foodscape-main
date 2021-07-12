const router = require("express").Router();
module.exports = router;
router.use("/yelp", require("./yelp"));
router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// require("dotenv").config();
// const YELP_API_KEY = process.env.YELP_API_KEY;
// const axios = require("axios");
// const searching = async (location) => {
//   try {
//     console.log(YELP_API_KEY);
//     const apiEndpoint = `https://api.yelp.com/v3/businesses/search/?term=food&location=${location}`;
//     const response = await axios.get(apiEndpoint, {
//       headers: {
//         Authorization: `Bearer ${YELP_API_KEY}`,
//       },
//     });
//     console.log(response.businesses);
//   } catch (error) {
//     console.log(error);
//   }
// };

// searching("NYC");

/*

// Yelp Fusion Module
require("dotenv").config();
const yelp = require("yelp-fusion");

//const express = require("express")
// const app =  express();

// app.use(express.json());

const YELP_API_KEY = process.env.YELP_API_KEY;
const client = yelp.client(YELP_API_KEY);

// sample request
const searchRequest = {
  term: "food",
  location: "new york, ny",
};

app.get("/", async (req, res, next) => {
    try {
        const results = await client.search(searchRequest);
        console.log(results);
    } catch (error) {
        next(error)
    }
})


/*
const searching = async () => {
  try {
    const results = await client.search({searchRequest});
    // sample output
    results.jsonBody.businesses.forEach((result) => console.log(result.name));
  } catch (error) {
    console.log(error);
  }
};

searching();
*/
