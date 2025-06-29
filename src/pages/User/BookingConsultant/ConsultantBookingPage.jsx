import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import ConsultantHeader from "../../../components/User/ConsultantHeader";
import "./ConsultantBookingPage.scss"; // Updated import path

const consultants = [
  {
    id: 1,
    name: "TS. Nguyễn Thị Lan",
    specialty: "Sức khỏe tâm thần",
    experience: 18,
    rating: 5,
    price: 600000,
    desc: "Chuyên gia tâm lý tình dục hàng đầu. Tư vấn về các vấn đề tâm lý liên quan đến tình dục, hôn nhân và các rối loạn tình dục.",
  },
  {
    id: 2,
    name: "BS. Nguyễn Thị Hoa",
    specialty: "Sức khỏe sinh sản",
    experience: 12,
    rating: 4.9,
    price: 500000,
    desc: "Chuyên gia hàng đầu về sức khỏe sinh sản phụ nữ với hơn 12 năm kinh nghiệm.",
  },
  {
    id: 3,
    name: "BS. Phạm Văn Đức",
    specialty: "Kế hoạch hóa gia đình",
    experience: 15,
    rating: 4.9,
    price: 550000,
    desc: "Chuyên gia kế hoạch hóa gia đình với kinh nghiệm lâu năm.",
  },
  {
    id: 4,
    name: "BS. Trần Minh Tuấn",
    specialty: "Tư vấn STIs",
    experience: 10,
    rating: 4.8,
    price: 400000,
    desc: "Chuyên gia tư vấn các bệnh lây truyền qua đường tình dục.",
  },
  {
    id: 5,
    name: "ThS. Lê Thị Mai",
    specialty: "Giáo dục giới tính",
    experience: 10,
    rating: 4.7,
    price: 450000,
    desc: "Chuyên gia giáo dục giới tính với phương pháp tư vấn hiện đại.",
  },
];

const hours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const ConsultantBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const consultant = consultants.find((c) => c.id === Number(id));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = [
    "Tháng Một",
    "Tháng Hai",
    "Tháng Ba",
    "Tháng Tư",
    "Tháng Năm",
    "Tháng Sáu",
    "Tháng Bảy",
    "Tháng Tám",
    "Tháng Chín",
    "Tháng Mười",
    "Tháng Mười Một",
    "Tháng Mười Hai",
  ];

  const daysOfWeek = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPrevMonth: true,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
      });
    }

    // Next month days to fill the grid
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day, isCurrentMonth) => {
    if (isCurrentMonth) {
      setSelectedDate(day);
      // Format date for navigation
      const year = currentYear;
      const month = String(currentMonth + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const formattedDate = `${year}-${month}-${dayStr}`;
      console.log("Selected date:", formattedDate);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      const year = currentYear;
      const month = String(currentMonth + 1).padStart(2, "0");
      const dayStr = String(selectedDate).padStart(2, "0");
      const formattedDate = `${year}-${month}-${dayStr}`;
      navigate(
        `/user/booking/${consultant.id}/confirm?date=${formattedDate}&hour=${selectedTime}`
      );
    }
  };

  if (!consultant)
    return <div className="error">Không tìm thấy chuyên gia.</div>;

  const calendarDays = generateCalendarDays();

  return (
    <div className="consultant-booking-page">
      <ConsultantHeader activeStep={2} />

      <div className="booking-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          &lt; Quay lại
        </button>

        <div className="consultant-card">
          <div className="consultant-info">
            <div className="consultant-avatar">
              <span role="img" aria-label="consultant">
                👩‍⚕️
              </span>
            </div>
            <div className="consultant-details">
              <div className="consultant-name">{consultant.name}</div>
              <div className="consultant-specialty">{consultant.specialty}</div>
              <div className="consultant-meta">
                ⭐ {consultant.rating} | {consultant.experience} năm kinh nghiệm
              </div>
              <div className="consultant-price">
                {consultant.price.toLocaleString()}đ/giờ
              </div>
            </div>
          </div>
          <div className="consultant-description">{consultant.desc}</div>
        </div>

        <div className="booking-details">
          <div className="date-section">
            <h3>📅 Chọn ngày tư vấn</h3>
            <div className="calendar">
              <div className="calendar-header">
                <button onClick={handlePrevMonth} className="nav-btn">
                  <ChevronLeft size={20} />
                </button>
                <span className="month-year">
                  {months[currentMonth]} {currentYear}
                </span>
                <button onClick={handleNextMonth} className="nav-btn">
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="calendar-grid">
                <div className="weekdays">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="weekday">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="days-grid">
                  {calendarDays.map((dateObj, index) => (
                    <button
                      key={index}
                      className={`day ${
                        !dateObj.isCurrentMonth ? "other-month" : ""
                      } ${
                        selectedDate === dateObj.day && dateObj.isCurrentMonth
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleDateSelect(dateObj.day, dateObj.isCurrentMonth)
                      }
                    >
                      {dateObj.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="time-section">
            <h3>🕐 Chọn giờ tư vấn</h3>
            {selectedDate ? (
              <div className="time-slots">
                {hours.map((time) => (
                  <button
                    key={time}
                    className={`time-slot ${
                      selectedTime === time ? "selected" : ""
                    }`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="time-placeholder">
                <Clock size={48} className="clock-icon" />
                <p>Vui lòng chọn ngày trước</p>
              </div>
            )}
          </div>
        </div>
        <button
          className={`continue-button ${
            !selectedDate || !selectedTime ? "disabled" : ""
          }`}
          disabled={!selectedDate || !selectedTime}
          onClick={handleContinue}
        >
          Tiếp tục với lịch hẹn này
        </button>
      </div>
    </div>
  );
};

export default ConsultantBookingPage;
