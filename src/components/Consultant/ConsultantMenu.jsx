import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ConsultantMenu = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/consultant/dashboard',
      icon: '🏠'
    },
    {
      name: 'Hồ sơ cá nhân',
      path: '/consultant/profile',
      icon: '👤'
    },
    {
      name: 'Quản lý lịch',
      path: '/consultant/schedule',
      icon: '📅'
    },
    {
      name: 'Cuộc hẹn',
      path: '/consultant/appointments',
      icon: '📞'
    },
    {
      name: 'Câu hỏi tư vấn',
      path: '/consultant/questions',
      icon: '❓'
    },
    {
      name: 'Đánh giá & Phản hồi',
      path: '/consultant/feedback',
      icon: '⭐'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors duration-200
                ${isActive(item.path)
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default ConsultantMenu;