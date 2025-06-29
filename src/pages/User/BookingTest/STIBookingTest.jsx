import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import TestBookingHeader from './TestBookingHeader';
import './STIBookingTest.scss';

const STIBookingTest = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

  const months = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
  ];

  const daysOfWeek = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];

  const timeSlots = [
    "08:00",
    "09:00", 
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

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
        isPrevMonth: true
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false
      });
    }
    
    // Next month days to fill the grid
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false
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
      setSelectedTime(null); // Reset time when date changes
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      // Navigate to confirmation page with selected date and time
      const year = currentYear;
      const month = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(selectedDate).padStart(2, '0');
      const formattedDate = `${year}-${month}-${dayStr}`;
      navigate(`/user/test-booking/confirm?date=${formattedDate}&time=${selectedTime}`);
    }
  };

  const handleBack = () => {
    navigate('/user/test-booking');
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="sti-booking-app">
      <div className="content">
        <TestBookingHeader 
          title="Chọn lịch hẹn xét nghiệm"
          description="Chọn ngày và giờ phù hợp để thực hiện xét nghiệm"
          activeStep={2}
        />
        
        <div className="sti-booking-sub-header">
          <div className="sti-booking-sub-header-content">
            <ChevronLeft className="sti-back-icon" onClick={handleBack} />
            <h1>Tóm tắt đặt lịch</h1>
            <span className="sti-back-text" onClick={handleBack}>Quay lại</span>
          </div>
        </div>
        
        <div className="booking-summary">
          <div className="test-item">
            <div className="test-info">
              <div className="test-icon">
                <div className="icon-circle">
                  <span>🧪</span>
                </div>
              </div>
              <div className="test-details">
                <h3>Gói xét nghiệm STIs toàn diện</h3>
                <div className="duration">
                  <Clock size={16} />
                  <span>45 phút</span>
                </div>
              </div>
            </div>
            <div className="test-price">
              <span className="price">800k</span>
              <span className="currency">VNĐ</span>
            </div>
          </div>

          <div className="test-item">
            <div className="test-info">
              <div className="test-icon">
                <div className="icon-circle">
                  <span>🧪</span>
                </div>
              </div>
              <div className="test-details">
                <h3>Gói xét nghiệm STIs cơ bản</h3>
                <div className="duration">
                  <Clock size={16} />
                  <span>30 phút</span>
                </div>
              </div>
            </div>
            <div className="test-price">
              <span className="price">450k</span>
              <span className="currency">VNĐ</span>
            </div>
          </div>

          <div className="total">
            <span>Tổng cộng:</span>
            <span className="total-price">1.250k VNĐ</span>
          </div>
        </div>

        <div className="booking-details">
          <div className="date-section">
            <h3>📅 Chọn ngày xét nghiệm</h3>
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
                  {daysOfWeek.map(day => (
                    <div key={day} className="weekday">{day}</div>
                  ))}
                </div>
                
                <div className="days-grid">
                  {calendarDays.map((dateObj, index) => (
                    <button
                      key={index}
                      className={`day ${!dateObj.isCurrentMonth ? 'other-month' : ''} ${
                        selectedDate === dateObj.day && dateObj.isCurrentMonth ? 'selected' : ''
                      }`}
                      onClick={() => handleDateSelect(dateObj.day, dateObj.isCurrentMonth)}
                    >
                      {dateObj.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="time-section">
            <h3>🕐 Chọn giờ xét nghiệm</h3>
            {selectedDate ? (
              <div className="time-slots">
                {timeSlots.map(time => (
                  <button 
                    key={time} 
                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
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
            className={`continue-button ${!selectedDate || !selectedTime ? 'disabled' : ''}`}
            disabled={!selectedDate || !selectedTime}
            onClick={handleContinue}
          >
            Tiếp tục với lịch hẹn này
          </button>
      </div>
    </div>
  );
};

export default STIBookingTest;
