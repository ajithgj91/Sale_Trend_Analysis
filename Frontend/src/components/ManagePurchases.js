import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./ManagePurchases.css"; // Create a separate CSS file for the styles

function ManagePurchases() {
  const [purchases, setPurchases] = useState([]);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState(""); // Search by Supplier
  const [productSearchTerm, setProductSearchTerm] = useState(""); // Search by Product
  const [editingPurchase, setEditingPurchase] = useState(null);
  const navigate = useNavigate(); 
  
  const fetchPurchases = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/purchases/");
      setPurchases(response.data);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleSupplierSearch = (e) => {
    setSupplierSearchTerm(e.target.value);
  };

  const handleProductSearch = (e) => {
    setProductSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/purchases/${id}`);
      alert("Purchase deleted successfully!");
      fetchPurchases();
    } catch (err) {
      console.error("Error deleting purchase:", err);
      alert("Failed to delete purchase.");
    }
  };

  const handleEdit = (purchase) => {
    setEditingPurchase(purchase);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/purchases/${editingPurchase.id}`,
        editingPurchase
      );
      alert("Purchase updated successfully!");
      setEditingPurchase(null);
      fetchPurchases();
    } catch (err) {
      console.error("Error updating purchase:", err);
      alert("Failed to update purchase.");
    }
  };

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.supplier_name.toLowerCase().includes(supplierSearchTerm.toLowerCase()) &&
      purchase.product_type.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Manage Purchases</h1>
      <input
        type="text"
        placeholder="Search by Supplier"
        value={supplierSearchTerm}
        onChange={handleSupplierSearch}
      />
      <input
        type="text"
        placeholder="Search by Product"
        value={productSearchTerm}
        onChange={handleProductSearch}
      />
      <table>
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Supplier Name</th>
            <th>Address</th>
            <th>Contact Number</th>
            <th>Payment Type</th>
            <th>Reference Number</th>
            <th>Product Type</th>
            <th>Amount</th>
            <th>Tax</th>
            <th>Net Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPurchases.map((purchase) => (
            <tr key={purchase.id}>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <input
                    type="text"
                    value={editingPurchase.supplier_id}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, supplier_id: e.target.value })
                    }
                  />
                ) : (
                  purchase.supplier_id
                )}
              </td>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <input
                    type="text"
                    value={editingPurchase.supplier_name}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, supplier_name: e.target.value })
                    }
                  />
                ) : (
                  purchase.supplier_name
                )}
              </td>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <input
                    type="text"
                    value={editingPurchase.address}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, address: e.target.value })
                    }
                  />
                ) : (
                  purchase.address
                )}
              </td>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <input
                    type="text"
                    value={editingPurchase.contact_number}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, contact_number: e.target.value })
                    }
                  />
                ) : (
                  purchase.contact_number
                )}
              </td>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <input
                    type="text"
                    value={editingPurchase.payment_type}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, payment_type: e.target.value })
                    }
                  />
                ) : (
                  purchase.payment_type
                )}
              </td>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <input
                    type="text"
                    value={editingPurchase.purchase_id}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, purchase_id: e.target.value })
                    }
                  />
                ) : (
                  purchase.purchase_id
                )}
              </td>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <input
                    type="text"
                    value={editingPurchase.product_type}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, product_type: e.target.value })
                    }
                  />
                ) : (
                  purchase.product_type
                )}
              </td>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <input
                    type="number"
                    value={editingPurchase.amount}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, amount: e.target.value })
                    }
                  />
                ) : (
                  purchase.amount
                )}
              </td>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <input
                    type="number"
                    value={editingPurchase.tax}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, tax: e.target.value })
                    }
                  />
                ) : (
                  purchase.tax
                )}
              </td>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <input
                    type="number"
                    value={editingPurchase.net_amount}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, net_amount: e.target.value })
                    }
                  />
                ) : (
                  purchase.net_amount
                )}
              </td>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <input
                    type="text"
                    value={editingPurchase.date}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, date: e.target.value })
                    }
                  />
                ) : (
                  purchase.date
                )}
              </td>
              <td>
                {editingPurchase && editingPurchase.id === purchase.id ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingPurchase(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(purchase)}>Edit</button>
                    <button onClick={() => handleDelete(purchase.id)}>Delete</button>
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

export default ManagePurchases;

