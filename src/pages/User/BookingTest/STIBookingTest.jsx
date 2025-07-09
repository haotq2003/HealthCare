import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import TestBookingHeader from './TestBookingHeader';
import './STIBookingTest.scss';
import { API_URL } from '../../../config/apiURL';

const STIBookingTest = () => {
  const location = useLocation();
  const selectedTest = location.state?.selectedTest;
  const [schedules, setSchedules] = useState([]);
  const [validDays, setValidDays] = useState([]); // days allowed for booking
  const [slots, setSlots] = useState([]); // time slots for selected day
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [bookedSlots, setBookedSlots] = useState([]);

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

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch(`${API_URL}/api/HealthTestSchedule`);
        const data = await res.json();
        setSchedules(data);
      } catch (err) {
        setSchedules([]);
      }
    };
    fetchSchedules();
  }, []);

  // Find schedule for selected test
  const testSchedule = schedules.find(s => s.healthTestId === selectedTest?.id);

  // Helper: get all valid dates in current month for this test
  useEffect(() => {
    if (!testSchedule) { setValidDays([]); return; }
    const start = new Date(testSchedule.startDate);
    const end = new Date(testSchedule.endDate);
    const allowedDays = testSchedule.daysOfWeek || [];
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      if (date >= start && date <= end) {
        // Map JS day (0=Sun) to API day (Mon, Tue...)
        const weekDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()];
        if (allowedDays.includes(weekDay)) {
          days.push(d);
        }
      }
    }
    setValidDays(days);
  }, [testSchedule, currentMonth, currentYear]);

  // Helper: generate slots for selected day
  useEffect(() => {
    if (!testSchedule || !selectedDate) { setSlots([]); return; }
    // Only allow if selectedDate is valid
    if (!validDays.includes(selectedDate)) { setSlots([]); return; }
    // Parse slotStart, slotEnd
    const [startH, startM, startS] = testSchedule.slotStart.split(':').map(Number);
    const [endH, endM, endS] = testSchedule.slotEnd.split(':').map(Number);
    const start = new Date(2000,1,1,startH,startM,startS||0);
    const end = new Date(2000,1,1,endH,endM,endS||0);
    const duration = testSchedule.slotDurationInMinutes;
    const slotsArr = [];
    let cur = new Date(start);
    while (cur < end) {
      const next = new Date(cur.getTime() + duration*60000);
      if (next > end) break;
      const hh = String(cur.getHours()).padStart(2,'0');
      const mm = String(cur.getMinutes()).padStart(2,'0');
      // Check if this slot is already booked for this test and date
      const slotDateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(selectedDate).padStart(2,'0')}`;
      const isBooked = bookedSlots.some(slot =>
        slot.testDate.startsWith(slotDateStr) &&
        slot.slotStart === `${hh}:${mm}:00` &&
        slot.healthTestId === selectedTest.id
      );
      if (!isBooked) {
        slotsArr.push(`${hh}:${mm}`);
      }
      cur = next;
    }
    setSlots(slotsArr);
  }, [testSchedule, selectedDate, validDays, bookedSlots, currentMonth, currentYear]);

  // Fetch booked slots for the selected test
  useEffect(() => {
    if (!selectedTest) return;
    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(`${API_URL}/api/TestSlots?page=1&size=100`);
        const data = await res.json();
        if (data && data.data && data.data.items) {
          setBookedSlots(data.data.items.filter(slot => slot.healthTestId === selectedTest.id));
        } else {
          setBookedSlots([]);
        }
      } catch (err) {
        setBookedSlots([]);
      }
    };
    fetchBookedSlots();
  }, [selectedTest]);

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

  const handleDateSelect = (day, isCurrentMonth, isValid) => {
    if (isCurrentMonth && isValid) {
      setSelectedDate(day);
      setSelectedTime(null); // Reset time when date changes
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      const year = currentYear;
      const month = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(selectedDate).padStart(2, '0');
      const formattedDate = `${year}-${month}-${dayStr}`;
      navigate(`/user/test-booking/confirm?date=${formattedDate}&time=${selectedTime}`, { state: { selectedTest, healthTestName: selectedTest.name, id: selectedTest.id } });
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
                {slots.length > 0 ? slots.map(time => (
                  <button 
                    key={time} 
                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
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
