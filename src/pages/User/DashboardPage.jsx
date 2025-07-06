import React from 'react';
import './DashboardPage.scss';
import { Calendar, BarChart2, MessageCircle, Heart, ArrowRight } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="user-dashboard-page">
      <h1>Chào mừng trở lại!</h1>
      <p className="dashboard-sub">Đây là tổng quan về sức khỏe của bạn.</p>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon calendar"><Calendar size={28} /></div>
          <div className="stat-label">Lịch hẹn sắp tới</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cycle"><BarChart2 size={28} /></div>
          <div className="stat-label">Ngày trong chu kỳ</div>
          <div className="stat-value highlight">Ngày 6</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon question"><MessageCircle size={28} /></div>
          <div className="stat-label">Câu hỏi đã trả lời</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon health"><Heart size={28} /></div>
          <div className="stat-label">Sức khỏe tổng thể</div>
          <div className="stat-value good">Tốt</div>
        </div>
      </div>
      <div className="dashboard-main">
        <div className="dashboard-section upcoming">
          <div className="section-header">
            <span>Lịch hẹn sắp tới</span>
            <a href="#" className="see-all">Xem tất cả <ArrowRight size={16} /></a>
          </div>
          <div className="empty-state">
            <div className="empty-icon"><Calendar size={48} /></div>
            <div>Bạn không có lịch hẹn nào sắp tới.</div>
            <button className="primary-btn">Đặt lịch ngay</button>
          </div>
        </div>
        <div className="dashboard-section cycle-overview">
          <div className="section-header">Tổng quan chu kỳ</div>
          <div className="cycle-progress">
            <svg width="80" height="80">
              <circle cx="40" cy="40" r="32" stroke="#eee" strokeWidth="8" fill="none" />
              <circle cx="40" cy="40" r="32" stroke="#a259e6" strokeWidth="8" fill="none" strokeDasharray="201" strokeDashoffset="100" strokeLinecap="round" />
            </svg>
            <div className="cycle-day">
              <span className="cycle-current">6</span>
              <span className="cycle-total">/ 28 ngày</span>
            </div>
          </div>
          <div className="cycle-stage">Giai đoạn: Nang trứng</div>
          <div className="cycle-info fertile">
            <span>🟢 Dễ thụ thai</span>
            <span>09/07 - 15/07</span>
          </div>
          <div className="cycle-info ovulation">
            <span>💗 Rụng trứng</span>
            <span>14/07/2025</span>
          </div>
        </div>
      </div>
      <div className="dashboard-main">
        <div className="dashboard-section recent-questions">
          <div className="section-header">
            <span>Câu hỏi gần đây</span>
            <a href="#" className="see-all">Xem tất cả <ArrowRight size={16} /></a>
          </div>
          <div className="empty-state">
            <div className="empty-icon"><MessageCircle size={48} /></div>
            <div>Bạn chưa đặt câu hỏi nào.</div>
            <button className="primary-btn">Đặt câu hỏi ngay</button>
          </div>
        </div>
        <div className="dashboard-section quick-actions">
          <div className="section-header">Hành động nhanh</div>
          <ul className="quick-action-list">
            <li><span role="img" aria-label="calendar">📅</span> Đặt lịch tư vấn</li>
            <li><span role="img" aria-label="test">🧪</span> Đặt lịch xét nghiệm</li>
            <li><span role="img" aria-label="question">💬</span> Đặt câu hỏi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 