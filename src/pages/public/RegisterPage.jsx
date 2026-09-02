import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../auth/useAuth';
import { useToast } from '../../components/ui/Toast';
import { validators } from '../../utils/validators';
import { getAuthErrorMessage } from '../../firebase/auth';

const RegisterPage = () => {
  const { register }   = useAuth();
  const toast          = useToast();
  const [form,     setForm]    = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors,   setErrors]  = useState({});
  const [loading,  setLoading] = useState(false);
  const [showPass, setShowPass]= useState(false);
  const [done,     setDone]    = useState(false);

  const validate = () => {
    const e = {
      name:    validators.displayName(form.name),
      email:   validators.email(form.email),
      password:validators.password(form.password),
      confirm: validators.confirmPassword(form.confirm, form.password),
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      toast.success('Account created! Welcome to Campus PC Watch.');
      setDone(true);
    } catch (err) {
      toast.error(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const set  = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const blur = (k, fn, extra) => () => setErrors((p) => ({ ...p, [k]: fn(form[k], extra) }));

  if (done) {
    return (
      <AuthLayout>
        <div style={{ textAlign: 'center', padding: 'var(--space-10) 0' }}>
          <div style={{ fontSize: 64, marginBottom: 'var(--space-4)' }}>🎉</div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Account Created!</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Your account is ready. Sign in to access your dashboard.</p>
          <Link to="/login" className="btn btn-primary btn-lg">Go to Sign In</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Create Account</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          Join Campus PC Watch
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Full Name</label>
            <input id="reg-name" type="text" className={`form-input${errors.name ? ' error' : ''}`}
              value={form.name} onChange={set('name')} onBlur={blur('name', validators.displayName)}
              placeholder="Dr. Arjun Sharma" autoComplete="name" />
            {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email address</label>
            <input id="reg-email" type="email" className={`form-input${errors.email ? ' error' : ''}`}
              value={form.email} onChange={set('email')} onBlur={blur('email', validators.email)}
              placeholder="you@campus.edu" autoComplete="email" />
            {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <div className="input-wrapper has-icon-right">
              <input id="reg-password" type={showPass ? 'text' : 'password'}
                className={`form-input${errors.password ? ' error' : ''}`}
                value={form.password} onChange={set('password')} onBlur={blur('password', validators.password)}
                placeholder="Min. 6 characters" autoComplete="new-password" style={{ paddingRight: 40 }} />
              <span className="input-icon-right" onClick={() => setShowPass((p) => !p)} role="button" tabIndex={0} aria-label="Toggle password">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
            {errors.password && <span className="form-error" role="alert">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
            <input id="reg-confirm" type="password" className={`form-input${errors.confirm ? ' error' : ''}`}
              value={form.confirm} onChange={set('confirm')}
              onBlur={() => setErrors((p) => ({ ...p, confirm: validators.confirmPassword(form.confirm, form.password) }))}
              placeholder="Re-enter password" autoComplete="new-password" />
            {errors.confirm && <span className="form-error" role="alert">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="register-submit-btn">
            {loading ? <><span className="spinner spinner-sm" /> Creating…</> : <><UserPlus size={16} /> Create Account</>}
          </button>
        </div>
      </form>

      <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
