import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Snackbar, Alert, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import "./AddInvoiceForm.css";
import { IoArrowBack } from 'react-icons/io5';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AddCustomerForm from '../Customers/AddCustomerForm';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
const AddInvoiceForm = ({ onClose,invoiceToEdit, onEditComplete }) => {
  const [newItem, setNewItem] = useState({
    item: "",
    quantity: 1,
    status: "Unpaid",
  });
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/products');
  };
  
  
  const [open, setOpen] = useState(false);
  const [initialData, setInitialData] = useState(null); // For editing, not needed here
  const [newCustomer, setNewCustomer] = useState({});
  const [availableQuantity, setAvailableQuantity] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [productName, setProductName] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [showReviewInvoice, setShowReviewInvoice] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  const taxOptions = [
    { label: 'IGST- 18%', value: 18 },
    { label: 'GST - 18%', value: 18 },
    { label: 'GST - 10%', value: 10 },
    { label: 'VAT - 12%', value: 12 },
    { label: 'Service Tax - 5%', value: 5 },
    { label: 'IGST- 0%', value: 0 },
    { label: 'GST - 0%', value: 0 },
    { label: 'IGST- 0.25%', value: 0.25 },
    { label: 'GST - 0.25%', value: 0.25 },
    { label: 'IGST- 3%', value: 3 },
    { label: 'GST - 3%', value: 3 },
    { label: 'IGST- 5%', value: 5 },
    { label: 'GST - 5%', value: 5 },
    { label: 'IGST- 12%', value: 12 },
    { label: 'GST - 12%', value: 12 },
    { label: 'IGST- 28%', value: 28 },
    { label: 'GST - 28%', value: 28 },
    // Add more options as needed
  ];
  


  const handleAddNewCustomer = (customerData) => {
    setCustomers([...customers, customerData]);
    setCustomerName(customerData);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const storedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setCustomers(storedCustomers);
    setProducts(storedProducts);
    setInvoices(storedInvoices);
  }, []);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    initializeFormFromInvoice();
  }, [invoiceToEdit, customers, products]);

  const initializeFormFromInvoice = () => {
    if (invoiceToEdit) {
      const selectedCustomer = customers.find(c => c.name === invoiceToEdit.customerName);
      setCustomerName(selectedCustomer);
      setCustomerEmail(selectedCustomer ? selectedCustomer.email : "");
      setCurrentItems(invoiceToEdit.items);
      if (invoiceToEdit.items.length > 0) {
        const firstItem = invoiceToEdit.items[0];
        const selectedProduct = products.find(p => p.name === firstItem.item);
        setProductName(selectedProduct);
        if (selectedProduct) {
          setAvailableQuantity(selectedProduct.available);
        }
      }
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!customerName) {
      showSnackbar("Please select a customer.", "error");
      return;
    }
    if (!productName) {
      showSnackbar("Please select a product.", "error");
      return;
    }
    if (newItem.quantity <= 0 || isNaN(newItem.quantity)) {
      showSnackbar("Please enter a valid quantity.", "error");
      return;
    }

    const product = products.find((p) => p.name === productName.name);
    if (product) {
      if (product.available >= newItem.quantity) {
        const updatedProducts = products.map((p) =>
          p.name === productName.name
            ? {
                ...p,
                available: p.available - newItem.quantity,
                soldOut: p.soldOut + newItem.quantity,
              }
            : p
        );
        setProducts(updatedProducts);

        const sellingPrice = product.price * (1 + product.sellingPricePercentage / 100); // Selling price is 10% less than original price
        const existingItemIndex = currentItems.findIndex(
          (item) => item.item === productName.name
        );
        if (existingItemIndex !== -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          setCurrentItems(updatedItems);
        } else {
          const newItemToAdd = {
            item: productName.name,
            quantity: newItem.quantity,
            price: sellingPrice,
            status: newItem.status,
          };
          setCurrentItems([...currentItems, newItemToAdd]);
        }

        resetFormFields();
      } else {
        showSnackbar(
          "Not enough quantity available for this product.",
          "error"
        );
      }
    } else {
      showSnackbar("Selected product not found.", "error");
    }
  };

  const handleCreateInvoice = () => {
    if (!customerName) {
      showSnackbar("Please select a customer.", "error");
      return;
    }
    if (currentItems.length === 0) {
      showSnackbar("Please add at least one item to the invoice.", "error");
      return;
    }

    const currentDate = new Date().toLocaleString();
    const subtotal = currentItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    const taxAmount = (subtotal * (taxRate / 100));
    const totalAmount = subtotal + taxAmount - discount;
    const invoiceId = generateInvoiceId();

    const newInvoice = {
      invoiceId,
      date: currentDate,
      customerName: customerName.name,
      status: newItem.status,
      items: currentItems,
      taxRate,
      discount,
      subtotal,
      taxAmount,
      totalAmount,
    };

    setInvoices([...invoices, newInvoice]);
    setCurrentInvoice(newInvoice);
    setCurrentItems([]);
    setShowReviewInvoice(true);
  };

  const generateInvoiceId = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: name === "quantity" ? parseFloat(value) : value,
    }));
  };

  const handleDeleteItem = (index) => {
    const itemToDelete = currentItems[index];
    const updatedItems = currentItems.filter((item, idx) => idx !== index);
    setCurrentItems(updatedItems);

    const updatedProducts = products.map((p) =>
      p.name === itemToDelete.item
        ? {
            ...p,
            available: p.available + itemToDelete.quantity,
            soldOut: p.soldOut - itemToDelete.quantity,
          }
        : p
    );
    setProducts(updatedProducts);
  };

  const handleDownloadPDF = () => {
    if (!currentInvoice) {
      return;
    }
  
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 10;
  
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text(`Invoice: INV-${currentInvoice.invoiceId}`, 10, y);
    y += 10;
  
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(15);
    pdf.text(`Date: ${currentInvoice.date}`, 10, y);
    pdf.text(`Customer: ${currentInvoice.customerName}`, 10, y + 10);
    pdf.text(`Phone: ${customerName.phoneNumber}`, 10, y + 20); // Display Phone number
    pdf.text(`Email: ${customerName.email}`, 10, y + 30); // Display Email
    pdf.text(`GST No.: ${customerName.gstNumber}`, 10, y + 40); // Display GST number
    pdf.text(`Address: ${customerName.address}`, 10, y + 50); // Display Address
    y += 60;
  
    pdf.setFontSize(12);
    pdf.text("Item", 10, y);
    pdf.text("Quantity", 50, y);
    pdf.text("Price", 90, y); // Change to Selling Price
    pdf.text("Status", 130, y);
    pdf.text("Total", 170, y);
    y += 10;
  
    currentInvoice.items.forEach((item) => {
      pdf.setFontSize(10);
      pdf.text(item.item, 10, y);
      pdf.text(item.quantity.toString(), 50, y);
      pdf.text(item.price.toFixed(2), 90, y); // Display Selling Price
      pdf.text(item.status, 130, y);
      pdf.text((item.quantity * item.price).toFixed(2), 170, y); // Total based on Selling Price
      y += 10;
    });
  
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(`Subtotal: ${currentInvoice.subtotal.toFixed(2)}`, 10, y);
    pdf.text(
      `Tax (${currentInvoice.taxRate}%): ${currentInvoice.taxAmount.toFixed(
        2
      )}`,
      10,
      y + 10
    );
    pdf.text(`Discount: ${currentInvoice.discount.toFixed(2)}`, 10, y + 20);
    pdf.text(
      `Total Amount: ${currentInvoice.totalAmount.toFixed(2)}`,
      10,
      y + 30
    );
  
    pdf.save(`invoice_${currentInvoice.invoiceId}.pdf`);
  };
  

  const resetFormFields = () => {
    setNewItem({ item: "", quantity: 1, price: 0, status: "Unpaid" });
    setProductName(null);
    setAvailableQuantity(null); // Reset available quantity
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const modalContentStyle = {
    width: '100%',
    fontFamily: "'Poppins', sans-serif",
    position: 'relative',
    transform: 'scale(0.9)', // Initial scale
    transition: 'transform 0.3s ease', // Add transition effect
    overflow: 'hidden' // Add overflow hidden to prevent content from overflowing
  };

  return  (
    <div style={modalContentStyle}>
    <form className="invoice" style={{ p: 4, bgcolor: 'white', boxShadow: 3, maxHeight: "800px", overflowY: "auto" }}>
      <div className="head">
        
      <Typography variant="h4">
       
          <b>&ensp;Create Invoice</b>
        </Typography></div>
       
      <div className="input-container"  style={{ display: "flex",color:"black",  flexDirection: "column", justifyContent: "space-between" }}>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <div >
          <label>Customer Name :</label>
          <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={[{ name: '+ Add New Customer' },...customers ]}
        getOptionLabel={(option) => option.name}
        
        value={customerName}
        onChange={(event, newValue) => {
          if (newValue && newValue.name === '+ Add New Customer') {
            setOpen(true);
          } else {
            setCustomerName(newValue);
          }
        }}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <input 
              type="text" 
              {...params.inputProps} 
              placeholder="Select Customer" 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
            />
          </div>
        )}        renderOption={(props, option) => (
          <li {...props} key={option.name}>
            {option.name}
          </li>
        )}
      />
     <Dialog open={open} onClose={handleClose} PaperProps={{ style: { backgroundColor: 'transparent', boxShadow: 'none' } }}>
  <AddCustomerForm onClose={handleClose} onSubmit={handleAddNewCustomer} initialData={null} />
