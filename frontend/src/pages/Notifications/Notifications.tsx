import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { notificationsApi } from '../../services/social';
import { connectSocket } from '../../services/socket';
import type { NotificationEntry } from '../../services/social';
import './Notifications.scss';

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
  const iconBg = (t:string)=>({NEW_FOLLOWER:'#7c3aed',NEW_REVIEW:'#d97706',WISHLIST_AVAILABLE:'#3b82f6',SYSTEM:'#6366f1'} as any)[t]||'#6366f1';

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
        <div className="notif-list">
          {items.map((n) => (
            <div key={n.id} className={`notif-item${!n.isRead?' notif-item--unread':''}`} onClick={()=>!n.isRead&&mark(n.id)} style={{position:'relative'}}>
              <div className="notif-item__icon" style={{background:`${iconBg(n.type)}20`,color:iconBg(n.type)}}>
                <i className={getIcon(n.type)} />
              </div>
              <div className="notif-item__content">
                <div className="notif-item__header">
                  <span className="notif-item__title">{n.title}</span>
                  <span className="notif-item__date">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                {n.body && <p className="notif-item__body">{n.body}</p>}
                {n.link && <Link to={n.link} className="notif-item__link" onClick={(e)=>e.stopPropagation()}>View →</Link>}
              </div>
              {!n.isRead && <span className="notif-item__dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
