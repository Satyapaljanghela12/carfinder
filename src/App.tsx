import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CarProvider } from './contexts/CarContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import CarDetailPage from './pages/CarDetailPage';
import ComparePage from './pages/ComparePage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import BrowsePage from './pages/BrowsePage';
import EnhancedBrowsePage from './pages/EnhancedBrowsePage';
import { useAuth } from './contexts/AuthContext';

const AppContent = () => {
  const { showLoginModal, setShowLoginModal } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/car/:id" element={<CarDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/search" element={<EnhancedBrowsePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CarProvider>
        <Router>
          <AppContent />
        </Router>
      </CarProvider>
    </AuthProvider>
  );
}

export default App;