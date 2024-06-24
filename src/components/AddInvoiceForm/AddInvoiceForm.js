import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Snackbar, Alert, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import "./AddInvoiceForm.css";

const AddInvoiceForm = ({ invoiceToEdit, onEditComplete }) => {
  const [newItem, setNewItem] = useState({
    item: "",
    quantity: 1,
    status: "Unpaid",
  });
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
      // Initialize customerName with the customer from invoiceToEdit
      const selectedCustomer = customers.find(c => c.name === invoiceToEdit.customerName);
      setCustomerName(selectedCustomer);
  
      // Initialize currentItems with items from invoiceToEdit
      setCurrentItems(invoiceToEdit.items);
  
      // Initialize productName with the first item in currentItems
      if (invoiceToEdit.items.length > 0) {
        const firstItem = invoiceToEdit.items[0];
        const selectedProduct = products.find(p => p.name === firstItem.item);
        setProductName(selectedProduct);
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
            price: product.price,
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
      [name]:
        name === "quantity" ? parseFloat(value) : value,
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
    y += 20;

    pdf.setFontSize(12);
    pdf.text("Item", 10, y);
    pdf.text("Quantity", 50, y);
    pdf.text("Price", 90, y);
    pdf.text("Status", 130, y);
    pdf.text("Total", 170, y);
    y += 10;

    currentInvoice.items.forEach((item) => {
      pdf.setFontSize(10);
      pdf.text(item.item, 10, y);
      pdf.text(item.quantity.toString(), 50, y);
      pdf.text(item.price.toString(), 90, y);
      pdf.text(item.status, 130, y);
      pdf.text((item.quantity * item.price).toFixed(2), 170, y);
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
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <form className="app" style={{ maxHeight: "600px", overflowY: "auto" }}>
      <h2>Invoice</h2>
      <div className="input-container">
        <label>Customer Name:</label>
        <Autocomplete
          value={customerName}
          onChange={(event, newValue) => {
            setCustomerName(newValue);
          }}
          options={customers}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Select Customer" />
          )}
        />
      </div>
      <div className="input-container">
        <label>Product Name:</label>
        <Autocomplete
          value={productName}
          onChange={(event, newValue) => {
            setProductName(newValue);
          }}
          options={products}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Select Product" />
          )}
        />
      </div>
      <div className="input-container">
        <label>Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={newItem.quantity}
          onChange={handleChange}
        />
      </div>
      <div className="input-container">
        <label>Status:</label>
        <select name="status" value={newItem.status} onChange={handleChange}>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>
      </div>
      <div className="input-container">
        <label>Tax Rate (%):</label>
        <input
          type="number"
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value))}
        />
      </div>
      <div className="input-container">
        <label>Discount:</label>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(parseFloat(e.target.value))}
        />
      </div>
      <button className="button" onClick={handleAddItem}>
        <b>Add Item</b>
      </button>
      <div className="invoices-container">
        {currentItems.length > 0 && (
          <>
            <h2>Item List</h2>
            <div className="invoice">
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
                  {currentItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.item}</td>
                      <td>{item.quantity}</td>
                      <td>{Number(item.price).toFixed(2)}/-</td>
                      <td>{newItem.status}</td>
                      <td>{(item.quantity * item.price).toFixed(2)}/-</td>
                      <td>
                        <button onClick={() => handleDeleteItem(index)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {currentItems.length > 0 && (
        <button className="button" onClick={handleCreateInvoice}>
          <b>Create Invoice</b>
        </button>
      )}
      {currentInvoice && showReviewInvoice && (
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
                    <button onClick={() => handleDeleteItem(index)}>
                      Delete
                    </button>
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
      {showReviewInvoice && (
        <button className="button" onClick={handleDownloadPDF}>
          <b>Download PDF</b>
        </button>
      )}
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
    </form>
  );
};

export default AddInvoiceForm;
