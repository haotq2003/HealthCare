import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Clock, Coins } from "lucide-react";
import "./STIBookingConfirmPage.scss";

const getWeekday = (dateStr) => {
  const weekdays = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const d = new Date(dateStr);
  return weekdays[d.getDay()];
};

const STIBookingConfirmPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const date = params.get("date");
  const time = params.get("time");
  // Giả lập tổng chi phí, bạn có thể lấy từ state hoặc API nếu cần
  const totalPrice = "1.250k VND";

  // Form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gửi dữ liệu đặt lịch lên server
    alert("Đặt lịch thành công! (Demo)");
    navigate("/user/test-booking");
  };

  return (
    <div className="sti-booking-wrapper">
      <div className="sti-booking-content">
        <h1 className="sti-booking-title">
          Đặt lịch xét nghiệm STIs
        </h1>
        <p className="sti-booking-subtitle">
          Chọn các xét nghiệm phù hợp và đặt lịch thực hiện với quy trình chuyên nghiệp
        </p>
        
        <div className="sti-booking-stepper-wrapper">
          <div className="sti-booking-stepper">
            <div className="sti-booking-step">
              <div className="sti-booking-step-number active">1</div>
              <div className="sti-booking-step-label active">Chọn xét nghiệm</div>
            </div>
            <div className="sti-booking-step-connector active" />
            <div className="sti-booking-step">
              <div className="sti-booking-step-number active">2</div>
              <div className="sti-booking-step-label active">Chọn lịch hẹn</div>
            </div>
            <div className="sti-booking-step-connector active" />
            <div className="sti-booking-step">
              <div className="sti-booking-step-number active">3</div>
              <div className="sti-booking-step-label active">Xác nhận</div>
            </div>
          </div>
        </div>

        <div className="sti-booking-header">
          <div className="sti-booking-header-title">Thông tin đặt lịch xét nghiệm</div>
          <button 
            className="sti-booking-back-btn" 
            onClick={() => navigate(-1)}
          >
            Quay lại
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sti-booking-form">
          {/* Thông tin đặt lịch */}
          <div className="sti-booking-info-row">
            <div className="sti-booking-info-item">
              <Calendar size={20} className="sti-booking-icon" />
              <span className="sti-booking-info-value">
                {date ? new Date(date).toLocaleDateString("vi-VN") : "--/--/----"}
              </span>
              <span className="sti-booking-info-meta">
                {date ? getWeekday(date) : ""}
              </span>
            </div>
            <div className="sti-booking-info-item">
              <Clock size={20} className="sti-booking-icon" />
              <span className="sti-booking-info-value">{time || "--:--"}</span>
              <span className="sti-booking-info-meta">Giờ xét nghiệm</span>
            </div>
            <div className="sti-booking-info-item">
              <Coins size={20} className="sti-booking-icon" />
              <span className="sti-booking-info-value">{totalPrice}</span>
              <span className="sti-booking-info-meta">Tổng chi phí</span>
            </div>
          </div>

          {/* Form nhập thông tin */}
          <div className="sti-booking-form-row">
            <div className="sti-booking-form-group">
              <label className="sti-booking-label">Họ và tên *</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                placeholder="Nhập họ và tên" 
                className="sti-booking-input"
              />
            </div>
            <div className="sti-booking-form-group">
              <label className="sti-booking-label">Số điện thoại *</label>
              <input 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                required 
                placeholder="Nhập số điện thoại" 
                className="sti-booking-input"
              />
            </div>
          </div>

          <div className="sti-booking-form-row">
            <div className="sti-booking-form-group">
              <label className="sti-booking-label">Email</label>
              <input 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                type="email" 
                placeholder="Nhập email" 
                className="sti-booking-input"
              />
            </div>
            <div className="sti-booking-form-group sti-booking-form-group--small">
              <label className="sti-booking-label">Tuổi</label>
              <input 
                name="age" 
                value={form.age} 
                onChange={handleChange} 
                type="number" 
                min="0" 
                placeholder="Nhập tuổi" 
                className="sti-booking-input"
              />
            </div>
          </div>

          <div className="sti-booking-form-group sti-booking-form-group--full">
            <label className="sti-booking-label">Giới tính</label>
            <select 
              name="gender" 
              value={form.gender} 
              onChange={handleChange} 
              className="sti-booking-select"
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="sti-booking-form-group sti-booking-form-group--full">
            <label className="sti-booking-label">Ghi chú đặc biệt</label>
            <textarea 
              name="note" 
              value={form.note} 
              onChange={handleChange} 
              placeholder="Thông tin bổ sung về tình trạng sức khỏe hoặc yêu cầu đặc biệt" 
              className="sti-booking-textarea"
            />
          </div>

          {/* Lưu ý */}
          <div className="sti-booking-notice">
            <b>Lưu ý quan trọng:</b>
            <ul className="sti-booking-notice-list">
              <li>Vui lòng đến đúng giờ hẹn</li>
              <li>Mang theo CMND/CCCD và thông tin bảo hiểm (nếu có)</li>
              <li>Tuân thủ hướng dẫn chuẩn bị cho từng loại xét nghiệm</li>
              <li>Liên hệ trước nếu cần thay đổi lịch hẹn</li>
            </ul>
          </div>

          <div className="sti-booking-form-actions">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="sti-booking-btn sti-booking-btn--secondary"
            >
              Quay lại
            </button>
            <button 
              type="submit" 
              className="sti-booking-btn sti-booking-btn--primary"
            >
              Xác nhận đặt lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default STIBookingConfirmPage;