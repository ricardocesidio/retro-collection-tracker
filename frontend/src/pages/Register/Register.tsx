import React from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import './Register.scss';

const Register: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">Start building your collection</p>
        <form className="auth-card__form" onSubmit={(e) => e.preventDefault()}>
          <Input label="Username" type="text" placeholder="retro_collector" required />
          <Input label="Email" type="email" placeholder="you@example.com" required />
          <Input label="Password" type="password" placeholder="Min. 8 characters" required />
          <Input label="Confirm Password" type="password" placeholder="Repeat your password" required />
          <Button type="submit" variant="primary">Create Account</Button>
        </form>
        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
