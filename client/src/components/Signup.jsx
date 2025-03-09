import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./SignupValidation";
import axios from "axios";

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const [loading, setLoading] = useState(false); // To manage loading state
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));

    // Check if no errors exist before submitting the form
    if (
      !errors.name &&
      !errors.email &&
      !errors.password &&
      values.name &&
      values.email &&
      values.password
    ) {
      setLoading(true); // Start loading

      // Make POST request to backend
      axios
        .post("http://localhost:8001/signup", values)
        .then((res) => {
          setSuccessMessage("Signup successful! You can now login."); // Set success message
          setLoading(false); // Stop loading

          // Redirect after success
          setTimeout(() => {
            navigate("/"); // Redirect to login page after successful signup
          }, 2000); // Add delay for user to see the success message
        })
        .catch((err) => {
          console.log(err);
          setLoading(false); // Stop loading in case of error
        });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign-Up</h2>
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div> // Show success message
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="name"
              placeholder="Enter Your Name"
              name="name"
              onChange={handleInput}
              className="form-control rounded-0"
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
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
            disabled={loading} // Disable button when loading
          >
            {loading ? "Signing up..." : <strong>Sign Up</strong>}
          </button>
          <p>You agree to our terms and policies.</p>
          <Link
            to="/"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
