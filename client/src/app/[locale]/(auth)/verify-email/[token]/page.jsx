'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import axios from '@/lib/axios';
import '@/styles/VerifyEmail.css';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  
  const token = params.token;
  
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        const data = response.data;

        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push(`/${locale}/olivia`);
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. Invalid or expired token.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'An error occurred during verification. Please try again.');
      }
    };

    if (token) {
      verifyAccount();
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token, router, locale]);

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
              onClick={() => router.push(`/${locale}/olivia`)} 
              className="btn-primary"
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
              onClick={() => router.push(`/${locale}`)} 
              className="btn-secondary"
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
}
