import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { notificationsApi } from '../../services/social';
import { connectSocket } from '../../services/socket';
import type { NotificationEntry } from '../../services/social';

const Notifications: React.FC = () => {
  const [items, setItems] = useState<NotificationEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsApi.list().then((r)=>setItems(r.data)).catch(()=>{}).finally(()=>setLoading(false));
    const token = localStorage.getItem('token');
    if (!token) return;
    const socket = connectSocket(token);
    const handler = (notif: NotificationEntry) => setItems((prev) => [notif, ...prev]);
    socket.on('notification:new', handler);
    return () => { socket.off('notification:new', handler); };
  }, []);

  const mark = async (id: string) => { await notificationsApi.markAsRead(id); setItems((p)=>p.map((n)=>n.id===id?{...n,isRead:true}:n)); };
  const getIcon = (t:string)=>({NEW_FOLLOWER:'fa-solid fa-user-group',NEW_REVIEW:'fa-solid fa-star',WISHLIST_AVAILABLE:'fa-solid fa-bookmark',SYSTEM:'fa-solid fa-bell'} as any)[t]||'fa-solid fa-crown';

  const unread = items.filter((n)=>!n.isRead).length;

  return (
    <div className="page-shell" style={{maxWidth:720}}>
      <div className="page-shell-header">
        <div><h1 className="page-title">Notifications</h1><p className="page-sub">{unread>0?`${unread} unread`:'All caught up!'}</p></div>
        {unread>0 && <Button variant="ghost" size="sm" onClick={()=>{notificationsApi.markAllAsRead();setItems((p)=>p.map((n)=>({...n,isRead:true})));}}>Mark all read</Button>}
      </div>
      {loading ? <LoadingSpinner/> : items.length===0 ? (
        <EmptyState icon="🔔" title="No notifications" message="When someone follows you or reviews a game, you'll see it here."/>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
          {items.map((n) => (
            <div key={n.id} className={`panel prof-notif${!n.isRead?' prof-notif--unread':''}`} style={{padding:'.75rem 1rem',cursor:'pointer'}} onClick={()=>!n.isRead&&mark(n.id)}>
              <div style={{display:'flex',gap:'.75rem',alignItems:'flex-start'}}>
                <span style={{fontSize:'1.25rem'}}>{getIcon(n.type)}</span>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <strong style={{fontSize:'.875rem'}}>{n.title}</strong>
                    <span style={{fontSize:'.6875rem',color:'#6b7280'}}>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  {n.body && <p style={{fontSize:'.8125rem',color:'#9ca3af',marginTop:'.25rem'}}>{n.body}</p>}
                  {n.link && <Link to={n.link} style={{fontSize:'.75rem',color:'#a78bfa',marginTop:'.25rem',display:'inline-block'}}>View →</Link>}
                </div>
                {!n.isRead && <span style={{width:8,height:8,background:'#7c3aed',borderRadius:'50%',flexShrink:0,marginTop:4}}/>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
