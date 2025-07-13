import React, { useState } from "react";
import { Search, Plus, Edit, Eye, FlaskConical, Clock, DollarSign } from "lucide-react";
import "./PackagePage.scss";
import axios from 'axios';
import { API_URL } from '../../config/apiURL';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { formatVietnameseCurrencyDong } from '../../utils/currencyFormatter';

const DEFAULT_BADGE = "Xét nghiệm";
const DEFAULT_BADGE_COLOR = "#3b82f6";

const PackagePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [active, setActive] = useState(true);
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: '', desc: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editPackage, setEditPackage] = useState({ id: '', name: '', desc: '', price: '' });
  const [search, setSearch] = useState("");
  const searchTimeout = React.useRef();

  React.useEffect(() => {
    const fetchPackages = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/api/HealthTest`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': '*/*',
          },
        });
        // Map API data to UI format
        const data = response.data.map(pkg => ({
          id: pkg.id,
          name: pkg.name,
          desc: pkg.description,
          price: pkg.price,
          time: pkg.createdTime ? (() => {
            const d = new Date(pkg.createdTime);
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const year = d.getFullYear();
            const hour = d.getHours().toString().padStart(2, '0');
            const minute = d.getMinutes().toString().padStart(2, '0');
            return `${day}/${month}/${year} ${hour}:${minute}`;
          })() : '',
          badge: DEFAULT_BADGE,
          badgeColor: DEFAULT_BADGE_COLOR,
        }));
        setPackages(data);
      } catch {
        setPackages([]);
      }
    };
    fetchPackages();
  }, []);

  const handleViewDetail = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetailModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPackage(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPackage = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post(`${API_URL}/api/HealthTest`, {
        name: newPackage.name,
        description: newPackage.desc,
        price: Number(newPackage.price)
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });
      setShowModal(false);
      setNewPackage({ name: '', desc: '', price: '' });
      // Reload list
      const response = await axios.get(`${API_URL}/api/HealthTest`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': '*/*',
        },
      });
      const data = response.data.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        desc: pkg.description,
        price: pkg.price,
        time: pkg.createdTime ? (() => {
          const d = new Date(pkg.createdTime);
          const day = d.getDate().toString().padStart(2, '0');
          const month = (d.getMonth() + 1).toString().padStart(2, '0');
          const year = d.getFullYear();
          const hour = d.getHours().toString().padStart(2, '0');
          const minute = d.getMinutes().toString().padStart(2, '0');
          return `${day}/${month}/${year} ${hour}:${minute}`;
        })() : '',
        badge: DEFAULT_BADGE,
        badgeColor: DEFAULT_BADGE_COLOR,
      }));
      setPackages(data);
      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Thêm gói xét nghiệm thành công!' });
    } catch {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Thêm gói xét nghiệm thất bại!' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (pkg) => {
    setEditPackage({ id: pkg.id, name: pkg.name, desc: pkg.desc, price: pkg.price });
    setEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditPackage(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePackage = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(`${API_URL}/api/HealthTest/${editPackage.id}`, {
        name: editPackage.name,
        description: editPackage.desc,
        price: Number(editPackage.price)
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });
      setEditModal(false);
      setEditPackage({ id: '', name: '', desc: '', price: '' });
      // Reload list
      const response = await axios.get(`${API_URL}/api/HealthTest`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': '*/*',
        },
      });
      const data = response.data.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        desc: pkg.description,
        price: pkg.price,
        time: pkg.createdTime ? (() => {
          const d = new Date(pkg.createdTime);
          const day = d.getDate().toString().padStart(2, '0');
          const month = (d.getMonth() + 1).toString().padStart(2, '0');
          const year = d.getFullYear();
          const hour = d.getHours().toString().padStart(2, '0');
          const minute = d.getMinutes().toString().padStart(2, '0');
          return `${day}/${month}/${year} ${hour}:${minute}`;
        })() : '',
        badge: DEFAULT_BADGE,
        badgeColor: DEFAULT_BADGE_COLOR,
      }));
      setPackages(data);
      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Cập nhật gói xét nghiệm thành công!' });
    } catch {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Cập nhật gói xét nghiệm thất bại!' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchSearch(value);
    }, 400);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      fetchSearch(search);
    }
  };

  const fetchSearch = async (keyword) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      let response;
      if (!keyword.trim()) {
        response = await axios.get(`${API_URL}/api/HealthTest`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': '*/*',
          },
        });
      } else {
        response = await axios.get(`${API_URL}/api/HealthTest/search?keyword=${encodeURIComponent(keyword)}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': '*/*',
          },
        });
      }
      const data = response.data.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        desc: pkg.description,
        price: pkg.price,
        time: pkg.createdTime ? (() => {
          const d = new Date(pkg.createdTime);
          const day = d.getDate().toString().padStart(2, '0');
          const month = (d.getMonth() + 1).toString().padStart(2, '0');
          const year = d.getFullYear();
          const hour = d.getHours().toString().padStart(2, '0');
          const minute = d.getMinutes().toString().padStart(2, '0');
          return `${day}/${month}/${year} ${hour}:${minute}`;
        })() : '',
        badge: DEFAULT_BADGE,
        badgeColor: DEFAULT_BADGE_COLOR,
      }));
      setPackages(data);
    } catch {
      setPackages([]);
    }
  };

  return (
    <div className="hc-package-page">
      <div className="hc-package-header">
        <div>
          <h2>Quản lý gói xét nghiệm</h2>
          <div className="hc-package-sub">Tạo và quản lý các gói xét nghiệm của phòng khám</div>
        </div>
        <button className="hc-package-add-btn" onClick={() => setShowModal(true)}><Plus size={18} /> Thêm gói mới</button>
      </div>
      <div className="hc-package-filter-box">
        <div className="hc-package-filter-title"><Search size={18} /> Bộ lọc & Tìm kiếm</div>
        <div className="hc-package-filter-row">
          <input className="hc-package-search" placeholder="Tìm kiếm theo tên gói..." value={search} onChange={handleSearchChange} onKeyDown={handleSearchKeyDown} />
        </div>
      </div>
      <div className="hc-package-main">
        <div className="hc-package-list">
          <div className="hc-package-list-title"><FlaskConical size={18} /> Gói xét nghiệm ({packages.length})</div>
          <div className="hc-package-card-list">
            {packages.map(pkg => {
              const initials = "HC";
              return (
                <div className="hc-package-card" key={pkg.id}>
                  <div className="hc-package-card-header">
                    <div className="hc-package-avatar">{initials}</div>
                    <div className="hc-package-card-main">
                      <div className="hc-package-title">{pkg.name}</div>
                    </div>
                  </div>
                  <div className="hc-package-card-info-grid">
                    <div className="hc-package-card-row">
                      <span className="hc-package-icon"><Clock size={16} /></span>
                      <span>Thời gian tạo: {pkg.time}</span>
                    </div>
                    <div className="hc-package-card-row">
                      <span className="hc-package-icon"><DollarSign size={16} /></span>
                      <span>Giá: {formatVietnameseCurrencyDong(pkg.price)}</span>
                    </div>
                    <div className="hc-package-card-row">
                      <span className="hc-package-icon"><FlaskConical size={16} /></span>
                      <span>Loại: {pkg.badge}</span>
                    </div>
                    <div className="hc-package-card-row">
                      <span className="hc-package-icon"><Eye size={16} /></span>
                      <span>Mô tả: {pkg.desc}</span>
                    </div>
                  </div>
                  {/* Removed action buttons */}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPackage && (
        <div className="hc-modal-bg" onClick={e => { if (e.target === e.currentTarget) setShowDetailModal(false); }}>
          <div className="hc-modal">
            <div className="hc-modal-title">
              <FlaskConical size={18} style={{marginRight: 8}} />
              Chi tiết gói xét nghiệm
            </div>
            <div className="hc-modal-form">
              <div className="hc-modal-row">
                <div className="hc-modal-col">
                  <label>Tên gói xét nghiệm</label>
                  <div className="hc-modal-value">{selectedPackage.name}</div>
                </div>
                <div className="hc-modal-col">
                  <label>Thời gian tạo gói</label>
                  <div className="hc-modal-value">{selectedPackage.time}</div>
                </div>
              </div>
              <div className="hc-modal-row">
                <div className="hc-modal-col">
                  <label>Giá</label>
                  <div className="hc-modal-value">{formatVietnameseCurrencyDong(selectedPackage.price)}</div>
                </div>
              </div>
              <div className="hc-modal-row">
                <div className="hc-modal-col-full">
                  <label>Mô tả</label>
                  <div className="hc-modal-value">{selectedPackage.desc}</div>
                </div>
              </div>
              <div className="hc-modal-actions">
                <button className="hc-btn hc-btn-light" onClick={() => setShowDetailModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      {showModal && (
        <div className="hc-modal-bg" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="hc-modal">
            <div className="hc-modal-title">Tạo gói xét nghiệm mới</div>
            <div className="hc-modal-form">
              <div className="hc-modal-row">
                <div className="hc-modal-col">
                  <label>Tên gói xét nghiệm</label>
                  <input type="text" name="name" value={newPackage.name} onChange={handleInputChange} placeholder="Nhập tên gói xét nghiệm" />
                </div>
                <div className="hc-modal-col">
                  <label>Giá (VNĐ)</label>
                  <input type="number" name="price" value={newPackage.price} onChange={handleInputChange} placeholder="Nhập giá" />
                </div>
              </div>
              <div className="hc-modal-row">
                <div className="hc-modal-col-full">
                  <label>Mô tả</label>
                  <textarea name="desc" value={newPackage.desc} onChange={handleInputChange} placeholder="Nhập mô tả chi tiết gói xét nghiệm" rows={2}></textarea>
                </div>
              </div>
              <div className="hc-modal-actions">
                <button className="hc-btn hc-btn-light" onClick={() => setShowModal(false)}>Hủy</button>
                <button className="hc-btn hc-btn-primary" onClick={handleAddPackage} disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {editModal && (
        <div className="hc-modal-bg" onClick={e => { if (e.target === e.currentTarget) setEditModal(false); }}>
          <div className="hc-modal">
            <div className="hc-modal-title">Sửa gói xét nghiệm</div>
            <div className="hc-modal-form">
              <div className="hc-modal-row">
                <div className="hc-modal-col">
                  <label>Tên gói xét nghiệm</label>
                  <input type="text" name="name" value={editPackage.name} onChange={handleEditInputChange} placeholder="Nhập tên gói xét nghiệm" />
                </div>
                <div className="hc-modal-col">
                  <label>Giá (VNĐ)</label>
                  <input type="number" name="price" value={editPackage.price} onChange={handleEditInputChange} placeholder="Nhập giá" />
                </div>
              </div>
              <div className="hc-modal-row">
                <div className="hc-modal-col-full">
                  <label>Mô tả</label>
                  <textarea name="desc" value={editPackage.desc} onChange={handleEditInputChange} placeholder="Nhập mô tả chi tiết gói xét nghiệm" rows={2}></textarea>
                </div>
              </div>
              <div className="hc-modal-actions">
                <button className="hc-btn hc-btn-light" onClick={() => setEditModal(false)}>Hủy</button>
                <button className="hc-btn hc-btn-primary" onClick={handleUpdatePackage} disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagePage; 