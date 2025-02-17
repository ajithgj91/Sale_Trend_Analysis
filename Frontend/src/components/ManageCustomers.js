import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./ManageCustomers.css";

function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [clientIdSearchTerm, setClientIdSearchTerm] = useState(""); // Search by Client ID
  const [stateSearchTerm, setStateSearchTerm] = useState(""); // Search by State
  const [editingCustomer, setEditingCustomer] = useState(null);
  const navigate = useNavigate(); 

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/customers/");
      setCustomers(response.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleClientIdSearch = (e) => {
    setClientIdSearchTerm(e.target.value);
  };

  const handleStateSearch = (e) => {
    setStateSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/customers/${id}`);
      alert("Customer deleted successfully!");
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert("Failed to delete customer.");
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/customers/${editingCustomer.id}`,
        editingCustomer
      );
      alert("Customer updated successfully!");
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Failed to update customer.");
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.client_id
        .toString()
        .toLowerCase()
        .includes(clientIdSearchTerm.toLowerCase()) &&
      customer.state.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Manage Customer Database</h1>
      <input
        type="text"
        placeholder="Search by client ID"
        value={clientIdSearchTerm}
        onChange={handleClientIdSearch}
      />
      <input
        type="text"
        placeholder="Search by state"
        value={stateSearchTerm}
        onChange={handleStateSearch}
      />
      <table>
        <thead>
          <tr>
            <th>Client ID</th>
            <th>Company Name</th>
            <th>Mail Id</th>
            <th>Contact Number</th>
            <th>GST Number</th>
            <th>State</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>
                {editingCustomer && editingCustomer.id === customer.id ? (
                  <input
                    type="text"
                    value={editingCustomer.client_id}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        client_id: e.target.value,
                      })
                    }
                  />
                ) : (
                  customer.client_id
                )}
              </td>
              <td>
                {editingCustomer && editingCustomer.id === customer.id ? (
                  <input
                    type="text"
                    value={editingCustomer.name}
                    onChange={(e) =>
                      setEditingCustomer({ ...editingCustomer, name: e.target.value })
                    }
                  />
                ) : (
                  customer.name
                )}
              </td>
              <td>
                {editingCustomer && editingCustomer.id === customer.id ? (
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) =>
                      setEditingCustomer({ ...editingCustomer, email: e.target.value })
                    }
                  />
                ) : (
                  customer.email
                )}
              </td>
              <td>
                {editingCustomer && editingCustomer.id === customer.id ? (
                  <input
                    type="text"
                    value={editingCustomer.contact_number}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        contact_number: e.target.value,
                      })
                    }
                  />
                ) : (
                  customer.contact_number
                )}
              </td>
              <td>
                {editingCustomer && editingCustomer.id === customer.id ? (
                  <input
                    type="text"
                    value={editingCustomer.gst_number}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        gst_number: e.target.value,
                      })
                    }
                  />
                ) : (
                  customer.gst_number
                )}
              </td>
              <td>
                {editingCustomer && editingCustomer.id === customer.id ? (
                  <input
                    type="text"
                    value={editingCustomer.state}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        state: e.target.value,
                      })
                    }
                  />
                ) : (
                  customer.state
                )}
              </td>
              <td>
                {editingCustomer && editingCustomer.id === customer.id ? (
                  <input
                    type="text"
                    value={editingCustomer.address}
                    onChange={(e) =>
                      setEditingCustomer({ ...editingCustomer, address: e.target.value })
                    }
                  />
                ) : (
                  customer.address
                )}
              </td>
              <td>
                {editingCustomer && editingCustomer.id === customer.id ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingCustomer(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(customer)}>Edit</button>
                    <button onClick={() => handleDelete(customer.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="back-to-dashboard">
          <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>
    </div>
  );
}

export default ManageCustomers;
