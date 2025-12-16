import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Menu from './pages/Menu';
import Admin from './pages/Admin';
import PWAInstallPrompt from './components/PWAInstallPrompt';

function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <Router>
          <PWAInstallPrompt />
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AppProvider>
  );
}

export default App;