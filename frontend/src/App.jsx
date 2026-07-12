import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import ReportView from './pages/ReportView';
import HistoryPage from './pages/HistoryPage';
import WatchlistPage from './pages/WatchlistPage';
import ComparisonPage from './pages/ComparisonPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/report/:id" element={<ReportView />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
