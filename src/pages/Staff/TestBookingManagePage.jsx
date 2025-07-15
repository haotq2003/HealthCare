import React, { useEffect, useState } from 'react';
import { TestService } from '../../services/TestService';
import { formatVietnameseCurrencyVND } from '../../utils/currencyFormatter';
import './TestBookingManagePage.scss';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ImageUploader from '../../common/ImageUploader';
const MySwal = withReactContent(Swal);

const FIXED_RESULT_URL = "https://w7zbytrd10.ufs.sh/f/fnkloM7shIMipeBT8s4Lo9fDNC7QxjEYURZ8n2SbTa5isgWd";
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7276';

const TestBookingManagePage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // Để disable nút khi đang tải

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await TestService.getTestBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="test-booking-manage">
      <h2>Quản lý đăng ký xét nghiệm</h2>
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Tên gói xét nghiệm</th>
              <th>Giá tiền</th>
              <th>Ngày đặt</th>
              <th>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={7}>Không có dữ liệu</td></tr>
            ) : (
              bookings.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{item.customerName}</td>
                  <td>{item.customerPhone}</td>
                  <td>{item.customerEmail}</td>
                  <td>{item.healthTestName}</td>
                  <td>{formatVietnameseCurrencyVND(item.healthTestPrice)}</td>
                  <td>{item.testDate ? new Date(item.testDate).toLocaleDateString('vi-VN') : ''}</td>
                 <td>
  {item.resultUrl ? (
    <button onClick={() => window.open(item.resultUrl, '_blank')}>Xem kết quả</button>
  ) : (
    updatingId === item.id ? (
      <span>Đang tải...</span>
    ) : (
      <ImageUploader
        onImageUploaded={async (secureUrl) => {
          setUpdatingId(item.id);
          try {
            const accessToken = localStorage.getItem('accessToken');
            const res = await fetch(`${API_URL}/api/TestBookings/${item.id}/result-url`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ resultUrl: secureUrl }),
            });
            if (!res.ok) throw new Error('Cập nhật thất bại');

            MySwal.fire({
              icon: 'success',
              title: 'Thành công',
              text: 'Đã cập nhật kết quả xét nghiệm!',
              timer: 2000,
              showConfirmButton: false,
            });

            setBookings(prev =>
              prev.map(b => b.id === item.id ? { ...b, resultUrl: secureUrl } : b)
            );
          } catch (error) {
            MySwal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Không thể cập nhật kết quả!',
            });
          } finally {
            setUpdatingId(null);
          }
        }}
      />
    )
  )}
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TestBookingManagePage; 