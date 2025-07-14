import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Activity, Clock, Plus, TrendingUp, Moon, Sun, Eye, CalendarDays, BarChart3, History, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { CycleTrackingService } from '../../../services/CycleTrackingService';
import { AuthService } from '../../../services/AuthService';
import './MenstrualPage.scss';
// Remove ReactDatePicker import
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import ReactDatePicker from 'react-datepicker';

const MenstrualPage = () => {
  const [cycleData, setCycleData] = useState({
    startDate: '',
    cycleLength: '',
    periodLength: '',
    notes: ''
  });
  const [currentCycle, setCurrentCycle] = useState(null);
  const [cycleHistory, setCycleHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [cycleTrackingEnabled, setCycleTrackingEnabled] = useState(true); // Mặc định true để tránh disable nhầm khi chưa load
  const [cycleLengthError, setCycleLengthError] = useState('');
  const [periodLengthError, setPeriodLengthError] = useState('');

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Generate calendar days
  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  };

  // Calculate cycle information from form data
  const calculateCycleInfo = () => {
    if (!cycleData.startDate) return null;
    
    const startDate = new Date(cycleData.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + cycleData.periodLength - 1);
    
    // Calculate ovulation date (14 days before next period)
    const ovulationDate = new Date(startDate);
    ovulationDate.setDate(ovulationDate.getDate() + cycleData.cycleLength - 14);
    
    // Calculate fertile window (5 days before and 1 day after ovulation)
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ovulationDate: ovulationDate.toISOString(),
      fertileWindowStart: fertileStart.toISOString(),
      fertileWindowEnd: fertileEnd.toISOString(),
      cycleLength: cycleData.cycleLength,
      periodLength: cycleData.periodLength,
      notes: cycleData.notes
    };
  };

  // Helper to format date as yyyy-mm-dd (local, không lệch timezone)
  const toDateString = (d) => {
    const dateObj = new Date(d);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDayType = (date) => {
    const cycleInfo = currentCycle || calculateCycleInfo();
    if (!cycleInfo) return 'normal';
    
    const dateStr = toDateString(date);
    const startDate = toDateString(cycleInfo.startDate);
    const endDate = toDateString(cycleInfo.endDate);
    const fertileStart = toDateString(cycleInfo.fertileWindowStart);
    const fertileEnd = toDateString(cycleInfo.fertileWindowEnd);
    const ovulationDate = toDateString(cycleInfo.ovulationDate);
    
    // Check if date is in period
    if (dateStr >= startDate && dateStr <= endDate) return 'period';
    
    // Check if date is in fertile window
    if (dateStr >= fertileStart && dateStr <= fertileEnd) return 'fertile';
    
    // Check if date is ovulation
    if (dateStr === ovulationDate) return 'ovulation';
    
    return 'normal';
  };

  // Get access token from localStorage
  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  // Check if user is authenticated
  const checkAuthentication = () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa đăng nhập',
        text: 'Vui lòng đăng nhập để sử dụng tính năng này.',
        confirmButtonText: 'Đăng nhập',
        showCancelButton: false
      }).then(() => {
        window.location.href = '/login';
      });
      return false;
    }
    return true;
  };



  // API call to get all cycles
  const getAllCycles = async () => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        return [];
      }

      const cycles = await CycleTrackingService.getCycleHistory();
      return cycles;
    } catch (error) {
      console.error('Error fetching cycles:', error);
      if (error.message === 'Phiên đăng nhập hết hạn') {
        Swal.fire({
          icon: 'warning',
          title: 'Phiên đăng nhập hết hạn',
          text: 'Vui lòng đăng nhập lại để tiếp tục sử dụng.',
          confirmButtonText: 'Đăng nhập',
          showCancelButton: false
        }).then(() => {
          window.location.href = '/login';
        });
      }
      return [];
    }
  };

  // Load current cycle data on component mount
  useEffect(() => {
    const loadData = async () => {
      // Check authentication first
      if (!checkAuthentication()) {
        return;
      }
      
      setLoading(true);
      try {
        const [allCycles] = await Promise.all([
          getAllCycles()
        ]);
        setCycleHistory(allCycles);
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Đọc trạng thái cycleTracking từ API profile khi mount
  useEffect(() => {
    const readCycleTracking = async () => {
      try {
        const userProfile = await AuthService.getUserProfile();
        setCycleTrackingEnabled(userProfile.isCycleTrackingOn);
        console.log('[MenstrualPage] Cycle tracking status from server:', userProfile.isCycleTrackingOn);
      } catch (error) {
        console.error('[MenstrualPage] Error reading cycle tracking status:', error);
        setCycleTrackingEnabled(true); // fallback
      }
    };

    readCycleTracking();

    // Lắng nghe khi tab được focus (để đồng bộ khi chuyển tab hoặc vừa chỉnh ở trang cài đặt)
    const handleFocus = async () => {
      await readCycleTracking();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Log trạng thái toggle và button mỗi khi thay đổi
  useEffect(() => {
    console.log('[MenstrualPage] Trạng thái toggle (cycleTrackingEnabled):', cycleTrackingEnabled);
    console.log('[MenstrualPage] Trạng thái button Lưu thông tin (disabled):', !cycleTrackingEnabled);
  }, [cycleTrackingEnabled]);


  // Handle opening history modal
  const handleOpenHistoryModal = () => {
    setShowHistoryModal(true);
  };

  // Handle closing history modal
  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
  };



  // API call to create cycle tracking
  const createCycleTracking = async (cycleData) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi xác thực',
          text: 'Vui lòng đăng nhập lại!',
          confirmButtonText: 'Đồng ý'
        });
        return null;
      }

      const result = await CycleTrackingService.createCycleTracking(cycleData);
      return result;
    } catch (error) {
      console.error('Error creating cycle tracking:', error);
      if (error.message === 'Phiên đăng nhập hết hạn') {
        Swal.fire({
          icon: 'warning',
          title: 'Phiên đăng nhập hết hạn',
          text: 'Vui lòng đăng nhập lại để tiếp tục sử dụng.',
          confirmButtonText: 'Đăng nhập',
          showCancelButton: false
        }).then(() => {
          window.location.href = '/login';
        });
      }
      throw error;
    }
  };

  const handleSaveCycle = async () => {
    console.log('[MenstrualPage] handleSaveCycle - cycleTrackingEnabled:', cycleTrackingEnabled);
    
    // Nếu cycleTracking đang tắt, không cho lưu
    if (!cycleTrackingEnabled) {
      Swal.fire({
        icon: 'warning',
        title: 'Tính năng đang tắt',
        text: 'Bạn cần bật "Theo dõi chu kỳ" trong cài đặt để lưu thông tin!',
        confirmButtonText: 'Đồng ý'
      });
      return;
    }
    try {
      // Validate required fields
      if (!cycleData.startDate) {
        Swal.fire({
          icon: 'warning',
          title: 'Thiếu thông tin',
          text: 'Vui lòng chọn ngày bắt đầu chu kỳ!',
          confirmButtonText: 'Đồng ý'
        });
        return;
      }

      if (!cycleData.cycleLength || cycleData.cycleLength <= 20 || cycleData.cycleLength > 35) {
        Swal.fire({
          icon: 'warning',
          title: 'Thông tin không hợp lệ',
          text: 'Độ dài chu kỳ phải lớn hơn 20 và nhỏ hơn hoặc bằng 35 ngày!',
          confirmButtonText: 'Đồng ý'
        });
        return;
      }

      if (!cycleData.periodLength || cycleData.periodLength <= 1 || cycleData.periodLength > 10) {
        Swal.fire({
          icon: 'warning',
          title: 'Thông tin không hợp lệ',
          text: 'Số ngày kinh nguyệt phải lớn hơn 1 và nhỏ hơn hoặc bằng 10!',
          confirmButtonText: 'Đồng ý'
        });
        return;
      }

      // Kiểm tra ngày bắt đầu chỉ được là ngày hiện tại hoặc ngày mai
      const today = format(currentDate, 'yyyy-MM-dd');
      const tomorrow = format(addDays(currentDate, 1), 'yyyy-MM-dd');
      if (cycleData.startDate < today || cycleData.startDate > tomorrow) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Chỉ được chọn ngày hiện tại hoặc ngày mai!',
          confirmButtonText: 'Đồng ý'
        });
        return;
      }

      // --- Kiểm tra điều kiện đặc biệt ---
      // 1. Nếu ngày bắt đầu chu kỳ mới < upcomingPeriod
      let upcomingPeriod = null;
      if (cycleHistory && cycleHistory.length > 0) {
        // Lấy kỳ gần nhất (theo startDate lớn nhất)
        const sorted = [...cycleHistory].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        const latest = sorted[0];
        if (latest && latest.upcomingPeriod) {
          upcomingPeriod = new Date(latest.upcomingPeriod);
        }
      }
      const newStartDate = new Date(cycleData.startDate);
      if (upcomingPeriod && newStartDate < upcomingPeriod) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: `Ngày bắt đầu chu kỳ mới không được nhỏ hơn kỳ dự đoán sắp tới! (Ngày dự đoán: ${format(upcomingPeriod, 'dd/MM/yyyy')})`,
          confirmButtonText: 'Đồng ý'
        });
        return;
      }

      // 2. Nếu tháng của chu kỳ mới > tháng hiện tại
      const now = new Date();
      if (
        newStartDate.getFullYear() > now.getFullYear() ||
        (newStartDate.getFullYear() === now.getFullYear() && newStartDate.getMonth() > now.getMonth())
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể tạo chu kỳ cho tháng lớn hơn tháng hiện tại!',
          confirmButtonText: 'Đồng ý'
        });
        return;
      }
      // --- END kiểm tra ---

      // Show loading state
      Swal.fire({
        title: 'Đang lưu...',
        text: 'Vui lòng chờ trong giây lát',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      console.log('[MenstrualPage] Calling createCycleTracking with data:', cycleData);
      const result = await createCycleTracking(cycleData);
      console.log('[MenstrualPage] createCycleTracking result:', result);

      if (result) {
        // Update current cycle state and refresh cycle history
        setCurrentCycle(result);
        const updatedCycles = await getAllCycles();
        setCycleHistory(updatedCycles);
        
        // Close loading and show success with cycle details
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          html: `
            <div style="text-align: center; margin-top: 1rem;">
              <p><strong>Chu kỳ đã được tạo thành công!</strong></p>
            </div>
          `,
          confirmButtonText: 'Đồng ý',
          width: '500px'
        });

        // Reset form
        setCycleData({
          startDate: '',
          cycleLength: '',
          periodLength: '',
          notes: ''
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: `Không thể lưu thông tin chu kỳ. ${error.message}`,
        confirmButtonText: 'Đồng ý'
      });
    }
  };

  const days = generateCalendar();
  const monthNames = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
  ];

  // Calculate next cycle date
  const getNextCycleDate = () => {
    const cycleInfo = currentCycle || calculateCycleInfo();
    if (!cycleInfo) return null;
    const nextDate = new Date(cycleInfo.startDate);
    nextDate.setDate(nextDate.getDate() + cycleInfo.cycleLength);
    return nextDate;
  };

  // Get current cycle info for display
  const getDisplayCycleInfo = () => {
    return currentCycle || calculateCycleInfo();
  };

  // Helper: Tính ngày dự kiến kỳ kinh tiếp theo cho 1 chu kỳ
  const getUpcomingPeriodDate = (cycle) => {
    if (!cycle?.startDate || !cycle?.cycleLength) return null;
    const start = new Date(cycle.startDate);
    start.setDate(start.getDate() + Number(cycle.cycleLength));
    return start;
  };

  return (
    <div className="menstrual-period-tracker">
      <div className="menstrual-container">
        {/* Header */}
        <div className="menstrual-header">
          <div className="menstrual-header-content">
            <div className="menstrual-header-left">
              <div className="menstrual-header-icon">
                <Heart className="menstrual-icon" />
              </div>
              <div>
                <h1 className="menstrual-header-title">Theo dõi chu kỳ sinh sản</h1>
                <p className="menstrual-header-subtitle">Hiểu rõ hơn về cơ thể và sức khỏe của bạn</p>
              </div>
            </div>
            <div className="menstrual-header-right">
              <button 
                onClick={handleOpenHistoryModal}
                className="menstrual-history-button"
              >
                <History className="menstrual-history-button-icon" />
                <span>Xem lịch sử chu kỳ</span>
              </button>
            </div>
          </div>
        </div>

        <div className="menstrual-main-content">
          {/* Grid Layout: 2 rows x 2 columns */}
          <div className="menstrual-grid-layout">
            {/* Row 1, Column 1: Sidebar Section */}
            <div className="menstrual-sidebar-section">
              <h3 className="menstrual-section-title">Ghi nhận chu kỳ mới</h3>
              
              <div className="menstrual-input-group">
                <div className="menstrual-input-field">
                  <label className="menstrual-input-label">Ngày bắt đầu chu kỳ</label>
                  <ReactDatePicker
                    selected={cycleData.startDate ? new Date(cycleData.startDate) : null}
                    onChange={date => setCycleData({...cycleData, startDate: date ? format(date, 'yyyy-MM-dd') : ''})}
                    filterDate={date => {
                      const today = new Date();
                      const tomorrow = addDays(today, 1);
                      return (
                        date.toDateString() === today.toDateString() ||
                        date.toDateString() === tomorrow.toDateString()
                      );
                    }}
                    placeholderText="Chọn ngày bắt đầu chu kỳ"
                    dateFormat="yyyy-MM-dd"
                    className="menstrual-input"
                  />
                </div>
                
                <div className="menstrual-input-field">
                  <label className="menstrual-input-label">Độ dài chu kỳ (ngày)</label>
                  <input
                    type="number"
                    value={cycleData.cycleLength}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : '';
                      setCycleData({...cycleData, cycleLength: value});
                      if (value === '' || (value > 20 && value <= 35)) {
                        setCycleLengthError('');
                      } else {
                        setCycleLengthError('Độ dài chu kỳ phải lớn hơn 20 và nhỏ hơn hoặc bằng 35 ngày!');
                      }
                    }}
                    className="menstrual-input"
                    min="20"
                    max="45"
                    placeholder="Nhập độ dài chu kỳ (ngày)"
                  />
                  {cycleLengthError && (
                    <div style={{ color: 'red', fontSize: '0.9em', marginTop: 4 }}>{cycleLengthError}</div>
                  )}
                </div>
                
                <div className="menstrual-input-field">
                  <label className="menstrual-input-label">Số ngày kinh nguyệt</label>
                  <input
                    type="number"
                    value={cycleData.periodLength}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : '';
                      setCycleData({...cycleData, periodLength: value});
                      if (value === '' || (value > 1 && value <= 10)) {
                        setPeriodLengthError('');
                      } else {
                        setPeriodLengthError('Số ngày kinh nguyệt phải lớn hơn 1 và nhỏ hơn hoặc bằng 10!');
                      }
                    }}
                    className="menstrual-input"
                    min="1"
                    max="10"
                    placeholder="Nhập số ngày kinh (ngày)"
                  />
                  {periodLengthError && (
                    <div style={{ color: 'red', fontSize: '0.9em', marginTop: 4 }}>{periodLengthError}</div>
                  )}
                </div>

                <div className="menstrual-input-field">
                  <label className="menstrual-input-label">Ghi chú</label>
                  <textarea
                    value={cycleData.notes}
                    onChange={(e) => setCycleData({...cycleData, notes: e.target.value})}
                    className="menstrual-textarea"
                    placeholder="Ghi chú về chu kỳ này (tùy chọn)"
                    rows="3"
                  />
                </div>
                
                <button onClick={handleSaveCycle} className="menstrual-save-button" disabled={!cycleTrackingEnabled}>
                  <Plus className="menstrual-button-icon" />
                  <span>Lưu thông tin</span>
                </button>
              </div>


            </div>

            {/* Row 1, Column 2: Calendar Container */}
            <div className="menstrual-calendar-container">
              <div className="menstrual-calendar-header">
                <h2 className="menstrual-calendar-title">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <div className="menstrual-calendar-controls">
                  <button className="menstrual-control-button">
                    <svg className="menstrual-control-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="menstrual-control-button">
                    <svg className="menstrual-control-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="menstrual-calendar-weekdays">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                  <div key={day} className="menstrual-weekday">
                    {day}
                  </div>
                ))}
              </div>

              <div className="menstrual-calendar-grid">
                {days.map((date, index) => {
                  const dayType = getDayType(date);
                  const isCurrentMonth = date.getMonth() === currentMonth;
                  const isToday = date.toDateString() === currentDate.toDateString();
                  
                  return (
                    <button
                      key={index}
                      className={`menstrual-calendar-day ${dayType} ${isCurrentMonth ? 'menstrual-current-month' : 'menstrual-other-month'} ${isToday ? 'menstrual-today' : ''}`}
                    >
                      {date.getDate()}
                      {dayType === 'ovulation' && (
                        <div className="menstrual-ovulation-indicator"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="menstrual-calendar-legend">
                <div className="menstrual-legend-item">
                  <div className="menstrual-legend-indicator period"></div>
                  <span>Kỳ kinh nguyệt</span>
                </div>
                <div className="menstrual-legend-item">
                  <div className="menstrual-legend-indicator fertile"></div>
                  <span>Dễ thụ thai</span>
                </div>
                <div className="menstrual-legend-item">
                  <div className="menstrual-legend-indicator ovulation"></div>
                  <span>Ngày rụng trứng</span>
                </div>
              </div>
            </div>

            {/* Row 2, Column 1: Sidebar Section */}
            <div className="menstrual-sidebar-section">
              <h3 className="menstrual-section-title">Thông tin chu kỳ</h3>
              
              {loading ? (
                <div className="menstrual-loading">Đang tải thông tin...</div>
              ) : getDisplayCycleInfo() ? (
                <div className="menstrual-stats">
                  <div className="menstrual-stat-item period">
                    <div className="menstrual-stat-icon period">
                      <Heart className="menstrual-icon" />
                    </div>
                    <div>
                      <p className="menstrual-stat-title">Kỳ kinh nguyệt</p>
                      <p className="menstrual-stat-date">
                        {new Date(getDisplayCycleInfo().startDate).toLocaleDateString('vi-VN')} - {new Date(getDisplayCycleInfo().endDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="menstrual-stat-item fertile">
                    <div className="menstrual-stat-icon fertile">
                      <Activity className="menstrual-icon" />
                    </div>
                    <div>
                      <p className="menstrual-stat-title">Dễ thụ thai</p>
                      <p className="menstrual-stat-date">
                        {new Date(getDisplayCycleInfo().fertileWindowStart).toLocaleDateString('vi-VN')} - {new Date(getDisplayCycleInfo().fertileWindowEnd).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="menstrual-stat-item ovulation">
                    <div className="menstrual-stat-icon ovulation">
                      <Sun className="menstrual-icon" />
                    </div>
                    <div>
                      <p className="menstrual-stat-title">Ngày rụng trứng</p>
                      <p className="menstrual-stat-date">
                        {new Date(getDisplayCycleInfo().ovulationDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="menstrual-no-data">
                  <p>Chưa có thông tin chu kỳ</p>
                  <p>Vui lòng nhập thông tin để xem dự đoán</p>
                </div>
              )}
            </div>

            {/* Row 2, Column 2: Sidebar Section */}
            <div className="menstrual-sidebar-section">
              <h3 className="menstrual-section-title">Phân tích & Dự đoán</h3>
              
              {getDisplayCycleInfo() ? (
                <div className="menstrual-insights">
                  <div className="menstrual-insight-item cycle">
                    <div className="menstrual-insight-header">
                      <TrendingUp className="menstrual-insight-icon" />
                      <p className="menstrual-insight-title">Chu kỳ đều đặn</p>
                    </div>
                    <p className="menstrual-insight-text">
                      Chu kỳ của bạn có độ dài {getDisplayCycleInfo().cycleLength} ngày
                    </p>
                  </div>
                  
                  <div className="menstrual-insight-item next-cycle">
                    <div className="menstrual-insight-header">
                      <Moon className="menstrual-insight-icon" />
                      <p className="menstrual-insight-title">Chu kỳ tiếp theo</p>
                    </div>
                    <p className="menstrual-insight-text">
                      Dự kiến bắt đầu vào ngày {getNextCycleDate()?.toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  
                  {getDisplayCycleInfo().notes && (
                    <div className="menstrual-insight-item notes">
                      <div className="menstrual-insight-header">
                        <Clock className="menstrual-insight-icon" />
                        <p className="menstrual-insight-title">Ghi chú</p>
                      </div>
                      <p className="menstrual-insight-text">{getDisplayCycleInfo().notes}</p>
                    </div>
                  )}

                  {!currentCycle && (
                    <div className="menstrual-insight-item preview">
                      <div className="menstrual-insight-header">
                        <Plus className="menstrual-insight-icon" />
                        <p className="menstrual-insight-title">Xem trước</p>
                      </div>
                      <p className="menstrual-insight-text">
                        Đây là dự đoán dựa trên thông tin bạn đã nhập. Nhấn "Lưu thông tin" để lưu vào hệ thống.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="menstrual-no-data">
                  <p>Chưa có dữ liệu để phân tích</p>
                  <p>Vui lòng nhập thông tin chu kỳ để xem dự đoán</p>
                </div>
              )}
            </div>
          </div>



          {/* History Modal */}
          {showHistoryModal && (
            <div className="menstrual-modal-overlay" onClick={handleCloseHistoryModal}>
              <div className="menstrual-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="menstrual-modal-header">
                  <div className="menstrual-modal-title">
                    <BarChart3 className="menstrual-modal-icon" />
                    <h3>Bảng lịch sử chu kỳ</h3>
                  </div>
                  <button 
                    onClick={handleCloseHistoryModal}
                    className="menstrual-modal-close"
                  >
                    ×
                  </button>
                </div>
                
                <div className="menstrual-modal-body">
                  {cycleHistory.length > 0 ? (
                    <>
                      <div className="menstrual-modal-subtitle">
                        Tổng cộng {cycleHistory.length} chu kỳ đã được ghi nhận
                      </div>
                      <div className="menstrual-modal-table-container">
                        <table className="menstrual-modal-table">
                                                  <thead>
                          <tr>
                            <th>STT</th>
                            <th>Ngày bắt đầu</th>
                            <th>Ngày kết thúc</th>
                            <th>Độ dài chu kỳ</th>
                            <th>Số ngày kinh</th>
                            <th>Ngày rụng trứng</th>
                            <th>Dễ thụ thai</th>
                            <th>Kỳ kinh tiếp theo</th>
                            <th>Ghi chú</th>
                          </tr>
                        </thead>
                          <tbody>
                            {cycleHistory.map((cycle, index) => {
                              const startDate = new Date(cycle.startDate);
                              const endDate = new Date(cycle.endDate);
                              const ovulationDate = new Date(startDate);
                              ovulationDate.setDate(ovulationDate.getDate() + cycle.cycleLength - 14);
                              const fertileStart = new Date(ovulationDate);
                              fertileStart.setDate(fertileStart.getDate() - 5);
                              const fertileEnd = new Date(ovulationDate);
                              fertileEnd.setDate(fertileEnd.getDate() + 1);
                              const upcomingPeriod = getUpcomingPeriodDate(cycle);

                              return (
                                <tr key={cycle.id} className="menstrual-modal-table-row">
                                  <td className="menstrual-modal-table-cell">{cycleHistory.length - index}</td>
                                  <td className="menstrual-modal-table-cell">
                                    <div className="menstrual-date-cell">
                                      <CalendarDays size={14} />
                                      {startDate.toLocaleDateString('vi-VN')}
                                    </div>
                                  </td>
                                  <td className="menstrual-modal-table-cell">
                                    <div className="menstrual-date-cell">
                                      <CalendarDays size={14} />
                                      {endDate.toLocaleDateString('vi-VN')}
                                    </div>
                                  </td>
                                  <td className="menstrual-modal-table-cell">
                                    <span className="menstrual-cycle-length">{cycle.cycleLength} ngày</span>
                                  </td>
                                  <td className="menstrual-modal-table-cell">
                                    <span className="menstrual-period-length">{cycle.periodLength} ngày</span>
                                  </td>
                                  <td className="menstrual-modal-table-cell">
                                    <div className="menstrual-date-cell ovulation">
                                      <Sun size={14} />
                                      {ovulationDate.toLocaleDateString('vi-VN')}
                                    </div>
                                  </td>
                                  <td className="menstrual-modal-table-cell">
                                    <div className="menstrual-fertile-window">
                                      <span>{fertileStart.toLocaleDateString('vi-VN')}</span>
                                      <span className="menstrual-fertile-separator">-</span>
                                      <span>{fertileEnd.toLocaleDateString('vi-VN')}</span>
                                    </div>
                                  </td>
                                  <td className="menstrual-modal-table-cell">
                                    {upcomingPeriod ? upcomingPeriod.toLocaleDateString('vi-VN') : '-'}
                                  </td>
                                  <td className="menstrual-modal-table-cell">
                                    {cycle.notes ? (
                                      <span className="menstrual-notes-cell" title={cycle.notes}>
                                        {cycle.notes.length > 20 ? `${cycle.notes.substring(0, 20)}...` : cycle.notes}
                                      </span>
                                    ) : (
                                      <span className="menstrual-no-notes">-</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="menstrual-modal-empty">
                      <p>Chưa có lịch sử chu kỳ nào</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenstrualPage;
