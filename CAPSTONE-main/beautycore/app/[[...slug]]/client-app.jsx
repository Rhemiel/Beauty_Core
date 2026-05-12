'use client';

import { BrowserRouter } from 'react-router-dom';
import App from '../../src/App';
import '../../src/index.css';
import { AuthProvider } from '../../src/context/AuthContext';

export default function ClientApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}
