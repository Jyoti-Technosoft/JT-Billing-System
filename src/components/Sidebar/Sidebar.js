import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        
      </div>
      <ul>
        <li>
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers">
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink to="/products">
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/invoices">
            Invoices
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports">
            Reports
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;