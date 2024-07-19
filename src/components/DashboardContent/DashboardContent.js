import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaidIcon from '@mui/icons-material/AttachMoney';
import UnpaidIcon from '@mui/icons-material/MoneyOff';
import OutstandingIcon from '@mui/icons-material/AccountBalance';
import AvailableIcon from '@mui/icons-material/CheckCircle';
import SoldOutIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import './DashboardContent.css';

function DashboardContent() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [profit, setProfit] = useState(0); // State for profit
  const [totalPaidAmount, setTotalPaidAmount] = useState(0); // State for total paid amount
  const [totalUnpaidAmount, setTotalUnpaidAmount] = useState(0); // State for total unpaid amount
  const [outstandingAmount, setOutstandingAmount] = useState(0); // State for outstanding amount
  const [totalAvailableProducts, setTotalAvailableProducts] = useState(0); // State for total available products
  const [totalSoldOutProducts, setTotalSoldOutProducts] = useState(0); // State for total sold out products

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const sortedInvoices = storedInvoices.sort((a, b) => new Date(b.date) - new Date(a.date));
    setInvoices(sortedInvoices);

    const storedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    const sortedCustomers = storedCustomers.sort((a, b) => b.totalBilled - a.totalBilled);
    setCustomers(sortedCustomers);
    setTotalCustomers(storedCustomers.length);

    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts);
    setTotalProducts(storedProducts.length);

    setTotalInvoices(storedInvoices.length);

    // Calculate profit
    let totalSellingPrice = 0;
    let totalOriginalPrice = 0;
    storedProducts.forEach((product) => {
      totalSellingPrice += product.sellingPrice || 0;
      totalOriginalPrice += product.originalPrice || 0;
    });
    storedInvoices.forEach((invoice) => {
      totalSellingPrice += invoice.totalAmount || invoice.amount || 0;
      totalOriginalPrice += invoice.originalAmount || invoice.amount || 0;
    });
    const calculatedProfit = totalSellingPrice - totalOriginalPrice;
    setProfit(calculatedProfit);

    // Calculate paid, unpaid, and outstanding amounts
    let paidAmount = 0;
    let unpaidAmount = 0;
    storedInvoices.forEach((invoice) => {
      if (invoice.status === 'Paid') {
        paidAmount += invoice.totalAmount || invoice.amount || 0;
      } else {
        unpaidAmount += invoice.totalAmount || invoice.amount || 0;
      }
    });
    setTotalPaidAmount(paidAmount);
    setTotalUnpaidAmount(unpaidAmount);
    setOutstandingAmount(unpaidAmount); // Assuming outstanding amount is the same as unpaid amount

    // Calculate available and sold-out products
    let availableProducts = 0;
    let soldOutProducts = 0;
    storedProducts.forEach((product) => {
      if (product.available > 0) {
        availableProducts += 1;
      } else {
        soldOutProducts += 1;
      }
    });
    setTotalAvailableProducts(availableProducts);
    setTotalSoldOutProducts(soldOutProducts);

  }, []);

  const latestInvoices = invoices.slice(0, 3);
  const topCustomers = customers.slice(0, 3);

  return (
    <div >
      <div className="dashboard-squarebox-container" >
        <Box className="dashboard-squarebox light-blue">
          <PeopleIcon style={{ fontSize: 40 }} />
          <Typography variant="h6">Total Customers</Typography>
          <Typography variant="h4"><b>{totalCustomers}</b></Typography>
        </Box>
        <Box className="dashboard-squarebox light-blue">
          <StoreIcon style={{ fontSize: 40 }} />
          <Typography variant="h6">Total Products</Typography>
          <Typography variant="h4"><b>{totalProducts}</b></Typography>
        </Box>
        <Box className="dashboard-squarebox light-blue">
          <ReceiptIcon style={{ fontSize: 40 }} />
          <Typography variant="h6">Total Invoices</Typography>
          <Typography variant="h4"><b>{totalInvoices}</b></Typography>
        </Box>
        <Box className="dashboard-squarebox light-blue">
          <OutstandingIcon style={{ fontSize: 40 }} />
          <Typography variant="h6">Outstanding</Typography>
          <Typography variant="h4"><b>₹{outstandingAmount}</b></Typography>
        </Box>
      </div>
      <br></br>
      <div className="dashboard-squarebox-container">
        <Box className="dashboard-squarebox light-blue">
          <PaidIcon style={{ fontSize: 40 }} />
          <Typography variant="h6">Total Paid Amount</Typography>
          <Typography variant="h4"><b>₹{totalPaidAmount}</b></Typography>
        </Box>
        <Box className="dashboard-squarebox light-blue">
          <UnpaidIcon style={{ fontSize: 40 }} />
          <Typography variant="h6">Total Unpaid Amount</Typography>
          <Typography variant="h4"><b>₹{totalUnpaidAmount}</b></Typography>
        </Box>
        <Box className="dashboard-squarebox light-blue">
          <AvailableIcon style={{ fontSize: 40 }} />
          <Typography variant="h6">Available Products</Typography>
          <Typography variant="h4"><b>{totalAvailableProducts}</b></Typography>
        </Box>
        <Box className="dashboard-squarebox light-blue">
          <TrendingUpIcon style={{ fontSize: 40 }} />
          <Typography variant="h6">Profit</Typography>
          <Typography variant="h4"><b>₹{profit}</b></Typography>
        </Box>
      </div>
      <div className="latest-invoices">
        <Typography variant="h4"><b>Latest Invoices</b></Typography><hr/>
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
        <Typography variant="h4"><b>Top Customers</b></Typography><hr/>
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
  );
}

export default DashboardContent;
