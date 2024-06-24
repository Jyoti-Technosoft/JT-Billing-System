import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Paper
} from '@mui/material';

const AddCustomerForm = ({ onClose, onSubmit, initialData }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [cityError] = useState('');
  const [formError, setFormError] = useState('');
  const [customerAdded, setCustomerAdded] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName || '');
      setLastName(initialData.lastName || '');
      setCity(initialData.city || '');
      setState(initialData.state || '');
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const customerData = {
      id: initialData ? initialData.id : `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(/\s/g, ''),
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      city,
      state,
    };
    onSubmit(customerData);
    setCustomerAdded(true);
    resetFormFields();
  };

  const validateInputs = () => {
    let isValid = true;
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      setFirstNameError('Please enter only alphabetic characters');
      isValid = false;
    } else {
      setFirstNameError('');
    }
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      setLastNameError('Please enter only alphabetic characters');
      isValid = false;
    } else {
      setLastNameError('');
    }
    if (!firstName || !lastName || !city || !state) {
      setFormError("Please fill in all fields.");
      isValid = false;
    } else {
      setFormError('');
    }
    return isValid;
  };

  const resetFormFields = () => {
    setFirstName('');
    setLastName('');
    setCity('');
    setState('');
  };

  return (
    <Paper elevation={4} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 3, maxWidth: 600, width: '90%' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {initialData ? 'Edit Customer' : 'Add New Customer'}
      </Typography>
      {formError && <Typography color="error">{formError}</Typography>}
      {customerAdded && <Typography color="success">Customer added successfully!</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="first-name"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              variant="outlined"
              required
              error={!!firstNameError}
              helperText={firstNameError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="last-name"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              variant="outlined"
              required
              error={!!lastNameError}
              helperText={lastNameError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                label="City"
                variant="outlined"
                required
                error={!!cityError}
              >
                <MenuItem value=""><em>Choose...</em></MenuItem>
                <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Kochi">Kochi</MenuItem>
                <MenuItem value="Jaipur">Jaipur</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                label="State"
                variant="outlined"
                required
              >
                <MenuItem value=""><em>Choose...</em></MenuItem>
                <MenuItem value="Gujarat">Gujarat</MenuItem>
                <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                <MenuItem value="Kerala">Kerala</MenuItem>
                <MenuItem value="Rajasthan">Rajasthan</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={12} xl={2} >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {initialData ? 'Update' : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddCustomerForm;
