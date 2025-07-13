import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AcceptDoctor = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      const res = await axios.get('https://localhost:7276/api/Admin/users', {
        params: { ConsultantStatus: 0 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      setPendingDoctors(res.data.data.items);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bác sĩ chờ duyệt:', error);
      toast.error("Không thể lấy danh sách bác sĩ.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (consultantId) => {
    try {
      const res = await axios.put(
        `https://localhost:7276/api/Admin/${consultantId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      toast.success( 'Duyệt thành công');

      // Cập nhật lại danh sách sau khi duyệt
      setPendingDoctors((prev) =>
        prev.filter((doctor) => doctor.id !== consultantId)
      );
    } catch (error) {
      console.error('Lỗi khi duyệt bác sĩ:', error);
      toast.error('Duyệt thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Danh sách bác sĩ chờ duyệt</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : pendingDoctors.length === 0 ? (
        <p>Không có bác sĩ nào chờ duyệt.</p>
      ) : (
        <ul className="space-y-4">
          {pendingDoctors.map((doctor) => (
            <li key={doctor.id} className="bg-white shadow p-4 rounded-lg">
              <p><strong>Họ tên:</strong> {doctor.name || doctor.fullName}</p>
              <p><strong>Email:</strong> {doctor.email}</p>
              <p><strong>Số điện thoại:</strong> {doctor.phoneNumber}</p>

              <button
                onClick={() => handleApprove(doctor.id)}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
              >
                Chấp nhận
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AcceptDoctor;
