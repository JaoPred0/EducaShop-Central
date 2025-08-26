  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { useState, useEffect } from 'react';
  import Dashboard from './pages/admin/Dashboard';
  import HomePage from './pages/HomePage';
  import ProductsPage from './pages/ProductsPage';
  import ProductDetailPage from './pages/ProductDetailPage';
  import CartPage from './pages/CartPage';
  import SearchPage from './pages/SearchPage';
  import AuthPage from './pages/AuthPage';
  import ProfilePage from './pages/ProfilePage';
  import NotFoundPage from './pages/NotFoundPage';
  import Header from './components/Header';
  import Footer from './components/Footer';
  import { CartProvider } from './context/CartContext';
  import ProtectedRoute from './components/ProtectedRoute';
import AddProductPage from './components/admin/AddProductPage';
import EditProductPage from './components/admin/EditProductPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardOrders from './components/admin/DashboardOrders';

  export default function App() {
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }, [auth]);

    return (
      <Router>
        <CartProvider>
          <Routes>
            {/* Rotas do dashboard SEM Header e Footer */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Rotas do site COM Header e Footer */}
            <Route
              path="/*"
              element={
                <div className="flex flex-col min-h-screen bg-gray-50">
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/products/:id" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/profile" />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/add-product" element={<AddProductPage />} />
                      <Route path="/edit-product/:id" element={<EditProductPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </CartProvider>
      </Router>
    );
  }
