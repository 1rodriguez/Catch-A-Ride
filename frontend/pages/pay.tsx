import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import styles from './pay.module.css';
import Box from '@mui/material/Box';

import CheckoutForm from "./api/stripe/CheckoutForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe('pk_test_51MmQOiHyiVnUCDBnIp8na0kxStO35TwuqXHWdzQRP1rFPZLloaTBfPWFTIxiMp9yNHRCHMAv3O29dB2OafAmXBrt00UeB6eBD9');

const PAY_PORT = process.env.NEXT_PUBLIC_PORT;

export default function Payment() {
  const [clientSecret, setClientSecret] = useState("");


  const params = new URLSearchParams(window.location.search);
  const distance = params.get("distance");
  const tip = params.get("tip");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    
    fetch(`http://localhost:${PAY_PORT}/pay/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base: 1000, distance: Number(distance!), tip: Number(tip!) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [distance, tip]);

  const appearance = {
    theme: "night",
    labels: "floating"
  };
  const options = {
    clientSecret: clientSecret,
  };
/* if line 45 breaks please check the options property*/
  return (
    <Box sx={{ backgroundColor: 'whitesmoke', height: '100vh',  left: '15px', right: '15px', position: 'absolute', padding: '5px'}}>
      <Box sx={{ padding: '10px', position: 'absolute', left: '30vw', right: '30vw', top: '20vh', bottom: '20vh'}}>
    <div className="Payment">
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
    </Box>
    </Box>
  );
}