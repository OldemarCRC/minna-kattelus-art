import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            navigate('/olivia');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. Invalid or expired token.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    if (token) {
      verifyAccount();
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token, navigate]);

  return (
    <div className="verify-email-page">
      <div className="verify-email-container">
        
        {status === 'verifying' && (
          <div className="verify-content">
            <div className="verify-spinner"></div>
            <h1>Verifying Your Account</h1>
            <p>Please wait while we verify your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verify-content success">
            <div className="verify-icon success-icon">✓</div>
            <h1>Account Verified Successfully!</h1>
            <p>{message}</p>
            <p className="redirect-message">You will be redirected to the login page shortly.</p>
            <button 
              onClick={() => navigate('/olivia')} 
              className="verify-button"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="verify-content error">
            <div className="verify-icon error-icon">✕</div>
            <h1>Verification Failed</h1>
            <p>{message}</p>
            <p className="help-message">Please contact your administrator for assistance.</p>
            <button 
              onClick={() => navigate('/')} 
              className="verify-button secondary"
            >
              Go to Home
            </button>
          </div>
        )}

        <div className="verify-footer">
          <p>© {new Date().getFullYear()} Minna Kattelus Art Gallery</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;