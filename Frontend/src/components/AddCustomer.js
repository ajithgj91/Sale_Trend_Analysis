import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './AddCustomer.css';

function AddCustomer() {
  const [customer, setCustomer] = useState({
    clientId: '',   // New field for Client ID
    name: '',
    email: '',
    contactNumber: '',
    gstNumber: '',  // Field for GST Number
    state: '',      // Field for State
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare customer data as JSON
    const customerData = {
      client_id: customer.clientId,  // Include Client ID
      name: customer.name,
      email: customer.email,
      contact_number: customer.contactNumber,
      gst_number: customer.gstNumber,  // Include GST Number
      state: customer.state,           // Include State
      address: customer.address,
    };

    try {
      // Sending customer data as JSON
      const response = await axios.post("http://127.0.0.1:8000/customers/", customerData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If successful, reset the form and show a success message
      alert("Customer added successfully!");
      setCustomer({
        clientId: '',
        name: '',
        email: '',
        contactNumber: '',
        gstNumber: '',
        state: '',
        address: '',
      });
      navigate('/dashboard');
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      alert("Failed to add customer. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Add New Customer</h1>
      <form onSubmit={handleSubmit}>
        <label>Client ID:</label>
        <input
          type="text"
          name="clientId"
          placeholder="Enter client ID"
          value={customer.clientId}
          onChange={handleChange}
          required
        />

        <label>Company Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter company name"
          value={customer.name}
          onChange={handleChange}
          required
        />

        <label>Mail Id:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Mail Id"
          value={customer.email}
          onChange={handleChange}
          required
        />

        <label>Contact Number:</label>
        <input
          type="text"
          name="contactNumber"
          placeholder="Enter contact number"
          value={customer.contactNumber}
          onChange={handleChange}
          required
        />

        <label>GST Number:</label>
        <input
          type="text"
          name="gstNumber"
          placeholder="Enter GST number"
          value={customer.gstNumber}
          onChange={handleChange}
        />

        <label>State:</label>
        <input
          type="text"
          name="state"
          placeholder="Enter state"
          value={customer.state}
          onChange={handleChange}
        />

        <label>Address:</label>
        <input
          type="text"
          name="address"
          placeholder="Enter address"
          value={customer.address}
          onChange={handleChange}
          required
        />

        <button type="submit">Save Customer</button>

        <button className="cancel" onClick={() => (window.location.href = "dashboard/")}>
          Back to Home
        </button>
      </form>
    </div>
  );
}

export default AddCustomer;
