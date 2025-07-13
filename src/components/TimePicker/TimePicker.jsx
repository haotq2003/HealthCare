import React, { useState } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import './TimePicker.scss';

const pad = (n) => n.toString().padStart(2, '0');

const TimePicker = ({ value, onChange, placeholder, disabled }) => {
  // Parse value ("HH:mm:ss") to Date
  const parseValue = (val) => {
    if (!val) return new Date(2000, 0, 1, 12, 0, 0);
    const [h, m, s] = val.split(':').map(Number);
    return new Date(2000, 0, 1, h, m, s || 0);
  };

  const initialDate = parseValue(value);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(initialDate);
  const [ampm, setAMPM] = useState(initialDate.getHours() >= 12 ? 'PM' : 'AM');

  // Khi chọn trên đồng hồ
  const handleClockChange = (d) => {
    setDate(d);
  };

  // Khi chọn AM/PM
  const handleAMPMChange = (e) => {
    setAMPM(e.target.value);
  };

  // Khi xác nhận
  const handleDone = () => {
    let hour = date.getHours();
    let minute = date.getMinutes();
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    const timeStr = `${pad(hour)}:${pad(minute)}:00`;
    onChange && onChange(timeStr);
    setShow(false);
  };

  // Hiển thị lên input
  const display = value
    ? (() => {
        const d = parseValue(value);
        let h = d.getHours();
        const m = d.getMinutes();
        const p = h >= 12 ? 'PM' : 'AM';
        if (h === 0) h = 12;
        if (h > 12) h = h - 12;
        return `${pad(h)}:${pad(m)} ${p}`;
      })()
    : (placeholder || 'Chọn giờ');

  // Khi mở picker, sync lại state
  const handleOpen = () => {
    const d = parseValue(value);
    setDate(d);
    setAMPM(d.getHours() >= 12 ? 'PM' : 'AM');
    setShow(true);
  };

  return (
    <div className="time-picker-container">
      <div className={`time-picker-input${show ? ' active' : ''}`} onClick={() => !disabled && handleOpen()}>
        <span className="time-display">{display}</span>
        <span className="time-picker-arrow">▼</span>
      </div>
      {show && (
        <div className="time-picker-dropdown" style={{zIndex: 1000}}>
          <Clock
            value={date}
            onChange={handleClockChange}
            renderNumbers
            hourHandWidth={6}
            minuteHandWidth={4}
            hourMarksWidth={2}
            minuteMarksWidth={1}
            className="react-clock-custom"
          />
          <div className="ampm-row">
            <select value={ampm} onChange={handleAMPMChange} className="ampm-select">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
            <button className="confirm-button" onClick={handleDone}>OK</button>
            <button className="cancel-button" onClick={() => setShow(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker; 