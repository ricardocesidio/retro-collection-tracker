import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import './AppLayout.scss';

const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <TopBar />
      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
