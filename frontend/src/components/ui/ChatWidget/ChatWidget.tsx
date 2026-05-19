import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { messagesApi } from '../../../services/messages';
import { connectSocket } from '../../../services/socket';
import type { MessageData, ConversationData } from '../../../services/messages';
import './ChatWidget.scss';

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [convos, setConvos] = useState<ConversationData[]>([]);
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesApi.getUnreadCount().then((r) => setUnread(r.count)).catch(() => {});
    const token = localStorage.getItem('token');
    if (!token) return;
    const socket = connectSocket(token);
    const handler = (msg: MessageData) => {
      setUnread((p) => p + 1);
      if (activeConvo === msg.senderId) {
        setMessages((prev) => [...prev, msg]);
      }
      messagesApi.getConversations().then(setConvos).catch(() => {});
    };
    socket.on('message:new', handler);
    return () => { socket.off('message:new', handler); };
  }, [activeConvo]);

  const toggle = () => {
    setOpen(!open);
    if (!open) {
      messagesApi.getConversations().then(setConvos).catch(() => {});
    }
  };

  const selectConvo = async (userId: string) => {
    setActiveConvo(userId);
    setLoading(true);
    const msgs = await messagesApi.getMessages(userId);
    setMessages(msgs);
    setLoading(false);
    messagesApi.getUnreadCount().then((r) => setUnread(r.count)).catch(() => {});
  };

  const send = async (imageUrl?: string) => {
    if ((!input.trim() && !imageUrl) || !activeConvo) return;
    const text = input.trim();
    setInput('');
    try {
      const msg = await messagesApi.send(activeConvo, text, imageUrl);
      setMessages((prev) => [...prev, msg]);
    } catch {}
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => send(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`chat-widget${open ? ' chat-widget--open' : ''}`}>
      {open && (
        <div className="chat-widget__box">
          <div className="chat-widget__header">
            <span>Messages</span>
            <Link to="/messages" className="chat-widget__full-link" onClick={() => setOpen(false)}>View All</Link>
          </div>
          <div className="chat-widget__body">
            {!activeConvo ? (
              <div className="chat-widget__convos">
                {convos.length === 0 ? (
                  <p className="chat-widget__empty">No conversations</p>
                ) : (
                  convos.map((c) => (
                    <button key={c.user.id} className="chat-widget__convo-btn" onClick={() => selectConvo(c.user.id)}>
                      <div className="chat-widget__avatar">
                        {c.user.avatarUrl ? <img src={c.user.avatarUrl} alt="" /> : <span>{c.user.displayName?.charAt(0) || c.user.username.charAt(0)}</span>}
                      </div>
                      <div className="chat-widget__convo-info">
                        <span className="chat-widget__convo-name">{c.user.displayName || c.user.username}</span>
                        <span className="chat-widget__convo-preview">{c.lastMessage.content.slice(0, 30)}</span>
                      </div>
                      {c.unreadCount > 0 && <span className="chat-widget__badge">{c.unreadCount}</span>}
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="chat-widget__chat">
                <div className="chat-widget__chat-header">
                  <button className="chat-widget__back" onClick={() => setActiveConvo(null)}><i className="fa-solid fa-arrow-left" /></button>
                  <span>{convos.find((c) => c.user.id === activeConvo)?.user.displayName || 'Chat'}</span>
                </div>
                <div className="chat-widget__msgs">
                  {loading ? <p style={{ textAlign: 'center', padding: '1rem', color: '#5a6480' }}>Loading...</p> : messages.map((m) => {
                    const isMe = m.senderId !== activeConvo;
                    return (
                      <div key={m.id} className={`chat-widget__bubble${isMe ? ' chat-widget__bubble--me' : ''}`}>
                        {m.imageUrl && <img className="chat-widget__bubble-img" src={m.imageUrl} alt="" />}
                        {m.content && <div>{m.content}</div>}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="chat-widget__input-bar">
                  <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
                  <button className="chat-widget__img-btn" onClick={() => fileInputRef.current?.click()}><i className="fa-solid fa-camera" /></button>
                  <input className="chat-widget__input" placeholder="Type..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
                  <button className="chat-widget__send" onClick={send} disabled={!input.trim()}><i className="fa-solid fa-paper-plane" /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <button className="chat-widget__toggle" onClick={toggle}>
        <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-comment'}`} />
        {unread > 0 && !open && <span className="chat-widget__toggle-badge">{unread > 9 ? '9+' : unread}</span>}
      </button>
    </div>
  );
};

export default ChatWidget;
