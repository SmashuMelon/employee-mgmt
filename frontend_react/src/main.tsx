import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { setAuthToken } from './services/api';
import './index.css';

setAuthToken(localStorage.getItem('employee-auth-token'));

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <React.StrictMode>
        <BrowserRouter>
          <Toaster position='top-center' toastOptions={{ duration: 5000 }} />
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </AuthProvider>
  </QueryClientProvider>
);
