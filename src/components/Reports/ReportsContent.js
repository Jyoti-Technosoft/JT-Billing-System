import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Chart, Title, Tooltip, ArcElement, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import "./ReportsContent.css";

// Register necessary components with Chart.js
Chart.register(Title, Tooltip, ArcElement, BarElement, CategoryScale, LinearScale);

function ReportsContent() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [error, setError] = useState(null);
  const [topSellingProductPerDay, setTopSellingProductPerDay] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSalesData, setProductSalesData] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [selectedProductSalesData, setSelectedProductSalesData] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = () => {
    const invoicesData = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(invoicesData);
    setFilteredInvoices(invoicesData);
    generateBarChartData(invoicesData);
  };

  const fetchProductData = async () => {
    try {
      const products = JSON.parse(localStorage.getItem("products")) || [];
      if (products.length === 0) {
        throw new Error("No products data available");
      }

      const filteredInvoicesData = filterInvoicesByDate(invoices, startDate, endDate);
      const filteredInvoiceIds = filteredInvoicesData.map((invoice) => invoice.id);

      const filteredProducts = products.filter((product) =>
        filteredInvoiceIds.includes(product.invoiceId)
      );

      // Group products by name and sum sold quantities
      const productSalesMap = new Map();
      filteredProducts.forEach((product) => {
        if (productSalesMap.has(product.name)) {
          productSalesMap.set(
            product.name,
            productSalesMap.get(product.name) + product.soldOut
          );
        } else {
          productSalesMap.set(product.name, product.soldOut);
        }
      });

      // Sort products by total sold quantity descending
      const sortedProducts = [...productSalesMap.entries()].sort(
        (a, b) => b[1] - a[1]
      );

      const topProducts = sortedProducts.slice(0, 6);
      const labels = topProducts.map(([name]) => name);
      const data = topProducts.map(([_, quantity]) => quantity);

      setPieChartData({
        labels,
        datasets: [
          {
            label: "Product Sales",
            data,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
          },
        ],
      });

      // Determine top selling product per day
      const dailyTopProducts = {};
      filteredInvoicesData.forEach((invoice) => {
        const invoiceDate = new Date(invoice.date)
          .toISOString()
          .split("T")[0]; // Get YYYY-MM-DD
        if (!dailyTopProducts[invoiceDate]) {
          dailyTopProducts[invoiceDate] = {
            product: "",
            quantity: 0,
          };
        }
        filteredProducts.forEach((product) => {
          if (
            product.invoiceId === invoice.id &&
            product.soldOut > dailyTopProducts[invoiceDate].quantity
          ) {
            dailyTopProducts[invoiceDate] = {
              product: product.name,
              quantity: product.soldOut,
            };
          }
        });
      });
      setTopSellingProductPerDay(dailyTopProducts);
    } catch (error) {
      console.error("Failed to fetch product data:", error.message);
      setError("Failed to fetch product data. Please try again later.");
    }
  };

  const generateBarChartData = (invoicesData) => {
    const paidInvoices = invoicesData.filter(
      (invoice) => invoice.status === "Paid"
    );
    const unpaidInvoices = invoicesData.filter(
      (invoice) => invoice.status === "Unpaid"
    );

    const labels = invoicesData.map((invoice) => `EST-${invoice.invoiceId}`);
    const paidData = paidInvoices.map(
      (invoice) => invoice.totalAmount || invoice.amount
    );
    const unpaidData = unpaidInvoices.map(
      (invoice) => invoice.totalAmount || invoice.amount
    );

    // Define an array of colors
    const colors = [
      "rgba(75, 192, 192, 0.6)", // Paid
      "rgba(255, 99, 132, 0.6)", // Unpaid
    ];

    setBarChartData({
      labels,
      datasets: [
        {
          label: "Paid Invoices",
          data: paidData,
          backgroundColor: colors[0],
        },
        {
          label: "Unpaid Invoices",
          data: unpaidData,
          backgroundColor: colors[1],
        },
      ],
    });
  };

  const calculateProfitLoss = () => {
    let income = 0;
    let expenses = 0;
  
    filteredInvoices.forEach((invoice) => {
      const amountReceived = invoice.totalAmount || invoice.amount || 0; // Total amount received (selling price)
  
      if (invoice.status === "Paid") {
        income += amountReceived; // Income is based on the amount received
      } else if (invoice.status === "Unpaid") {
        const originalAmount = invoice.originalAmount || 0; // Original amount if unpaid
        expenses += originalAmount; // Accumulate expenses based on original amount
      }
    });
  
    setTotalIncome(income);
    setTotalExpenses(expenses);
  };
  
  

  const filterInvoicesByDate = (invoices, startDate, endDate) => {
    if (!startDate || !endDate) {
      return invoices;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate >= start && invoiceDate <= end;
    });
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      setError("Please select both Start Date and End Date");
      return;
    }
    const filteredData = filterInvoicesByDate(invoices, startDate, endDate);
    setFilteredInvoices(filteredData);
    setShowReport(true);
    generateBarChartData(filteredData);
    fetchProductData(); // Update pie chart data based on filtered invoices
    calculateProfitLoss(); // Calculate profit and loss based on filtered invoices
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  const handlePieChartClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const productName = pieChartData.labels[clickedIndex];
      setSelectedProduct(productName);
      fetchProductSalesData(productName);
    }
  };
  

  const fetchProductSalesData = (productName) => {
    try{
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const filteredProducts = products.filter(
      (product) => product.name === productName
    );
    const salesData = filteredProducts.map((product) => {
      const invoice = invoices.find((inv) => inv.id === product.invoiceId);
      const date = invoice ? new Date(invoice.date).toLocaleDateString() : "N/A";
      return {
        date: date,
        quantity: product.soldOut,
      };
    });
    setSelectedProductSalesData(salesData);
  }catch (error) {
    console.error("Failed to fetch product sales data:", error.message);
    setError("Failed to fetch product sales data. Please try again later.");
  }
  };

  return (
    <Container maxWidth="lg" className="main-content">
      <Box className="header" display="flex" alignItems="center" justifyContent="space-between">
        <Button variant="text" startIcon={<IoArrowBack />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Typography variant="h4" component="h1">
          Reports
        </Typography>
      </Box>

      <Box className="date-range-picker" display="flex" gap="10px" mt={3}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={!startDate || !endDate}
        >
          Search
        </Button>
      </Box>

      {showReport && (
        <>
          <Grid container spacing={4} mt={3}>
            <Grid item xs={12} md={6}>
              <Paper className="pie-chart" elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" component="h2">
                  Top 6 Sold Products
                </Typography>
                {pieChartData && (
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const label = context.label || "";
                              const value = context.raw || 0;
                              return `${label}: ${value}`;
                            },
                          },
                        },
                      },
                      onClick: handlePieChartClick,
                      
              
            
                      
                      
                    }}
                  />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="bar-chart" elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" component="h2">
                  Invoices Status
                </Typography>
                {barChartData && (
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const label = context.label || "";
                              const value = context.raw || 0;
                              return `${label}: ${value.toFixed(2)}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </Paper>
            </Grid>
          </Grid>

       <Box className="invoices-table" mt={4}>
  <Paper elevation={3} sx={{ p: 2 }}>
    <Typography variant="h6" component="h2">
      Invoices
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Invoice ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow key={invoice.invoiceId}>
              <TableCell>{`EST-${invoice.invoiceId}`}</TableCell>
              <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice.totalAmount ? `${invoice.totalAmount.toFixed(2)}` : "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
  </Box>

  <Box className="profit-loss-table" mt={4}>
  <Paper elevation={3} sx={{ p: 2 }}>
    <Typography variant="h6" component="h2">
     Profit and Loss Details
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Income</TableCell>
            <TableCell>Expenses</TableCell>
            <TableCell>Net Profit/Loss</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow key={invoice.invoiceId}>
              <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
              <TableCell>{invoice.status === 'Paid' ? `${(invoice.totalAmount || invoice.amount).toFixed(2)}` : 'N/A'}</TableCell>
              <TableCell>{invoice.status === 'Unpaid' ? `${(invoice.originalAmount || 0).toFixed(2)}` : 'N/A'}</TableCell>
              <TableCell>{invoice.status === 'Paid' ? `${((invoice.totalAmount || invoice.amount) - (invoice.originalAmount || 0)).toFixed(2)}` : 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
</Box>
          <Box className="daily-sales" mt={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" component="h2">
                Daily Top Selling Product
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(topSellingProductPerDay).map(
                      ([date, { product, quantity }]) => (
                        <TableRow key={date}>
                          <TableCell>{date}</TableCell>
                          <TableCell>{product}</TableCell>
                          <TableCell>{quantity}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
          <Box className="product-sales" mt={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" component="h2">
                {selectedProduct ? `Sales Data for ${selectedProduct}` : "Click on a product in the pie chart to see sales data"}
              </Typography>
              {selectedProduct && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Quantity Sold</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProductSalesData.map(({ date, quantity }, index) => (
                        <TableRow key={index}>
                          <TableCell>{date}</TableCell>
                          <TableCell>{quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        </>
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity="error" elevation={6} variant="filled">
          {error}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default ReportsContent;