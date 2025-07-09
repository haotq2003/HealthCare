import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Filter, Search, Eye, MessageCircle, Video, Phone as PhoneIcon } from 'lucide-react';
import { ConsultantService } from '../../services/ConsultantService';
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import toast from 'react-hot-toast';

const ConsultationPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
const [openModal, setOpenModal] = useState(false);
const [selectedConsultationId, setSelectedConsultationId] = useState(null);
const [resultInput, setResultInput] = useState('');

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
  const handleOpenModal = (id) => {
  setSelectedConsultationId(id);
  setOpenModal(true);
};

  useEffect(() => {


  fetchAppointments();
}, []);
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await ConsultantService.getConsultantByStatus('Confirmed');
      console.log(res.items)
      setAppointments(res.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
const handleSubmitResult = async () => {
  try {
    await ConsultantService.resultConsultation(selectedConsultationId, resultInput);
    await fetchAppointments(); 
    toast.success("Ghi kết quả thành công");

    // Cập nhật UI hoặc refetch
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedConsultationId ? { ...app, result: resultInput } : app
      )
    );

    setOpenModal(false);
    setResultInput('');
  } catch (err) {
    console.error(err);
  
  }
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
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
      case 'Confirmed':
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
   
    const matchesSearch = appointment.userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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
<Modal open={openModal} onClose={() => setOpenModal(false)}>
  <Box sx={{
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400, bgcolor: 'background.paper',
    borderRadius: 2, boxShadow: 24, p: 4
  }}>
    <Typography variant="h6" gutterBottom>
      Nhập kết quả tư vấn
    </Typography>
    <TextField
      fullWidth
      multiline
      rows={4}
      value={resultInput}
      onChange={(e) => setResultInput(e.target.value)}
      placeholder="Nhập nội dung tư vấn..."
    />
    <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
      <Button onClick={() => setOpenModal(false)}>Hủy</Button>
      <Button onClick={handleSubmitResult} variant="contained" color="primary">Xác nhận</Button>
    </Box>
  </Box>
</Modal>

      {/* Stats Cards */}
      

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
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.userFullName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(appointment.availableDate)} - {appointment.slotStart}</span>
                          </div>
                          {/* <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{appointment.address}</span>
                          </div> */}
                        </div>
                        
                        
                      </div>
                      
                      <div className="mt-4 flex gap-5">
                        <h4 className="font-medium text-gray-900 mb-1">Ghi chú: </h4>
                        <p className="text-gray-600">{appointment.reason}</p>
                        
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={() => handleOpenModal(appointment.id)} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <Eye className="w-4 h-4 mr-2" />
                    Ghi kết quả
                  </button>
                  
               
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
