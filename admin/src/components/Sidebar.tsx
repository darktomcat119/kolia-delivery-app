import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/orders', label: 'Orders', icon: '📦' },
  { path: '/restaurants', label: 'Restaurants', icon: '🍽' },
];

export function Sidebar() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="w-[260px] bg-[#1A1A1A] text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="font-display text-xl text-primary">Kolia Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="text-sm text-gray-400 mb-2 truncate">
          {session?.user?.email}
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-red-400 transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
