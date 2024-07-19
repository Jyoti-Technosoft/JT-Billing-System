import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import DashboardContent from '../Dashboard/Dashboard';
import Customers from '../Customers/CustomersContent'; // Adjust the path as per your project structure
import Products from '../Products/ProductsContent';
import Invoices from '../Invoices/InvoicesTable';
import Reports from '../Reports/ReportsContent';
import './Dashboard.css';
function Dashboard() {
  return (
    <div id="app-container">
    <div className="content">
      <Routes>
        <Route path="/" element={<DashboardContent />} />
        <Route path="dashboard" element={<DashboardContent />} />
        <Route path="customers" element={<Customers />} />
        <Route path="products" element={<Products />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="reports" element={<Reports/>} />
      </Routes>
    </div>
  </div>
  );
}
export default Dashboard;