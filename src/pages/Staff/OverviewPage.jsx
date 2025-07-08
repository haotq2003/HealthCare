import React from "react";
import "./DashboardPage.scss";
import { Calendar } from "lucide-react";

const OverviewPage = () => {
  return (
    <div className="hc-overview-page">
      <div className="hc-overview-header">
        <h2 className="hc-overview-title">Tổng quan quản lý thời gian</h2>
        <div className="hc-overview-date"><Calendar className="hc-overview-icon" size={18} /> Hôm nay là Thứ Hai, 07/07/2025</div>
        <button className="hc-overview-create-slot-btn">+ Tạo slot mới</button>
      </div>
      <div className="hc-overview-stats">
        <div className="hc-overview-stat-card">
          <div className="hc-overview-stat-title">Slot hôm nay</div>
          <div className="hc-overview-stat-value">0</div>
        </div>
        <div className="hc-overview-stat-card">
          <div className="hc-overview-stat-title">Slot có sẵn</div>
          <div className="hc-overview-stat-value">0</div>
        </div>
        <div className="hc-overview-stat-card">
          <div className="hc-overview-stat-title">Đã được đặt</div>
          <div className="hc-overview-stat-value">0</div>
        </div>
        <div className="hc-overview-stat-card">
          <div className="hc-overview-stat-title">Gói xét nghiệm</div>
          <div className="hc-overview-stat-value">6</div>
        </div>
      </div>
      <div className="hc-overview-main">
        <div className="hc-overview-today-slots">
          <div className="hc-overview-today-slots-title">Slot hôm nay (0)</div>
          <div className="hc-overview-today-slots-empty">Không có slot nào hôm nay</div>
        </div>
        <div className="hc-overview-work-summary">
          <div className="hc-overview-work-summary-title">Tổng quan lịch làm việc</div>
          <ul className="hc-overview-work-summary-list">
            <li className="hc-overview-badge">Gói xét nghiệm tổng quát cơ bản</li>
            <li className="hc-overview-badge">Gói xét nghiệm tim mạch</li>
            <li className="hc-overview-badge">Gói xét nghiệm tiểu đường</li>
            <li className="hc-overview-badge">Gói xét nghiệm chức năng gan</li>
            <li className="hc-overview-badge">Gói xét nghiệm ung thư phổi</li>
            <li className="hc-overview-badge">Gói xét nghiệm vitamin tổng hợp</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage; 