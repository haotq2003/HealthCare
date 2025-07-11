import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import './UserSettingPage.scss';

// Global flag để tránh load localStorage nhiều lần trong React StrictMode
let globalSettingsLoaded = false;

const UserSettingPage = () => {
  const componentIdRef = useRef(Math.random().toString(36).substr(2, 9));
  console.log(`UserSettingPage component mounted with ID: ${componentIdRef.current}`);
  
  const [settings, setSettings] = useState({
    notifications: {
      appointmentReminders: true,
      cycleTracking: false
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Use ref to store sync function to avoid dependency issues
  const syncSettingsFromServerRef = useRef();
  const isSyncingRef = useRef(false);
  const hasLoadedRef = useRef(false);
  const settingsLoadedRef = useRef(false); // Thêm ref để track việc đã load settings

  // Function to sync settings from server
  const syncSettingsFromServer = useCallback(async () => {
    if (isSyncingRef.current) {
      console.log(`[${componentIdRef.current}] Already syncing, skipping...`);
      return;
    }
    
    isSyncingRef.current = true;
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.log(`[${componentIdRef.current}] No access token, skipping server sync`);
        return;
      }

      // XÓA toàn bộ các đoạn fetch('https://localhost:7276/api/CycleTracking/status', ...) và các useEffect, biến, hàm liên quan đến việc gọi API này.
      
    } catch (error) {
      console.error(`[${componentIdRef.current}] Error syncing settings from server:`, error);
      // Don't throw error, just log it
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  // Store sync function in ref
  syncSettingsFromServerRef.current = syncSettingsFromServer;

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings && parsedSettings.notifications) {
          // Merge với default settings để đảm bảo có đầy đủ các field
          const mergedSettings = {
            notifications: {
              appointmentReminders: true,
              cycleTracking: false,
              ...parsedSettings.notifications
            }
          };
          setSettings(mergedSettings);
        } else {
          setSettings({
            notifications: {
              appointmentReminders: true,
              cycleTracking: false
            }
          });
        }
      } else {
        setSettings({
          notifications: {
            appointmentReminders: true,
            cycleTracking: false
          }
        });
      }
    } catch (error) {
      setSettings({
        notifications: {
          appointmentReminders: true,
          cycleTracking: false
        }
      });
    }
    // Cleanup function
    return () => {
      console.log(`[${componentIdRef.current}] Cleanup function called`);
    };
  }, []);

  // Separate useEffect for server sync to avoid dependency issues
  useEffect(() => {
    // Delay server sync to ensure component is fully mounted
    const timer = setTimeout(() => {
      if (syncSettingsFromServerRef.current) {
        syncSettingsFromServerRef.current();
      }
    }, 500); // Tăng delay lên 500ms
    
    return () => clearTimeout(timer);
  }, []);

  // Debug: Log current settings
  useEffect(() => {
    console.log(`[${componentIdRef.current}] Current settings state:`, settings);
  }, [settings]);

  // Debug: Log component lifecycle
  useEffect(() => {
    return () => {
      console.log(`UserSettingPage component unmounted with ID: ${componentIdRef.current}`);
    };
  }, []);

  // Function to reset settings to default
  const resetSettings = () => {
    const defaultSettings = {
      notifications: {
        appointmentReminders: true,
        cycleTracking: false
      }
    };
    setSettings(defaultSettings);
  };

  // Function to clear localStorage for debugging
  const clearLocalStorage = () => {
    localStorage.removeItem('userSettings');
    globalSettingsLoaded = false; // Reset global flag
    console.log(`[${componentIdRef.current}] LocalStorage cleared and global flag reset`);
  };

  // Function to force sync with localStorage
  const forceSync = () => {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      console.log(`[${componentIdRef.current}] Force syncing with localStorage:`, savedSettings);
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings && parsedSettings.notifications) {
          const newSettings = {
            notifications: {
              appointmentReminders: true,
              cycleTracking: false,
              ...parsedSettings.notifications
            }
          };
          setSettings(newSettings);
          console.log(`[${componentIdRef.current}] Force sync completed:`, newSettings);
        }
      }
    } catch (error) {
      console.error(`[${componentIdRef.current}] Error in force sync:`, error);
    }
  };

  // Function to log current state and localStorage
  const logCurrentState = () => {
    const savedSettings = localStorage.getItem('userSettings');
    console.log(`[${componentIdRef.current}] Current state:`, settings);
    console.log(`[${componentIdRef.current}] localStorage:`, savedSettings);
    console.log(`[${componentIdRef.current}] settingsLoadedRef.current:`, settingsLoadedRef.current);
  };

  // Function to test toggle switch
  const testToggle = () => {
    console.log(`[${componentIdRef.current}] Testing toggle switch...`);
    console.log(`[${componentIdRef.current}] Current cycleTracking:`, settings.notifications.cycleTracking);
    
    // Toggle cycleTracking
    const newValue = !settings.notifications.cycleTracking;
    console.log(`[${componentIdRef.current}] Toggling to:`, newValue);
    
    handleNotificationChange('cycleTracking', newValue);
  };

  // Function to test toggle without API
  const testToggleNoAPI = () => {
    console.log(`[${componentIdRef.current}] Testing toggle without API...`);
    console.log(`[${componentIdRef.current}] Current appointmentReminders:`, settings.notifications.appointmentReminders);
    
    // Toggle appointmentReminders (không gọi API)
    const newValue = !settings.notifications.appointmentReminders;
    console.log(`[${componentIdRef.current}] Toggling to:`, newValue);
    
    handleNotificationChange('appointmentReminders', newValue);
  };

  // API call to enable/disable cycle tracking
  const updateCycleTracking = async (isEnabled) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi xác thực',
          text: 'Vui lòng đăng nhập lại!',
          confirmButtonText: 'Đồng ý'
        });
        return false;
      }

      const response = await fetch(`https://localhost:7276/api/CycleTracking/enable-tracking?isEnabled=${isEnabled}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra khi cập nhật cài đặt');
      }
    } catch (error) {
      console.error('Error updating cycle tracking:', error);
      throw error;
    }
  };

  const handleNotificationChange = async (key, value) => {
    const oldValue = settings.notifications[key];
    console.log(`[${componentIdRef.current}] Changing ${key} from ${oldValue} to ${value}`);
    console.log(`[${componentIdRef.current}] Current settings before change:`, settings);
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    };
    setSettings(newSettings);
    // KHÔNG lưu vào localStorage nữa
    try {
      let success = true;
      if (key === 'cycleTracking') {
        success = await updateCycleTracking(value);
      }
      if (success) {
        console.log(`[${componentIdRef.current}] Successfully updated ${key} to ${value}`);
        const notificationType = key === 'appointmentReminders' ? 'Nhắc nhở lịch hẹn' : 'Theo dõi chu kỳ';
        const status = value ? 'bật' : 'tắt';
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: `${notificationType} đã được ${status}!`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } else {
        console.log(`[${componentIdRef.current}] Failed to update ${key}, reverting to ${oldValue}`);
        const revertedSettings = {
          ...settings,
          notifications: {
            ...settings.notifications,
            [key]: oldValue
          }
        };
        setSettings(revertedSettings);
      }
    } catch (error) {
      console.log(`[${componentIdRef.current}] Error updating ${key}, reverting to ${oldValue}:`, error);
      const revertedSettings = {
        ...settings,
        notifications: {
          ...settings.notifications,
          [key]: oldValue
        }
      };
      setSettings(revertedSettings);
      const notificationType = key === 'appointmentReminders' ? 'Nhắc nhở lịch hẹn' : 'Theo dõi chu kỳ';
      const status = value ? 'bật' : 'tắt';
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: `Không thể ${status} ${notificationType.toLowerCase()}. ${error.message}`,
        confirmButtonText: 'Đồng ý'
      });
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    if (password.length < minLength) errors.push(`Ít nhất ${minLength} ký tự`);
    if (!hasUpperCase) errors.push('Có ít nhất 1 chữ hoa');
    if (!hasLowerCase) errors.push('Có ít nhất 1 chữ thường');
    if (!hasNumbers) errors.push('Có ít nhất 1 số');
    if (!hasSpecialChar) errors.push('Có ít nhất 1 ký tự đặc biệt');
    
    return errors;
  };

  const handlePasswordUpdate = async () => {
    try {
      // Validate current password (in real app, this would check against server)
      if (!passwords.current) {
        Swal.fire({
          icon: 'warning',
          title: 'Thiếu thông tin',
          text: 'Vui lòng nhập mật khẩu hiện tại!',
          confirmButtonText: 'Đồng ý'
        });
        return;
      }
      
      // Validate new password
      const passwordErrors = validatePassword(passwords.new);
      if (passwordErrors.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Mật khẩu không đủ mạnh',
          html: passwordErrors.map(error => `• ${error}`).join('<br>'),
          confirmButtonText: 'Đồng ý'
        });
        return;
      }
      
      // Check if passwords match
      if (passwords.new !== passwords.confirm) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi xác nhận',
          text: 'Mật khẩu mới không khớp!',
          confirmButtonText: 'Đồng ý'
        });
        return;
      }
      
      // Check if new password is different from current
      if (passwords.current === passwords.new) {
        Swal.fire({
          icon: 'warning',
          title: 'Mật khẩu không hợp lệ',
          text: 'Mật khẩu mới phải khác mật khẩu hiện tại!',
          confirmButtonText: 'Đồng ý'
        });
        return;
      }
      
      // Show loading state
      Swal.fire({
        title: 'Đang cập nhật...',
        text: 'Vui lòng chờ trong giây lát',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Here you would typically make an API call to update the password
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close loading and show success
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Mật khẩu đã được cập nhật thành công!',
        confirmButtonText: 'Đồng ý'
      });
      
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại!',
        confirmButtonText: 'Đồng ý'
      });
    }
  };

  const renderToggle = (label, value, onChange, icon = null) => {
    console.log(`[${componentIdRef.current}] Rendering toggle for ${label}:`, value);
    return (
      <div className="setting-item">
        <div className="setting-label">
          {icon && <span className="setting-icon">{icon}</span>}
          <span>{label}</span>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    );
  };

  // Sync state with localStorage when component mounts
  useEffect(() => {
    const syncWithLocalStorage = () => {
      try {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          if (parsedSettings && parsedSettings.notifications) {
            // Chỉ cập nhật nếu settings khác với state hiện tại
            setSettings(prev => {
              const newSettings = {
                notifications: {
                  appointmentReminders: true,
                  cycleTracking: false,
                  ...parsedSettings.notifications
                }
              };
              
              // So sánh settings cũ và mới
              const hasChanged = 
                prev.notifications.appointmentReminders !== newSettings.notifications.appointmentReminders ||
                prev.notifications.cycleTracking !== newSettings.notifications.cycleTracking;
              
              if (hasChanged) {
                console.log(`[${componentIdRef.current}] Settings changed, updating state:`, newSettings);
                return newSettings;
              }
              
              return prev;
            });
          }
        }
      } catch (error) {
        console.error(`[${componentIdRef.current}] Error syncing with localStorage:`, error);
      }
    };

    // Sync ngay khi component mount
    syncWithLocalStorage();
    
    // Thêm event listener để sync khi localStorage thay đổi từ tab khác
    const handleStorageChange = (e) => {
      if (e.key === 'userSettings') {
        console.log(`[${componentIdRef.current}] localStorage changed, syncing...`);
        syncWithLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="user-setting-page">
      <div className="setting-header">
        <h1>Cài đặt tài khoản</h1>
        <p>Quản lý cài đặt và tùy chọn cá nhân</p>
      </div>

      <div className="setting-content">
        {/* Notifications Section */}
        <div className="setting-section">
          <div className="section-header">
            <Bell size={24} />
            <h2>Thông báo</h2>
          </div>
          <div className="setting-grid">
            {renderToggle('Nhắc nhở lịch hẹn', settings.notifications.appointmentReminders, 
              (value) => handleNotificationChange('appointmentReminders', value))}
            {renderToggle('Theo dõi chu kỳ', settings.notifications.cycleTracking, 
              (value) => handleNotificationChange('cycleTracking', value))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingPage; 