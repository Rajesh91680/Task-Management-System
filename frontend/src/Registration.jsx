import { useState } from 'react';
import axios from 'axios'; // 🔹 ADDED AXIOS IMPORT
import logo from "./assets/logo.png";

function Registration({ onBackToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 MADE THIS FUNCTION ASYNC TO HANDLE THE API REQUEST
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // 1. Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Error: Passwords do not match!");
      return;
    }

    // 2. Send data to Django
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // 3. If successful, show message and go back to login
      alert("Registration successful! Please log in.");
      onBackToLogin(); 

    } catch (error) {
      // 4. If Django rejects it (e.g., username taken, password too weak), catch the error
      console.error("Registration Error:", error.response?.data);
      alert("Error registering. Username might already exist or password is too weak.");
    }
  };

  return (
    <div className="auth-card">
      <img src={logo} alt="Logo" style={{ width: '60px', marginBottom: '15px' }} />
      <h2 style={{ fontSize: '22px', marginBottom: '25px', marginTop: '0' }}>New User Registration</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" name="username" placeholder="Username" 
          value={formData.username} onChange={handleChange} 
          className="auth-input" required 
        />

        <input 
          type="email" name="email" placeholder="Email Address" 
          value={formData.email} onChange={handleChange} 
          className="auth-input" required 
        />

        <input 
          type="password" name="password" placeholder="Password" 
          value={formData.password} onChange={handleChange} 
          className="auth-input" required 
        />

        <input 
          type="password" name="confirmPassword" placeholder="Confirm Password" 
          value={formData.confirmPassword} onChange={handleChange} 
          className="auth-input" required 
        />

        <button type="submit" className="add-btn" style={{ width: '100%', padding: '12px' }}>
          Register Account
        </button>

      </form>
    </div>
  );
}

export default Registration;