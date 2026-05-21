import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Alert from '../../components/ui/Alert/Alert';
import ConfirmDialog from '../../components/ui/ConfirmDialog/ConfirmDialog';
import { messagesApi } from '../../services/messages';
import { connectSocket } from '../../services/socket';
import type { MessageData, ConversationData } from '../../services/messages';
import './Messages.scss';

const REPORT_REASONS = ['Harassment', 'Racism', 'Bullying', 'Spam', 'Threats', 'Inappropriate Content', 'Fraud / Scam', 'Other'];

const Messages: React.FC = () => {
  const [convos, setConvos] = useState<ConversationData[]>([]);
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportText, setReportText] = useState('');
  const [blockTarget, setBlockTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesApi.getConversations().then(setConvos).catch(() => {}).finally(() => setLoading(false));
    messagesApi.getBlocked().then((users) => setBlockedUsers(users.map((u: any) => u.id))).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeConvo) return;
    messagesApi.getMessages(activeConvo).then(setMessages).catch(() => {});
  }, [activeConvo]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const socket = connectSocket(token);
    const handler = (msg: MessageData) => {
      setMessages((prev) => [...prev, msg]);
      messagesApi.getConversations().then(setConvos).catch(() => {});
    };
    socket.on('message:new', handler);
    return () => { socket.off('message:new', handler); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (imageUrl?: string) => {
    if ((!input.trim() && !imageUrl) || !activeConvo || sending) return;
    if (blockedUsers.includes(activeConvo)) { setError('You cannot message a blocked user.'); return; }
    setSending(true);
    setError('');
    try {
      await messagesApi.send(activeConvo, input.trim(), imageUrl);
      setInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => send(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleBlock = async () => {
    if (!blockTarget) return;
    try {
      await messagesApi.blockUser(blockTarget);
      setBlockedUsers((prev) => [...prev, blockTarget]);
      setBlockTarget(null);
      messagesApi.getConversations().then(setConvos).catch(() => {});
    } catch (err: any) {
      setError(err.message || 'Failed to block user');
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      await messagesApi.unblockUser(userId);
      setBlockedUsers((prev) => prev.filter((id) => id !== userId));
      messagesApi.getConversations().then(setConvos).catch(() => {});
    } catch (err: any) {
      setError(err.message || 'Failed to unblock user');
    }
  };

  const handleReport = async () => {
    if (!activeConvo || !reportReason) return;
    if (reportReason === 'Other' && !reportText.trim()) return;
    try {
      await messagesApi.reportUser(activeConvo, reportReason + (reportText.trim() ? `: ${reportText.trim()}` : ''));
      setShowReport(false);
      setReportReason('');
      setReportText('');
      setSuccess('Report submitted successfully.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to report user');
    }
  };

  const isBlocked = activeConvo ? blockedUsers.includes(activeConvo) : false;
  const activeUser = convos.find((c) => c.user.id === activeConvo)?.user;

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page-shell msg-page">
      <h1 className="page-title">Messages</h1>
      {error && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{error}</Alert></div>}
      {success && <div style={{ marginBottom: '1rem' }}><Alert variant="success">{success}</Alert></div>}
      <div className="msg-layout">
        <div className={`msg-sidebar${activeConvo ? ' msg-sidebar--hidden' : ''}`}>
          {convos.length === 0 ? (
            <p style={{ color: '#5a6480', fontSize: '0.825rem', textAlign: 'center', padding: '2rem 0' }}>No conversations yet</p>
          ) : (
            convos.map((c) => (
              <button
                key={c.user.id}
                className={`msg-convo-btn${activeConvo === c.user.id ? ' msg-convo-btn--active' : ''}`}
                onClick={() => setActiveConvo(c.user.id)}
              >
                <div className="msg-convo-btn__avatar">
                  {c.user.avatarUrl ? <img src={c.user.avatarUrl} alt="" /> : <span>{c.user.displayName?.charAt(0) || c.user.username.charAt(0)}</span>}
                </div>
                <div className="msg-convo-btn__info">
                  <span className="msg-convo-btn__name">{c.user.displayName || c.user.username}</span>
                  <span className="msg-convo-btn__preview">{c.blocked ? '🚫 Blocked' : c.lastMessage.content.slice(0, 40) || (c.lastMessage.imageUrl ? '[Photo]' : '')}</span>
                </div>
                {c.unreadCount > 0 && <span className="msg-convo-btn__badge">{c.unreadCount}</span>}
              </button>
            ))
          )}
        </div>
        <div className={`msg-main${!activeConvo ? ' msg-main--hidden' : ''}`}>
          {activeConvo ? (
            <>
              <div className="msg-chat-header">
                <div className="msg-chat-header__left">
                  <button className="msg-back-btn" onClick={() => setActiveConvo(null)} title="Back"><i className="fa-solid fa-arrow-left" /></button>
                  {activeUser ? <Link to={`/profile/${activeUser.username}`} className="msg-chat-name">{activeUser?.displayName || activeUser?.username}</Link> : <span className="msg-chat-name">{activeUser?.displayName || activeUser?.username || 'Chat'}</span>}
                </div>
                  {isBlocked ? (
                    <button className="msg-action-btn msg-action-btn--unblock" onClick={() => handleUnblock(activeConvo)} title="Unblock"><i className="fa-solid fa-check" /> Unblock</button>
                  ) : (
                    <>
                      <button className="msg-action-btn msg-action-btn--report" onClick={() => setShowReport(true)} title="Report"><i className="fa-solid fa-flag" /></button>
                      <button className="msg-action-btn msg-action-btn--block" onClick={() => setBlockTarget(activeConvo)} title="Block"><i className="fa-solid fa-ban" /></button>
                    </>
                  )}
                </div>
              {isBlocked && <div className="msg-blocked-banner"><i className="fa-solid fa-lock" /> You blocked {activeUser?.displayName || activeUser?.username}. <button onClick={() => handleUnblock(activeConvo)}>Unblock</button> to message again.</div>}
              <div className="msg-list">
                {messages.map((m) => {
                  const isMe = m.senderId !== activeConvo;
                  return (
                    <div key={m.id} className={`msg-bubble${isMe ? ' msg-bubble--me' : ' msg-bubble--other'}`}>
                      {m.imageUrl && <img className="msg-bubble__img" src={m.imageUrl} alt="" />}
                      {m.content && <div className="msg-bubble__text">{m.content}</div>}
                      <span className="msg-bubble__time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="msg-input-bar">
                <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
                <button className="msg-img-btn" onClick={() => fileInputRef.current?.click()} title="Send photo">
                  <i className="fa-solid fa-camera" />
                </button>
                <input
                  className="msg-input"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                />
                <button className="msg-send-btn" onClick={() => send()} disabled={sending || !input.trim()}>
                  <i className="fa-solid fa-paper-plane" />
                </button>
              </div>
            </>
          ) : (
            <EmptyState icon="💬" title="Select a conversation" message="Choose a conversation from the left to start chatting." />
          )}
        </div>
      </div>

      {showReport && (
        <div className="msg-overlay" onClick={() => setShowReport(false)}>
          <div className="msg-modal msg-modal--report" onClick={(e) => e.stopPropagation()}>
            <h3 className="msg-modal__title"><i className="fa-solid fa-flag" style={{color:'#f87171'}} /> Report User</h3>
            <p className="msg-modal__desc">Why are you reporting {activeUser?.displayName || activeUser?.username}?</p>
            <div className="msg-report-reasons">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r}
                  className={`msg-report-reason${reportReason === r ? ' msg-report-reason--active' : ''}`}
                  onClick={() => { setReportReason(r); if (r !== 'Other') setReportText(''); }}
                >{r}</button>
              ))}
            </div>
            {reportReason === 'Other' && (
              <textarea
                className="msg-report-text"
                placeholder="Describe the issue..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                rows={3}
              />
            )}
            <div className="msg-modal__actions">
              <Button variant="ghost" onClick={() => { setShowReport(false); setReportReason(''); setReportText(''); }}>Cancel</Button>
              <Button variant="danger" onClick={handleReport} disabled={!reportReason || (reportReason === 'Other' && !reportText.trim())}>Submit Report</Button>
                </div>
              </div>
            </div>
          )}

      <ConfirmDialog
        open={blockTarget !== null}
        title="Block User"
        message={`Are you sure you want to block ${activeUser?.displayName || activeUser?.username || 'this user'}? They will not be able to message you, and their messages will be hidden. You can unblock them later.`}
        confirmLabel="Block"
        variant="danger"
        onConfirm={handleBlock}
        onCancel={() => setBlockTarget(null)}
      />
    </div>
  );
};

export default Messages;
