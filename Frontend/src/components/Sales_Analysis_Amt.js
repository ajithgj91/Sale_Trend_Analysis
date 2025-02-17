import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SalesAnalysis.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesAnalysis = () => {
  const navigate = useNavigate();

  const [productSalesData, setProductSalesData] = useState({
    labels: [],
    amounts: [],
  });

  const [totalSalesData, setTotalSalesData] = useState({
    total: 0,
  });
  const [totalPurchaseData, setTotalPurchaseData] = useState({
    total: 0,
  });
  const [totalSales, setTotalSales] = useState({
    total: 0,
  });
  const [totalPurchase, setTotalPurchase] = useState({
    total: 0,
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch all data initially
  const fetchDefaultData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/sales-by-product/");
      const chartData = response.data;
      const labels = chartData.map((item) => item.productName);
      const amounts = chartData.map((item) => item.totalAmount);

      setProductSalesData({ labels, amounts });

      // Fetch total sales and purchase data
      const totalSalesResponse = await axios.get("http://127.0.0.1:8000/total-sales");
      setTotalSalesData(totalSalesResponse.data);
      const totalPurchaseResponse = await axios.get("http://127.0.0.1:8000/total-purchases");
      setTotalPurchaseData(totalPurchaseResponse.data);
      const totalSales = await axios.get("http://127.0.0.1:8000/total-sales-amount");
      setTotalSales(totalSales.data);
      const totalPurchase = await axios.get("http://127.0.0.1:8000/total-purchases-amount/");
      setTotalPurchase(totalPurchase.data);
    } catch (err) {
      console.error("Error fetching default data:", err.message);
    }
  };

  // Fetch filtered data based on date range
  const fetchFilteredData = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/sales-by-product/", {
        params: { start_date: startDate, end_date: endDate },
      });

      if (response.status === 200) {
        const chartData = response.data;
        const labels = chartData.map((item) => item.productName);
        const amounts = chartData.map((item) => item.totalAmount);

        setProductSalesData({ labels, amounts });
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      console.error("Error fetching filtered data:", err.message);
      alert("Failed to fetch filtered data. Please try again.");
    }
  };

  useEffect(() => {
    fetchDefaultData(); // Fetch default data on component load
  }, []);

  const productBarChartData = {
    labels: productSalesData.labels,
    datasets: [
      {
        label: "Total Sales Amount (₹)",
        backgroundColor: "#36a2eb",
        data: productSalesData.amounts,
      },
    ],
  };

  return (
    <div className="sales-analysis">
      <div className="main-content">
        <h1 className="sales-analysis-heading">Sales Analysis</h1>

        <div className="stats">
          <div className="card net-total-sales">
            Total Sales Amount: {'\u20B9' + totalSalesData.total}
          </div>
          <div className="card total-purchase">
            Total Purchase Amount: {'\u20B9' + totalPurchaseData.total}
          </div>
          <div className="card net-total-sales">
            Total Sales Amount without GST: {'\u20B9' + totalSales.total}
          </div>
          <div className="card total-purchase">
            Total Purchase Amount without GST: {'\u20B9' + totalPurchase.total}
          </div>
        </div>

        <div className="charts">
          <div className="bar-chart">
            <h3>Sales by Product (Amount)</h3>
            <div className="filter-section">
              <label>From:</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <label>To:</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <button onClick={fetchFilteredData}>Filter</button>
              <button onClick={() => navigate(0)}>Refresh</button>
            </div>

            <div className="chart-container">
              {productSalesData.labels.length > 0 ? (
                <Bar
                  data={productBarChartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                  height={400}
                />
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="back-to-dashboard">
          <button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalysis;