</Dialog>
        </div>
        </Grid>
        <Grid item xs={12} sm={6}>
        <div >
        <label htmlFor="phoneno">Customer Phone No. :</label>
          <input
            style={{ width: '100%' }}
            type="text"
            id="phoneno"
            value={customerName ? customerName.phoneNumber : ""}
            onChange={(e) => {
            }}
        />
        </div>
        </Grid>
        </Grid>
        <hr/>
        <div style={{ display: "flex",color:"black", flexDirection: "row", justifyContent: "space-between" }} >
        <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <div >
        <label htmlFor="gstno">Customer GST No. :</label>
          <input
          style={{ width: '100%' }}
            type="text"
            id="gstno"
            value={customerName ? customerName.gstNumber : ""}
            onChange={(e) => {
            }}
        />
        </div>
        </Grid>
        <Grid item xs={12} sm={6}>
        <div >
        <label htmlFor="email">Customer Email :</label>
          <input
          style={{ width: '100%' }}
            type="text"
            id="email"
            value={customerName ? customerName.email : "" }
            onChange={(e) => {
    }}
          />
        </div>
        </Grid>
        </Grid>
        </div>
        <hr/>
        <Grid item xs={12} sm={6}>
        <div >
        <label htmlFor="address">Customer Address:</label>
  <input
   style={{ width: '100%' }}
    type="text"
    id="address"
    value={customerName ? customerName.address : ""}
    onChange={(e) => {
    }}
  />
  </div>
  </Grid>
      <hr/>
      <div  style={{ display: "flex",color:"black", flexDirection: "row", justifyContent: "space-between" }}>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <div >
          <label>Product Name : </label>
          <Autocomplete
          
  options={products}
  getOptionLabel={(option) => option.name}
  value={productName}
  onChange={(event, newValue) => {
    setProductName(newValue);
    if (newValue) {
      setNewItem((prevItem) => ({
        ...prevItem,
        item: newValue.name,
        price: newValue.price, // Set selling price as 10% less than original price
      }));
      setAvailableQuantity(newValue.available);
    }
  }}
  renderInput={(params) => (
    <div ref={params.InputProps.ref}>
      <input
        type="text"
        {...params.inputProps}
        placeholder="Select Product"
        style={{ width: '202%', padding: '8px', boxSizing: 'border-box' }} 
      />
    </div>
  )}
