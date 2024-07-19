import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Chart,
  Title,
  Tooltip,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
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
import { ControlPointDuplicateRounded } from "@mui/icons-material";

// Register necessary components with Chart.js
Chart.register(
  Title,
  Tooltip,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
);

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
  const [netProfits, setNetProfit] = useState(0);
  const [invoiceProfits, setInvoiceProfits] = useState([]);

  const [selectedProductSalesData, setSelectedProductSalesData] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  
  const [netProfitLoss, setNetProfitLoss] = useState(0);

  const [profitLossData, setProfitLossData] = useState([]);




  const calculateNetProfitLoss = (income, expenses) => {
    // Assuming income and expenses are arrays of objects with amount and date properties
    const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfitLoss = totalIncome - totalExpenses;
    return netProfitLoss;
  };

  


  useEffect(() => {
    // Fetch or calculate profit and loss data
    const fetchData = async () => {
      const data = await calculateProfitLossData();
      setProfitLossData(data);
    };
    
    fetchData();
  }, []);

  // Example of enhancing profit and loss calculation
const calculateProfitLossData = async () => {
  try {
    const invoicesData = filteredInvoices; // Use filtered invoices
    let totalIncome = 0;
    let netProfitLoss = 0;

    invoicesData.forEach((invoice) => {
      // Calculate cost and revenue for each invoice
      let totalCost = 0;
      let totalRevenue = 0;

      if (Array.isArray(invoice.items)) {
        totalCost = invoice.items.reduce((acc, item) => acc + item.price, 0);
      }

      // Assuming revenue can be directly obtained from invoice data
      totalRevenue = invoice.totalAmount || 0;

      // Calculate profit/loss for each invoice
      const profitLoss = totalRevenue - totalCost;

      // Accumulate income and net profit/loss
      totalIncome += totalRevenue;
      netProfitLoss += profitLoss;
    });

    return { totalIncome, netProfitLoss };
  } catch (error) {
    console.error("Error calculating profit and loss:", error);
    throw new Error("Failed to calculate profit and loss");
  }
};



  useEffect(() => {
    fetchInvoices();
    fetchProductData();
  }, []);

  const fetchInvoices = () => {
    const invoicesData = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(invoicesData);
    setFilteredInvoices(invoicesData);
    generateBarChartData(invoicesData);
  };

  // const fetchProductData = async () => {
  //   try {
  //     const products = JSON.parse(localStorage.getItem("products")) || [];
  //     console.log("products", products);
  //     if (products.length === 0) {
  //       throw new Error("No products data available");
  //     }

  //     const filteredInvoicesData = filterInvoicesByDate(
  //       invoices,
  //       startDate,
  //       endDate
  //     );
  //     const filteredInvoiceIds = filteredInvoicesData.map(
  //       (invoice) => invoice.id
  //     );

  //     const filteredProducts = products.filter((product) =>
  //       filteredInvoiceIds.includes(product.invoiceId)
  //     );

  //     // Group products by name and sum sold quantities
  //     const productSalesMap = new Map();
  //     filteredProducts.forEach((product) => {
  //       if (productSalesMap.has(product.name)) {
  //         productSalesMap.set(
  //           product.name,
  //           productSalesMap.get(product.name) + product.soldOut
  //         );
  //       } else {
  //         productSalesMap.set(product.name, product.soldOut);
  //       }
  //     });

  //     // Sort products by total sold quantity descending
  //     const sortedProducts = [...productSalesMap.entries()].sort(
  //       (a, b) => b[1] - a[1]
  //     );

  //     const topProducts = sortedProducts.slice(0, 6);
  //     const labels = topProducts.map(([name]) => name);
  //     const data = topProducts.map(([_, quantity]) => quantity);

  //     setPieChartData({
  //       labels,
  //       datasets: [
  //         {
  //           label: "Product Sales",
  //           data,
  //           backgroundColor: [
  //             "rgba(255, 99, 132, 0.6)",
  //             "rgba(54, 162, 235, 0.6)",
  //             "rgba(255, 206, 86, 0.6)",
  //             "rgba(75, 192, 192, 0.6)",
  //             "rgba(153, 102, 255, 0.6)",
  //             "rgba(255, 159, 64, 0.6)",
  //           ],
  //         },
  //       ],
  //     });

  //     // Determine top selling product per day
  //     const dailyTopProducts = {};
  //     filteredInvoicesData.forEach((invoice) => {
  //       const invoiceDate = new Date(invoice.date).toISOString().split("T")[0]; // Get YYYY-MM-DD
  //       if (!dailyTopProducts[invoiceDate]) {
  //         dailyTopProducts[invoiceDate] = {
  //           product: "",
  //           quantity: 0,
  //         };
  //       }
  //       filteredProducts.forEach((product) => {
  //         if (
  //           product.invoiceId === invoice.id &&
  //           product.soldOut > dailyTopProducts[invoiceDate].quantity
  //         ) {
  //           dailyTopProducts[invoiceDate] = {
  //             product: product.name,
  //             quantity: product.soldOut,
  //           };
  //         }
  //       });
  //     });
  //     setTopSellingProductPerDay(dailyTopProducts);
  //   } catch (error) {
  //     console.error("Failed to fetch product data:", error.message);
  //     setError("Failed to fetch product data. Please try again later.");
  //   }
  // };

