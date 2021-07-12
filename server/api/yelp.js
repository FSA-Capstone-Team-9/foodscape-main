const router = require("express").Router();
module.exports = router;
require("dotenv").config();

const yelp = require("yelp-fusion");
const YELP_API_KEY = process.env.YELP_API_KEY;
const client = yelp.client(YELP_API_KEY);

// POST /api/yelp
router.post("/", async (req, res, next) => {
  try {
    const results = await client.search(req.body);
    res.send(results.jsonBody.businesses);
  } catch (error) {
    next(error);
  }
});
