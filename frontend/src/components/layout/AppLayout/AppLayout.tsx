import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import ChatWidget from '../../ui/ChatWidget/ChatWidget';
import './AppLayout.scss';

const AppLayout: React.FC = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <TopBar />
      <main className={`app-layout__content${visible ? ' app-layout__content--visible' : ''}`}>
        <Outlet />
      </main>
      <ChatWidget />
    </div>
  );
};

export default AppLayout;
