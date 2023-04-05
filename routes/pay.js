var express = require("express");
var router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PK);

const distance_rate = 15; // price (cents) per paid kilometer

router.use(express.static("public"));
router.use(express.json());

const calculateOrderAmount = (base, dist, tip) => {
  /* ride schema:  { 
    base: $PRICE,
    distance: $KM,
    tip: $TIP
  }
  Really simple pricing scheme with a base of, say $5, and then some price per km, say $0.15/km
  */

  const price = base + dist * distance_rate + tip;
  return price; // NOTE: in cents
};

router.post("/create-payment-intent", async (req, res) => {
  const { base, distance, tip } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(base, distance, tip),
    currency: "cad",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = router;
