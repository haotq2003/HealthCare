import React, { useState, useEffect, useRef } from 'react';
import './CustomClockPicker.scss';

const pad = n => n.toString().padStart(2, '0');

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

const getPosition = (idx, total, radius = 80) => {
  const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
  return {
    left: `${50 + radius * Math.cos(angle)}%`,
    top: `${50 + radius * Math.sin(angle)}%`,
  };
};

const CustomClockPicker = ({ value, onChange, onClose }) => {
  // Parse value
  let initHour = 12, initMinute = 0, initPeriod = null;
  if (value) {
    const [h, m] = value.split(':');
    let hour = Number(h);
    initMinute = Number(m);
    if (hour === 0) {
      initHour = 12;
      initPeriod = 'AM';
    } else if (hour === 12) {
      initHour = 12;
      initPeriod = 'PM';
    } else if (hour > 12) {
      initHour = hour - 12;
      initPeriod = 'PM';
    } else {
      initHour = hour;
      initPeriod = 'AM';
    }
  }
  const [mode, setMode] = useState('hour');
  const [selectedHour, setSelectedHour] = useState(initHour);
  const [selectedMinute, setSelectedMinute] = useState(initMinute);
  const [period, setPeriod] = useState(initPeriod);

  // Reset period về null nếu value là rỗng khi mở picker
  useEffect(() => {
    if (!value) setPeriod(null);
  }, [value]);

  // Đóng khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose && onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Helper: nếu đã chọn đủ 3 field thì đóng và gọi onChange
  const tryClose = (h, m, p) => {
    if (h && m !== undefined && p) {
      let hour = h;
      if (p === 'PM' && hour !== 12) hour += 12;
      if (p === 'AM' && hour === 12) hour = 0;
      const timeStr = `${pad(hour)}:${pad(m)}:00`;
      onChange && onChange(timeStr);
      onClose && onClose();
    }
  };

  const handleHourClick = h => {
    setSelectedHour(h);
    setMode('minute');
    tryClose(h, selectedMinute, period);
  };
  const handleMinuteClick = m => {
    setSelectedMinute(m);
    tryClose(selectedHour, m, period);
  };
  const handlePeriodClick = p => {
    setPeriod(p);
    tryClose(selectedHour, selectedMinute, p);
  };

  const pickerRef = useRef(null);

  return (
    <div className="custom-clock-picker-bg">
      <div className="custom-clock-picker" ref={pickerRef}>
        <div className="clock-face">
          {mode === 'hour' && hours.map((h, i) => (
            <div
              key={h}
              className={`clock-number${selectedHour === h ? ' selected' : ''}`}
              style={getPosition(i, 12, 80)}
              onClick={() => handleHourClick(h)}
            >
              {h}
            </div>
          ))}
          {mode === 'minute' && minutes.map((m, i) => (
            <div
              key={m}
              className={`clock-number${selectedMinute === m ? ' selected' : ''}`}
              style={getPosition(i, 12, 80)}
              onClick={() => handleMinuteClick(m)}
            >
              {pad(m)}
            </div>
          ))}
          <div className="clock-value-display">
            {pad(selectedHour)}:{pad(selectedMinute)} {period || ''}
          </div>
        </div>
        <div className="clock-mode-row">
          <div className="clock-mode-switch">
            <button className={mode === 'hour' ? 'active' : ''} onClick={() => setMode('hour')}>Giờ</button>
            <button className={mode === 'minute' ? 'active' : ''} onClick={() => setMode('minute')}>Phút</button>
          </div>
          <div className="clock-am-pm-group">
            <button className={`period-btn${period === 'AM' ? ' active' : ''}`} onClick={() => handlePeriodClick('AM')}>AM</button>
            <button className={`period-btn${period === 'PM' ? ' active' : ''}`} onClick={() => handlePeriodClick('PM')}>PM</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomClockPicker; 