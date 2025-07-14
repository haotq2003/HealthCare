import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { User, Settings, LogOut, UserCircle, History } from 'lucide-react';
import './Header.scss';

const Header = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, user } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);



  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userNavLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/user/booking", label: "Đặt lịch tư vấn" },
    { to: "/user/test-booking", label: "Đặt lịch xét nghiệm" },
    { to: "/user/menstrual-cycle", label: "Theo dõi chu kỳ" },
    { to: "/blog", label: "Blog" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Temporarily commented out - Get button text based on authentication state
  /*
  const getAuthButtonText = () => {
    if (isAuthenticated) {
      return user?.fullName  || 'Tài khoản';
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
  */

  return (
    <header className="header1">
      <div className="logo1">
        <span role="img" aria-label="logo">💜</span>
        <Link to="/" className="brand">HealthCare</Link>
      </div>
      <nav className="nav">
        {userNavLinks.map(link => (
          <Link key={link.to} to={link.to} className="header-nav-link">
            {link.label}
          </Link>
        ))}
        
        {/* User Icon with Dropdown - Always visible */}
        <div className="user-dropdown-wrapper" ref={userDropdownRef}>
          <button className="user-icon-btn" onClick={() => setUserDropdownOpen(v => !v)}>
            <UserCircle size={24} />
          </button>

          {userDropdownOpen && (
            <div className="user-dropdown">
              <Link to="/user/history" className="dropdown-item">
                <History size={18} /> Lịch sử
              </Link>
              <Link to="/user/profile" className="dropdown-item">
                <User size={18} /> Hồ sơ
              </Link>
              <Link to="/user/setting" className="dropdown-item">
                <Settings size={18} /> Cài đặt
              </Link>
              {isAuthenticated && (
                <button className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={18} /> Đăng xuất
                </button>
              )}
            </div>
          )}
        </div>

        {/* Login Button - Always visible */}
        {!isAuthenticated && (
          <Link to="/login" className="auth-btn login-btn">
            Đăng nhập
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
