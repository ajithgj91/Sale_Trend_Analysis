import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './sales.css';

const SalesForm = () => {
  const [formData, setFormData] = useState({
    clientId: '',
    customerName: '',
    address: '',
    contactNumber: '',
    paymentType: '',
    invoiceId: '',
    productName: '',
    quantity: 0,
    amount: 0.0,
    tax: 0.0,
    total: 0.0,
    date: '',
  });

  const [message, setMessage] = useState('');

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/sales/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Sale added successfully');
        console.log('Sale added:', data);
      } else {
        setMessage('Error: ' + data.detail);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Sale Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Client ID</label>
          <input
            type="text"
            name="clientId"
            value={formData.clientId}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Payment Type</label>
          <input
            type="text"
            name="paymentType"
            value={formData.paymentType}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Invoice ID</label>
          <input
            type="text"
            name="invoiceId"
            value={formData.invoiceId}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Tax</label>
          <input
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Total</label>
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Add Sale</button>
      </form>

      <p>{message}</p>
    </div>
  );
};

export default SalesForm;
