import React, { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Clock, Coins, AlertCircle, CheckCircle } from "lucide-react";
import "./STIBookingConfirmPage.scss";
import { API_URL } from '../../../config/apiURL';
import { formatVietnameseCurrencyVND } from '../../../utils/currencyFormatter';

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
  const selectedTest = location.state?.selectedTest;
  const healthTestName = location.state?.healthTestName;
  const healthTestId = location.state?.id;
  const slotId = location.state?.slotId;
  const slotDate = location.state?.slotDate;
  const slotTime = location.state?.slotTime;
  // Giả lập tổng chi phí, bạn có thể lấy từ state hoặc API nếu cần
  const totalPrice = formatVietnameseCurrencyVND(selectedTest?.price || 1250000);
const genderMap = {
  Male: "Nam",
  Female: "Nữ",
  Other: "Khác",
};

  // Lấy currentUser từ localStorage
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser'));
    } catch {
      return null;
    }
  })();

  const getAge = (dob) => {
    if (!dob) return '';
    const birthYear = new Date(dob).getFullYear();
    const nowYear = new Date().getFullYear();
    return nowYear - birthYear;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTest || !slotId || !currentUser?.id) {
      Swal.fire('Lỗi', 'Thiếu thông tin xét nghiệm hoặc slot!', 'error');
      return;
    }
    try {
      const confirm = await Swal.fire({
        title: 'Xác nhận đặt lịch',
        text: 'Bạn có chắc chắn muốn đặt lịch xét nghiệm với thông tin này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
      });
      if (!confirm.isConfirmed) return;
      const res = await fetch(`${API_URL}/api/TestSlots/${slotId}/booking`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookedByUserId: currentUser.id })
      });
 if (res.ok) {
  console.log("✅ Booking Success - Details:");
  console.table({
    userId: currentUser.id,
    userName: currentUser.fullName,
    testName: selectedTest?.name || healthTestName,
    testId: healthTestId,
    slotId,
    slotDate,
    slotTime,
    price: selectedTest?.price || 'Không xác định'
  });


  const paymentRes = await fetch("https://localhost:7276/api/VnPay/create-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: selectedTest?.price || 0,
      userId: currentUser.id,
      serviceId: slotId
    })
  });

  if (paymentRes.ok) {
    const paymentData = await paymentRes.json();
if (paymentData?.paymentUrl) {
     
      window.location.href = paymentData.paymentUrl;
    } else {
      Swal.fire('Lỗi', 'Không nhận được link thanh toán.', 'error');
    }
    
    navigate(`/user/payment/success?amount=${selectedTest?.price}&userId=${currentUser.id}&serviceId=${slotId}`);
  } else {
    Swal.fire('Thanh toán thất bại', 'Không thể xử lý thanh toán', 'error');
  }
}

else {
        Swal.fire('Lỗi', 'Đặt lịch thất bại!', 'error');
      }
    } catch (err) {
      Swal.fire('Lỗi', 'Không thể kết nối máy chủ!', 'error');
    }
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
              <span className="sti-booking-info-meta">Ngày xét nghiệm</span>
              <span className="sti-booking-info-value">{slotDate ? new Date(slotDate).toLocaleDateString("vi-VN") : "--/--/----"}</span>
            </div>
            <div className="sti-booking-info-item">
              <Clock size={20} className="sti-booking-icon" />
              <span className="sti-booking-info-meta">Giờ xét nghiệm</span>
              <span className="sti-booking-info-value">{slotTime || "--:--"}</span>
            </div>
            <div className="sti-booking-info-item">
              <Coins size={20} className="sti-booking-icon" />
              <span className="sti-booking-info-meta">Tổng chi phí</span>
              <span className="sti-booking-info-value">{totalPrice}</span>
            </div>
            <div className="sti-booking-info-item">
              <span className="sti-booking-info-meta">Tên gói xét nghiệm</span>
              <span className="sti-booking-info-value">{healthTestName || selectedTest?.name || '--'}</span>
            </div>
            <div className="sti-booking-info-item">
              <span className="sti-booking-info-meta">Thời lượng</span>
              <span className="sti-booking-info-value">{selectedTest?.time || (selectedTest?.slotDurationInMinutes ? `${selectedTest.slotDurationInMinutes} phút` : '--')}</span>
            </div>
          </div>

          {/* Form nhập thông tin */}
          <div className="sti-booking-form-row">
            <div className="sti-booking-form-group">
              <label className="sti-booking-label">Họ và tên *</label>
              <input 
                value={currentUser?.fullName || ''}
                disabled
                className="sti-booking-input"
              />
            </div>
            <div className="sti-booking-form-group">
              <label className="sti-booking-label">Số điện thoại *</label>
              <input 
                value={currentUser?.phoneNumber || ''}
                disabled
                className="sti-booking-input"
              />
            </div>
          </div>

          <div className="sti-booking-form-row">
            <div className="sti-booking-form-group">
              <label className="sti-booking-label">Email</label>
              <input 
                value={currentUser?.email || ''}
                disabled
                className="sti-booking-input"
              />
            </div>
            <div className="sti-booking-form-group sti-booking-form-group--small">
              <label className="sti-booking-label">Tuổi</label>
              <input 
                value={getAge(currentUser?.dateOfBirth)}
                disabled
                className="sti-booking-input"
              />
            </div>
          </div>

          {/* <div className="sti-booking-form-group sti-booking-form-group--full">
            <label className="sti-booking-label">Giới tính</label>
            <input
          value={genderMap[currentUser?.gender] || ''}

              disabled
              className="sti-booking-input"
            />
          </div> */}

        

          {/* Lưu ý */}
          <div className="sti-booking-notice">
            <b style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}><AlertCircle size={20} style={{ color: '#f59e42' }} /></span>
              Lưu ý quan trọng:
            </b>
            <ul className="sti-booking-notice-list">
              <li><span style={{color:'#10b981',marginRight:6,verticalAlign:'middle'}}><CheckCircle size={16}/></span>Vui lòng đến đúng giờ hẹn</li>
              <li><span style={{color:'#10b981',marginRight:6,verticalAlign:'middle'}}><CheckCircle size={16}/></span>Mang theo CMND/CCCD và thông tin bảo hiểm (nếu có)</li>
              <li><span style={{color:'#10b981',marginRight:6,verticalAlign:'middle'}}><CheckCircle size={16}/></span>Tuân thủ hướng dẫn chuẩn bị cho từng loại xét nghiệm</li>
              <li><span style={{color:'#10b981',marginRight:6,verticalAlign:'middle'}}><CheckCircle size={16}/></span>Liên hệ trước nếu cần thay đổi lịch hẹn</li>
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