const fetchProductData = async () => {
    try {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        console.log("products", products);
           
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
            const invoiceDate = new Date(invoice.date).toISOString().split("T")[0]; // Get YYYY-MM-DD
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

        // Calculate profit and loss
        let totalProfit = 0;
        let totalLoss = 0;
        let totalIncome = 0;
        let invoiceProfits = [];

        filteredInvoicesData.forEach((invoice) => {
            let costPrice = 0;
            if (Array.isArray(invoice.items)) {
                costPrice = invoice.items.reduce((total, item) => {
                    return total + (item.price || 0);
                }, 0);
                
            }

            const product = filteredProducts.find(
                (prod) => prod.invoiceId === invoice.id
            );
            if (!product) {
                return; // No product found, skip calculation
            }

            const sellingPrice = parseFloat(product.sellingPrice) || 0;
            const profit = sellingPrice - costPrice;
               
               
            if (invoice.status === "Paid") {
                if (profit >= 0) {
                    totalProfit += profit;
                } else {
                    totalLoss -= profit; // Adjust to subtract negative profit for losses
                }
                

                invoiceProfits.push({
                    id: invoice.id,
                    profit: profit,
                });

                // Accumulate income only for paid invoices
                totalIncome += costPrice;
            } else {
                console.log(`Invoice ${invoice.id} is not marked as Paid.`);
            }
        });

        // Log calculations for debugging
        console.log("Total Profit:", totalProfit);
        console.log("Total Loss:", totalLoss);
        console.log("Total Income:", totalIncome);
        console.log("Invoice Profits:", invoiceProfits);
        

        // Update state or perform any further actions as needed
        setNetProfit(totalProfit);
        setTotalIncome(totalIncome);
        setInvoiceProfits(invoiceProfits);

    } catch (error) {
        console.error("Failed to fetch product data:", error.message);
        setError("Failed to fetch product data. Please try again later.");
    }
};



  const generateBarChartData = (invoicesData) => {
    const labels = invoicesData.map((invoice) => `EST-${invoice.invoiceId}`);
    const paidData = labels.map((label, index) => {
      const invoice = invoicesData[index];
      return invoice.status === "Paid"
        ? invoice.totalAmount || invoice.amount
        : 0;
    });

    const unpaidData = labels.map((label, index) => {
      const invoice = invoicesData[index];
      return invoice.status === "Unpaid"
        ? invoice.totalAmount || invoice.amount
        : 0;
    });

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
  // const calculateProfitLoss = () => {
  //     let totalProfit = 0;
  //     let totalLoss = 0;
  //     let totalIncome = 0;
  //     let invoiceProfits = [];

  //     filteredInvoices.forEach((invoice) => {
  //         let costPrice = 0;
  //         if (Array.isArray(invoice.items)) {
  //             costPrice = invoice.items.reduce((total, item) => {
  //                 return total + (item.price || 0);
  //             }, 0);
  //         }

  //         const sellingPrice =
  //             parseFloat(localStorage.getItem(`products.${invoice.id}.price`)) || 0;

  //         if (invoice.status === "Paid") {
  //             const profit = costPrice - sellingPrice;
  //             if (profit >= 0) {
  //                 totalProfit += profit;
  //             } else {
  //                 totalLoss -= profit; // Adjust to subtract negative profit for losses
  //             }

  //             invoiceProfits.push({
  //                 id: invoice.id,
  //                 profit: profit,
  //             });
  //         } else {
  //             console.log(`Invoice ${invoice.id} is not marked as Paid.`);
  //         }

  //         // Accumulate income only for paid invoices
  //         if (invoice.status === "Paid") {
  //             totalIncome += costPrice;
  //         }
  //     });

  //     // Log calculations for debugging
  //     console.log("Total Profit:", totalProfit);
  //     console.log("Total Loss:", totalLoss);
  //     console.log("Total Income:", totalIncome);
  //     console.log("Invoice Profits:", invoiceProfits);

  //     // Set net profit, total income, and invoice profits in state
  //     setNetProfit(totalProfit);
  //     setTotalIncome(totalIncome);
  //     setInvoiceProfits(invoiceProfits);
  // };
  // const calculateProfitLoss = () => {
  //   let totalProfit = 0;
  //   let totalLoss = 0;
  //   let totalIncome = 0;
  //   let invoiceProfits = [];

  //   filteredInvoices.forEach((invoice) => {
  //     let costPrice = 0;
  //     // if (Array.isArray(invoice.items)) {
  //     //   costPrice = invoice.items.reduce((total, item) => {
  //     //     return total + (item.price || 0);
  //     //   }, 0);
  //     // }

  //     const sellingPrice =
  //       parseFloat(localStorage.getItem(`products.${invoice.id}.price`)) || 0;

  //     if (invoice.status === "Paid") {
  //       const profit = costPrice - sellingPrice;
  //       if (profit >= 0) {
  //         totalProfit += profit;
  //       } else {
  //         totalLoss -= profit; // Adjust to subtract negative profit for losses
  //       }

  //       invoiceProfits.push({
  //         id: invoice.id,
  //         profit: profit,
  //       });
  //     } else {
  //       console.log(`Invoice ${invoice.id} is not marked as Paid.`);
  //     }

  //     // Accumulate income only for paid invoices
  //     if (invoice.status === "Paid") {
  //       totalIncome += costPrice;
  //     }
  //   });

  //   // Log calculations for debugging
  //   console.log("Total Profit:", totalProfit);
  //   console.log("Total Loss:", totalLoss);
  //   console.log("Total Income:", totalIncome);
  //   console.log("Invoice Profits:", invoiceProfits);

  //   // Set net profit, total income, and invoice profits in state
  //   setNetProfit(totalProfit);
  //   setTotalIncome(totalIncome);
  //   setInvoiceProfits(invoiceProfits);
  // };

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
    // calculateProfitLoss(); // Calculate profit and loss based on filtered invoices
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
    try {
      const products = JSON.parse(localStorage.getItem("products")) || [];
      const filteredProducts = products.filter(
        (product) => product.name === productName
      );
      const salesData = filteredProducts.map((product) => {
        const invoice = invoices.find((inv) => inv.id === product.invoiceId);
        const date = invoice
          ? new Date(invoice.date).toLocaleDateString()
          : "N/A";
        return {
          date: date,
          quantity: product.soldOut,
        };
      });
      setSelectedProductSalesData(salesData);
    } catch (error) {
      console.error("Failed to fetch product sales data:", error.message);
      setError("Failed to fetch product sales data. Please try again later.");
    }
  };

  return (
    <div className="main-content">
      <Typography variant="h4" component="h1">
        <b>&ensp;Reports</b>
      </Typography>
      <hr />
      <div>
        <Box
          className="date-range-picker"
          display="flex"
          gap="10px"
          mt={3}
          style={{
            backgroundColor: "rgb(225, 245, 254)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            style={{
              backgroundColor: "rgb(225, 245, 254)",
              borderRadius: "5px",
            }}
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
            style={{
              backgroundColor: "rgb(225, 245, 254)",
              borderRadius: "5px",
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={!startDate || !endDate}
            className="button"
          >
            Search
          </Button>
        </Box>
      </div>

      {showReport && (
        <>
          <Grid container spacing={4} mt={3}>
            <Grid item xs={12} md={6}>
              <Paper
                className="pie-chart"
                elevation={2}
                sx={{ p: 2, height: "100%" }}
              >
                <Typography variant="h6" component="h2">
                  Top Sold Products
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
                        legend: {
                          position: "right",
                        },
                      },
                      // Interaction settings
                      interaction: {
                        mode: "index",
                        intersect: false,
                      },
                      elements: {
                        arc: {
                          borderWidth: 1.5, // Border width on hover
                          borderColor: "rgb(11, 23, 39)", // Border color on hover
                          hoverOffset: 75, // Adjust hover offset
                          borderRadius: 4, // Rounded corners of arcs
                        },
                      },
                      // Chart area and radius customization
                      radius: "70%", // Adjust the overall size of the pie chart
                      cutout: "0%", // Adjust the size of the center hole in the pie chart
                      onClick: handlePieChartClick,
                    }}
                  />
                )}
              </Paper>
            </Grid>
            <Grid item xs={15} md={6}>
              <Paper
                className="bar-chart"
                elevation={3}
                sx={{ p: 2, height: "100%" }}
              >
                <Typography variant="h6" component="h2">
                  Invoices Status
                </Typography>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
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
                        legend: {
                          position: "right",
                        },
                      },
                      // Interaction settings
                      interaction: {
                        mode: "index",
                        intersect: false,
                      },
                      elements: {
                        bar: {
                          hoverOffset: 200, // Adjust hover offset
                          borderColor: "rgb(11, 23, 39)", // Border color on hover
                          borderWidth: 4, // Border width on hover
                        },
                      },
                      // Blur effect on hover
                      hover: {
                        mode: "nearest",
                        intersect: true,
                        animationDuration: 400,
                        onHover: (event, chartElement) => {
                          event.target.style.cursor = chartElement[0]
                            ? "pointer"
                            : "default"; // Change cursor on hover
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
                        <TableCell>
                          {new Date(invoice.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{invoice.status}</TableCell>
                        <TableCell>
                          {invoice.totalAmount
                            ? `${invoice.totalAmount.toFixed(2)}`
                            : "N/A"}
                        </TableCell>
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
                      <TableCell>Net Profit/Loss</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                    {invoiceProfits.map(({ id, profit }) => {
                      const invoice = filteredInvoices.find(
                        (inv) => inv.id === id
                      );
                      if (!invoice) return null; // Ensure invoice is found
                         
                      // Calculate income based on invoice status
                      const income =
                        invoice.status === "Paid"
                          ? (invoice.totalAmount || invoice.amount).toFixed(2)
                          : "N/A";
                      console.log("income", income); // Log income for debugging
                          
                      return (
                        <TableRow key={id}>
                          <TableCell>
                            {new Date(invoice.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{income}</TableCell>
                          <TableCell>{profit.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
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
                {selectedProduct
                  ? `Sales Data for ${selectedProduct}`
                  : "Click on a product in the pie chart to see sales data"}
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
                      {selectedProductSalesData.map(
                        ({ date, quantity }, index) => (
                          <TableRow key={index}>
                            <TableCell>{date}</TableCell>
                            <TableCell>{quantity}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        </>
      )}

      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </MuiAlert>
        </Snackbar>
      )}
    </div>
  );
}

export default ReportsContent;
  