import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import { useAuth } from '../../context/AuthContext';

const Register: React.FC = () => {
  const { state, register, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:'', email:'', displayName:'', password:'', confirm:'' });
  const [errors, setErrors] = useState<Record<string,string>>({});

  const validate = () => {
    const e:Record<string,string>={};
    if (!form.username||form.username.length<3) e.username='At least 3 characters';
    if (!form.email||!/^[^\s@]+@[^\s@]/.test(form.email)) e.email='Valid email required';
    if (!form.password||form.password.length<8) e.password='At least 8 characters';
    if (form.password!==form.confirm) e.confirm='Passwords do not match';
    setErrors(e); return !Object.keys(e).length;
  };

  const submit = async (e: React.FormEvent) => { e.preventDefault(); clearError(); if(!validate())return; try{await register(form.email,form.username,form.password,form.displayName||undefined);navigate('/dashboard',{replace:true});}catch{} };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">Start building your collection</p>
        {state.error && <Alert variant="danger">{state.error}</Alert>}
        <form className="auth-card__form" onSubmit={submit}>
          <Input label="Username" placeholder="retro_collector" value={form.username} onChange={(e)=>setForm({...form,username:e.target.value})} error={errors.username} required />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} error={errors.email} required />
          <Input label="Display Name" placeholder="Optional" value={form.displayName} onChange={(e)=>setForm({...form,displayName:e.target.value})} />
          <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} error={errors.password} required />
          <Input label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirm} onChange={(e)=>setForm({...form,confirm:e.target.value})} error={errors.confirm} required />
          <Button type="submit" variant="primary" loading={state.loading}>{state.loading?'Creating account...':'Create Account'}</Button>
        </form>
        <p className="auth-card__footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Register;
