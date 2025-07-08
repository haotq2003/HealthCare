import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const testPackages = [
  { id: 1, name: 'Gói Xét Nghiệm A' },
  { id: 2, name: 'Gói Xét Nghiệm B' },
];

const initialSchedules = [
  { id: 1, package: 'Gói Xét Nghiệm A', date: '2024-06-10', time: '09:00', slots: 10 },
  { id: 2, package: 'Gói Xét Nghiệm B', date: '2024-06-12', time: '14:00', slots: 8 },
];

const TestScheduleManagePage = () => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [form, setForm] = useState({ packageId: '', date: '', time: '', slots: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.packageId || !form.date || !form.time || !form.slots) return;
    const pkg = testPackages.find(p => p.id === Number(form.packageId));
    setSchedules([
      ...schedules,
      {
        id: schedules.length + 1,
        package: pkg.name,
        date: form.date,
        time: form.time,
        slots: form.slots,
      },
    ]);
    setForm({ packageId: '', date: '', time: '', slots: '' });
  };

  return (
    <div className="test-schedule-manage">
      <h2>Tạo lịch xét nghiệm</h2>
      <form className="schedule-form" onSubmit={handleSubmit}>
        <select name="packageId" value={form.packageId} onChange={handleChange} required>
          <option value="">Chọn gói xét nghiệm</option>
          {testPackages.map(pkg => (
            <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
          ))}
        </select>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input type="time" name="time" value={form.time} onChange={handleChange} required />
        <input type="number" name="slots" value={form.slots} onChange={handleChange} min="1" placeholder="Số slot" required />
        <button type="submit">Tạo lịch</button>
      </form>
      <h3>Danh sách lịch đã tạo</h3>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Gói xét nghiệm</th>
            <th>Ngày</th>
            <th>Giờ</th>
            <th>Số slot</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(sch => (
            <tr key={sch.id}>
              <td>{sch.package}</td>
              <td>{sch.date}</td>
              <td>{sch.time}</td>
              <td>{sch.slots}</td>
              <td>
                <button className="edit-btn"><FaEdit /></button>
                <button className="delete-btn"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestScheduleManagePage; 