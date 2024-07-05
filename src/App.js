import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import DashboardContent from './components/DashboardContent/DashboardContent';
import Customers from './components/Customers/CustomersContent';
import Products from './components/Products/ProductsContent';
import Invoices from './components/Invoices/InvoicesTable';
import Reports from './components/Reports/ReportsContent';
import Sidebar from './components/Sidebar/Sidebar';
import QuickBilling from './components/QuickBilling/QuickBilling';
import logo from './logo/logo.png';
import { ThemeProvider, useTheme } from './ThemeContext';
import ThemeToggle from './ThemeToggle';
import Registration from './components/Registration/Registration';
import Login from './components/Login/Login';
import MenuIcon from '@mui/icons-material/Menu';

const lightTheme = {
  backgroundColor: '#ffffff',
  color: '#333333',
  headerBgColor: '#f0f0f0',
  headerTextColor: '#333333',
  sidebarBgColor: '#f4f4f4',
  sidebarBorderColor: '#dddddd',
  footerBgColor: '#f0f0f0',
  footerTextColor: '#333333',
};

const darkTheme = {
  backgroundColor: 'rgb(11, 23, 39)',
  color: '#ffffff',
  headerBgColor: '#0b1727',
  headerTextColor: '#ffffff',
  sidebarBgColor: '#1c2b3b',
  sidebarBorderColor: '#19314e',
  footerBgColor: '#0b1727',
  footerTextColor: '#ffffff',
};

const headerStyles = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: lightTheme.headerBgColor,
  color: lightTheme.headerTextColor,
  padding: '0.4%',
  width: '100%',
  borderBottom: '1px solid #19314e',
};

const logoStyles = {
  width: '40px',
  height: '40px',
  marginRight: '10px',
};

const nameStyles = {
  fontSize: '1.5em',
  margin: 0,
};

const footerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: lightTheme.footerBgColor,
  color: lightTheme.footerTextColor,
  padding: '0%',
  width: '100%',
  borderTop: '1px solid #19314e',
};

function Header({ toggleSidebar }) {
  const { theme } = useTheme();
  const themeStyles = theme === 'light' ? lightTheme : darkTheme;

  return (
    <header style={{ ...headerStyles, backgroundColor: themeStyles.headerBgColor, color: themeStyles.headerTextColor }}>
      <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: themeStyles.headerTextColor }}>
        <MenuIcon />
      </button>
      <div>
        <img src={logo} alt="Logo" style={logoStyles} />
      </div>
      <div>
        <h1 style={nameStyles}>JYOTI Technosoft LLP Billing System</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}

function Footer() {
  const { theme } = useTheme();
  const themeStyles = theme === 'light' ? lightTheme : darkTheme;

  return (
    <footer style={{ ...footerStyles, backgroundColor: themeStyles.footerBgColor, color: themeStyles.footerTextColor }}>
      <p>© 2024 Jyoti Technosoft LLP. All Rights Reserved by <a href="https://www.jyotitechnosoft.com" target="_blank" class="text-info">Jyoti Technosoft LLP</a></p>
    </footer>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const themeStyles = theme === 'light' ? lightTheme : darkTheme;
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', backgroundColor: themeStyles.backgroundColor }}>
      {isSidebarOpen && (
        <div style={{ width: "15%", backgroundColor: themeStyles.sidebarBgColor, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${themeStyles.sidebarBorderColor}` }}>
          <Sidebar />
        </div>
      )}
      <div style={{ width: isSidebarOpen ? "85%" : "100%", display: 'flex', flexDirection: 'column' }}>
        <Header toggleSidebar={toggleSidebar} />
        <div style={{ flex: '1', padding: '20px' }}>
          <Routes>
            <Route path="/register" element={<Registration setLoggedIn={setLoggedIn} />} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<DashboardContent />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/quickbilling" element={<QuickBilling />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
