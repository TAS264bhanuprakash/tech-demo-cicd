import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StationList from './pages/StationList';
import TrainList from './pages/TrainList';
import LiveTrainTracking from './pages/LiveTrainTracking';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/stations/:city" element={
              <ProtectedRoute>
                <StationList />
              </ProtectedRoute>
            } />
            <Route path="/trains/:stationCode" element={
              <ProtectedRoute>
                <TrainList />
              </ProtectedRoute>
            } />
            <Route path="/live-tracking/:trainNo" element={
              <ProtectedRoute>
                <LiveTrainTracking />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;