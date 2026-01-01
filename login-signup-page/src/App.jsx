import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    try {
      const response = await axios.post(`http://localhost:8000${endpoint}`, formData);
      console.log(response.data); // Handle success response
      alert(isLogin ? 'Logged in successfully!' : 'Registered successfully!');
    } catch (error) {
      console.error(error.response.data); // Handle error response
      alert('An error occurred!');
    }
  };

  return (
    <div className="login-page">
      <div className="login-title">
        <h1>Welcome to Gov360 NewsHub</h1>
      </div>
      <div className="login-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <table className="login-table">
            <tbody>
              <tr>
                <td><label>Username:</label></td>
                <td><input type="text" name="username" value={formData.username} onChange={handleChange} /></td>
              </tr>
              {!isLogin && (
                <tr>
                  <td><label>Email:</label></td>
                  <td><input type="email" name="email" value={formData.email} onChange={handleChange} /></td>
                </tr>
              )}
              <tr>
                <td><label>Password:</label></td>
                <td><input type="password" name="password" value={formData.password} onChange={handleChange} /></td>
              </tr>
            </tbody>
          </table>
          <div className="form-footer">
            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            <span onClick={toggleForm}>
              {isLogin ? 'New user? Sign up here' : 'Already have an account? Log in here'}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
