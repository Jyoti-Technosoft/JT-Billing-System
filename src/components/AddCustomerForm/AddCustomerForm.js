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
  const [gstNumber, setGstNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName || '');
      setLastName(initialData.lastName || '');
      setCity(initialData.city || '');
      setState(initialData.state || '');
      // Additional fields
      setGstNumber(initialData.gstNumber || '');
      setPhoneNumber(initialData.phoneNumber || '');
      setAddress(initialData.address || '');
      setEmail(initialData.email || '');
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
      // Additional fields
      gstNumber,
      phoneNumber,
      address,
      email,
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
    // Additional fields
    setGstNumber('');
    setPhoneNumber('');
    setAddress('');
    setEmail('');
  };
  const modalContentStyle = {
    width: '100%',
    fontFamily: "'Poppins', sans-serif",
    position: 'relative',
    transform: 'scale(0.9)', // Initial scale
    transition: 'transform 0.3s ease', // Add transition effect
    overflow: 'hidden' // Add overflow hidden to prevent content from overflowing
  };
  return (
    <div style={modalContentStyle}>
    <Paper elevation={4} sx={{ p: 4, bgcolor: 'white', borderRadius: 4, boxShadow: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {initialData ? 'Edit Customer' : 'Add New Customer'}
      </Typography>
      <hr/>
      {formError && <Typography color="error">{formError}</Typography>}
      {customerAdded && <Typography color="success">Customer added successfully!</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <TextField
              fullWidth
              id="outlined-multiline-flexible"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              variant="outlined"
              required
              error={!!firstNameError}
              helperText={firstNameError}
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
              id="outlined-multiline-flexible"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              variant="outlined"
              required
              error={!!lastNameError}
              helperText={lastNameError}
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
          {/* Additional fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="gst-number"
              label="GST Number"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              variant="outlined"
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
              id="phone-number"
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              variant="outlined"
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
              id="address"
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    border: 'none',
                  },
                },
              }}
            /><hr/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    border: 'none',
                  },
                },
              }}
            /> <hr/>
          </Grid>
          <Grid container justifyContent="flex-end" spacing={2} sx={{paddingTop:"15px"  }}>
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
    </div>
  );
};
export default AddCustomerForm;