/>
        </div></Grid></Grid>
      </div>
      <hr/>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6}  >
      <div >
      <Box style={{ height: '55px'}}>
          <label>Quantity :</label>
          <input
            type="number"
            name="quantity"
            style={{ width: '100%', height: '100%' }}
            value={newItem.quantity}
            onChange={handleChange}
          />  </Box>
        </div></Grid>
        <Grid item xs={12} sm={6}>
        <div >
          <label>Status :</label>
          <select
            name="status"
            value={newItem.status}
            style={{ width: '100%', height: '100%' }}
            onChange={handleChange}
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div></Grid></Grid>
        <hr/>
        <div style={{ display: "flex",color:"black", flexDirection: "row", justifyContent: "space-between" }}>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
        <div>
        <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
      <Box style={{ height: '55px' }}>
          <label>Tax Rate (%) :</label>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={taxOptions}
            sx={{ width: '204%' }}
            renderInput={(params) => <TextField {...params} label="Select Tax" />}
            onChange={(event, newValue) => {
              if (newValue) {
                setTaxRate(newValue.value);
              }
            }}
          />
        </Box>
      </Grid>
    </Grid>
    </div>
    </Grid>
        <Grid item xs={12} sm={6}>
        <div >
        <Box style={{ height: '55px'}}>
          <label>Discount :</label>
          <input
            type="number"
            value={discount}
            style={{ width: '100%', height: '100%' }}
            onChange={(e) => setDiscount(parseFloat(e.target.value))}
          /></Box>
        </div>
        </Grid></Grid>
        
        </div>
        <br></br>
        <hr/>

      <div style={{ display: "flex",color:"black", flexDirection: "row", justifyContent: "space-between" }}>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
      {productName && (
          
          <div>
            <label>Product Price:</label>
          <input
       style={{ width: '100%' }}
         type="text"
         id="price"
         value={productName.price * (1 + productName.sellingPricePercentage / 100).toFixed(2)}
         onChange={(e) => {
        }}
     />
          </div>
            )}
            </Grid>
            <Grid item xs={12} sm={6}>
          {productName && (
          <div >
            <label>Available Quantity:</label>
          <input
       style={{ width: '100%' }}
         type="text"
         id="quntity"
         value={availableQuantity}
         onChange={(e) => {
        }}
     />
          </div> 
          )}</Grid></Grid>
      </div>
      <Grid container justifyContent="flex-end" spacing={2} sx={{ paddingTop: "15px" }}>
  <Grid item>
    <Button variant="contained" onClick={onClose}>
      Cancel
    </Button>
  </Grid>
  <Grid item>
    <Button variant="contained" color="primary" onClick={handleAddItem}>
      Add Item
    </Button>
  </Grid>
