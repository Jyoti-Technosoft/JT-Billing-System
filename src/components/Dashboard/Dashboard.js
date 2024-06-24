import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import DashboardContent from '../DashboardContent/DashboardContent';
import CustomersContent from '../CustomersContent/CustomersContent';
import ProductsContent from '../ProductsContent/ProductsContent';
import InvoicesContent from '../InvoicesContent/InvoicesContent';
import ReportsContent from '../ReportsContent/ReportsContent';
import './Dashboard.css';

function Dashboard() {
  return (
    <div id="app-container">
      <Sidebar /><br></br><br></br><br></br>
      <div className="content">
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="customers" element={<CustomersContent />} />
          <Route path="products" element={<ProductsContent />} />
          <Route path="invoices" element={<InvoicesContent />} />
          <Route path="reports" element={<ReportsContent />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;