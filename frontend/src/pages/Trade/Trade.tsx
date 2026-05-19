import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Alert from '../../components/ui/Alert/Alert';
import { tradeApi } from '../../services/trade';
import type { TradeRequestData } from '../../services/trade';
import { useAuth } from '../../context/AuthContext';
import './Trade.scss';

const Trade: React.FC = () => {
  const { state: authState } = useAuth();
  const currentUserId = authState.user?.id;
  const [received, setReceived] = useState<TradeRequestData[]>([]);
  const [sent, setSent] = useState<TradeRequestData[]>([]);
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shippingForm, setShippingForm] = useState<Record<string, { method: string; address: string; notes: string }>>({});
  const [shippingSaving, setShippingSaving] = useState<string | null>(null);

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

  const handleShippingSave = async (id: string) => {
    const data = shippingForm[id];
    if (!data?.method || !data?.address) return;
    setShippingSaving(id);
    try {
      await tradeApi.updateShipping(id, { shippingMethod: data.method, senderAddress: data.address, shippingNotes: data.notes });
      const [r, s] = await Promise.all([tradeApi.getReceived(), tradeApi.getSent()]);
      setReceived(r); setSent(s);
    } catch (e: any) { setError(e.message); }
    finally { setShippingSaving(null); }
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
                    {(user as any)?.location && <span className="trade-card__location"><i className="fa-solid fa-location-dot" /> {(user as any).location}</span>}
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
                {t.status === 'ACCEPTED' && (
                  <div className="trade-shipping">
                    {t.senderAddress && t.receiverAddress ? (
                      <div className="trade-shipping__info">
                        <h4 className="trade-shipping__title">Trade Confirmed — Ship Your Game</h4>
                        <div className="trade-shipping__cards">
                          <div className="trade-shipping__card">
                            <span className="trade-shipping__card-label">Your Address</span>
                            <span className="trade-shipping__card-value">{t.senderId === currentUserId ? t.senderAddress : t.receiverAddress}</span>
                          </div>
                          <div className="trade-shipping__card">
                            <span className="trade-shipping__card-label">Ship To</span>
                            <span className="trade-shipping__card-value">{t.senderId === currentUserId ? t.receiverAddress : t.senderAddress}</span>
                          </div>
                        </div>
                        {t.shippingMethod && <div className="trade-shipping__detail"><span className="trade-shipping__label">Method:</span><span>{t.shippingMethod}</span></div>}
                        {t.shippingNotes && <div className="trade-shipping__detail"><span className="trade-shipping__label">Notes:</span><span>{t.shippingNotes}</span></div>}
                        {t.senderId === currentUserId && !t.trackingNumber && (
                          <div className="trade-shipping__tracking-form">
                            <input className="trade-shipping__input" placeholder="Enter tracking number..." value={shippingForm[t.id]?.notes || ''} onChange={(e) => setShippingForm((p) => ({ ...p, [t.id]: { ...p[t.id] || {}, notes: e.target.value, method: '', address: '' } }))} />
                            <Button variant="primary" size="sm" onClick={async () => { try { await tradeApi.markAsShipped(t.id, shippingForm[t.id]?.notes || ''); const [r, s] = await Promise.all([tradeApi.getReceived(), tradeApi.getSent()]); setReceived(r); setSent(s); } catch (e: any) { setError(e.message); } }} disabled={!shippingForm[t.id]?.notes}>Mark as Shipped</Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="trade-shipping__form">
                        <h4 className="trade-shipping__title">Arrange Shipping — Send Your Address</h4>
                        <p className="trade-shipping__sub">Once both parties submit their addresses, the trade is confirmed and you can ship your game.</p>
                        <p className="trade-shipping__sent">{t.senderAddress ? '✅ You submitted your address' : t.receiverAddress ? '✅ You submitted your address' : ''}</p>
                        <select className="form-select trade-shipping__select" value={shippingForm[t.id]?.method || ''} onChange={(e) => setShippingForm((p) => ({ ...p, [t.id]: { ...p[t.id] || {}, method: e.target.value, address: p[t.id]?.address || '', notes: p[t.id]?.notes || '' } }))}>
                          <option value="">Select shipping method</option>
                          <option value="DPD">DPD</option>
                          <option value="InPost">InPost</option>
                          <option value="UPS">UPS</option>
                          <option value="FedEx">FedEx</option>
                          <option value="USPS">USPS</option>
                          <option value="Royal Mail">Royal Mail</option>
                          <option value="DHL">DHL</option>
                          <option value="Local pickup">Local Pickup</option>
                          <option value="Other">Other</option>
                        </select>
                        <input className="trade-shipping__input" placeholder="Your full shipping address" value={shippingForm[t.id]?.address || ''} onChange={(e) => setShippingForm((p) => ({ ...p, [t.id]: { ...p[t.id] || {}, address: e.target.value, method: p[t.id]?.method || '', notes: p[t.id]?.notes || '' } }))} />
                        <input className="trade-shipping__input" placeholder="Additional notes (optional)" value={shippingForm[t.id]?.notes || ''} onChange={(e) => setShippingForm((p) => ({ ...p, [t.id]: { ...p[t.id] || {}, notes: e.target.value, method: p[t.id]?.method || '', address: p[t.id]?.address || '' } }))} />
                        <Button variant="primary" size="sm" onClick={() => handleShippingSave(t.id)} loading={shippingSaving === t.id} disabled={!shippingForm[t.id]?.method || !shippingForm[t.id]?.address}>Submit Shipping Details</Button>
                      </div>
                    )}
                  </div>
                )}
                {t.status === 'SHIPPED' && (
                  <div className="trade-shipping">
                    <div className="trade-shipping__info">
                      <h4 className="trade-shipping__title">📦 Item Shipped</h4>
                      <div className="trade-shipping__detail"><span className="trade-shipping__label">Method:</span><span>{t.shippingMethod || 'N/A'}</span></div>
                      <div className="trade-shipping__detail"><span className="trade-shipping__label">Tracking:</span><span className="trade-shipping__tracking">{t.trackingNumber}</span></div>
                      {t.shippingNotes && <div className="trade-shipping__detail"><span className="trade-shipping__label">Notes:</span><span>{t.shippingNotes}</span></div>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Trade;
