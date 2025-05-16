import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorRegister = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  console.log('API URL:', apiUrl);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  // Check if the form was previously submitted
//   useEffect(() => {
//     const submissionStatus = localStorage.getItem('vendorSubmitted');
//     if (submissionStatus) {
//       setSubmitted(true);
//     }
//   }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Function to check if email already exists
  const checkIfEmailExists = async (email) => {
    try {
      const response = await axios.get(`${apiUrl}/api/orders/check-email/?email=${email}`);
      if (response.data.error) {
        setEmailError(response.data.error);
      } else {
        setEmailError(null); // Clear email error if the email is available
      }
    } catch (err) {
      console.error("Error checking email:", err);
      setEmailError("Something went wrong while checking email.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // First check if email exists
    if (emailError) {
      setError("Please enter a valid and unique email.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/orders/registers/`, formData);
      setSubmitted(true);
      // Save status in localStorage
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  // Validate email format and existence
  const handleEmailChange = (e) => {
    const email = e.target.value;
    handleChange(e);
    checkIfEmailExists(email);
  };

  if (submitted) {
    return <h2>Thank you for registering! We'll review your request soon.</h2>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Register as a Vendor</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} required />
        <br />

        <label>Email:</label>
        <input 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleEmailChange} 
          required 
        />
        <br />
        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}

        <label>Location:</label>
        <input name="location" value={formData.location} onChange={handleChange} required />
        <br />

        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VendorRegister;
