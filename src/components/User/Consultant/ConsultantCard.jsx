import React from "react";
import { UserCheck, Star, Clock, ArrowRight } from "lucide-react";
import "./ConsultantCard.scss";

const ConsultantCard = ({ consultant, onClick }) => (
  <div className="consultant-card">
    <div className="avatar">
      <UserCheck size={28} />
      <div className="online-status"></div>
    </div>
    <div className="info">
      <div className="name">{consultant.fullName}</div>
      <div className="specialty">{consultant.bio}</div>
      <div className="desc">{consultant.degree}</div>
      <div className="meta">
        <span className="rating">
          <Star size={12} fill="currentColor" /> {consultant.rating}
        </span>
        <span className="exp">
          <Clock size={12} /> {consultant.experienceYears} năm KN
        </span>
      </div>
    </div>
    <button className="book-btn" onClick={onClick}>
      Xem hồ sơ & đặt lịch <ArrowRight size={14} />
    </button>
  </div>
);

export default ConsultantCard;