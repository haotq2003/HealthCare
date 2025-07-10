import React, { useState, useEffect } from "react";
import ConsultantLayout from "../../components/Consultant/ConsultantLayout";
import { ConsultantService } from "../../services/ConsultantService";
import toast from "react-hot-toast";
import { Calendar } from "lucide-react";

const DashboardPage = () => {
  const [todaySchedule, setTodaySchedule] = useState([
    {
      id: 1,
      time: "09:00",
      patient: "Nguyễn Thị A",
      type: "Video Call",
      status: "confirmed",
      topic: "Tư vấn sức khỏe sinh sản",
    },
    {
      id: 2,
      time: "10:30",
      patient: "Trần Văn B",
      type: "Voice Call",
      status: "confirmed",
      topic: "Tư vấn STI",
    },
    {
      id: 3,
      time: "14:00",
      patient: "Lê Thị C",
      type: "Video Call",
      status: "pending",
      topic: "Tư vấn kế hoạch hóa gia đình",
    },
    {
      id: 4,
      time: "15:30",
      patient: "Phạm Văn D",
      type: "Chat",
      status: "confirmed",
      topic: "Tư vấn chung",
    },
  ]);
  const [booking, setBooking] = useState([]);

  useEffect(() => {
    fetchConsultantById();
  }, []);

  const fetchConsultantById = async () => {
    try {
      const res = await ConsultantService.getConsultantByUserId();
      console.log(res.items);
      setBooking(res.items);
    } catch (error) {
      console.log(error);
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const handleConfirm = async (bookingId) => {
    try {
      await ConsultantService.confirmConsultation(bookingId); 
      toast.success('Xác nhận thành công')
      setBooking((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "Confirmed" }
            : booking
        )
      );
    } catch (error) {
      console.error("Lỗi khi xác nhận:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Tư vấn viên
          </h1>
          <p className="text-gray-600">
            Chào mừng trở lại! Đây là tổng quan hoạt động của bạn hôm nay.
          </p>
        </div>

        {/* Stats Cards */}

        <div className="grid grid-cols-1  gap-8">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Lịch hẹn hôm nay
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Xem tất cả
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {booking.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900">
                          {appointment.slotStart}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status === "Confirmed"
                            ? "Đã xác nhận"
                            : appointment.status === "Completed"
                            ? "Hoàn Thành"
                            : appointment.status === "Pending"
                            ? "Chờ xác nhận"
                            : "Đã hủy"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.userFullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.reason}
                        </p>
                         <span className="flex gap-5">
                        
                        {new Date(appointment.availableDate).toLocaleDateString('vi-VN')}
                      </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {appointment.status === "Pending" && (
                        <button
                          onClick={() => handleConfirm(appointment.id)}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Xác nhận
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Questions */}
        </div>

        {/* Quick Actions */}
      </div>
    </div>
  );
};

export default DashboardPage;
