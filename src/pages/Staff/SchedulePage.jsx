import React, { useState, useEffect } from "react";
import { Plus, Edit, Eye, Calendar, Filter } from "lucide-react";
import "./SchedulePage.scss";
import Select from "react-select";

// Đã bỏ weekdays, không còn dùng
const weekdayOptions = [
  { label: "Thứ 2", value: "Mon" },
  { label: "Thứ 3", value: "Tue" },
  { label: "Thứ 4", value: "Wed" },
  { label: "Thứ 5", value: "Thu" },
  { label: "Thứ 6", value: "Fri" },
  { label: "Thứ 7", value: "Sat" },
  { label: "Chủ nhật", value: "Sun" },
];

// Time Picker Component với Clock Face
const TimePicker = ({ value, onChange, label, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(1);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('AM'); // 'AM' hoặc 'PM'
  const [mode, setMode] = useState('hour'); // 'hour', 'minute', hoặc 'period'

  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':').map(Number);
      if (hours === 0) {
        setSelectedHour(12);
        setSelectedPeriod('AM');
      } else if (hours === 12) {
        setSelectedHour(12);
        setSelectedPeriod('PM');
      } else if (hours > 12) {
        setSelectedHour(hours - 12);
        setSelectedPeriod('PM');
      } else {
        setSelectedHour(hours);
        setSelectedPeriod('AM');
      }
      setSelectedMinute(minutes);
    }
  }, [value]);

  const handleTimeChange = (hour, minute, period, closeOnSelect = false) => {
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) {
      hour24 = hour + 12;
    } else if (period === 'AM' && hour === 12) {
      hour24 = 0;
    }
    const timeString = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange({ target: { name: 'time', value: timeString } });
    if (closeOnSelect) setIsOpen(false);
  };

  const generateClockNumbers = (max, step = 1, start = 1) => {
    const numbers = [];
    for (let i = start; i < max + start; i += step) {
      if (i < max) numbers.push(i);
    }
    return numbers;
  };

  const getClockPosition = (number, max, radius = 60) => {
    const angle = ((number - 1) / max) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  const getMinutePosition = (minute, radius = 60) => {
    // Cho phút: 0 ở vị trí 12 giờ, 15 ở vị trí 3 giờ, 30 ở vị trí 6 giờ, 45 ở vị trí 9 giờ
    const angle = (minute / 60) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  const hourNumbers = generateClockNumbers(12, 1, 1); // 1-12
  const minuteNumbers = generateClockNumbers(60, 5, 0); // 0, 5, 10, ..., 55

  const formatDisplayTime = () => {
    if (!value) return '';
    const [hours, minutes] = value.split(':').map(Number);
    let displayHour = hours;
    let period = 'AM';
    
    if (hours === 0) {
      displayHour = 12;
      period = 'AM';
    } else if (hours === 12) {
      displayHour = 12;
      period = 'PM';
    } else if (hours > 12) {
      displayHour = hours - 12;
      period = 'PM';
    }
    
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="time-picker-container">
      <label>{label}</label>
      <div className="time-picker-input" onClick={() => setIsOpen(!isOpen)}>
        <input
          type="text"
          value={formatDisplayTime()}
          placeholder={placeholder}
          readOnly
          className="time-picker-display"
        />
        <div className="time-picker-icon">🕐</div>
      </div>
      
      {isOpen && (
        <div className="time-picker-dropdown">
          <div className="time-picker-header">
            <button 
              className={`time-picker-mode-btn ${mode === 'hour' ? 'active' : ''}`}
              onClick={() => setMode('hour')}
            >
              Giờ
            </button>
            <button 
              className={`time-picker-mode-btn ${mode === 'minute' ? 'active' : ''}`}
              onClick={() => setMode('minute')}
            >
              Phút
            </button>
            <button 
              className={`time-picker-mode-btn ${mode === 'period' ? 'active' : ''}`}
              onClick={() => setMode('period')}
            >
              AM/PM
            </button>
          </div>
          
          <div className="time-picker-clock">
            <div className="clock-face">
              {mode === 'hour' ? (
                hourNumbers.map((hour) => {
                  const pos = getClockPosition(hour, 12, 50);
                  const isSelected = hour === selectedHour;
                  return (
                    <button
                      key={hour}
                      className={`clock-number ${isSelected ? 'selected' : ''}`}
                      style={{
                        left: `calc(50% + ${pos.x}px)`,
                        top: `calc(50% + ${pos.y}px)`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => {
                        setSelectedHour(hour);
                        handleTimeChange(hour, selectedMinute, selectedPeriod, false);
                      }}
                    >
                      {hour}
                    </button>
                  );
                })
              ) : mode === 'minute' ? (
                minuteNumbers.map((minute) => {
                  const pos = getMinutePosition(minute, 50); // Use the new getMinutePosition
                  const isSelected = minute === selectedMinute;
                  return (
                    <button
                      key={minute}
                      className={`clock-number ${isSelected ? 'selected' : ''}`}
                      style={{
                        left: `calc(50% + ${pos.x}px)`,
                        top: `calc(50% + ${pos.y}px)`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => {
                        setSelectedMinute(minute);
                        handleTimeChange(selectedHour, minute, selectedPeriod, false);
                      }}
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  );
                })
              ) : (
                // AM/PM mode
                <>
                  <button
                    className={`clock-number period-btn ${selectedPeriod === 'AM' ? 'selected' : ''}`}
                    style={{
                      left: 'calc(50% - 30px)',
                      top: 'calc(50% - 20px)',
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => {
                      setSelectedPeriod('AM');
                      handleTimeChange(selectedHour, selectedMinute, 'AM', true);
                    }}
                  >
                    AM
                  </button>
                  <button
                    className={`clock-number period-btn ${selectedPeriod === 'PM' ? 'selected' : ''}`}
                    style={{
                      left: 'calc(50% + 30px)',
                      top: 'calc(50% - 20px)',
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => {
                      setSelectedPeriod('PM');
                      handleTimeChange(selectedHour, selectedMinute, 'PM', true);
                    }}
                  >
                    PM
                  </button>
                </>
              )}
              <div className="clock-center"></div>
            </div>
          </div>
          
          <div className="time-picker-footer">
            <button 
              className="time-picker-btn"
              onClick={() => setIsOpen(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SchedulePage = () => {
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [schedules, setSchedules] = useState([]);
  // State cho form thêm lịch
  const [form, setForm] = useState({
    healthTestId: "",
    startDate: "",
    endDate: "",
    slotStart: "",
    slotEnd: "",
    slotDurationInMinutes: 30,
    daysOfWeek: [],
  });
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        // Gọi song song 2 API
        const [pkgRes, schRes] = await Promise.all([
          fetch("https://localhost:7276/api/HealthTest", {
            headers: {
              "Authorization": `Bearer ${token}`,
              "accept": "*/*"
            }
          }),
          fetch("https://localhost:7276/api/HealthTestSchedule", {
            headers: {
              "Authorization": `Bearer ${token}`,
              "accept": "*/*"
            }
          })
        ]);
        if (!pkgRes.ok || !schRes.ok) throw new Error("Lỗi khi tải dữ liệu");
        const [pkgData, schData] = await Promise.all([pkgRes.json(), schRes.json()]);
        setPackages(pkgData);
        setSchedules(schData);
      } catch (err) {
        console.error("Failed to fetch packages or schedules", err);
      }
    };
    fetchData();
  }, []);

  // Handler cho form
  const handleFormChange = (e) => {
    const { name, value, selectedOptions } = e.target;
    if (name === "daysOfWeek") {
      setForm(f => ({ ...f, daysOfWeek: Array.from(selectedOptions).map(o => o.value) }));
    } else if (name === "slotStart") {
      if (form.slotEnd && value >= form.slotEnd) {
        setForm(f => ({ ...f, slotStart: value, slotEnd: "" }));
      } else {
        setForm(f => ({ ...f, [name]: value }));
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };
  // Realtime validation giờ bắt đầu < giờ kết thúc
  React.useEffect(() => {
    if (form.slotStart && form.slotEnd && form.slotStart >= form.slotEnd) {
      setTimeError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc!");
    } else {
      setTimeError("");
    }
  }, [form.slotStart, form.slotEnd]);

  // Helper để chuẩn hóa giờ sang HH:mm:ss
  const padTime = (t) => t && t.length === 5 ? t + ':00' : t;

  // Handler gửi API thêm lịch
  const handleAddSchedule = async () => {
    // Kiểm tra giờ bắt đầu phải nhỏ hơn giờ kết thúc
    if (form.slotStart && form.slotEnd && form.slotStart >= form.slotEnd) {
      alert("Giờ bắt đầu phải nhỏ hơn giờ kết thúc!");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      // Chuẩn bị dữ liệu
      const payload = {
        healthTestId: form.healthTestId,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : "",
        endDate: form.endDate ? new Date(form.endDate).toISOString() : "",
        slotStart: padTime(form.slotStart),
        slotEnd: padTime(form.slotEnd),
        slotDurationInMinutes: Number(form.slotDurationInMinutes),
        daysOfWeek: form.daysOfWeek,
      };
      console.log("Payload gửi lên:", payload);
      const res = await fetch("https://localhost:7276/api/HealthTestSchedule", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "accept": "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Thêm lịch thất bại");
      // Reset form và đóng modal
      setForm({
        healthTestId: "",
        startDate: "",
        endDate: "",
        slotStart: "",
        slotEnd: "",
        slotDurationInMinutes: 30,
        daysOfWeek: [],
      });
      setShowModal(false);
      // TODO: Có thể reload lại danh sách lịch nếu cần
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra khi thêm lịch!");
    }
  };

  return (
    <div className="hc-schedule-page">
      <div className="hc-schedule-header">
        <div>
          <h2>Lịch làm việc</h2>
          <div className="hc-schedule-sub">Cấu hình lịch làm việc cho từng gói xét nghiệm</div>
        </div>
        <button className="hc-schedule-add-btn" onClick={() => setShowModal(true)}><Plus size={18} /> Thêm lịch</button>
      </div>
      <div className="hc-schedule-filter-box">
        <div className="hc-schedule-filter-title"><Filter size={18} /> Bộ lọc gói xét nghiệm</div>
        <div className="hc-schedule-filter-row">
          <select className="hc-schedule-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">Tất cả gói</option>
            {packages.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="hc-schedule-main">
        <div className="hc-schedule-list">
          <div className="hc-schedule-list-title"><Calendar size={18} /> Lịch làm việc ({schedules.length})</div>
          <div className="hc-schedule-card-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {schedules.map(sch => {
              let testName = sch.healthTestName;
              if (!testName) {
                const found = packages.find(p => p.id === sch.healthTestId);
                testName = found ? found.name : sch.healthTestId;
              }
              return (
                <div className="hc-schedule-card" key={sch.id} style={{ minWidth: 300, maxWidth: 400 }}>
                  <div className="hc-schedule-card-header">
                    <div className="hc-schedule-avatar">{testName ? testName[0] : "?"}</div>
                    <div className="hc-schedule-card-main">
                      <div className="hc-schedule-title">{testName}</div>
                    </div>
                  </div>
                  <div className="hc-schedule-card-info-grid">
                    <div className="hc-schedule-card-row" style={{ display: 'flex', gap: 8 }}>
                      <span className="hc-schedule-icon"><Calendar size={16} /></span>
                      <span>Bắt đầu: {sch.startDate ? new Date(sch.startDate).toLocaleDateString() : "-"}</span>
                      <span style={{ marginLeft: 12 }}>|</span>
                      <span>Kết thúc: {sch.endDate ? new Date(sch.endDate).toLocaleDateString() : "-"}</span>
                    </div>
                    <div className="hc-schedule-card-row"><span className="hc-schedule-icon"><Calendar size={16} /></span><span>Giờ: {sch.slotStart} - {sch.slotEnd}</span></div>
                    <div className="hc-schedule-card-row"><span className="hc-schedule-icon"><Calendar size={16} /></span><span>Thứ: {sch.daysOfWeek && sch.daysOfWeek.length > 0 ? sch.daysOfWeek.join(", ") : "-"}</span></div>
                    <div className="hc-schedule-card-row"><span className="hc-schedule-icon"><Calendar size={16} /></span><span>Slot: {sch.slotDurationInMinutes} phút</span></div>
                  </div>
                  <div className="hc-schedule-card-actions" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, textAlign: 'center' }}>
                    <button className="hc-schedule-icon-btn view-block horiz"><Eye size={20} className="hc-schedule-icon-btn-icon" /> <span className="hc-schedule-icon-btn-text">View</span></button>
                    <button className="hc-schedule-icon-btn edit-block horiz"><Edit size={20} className="hc-schedule-icon-btn-icon" /> <span className="hc-schedule-icon-btn-text">Sửa</span></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="hc-modal-bg" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="hc-modal">
            <div className="hc-modal-title"><Calendar size={18} style={{marginRight: 8}} />Thêm lịch làm việc</div>
            <div className="hc-modal-form">
              <div className="hc-modal-row">
                <div className="hc-modal-col">
                  <label>Gói xét nghiệm *</label>
                  <select name="healthTestId" value={form.healthTestId} onChange={handleFormChange} required>
                    <option value="">Chọn gói xét nghiệm</option>
                    {packages.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="hc-modal-col">
                  <label>Thứ trong tuần *</label>
                  <Select
                    isMulti
                    options={weekdayOptions}
                    value={weekdayOptions.filter(opt => form.daysOfWeek.includes(opt.value))}
                    onChange={selected => setForm(f => ({
                      ...f,
                      daysOfWeek: selected ? selected.map(opt => opt.value) : []
                    }))}
                    placeholder="Chọn thứ trong tuần"
                    closeMenuOnSelect={false}
                    styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>
              </div>
              <div className="hc-modal-row">
                <div className="hc-modal-col">
                  <label>Ngày bắt đầu *</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleFormChange} required />
                </div>
                <div className="hc-modal-col">
                  <label>Ngày kết thúc *</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleFormChange} required />
                </div>
              </div>
              <div className="hc-modal-row">
                <div className="hc-modal-col">
                  <TimePicker
                    value={form.slotStart}
                    onChange={(e) => setForm(f => ({ ...f, slotStart: e.target.value }))}
                    label="Giờ bắt đầu *"
                    placeholder="Chọn giờ bắt đầu"
                  />
                </div>
                <div className="hc-modal-col">
                  <TimePicker
                    value={form.slotEnd}
                    onChange={(e) => setForm(f => ({ ...f, slotEnd: e.target.value }))}
                    label="Giờ kết thúc *"
                    placeholder="Chọn giờ kết thúc"
                  />
                  {timeError && <div style={{color:'red', fontSize:13, marginTop:2}}>{timeError}</div>}
                </div>
              </div>
              <div style={{fontSize:12, color:'#888', marginBottom: 16, textAlign: 'center'}}>
                Chỉ hỗ trợ ca làm việc trong cùng một ngày (00:00 - 23:59)
              </div>
              <div className="hc-modal-row">
                <div className="hc-modal-col">
                  <label>Thời gian slot (phút)</label>
                  <input type="number" name="slotDurationInMinutes" min={1} value={form.slotDurationInMinutes} onChange={handleFormChange} required />
                </div>
                {/* Bỏ trường số slot tối đa */}
              </div>
              <div className="hc-modal-actions">
                <button className="hc-btn hc-btn-light" onClick={() => setShowModal(false)}>Hủy</button>
                <button className="hc-btn hc-btn-primary" onClick={handleAddSchedule} disabled={!!timeError}>Lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage; 