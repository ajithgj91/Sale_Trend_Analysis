import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./PurchaseReport.css";

const PurchaseReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to fetch the purchase report based on the current date range
  const fetchPurchaseReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/purchases-report/", {
        params: { start_date: startDate, end_date: endDate },
      });
      setPurchaseData(response.data);
    } catch (error) {
      console.error("Error fetching purchase report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch the report when the component is mounted or when the dates are changed
  useEffect(() => {
    if (startDate && endDate) {
      fetchPurchaseReport();
    }
  }, [startDate, endDate]); // This ensures that the fetch is triggered when either date changes

  const downloadReport = async (format) => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates before downloading.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/purchases-date/export", {
        params: { start_date: startDate, end_date: endDate, format },
        responseType: "blob", // Ensure the response is treated as a file
      });

      const blob = new Blob([response.data], { type: format === "pdf" ? "application/pdf" : "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `purchase_report_${startDate}_${endDate}.${format}`
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
    <div className="purchase-report">
      <h2>Purchase Report</h2>
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
        <button onClick={fetchPurchaseReport}>Fetch Report</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>SUPPLIER ID</th>
                <th>SUPPLIER NAME</th>
                <th>REFERENCE NUBMER</th>
                <th>ADDRESS</th>
                <th>CONTACT NUMBER</th>
                <th>PAYMENT TYPE</th>
                <th>PRODUCT TYPE</th>
                <th>AMOUNT</th>
                <th>GST</th>
                <th>TOTAL</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {purchaseData.map((item, index) => (
                <tr key={index}>
                  <td>{item.supplier_id}</td>
                  <td>{item.supplier_name}</td>
                  <td>{item.purchase_id}</td>
                  <td>{item.address}</td>
                  <td>{item.contact_number}</td>
                  <td>{item.payment_type}</td>
                  <td>{item.product_type}</td>
                  <td>{item.amount}</td>
                  <td>{item.tax}</td>
                  <td>{item.net_amount}</td>
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

export default PurchaseReport;
