import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import './Header.scss';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Check if user is on login or register page
  const isOnAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Handle login/register button click
  const handleAuthClick = () => {
    if (isAuthenticated) {
      // If authenticated, show user menu or logout
      console.log('User is authenticated, show user menu');
      // TODO: Implement user menu dropdown
    } else {
      // If not authenticated, navigate to login page
      navigate('/login');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get button text based on authentication state
  const getAuthButtonText = () => {
    if (isAuthenticated) {
      return user?.name || 'Tài khoản';
    }
    return 'Đăng nhập/Đăng ký';
  };

  // Get button link based on current page
  const getAuthButtonLink = () => {
    if (isAuthenticated) {
      return '/dashboard'; // TODO: Replace with actual user dashboard route
    }
    if (isOnAuthPage) {
      return '/'; // If on auth page, go back to home
    }
    return '/login';
  };

  return (
    <header className="header">
      <div className="logo">
        <span role="img" aria-label="logo">💜</span>
        <Link to="/" className="brand">HealthCare</Link>
      </div>
      <nav className="nav">
        <Link to="/">Trang chủ</Link>
        <a href="#services">Dịch vụ</a>
        <a href="#about">Về chúng tôi</a>
        <a href="#contact">Liên hệ</a>
        
        {isAuthenticated ? (
          <div className="user-menu">
            <Link 
              to={getAuthButtonLink()} 
              className="auth-btn user-btn"
              onClick={handleAuthClick}
            >
              {getAuthButtonText()}
            </Link>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Đăng xuất"
            >
              🚪
            </button>
          </div>
        ) : (
          <Link 
            to={getAuthButtonLink()} 
            className="auth-btn login-btn"
            onClick={handleAuthClick}
          >
            {getAuthButtonText()}
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
