import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';

// Styles - Order matters! Design system first
import './styles/cozy-cyber-local.css';
import './styles/global.css';

// Components
import HoloWidget from './components/HoloWidget';
import Menu from './components/Menu';
import Auth from './components/Auth';

// For HashRouter to work with Electron file:// protocol
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/widget" element={<HoloWidget />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<HoloWidget />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
