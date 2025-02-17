// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./ManageSales.css";

// function ManageSales() {
//   const [sales, setSales] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingSale, setEditingSale] = useState(null);

//   const fetchSales = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/sales/");
//       setSales(response.data);
//     } catch (err) {
//       console.error("Error fetching sales:", err);
//     }
//   };

//   useEffect(() => {
//     fetchSales();
//   }, []);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://127.0.0.1:8000/sales/${id}`);
//       alert("Sale deleted successfully!");
//       fetchSales();
//     } catch (err) {
//       console.error("Error deleting sale:", err);
//       alert("Failed to delete sale.");
//     }
//   };

//   const handleEdit = (sale) => {
//     setEditingSale(sale);
//   };

//   const handleUpdate = async () => {
//     if (!editingSale || !editingSale.id) {
//       alert("Invalid sale data");
//       return;
//     }
  
//     try {
//       await axios.put(`http://127.0.0.1:8000/sales/${editingSale.id}`, editingSale, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       alert("Sale updated successfully!");
//       setEditingSale(null); // Clear the editing state
//       fetchSales(); // Refresh the sales list
//     } catch (err) {
//       console.error("Error updating sale:", err);
//       alert("Failed to update sale.");
//     }
//   };
  

//   const filteredSales = sales.filter((sale) =>
//     sale.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container">
//       <h1>Manage Sales</h1>
//       <input
//         type="text"
//         placeholder="Search by Invoice ID"
//         value={searchTerm}
//         onChange={handleSearch}
//       />
//       <table>
//         <thead>
//           <tr>
//             <th>Client ID</th>
//             <th>Customer Name</th>
//             <th>Address</th>
//             <th>Contact Number</th>
//             <th>Payment Type</th>
//             <th>Invoice ID</th>
//             <th>Product Name</th>
//             <th>Quantity</th>
//             <th>Amount</th>
//             <th>Tax</th>
//             <th>Total</th>
//             <th>Date</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredSales.map((sale) => (
//             <tr key={sale.id}>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="text"
//                     value={editingSale.clientId}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, clientId: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.clientId
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="text"
//                     value={editingSale.customerName}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, customerName: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.customerName
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="text"
//                     value={editingSale.address}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, address: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.address
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="text"
//                     value={editingSale.contactNumber}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, contactNumber: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.contactNumber
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="text"
//                     value={editingSale.paymentType}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, paymentType: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.paymentType
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="text"
//                     value={editingSale.invoiceId}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, invoiceId: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.invoiceId
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="text"
//                     value={editingSale.productName}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, productName: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.productName
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="number"
//                     value={editingSale.quantity}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, quantity: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.quantity
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="number"
//                     value={editingSale.amount}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, amount: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.amount
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="number"
//                     value={editingSale.tax}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, tax: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.tax
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="number"
//                     value={editingSale.total}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, total: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.total
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <input
//                     type="date"
//                     value={editingSale.date}
//                     onChange={(e) =>
//                       setEditingSale({ ...editingSale, date: e.target.value })
//                     }
//                   />
//                 ) : (
//                   sale.date
//                 )}
//               </td>
//               <td>
//                 {editingSale && editingSale.id === sale.id ? (
//                   <>
//                     <button onClick={handleUpdate}>Save</button>
//                     <button onClick={() => setEditingSale(null)}>Cancel</button>
//                   </>
//                 ) : (
//                   <>
//                     <button onClick={() => handleEdit(sale)}>Edit</button>
//                     <button onClick={() => handleDelete(sale.id)}>Delete</button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ManageSales;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./ManageSales.css";

function ManageSales() {
  const [sales, setSales] = useState([]);
  const [invoiceIdSearchTerm, setInvoiceIdSearchTerm] = useState(""); // Search by Invoice ID
  const [productSearchTerm, setProductSearchTerm] = useState(""); // Search by Product
  const [editingSale, setEditingSale] = useState(null);
  const navigate = useNavigate(); 

  const fetchSales = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/sales/");
      setSales(response.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleInvoiceIdSearch = (e) => {
    setInvoiceIdSearchTerm(e.target.value);
  };

  const handleProductSearch = (e) => {
    setProductSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/sales/${id}`);
      alert("Sale deleted successfully!");
      fetchSales();
    } catch (err) {
      console.error("Error deleting sale:", err);
      alert("Failed to delete sale.");
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/sales/${editingSale.id}`,
        editingSale
      );
      alert("Sale updated successfully!");
      setEditingSale(null);
      fetchSales();
    } catch (err) {
      console.error("Error updating sale:", err);
      alert("Failed to update sale.");
    }
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.invoice_id.toLowerCase().includes(invoiceIdSearchTerm.toLowerCase()) &&
      sale.product_name.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Manage Sales</h1>
      <input
        type="text"
        placeholder="Search by Invoice ID"
        value={invoiceIdSearchTerm}
        onChange={handleInvoiceIdSearch}
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
            <th>Client ID</th>
            <th>Customer Name</th>
            <th>Address</th>
            <th>Contact Number</th>
            <th>Payment Type</th>
            <th>Invoice ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Tax</th>
            <th>Total</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale.id}>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="text"
                    value={editingSale.client_id}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, client_id: e.target.value })
                    }
                  />
                ) : (
                  sale.client_id
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="text"
                    value={editingSale.customer_name}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, customer_name: e.target.value })
                    }
                  />
                ) : (
                  sale.customer_name
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="text"
                    value={editingSale.address}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, address: e.target.value })
                    }
                  />
                ) : (
                  sale.address
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="text"
                    value={editingSale.contact_number}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, contact_number: e.target.value })
                    }
                  />
                ) : (
                  sale.contact_number
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="text"
                    value={editingSale.payment_type}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, payment_type: e.target.value })
                    }
                  />
                ) : (
                  sale.payment_type
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="text"
                    value={editingSale.invoice_id}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, invoice_id: e.target.value })
                    }
                  />
                ) : (
                  sale.invoice_id
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="text"
                    value={editingSale.product_name}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, product_name: e.target.value })
                    }
                  />
                ) : (
                  sale.product_name
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="number"
                    value={editingSale.quantity}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, quantity: e.target.value })
                    }
                  />
                ) : (
                  sale.quantity
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="number"
                    value={editingSale.amount}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, amount: e.target.value })
                    }
                  />
                ) : (
                  sale.amount
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="number"
                    value={editingSale.tax}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, tax: e.target.value })
                    }
                  />
                ) : (
                  sale.tax
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="number"
                    value={editingSale.total}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, total: e.target.value })
                    }
                  />
                ) : (
                  sale.total
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <input
                    type="text"
                    value={editingSale.date}
                    onChange={(e) =>
                      setEditingSale({ ...editingSale, date: e.target.value })
                    }
                  />
                ) : (
                  sale.date
                )}
              </td>
              <td>
                {editingSale && editingSale.id === sale.id ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingSale(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(sale)}>Edit</button>
                    <button onClick={() => handleDelete(sale.id)}>Delete</button>
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

export default ManageSales;
