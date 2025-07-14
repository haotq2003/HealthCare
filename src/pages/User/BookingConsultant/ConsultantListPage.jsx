import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConsultantHeader from "../../../components/User/ConsultantHeader";
import ConsultantCard from "../../../components/User/Consultant/ConsultantCard";
import { ConsultantService } from "../../../services/ConsultantService";

const ConsultantListPage = () => {
  const [consultants, setConsultants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      const res = await ConsultantService.getConsultantList();
      setConsultants(res.items || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách tư vấn viên:", error);
    }
  };

  return (
    <div className="consultant-list-page px-6 py-8 max-w-7xl mx-auto">
      {/* Header dạng step (giống chọn xét nghiệm) */}
      <ConsultantHeader activeStep={1} />

      {/* Tiêu đề chọn chuyên gia */}
      <h2 className="text-center text-xl font-semibold text-gray-800 mt-5 mb-5">
        Chọn chuyên gia phù hợp và đặt lịch thực hiện với quy trình chuyên nghiệp
      </h2>

      {/* Danh sách tư vấn viên */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {consultants.map((c) => (
          <ConsultantCard
            key={c.id}
            consultant={c}
            onClick={() => navigate(`/user/booking/${c.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ConsultantListPage;
