import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import TestBookingHeader from './TestBookingHeader';
import './STIBookingTest.scss';
import { API_URL } from '../../../config/apiURL';

const STIBookingTest = () => {
  const location = useLocation();
  const selectedTest = location.state?.selectedTest;
  const [slots, setSlots] = useState([]); // all slots for selected test
  const [validDays, setValidDays] = useState([]); // unique days with slots
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]); // slots for selected day
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const months = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
  ];

  const daysOfWeek = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];

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
        isValid: false
      });
    }
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        isValid: validDays.includes(day)
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
        isValid: false
      });
    }
    return days;
  };

  // Fetch slots for the selected test
  useEffect(() => {
    if (!selectedTest) return;
    const fetchSlots = async () => {
      try {
        const res = await fetch(`${API_URL}/api/TestSlots?page=1&size=1000`);
        const data = await res.json();
        if (data && data.data && data.data.items) {
          // Filter slots for selected test and not booked
          const filtered = data.data.items.filter(slot => slot.healthTestId === selectedTest.id && !slot.isBooked);
          setSlots(filtered);
          // Extract unique valid days in current month/year
          const validDates = filtered
            .map(slot => new Date(slot.testDate))
            .filter(date => date.getMonth() === currentMonth && date.getFullYear() === currentYear)
            .map(date => date.getDate());
          setValidDays([...new Set(validDates)]);
        } else {
          setSlots([]);
          setValidDays([]);
        }
      } catch (err) {
        setSlots([]);
        setValidDays([]);
      }
    };
    fetchSlots();
  }, [selectedTest, currentMonth, currentYear]);

  // Update available slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      setSelectedSlotId(null);
      setSelectedTime(null);
      return;
    }
    // Find slots for selected date
    const slotsForDay = slots.filter(slot => {
      const date = new Date(slot.testDate);
      return date.getDate() === selectedDate && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    // Sort slots by slotStart ascending
    slotsForDay.sort((a, b) => a.slotStart.localeCompare(b.slotStart));
    setAvailableSlots(slotsForDay);
    setSelectedSlotId(null);
    setSelectedTime(null);
  }, [selectedDate, slots, currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
    setAvailableSlots([]);
    setSelectedSlotId(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
    setAvailableSlots([]);
    setSelectedSlotId(null);
    setSelectedTime(null);
  };

  const handleDateSelect = (day, isCurrentMonth, isValid) => {
    if (isCurrentMonth && isValid) {
      setSelectedDate(day);
    }
  };

  const handleTimeSelect = (slot) => {
    setSelectedSlotId(slot.id);
    setSelectedTime(slot.slotStart.substring(0,5)); // e.g. '09:00'
  };

  const handleContinue = () => {
    if (selectedSlotId) {
      const slot = availableSlots.find(s => s.id === selectedSlotId);
      navigate(`/user/test-booking/confirm?price=${selectedTest.price}`, {
        state: {
          selectedTest,
          healthTestName: selectedTest.name,
          id: selectedTest.id,
          slotId: selectedSlotId,
          slotDate: slot.testDate,
          slotTime: slot.slotStart.substring(0,5)
        }
      });
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
          {selectedTest ? (
            <div className="test-item">
              <div className="test-info">
                <div className="test-icon">
                  <div className="icon-circle">
                    <span>🧪</span>
                  </div>
                </div>
                <div className="test-details">
                  <h3>{selectedTest.name}</h3>
                  <div className="duration">
                    <Clock size={16} />
                    <span>{selectedTest.time}</span>
                  </div>
                </div>
              </div>
              <div className="test-price">
                <span className="price">{selectedTest.price}k</span>
                <span className="currency">VNĐ</span>
              </div>
            </div>
          ) : (
            <div>Không có thông tin xét nghiệm được chọn.</div>
          )}
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
                        selectedDate === dateObj.day && dateObj.isCurrentMonth && dateObj.isValid ? 'selected' : ''
                      } ${dateObj.isCurrentMonth && !dateObj.isValid ? 'disabled' : ''}`}
                      onClick={() => handleDateSelect(dateObj.day, dateObj.isCurrentMonth, dateObj.isValid)}
                      disabled={!dateObj.isCurrentMonth || !dateObj.isValid}
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
                {availableSlots.length > 0 ? availableSlots.map(slot => (
                  <button 
                    key={slot.id} 
                    className={`time-slot ${selectedSlotId === slot.id ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    {slot.slotStart.substring(0,5)} - {slot.slotEnd.substring(0,5)}
                  </button>
                )) : <div>Không có khung giờ khả dụng.</div>}
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
          className={`continue-button ${!selectedSlotId ? 'disabled' : ''}`}
          disabled={!selectedSlotId}
          onClick={handleContinue}
        >
          Tiếp tục với lịch hẹn này
        </button>
      </div>
    </div>
  );
};

export default STIBookingTest;
