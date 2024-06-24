import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AddInvoiceForm from "../AddInvoiceForm/AddInvoiceForm";
import "./InvoicesContent.css";
import VisibilityIcon from '@mui/icons-material/Visibility';



function InvoicesContent() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/dashboard");
  };

  const initialInvoices = JSON.parse(localStorage.getItem("invoices")) || [
    {
      id: 1000,
      customerName: "Customer 1",
      amount: 100,
      date: "2023-01-01",
      status: "Paid",
    },
    {
      id: 1001,
      customerName: "Customer 2",
      amount: 200,
      date: "2023-01-02",
      status: "Unpaid",
    },
    {
      id: 1002,
      customerName: "Customer 3",
      amount: 300,
      date: "2023-01-03",
      status: "Paid",
    },
    {
      id: 1003,
      customerName: "Customer 4",
      amount: 400,
      date: "2023-01-04",
      status: "Unpaid",
    },
    {
      id: 1004,
      customerName: "Customer 5",
      amount: 500,
      date: "2023-01-05",
      status: "Paid",
    },
  ];

  const [invoices, setInvoices] = useState(initialInvoices);
  const [nextInvoiceId, setNextInvoiceId] = useState(() => {
    const maxId = initialInvoices.reduce(
      (max, invoice) => Math.max(invoice.id, max),
      999
    );
    return maxId + 1;
  });

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showNoResults, setShowNoResults] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleSearch = () => {
    const filtered = invoices.filter((invoice) =>
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceId.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInvoices(filtered);
    setShowNoResults(filtered.length === 0);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddClick = () => {
    setEditingInvoice(null);
    setShowAddForm(true);
  };

  const handleFormSubmit = (updatedInvoiceData) => {
    let updatedInvoices = [...invoices];
    let successMsg = "";

    if (editingInvoice) {
      updatedInvoices = updatedInvoices.map((invoice) =>
        invoice.id === updatedInvoiceData.id ? updatedInvoiceData : invoice
      );
      successMsg = "Invoice edited successfully!";
    } else {
      updatedInvoiceData.id = nextInvoiceId;
      updatedInvoices.push(updatedInvoiceData);
      setNextInvoiceId(nextInvoiceId + 1);
      successMsg = `New invoice for "${updatedInvoiceData.customerName}" added successfully!`;
    }

    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    setShowAddForm(false);
    setEditingInvoice(null);
    setSuccessMessage(successMsg);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingInvoice(null);
  };

  const handleDeleteClick = (invoiceId) => {
    const updatedInvoices = invoices.filter((invoice) => invoice.invoiceId !== invoiceId);
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    setSelectedInvoice(null);
    setSuccessMessage("Invoice deleted successfully!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleStatusToggle = (invoiceId) => {
    const updatedInvoices = invoices.map((invoice) => {
      if (invoice.invoiceId === invoiceId && invoice.status === "Unpaid") {
        return { ...invoice, status: "Paid" };
      }
      return invoice;
    });

    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    setSuccessMessage("Invoice status updated successfully!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleViewDetails = (invoiceId) => {
    const selected = invoices.find((invoice) => invoice.invoiceId === invoiceId);
    setSelectedInvoice(selected);
  };

  return (
    <div>
      <header className="Header">
        <h1>&ensp;&ensp;JYOTI Technosoft LLP Billing System</h1>
        <hr />
      </header>
      <div className="invoices">
        <Typography variant="h4">
          <Button
            onClick={goBack}
            style={{
              background: "#E1F5FE",
              border: "none",
              cursor: "pointer",
              fontSize: "2rem",
            }}
          >
            <IoArrowBack />
          </Button>
          <b>Invoices</b>
        </Typography>

        {successMessage && (
          <Snackbar
            open={true}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage("")}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              severity="success"
              onClose={() => setSuccessMessage("")}
            >
              {successMessage}
            </MuiAlert>
          </Snackbar>
        )}

        <Box display="flex" alignItems="center" mt={2}>
          <Box className="search-box">
            <TextField
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              variant="outlined"
              size="small"
            />
            <Button onClick={handleSearch} variant="contained">
              Search
            </Button>
          </Box>
          <Box className="action-buttons">
            <Button onClick={handleAddClick} variant="contained" color="primary">
              Add
            </Button>
          </Box>
        </Box>

        {showAddForm && (
          <Modal onClose={handleFormClose}>
            <AddInvoiceForm
              onClose={handleFormClose}
              onSubmit={handleFormSubmit}
              initialData={editingInvoice}
            />
          </Modal>
        )}

        {showNoResults && (
          <Typography variant="body1" className="no-results">
            No results found
          </Typography>
        )}

        <TableContainer
          style={{
            maxHeight: filteredInvoices.length > 100 ? "400px" : "unset",
            overflow: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Invoice ID</b>
                </TableCell>
                <TableCell>
                  <b>Customer Name</b>
                </TableCell>
                <TableCell>
                  <b>Amount</b>
                </TableCell>
                <TableCell>
                  <b>Date</b>
                </TableCell>
                <TableCell>
                  <b>Status</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>INV-{invoice.invoiceId}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{invoice.totalAmount || invoice.amount}/-</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>
                    {invoice.status === "Unpaid" ? (
                      <IconButton
                        onClick={() => handleStatusToggle(invoice.invoiceId)}
                        color="primary"
                      >
                        <CheckBoxIcon />
                      </IconButton>
                    ) : (
                      <span>
                        <IconButton disabled={invoice.status === "Paid"}>
                          <CheckBoxIcon />
                        </IconButton>
                      </span>
                    )}
                    <IconButton
                      onClick={() => handleDeleteClick(invoice.invoiceId)}
                      style={{ color: 'red' }}
                    >
                       <DeleteForeverIcon />
                    </IconButton>
                    <Button onClick={() => handleViewDetails(invoice.invoiceId)}
                      style={{ backgroundColor: "transparent"  }}>
                      
                      <VisibilityIcon style={{ color: 'gray' }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedInvoice && (
          <Modal
            onClose={() => setSelectedInvoice(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              p={3}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 3px 5px rgba(0,0,0,0.3)',
                padding: '24px',
                outline: 'none',
              }}
            >
              <Typography variant="h6" style={{ marginBottom: '16px' }}>Invoice Details</Typography>
              <Typography variant="body1" style={{ marginBottom: '8px' }}>
                <b>Invoice ID:</b> INV- {selectedInvoice.invoiceId}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '8px' }}>
                <b>Customer Name:</b> {selectedInvoice.customerName}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '8px' }}>
                <b>Amount:</b> {selectedInvoice.totalAmount}/-
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '8px' }}>
                <b>Date:</b> {selectedInvoice.date}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '8px' }}>
                <b>Status:</b> {selectedInvoice.status}
              </Typography>
            </Box>
          </Modal>
        )}
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

export default InvoicesContent;
