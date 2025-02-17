import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [salesDropdown, setSalesDropdown] = useState(false);
  const [purchaseDropdown, setPurchaseDropdown] = useState(false);
  const [customerDropdown, setCustomerDropdown] = useState(false);
  const [supplierDropdown, setSupplierDropdown] = useState(false);
  const [reportDropdown, setReportDropdown] = useState(false);

  const handleProtectedNavigation = (path) => {
    navigate("/login-admin", { state: { redirectTo: path } });
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="profile-section">
          <div className="profile-image">
            <img src="/images/profile.jpg" alt="Admin Profile" className="profile-img" />
          </div>
          <h3>Admin</h3>
          <button onClick={() => (window.location.href = "./login")} type="button"> Logout</button>
        </div>
        <ul className="menu">
          <li>
            <button onClick={() => navigate(0)}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </button>
          </li>
          <li>
            <button className="dropdown-btn" onClick={() => setSalesDropdown(!salesDropdown)}>
              <i className="fas fa-shopping-cart"></i> Sales
            </button>
            {salesDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/sales-entry">• Sales Entry</Link></li>
                <li><button onClick={() => handleProtectedNavigation("/sales-analysis")}>• Sales Analysis</button></li>
                <li><button onClick={() => handleProtectedNavigation("/manage-sales")}>• Manage Sales</button></li>
                {/* <li><button onClick={() => handleProtectedNavigation("/sales-analysis-amt")}>• Sales Analysis Amt</button></li> */}
              </ul>
            )}
          </li>
          <li>
            <button className="dropdown-btn" onClick={() => setPurchaseDropdown(!purchaseDropdown)}>
              <i className="fas fa-file-invoice-dollar"></i> Purchase
            </button>
            {purchaseDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/purchase-entry">• Purchase Entry</Link></li>
                <li><button onClick={() => handleProtectedNavigation("/product-analysis")}>• Purchase Analysis</button></li>
                <li><button onClick={() => handleProtectedNavigation("/manage-purchases")}>• Manage Purchases</button></li>
              </ul>
            )}
          </li>
          <li>
            <button className="dropdown-btn" onClick={() => setCustomerDropdown(!customerDropdown)}>
              <i className="fas fa-users"></i> Customers
            </button>
            {customerDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/add-customers">• Add Customers</Link></li>
                <li><button onClick={() => handleProtectedNavigation("/manage-customers")}>• Manage Customers</button></li>
              </ul>
            )}
          </li>
          <li>
            <button className="dropdown-btn" onClick={() => setSupplierDropdown(!supplierDropdown)}>
              <i className="fas fa-truck"></i> Suppliers
            </button>
            {supplierDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/add-suppliers">• Add Suppliers</Link></li>
                <li><button onClick={() => handleProtectedNavigation("/manage-suppliers")}>• Manage Suppliers</button></li>
              </ul>
            )}
          </li>
          <li>
             <button className="dropdown-btn" onClick={() => setReportDropdown(!reportDropdown)}>
               <i className="fas fa-chart-bar"></i> Reports
             </button>
            {reportDropdown && (
              <ul className="dropdown-menu">
                <li><button onClick={() => handleProtectedNavigation("/sales-report")}>• Sales Report</button></li>
                <li><button onClick={() => handleProtectedNavigation("/purchase-report")}>• Purchase Report</button></li>
              </ul>
            )}
          </li>
        </ul>
      </div>
            <div className="description">
         <h1>SIEGTECHNIK</h1>
        <h2>Welcome to the Dashboard</h2>
        <p>
         This project provides a comprehensive overview of sales trends and performance. 
           Our tools enable detailed analysis and insights to help drive business decisions.
         </p>
         <p>
           <strong>About Us:</strong> We are a leading company specializing in creating 
           advanced solutions for sales and inventory management, ensuring businesses can 
           operate efficiently and effectively.
         </p>
         <div className="main-content">
           <div className="welcome-section">
            <img 
              src="/images/sales_analysis.jpg" 
              alt="Sales Analysis" 
              className="sales-analysis-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;