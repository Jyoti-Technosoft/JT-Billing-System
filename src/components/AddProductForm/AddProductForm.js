import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
const AddProductForm = ({ onClose, onSubmit, initialData }) => {
  const [productName, setProductName] = useState(initialData ? initialData.name : '');
  const [price, setPrice] = useState(initialData ? initialData.price.toString() : '');
  const [totalPurchase, setTotalPurchase] = useState(initialData ? initialData.totalPurchase.toString() : '');
  const [sellingPricePercentage, setSellingPricePercentage] = useState(initialData ? initialData.sellingPricePercentage.toString() : '');
  const [unit, setUnit] = useState(initialData ? initialData.unit : '');
  const [category, setCategory] = useState(initialData ? initialData.category : '');
  const [productNameError, setProductNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [totalPurchaseError, setTotalPurchaseError] = useState('');
  const [sellingPricePercentageError, setSellingPricePercentageError] = useState('');
  const [unitError, setUnitError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [formError, setFormError] = useState('');
  const [productAdded, setProductAdded] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const soldOut = initialData ? initialData.soldOut : 0;
    const available = totalPurchase - soldOut;
    const formattedPrice = typeof price === 'string' && price.includes('.')
      ? parseFloat(price).toFixed(2)
      : parseFloat(price).toString();
    const productData = {
      id: initialData ? initialData.id : Date.now(),
      name: productName,
      price: formattedPrice,
      totalPurchase: parseInt(totalPurchase),
      soldOut,
      available,
      sellingPricePercentage: parseFloat(sellingPricePercentage),
      unit,
      category,
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
    if (!/^\d+(\.\d{1,2})?$/.test(sellingPricePercentage)) {
      setSellingPricePercentageError('Please enter a valid percentage');
      isValid = false;
    } else {
      setSellingPricePercentageError('');
    }
    if (!unit) {
      setUnitError('Please select a unit');
      isValid = false;
    } else {
      setUnitError('');
    }
    if (!category) {
      setCategoryError('Please select a category');
      isValid = false;
    } else {
      setCategoryError('');
    }
    if (!productName || !price || !totalPurchase || !sellingPricePercentage || !unit || !category) {
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
    setSellingPricePercentage('');
    setUnit('');
    setCategory('');
    setProductNameError('');
    setPriceError('');
    setTotalPurchaseError('');
    setSellingPricePercentageError('');
    setUnitError('');
    setCategoryError('');
    setFormError('');
    setProductAdded(false);
  };
  return (
    <Paper elevation={4} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {initialData ? "Edit Product" : "Add New Product"}
      </Typography>
      {formError && <Typography color="error">{formError}</Typography>}
      {productAdded && <Typography color="success">Product added successfully!</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    border: 'none',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    border: 'none',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    border: 'none',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="selling-price-percentage"
              label="Selling Price Percentage (%)"
              value={sellingPricePercentage}
              onChange={(e) => setSellingPricePercentage(e.target.value)}
              variant="outlined"
              required
              error={!!sellingPricePercentageError}
              helperText={sellingPricePercentageError}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    border: 'none',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!unitError}>
              <InputLabel id="unit-label">Unit</InputLabel>
              <Select
                labelId="unit-label"
                id="unit"
                value={unit}
                label="Unit"
                onChange={(e) => setUnit(e.target.value)}
              >
                <MenuItem value="bags">BAGS (Bag)</MenuItem>
                <MenuItem value="bottles">BOTTLES (Btl)</MenuItem>
                <MenuItem value="box">BOX (Box)</MenuItem>
                <MenuItem value="bundles">BUNDLES (Bdl)</MenuItem>
                <MenuItem value="cans">CANS (Can)</MenuItem>
                <MenuItem value="cartons">CARTONS (Ctn)</MenuItem>
                <MenuItem value="dozens">DOZENS (Dzn)</MenuItem>
                <MenuItem value="kilograms">KILOGRAMS (Kg)</MenuItem>
                <MenuItem value="liters">LITERS (Ltr)</MenuItem>
                <MenuItem value="meters">METERS (Mtr)</MenuItem>
                <MenuItem value="milliliters">MILLILITERS (Ml)</MenuItem>
                <MenuItem value="numbers">NUMBERS (Nos)</MenuItem>
                <MenuItem value="packs">PACKS (Pac)</MenuItem>
                <MenuItem value="pairs">PAIRS (Prs)</MenuItem>
                <MenuItem value="pieces">PIECES (Pcs)</MenuItem>
                <MenuItem value="quintal">QUINTAL (Qtl)</MenuItem>
                <MenuItem value="rolls">ROLLS (Rol)</MenuItem>
                <MenuItem value="square-feet">SQUARE FEET (Sqf)</MenuItem>
                <MenuItem value="square-meters">SQUARE METERS (Sqm)</MenuItem>
                <MenuItem value="tablets">TABLETS (TbS)</MenuItem>
                <MenuItem value="other">OTHERS</MenuItem>
              </Select>
              {unitError && <Typography color="error">{unitError}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!categoryError}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="groceries">Groceries</MenuItem>
              </Select>
              {categoryError && <Typography color="error">{categoryError}</Typography>}
            </FormControl>
          </Grid>
          <Grid container justifyContent="flex-end" spacing={2} sx={{paddingTop:"20px"  }}>
  <Grid item>
    <Button
      type="submit"
      variant="contained"
    >
      {initialData ? 'Update' : 'Submit'}
    </Button>
  </Grid>
  <Grid item>
  <Button variant="contained" onClick={onClose}>
      Cancel
    </Button>
  </Grid>
</Grid>
        </Grid>
      </form>
    </Paper>
  );
};
export default AddProductForm;