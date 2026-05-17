import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api-client';
import './Settings.scss';

const Settings: React.FC = () => {
  const { state } = useAuth();
  const [active, setActive] = useState<'profile'|'password'|'email'|'notifications'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{type:'success'|'danger';text:string}|null>(null);
  const [uploading, setUploading] = useState(false);

  const [profile, setProfile] = useState({ username:'', displayName:'', bio:'', avatarUrl:'' });
  const [pw, setPw] = useState({ current:'', newPw:'', confirm:'' });
  const [emailChange, setEmailChange] = useState({ current:'', newEmail:'', confirm:'' });
  const [notifs, setNotifs] = useState({ email:true, push:false, follows:true, reviews:true, wishlist:true });
  const [notifsLoaded, setNotifsLoaded] = useState(false);

  useEffect(() => {
    if (state.user) {
      setProfile({ username:state.user.username||'', displayName:state.user.displayName||'', bio:state.user.bio||'', avatarUrl:state.user.avatarUrl||'' });
      setLoading(false);
    }
  }, [state.user]);

  useEffect(() => {
    if (!state.user) return;
    let c = false;
    apiRequest('/notification-preferences').then(d => { if (!c) { setNotifs({ email: d.email, push: d.push, follows: d.follows, reviews: d.reviews, wishlist: d.wishlist }); setNotifsLoaded(true); } }).catch(() => { if (!c) setNotifsLoaded(true); });
    return () => { c = true; };
  }, [state.user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
      const res = await fetch(`${API_URL}/upload/avatar`, { method: 'POST', body: formData, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setProfile(p => ({ ...p, avatarUrl: data.url }));
      setMsg({ type: 'success', text: 'Profile picture updated!' });
    } catch (err: any) {
      setMsg({ type: 'danger', text: err.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    const uname = profile.username.trim();
    if (uname && !/^[a-zA-Z0-9_]+$/.test(uname)) { setMsg({type:'danger',text:'Username can only contain letters, numbers, and underscores. Spaces are not allowed.'}); setSaving(false); return; }
    if (uname && uname.length > 20) { setMsg({type:'danger',text:'Username must be 20 characters or less'}); setSaving(false); return; }
    if (profile.bio && profile.bio.length > 100) { setMsg({type:'danger',text:'Bio must be 100 characters or less'}); setSaving(false); return; }
    const avatarVal = profile.avatarUrl?.trim() || undefined;
    try {
      await apiRequest('/auth/me', { method:'PUT', body:JSON.stringify({ username:uname||undefined, displayName:profile.displayName.trim()||undefined, bio:profile.bio.trim()||undefined, avatarUrl: avatarVal }) });
      setMsg({type:'success',text:'Profile updated successfully'});
    } catch (err:any) { setMsg({type:'danger',text:err.message||'Failed to update'}); }
    finally { setSaving(false); }
  };

    const savePreferences = async () => {
      setMsg(null); setSaving(true);
      try {
        await apiRequest('/notification-preferences', { method:'PUT', body:JSON.stringify(notifs) });
        setMsg({type:'success',text:'Notification preferences saved'});
      } catch (err:any) { setMsg({type:'danger',text:err.message||'Failed to save preferences'}); }
      finally { setSaving(false); }
    };

    const saveEmailChange = async (e: React.FormEvent) => {
      e.preventDefault(); setMsg(null);
      if (emailChange.newEmail !== emailChange.confirm) { setMsg({type:'danger',text:'Emails do not match'}); return; }
      if (!emailChange.newEmail) { setMsg({type:'danger',text:'New email is required'}); return; }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailChange.newEmail)) { 
        setMsg({type:'danger',text:'Please enter a valid email address (e.g., name@example.com)'}); 
        return; 
      }
      // Optional: Add domain-specific warnings or restrictions if needed
      // For example, you might want to warn about using temporary email services
      setSaving(true);
      try {
        const res = await apiRequest('/auth/change-email', {
          method: 'POST',
          body: JSON.stringify({ newEmail: emailChange.newEmail }),
        });
        setEmailChange({ current:'', newEmail:'', confirm:'' });
        setMsg({type:'success',text:res.message||'Email changed successfully. Please verify your new email.'});
        // Note: The backend returns a new token, but we are not updating the token here.
        // In a real app, we would update the token in localStorage and context.
        // For simplicity, we'll just show the message and let the user log in again if needed.
      } catch (err:any) {
        setMsg({type:'danger',text:err.message||'Failed to change email'});
      } finally { setSaving(false); }
    };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);
    if (pw.newPw !== pw.confirm) { setMsg({type:'danger',text:'Passwords do not match'}); return; }
    if (pw.newPw.length < 8) { setMsg({type:'danger',text:'Password must be at least 8 characters'}); return; }
    if (!pw.current) { setMsg({type:'danger',text:'Current password is required'}); return; }
    setSaving(true);
    try {
      await apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.newPw }),
      });
      setPw({ current:'', newPw:'', confirm:'' });
      setMsg({type:'success',text:'Password changed successfully'});
    } catch (err:any) {
      setMsg({type:'danger',text:err.message||'Failed to change password'});
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner fullPage/>;

    const tabs = [
    {key:'profile' as const,label:'Profile',icon:'fa-solid fa-circle-user'},
    {key:'password' as const,label:'Security',icon:'fa-solid fa-shield-halved'},
    {key:'email' as const,label:'Email',icon:'fa-solid fa-envelope'},
    {key:'notifications' as const,label:'Notifications',icon:'fa-solid fa-bell'},
    ];

  return (
    <div className="page-shell" style={{maxWidth:720}}>
      <h1 className="page-title">Settings</h1>
      <p className="page-sub">Manage your account and preferences</p>

      <div className="sett-tabs">
        {tabs.map((t) => (
          <button key={t.key} className={`sett-tab${active===t.key?' sett-tab--active':''}`} onClick={()=>{setActive(t.key);setMsg(null);}}>
            <span className="sett-tab__icon"><i className={t.icon} /></span> {t.label}
          </button>
        ))}
      </div>

      {msg && <div style={{marginBottom:'1rem'}}><Alert variant={msg.type}>{msg.text}</Alert></div>}

      {active==='profile' && (
        <form onSubmit={saveProfile}>
          <div className="panel" style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div className="sett-avatar-section">
              <div className="sett-avatar__preview" style={profile.avatarUrl ? { backgroundImage: `url(${profile.avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
                {!profile.avatarUrl && <span>{profile.displayName?.charAt(0) || profile.username?.charAt(0) || '?'}</span>}
                {profile.avatarUrl && <img src={profile.avatarUrl} alt="" />}
              </div>
              <div className="sett-avatar__actions">
                <label className="btn btn--outline btn--md">
                  <i className="fa-solid fa-camera" /> Upload Photo
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
            <h3 style={{fontSize:'1.0625rem',fontWeight:600,marginBottom:'.25rem'}}>Profile Information</h3>
            <Input label="Username" value={profile.username} onChange={(e)=>setProfile({...profile,username:e.target.value})} required maxLength={20} />
            <Input label="Display Name" value={profile.displayName} onChange={(e)=>setProfile({...profile,displayName:e.target.value})} />
            <Input label="Bio" type="textarea" value={profile.bio} onChange={(e)=>setProfile({...profile,bio:e.target.value})} rows={3} placeholder="Tell other collectors about yourself..." maxLength={100} />
            <div style={{display:'flex',justifyContent:'flex-end'}}>
              <Button type="submit" variant="primary" loading={saving}>Save Changes</Button>
            </div>
          </div>
        </form>
      )}

       {active==='password' && (
         <form onSubmit={savePassword}>
           <div className="panel" style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
             <h3 style={{fontSize:'1.0625rem',fontWeight:600,marginBottom:'.25rem'}}>Change Password</h3>
             <p style={{fontSize:'.8125rem',color:'#94a3b8'}}>Use the forgot password flow on the login page to reset your password.</p>
             <Input label="Current Password" type="password" value={pw.current} onChange={(e)=>setPw({...pw,current:e.target.value})} placeholder="Enter current password" />
             <Input label="New Password" type="password" value={pw.newPw} onChange={(e)=>setPw({...pw,newPw:e.target.value})} placeholder="Min. 8 characters" />
             <Input label="Confirm Password" type="password" value={pw.confirm} onChange={(e)=>setPw({...pw,confirm:e.target.value})} placeholder="Repeat new password" />
             <div style={{display:'flex',justifyContent:'flex-end'}}>
               <Button type="submit" variant="secondary" loading={saving}>Update Password</Button>
             </div>
           </div>
         </form>
       )}
       
       {active==='email' && (
         <form onSubmit={saveEmailChange}>
           <div className="panel" style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
             <h3 style={{fontSize:'1.0625rem',fontWeight:600,marginBottom:'.25rem'}}>Change Email</h3>
             <p style={{fontSize:'.8125rem',color:'#94a3b8'}}>You can change your email up to 3 times per account.</p>
             <Input label="Current Email" type="email" value={emailChange.current} onChange={(e)=>setEmailChange({...emailChange,current:e.target.value})} placeholder="Enter your current email" />
             <Input label="New Email" type="email" value={emailChange.newEmail} onChange={(e)=>setEmailChange({...emailChange,newEmail:e.target.value})} />
             <Input label="Confirm New Email" type="email" value={emailChange.confirm} onChange={(e)=>setEmailChange({...emailChange,confirm:e.target.value})} />
             <div style={{display:'flex',justifyContent:'flex-end'}}>
               <Button type="submit" variant="secondary" loading={saving}>Update Email</Button>
             </div>
           </div>
         </form>
       )}

      {active==='notifications' && (
        <div className="panel" style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <h3 style={{fontSize:'1.0625rem',fontWeight:600,marginBottom:'.25rem'}}>Notification Preferences</h3>
          {[
            {key:'email',label:'Email Notifications',desc:'Receive updates via email'},
            {key:'push',label:'Push Notifications',desc:'Browser push notifications'},
            {key:'follows',label:'New Followers',desc:'When someone follows you'},
            {key:'reviews',label:'Reviews',desc:'When someone reviews a game you own'},
            {key:'wishlist',label:'Wishlist Updates',desc:'When wishlisted games become available'},
          ].map((n)=>(
            <label key={n.key} style={{display:'flex',alignItems:'center',gap:'.75rem',cursor:'pointer',padding:'.5rem 0'}}>
              <input type="checkbox" checked={(notifs as any)[n.key]} onChange={(e)=>{setNotifs({...notifs,[n.key]:e.target.checked});}} style={{width:18,height:18,accentColor:'#7c3aed'}}/>
              <div><span style={{fontSize:'.875rem',fontWeight:500}}>{n.label}</span><span style={{display:'block',fontSize:'.75rem',color:'#94a3b8'}}>{n.desc}</span></div>
            </label>
          ))}
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:'.5rem'}}>
            <Button variant="primary" onClick={savePreferences} loading={saving}>Save Preferences</Button>
          </div>
        </div>
      )}

      <div style={{marginTop:'2rem',textAlign:'center'}}>
        <Link to="/donate" className="btn btn--outline">
          <i className="fa-solid fa-heart" style={{marginRight:'.5rem',color:'#ec4899'}} /> Support the Project
        </Link>
      </div>
    </div>
  );
};

export default Settings;
