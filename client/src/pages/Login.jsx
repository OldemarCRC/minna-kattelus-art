import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from '../utils/axios';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { loading, error, dispatch } = useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useEffect(() => {
    if (error) {
      window.alert(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "LOGIN_START" });
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const data = response.data;

      if (data.success) {
        const userDetails = data.data;

        if (!userDetails.isVerified) {
          throw new Error("Please verify your email before logging in.");
        }

        dispatch({ type: "LOGIN_SUCCESS", payload: userDetails });
        sessionStorage.setItem("user", JSON.stringify(userDetails));
        console.log("Login successful!");
        setTimeout(() => navigate(
          userDetails.role === "editor" || userDetails.role === "admin"
            ? "/dashboard"
            : "/"
        ), 2000);
      } else {
        throw new Error(data.message || "Please verify your email before logging in.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed.";
      window.alert(errorMessage);
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          {t('admin.loginTitle')}
        </h2>
        <p className="login-subtitle">
          {t('admin.loginSubtitle')}
        </p>
        {error && (
          <div className="login-error" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              {t('admin.userLabel')}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={credentials.username}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t('admin.passwordLabel')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={credentials.password}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {t('admin.loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;