import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage"; // Import the HomePage component
import LoginPage from "./components/LoginPage"; // Import the LoginPage component
import Dashboard from "./components/Dashboard"; // Dashboard component
import SalesForm from "./components/salesform"; // Sales entry component
import PurchaseEntry from "./components/PurchaseEntry"; // Purchase entry component
import AddCustomer from "./components/AddCustomer"; // Add customer component
import AddSupplier from "./components/AddSupplier"; // Add supplier component
import ManageCustomers from "./components/ManageCustomers"; // Manage customers component
import ManageSuppliers from "./components/ManageSuppliers"; // Manage suppliers component
import ManageSales from "./components/ManageSales"; // Manage sales component
import ManagePurchases from "./components/ManagePurchases"; // Manage purchases component
import SalesReport from "./components/SalesReport";
import PurchaseReport from "./components/PurchaseReport";  // Sales report component
import SalesAnalysis from "./components/SalesAnalysis";
import Sales_Analysis_Amt from "./components/Sales_Analysis_Amt";
import LoginAdmin from "./components/LoginAdmin";
// import SalesForm from "./components/sales";
import ProductAnalysis from "./components/ProductAnalysis";
import "./App.css"; // Global CSS for the app
const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Define all application routes */}
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<HomePage />} />

          {/* Login page route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard and other app pages */}
          <Route path="/login-admin" element={<LoginAdmin/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales-analysis" element={<SalesAnalysis />} />
          <Route path="/sales-analysis-amt" element={<Sales_Analysis_Amt />} />
          <Route path="/product-analysis" element={<ProductAnalysis />} />
          <Route path="/sales-entry" element={<SalesForm />} />
          <Route path="/purchase-entry" element={<PurchaseEntry />} />
          <Route path="/add-customers" element={<AddCustomer />} />
          <Route path="/add-suppliers" element={<AddSupplier />} />
          <Route path="/manage-customers" element={<ManageCustomers />} />
          <Route path="/manage-suppliers" element={<ManageSuppliers />} />
          <Route path="/manage-sales" element={<ManageSales />} />
          <Route path="/manage-purchases" element={<ManagePurchases />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/purchase-report" element={<PurchaseReport />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
