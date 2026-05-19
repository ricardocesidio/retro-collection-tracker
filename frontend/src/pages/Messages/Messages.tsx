import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Alert from '../../components/ui/Alert/Alert';
import { messagesApi } from '../../services/messages';
import { connectSocket, getSocket } from '../../services/socket';
import type { MessageData, ConversationData } from '../../services/messages';
import './Messages.scss';

const Messages: React.FC = () => {
  const [convos, setConvos] = useState<ConversationData[]>([]);
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesApi.getConversations().then(setConvos).catch(() => {}).finally(() => setLoading(false));
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

  const blockUser = async (userId: string) => {
    try {
      await messagesApi.blockUser(userId);
      setActiveConvo(null);
      messagesApi.getConversations().then(setConvos).catch(() => {});
    } catch (err: any) {
      setError(err.message || 'Failed to block user');
    }
  };

  const reportUser = async (userId: string) => {
    try {
      await messagesApi.reportUser(userId);
      setError('');
      alert('User has been reported.');
    } catch (err: any) {
      setError(err.message || 'Failed to report user');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page-shell msg-page">
      <h1 className="page-title">Messages</h1>
      {error && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{error}</Alert></div>}
      <div className="msg-layout">
        <div className="msg-sidebar">
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
                  <span className="msg-convo-btn__preview">{c.lastMessage.content.slice(0, 40) || (c.lastMessage.imageUrl ? '[Photo]' : '')}</span>
                </div>
                {c.unreadCount > 0 && <span className="msg-convo-btn__badge">{c.unreadCount}</span>}
              </button>
            ))
          )}
        </div>
        <div className="msg-main">
          {activeConvo ? (
            <>
              <div className="msg-chat-header">
                <button className="msg-header-btn" onClick={() => reportUser(activeConvo)} title="Report"><i className="fa-solid fa-flag" /></button>
                <button className="msg-header-btn" onClick={() => blockUser(activeConvo)} title="Block"><i className="fa-solid fa-ban" /></button>
                <span>{convos.find((c) => c.user.id === activeConvo)?.user.displayName || convos.find((c) => c.user.id === activeConvo)?.user.username || 'Chat'}</span>
              </div>
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
    </div>
  );
};

export default Messages;
