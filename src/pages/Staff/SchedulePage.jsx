import React, { useState, useEffect } from "react";
import { Plus, Edit, Eye, Calendar, Filter } from "lucide-react";
import "./SchedulePage.scss";
import Select from "react-select";
import CustomClockPicker from "../../components/TimePicker/CustomClockPicker";
import Swal from 'sweetalert2';

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
  const [showClock, setShowClock] = useState({ field: null });

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
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };
  // Realtime validation giờ bắt đầu < giờ kết thúc
  React.useEffect(() => {
    if (form.slotStart && form.slotEnd) {
      const startTime = new Date(`2000-01-01T${form.slotStart}`);
      const endTime = new Date(`2000-01-01T${form.slotEnd}`);
      
      if (startTime >= endTime) {
        setTimeError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc!");
      } else {
        setTimeError("");
      }
    } else {
      setTimeError("");
    }
  }, [form.slotStart, form.slotEnd]);

  // Helper để chuẩn hóa giờ sang HH:mm:ss
  const padTime = (t) => {
    if (!t) return t;
    // TimePicker trả về format HH:mm:ss, nên chỉ cần đảm bảo có đủ 3 phần
    const parts = t.split(':');
    if (parts.length === 2) {
      return t + ':00';
    }
    return t;
  };

  // Helper để hiển thị giờ đã chọn dạng 12h AM/PM
  const displayTime = (val) => {
    if (!val) return "Chọn giờ";
    const [h, m] = val.split(":");
    let hour = Number(h);
    const minute = m;
    let period = "AM";
    if (hour === 0) hour = 12;
    else if (hour === 12) period = "PM";
    else if (hour > 12) { hour = hour - 12; period = "PM"; }
    return `${hour.toString().padStart(2, "0")}:${minute} ${period}`;
  };

  // Handler gửi API thêm lịch
  const handleAddSchedule = async () => {
    // Kiểm tra giờ bắt đầu phải nhỏ hơn giờ kết thúc
    if (form.slotStart && form.slotEnd) {
      const startTime = new Date(`2000-01-01T${form.slotStart}`);
      const endTime = new Date(`2000-01-01T${form.slotEnd}`);
      
      if (startTime >= endTime) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Giờ bắt đầu phải nhỏ hơn giờ kết thúc!' });
        return;
      }
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
      // Auto reload danh sách lịch sau khi tạo thành công
      try {
        const schRes = await fetch("https://localhost:7276/api/HealthTestSchedule", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "*/*"
          }
        });
        if (schRes.ok) {
          const schData = await schRes.json();
          setSchedules(schData);
          Swal.fire({ icon: 'success', title: 'Thành công', text: 'Tạo lịch làm việc thành công!' });
        }
      } catch (reloadErr) {
        console.error("Lỗi khi reload danh sách lịch:", reloadErr);
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Tạo lịch thành công nhưng không thể cập nhật danh sách. Vui lòng tải lại trang!' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message || "Có lỗi xảy ra khi thêm lịch!" });
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="hc-schedule-page">
      <div className="hc-schedule-header">
        <div>
          <h2>Lịch làm việc</h2>
          <div className="hc-schedule-sub">Cấu hình lịch làm việc cho từng gói xét nghiệm</div>
        </div>
        <button className="hc-schedule-add-btn" onClick={() => setShowModal(true)}><Plus size={18} /> Thêm lịch</button>
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
                  <input type="date" name="startDate" value={form.startDate} onChange={handleFormChange} required min={todayStr} />
                </div>
                <div className="hc-modal-col">
                  <label>Ngày kết thúc *</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleFormChange} required min={todayStr} />
                </div>
              </div>
              <div className="hc-modal-row">
                <div className="hc-modal-col">
                  <label>Giờ bắt đầu *</label>
                  <div onClick={() => setShowClock({ field: 'slotStart' })} className="custom-clock-input">
                    {displayTime(form.slotStart)}
                  </div>
                  {showClock.field === 'slotStart' && (
                    <CustomClockPicker
                      value={form.slotStart}
                      onChange={val => setForm(f => ({ ...f, slotStart: val }))}
                      onClose={() => setShowClock({ field: null })}
                    />
                  )}
                </div>
                <div className="hc-modal-col">
                  <label>Giờ kết thúc *</label>
                  <div onClick={() => setShowClock({ field: 'slotEnd' })} className="custom-clock-input">
                    {displayTime(form.slotEnd)}
                  </div>
                  {showClock.field === 'slotEnd' && (
                    <CustomClockPicker
                      value={form.slotEnd}
                      onChange={val => setForm(f => ({ ...f, slotEnd: val }))}
                      onClose={() => setShowClock({ field: null })}
                    />
                  )}
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