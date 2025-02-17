import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./ManageSuppliers.css";

function ManageSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierIdSearchTerm, setSupplierIdSearchTerm] = useState(""); // Search by supplier ID
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [editingSupplier, setEditingSupplier] = useState(null);
  const navigate = useNavigate(); 

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/suppliers/");
      setSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSupplierIdSearch = (e) => {
    setSupplierIdSearchTerm(e.target.value);
  };

  const handleStateSearch = (e) => {
    setStateSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/suppliers/${id}`);
      alert("Supplier deleted successfully!");
      fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
      alert("Failed to delete supplier.");
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/suppliers/${editingSupplier.id}`,
        editingSupplier
      );
      alert("Supplier updated successfully!");
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (err) {
      console.error("Error updating supplier:", err);
      alert("Failed to update supplier.");
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplier_id.toLowerCase().includes(supplierIdSearchTerm.toLowerCase())
  );

  const stateFilteredSuppliers = filteredSuppliers.filter((supplier) =>
    supplier.state.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Manage Suppliers Database</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Supplier ID"
          value={supplierIdSearchTerm}
          onChange={handleSupplierIdSearch}
        />
        <input
          type="text"
          placeholder="Search by state"
          value={stateSearchTerm}
          onChange={handleStateSearch}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Name</th>
            <th>Mail Id</th>
            <th>Contact Number</th>
            <th>GST Number</th>
            <th>State</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stateFilteredSuppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>
                {editingSupplier && editingSupplier.id === supplier.id ? (
                  <input
                    type="text"
                    value={editingSupplier.supplier_id}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        supplier_id: e.target.value,
                      })
                    }
                  />
                ) : (
                  supplier.supplier_id
                )}
              </td>
              <td>
                {editingSupplier && editingSupplier.id === supplier.id ? (
                  <input
                    type="text"
                    value={editingSupplier.name}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  supplier.name
                )}
              </td>
              <td>
                {editingSupplier && editingSupplier.id === supplier.id ? (
                  <input
                    type="email"
                    value={editingSupplier.email}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  supplier.email
                )}
              </td>
              <td>
                {editingSupplier && editingSupplier.id === supplier.id ? (
                  <input
                    type="text"
                    value={editingSupplier.contact_number}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        contact_number: e.target.value,
                      })
                    }
                  />
                ) : (
                  supplier.contact_number
                )}
              </td>
              <td>
                {editingSupplier && editingSupplier.id === supplier.id ? (
                  <input
                    type="text"
                    value={editingSupplier.gst_number}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        gst_number: e.target.value,
                      })
                    }
                  />
                ) : (
                  supplier.gst_number
                )}
              </td>
              <td>
                {editingSupplier && editingSupplier.id === supplier.id ? (
                  <input
                    type="text"
                    value={editingSupplier.state}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        state: e.target.value,
                      })
                    }
                  />
                ) : (
                  supplier.state
                )}
              </td>
              <td>
                {editingSupplier && editingSupplier.id === supplier.id ? (
                  <input
                    type="text"
                    value={editingSupplier.address}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        address: e.target.value,
                      })
                    }
                  />
                ) : (
                  supplier.address
                )}
              </td>
              <td>
                {editingSupplier && editingSupplier.id === supplier.id ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingSupplier(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(supplier)}>Edit</button>
                    <button onClick={() => handleDelete(supplier.id)}>Delete</button>
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

export default ManageSuppliers;
