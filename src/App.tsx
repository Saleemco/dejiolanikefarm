import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import HomePage from './HomePage';
import ProductsPage from './ProductsPage';
import { Fish } from 'lucide-react';

function AppLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for when HomePage signals it's ready
    const handleHomePageReady = () => {
      setIsLoading(false);
    };

    window.addEventListener('homepageReady', handleHomePageReady);

    // Timeout fallback - if homepage takes too long, hide loader anyway
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      window.removeEventListener('homepageReady', handleHomePageReady);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          {/* Animated fish logo */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 animate-ping opacity-20">
              <Fish className="w-24 h-24 text-primary" />
            </div>
            <Fish className="w-24 h-24 text-primary relative animate-bounce" />
          </div>
          
          {/* Farm name with fade effect */}
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2 animate-pulse">
            DejiOlanike Farm
          </h1>
          
          {/* Water ripple effect */}
          <div className="flex justify-center gap-1 mt-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          <p className="text-muted-foreground mt-6 text-sm">
            Fresh fish, straight to you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return <AppLoader />;
}

export default App;