</Grid>
      <div className="invoices-container" style={{ color: "black" }}>
        {currentItems.length > 0 && (
          <>
          <hr/>
            <h2>Item List</h2>
            <div className="invoice" >
              <table>
                <thead > 
                  <tr >
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.item}</td>
                      <td>{item.quantity}</td>
                      <td>{Number(item.price).toFixed(2)}/-</td>
                      <td>{newItem.status}</td>
                      <td>{(item.quantity * item.price).toFixed(2)}/-</td>
                      <td>
                      <IconButton onClick={() => handleDeleteItem(index)} aria-label="delete">
    <DeleteForeverIcon />
      </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      
      <Grid container justifyContent="flex-end">
      {currentItems.length > 0 && (
        <div style={{  borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
  <button className="button" onClick={handleCreateInvoice} style={{ color: "black" }}>
    Create Invoice
  </button>
</div>

      )}
      </Grid>
      
      {showReviewInvoice && (
        <div className="invoice">
          <h3>Invoice: INV-{currentInvoice.invoiceId}</h3>
          <p>Customer Name: {currentInvoice.customerName}</p>
          <p>Status: {newItem.status}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.item}</td>
                  <td>{item.quantity}</td>
                  <td>{Number(item.price).toFixed(2)}/-</td>
                  <td>{newItem.status}</td>
                  <td>{(item.quantity * item.price).toFixed(2)}/-</td>
                  <td>
                  <IconButton onClick={() => handleDeleteItem(index)} aria-label="delete"   >
        <DeleteForeverIcon />
      </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Subtotal: {currentInvoice.subtotal.toFixed(2)}/-</p>
          <p>
            Tax ({currentInvoice.taxRate}%):{" "}
            {currentInvoice.taxAmount.toFixed(2)}
          </p>
          <p>Discount: {currentInvoice.discount.toFixed(2)}</p>
          <h3>Total Amount: {currentInvoice.totalAmount.toFixed(2)}/-</h3>
        </div>
      )}
      <Grid container justifyContent="flex-end">
      {showReviewInvoice && (
        <div style={{  borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <button className="button" onClick={handleDownloadPDF}>
          <b>Download PDF</b>
        </button>
        </div>
      )}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </div>
    </form>
    </div>
  );
};

export default AddInvoiceForm;