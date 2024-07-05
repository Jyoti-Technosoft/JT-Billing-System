import React from 'react';
import './header.css'; // Import your CSS file
import logo from '../logo/logo.png'
const Header = () => {
  return (
    <header className="header">
      <div className="header__logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="header__title">
        <h1>
          &ensp;JYOTI Technosoft LLP Billing System
        </h1>
      </div>
      <hr />
    </header>
  );
};

export default Header;
