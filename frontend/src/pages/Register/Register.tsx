import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import { useAuth } from '../../context/AuthContext';
import './Register.scss';

const Register: React.FC = () => {
  const { state, register, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.username || form.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password || form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    try {
      await register(form.email, form.username, form.password, form.displayName || undefined);
      navigate('/', { replace: true });
    } catch {
      // error handled in context
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">Start building your collection</p>

        {state.error && <Alert variant="danger">{state.error}</Alert>}

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <Input
            label="Username"
            placeholder="retro_collector"
            value={form.username}
            onChange={handleChange('username')}
            error={errors.username}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
          />
          <Input
            label="Display Name (optional)"
            placeholder="Your display name"
            value={form.displayName}
            onChange={handleChange('displayName')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            required
          />
          <Button type="submit" variant="primary" loading={state.loading}>
            {state.loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
