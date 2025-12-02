import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserRegister.css';

const UserRegister = () => {
  const navigate = useNavigate();

  const initialFormData = {
    username: '',
    fullName: '',
    email: '',
    role: '',
    phone: '',
    createdBy: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const currentUser = sessionStorage.getItem('user');
    if (!currentUser) {
      navigate('/olivia');
      return;
    }

    const user = JSON.parse(currentUser);
    if (user.role !== 'admin') {
      navigate('/dashboard');
    }

    setFormData(prev => ({ ...prev, createdBy: user.username }));
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const { username, fullName, email, role, phone, createdBy } = formData;
    const payload = { username, fullName, email, role, phone, createdBy };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      setMessage({
        type: 'success',
        text: 'User registered successfully! User will receive an email to verify their account.'
      });

      setFormData(initialFormData);

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="user-register-page">
      <div className="user-register-container">
        <div className="user-register-header">
          <h1>Register New User</h1>
          <p>Create a new admin or editor account</p>
        </div>

        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="user-register-form">

          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">
              User Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a role</option>
              <option value="admin">Administrator</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone <span className="optional">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+358 40 123 4567"
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;