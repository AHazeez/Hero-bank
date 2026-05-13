import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  CreditCard, 
  TrendingUp, 
  CircleDollarSign, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  user: {
    fullName: string;
    id: string;
  } | null;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/accounts', icon: Wallet, label: 'Accounts' },
    { path: '/transfer', icon: ArrowRightLeft, label: 'Transfer' },
    { path: '/cards', icon: CreditCard, label: 'Cards' },
  ];

  const financeItems = [
    { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/loans', icon: CircleDollarSign, label: 'Loans' },
  ];

  const supportItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-text font-serif text-accent text-xl">Hero Bank System</div>
        <div className="logo-sub text-xs text-text3 tracking-wider uppercase mt-0.5">Private Banking</div>
      </div>
      
      <nav className="nav flex-1 p-4">
        <div className="nav-label text-xs text-text3 tracking-wider uppercase pb-1.5 pt-2">Main</div>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={16} className="flex-shrink-0 opacity-80" />
            {item.label}
          </NavLink>
        ))}

        <div className="nav-label text-xs text-text3 tracking-wider uppercase pb-1.5 pt-2">Finance</div>
        {financeItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={16} className="flex-shrink-0 opacity-80" />
            {item.label}
          </NavLink>
        ))}

        <div className="nav-label text-xs text-text3 tracking-wider uppercase pb-1.5 pt-2">Support</div>
        {supportItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={16} className="flex-shrink-0 opacity-80" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer p-4 border-t border-border2">
        <div className="user-info flex items-center gap-2.5">
          <div className="avatar w-9 h-9 rounded-full bg-gradient-to-r from-accent to-accent-dim flex items-center justify-center text-sm font-semibold text-[#1a1000] flex-shrink-0">
            {user ? getUserInitials(user.fullName) : 'AK'}
          </div>
          <div>
            <div className="user-name text-sm font-medium text-text">
              {user?.fullName || 'Arjun Kumar'}
            </div>
            <div className="user-id text-xs text-text3">
              {user?.id || 'ACC-00291847'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
