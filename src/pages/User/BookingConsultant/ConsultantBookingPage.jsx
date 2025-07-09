import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import ConsultantHeader from "../../../components/User/ConsultantHeader";
import "./ConsultantBookingPage.scss"; // Updated import path
import { ConsultantService } from "../../../services/ConsultantService";
import { SlotService } from "../../../services/SlotService";



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
 
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [availableSlots, setAvailableSlots] = useState([]);

 const [loading, setLoading] = useState(true);
 
  const [consultant, setConsultant] = useState(null);
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
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; 
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

  const handleDateSelect = async (day, isCurrentMonth) => {
  if (isCurrentMonth) {
    setSelectedDate(day);

    const year = currentYear;
    const month = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const formattedDate = `${year}-${month}-${dayStr}`;
    console.log("Selected date:", formattedDate);

    try {
      const res = await SlotService.getSlotByDateAndConsultant(consultant.id, formattedDate);
      console.log("Available slots:", res);
      setAvailableSlots(res.data.items); // Update state
    } catch (err) {
      console.error("Lỗi khi lấy slot:", err);
      setAvailableSlots([]); // Clear on error
    }
  }
};


  const handleTimeSelect = (slot) => {
    setSelectedTime(slot);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      const year = currentYear;
      const month = String(currentMonth + 1).padStart(2, "0");
      const dayStr = String(selectedDate).padStart(2, "0");
      const formattedDate = `${year}-${month}-${dayStr}`;
      navigate(
      `/user/booking/${consultant.id}/confirm?date=${formattedDate}&hour=${selectedTime.id}&slotId=${selectedTime.id}&slotStart=${selectedTime.slotStart}&slotEnd=${selectedTime.slotEnd}`
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
              <div className="consultant-name">{consultant?.fullName}</div>
              <div className="consultant-specialty">{consultant?.bio}</div>
              <div className="consultant-meta">
                ⭐ {consultant.rating} | {consultant?.experienceYears} năm kinh nghiệm
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
  {availableSlots.length === 0 ? (
    <p>🚫 Không có khung giờ trống cho ngày này.</p>
  ) : (
    availableSlots.map((slot) => (
      <button
        key={slot.id}
        className={`time-slot ${
          selectedTime?.id === slot.id ? "selected" : ""
        }`}
        onClick={() => handleTimeSelect(slot)}
        disabled={slot.isBooked}
      >
        {slot.slotStart.slice(0, 5)} - {slot.slotEnd.slice(0, 5)}
      </button>
    ))
  )}
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
