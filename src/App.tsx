import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import HomePage from './HomePage';
import ProductsPage from './ProductsPage';

function App() {
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

export default App;