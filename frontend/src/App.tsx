import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout/Layout';
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
import NotFound from './pages/NotFound/NotFound';

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/games/:id" element={<GameDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/add-game" element={<AddGame />} />
        <Route path="/edit-game/:id" element={<EditGame />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
