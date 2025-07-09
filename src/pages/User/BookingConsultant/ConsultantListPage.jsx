import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import ConsultantHeader from "../../../components/User/ConsultantHeader";
import ConsultantCard from "../../../components/User/Consultant/ConsultantCard";
import "./ConsultantListPage.scss";
import { ConsultantService } from "../../../services/ConsultantService";

const consultants = [
  {
    id: 1,
    name: "TS. Nguyễn Thị Lan",
    specialty: "Sức khỏe tâm thần",
    experience: 18,
    rating: 5,
    desc: "Chuyên gia tâm lý tình dục hàng đầu. Tư vấn về các vấn đề tâm lý liên quan đến tình dục, hôn nhân và các rối loạn tình dục.",
  },
  {
    id: 2,
    name: "BS. Nguyễn Thị Hoa",
    specialty: "Sức khỏe sinh sản",
    experience: 12,
    rating: 4.9,
    desc: "Chuyên gia hàng đầu về sức khỏe sinh sản phụ nữ với hơn 12 năm kinh nghiệm.",
  },
  {
    id: 3,
    name: "BS. Phạm Văn Đức",
    specialty: "Kế hoạch hóa gia đình",
    experience: 15,
    rating: 4.9,
    desc: "Chuyên gia kế hoạch hóa gia đình với kinh nghiệm lâu năm. Tư vấn về các phương pháp tránh thai, sức khỏe sinh sản.",
  },
  {
    id: 4,
    name: "BS. Trần Minh Tuấn",
    specialty: "Tư vấn STIs",
    experience: 8,
    rating: 4.8,
    desc: "Chuyên gia tư vấn về các bệnh lây truyền qua đường tình dục. Kinh nghiệm phong phú trong việc chẩn đoán, điều trị.",
  },
  {
    id: 5,
    name: "ThS. Lê Thị Mai",
    specialty: "Giáo dục giới tính",
    experience: 10,
    rating: 4.7,
    desc: "Chuyên gia giáo dục giới tính với phương pháp tư vấn hiện đại. Giúp các bạn trẻ kiến thức đúng đắn về giới tính.",
  },
];


const specialties = [
  "Tất cả chuyên môn",
  ...Array.from(new Set(consultants.map((c) => c.specialty))),
];

const ConsultantListPage = () => {
  const [filter, setFilter] = useState("Tất cả chuyên môn");
  const navigate = useNavigate();
  const filtered = filter === "Tất cả chuyên môn" ? consultants : consultants.filter(c => c.specialty === filter);
  const [consultant, setConsultant] = useState([]);
useEffect(()=>{
fetchConsultants()
  },[])

  const fetchConsultants = async () =>{
    try {
      const res = await ConsultantService.getConsultantList();
      console.log(res)
         setConsultant(res.items);
    } catch (error) {
      console.error("Error fetching consultant list:", error);
    }
  }
  return (
    <div className="consultant-list-page">
      <ConsultantHeader activeStep={1} />

      {/* <div className="filter-box">
        <Filter size={16} />
        <span>Tìm kiếm chuyên gia</span>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          {specialties.map(s => <option key={s}>{s}</option>)}
        </select>
      </div> */}
      
    <div className="consultant-list">
  {Array.isArray(consultant) &&
    consultant.map(c => (
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