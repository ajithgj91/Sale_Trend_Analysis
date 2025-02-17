import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./SalesReport.css";

const SalesReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  // Function to fetch the sales report based on the current date range
  const fetchSalesReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/sales-report/", {
        params: { start_date: startDate, end_date: endDate },
      });
      setSalesData(response.data);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch the report when the component is mounted or when the dates are changed
  useEffect(() => {
    if (startDate && endDate) {
      fetchSalesReport();
    }
  }, [startDate, endDate]); // This ensures that the fetch is triggered when either date changes

  const downloadReport = async (format) => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates before downloading.");
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/sales-date/export`, {
        params: { start_date: startDate, end_date: endDate, format },
        responseType: "blob", // Ensure the response is treated as a file
      });

      const blob = new Blob([response.data], { type: format === "pdf" ? "application/pdf" : "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `sales_report_${startDate}_${endDate}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error downloading ${format} report:`, error);
      alert("Failed to download the report. Please try again.");
    }
  };

  return (
    <div className="sales-report">
      <h2>Sales Report</h2>
      <div className="filter-section">
        <label>From:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>To:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={fetchSalesReport}>Fetch Report</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>CLIENT ID</th>
                <th>CUSTOMER NAME</th>
                <th>ADDRESS</th>
                <th>CONTACT NUMBER</th>
                <th>PAYMENT TYPE</th>
                <th>INVOICE ID</th>
                <th>PRODUCT NAME</th>
                <th>QUANTITY</th>
                <th>AMOUNT</th>
                <th>GST</th>
                <th>TOTAL</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((item, index) => (
                <tr key={index}>
                  <td>{item.client_id}</td>
                  <td>{item.customer_name}</td>
                  <td>{item.address}</td>
                  <td>{item.contact_number}</td>
                  <td>{item.payment_type}</td>
                  <td>{item.invoice_id}</td>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.amount}</td>
                  <td>{item.tax}</td>
                  <td>{item.total}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="download-buttons">
            <button onClick={() => downloadReport("csv")}>Download CSV</button>
            <button onClick={() => downloadReport("pdf")}>Download PDF</button>
          </div>
        </>
      )}
      <div className="back-to-dashboard">
          <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>
    </div>
  );
};

export default SalesReport;
