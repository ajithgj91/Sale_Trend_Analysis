import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SalesForm.css';

const SalesForm = () => {
  const [sale, setSale] = useState({
    client_id: '',
    customer_name: '',
    address: '',
    contact_number: '',
    payment_type: 'Cash Payment',
    invoice_id: '',
    product_name: '',
    quantity: '',
    amount: '',
    tax: '',
    total: '',
    date: '', // Will set to today's date
  });
  

  // Set default date to current date
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    setSale((prevSale) => ({
      ...prevSale,
      date: currentDate,
    }));
  }, []);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale((prevSale) => {
      const updatedSale = { ...prevSale, [name]: value };

      // Automatically calculate 'total' when 'amount' or 'tax' changes
      if (name === 'amount' || name === 'tax') {
        const amount = parseFloat(updatedSale.amount) || 0;
        const tax = parseFloat(updatedSale.tax) || 0;
        const total = amount + (amount * tax) / 100;
        updatedSale.total = total.toFixed(2); // Ensure two decimal points
      }

      return updatedSale;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    // Log the sale object to confirm the data being sent
    console.log("Submitting Sale Data:", sale);
  
    try {
      // API call to submit the sale data
      const response = await axios.post('http://127.0.0.1:8000/sales/', sale, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        // Notify success and reset form
        alert('Sale added successfully!');
        setSale({
          client_id: '',
          customer_name: '',
          address: '',
          contact_number: '',
          payment_type: 'Cash Payment',
          invoice_id: '',
          product_name: '',
          quantity: '',
          amount: '',
          tax: '',
          total: '',
          date: new Date().toISOString().split('T')[0], // Reset to current date
        });
        navigate('/dashboard'); // Redirect to the dashboard after success
      }
    } catch (error) {
      // Handle and display error details
      console.error('Error details:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.detail || 'Failed to add sale. Please check the data and try again.';
      alert(errorMessage);
    }
  };
  
  return (
    <div className="sales-form-container">
      <h1>New Sales Entry</h1>
      <form onSubmit={handleSubmit}>
      <div className="input-wrapper">
  <label htmlFor="client_id">Client ID</label>
  <input
    type="text"
    id="client_id"
    name="client_id"
    placeholder="Client ID"
    value={sale.client_id}
    onChange={handleChange}
    required
  />
</div>

<div className="input-wrapper">
  <label htmlFor="invoice_id">Invoice ID</label>
  <input
    type="text"
    id="invoice_id"
    name="invoice_id"
    placeholder="Invoice ID"
    value={sale.invoice_id}
    onChange={handleChange}
    required
  />
</div>

<div className="input-wrapper">
  <label htmlFor="customer_name">Customer Name</label>
  <input
    type="text"
    id="customer_name"
    name="customer_name"
    placeholder="Customer Name"
    value={sale.customer_name}
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
            value={sale.address}
            onChange={handleChange}
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            type="text"
            id="contact_number"
            name="contact_number"
            placeholder="Contact Number"
            value={sale.contact_number}
            onChange={handleChange}
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="paymentType">Payment Type</label>
          <select
            id="payment_type"
            name="payment_type"
            value={sale.payment_type}
            onChange={handleChange}
            required
          >
            <option value="Cash Payment">Cash Payment</option>
            <option value="Card Payment">Card Payment</option>
            <option value="UPI Payment">UPI Payment</option>
          </select>
        </div>

        <div className="input-wrapper">
          <label htmlFor="productName">Product Type</label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            placeholder="Product Type"
            value={sale.product_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Quantity"
            value={sale.quantity}
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
            value={sale.amount}
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
            value={sale.tax}
            onChange={handleChange}
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="total">Total</label>
          <input
            type="number"
            step="0.01"
            id="total"
            name="total"
            placeholder="Total"
            value={sale.total}
            readOnly
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={sale.date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save Sale Entry</button>
        <button type="button" className="back-to-home-button" onClick={() => navigate('/dashboard')}>
          Back to Home
        </button>
      </form>
    </div>
  );
};

export default SalesForm;
