import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PurchaseEntry.css";

const PurchaseEntry = () => {
  const [purchase, setPurchase] = useState({
    supplier_id: "",
    supplier_name: "",
    address: "",
    contact_number: "",
    payment_type: "Cash Payment",
    purchase_id: "",
    product_type: "",
    amount: "",
    tax: "",
    net_amount: "",
    date: "", // assuming this is the purchase date
  });

  // Set default date to current date
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    setPurchase((prevPurchase) => ({
      ...prevPurchase,
      date: currentDate,
    }));
  }, []);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchase((prevPurchase) => {
      const updatedPurchase = { ...prevPurchase, [name]: value };

      // Automatically calculate 'netAmount' when 'amount' or 'tax' changes
      if (name === "amount" || name === "tax") {
        const amount = parseFloat(updatedPurchase.amount) || 0;
        const tax = parseFloat(updatedPurchase.tax) || 0;
        const netAmount = amount + (amount * tax) / 100;
        updatedPurchase.net_amount = netAmount.toFixed(2); // Ensure two decimal points
      }

      return updatedPurchase;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/purchases", purchase, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Purchase entry saved successfully!");
        const currentDate = new Date().toISOString().split("T")[0]; // Reset to current date
        setPurchase({
          supplier_id: "",
          supplier_name: "",
          address: "",
          contact_number: "",
          payment_type: "Cash Payment",
          purchase_id: "",
          product_type: "",
          amount: "",
          tax: "",
          net_amount: "",
          date: currentDate,
        });
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      alert("Failed to save the purchase data. Please try again.");
    }
  };

  return (
    <div className="purchase-entry-container">
      <h1>New Purchase Entry</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label htmlFor="supplier_name">Supplier Name</label>
          <input
            type="text"
            id="supplier_name"
            name="supplier_name"
            placeholder="Supplier Name"
            value={purchase.supplier_name}
            onChange={handleChange}
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            value={purchase.address}
            onChange={handleChange}
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="contact_number">Contact Number</label>
          <input
            type="text"
            id="contact_number"
            name="contact_number"
            placeholder="Contact Number"
            value={purchase.contact_number}
            onChange={handleChange}
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="payment_type">Payment Type</label>
          <select
            id="payment_type"
            name="payment_type"
            value={purchase.payment_type}
            onChange={handleChange}
            required
          >
            <option value="Cash Payment">Cash Payment</option>
            <option value="Card Payment">Card Payment</option>
            <option value="UPI Payment">UPI Payment</option>
          </select>
        </div>

        <div className="input-wrapper">
          <label htmlFor="purchase_id">Reference Number</label>
          <input
            type="text"
            id="purchase_id"
            name="purchase_id"
            placeholder="Reference Number"
            value={purchase.purchase_id}
            onChange={handleChange}
            required
          />
        </div>
              <div className="input-wrapper">
           <label htmlFor="supplier_id">Supplier ID</label>
        <input
            type="text"
            id="supplier_id"
            name="supplier_id"
            placeholder="Supplier ID"
            value={purchase.supplierId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="product_type">Product Type</label>
          <input
            type="text"
            id="product_type"
            name="product_type"
            placeholder="Product Type"
            value={purchase.product_type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="date">Purchase Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={purchase.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            step="0.01"
            id="amount"
            name="amount"
            placeholder="Amount"
            value={purchase.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="tax">GST (%)</label>
          <input
            type="number"
            step="0.01"
            id="tax"
            name="tax"
            placeholder="GST (%)"
            value={purchase.tax}
            onChange={handleChange}
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="net_amount">Net Amount</label>
          <input
            type="number"
            step="0.01"
            id="net_amount"
            name="net_amount"
            placeholder="Net Amount"
            value={purchase.net_amount}
            readOnly
          />
        </div>

        <button type="submit">Save Purchase Entry</button>
        <button
          className="back-to-home-button"
          onClick={() => (window.location.href = "/dashboard")}
          type="button"
        >
          Back to Home
        </button>
      </form>
    </div>
  );
};

export default PurchaseEntry;
