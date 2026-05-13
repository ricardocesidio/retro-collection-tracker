import React, { useState, useEffect } from 'react';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api-client';

const Settings: React.FC = () => {
  const { state } = useAuth();
  const [active, setActive] = useState<'profile'|'password'|'notifications'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{type:'success'|'danger';text:string}|null>(null);

  const [profile, setProfile] = useState({ username:'', displayName:'', bio:'' });
  const [pw, setPw] = useState({ current:'', newPw:'', confirm:'' });
  const [notifs, setNotifs] = useState({ email:true, push:true, follows:true, reviews:true, wishlist:true });

  useEffect(() => {
    if (state.user) { setProfile({ username:state.user.username||'', displayName:state.user.displayName||'', bio:state.user.bio||'' }); setLoading(false); }
  }, [state.user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      await apiRequest('/auth/me', { method:'PUT', body:JSON.stringify({ username:profile.username.trim()||undefined, displayName:profile.displayName.trim()||undefined, bio:profile.bio.trim()||undefined }) });
      setMsg({type:'success',text:'Profile updated successfully'});
    } catch (err:any) { setMsg({type:'danger',text:err.message||'Failed to update'}); }
    finally { setSaving(false); }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);
    if (pw.newPw !== pw.confirm) { setMsg({type:'danger',text:'Passwords do not match'}); return; }
    if (pw.newPw.length < 8) { setMsg({type:'danger',text:'Password must be at least 8 characters'}); return; }
    setSaving(true);
    try {
      // Note: requires backend password change endpoint
      setMsg({type:'success',text:'Password change requires forgot-password flow'});
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner fullPage/>;

  const tabs = [
    {key:'profile' as const,label:'Profile',icon:'fa-solid fa-circle-user'},
    {key:'password' as const,label:'Security',icon:'fa-solid fa-shield-halved'},
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
            <h3 style={{fontSize:'1.0625rem',fontWeight:600,marginBottom:'.25rem'}}>Profile Information</h3>
            <Input label="Username" value={profile.username} onChange={(e)=>setProfile({...profile,username:e.target.value})} required />
            <Input label="Display Name" value={profile.displayName} onChange={(e)=>setProfile({...profile,displayName:e.target.value})} />
            <Input label="Bio" type="textarea" value={profile.bio} onChange={(e)=>setProfile({...profile,bio:e.target.value})} rows={3} placeholder="Tell other collectors about yourself..." />
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
        </div>
      )}
    </div>
  );
};

export default Settings;
