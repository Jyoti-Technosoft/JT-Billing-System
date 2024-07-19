import React, { useState, useEffect } from 'react';
import AddCustomerForm from './AddCustomerForm';
import Modal from '../ResuableComponent/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import './CustomerContent.css';

function generateRandomId() {
  const randomId = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
  return `C-${randomId}`;
}

function CustomersContent() {
  const initialCustomers = JSON.parse(localStorage.getItem('customers')) || [
    { id: generateRandomId(), name: 'Customer 1', totalBilled: 0, outstanding: 200, latestBill: '0' },
    { id: generateRandomId(), name: 'Customer 2', totalBilled: 0, outstanding: 100, latestBill: '0' },
    { id: generateRandomId(), name: 'Customer 3', totalBilled: 0, outstanding: 300, latestBill: '0' },
    { id: generateRandomId(), name: 'Customer 4', totalBilled: 0, outstanding: 0, latestBill: '0' },
    { id: generateRandomId(), name: 'Customer 5', totalBilled: 0, outstanding: 400, latestBill: '0' },
  ];

  const [customers, setCustomers] = useState(initialCustomers);
  const [invoices] = useState(JSON.parse(localStorage.getItem('invoices')) || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deletionMessage, setDeletionMessage] = useState('');
  const [showNoResults, setShowNoResults] = useState(false);
  const [confirmDeletionOpen, setConfirmDeletionOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    // Calculate the total billed and outstanding for each customer
    const updatedCustomers = customers.map((customer) => {
      const customerInvoices = invoices.filter(
        (invoice) => invoice.customerName === customer.name
      );
      const totalBilled = customerInvoices.reduce(
        (sum, invoice) => sum + (invoice.totalAmount || invoice.amount),
        0
      );
      const outstanding = customerInvoices.reduce(
        (sum, invoice) => (invoice.status === 'Unpaid' ? sum + (invoice.totalAmount || invoice.amount) : sum),
        0
      );
      return { ...customer, totalBilled, outstanding };
    });
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
  }, [invoices]);

  const handleSearch = () => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setShowNoResults(filtered.length === 0);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddClick = () => {
    setEditingCustomer(null);
    setShowAddForm(true);
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setShowAddForm(true);
  };

  const handleFormSubmit = (formData) => {
    let updatedCustomers = [...customers];
    let successMsg = '';

    if (editingCustomer) {
      // Update existing customer
      updatedCustomers = updatedCustomers.map((customer) =>
        customer.id === formData.id ? { ...customer, ...formData } : customer
      );
      successMsg = `Customer "${formData.name}" edited successfully!`;
    } else {
      // Add new customer
      const newCustomer = {
        ...formData,
        totalBilled: 0,
        outstanding: 0,
        latestBill: '0',
        id: generateRandomId(),
      };
      updatedCustomers.push(newCustomer);
      successMsg = `New customer "${formData.name}" added successfully!`;
    }

    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
    setShowAddForm(false);
    setEditingCustomer(null);
    setSuccessMessage(successMsg);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingCustomer(null);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setConfirmDeletionOpen(true);
  };

  const handleDeleteConfirm = () => {
    const updatedCustomers = customers.filter((customer) => customer.id !== customerToDelete.id);
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
    setDeletionMessage(`Customer ${customerToDelete.name} deleted successfully!`);
    setConfirmDeletionOpen(false);
    setCustomerToDelete(null);
    setTimeout(() => {
      setDeletionMessage('');
    }, 3000);
  };

  const handleDeleteCancel = () => {
    setConfirmDeletionOpen(false);
    setCustomerToDelete(null);
  };

  return (
    <div className='customer'>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">
          <b>&ensp;Customers</b>
        </Typography>
      </Box>
      <hr />
      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </MuiAlert>
        </Snackbar>
      )}
      {deletionMessage && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => setDeletionMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MuiAlert elevation={6} variant="filled" severity="error" onClose={() => setDeletionMessage('')}>
            {deletionMessage}
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
            InputProps={{
              disableUnderline: true,
            }}
          />
          <Button
            onClick={handleSearch}
            variant="contained"
            style={{
              background: 'rgb(25, 118, 210)',
              color: 'white',
            }}
          >
            Search
          </Button>
        </Box>
        <Box className="action-buttons">
          <Button
            onClick={handleAddClick}
            variant="contained"
            color="primary"
            style={{
              background: 'rgb(25, 118, 210)',
              color: 'white',
            }}
          >
            Add
          </Button>
        </Box>
      </Box>
      {showAddForm && (
        <Modal onClose={handleFormClose}>
          <AddCustomerForm
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
            initialData={editingCustomer}
          />
        </Modal>
      )}
      {showNoResults && <Typography variant="body1">No Results Found!</Typography>}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Total Billed</b></TableCell>
              <TableCell><b>Outstanding</b></TableCell>
              <TableCell><b>Latest Bill</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.totalBilled}</TableCell>
                <TableCell>{customer.outstanding}</TableCell>
                <TableCell>{customer.latestBill}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(customer)}>
                    <MdEdit style={{ color: 'blue' }} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(customer)}>
                    <MdDeleteForever style={{ color: 'red' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={confirmDeletionOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="confirm-deletion-dialog-title"
        aria-describedby="confirm-deletion-dialog-description"
      >
        <DialogTitle id="confirm-deletion-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-deletion-dialog-description">
            Are you sure you want to delete customer "{customerToDelete?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
         <DialogActions>
  <Button
    onClick={handleDeleteCancel}
    style={{
      backgroundColor: 'rgb(255,255,255)', // Blue color for Cancel button
      color: 'bule',
      '&:hover': {
        backgroundColor: 'rgb(0, 80, 150)', // Darker blue on hover
      },
    }}
  >
    Cancel
  </Button>
  <Button
    onClick={handleDeleteConfirm}
    style={{
      backgroundColor: 'rgb(255,255,255)', // Red color for Confirm button
      color: 'red',
      '&:hover': {
        backgroundColor: 'rgb((255,255,255)', // Darker red on hover
      },
    }}
  >
    Confirm
  </Button>
</DialogActions>

        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CustomersContent;
