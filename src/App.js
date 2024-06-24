import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard/Dashboard';
import DashboardContent from './components/DashboardContent/DashboardContent';
import CustomersContent from './components/CustomersContent/CustomersContent';
import ProductsContent from './components/ProductsContent/ProductsContent';
import InvoicesContent from './components/InvoicesContent/InvoicesContent';
import ReportsContent from './components/ReportsContent/ReportsContent';
import Sidebar from './components/Sidebar/Sidebar';
import './components/Header/header.css';

function App() {
  return (
    <div className="App" style={{ width: "100%", float: "left",backgroundColor:'lightgrey' }}>
      
      <div style={{ width: "85%", float: "right" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<DashboardContent />} />
          <Route path="/customers" element={<CustomersContent />} />
          <Route path="/products" element={<ProductsContent />} />
          <Route path="/invoices" element={<InvoicesContent />} />
          <Route path="/reports" element={<ReportsContent />} />
        </Routes>
      </div>
      <div style={{ width: "25%", float: "left" }}>
        <Sidebar />
      </div>
    </div>
    
  );
}

export default App;
