import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Alert from '../../components/ui/Alert/Alert';
import { tradeApi } from '../../services/trade';
import type { TradeRequestData } from '../../services/trade';
import './Trade.scss';

const Trade: React.FC = () => {
  const [received, setReceived] = useState<TradeRequestData[]>([]);
  const [sent, setSent] = useState<TradeRequestData[]>([]);
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([tradeApi.getReceived(), tradeApi.getSent()])
      .then(([r, s]) => { setReceived(r); setSent(s); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, action: 'accept' | 'decline' | 'cancel') => {
    try {
      if (action === 'accept') await tradeApi.acceptTrade(id);
      else if (action === 'decline') await tradeApi.declineTrade(id);
      else await tradeApi.cancelTrade(id);
      const [r, s] = await Promise.all([tradeApi.getReceived(), tradeApi.getSent()]);
      setReceived(r); setSent(s);
    } catch (e: any) { setError(e.message); }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const items = tab === 'received' ? received : sent;

  return (
    <div className="page-shell" style={{ maxWidth: 720 }}>
      <div className="page-shell-header">
        <div><h1 className="page-title">Trade Requests</h1><p className="page-sub">Propose and manage trades with other collectors</p></div>
      </div>
      {error && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{error}</Alert></div>}

      <div className="prof-tabs">
        <button className={`prof-tab${tab === 'received' ? ' prof-tab--active' : ''}`} onClick={() => setTab('received')}>Received ({received.length})</button>
        <button className={`prof-tab${tab === 'sent' ? ' prof-tab--active' : ''}`} onClick={() => setTab('sent')}>Sent ({sent.length})</button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon="🤝" title="No trade requests" message={tab === 'received' ? 'When someone wants to trade with you, it will appear here.' : 'Send a trade request from another collector\'s profile.'} />
      ) : (
        <div className="trade-list">
          {items.map((t) => {
            const user = tab === 'received' ? t.sender : t.receiver;
            return (
              <div key={t.id} className="trade-card">
                <div className="trade-card__header">
                  <Link to={`/profile/${user?.username}`} className="trade-card__user">
                    <div className="trade-card__avatar">
                      {user?.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <span>{user?.displayName?.charAt(0) || user?.username?.charAt(0) || '?'}</span>}
                    </div>
                    <span className="trade-card__name">{user?.displayName || user?.username}</span>
                  </Link>
                  <span className={`trade-card__status trade-card__status--${t.status.toLowerCase()}`}>{t.status}</span>
                </div>
                <div className="trade-card__games">
                  {t.offered && <div className="trade-card__game"><span className="trade-card__game-label">Offers</span><span>{t.offered.title}</span></div>}
                  {t.wanted && <div className="trade-card__game"><span className="trade-card__game-label">Wants</span><span>{t.wanted.title}</span></div>}
                </div>
                {t.message && <p className="trade-card__message">{t.message}</p>}
                <div className="trade-card__footer">
                  <span className="trade-card__date">{new Date(t.createdAt).toLocaleDateString()}</span>
                  {t.status === 'PENDING' && tab === 'received' && (
                    <div className="trade-card__actions">
                      <Button variant="primary" size="sm" onClick={() => handleAction(t.id, 'accept')}>Accept</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleAction(t.id, 'decline')}>Decline</Button>
                    </div>
                  )}
                  {t.status === 'PENDING' && tab === 'sent' && (
                    <Button variant="ghost" size="sm" onClick={() => handleAction(t.id, 'cancel')}>Cancel</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Trade;
