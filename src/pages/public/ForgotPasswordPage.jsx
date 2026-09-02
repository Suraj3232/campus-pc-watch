import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../auth/useAuth';
import { useToast } from '../../components/ui/Toast';
import { validators } from '../../utils/validators';
import { getAuthErrorMessage } from '../../firebase/auth';

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const toast = useToast();
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const err = validators.email(email);
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e) {
      toast.error(getAuthErrorMessage(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)', textDecoration: 'none' }}>
        <ArrowLeft size={14} /> Back to Sign In
      </Link>

      {sent ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
          <CheckCircle size={48} color="var(--color-online)" style={{ margin: '0 auto var(--space-4)' }} />
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Email Sent!</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            A password reset link has been sent to <strong style={{ color: 'var(--color-text-primary)' }}>{email}</strong>.
            Please check your inbox.
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Reset Password</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Enter your email and we'll send a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div className="form-group">
                <label htmlFor="forgot-email" className="form-label">Email address</label>
                <div className="input-wrapper has-icon-left">
                  <span className="input-icon-left"><Mail size={16} /></span>
                  <input
                    id="forgot-email"
                    type="email"
                    className={`form-input${error ? ' error' : ''}`}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder="you@campus.edu"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
                {error && <span className="form-error" role="alert">{error}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="forgot-submit-btn">
                {loading ? <><span className="spinner spinner-sm" /> Sending…</> : 'Send Reset Link'}
              </button>
            </div>
          </form>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
