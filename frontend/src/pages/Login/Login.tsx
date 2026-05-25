import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import Modal from '../../components/ui/Modal/Modal';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api-client';

const Login: React.FC = () => {
  const { state, login, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const [form, setForm] = useState({ email:'', password:'' });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');

  const validate = () => { const e:Record<string,string>={}; if(!form.email||!/^[^\s@]+@[^\s@]/.test(form.email)) e.email='Valid email required'; if(!form.password) e.password='Password is required'; setErrors(e); return !Object.keys(e).length; };

  const submit = async (e: React.FormEvent) => { e.preventDefault(); clearError(); if(!validate())return; try{await login(form.email,form.password);navigate(from,{replace:true});}catch{}};

  const demoLogin = async () => { setForm({email:'demo@retro-tracker.com',password:'demo1234'}); await new Promise(r=>setTimeout(r,50)); clearError(); try{await login('demo@retro-tracker.com','demo1234');navigate(from,{replace:true});}catch{}};

  const forgot = async (e: React.FormEvent) => { e.preventDefault(); setForgotLoading(true); setForgotMsg(''); try{const r=await apiRequest('/auth/forgot-password',{method:'POST',body:JSON.stringify({email:forgotEmail})});setForgotMsg(r.message);}catch{setForgotMsg('If the email exists, a reset link has been sent.');}finally{setForgotLoading(false);}};

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__subtitle">Sign in to your collection</p>
        {state.error && <Alert variant="danger">{state.error}</Alert>}
        <form className="auth-card__form" onSubmit={submit}>
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} error={errors.email} required />
          <Input label="Password" type="password" placeholder="Your password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} error={errors.password} required />
          <Button type="submit" variant="primary" loading={state.loading}>{state.loading?'Signing in...':'Sign In'}</Button>
        </form>
        <p className="auth-card__footer">
          <button type="button" className="auth-card__link-btn" onClick={()=>{setForgotOpen(true);setForgotMsg('');}}>Forgot password?</button>
        </p>
        <p className="auth-card__footer">Don't have an account? <Link to="/register">Create one</Link></p>
        <div className="auth-card__demo">
          <Button type="button" variant="primary" onClick={demoLogin} loading={state.loading} size="lg">Demo Login</Button>
          <span>demo@retro-tracker.com / demo1234</span>
        </div>
      </div>

      <Modal open={forgotOpen} onClose={()=>setForgotOpen(false)} title="Reset Password">
        <form onSubmit={forgot} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {forgotMsg ? <><Alert variant="success">{forgotMsg}</Alert><div style={{textAlign:'right',marginTop:'.5rem'}}><Button variant="ghost" onClick={()=>setForgotOpen(false)}>Close</Button></div></> : <>
            <p style={{fontSize:'.875rem',color:'#94a3b8'}}>Enter your email and we'll send you a reset link.</p>
            <Input label="Email" type="email" placeholder="you@example.com" value={forgotEmail} onChange={(e)=>setForgotEmail(e.target.value)} required />
            <div style={{display:'flex',justifyContent:'flex-end',gap:'.5rem'}}>
              <Button variant="ghost" onClick={()=>setForgotOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" loading={forgotLoading}>Send Reset Link</Button>
            </div>
          </>}
        </form>
      </Modal>
    </div>
  );
};

export default Login;
