import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import Modal from '../../components/ui/Modal/Modal';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api-client';
import './Login.scss';

const Login: React.FC = () => {
  const { state, login, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch {
      // error handled in context
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');
    try {
      const res = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotMessage(res.message);
    } catch {
      setForgotMessage('If the email exists, a reset link has been sent.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__subtitle">Sign in to your collection</p>

        {state.error && <Alert variant="danger">{state.error}</Alert>}

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange('email')} error={errors.email} required />
          <Input label="Password" type="password" placeholder="Your password" value={form.password} onChange={handleChange('password')} error={errors.password} required />
          <Button type="submit" variant="primary" loading={state.loading}>
            {state.loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="auth-card__footer">
          <button type="button" className="auth-card__link-btn" onClick={() => { setForgotOpen(true); setForgotMessage(''); }}>
            Forgot password?
          </button>
        </p>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>

      <Modal open={forgotOpen} onClose={() => setForgotOpen(false)} title="Reset Password">
        <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {forgotMessage ? (
            <div>
              <Alert variant="success">{forgotMessage}</Alert>
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <Button variant="ghost" onClick={() => setForgotOpen(false)}>Close</Button>
              </div>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '0.875rem', color: '#9e9e9e' }}>
                Enter your email and we'll send you a reset link.
              </p>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <Button variant="ghost" onClick={() => setForgotOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" loading={forgotLoading}>Send Reset Link</Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default Login;

