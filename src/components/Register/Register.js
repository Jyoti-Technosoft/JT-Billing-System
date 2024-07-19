import React, { useState } from "react";
import basestyle from "../Base.module.css";
import registerstyle from "./Register.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Register = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [user, setUserDetails] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.fname.trim()) {
      errors.fname = "First Name is required";
    }
    if (!values.lname.trim()) {
      errors.lname = "Last Name is required";
    }
    if (!values.email.trim()) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format";
    }
    if (!values.password.trim()) {
      errors.password = "Password is required";
    }
    if (!values.cpassword.trim()) {
      errors.cpassword = "Confirm Password is required";
    } else if (values.cpassword !== values.password) {
      errors.cpassword = "Passwords do not match";
    }
    return errors;
  };

  const signupHandler = (e) => {
    e.preventDefault();
    const errors = validateForm(user);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      // Simulate successful registration
      setOpenSnackbar(true);

      // Store user details in localStorage
      localStorage.setItem("registeredUser", JSON.stringify(user));

      // Redirect to login page
      navigate("/login", { replace: true });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className={registerstyle.register}>
      <form>
        <h1>Create your account</h1>
        <input
          type="text"
          name="fname"
          placeholder="First Name"
          onChange={changeHandler}
          value={user.fname}
        />
        {formErrors.fname && <p className={basestyle.error}>{formErrors.fname}</p>}
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          onChange={changeHandler}
          value={user.lname}
        />
        {formErrors.lname && <p className={basestyle.error}>{formErrors.lname}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={changeHandler}
          value={user.email}
        />
        {formErrors.email && <p className={basestyle.error}>{formErrors.email}</p>}
        <div className={registerstyle.password_container}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={changeHandler}
            value={user.password}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
            className={registerstyle.password_toggle}
          />
        </div>
        {formErrors.password && <p className={basestyle.error}>{formErrors.password}</p>}
        <div className={registerstyle.password_container}>
          <input
            type={showPassword ? "text" : "password"}
            name="cpassword"
            placeholder="Confirm Password"
            onChange={changeHandler}
            value={user.cpassword}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
            className={registerstyle.password_toggle}
          />
        </div>
        {formErrors.cpassword && <p className={basestyle.error}>{formErrors.cpassword}</p>}
        <button
          type="button" // Changed from default submit type to button
          className={`${basestyle.button_common} ${registerstyle.button_hover}`}
          onClick={signupHandler}
        >
          Sign Up
        </button>
      </form>
      <NavLink to="/login">Already have an account? Login</NavLink>

      {/* Snackbar for displaying registration success */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Adjust position if needed
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Registration successful!
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Register;
