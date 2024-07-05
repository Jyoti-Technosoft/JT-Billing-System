import React, { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/dashboard');
  };

  const initialCustomers = JSON.parse(localStorage.getItem('customers')) || [
    { id: generateRandomId(), name: 'Customer 1', totalBilled: 0, outstanding: 200, latestBill: '0' },
    { id: generateRandomId(), name: 'Customer 2', totalBilled: 0, outstanding: 100, latestBill: '0' },
    { id: generateRandomId(), name: 'Customer 3', totalBilled: 0, outstanding: 300, latestBill: '0' },
    { id: generateRandomId(), name: 'Customer 4', totalBilled: 0, outstanding: 0, latestBill: '0' },
    { id: generateRandomId(), name: 'Customer 5', totalBilled: 0, outstanding: 400, latestBill: '0' },
  ];

  const [customers, setCustomers] = useState(initialCustomers);
  const [invoices ] = useState(JSON.parse(localStorage.getItem('invoices')) || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletedCustomers, setDeletedCustomers] = useState([]);
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
    if (editingCustomer) {
      const updatedCustomers = customers.map((customer) =>
        customer.id === formData.id ? { ...customer, ...formData } : customer
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      setSuccessMessage(`Customer "${formData.name}" edited successfully!`);
    } else {
      const newCustomer = {
        ...formData,
        totalBilled: 0,
        outstanding: 0, // Set outstanding to 0 for new customers
        latestBill: '0', // Set latestBill to "0" for new customers
        id: generateRandomId(),
      };
      const updatedCustomers = [...customers, newCustomer];
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      setSuccessMessage(`New customer "${formData.name}" added successfully!`);
    }
    setShowAddForm(false);
    setEditingCustomer(null);
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
    setDeletedCustomers([...deletedCustomers, customerToDelete]);
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
      <Box display="flex" alignItems="center" justifyContent="space-between" >
        <Typography variant="h4">
          <b>&ensp;Customers</b>
        </Typography>
      </Box>
      <hr />
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
          <Button onClick={handleSearch} variant="contained" style={{
              background: 'rgb(25, 118, 210)',
              color: 'white',
            }}>Search</Button>
        </Box>
        <Box className="action-buttons">
          <Button onClick={handleAddClick} variant="contained" color="primary" style={{
              background: 'rgb(25, 118, 210)',
              color: 'white',
            }}>Add</Button>
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
              <TableCell><b>Customer ID</b></TableCell>
              <TableCell><b>Customer Name</b></TableCell>
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
                <TableCell>{customer.totalBilled}/-</TableCell>
                <TableCell>{customer.outstanding}/-</TableCell>
                <TableCell>{customer.latestBill}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(customer)} color="primary" style={{
              background: 'rgb(25, 118, 210)',
              color: 'white',
            }}>
                    <MdEdit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(customer)} style={{ color: 'red' }}>
                    <MdDeleteForever />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={successMessage !== ''}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <MuiAlert elevation={6} variant="filled" onClose={() => setSuccessMessage('')} severity="success">
          {successMessage}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={deletionMessage !== ''}
        autoHideDuration={3000}
        onClose={() => setDeletionMessage('')}
      >
        <MuiAlert elevation={6} variant="filled" onClose={() => setDeletionMessage('')} severity="error">
          {deletionMessage}
        </MuiAlert>
      </Snackbar>
      <Dialog
        open={confirmDeletionOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {customerToDelete ? customerToDelete.name : 'this customer'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
    
  );
}

export default CustomersContent;
