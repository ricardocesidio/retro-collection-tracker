import React from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import './Login.scss';

const Login: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__subtitle">Sign in to your collection</p>
        <form className="auth-card__form" onSubmit={(e) => e.preventDefault()}>
          <Input label="Email" type="email" placeholder="you@example.com" required />
          <Input label="Password" type="password" placeholder="Your password" required />
          <Button type="submit" variant="primary">Sign In</Button>
        </form>
        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
