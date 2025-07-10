import React, { useEffect, useState } from 'react';
import ConsultantLayout from '../../components/Consultant/ConsultantLayout';
import { jwtDecode } from "jwt-decode";
import { ConsultantService } from '../../services/ConsultantService';
import toast from 'react-hot-toast';
import { SlotService } from '../../services/SlotService';

const SchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableSlotDays, setAvailableSlotDays] = useState([]);

  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const decoded = jwtDecode(token);
        const consultantId = decoded.consultant_id;

        const response = await SlotService.getAvailableSlotsByConsultantId(consultantId);
        console.log(response.data.items)
        const slots = response.data.items;

        setAvailableSlotDays(slots);
      } catch (error) {
        console.error("Lỗi khi load slot:", error);
      }
    };

    fetchSlots();
  }, []);

  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const getStatusColor = (isBooked) => {
    return isBooked 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusText = (isBooked) => {
    return isBooked ? 'Đã đặt' : 'Có thể đặt';
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Hàm lấy slots cho một ngày cụ thể
  const getSlotsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return availableSlotDays.filter(slot => {
      const slotDate = new Date(slot.availableDate).toISOString().split('T')[0];
      return slotDate === dateString;
    });
  };

  // Hàm kiểm tra xem một ngày có slots hay không
  const hasSlots = (date) => {
    return getSlotsForDate(date).length > 0;
  };

  // Hàm lấy số lượng slots available và booked cho một ngày
  const getSlotStats = (date) => {
    const slots = getSlotsForDate(date);
    const available = slots.filter(slot => !slot.isBooked).length;
    const booked = slots.filter(slot => slot.isBooked).length;
    return { available, booked, total: slots.length };
  };

  const handleAddSlot = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const decoded = jwtDecode(token);
      const consultantId = decoded.consultant_id;
      
      const availableDate = new Date(`${newSlot.date}T${newSlot.startTime}`);
      const body = {
        availableDate: availableDate.toISOString(),
        startTime: newSlot.startTime.length === 5 ? newSlot.startTime + ':00' : newSlot.startTime,
        endTime: newSlot.endTime.length === 5 ? newSlot.endTime + ':00' : newSlot.endTime,
        consultantId
      };
      
      await ConsultantService.createConsultantSchedules(body);
      toast.success('Tạo lịch thành công!');
      setShowAddModal(false);
      setNewSlot({
        date: '',
        startTime: '',
        endTime: '',
      });
      
      // Refresh slots after adding
      const response = await SlotService.getAvailableSlotsByConsultantId(consultantId);
      setAvailableSlotDays(response.data.items);
    } catch (error) {
      toast.error('Tạo lịch thất bại!');
      console.error(error);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      // Gọi API xóa slot (cần implement API này)
      // await SlotService.deleteSlot(slotId);
      
      // Tạm thời remove từ state
      setAvailableSlotDays(availableSlotDays.filter(slot => slot.id !== slotId));
      toast.success('Xóa lịch thành công!');
    } catch (error) {
      toast.error('Xóa lịch thất bại!');
      console.error(error);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý lịch tư vấn</h1>
              <p className="text-gray-600">Tạo và quản lý lịch rảnh để khách hàng có thể đặt lịch hẹn</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm lịch rảnh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Calendar Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                    >
                      Hôm nay
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentDate).map((day, index) => {
                    if (!day) {
                      return <div key={index} className="p-3 h-24"></div>;
                    }

                    const dayHasSlots = hasSlots(day);
                    const slotStats = getSlotStats(day);
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSelected = day.toDateString() === selectedDate.toDateString();

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`p-2 h-24 border rounded-lg cursor-pointer transition duration-200 ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-300' 
                            : dayHasSlots 
                              ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                              : 'border-gray-200 hover:bg-gray-50'
                        } ${isToday ? 'ring-2 ring-yellow-400' : ''}`}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-yellow-700' : 'text-gray-900'
                        }`}>
                          {day.getDate()}
                        </div>
                        
                        {dayHasSlots && (
                          <div className="space-y-1">
                            {slotStats.available > 0 && (
                              <div className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded text-center">
                                {slotStats.available} rảnh
                              </div>
                            )}
                            {slotStats.booked > 0 && (
                              <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-center">
                                {slotStats.booked} đã đặt
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selected Date Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedDate.toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              <div className="space-y-3">
                {getSlotsForDate(selectedDate).length === 0 ? (
                  <p className="text-gray-500 text-sm">Không có lịch nào trong ngày này</p>
                ) : (
                  getSlotsForDate(selectedDate).map((slot) => (
                    <div key={slot.id} className={`p-3 rounded-lg border ${getStatusColor(slot.isBooked)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {slot.slotStart} - {slot.slotEnd}
                        </span>
                        {/* <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button> */}
                      </div>
                      <div className="text-sm">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(slot.isBooked)}`}>
                          {getStatusText(slot.isBooked)}
                        </span>
                      </div>
                      {slot.isBooked && slot.bookedAt && (
                        <div className="mt-2 text-sm text-gray-600">
                          Đã đặt lúc: {new Date(slot.bookedAt).toLocaleString('vi-VN')}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lịch có thể đặt</span>
                  <span className="font-semibold text-green-600">
                    {availableSlotDays.filter(slot => !slot.isBooked).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lịch đã đặt</span>
                  <span className="font-semibold text-blue-600">
                    {availableSlotDays.filter(slot => slot.isBooked).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tổng lịch</span>
                  <span className="font-semibold text-gray-600">
                    {availableSlotDays.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Slot Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Thêm lịch rảnh mới</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ bắt đầu</label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ kết thúc</label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddSlot}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Thêm lịch
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;