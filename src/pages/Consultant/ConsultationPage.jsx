import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Filter, Search, Eye, MessageCircle, Video, Phone as PhoneIcon } from 'lucide-react';

const ConsultationPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Mock data cho các cuộc hẹn
  const mockAppointments = [
    {
      id: 1,
      patientName: 'Nguyễn Thị Anh',
      patientPhone: '0901234567',
      patientEmail: 'anh.nguyen@email.com',
      date: '2024-01-15',
      time: '09:00',
      duration: 60,
      status: 'confirmed',
      type: 'video',
      topic: 'Tư vấn sức khỏe sinh sản',
      notes: 'Bệnh nhân muốn tư vấn về kế hoạch hóa gia đình',
      address: 'Hà Nội'
    },
    {
      id: 2,
      patientName: 'Trần Văn Bình',
      patientPhone: '0912345678',
      patientEmail: 'binh.tran@email.com',
      date: '2024-01-15',
      time: '10:30',
      duration: 45,
      status: 'pending',
      type: 'phone',
      topic: 'Tư vấn tâm lý tình dục',
      notes: 'Bệnh nhân có vấn đề về tâm lý trong mối quan hệ',
      address: 'TP.HCM'
    },
    {
      id: 3,
      patientName: 'Lê Thị Cẩm',
      patientPhone: '0923456789',
      patientEmail: 'cam.le@email.com',
      date: '2024-01-15',
      time: '14:00',
      duration: 60,
      status: 'cancelled',
      type: 'in-person',
      topic: 'Tư vấn STIs',
      notes: 'Bệnh nhân hủy lịch hẹn',
      address: 'Đà Nẵng'
    },
    {
      id: 4,
      patientName: 'Phạm Văn Dũng',
      patientPhone: '0934567890',
      patientEmail: 'dung.pham@email.com',
      date: '2024-01-16',
      time: '08:00',
      duration: 60,
      status: 'confirmed',
      type: 'video',
      topic: 'Giáo dục giới tính',
      notes: 'Tư vấn cho học sinh THPT',
      address: 'Hà Nội'
    },
    {
      id: 5,
      patientName: 'Hoàng Thị Em',
      patientPhone: '0945678901',
      patientEmail: 'em.hoang@email.com',
      date: '2024-01-16',
      time: '11:00',
      duration: 45,
      status: 'pending',
      type: 'phone',
      topic: 'Tư vấn kế hoạch hóa gia đình',
      notes: 'Bệnh nhân muốn tư vấn về các phương pháp tránh thai',
      address: 'TP.HCM'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <PhoneIcon className="w-4 h-4" />;
      case 'in-person':
        return <User className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'video':
        return 'Video call';
      case 'phone':
        return 'Điện thoại';
      case 'in-person':
        return 'Trực tiếp';
      default:
        return 'Không xác định';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.topic.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? { ...app, status: newStatus } : app
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý cuộc hẹn</h1>
        <p className="text-gray-600">Xem và quản lý tất cả các cuộc hẹn tư vấn của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng cuộc hẹn</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã hủy</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên bệnh nhân hoặc chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có cuộc hẹn nào</h3>
            <p className="text-gray-600">Không tìm thấy cuộc hẹn nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Appointment Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(appointment.date)} - {appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{appointment.address}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(appointment.type)}
                            <span>{getTypeText(appointment.type)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{appointment.patientPhone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-1">Chủ đề tư vấn:</h4>
                        <p className="text-gray-600">{appointment.topic}</p>
                        {appointment.notes && (
                          <div className="mt-2">
                            <h4 className="font-medium text-gray-900 mb-1">Ghi chú:</h4>
                            <p className="text-gray-600">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <Eye className="w-4 h-4 mr-2" />
                    Xem chi tiết
                  </button>
                  
                  {appointment.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        Xác nhận
                      </button>
                      <button 
                        onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsultationPage;
