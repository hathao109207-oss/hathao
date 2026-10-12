import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';

// Pages
import Home from './pages/Home';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import SeatSelection from './pages/SeatSelection';
import SnackSelection from './pages/SnackSelection';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import News from './pages/News';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Header />
        <ToastContainer />
        <main className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/seat" element={<SeatSelection />} />
            <Route path="/snack" element={<SnackSelection />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
