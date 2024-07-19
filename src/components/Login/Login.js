import React, { useState } from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./Login.module.css";
import { useNavigate, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Example if using FontAwesome
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Example eye icons
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Login = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
    if (!values.email.trim()) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format";
    }
    if (!values.password.trim()) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const loginHandler = (e) => {
    e.preventDefault();
    const errors = validateForm(user);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));
      if (
        registeredUser &&
        registeredUser.email === user.email &&
        registeredUser.password === user.password
      ) {
        handleSnackbarOpen("Login successful!");
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        setLoggedIn(true);
        navigate("/", { replace: true });
      } else {
        handleSnackbarOpen("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <div className={loginstyle.login}>
      <form>
        <h1>Login</h1>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={changeHandler}
          value={user.email}
        />
        {formErrors.email && <p className={basestyle.error}>{formErrors.email}</p>}
        <div className={loginstyle.password_container}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Password"
            onChange={changeHandler}
            value={user.password}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
            className={loginstyle.password_toggle}
          />
        </div>
        {formErrors.password && <p className={basestyle.error}>{formErrors.password}</p>}
        <button className={`${basestyle.button_common} ${loginstyle.button_hover}`} onClick={loginHandler}>
          Login
        </button>
      </form>
      <NavLink to="/signup">Not yet registered? Register Now</NavLink>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Login;
