import Validation from "./LoginValidation";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));

    // Check if there are no errors before submitting
    const noErrors = !errors.email && !errors.password;

    if (noErrors && values.email && values.password) {
      setLoading(true); // Set loading to true before making API request
      axios
        .post("http://localhost:8001/login", values)
        .then((res) => {
          setLoading(false); // Stop loading after request
          if (res.data.message === "Login successful") {
            // Store user info in localStorage or state if needed
            localStorage.setItem("user", JSON.stringify(res.data.user)); // Example for storing user data

            // Navigate to home or dashboard after login
            navigate("/home");
          } else {
            setErrorMessage("Invalid credentials. Please try again.");
          }
        })
        .catch((err) => {
          setLoading(false); // Stop loading after request
          console.log(err);
          setErrorMessage("Something went wrong. Please try again.");
        });
    } else {
      setErrorMessage("Please fill in all fields correctly.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign-In</h2>

        {/* Show error message */}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              id="email"
              onChange={handleInput}
              className="form-control rounded-0"
            />
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Your Password"
              name="password"
              id="password"
              onChange={handleInput}
              className="form-control rounded-0"
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in..." : <strong>Log in</strong>}
          </button>

          <p>You agree to our terms and policies.</p>

          <Link
            to="/signup"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
