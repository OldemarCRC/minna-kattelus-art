'use client';

import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "@/context/AuthContext";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import '@/styles/Login.css';
import axios from '@/lib/axios';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    email: "" // Honeypot
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      toast.error('Login Failed', {
        description: error,
      });
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
        
        // Store in sessionStorage (only available on client)
        sessionStorage.setItem("user", JSON.stringify(userDetails));
        
        // Show success toast
        toast.success('Welcome back!', {
          description: `Logged in as ${userDetails.username}`,
        });
        
        // Redirect with delay for visual feedback
        setTimeout(() => {
          if (userDetails.role === "editor" || userDetails.role === "admin") {
            router.push('/dashboard');
          } else {
            router.push('/');
          }
        }, 1500);
      } else {
        throw new Error(data.message || "Login failed.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed.";
      
      // Show error toast
      toast.error('Login Failed', {
        description: errorMessage,
      });
      
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{t('admin.loginTitle')}</h2>
        <p className="login-subtitle">{t('admin.loginSubtitle')}</p>

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

          {/* Honeypot field - hidden from users */}
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
          />

          <button
            type="submit"
            className={`btn-primary login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? '...' : t('admin.loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
}