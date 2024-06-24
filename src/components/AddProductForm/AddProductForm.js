import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper
} from '@mui/material';
const AddProductForm = ({ onClose, onSubmit, initialData }) => {
  const [productName, setProductName] = useState(initialData ? initialData.name : '');
  const [price, setPrice] = useState(initialData ? initialData.price.toString() : '');
  const [totalPurchase, setTotalPurchase] = useState(initialData ? initialData.totalPurchase.toString() : '');
  const [productNameError, setProductNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [totalPurchaseError, setTotalPurchaseError] = useState('');
  const [formError, setFormError] = useState('');
  const [productAdded, setProductAdded] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const soldOut = initialData ? initialData.soldOut : 0;
    const available = totalPurchase - soldOut;
    // Check if price is a string and contains a decimal point
    const formattedPrice = typeof price === 'string' && price.includes('.')
      ? parseFloat(price).toFixed(2)
      : parseFloat(price).toString(); // Ensure price is converted to string
    const productData = {
      id: initialData ? initialData.id : Date.now(),
      name: productName,
      price: formattedPrice,
      totalPurchase: parseInt(totalPurchase),
      soldOut,
      available,
    };
    onSubmit(productData);
    setProductAdded(true);
    resetFormFields();
  };
  const validateInputs = () => {
    let isValid = true;
    if (!productName) {
      setProductNameError('Product name is required');
      isValid = false;
    } else {
      setProductNameError('');
    }
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      setPriceError('Please enter a valid price');
      isValid = false;
    } else {
      setPriceError('');
    }
    if (!/^\d+$/.test(totalPurchase)) {
      setTotalPurchaseError('Please enter a valid total purchase number');
      isValid = false;
    } else {
      setTotalPurchaseError('');
    }
    if (!productName || !price || !totalPurchase) {
      setFormError("Please fill in all fields.");
      isValid = false;
    } else {
      setFormError('');
    }
    return isValid;
  };
  const resetFormFields = () => {
    setProductName('');
    setPrice('');
    setTotalPurchase('');
    setProductNameError('');
    setPriceError('');
    setTotalPurchaseError('');
    setFormError('');
    setProductAdded(false);
  };
  return (
    <Paper elevation={4} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 3, maxWidth: 600, width: '90%' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {initialData ? "Edit Product" : "Add New Product"}
      </Typography>
      {formError && <Typography color="error">{formError}</Typography>}
      {productAdded && <Typography color="success">Product added successfully!</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="product-name"
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              variant="outlined"
              required
              error={!!productNameError}
              helperText={productNameError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="price"
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              variant="outlined"
              required
              error={!!priceError}
              helperText={priceError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="total-purchase"
              label="Total Purchase"
              value={totalPurchase}
              onChange={(e) => setTotalPurchase(e.target.value)}
              variant="outlined"
              required
              error={!!totalPurchaseError}
              helperText={totalPurchaseError}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={12} xl={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
export default AddProductForm;