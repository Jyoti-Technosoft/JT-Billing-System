import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
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
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import './ProductsContent.css'; // Ensure this import is correct
import AddProductForm from '../AddProductForm/AddProductForm';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog/DeleteConfirmationDialog';

function generateProductId() {
  const randomId = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
  return `P-${randomId}`;
}

function ProductsContent() {
  const navigate = useNavigate();

  // Initial products data
  const initialProducts = JSON.parse(localStorage.getItem('products')) || [
    { id: generateProductId(), name: 'Product 1', price: 10, totalPurchase: 100, soldOut: 20, available: 80 },
    { id: generateProductId(), name: 'Product 2', price: 20, totalPurchase: 200, soldOut: 40, available: 160 },
    { id: generateProductId(), name: 'Product 3', price: 30, totalPurchase: 150, soldOut: 30, available: 120 },
    { id: generateProductId(), name: 'Product 4', price: 40, totalPurchase: 300, soldOut: 50, available: 250 },
    { id: generateProductId(), name: 'Product 5', price: 50, totalPurchase: 250, soldOut: 10, available: 240 },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deletionMessage, setDeletionMessage] = useState('');
  const [showNoResults, setShowNoResults] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const goBack = () => {
    navigate('/dashboard');
  };

  const handleSearch = () => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setShowNoResults(filtered.length === 0);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setShowAddForm(true);
  };

  const handleFormSubmit = (updatedProductData) => {
    let updatedProducts = [...products];
    let successMsg = '';

    if (editingProduct) {
      // Update existing product
      updatedProducts = updatedProducts.map((product) =>
        product.id === updatedProductData.id ? updatedProductData : product
      );
      successMsg = 'Product edited successfully!';
    } else {
      // Add new product
      updatedProductData.id = generateProductId();
      updatedProducts.push(updatedProductData);
      successMsg = `New product "${updatedProductData.name}" added successfully!`;
    }

    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setShowAddForm(false);
    setEditingProduct(null);
    setSuccessMessage(successMsg);

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleOpenDeleteDialog = (productId) => {
    setDeleteDialogOpen(true);
    setProductIdToDelete(productId);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductIdToDelete(null);
  };

  const handleConfirmDelete = () => {
    const updatedProducts = products.filter((product) => product.id !== productIdToDelete);
    const deletedProduct = products.find((product) => product.id === productIdToDelete);

    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setDeletionMessage(`Product ${deletedProduct.name} deleted successfully!`);

    handleCloseDeleteDialog();

    setTimeout(() => {
      setDeletionMessage('');
    }, 3000);
  };

  return (
    <div>
      <header className="Header">
        <h1>&ensp;&ensp;JYOTI Technosoft LLP Billing System</h1>
        <hr />
      </header>
    <div className="products">
      <Typography variant="h4">
        <Button
          onClick={goBack}
          style={{
            background: '#E1F5FE',
            border: 'none',
            cursor: 'pointer',
            fontSize: '2rem',
          }}
        >
          <IoArrowBack />
        </Button>
        <b>Products</b>
      </Typography>

      {successMessage && (
        <Snackbar open={true} autoHideDuration={3000} onClose={() => setSuccessMessage('')}>
          <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </MuiAlert>
        </Snackbar>
      )}

      {deletionMessage && (
        <Snackbar open={true} autoHideDuration={3000} onClose={() => setDeletionMessage('')}>
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
          <AddProductForm onClose={handleFormClose} onSubmit={handleFormSubmit} initialData={editingProduct} />
        </Modal>
      )}

      {showNoResults && <Typography variant="body1" className="no-results">No results found</Typography>}

      <TableContainer style={{ maxHeight: filteredProducts.length > 100 ? '400px' : 'unset', overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>Product ID</b></TableCell>
              <TableCell><b>Product Name</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Total Purchase</b></TableCell>
              <TableCell><b>Sold Out</b></TableCell>
              <TableCell><b>Available</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}/-</TableCell>
                <TableCell>{product.totalPurchase}</TableCell>
                <TableCell>{product.soldOut}</TableCell>
                <TableCell>{product.available}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton onClick={() => handleEditClick(product)} color="primary">
                      <MdEdit />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(product.id)} style={{ color: 'red' }}>
                      <MdDeleteForever />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={handleConfirmDelete}
      />
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

export default ProductsContent;
