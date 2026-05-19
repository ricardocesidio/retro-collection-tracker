import { apiRequest } from './api-client';

export interface TradeRequestData {
  id: string;
  senderId: string;
  receiverId: string;
  offeredGameId?: string;
  wantedGameId?: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'SHIPPED' | 'COMPLETED';
  createdAt: string;
  sender?: { id: string; username: string; displayName?: string; avatarUrl?: string };
  receiver?: { id: string; username: string; displayName?: string; avatarUrl?: string };
  offered?: { id: string; title: string; coverImageUrl?: string };
  wanted?: { id: string; title: string; coverImageUrl?: string };
}

export const tradeApi = {
  createRequest: (data: { receiverId: string; offeredGameId?: string; wantedGameId?: string; message?: string }): Promise<TradeRequestData> =>
    apiRequest('/trade/request', { method: 'POST', body: JSON.stringify(data) }),

  getReceived: (): Promise<TradeRequestData[]> => apiRequest('/trade/received'),
  getSent: (): Promise<TradeRequestData[]> => apiRequest('/trade/sent'),

  acceptTrade: (id: string): Promise<TradeRequestData> =>
    apiRequest(`/trade/${id}/accept`, { method: 'POST' }),

  declineTrade: (id: string): Promise<TradeRequestData> =>
    apiRequest(`/trade/${id}/decline`, { method: 'POST' }),

  cancelTrade: (id: string): Promise<TradeRequestData> =>
    apiRequest(`/trade/${id}/cancel`, { method: 'POST' }),

  updateShipping: (id: string, data: { shippingMethod?: string; senderAddress?: string; shippingNotes?: string }): Promise<TradeRequestData> =>
    apiRequest(`/trade/${id}/shipping`, { method: 'POST', body: JSON.stringify(data) }),

  markAsShipped: (id: string, trackingNumber: string): Promise<TradeRequestData> =>
    apiRequest(`/trade/${id}/ship`, { method: 'POST', body: JSON.stringify({ trackingNumber }) }),

  markAsReceived: (id: string): Promise<TradeRequestData> =>
    apiRequest(`/trade/${id}/received`, { method: 'POST' }),

  getUnreadCount: (): Promise<{ count: number }> => apiRequest('/trade/unread-count'),
};
