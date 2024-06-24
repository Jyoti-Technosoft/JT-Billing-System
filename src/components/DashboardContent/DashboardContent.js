import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import './DashboardContent.css';
import '../Header/header.css';
function DashboardContent() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
    // Sort invoices by date in descending order
    const sortedInvoices = storedInvoices.sort((a, b) => new Date(b.date) - new Date(a.date));
    setInvoices(sortedInvoices);
    const storedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    // Sort customers by totalBilled in descending order
    const sortedCustomers = storedCustomers.sort((a, b) => b.totalBilled - a.totalBilled);
    setCustomers(sortedCustomers);
  }, []);
  const latestInvoices = invoices.slice(0, 3);
  const topCustomers = customers.slice(0, 3);
  return (
    <div>
      <header className="Header">
        <h1>&ensp;&ensp;JYOTI Technosoft LLP Billing System</h1>
        <hr />
      </header>
    
      <div>
        <div className="dashboard-squarebox-container">
          <div className="dashboard-squarebox light-blue"></div>
          <div className="dashboard-squarebox light-blue"></div>
          <div className="dashboard-squarebox light-blue"></div>
          <div className="dashboard-squarebox light-blue"></div>
        </div>
        <div className="latest-invoices">
          <Typography variant="h4"><b>Latest Invoices</b></Typography>
          <TableContainer style={{ backgroundColor: '#E3F2FD', marginTop: '1rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Invoice ID</b></TableCell>
                  <TableCell><b>Customer</b></TableCell>
                  <TableCell><b>Amount</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>INV-{invoice.invoiceId}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{invoice.totalAmount || invoice.amount}/-</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="top-customers">
          <Typography variant="h4"><b>Top Customers</b></Typography>
          <TableContainer style={{ backgroundColor: '#E3F2FD', marginTop: '1rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Customer ID</b></TableCell>
                  <TableCell><b>Customer</b></TableCell>
                  <TableCell><b>Total Billed</b></TableCell>
                  <TableCell><b>Latest Bill</b></TableCell>
                  <TableCell><b>Outstanding</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.totalBilled}/-</TableCell>
                    <TableCell>{customer.latestBill}</TableCell>
                    <TableCell>{customer.outstanding}/-</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        </div>
        <footer className="Footer">
        <hr />
        <b>
          <p>
            &ensp;&ensp;&ensp;&ensp;&copy; 2024 JYOTI Technosoft LLP. All rights
            reserved.
          </p>
        </b>
      </footer>
      </div>
      
    
  );
}
export default DashboardContent;