import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import React from 'react';

// Mock auth API
vi.mock('../services/auth', () => ({
  authApi: {
    login: vi.fn().mockResolvedValue({
      user: { id: '1', email: 'test@test.com', username: 'testuser', role: 'USER', createdAt: '2024-01-01' },
      token: 'test-token',
    }),
    register: vi.fn().mockResolvedValue({
      user: { id: '2', email: 'new@test.com', username: 'newuser', role: 'USER', createdAt: '2024-01-01' },
      token: 'new-token',
    }),
    getProfile: vi.fn().mockResolvedValue({
      id: '1', email: 'test@test.com', username: 'testuser', role: 'USER', createdAt: '2024-01-01',
    }),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should start with loading state and no user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    // AuthProvider always resolves loading on mount
    await vi.waitFor(() => {
      expect(result.current.state.user).toBeNull();
    });
    expect(result.current.state.loading).toBe(false);
  });

  it('should login and set user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@test.com', 'password');
    });

    expect(result.current.state.user?.email).toBe('test@test.com');
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('should logout and clear user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@test.com', 'password');
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.state.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
