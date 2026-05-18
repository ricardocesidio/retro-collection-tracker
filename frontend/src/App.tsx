import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/auth/ErrorBoundary';
import AppLayout from './components/layout/AppLayout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner/LoadingSpinner';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';

const Explore = lazy(() => import('./pages/Explore/Explore'));
const GameDetails = lazy(() => import('./pages/GameDetails/GameDetails'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Collection = lazy(() => import('./pages/Collection/Collection'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const AddGame = lazy(() => import('./pages/AddGame/AddGame'));
const EditGame = lazy(() => import('./pages/EditGame/EditGame'));
const Notifications = lazy(() => import('./pages/Notifications/Notifications'));
const Reviews = lazy(() => import('./pages/Reviews/Reviews'));
const Platforms = lazy(() => import('./pages/Platforms/Platforms'));
const Genres = lazy(() => import('./pages/Genres/Genres'));
const Activity = lazy(() => import('./pages/Activity/Activity'));
const Friends = lazy(() => import('./pages/Friends/Friends'));
const Donate = lazy(() => import('./pages/Donate/Donate'));
const Leaderboard = lazy(() => import('./pages/Leaderboard/Leaderboard'));
const Admin = lazy(() => import('./pages/Admin/Admin'));

const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner fullPage />}>{children}</Suspense>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><LazyRoute><Dashboard /></LazyRoute></ProtectedRoute>} />
            <Route path="/collection" element={<ProtectedRoute><LazyRoute><Collection /></LazyRoute></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><LazyRoute><Wishlist /></LazyRoute></ProtectedRoute>} />
            <Route path="/explore" element={<LazyRoute><Explore /></LazyRoute>} />
            <Route path="/games/:id" element={<LazyRoute><GameDetails /></LazyRoute>} />
            <Route path="/profile/:username" element={<LazyRoute><Profile /></LazyRoute>} />
            <Route path="/settings" element={<ProtectedRoute><LazyRoute><Settings /></LazyRoute></ProtectedRoute>} />
            <Route path="/add-game" element={<ProtectedRoute><LazyRoute><AddGame /></LazyRoute></ProtectedRoute>} />
            <Route path="/edit-game/:id" element={<ProtectedRoute><LazyRoute><EditGame /></LazyRoute></ProtectedRoute>} />
            <Route path="/reviews" element={<LazyRoute><Reviews /></LazyRoute>} />
            <Route path="/platforms" element={<LazyRoute><Platforms /></LazyRoute>} />
            <Route path="/genres" element={<LazyRoute><Genres /></LazyRoute>} />
            <Route path="/activity" element={<ProtectedRoute><LazyRoute><Activity /></LazyRoute></ProtectedRoute>} />
            <Route path="/leaderboard" element={<LazyRoute><Leaderboard /></LazyRoute>} />
            <Route path="/friends" element={<ProtectedRoute><LazyRoute><Friends /></LazyRoute></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><LazyRoute><Notifications /></LazyRoute></ProtectedRoute>} />
            <Route path="/donate" element={<LazyRoute><Donate /></LazyRoute>} />
            <Route path="/admin" element={<ProtectedRoute><LazyRoute><Admin /></LazyRoute></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
