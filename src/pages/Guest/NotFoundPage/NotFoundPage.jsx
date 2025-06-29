import React from "react";
import { useNavigate } from "react-router-dom";
import './NotFoundPage.scss';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="notfound-cute-bg">
      <div className="notfound-cute-content">
        <div className="notfound-cute-404">
          <span>4</span>
          <span className="notfound-cute-icon">🐾</span>
          <span>4</span>
        </div>
        <h1 className="notfound-cute-title">
          Oops! <span className="cute-gradient">Page not found</span>
        </h1>
        <p className="notfound-cute-desc">
          Trang bạn tìm không tồn tại hoặc đã bị xóa.<br />
          <span className="notfound-cute-tip">Hãy về nhà nhé! 💖</span>
        </p>
        <button className="notfound-cute-btn" onClick={() => navigate('/')}>Về trang chủ <span className="notfound-cute-arrow">🏠</span></button>
        <div className="notfound-cute-stickers">
          <span>🌈</span>
          <span>☁️</span>
          <span>⭐</span>
          <span>💫</span>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 