import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './AddSupplier.css';

function AddSupplier() {
  const [supplier, setSupplier] = useState({
    supplierId: '',     // New field for Supplier ID
    name: '',
    email: '',
    contactNumber: '',  // Ensure it's treated as a string
    gstNumber: '',      // Added GST Number
    state: '',          // Added State
    address: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier({
      ...supplier,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare supplier data as JSON
    const supplierData = {
      supplier_id: supplier.supplierId,  // Include Supplier ID
      name: supplier.name,
      email: supplier.email,
      contact_number: supplier.contactNumber,
      gst_number: supplier.gstNumber,  // Include GST Number
      state: supplier.state,          // Include State
      address: supplier.address,
    };

    try {
      // Sending supplier data as JSON
      const response = await axios.post("http://127.0.0.1:8000/suppliers/", supplierData, {
        headers: {
          "Content-Type": "application/json",  // Set content type to JSON
        },
      });

      // If successful, reset the form and show a success message
      alert("Supplier added successfully!");
      setSupplier({
        supplierId: '',
        name: '',
        email: '',
        contactNumber: '',
        gstNumber: '',
        state: '',
        address: '',
      });
      navigate('/dashboard');  // Redirect to dashboard or suppliers list
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      alert("Failed to add supplier. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Add New Supplier</h1>
      <form onSubmit={handleSubmit}>
        <label>Supplier ID:</label>
        <input
          type="text"
          name="supplierId"
          placeholder="Enter supplier ID"
          value={supplier.supplierId}
          onChange={handleChange}
          required
        />

        <label>Supplier Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter supplier name"
          value={supplier.name}
          onChange={handleChange}
          required
        />

        <label>Mail Id:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Mail Id"
          value={supplier.email}
          onChange={handleChange}
          required
        />

        <label>Contact Number:</label>
        <input
          type="text"  // Keep this as a text field for phone numbers
          name="contactNumber"
          placeholder="Enter contact number"
          value={supplier.contactNumber}
          onChange={handleChange}
          required
        />

        <label>GST Number:</label>
        <input
          type="text"
          name="gstNumber"
          placeholder="Enter GST number"
          value={supplier.gstNumber}
          onChange={handleChange}
          required
        />

        <label>State:</label>
        <input
          type="text"
          name="state"
          placeholder="Enter state"
          value={supplier.state}
          onChange={handleChange}
          required
        />

        <label>Address:</label>
        <input
          type="text"
          name="address"
          placeholder="Enter address"
          value={supplier.address}
          onChange={handleChange}
          required
        />

        <div className="button-group">
          <button type="submit">Save Supplier</button>
          <button type="button" className="cancel" onClick={() => navigate('/dashboard')}>
            Back to Home
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSupplier;
