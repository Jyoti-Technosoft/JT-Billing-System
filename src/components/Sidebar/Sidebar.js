import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dashboard, People, Store, Receipt, BarChart, FlashOn } from '@mui/icons-material';
import './Sidebar.css';
import { useTheme } from '../../ThemeContext'; // Adjust the path based on your project structure

// Define themes directly in Sidebar.js
const lightTheme = {
  sidebarBgColor: '#f4f4f4',
  sidebarBorderColor: '#dddddd',
  color: '#333333',
};

const darkTheme = {
  sidebarBgColor: '#1c2b3b',
  sidebarBorderColor: '#19314e',
  color: '#ffffff',
};

function Sidebar() {
  const { theme } = useTheme();
  const themeStyles = theme === 'light' ? lightTheme : darkTheme;

  return (
    <div className="sidebar" style={{ backgroundColor: themeStyles.sidebarBgColor, borderColor: themeStyles.sidebarBorderColor }}>
      <ul>
        <li>
          <NavLink to="/dashboard" activeClassName="active" exact>
            <Dashboard className="sidebar-icon" style={{ color: '#ffffff' }} /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers" activeClassName="active">
            <People className="sidebar-icon" style={{ color: '#ffffff' }} /> Customers
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" activeClassName="active">
            <Store className="sidebar-icon" style={{ color: '#ffffff' }} /> Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/invoices" activeClassName="active">
            <Receipt className="sidebar-icon" style={{ color: '#ffffff' }} /> Invoices
          </NavLink>
        </li>
        <li>
          <NavLink to="/quickbilling" activeClassName="active">
            <FlashOn className="sidebar-icon" style={{ color: '#ffffff' }} /> QuickBilling
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" activeClassName="active">
            <BarChart className="sidebar-icon" style={{ color: '#ffffff' }} /> Reports
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
