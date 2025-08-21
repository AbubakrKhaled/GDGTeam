import React, { useState } from "react";
import axios from "axios";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    totalPrice: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/orders/with-address`,
        formData
      );
      alert("✅ Order created successfully!");
    } catch (err) {
      alert("❌ Error creating order");
    }
  };

  return (
    <div className="checkout-form">
      <h2>Shipping Address</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <input
          name="postalCode"
          placeholder="Postal Code"
          onChange={handleChange}
        />
        <input name="country" placeholder="Country" onChange={handleChange} />
        <input
          name="totalPrice"
          placeholder="Total Price"
          type="number"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
