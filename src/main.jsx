import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { installGlobalErrorLogging } from './utils/logError.js';
import './styles/global.css';

installGlobalErrorLogging();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary name="root">
      <ThemeProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
