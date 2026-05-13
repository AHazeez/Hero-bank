import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="app flex min-h-screen">
      <Sidebar user={user} />
      <main className="main flex-1 ml-60 p-8 max-w-[calc(100%-240px)]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
