import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, FileText, Filter, Repeat } from 'lucide-react';
import './UserHistoryPage.scss';
import { ConsultantService } from '../../../services/ConsultantService';
import { FeedbackService } from '../../../services/FeedbackService';
import { CycleTrackingService } from '../../../services/CycleTrackingService';
import toast from 'react-hot-toast';
import { API_URL } from '../../../config/apiURL';
import { formatVietnameseCurrencyVND } from '../../../utils/currencyFormatter';
const UserHistoryPage = () => {
  const [activeTab, setActiveTab] = useState('consultations');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with actual API calls
  const [consultationHistory, setConsultationHistory] = useState([
    {
      id: 1,
      type: 'consultation',
      consultantName: 'Dr. Nguyễn Văn A',
      specialty: 'Tư vấn tâm lý',
      date: '2024-01-15',
      time: '14:00',
      status: 'completed',
      location: 'Phòng 301, Tầng 3',
      notes: 'Tư vấn về stress và anxiety'
    },
    {
      id: 2,
      type: 'consultation',
      consultantName: 'Dr. Trần Thị B',
      specialty: 'Tư vấn dinh dưỡng',
      date: '2024-01-10',
      time: '09:30',
      status: 'cancelled',
      location: 'Phòng 205, Tầng 2',
      notes: 'Tư vấn chế độ ăn uống'
    }
  ]);
const [consultantHis,setConsultationHis] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [testPackages, setTestPackages] = useState([]); // Danh sách tất cả gói xét nghiệm
  const [testPackageDetails, setTestPackageDetails] = useState({}); // Chi tiết từng gói xét nghiệm

  // Cycle tracking state
  const [cycleHistory, setCycleHistory] = useState([]);
  const [loadingCycle, setLoadingCycle] = useState(false);
  const [cycleError, setCycleError] = useState(null);

  const [showModal,setShowModal] = useState(false);
  const [selectedConsultant,setSelectedConsultant] = useState(null);
  const [rating,setRating] = useState(5);
  const [comment,setComment] = useState('');
useEffect(()=>{
  getConsultantByUserId();

},[])
  useEffect(() => {
    if (activeTab === 'cycles') {
      const fetchCycles = async () => {
        setLoadingCycle(true);
        setCycleError(null);
        try {
          const cycles = await CycleTrackingService.getCycleHistory();
          setCycleHistory(Array.isArray(cycles) ? cycles : []);
        } catch (err) {
          setCycleError(err.message);
        } finally {
          setLoadingCycle(false);
        }
      };
      fetchCycles();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'tests') {
      const fetchTestHistory = async () => {
        try {
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          if (!currentUser?.id) return;
          const res = await fetch(`https://localhost:7276/api/TestSlots/user/${currentUser.id}?page=1&size=10`, {
            headers: { 'accept': '*/*' }
          });
          const data = await res.json();
          const testSlots = Array.isArray(data.data?.items) ? data.data.items : [];
          setTestHistory(testSlots);
          
          // Fetch details for each unique healthTestId
          const uniqueTestIds = [...new Set(testSlots.map(slot => slot.healthTestId))];
          const details = {};
          
          for (const testId of uniqueTestIds) {
            try {
              const detailRes = await fetch(`https://localhost:7276/api/HealthTest/${testId}`, {
                headers: { 'accept': '*/*' }
              });
              const detailData = await detailRes.json();
              details[testId] = detailData;
            } catch (err) {
              console.error(`Error fetching test package details for ${testId}:`, err);
              details[testId] = null;
            }
          }
          
          setTestPackageDetails(details);
        } catch (err) {
          setTestHistory([]);
          setTestPackageDetails({});
        }
      };
      
      const fetchTestPackages = async () => {
        try {
          const res = await fetch(`${API_URL}/api/HealthTest`);
          const data = await res.json();
          setTestPackages(Array.isArray(data) ? data : []);
        } catch (err) {
          setTestPackages([]);
        }
      };
      
      fetchTestHistory();
      fetchTestPackages();
    }
  }, [activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      case 'Pending':
        return 'status-pending';
      case 'upcoming':
        return 'status-upcoming';
      default:
        return 'status-default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Completed':
        return 'Hoàn thành';
      case 'Cancelled':
        return 'Đã hủy';
      case 'Pending':
        return 'Đang chờ';
      case 'upcoming':
        return 'Sắp tới';
      default:
        return status;
    }
  };

  const filteredConsultations = consultationHistory.filter(item => 
    filterStatus === 'all' || item.status === filterStatus
  );

  const filteredTests = testHistory.filter(item => 
    filterStatus === 'all' || item.status === filterStatus
  );
  const filteredConsultantHis = consultantHis.filter(
  item => filterStatus === 'all' || item.status === filterStatus
);
const getConsultantByUserId = async () =>{
  try {
    const res = await ConsultantService.getConsultantByUserId();
    console.log(res.items)
    setConsultationHis(res.items);
  } catch (error) {
    console.log(error)
  }
}
const handleRateClick = (consultation) => {
  setSelectedConsultant(consultation);
  setShowModal(true);
};
const handleSubmit = async () => {
  try {
    const feedback = {
          targetType: "Consultation",
      targetId: selectedConsultant.id,
       userId: selectedConsultant.userId,
      rating,
      comment,
    };
    const res = await FeedbackService.createFeedback(feedback);
    console.log(res);
    setShowModal(false);
    setSelectedConsultant(null);
    setRating(5);
    setComment('');
    toast.success('Đánh giá thành công');
  } catch (error) {
    console.error('Error submitting feedback:', error);
  }
};
  return (
    <div className="user-history-page">
      <div className="history-header">
        <h1>Lịch sử đặt lịch</h1>
        <p>Xem lại các lịch hẹn và xét nghiệm đã thực hiện</p>
      </div>

      <div className="history-tabs">
        <button 
          className={`tab-button ${activeTab === 'consultations' ? 'active' : ''}`}
          onClick={() => setActiveTab('consultations')}
        >
          <User size={20} />
          Tư vấn
        </button>
        <button 
          className={`tab-button ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => setActiveTab('tests')}
        >
          <FileText size={20} />
          Xét nghiệm
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-wrapper">
          <Filter size={18} />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Completed">Hoàn thành</option>
            <option value="Pending">Đang chờ</option>
            <option value="Cancelled">Đã hủy</option>
            <option value="upcoming">Sắp tới</option>
          </select>
        </div>
      </div>

      <div className="history-content">
        {activeTab === 'consultations' && (
          <div className="consultation-history">
            {consultantHis.length === 0 ? (
              <div className="empty-state">
                <User size={48} />
                <h3>Chưa có lịch tư vấn nào</h3>
                <p>Bạn chưa có lịch tư vấn nào trong lịch sử</p>
              </div>
            ) : (
              filteredConsultantHis.map((consultation) => (
                <div key={consultation.id} className="history-card">
                  <div className="card-header">
                    <div className="card-title">
                      <User size={20} />
                      <h3>{consultation.consultantFullName}</h3>
                    </div>
                    <span className={`status-badge ${getStatusColor(consultation.status)}`}>
                      {getStatusText(consultation.status)}
                    </span>
                  </div>
                  
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Nguyên nhân:</span>
                      <span className="value">{consultation.reason}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Ngày:</span>
                      <span className="value">
                        <Calendar size={16} />
                        {new Date(consultation.availableDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Giờ:</span>
                      <span className="value">
                        <Clock size={16} />
                        {consultation.slotStart}
                      </span>
                    </div>
                    
                  
                    
                    {consultation.result && (
                      <div className="info-row">
                        <span className="label">Kết quả:</span>
                        <span className="value">{consultation.result}</span>
                      </div>
                    )}
       {consultation.status === 'Completed' && (
  <div className="mt-4 flex justify-end">
    <button
      onClick={() => handleRateClick(consultation)}
      className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition-all"
    >
      Đánh giá 
    </button>
  </div>
)}

                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="test-history">
            {console.log('testHistory in render:', testHistory)}
            {testHistory.length === 0 ? (
              <div className="empty-state" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'300px',textAlign:'center'}}>
                <FileText size={48} />
                <h3>Chưa có lịch xét nghiệm nào</h3>
                <p>Bạn chưa có lịch xét nghiệm nào trong lịch sử</p>
              </div>
            ) : (
              testHistory.map((test) => {
                const pkg = testPackageDetails[test.healthTestId];
                return (
                  <div key={test.id} className="history-card">
                    <div className="card-header">
                      <div className="card-title">
                        <FileText size={20} />
                        <h3>{pkg ? pkg.name : 'Xét nghiệm'}</h3>
                      </div>
                    </div>
                    <div className="card-content">
                      {pkg && (
                        <>
                          <div className="info-row">
                            <span className="label">Mô tả:</span>
                            <span className="value">{pkg.description}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Giá:</span>
                            <span className="value">{formatVietnameseCurrencyVND(pkg.price)}</span>
                          </div>
                        </>
                      )}
                      <div className="info-row">
                        <span className="label">Ngày xét nghiệm:</span>
                        <span className="value">
                          <Calendar size={16} />
                          {new Date(test.testDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Giờ bắt đầu:</span>
                        <span className="value">{test.slotStart}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Giờ kết thúc:</span>
                        <span className="value">{test.slotEnd}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Ngày đặt:</span>
                        <span className="value">{test.bookedAt ? new Date(test.bookedAt).toLocaleString('vi-VN') : ''}</span>
                      </div>
                      <div className="info-row">
                        <button className="view-result-btn">Xem kết quả</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        
      </div>
      {showModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Đánh giá bác sĩ</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Số sao:</label>
        <select
          className="w-full border rounded-lg px-3 py-2"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((val) => (
            <option key={val} value={val}>{val} sao</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Bình luận:</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập nội dung đánh giá..."
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          Gửi đánh giá
        </button>
      </div>
    </div>
  </div>
)}

    </div>
    
  );
};

export default UserHistoryPage; 