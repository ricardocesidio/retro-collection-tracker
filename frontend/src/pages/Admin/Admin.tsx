import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import Alert from '../../components/ui/Alert/Alert';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { adminApi } from '../../services/admin';
import type { User, GameData } from '../../types';
import './Admin.scss';

const Admin: React.FC = () => {
  const location = useLocation();

  // Redirect to home if not admin
  // Note: This is a client-side check; server-side protection is via RolesGuard
  // We can't access user role here without context, so we'll rely on server-side protection
  // and show an error if accessed by non-admin (handled by backend 403)

  const [users, setUsers] = useState<User[]>([]);
  const [games, setGames] = useState<GameData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'games'>('users');
  const [userPage, setUserPage] = useState(1);
  const [gamePage, setGamePage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [gameSearch, setGameSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.listUsers({ page: userPage, limit: 20, search: userSearch });
      setUsers(res.data);
      setTotalUsers(res.total);
    } catch (e: any) {
      setError(e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [userPage, userSearch]);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.listGames({ page: gamePage, limit: 20, search: gameSearch });
      setGames(res.data);
      setTotalGames(res.total);
    } catch (e: any) {
      setError(e.message || 'Failed to load games');
    } finally {
      setLoading(false);
    }
  }, [gamePage, gameSearch]);

  useEffect(() => {
    fetchUsers();
    fetchGames();
  }, [fetchUsers, fetchGames]);

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearch(e.target.value);
    setUserPage(1);
    fetchUsers();
  };

  const handleGameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameSearch(e.target.value);
    setGamePage(1);
    fetchGames();
  };

  const handleUserRoleChange = async (userId: string, role: string) => {
    try {
      await adminApi.updateUserRole(userId, role);
      fetchUsers();
    } catch (e: any) {
      setError(e.message || 'Failed to update user role');
    }
  };

  const handleUserToggleActive = async (userId: string) => {
    try {
      await adminApi.toggleUserActive(userId);
      fetchUsers();
    } catch (e: any) {
      setError(e.message || 'Failed to update user status');
    }
  };

  const renderUsers = () => {
    if (loading) return <div className="loading-spacer">Loading...</div>;

    if (users.length === 0) {
      return (
        <EmptyState
          icon="👥"
          title="No users found"
          message={userSearch ? 'Try a different search term' : 'No users in the system'}
        >
          <Button variant="outline" size="sm" onClick={() => setUserSearch('')}>
            Clear Search
          </Button>
        </EmptyState>
      );
    }

    return (
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Display Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Collections</th>
              <th>Reviews</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.displayName || '-'}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleUserRoleChange(userId, e.target.value)}
                    disabled={loading}
                  >
                    <option value="USER">User</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td>
                  <Button
                    variant={user.isActive ? 'success' : 'danger'}
                    size="sm"
                    onClick={() => handleUserToggleActive(userId)}
                    disabled={loading}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Button>
                </td>
                <td>{user.isEmailVerified ? 'Yes' : 'No'}</td>
                <td>{user._count?.collections ?? 0}</td>
                <td>{user._count?.reviews ?? 0}</td>
                <td>
                  <Button variant="ghost" size="sm" disabled={loading}>Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-pagination">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
            disabled={userPage <= 1}
          >
            ‹ Prev
          </Button>
          <span>
            Page {userPage} of {Math.ceil(totalUsers / 20)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUserPage((p) => Math.min(p + 1, Math.ceil(totalUsers / 20)))}
            disabled={userPage >= Math.ceil(totalUsers / 20) || totalUsers === 0}
          >
            Next ›
          </Button>
        </div>
      </div>
    );
  };

  const renderGames = () => {
    if (loading) return <div className="loading-spacer">Loading...</div>;

    if (games.length === 0) {
      return (
        <EmptyState
          icon="🎮"
          title="No games found"
          message={gameSearch ? 'Try a different search term' : 'No games in the catalog'}
        >
          <Button variant="outline" size="sm" onClick={() => setGameSearch('')}>
            Clear Search
          </Button>
        </EmptyState>
      );
    }

    return (
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Platform</th>
              <th>Genre</th>
              <th>Release Year</th>
              <th>In Collections</th>
              <th>Reviews</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id}>
                <td>{game.title}</td>
                <td>{game.platform.name}</td>
                <td>{game.genre.name}</td>
                <td>{game.releaseYear}</td>
                <td>{game._count?.collections ?? 0}</td>
                <td>{game._count?.reviews ?? 0}</td>
                <td>
                  <Button variant="ghost" size="sm" disabled={loading}>
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-pagination">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setGamePage((p) => Math.max(p - 1, 1))}
            disabled={gamePage <= 1}
          >
            ‹ Prev
          </Button>
          <span>
            Page {gamePage} of {Math.ceil(totalGames / 20)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setGamePage((p) => Math.min(p + 1, Math.ceil(totalGames / 20)))}
            disabled={gamePage >= Math.ceil(totalGames / 20) || totalGames === 0}
          >
            Next ›
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-shell">
      <div className="page-shell-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-sub">Manage users and game catalog</p>
        </div>
        <Link to="/"><Button variant="ghost">← Back to Home</Button></Link>
      </div>

      {error && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{error}</Alert></div>}

      <div className="admin-tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users ({totalUsers})
        </button>
        <button
          className={activeTab === 'games' ? 'active' : ''}
          onClick={() => setActiveTab('games')}
        >
          Games ({totalGames})
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="admin-section">
          <div className="admin-filters">
            <Input
              placeholder="Search users by username, email, or display name..."
              value={userSearch}
              onChange={handleUserSearch}
            />
          </div>
          {renderUsers()}
        </div>
      ) : (
        <div className="admin-section">
          <div className="admin-filters">
            <Input
              placeholder="Search games by title..."
              value={gameSearch}
              onChange={handleGameSearch}
            />
          </div>
          {renderGames()}
        </div>
      )}
    </div>
  );
};

export default Admin;