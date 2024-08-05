import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
const publishable = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
console.log(publishable)

const stripePromise = loadStripe(publishable);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentProcessing(true);

    const { data: { clientSecret } } = await axios.post('http://localhost:3001/api/payments/create-payment-intent', {
      amount: 1000, // Amount in dollars
    });

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Test User',
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setPaymentProcessing(false);
    } else {
      setError(null);
      setPaymentProcessing(false);
      alert('Payment succeeded!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={paymentProcessing}>Pay</button>
      {error && <div>{error}</div>}
    </form>
  );
};

const PaymentForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentForm;
