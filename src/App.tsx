import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Home';
import WalletPage from './components/WalletPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wallet/:walletAddress" element={<WalletPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;