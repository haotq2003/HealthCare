import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, FileText, Filter, Repeat } from 'lucide-react';
import './UserHistoryPage.scss';

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

  const [testHistory, setTestHistory] = useState([
    {
      id: 1,
      type: 'test',
      testName: 'Xét nghiệm máu tổng quát',
      date: '2024-01-12',
      time: '08:00',
      status: 'completed',
      location: 'Phòng xét nghiệm A',
      results: 'Kết quả bình thường'
    },
    {
      id: 2,
      type: 'test',
      testName: 'Xét nghiệm nước tiểu',
      date: '2024-01-08',
      time: '10:15',
      status: 'pending',
      location: 'Phòng xét nghiệm B',
      results: 'Đang chờ kết quả'
    }
  ]);

  // Cycle tracking state
  const [cycleHistory, setCycleHistory] = useState([]);
  const [loadingCycle, setLoadingCycle] = useState(false);
  const [cycleError, setCycleError] = useState(null);

  useEffect(() => {
    if (activeTab === 'cycles') {
      const fetchCycles = async () => {
        setLoadingCycle(true);
        setCycleError(null);
        try {
          const token = localStorage.getItem('accessToken');
          const res = await fetch('https://localhost:7276/api/CycleTracking', {
            headers: {
              'accept': '*/*',
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error('Không thể tải dữ liệu chu kỳ');
          const data = await res.json();
          setCycleHistory(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
          setCycleError(err.message);
        } finally {
          setLoadingCycle(false);
        }
      };
      fetchCycles();
    }
  }, [activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      case 'pending':
        return 'status-pending';
      case 'upcoming':
        return 'status-upcoming';
      default:
        return 'status-default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'pending':
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
        <button
          className={`tab-button ${activeTab === 'cycles' ? 'active' : ''}`}
          onClick={() => setActiveTab('cycles')}
        >
          <Repeat size={20} />
          Chu kỳ
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
            <option value="completed">Hoàn thành</option>
            <option value="pending">Đang chờ</option>
            <option value="cancelled">Đã hủy</option>
            <option value="upcoming">Sắp tới</option>
          </select>
        </div>
      </div>

      <div className="history-content">
        {activeTab === 'consultations' && (
          <div className="consultation-history">
            {filteredConsultations.length === 0 ? (
              <div className="empty-state">
                <User size={48} />
                <h3>Chưa có lịch tư vấn nào</h3>
                <p>Bạn chưa có lịch tư vấn nào trong lịch sử</p>
              </div>
            ) : (
              filteredConsultations.map((consultation) => (
                <div key={consultation.id} className="history-card">
                  <div className="card-header">
                    <div className="card-title">
                      <User size={20} />
                      <h3>{consultation.consultantName}</h3>
                    </div>
                    <span className={`status-badge ${getStatusColor(consultation.status)}`}>
                      {getStatusText(consultation.status)}
                    </span>
                  </div>
                  
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Chuyên khoa:</span>
                      <span className="value">{consultation.specialty}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Ngày:</span>
                      <span className="value">
                        <Calendar size={16} />
                        {new Date(consultation.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Giờ:</span>
                      <span className="value">
                        <Clock size={16} />
                        {consultation.time}
                      </span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Địa điểm:</span>
                      <span className="value">
                        <MapPin size={16} />
                        {consultation.location}
                      </span>
                    </div>
                    
                    {consultation.notes && (
                      <div className="info-row">
                        <span className="label">Ghi chú:</span>
                        <span className="value">{consultation.notes}</span>
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
            {filteredTests.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} />
                <h3>Chưa có xét nghiệm nào</h3>
                <p>Bạn chưa có xét nghiệm nào trong lịch sử</p>
              </div>
            ) : (
              filteredTests.map((test) => (
                <div key={test.id} className="history-card">
                  <div className="card-header">
                    <div className="card-title">
                      <FileText size={20} />
                      <h3>{test.testName}</h3>
                    </div>
                    <span className={`status-badge ${getStatusColor(test.status)}`}>
                      {getStatusText(test.status)}
                    </span>
                  </div>
                  
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Ngày:</span>
                      <span className="value">
                        <Calendar size={16} />
                        {new Date(test.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Giờ:</span>
                      <span className="value">
                        <Clock size={16} />
                        {test.time}
                      </span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Địa điểm:</span>
                      <span className="value">
                        <MapPin size={16} />
                        {test.location}
                      </span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Kết quả:</span>
                      <span className="value">{test.results}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'cycles' && (
          <div className="cycle-history">
            {loadingCycle ? (
              <div>Đang tải dữ liệu chu kỳ...</div>
            ) : cycleError ? (
              <div style={{ color: 'red' }}>{cycleError}</div>
            ) : cycleHistory.length === 0 ? (
              <div className="empty-state">
                <Repeat size={48} />
                <h3>Chưa có dữ liệu chu kỳ</h3>
                <p>Bạn chưa có lịch sử chu kỳ nào</p>
              </div>
            ) : (
              <div className="cycle-table-wrapper">
                <table className="cycle-table">
                  <thead>
                    <tr>
                      <th>Ngày bắt đầu</th>
                      <th>Ngày kết thúc</th>
                      <th>Độ dài chu kỳ</th>
                      <th>Độ dài kỳ kinh</th>
                      <th>Ngày rụng trứng</th>
                      <th>Cửa sổ thụ thai</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cycleHistory.map((cycle) => (
                      <tr key={cycle.id}>
                        <td>{cycle.startDate ? new Date(cycle.startDate).toLocaleDateString('vi-VN') : ''}</td>
                        <td>{cycle.endDate ? new Date(cycle.endDate).toLocaleDateString('vi-VN') : ''}</td>
                        <td>{cycle.cycleLength} ngày</td>
                        <td>{cycle.periodLength} ngày</td>
                        <td>{cycle.ovulationDate ? new Date(cycle.ovulationDate).toLocaleDateString('vi-VN') : ''}</td>
                        <td>
                          {cycle.fertileWindowStart && cycle.fertileWindowEnd
                            ? `${new Date(cycle.fertileWindowStart).toLocaleDateString('vi-VN')} - ${new Date(cycle.fertileWindowEnd).toLocaleDateString('vi-VN')}`
                            : ''}
                        </td>
                        <td>{cycle.notes || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHistoryPage; 