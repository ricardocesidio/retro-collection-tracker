import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/auth/ErrorBoundary';
import AppLayout from './components/layout/AppLayout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home/Home';
import Explore from './pages/Explore/Explore';
import GameDetails from './pages/GameDetails/GameDetails';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Collection from './pages/Collection/Collection';
import Wishlist from './pages/Wishlist/Wishlist';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import AddGame from './pages/AddGame/AddGame';
import EditGame from './pages/EditGame/EditGame';
import Notifications from './pages/Notifications/Notifications';
import Reviews from './pages/Reviews/Reviews';
import Platforms from './pages/Platforms/Platforms';
import Genres from './pages/Genres/Genres';
import Activity from './pages/Activity/Activity';
import Friends from './pages/Friends/Friends';
import NotFound from './pages/NotFound/NotFound';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/collection" element={<ProtectedRoute><Collection /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/games/:id" element={<GameDetails />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/add-game" element={<ProtectedRoute><AddGame /></ProtectedRoute>} />
            <Route path="/edit-game/:id" element={<ProtectedRoute><EditGame /></ProtectedRoute>} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/platforms" element={<Platforms />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
            <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
