import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Network, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../auth/useAuth';
import { useToast } from '../../components/ui/Toast';
import { validators } from '../../utils/validators';
import { getAuthErrorMessage } from '../../firebase/auth';

const LoginPage = () => {
  const { login }  = useAuth();
  const toast      = useToast();
  const navigate   = useNavigate();
  const [form,     setForm]    = useState({ email: '', password: '' });
  const [errors,   setErrors]  = useState({});
  const [loading,  setLoading] = useState(false);
  const [showPass, setShowPass]= useState(false);

  const validate = () => {
    const e = {
      email:    validators.email(form.email),
      password: validators.password(form.password),
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      // Navigation handled by AuthContext listener → PublicRoute redirect
    } catch (err) {
      toast.error(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const blur = (k, fn) => () => setErrors((p) => ({ ...p, [k]: fn(form[k]) }));

  return (
    <AuthLayout>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Sign In</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          Access your monitoring dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email address</label>
            <input
              id="login-email"
              type="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              value={form.email}
              onChange={set('email')}
              onBlur={blur('email', validators.email)}
              placeholder="you@campus.edu"
              autoComplete="email"
              aria-describedby={errors.email ? 'login-email-err' : undefined}
            />
            {errors.email && <span className="form-error" id="login-email-err" role="alert">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <div className="input-wrapper has-icon-right">
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className={`form-input${errors.password ? ' error' : ''}`}
                value={form.password}
                onChange={set('password')}
                onBlur={blur('password', validators.password)}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-describedby={errors.password ? 'login-pass-err' : undefined}
                style={{ paddingRight: 40 }}
              />
              <span className="input-icon-right" onClick={() => setShowPass((p) => !p)} role="button" tabIndex={0} aria-label={showPass ? 'Hide password' : 'Show password'}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
            {errors.password && <span className="form-error" id="login-pass-err" role="alert">{errors.password}</span>}
          </div>

          <div style={{ textAlign: 'right', marginTop: -'var(--space-3)' }}>
            <Link to="/forgot-password" style={{ fontSize: 'var(--text-sm)' }}>Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="login-submit-btn">
            {loading ? <><span className="spinner spinner-sm" /> Signing in…</> : <><ArrowRight size={16} /> Sign In</>}
          </button>
        </div>
      </form>

      <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        Don't have an account?{' '}
        <Link to="/register">Create one</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
