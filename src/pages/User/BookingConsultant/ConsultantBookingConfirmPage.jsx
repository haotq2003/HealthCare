import React, { use, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ConsultantHeader from "../../../components/User/ConsultantHeader";
import "./ConsultantBookingConfirmPage.scss";
import { ConsultantService } from "../../../services/ConsultantService";
import toast from "react-hot-toast";




function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ConsultantBookingConfirmPage = () => {
  const [consultants, setConsultants] = useState([]);
  const { id } = useParams();
  const query = useQuery();
  const navigate = useNavigate();
const [consultant, setConsultant] = useState(null);
  const date = query.get("date");
  const hour = query.get("slotStart");
  const slotId = query.get("hour"); // Lấy slotId từ query parameter
  const [loading,setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    reason: "",
  });
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    const fetchConsultant = async () => {
      try {
        const res = await ConsultantService.getConsultantDetail(id); 
        console.log(res)
        setConsultant(res);
      } catch (error) {
        console.error("Không lấy được thông tin bác sĩ", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchConsultant();
  }, [id]);

  if (!consultant || !date || !hour) {
    return <div className="error-message">Thiếu thông tin đặt lịch.</div>;
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    try {
      // Gọi API createConsultation với slotId và reason
      await ConsultantService.createConsultation(slotId, form.reason);
      
      toast.success("Đặt lịch thành công!");
      navigate("/user/booking");
    } catch (error) {
      console.error("Lỗi khi đặt lịch:", error);
      toast.error("Đặt lịch thất bại. Vui lòng thử lại!");
      setSubmitted(false);
    }
  };



  return (
    <div className="consultant-booking-confirm-container">
      <ConsultantHeader activeStep={3} />
      
      <div className="consultant-booking-confirm-header-section">
        <div className="consultant-booking-confirm-header-content">
          <h1 className="consultant-booking-confirm-page-title">Xác nhận đặt lịch</h1>
          <p className="consultant-booking-confirm-page-subtitle">Vui lòng xác nhận thông tin và hoàn tất đặt lịch tư vấn</p>
        </div>
      </div>
      
      <div className="consultant-booking-confirm-main-content">
        <div className="consultant-booking-confirm-booking-card">
          <div className="consultant-booking-confirm-appointment-info">
            <div className="consultant-booking-confirm-card-header">
              <div className="consultant-booking-confirm-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L14 2L16 4C15.39 4 14.78 4.07 14.19 4.2L12.91 2.92C12.39 2.4 11.61 2.4 11.09 2.92L9.81 4.2C9.22 4.07 8.61 4 8 4L10 2L9 1L3 7V9H21Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="consultant-booking-confirm-card-title">Chi tiết lịch hẹn</h3>
            </div>

            <div className="consultant-booking-confirm-consultant-card">
              <div className="consultant-booking-confirm-consultant-avatar">
                {consultant?.fullName}
              </div>
              <div className="consultant-booking-confirm-consultant-details">
                <h4 className="consultant-booking-confirm-consultant-name">{consultant?.fullName}</h4>
                <p className="consultant-booking-confirm-consultant-specialty">{consultant?.bio}</p>
              </div>
            </div>

            <div className="consultant-booking-confirm-appointment-details">
              <div className="consultant-booking-confirm-detail-item">
                <div className="consultant-booking-confirm-detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="consultant-booking-confirm-detail-content">
                  <span className="consultant-booking-confirm-detail-label">Ngày hẹn</span>
                  <span className="consultant-booking-confirm-detail-value">{new Date(date).toLocaleDateString("vi-VN", { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>

              <div className="consultant-booking-confirm-detail-item">
                <div className="consultant-booking-confirm-detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <div className="consultant-booking-confirm-detail-content">
                  <span className="consultant-booking-confirm-detail-label">Giờ hẹn</span>
                  <span className="consultant-booking-confirm-detail-value">{hour}</span>
                </div>
              </div>

              
            </div>
          </div>

          <div className="consultant-booking-confirm-form-section">
            <div className="consultant-booking-confirm-card-header">
              <div className="consultant-booking-confirm-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3 className="consultant-booking-confirm-card-title">Thông tin cá nhân</h3>
            </div>

         <form className="consultant-booking-confirm-user-form" onSubmit={handleSubmit}>
  <div className="consultant-booking-confirm-form-group">
    <label htmlFor="reason">Lý do tư vấn</label>
    <div className="consultant-booking-confirm-input-wrapper">
      <textarea
        id="reason"
        name="reason"
        value={form.reason}
        onChange={handleChange}
        placeholder="Mô tả ngắn gọn vấn đề của bạn để chuyên gia chuẩn bị tốt hơn..."
        className="consultant-booking-confirm-form-textarea"
        required
      />
    </div>
  </div>

  <div className="consultant-booking-confirm-form-actions">
    <button
      type="submit"
      className={`consultant-booking-confirm-submit-button ${submitted ? 'consultant-booking-confirm-loading' : ''}`}
      disabled={submitted}
    >
      {submitted ? (
        <>
          <div className="consultant-booking-confirm-spinner"></div>
          Đang xử lý...
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
          Xác nhận đặt lịch
        </>
      )}
    </button>
  </div>
</form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantBookingConfirmPage;