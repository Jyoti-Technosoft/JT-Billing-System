import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Profile from './components/Profile/Profile';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar } from '@mui/material';

const lightTheme = {
  backgroundColor: '#FFFFFF',
  color: '#333333',
  headerBgColor: '#F0F0F0',
  headerTextColor: '#333333',
  sidebarBgColor: '#F4F4F4',
  sidebarBorderColor: '#DDDDDD',
  footerBgColor: '#F0F0F0',
  footerTextColor: '#333333',
};

const darkTheme = {
  backgroundColor: 'rgb(11, 23, 39)',
  color: '#FFFFFF',
  headerBgColor: '#0B1727',
  headerTextColor: '#FFFFFF',
  sidebarBgColor: '#1C2B3B',
  sidebarBorderColor: '#19314E',
  footerBgColor: '#0B1727',
  footerTextColor: '#FFFFFF',
};

const headerStyles = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: lightTheme.headerBgColor,
  color: lightTheme.headerTextColor,
  padding: '0.4%',
  width: '100%',
  borderBottom: '1px solid #19314E',
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
  borderTop: '1px solid #19314E',
  textAlign: 'center',
};

const linkStyles = {
  color: '#007bff', // Default link color
  textDecoration: 'none',
};

const linkHoverStyles = {
  color: '#0056b3', // Darker shade on hover
  textDecoration: 'underline',
};

function AppContent() {
  const { theme } = useTheme();
  const themeStyles = theme === 'light' ? lightTheme : darkTheme;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
  const [username, setUsername] = useState(localStorage.getItem('username') || "");
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || "");
  const [email, setEmail] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('username');
    }

    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));
    if (registeredUser) {
      setEmail(registeredUser.email);
    }
  }, [loggedIn, username]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
  };

  const handleProfileClick = () => {
    window.location.href = '/profile';
  };

  const renderProfilePic = () => {
    if (profilePic) {
      return (
        <Avatar alt="Profile Picture" src={profilePic} />
      );
    }
    if (email) {
      const firstLetter = email.charAt(0).toUpperCase();
      return <Avatar>{firstLetter}</Avatar>;
    }
    return (
      <Avatar alt="Default Profile Picture" src="/default-profile-pic.jpg" />
    );
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', backgroundColor: themeStyles.backgroundColor }}>
      {loggedIn ? (
        <>
          {isSidebarOpen && (
            <div style={{ width: "15%", backgroundColor: themeStyles.sidebarBgColor, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${themeStyles.sidebarBorderColor}` }}>
              <Sidebar />
            </div>
          )}
          <div style={{ width: isSidebarOpen ? "85%" : "100%", display: 'flex', flexDirection: 'column' }}>
            <header style={{ ...headerStyles, backgroundColor: themeStyles.headerBgColor, color: themeStyles.headerTextColor }}>
              <IconButton onClick={toggleSidebar} style={{ color: themeStyles.headerTextColor }}>
                <MenuIcon />
              </IconButton>
              <div>
                <img src={logo} alt="Logo" style={logoStyles} />
              </div>
              <div>
                <h1 style={nameStyles}>JYOTI Technosoft LLP Billing System</h1>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                <IconButton onClick={handleProfileClick} style={{ color: themeStyles.headerTextColor }}>
                  {renderProfilePic()}
                </IconButton>
                <ThemeToggle />
                <Tooltip title="Logout">
                  <IconButton onClick={handleLogout} style={{ color: themeStyles.headerTextColor }}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </header>

            <div style={{ flex: '1', padding: '20px' }}>
              <Routes location={location}>
                <Route path="/" element={<DashboardContent />} />
                <Route path="dashboard" element={<DashboardContent />} />
                <Route path="customers" element={<Customers />} />
                <Route path="products" element={<Products />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="reports" element={<Reports />} />
                <Route path="/quickbilling" element={<QuickBilling />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
            <footer style={{ ...footerStyles, backgroundColor: themeStyles.footerBgColor, color: themeStyles.footerTextColor }}>
              <p>
                © 2024 Jyoti Technosoft LLP. All Rights Reserved by <a href="https://www.jyotitechnosoft.com" target="_blank" rel="noopener noreferrer" style={linkStyles} onMouseEnter={(e) => e.target.style = linkHoverStyles} onMouseLeave={(e) => e.target.style = linkStyles}>Jyoti Technosoft LLP</a>
              </p>
            </footer>
          </div>
        </>
      ): (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
          <Routes location={location}>
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
            <Route path="/signup" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      )}
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
