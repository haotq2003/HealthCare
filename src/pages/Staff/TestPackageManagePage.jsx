import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const initialPackages = [
  { id: 1, name: 'Gói Xét Nghiệm A', desc: 'Mô tả A', price: 500000, status: 'Đang hoạt động' },
  { id: 2, name: 'Gói Xét Nghiệm B', desc: 'Mô tả B', price: 350000, status: 'Ngừng hoạt động' },
];

const TestPackageManagePage = () => {
  const [packages, setPackages] = useState(initialPackages);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ id: null, name: '', desc: '', price: '', status: 'Đang hoạt động' });
  const [isEdit, setIsEdit] = useState(false);

  const openAddModal = () => {
    setModalData({ id: null, name: '', desc: '', price: '', status: 'Đang hoạt động' });
    setIsEdit(false);
    setShowModal(true);
  };
  const openEditModal = (pkg) => {
    setModalData(pkg);
    setIsEdit(true);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleChange = e => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!modalData.name || !modalData.desc || !modalData.price) return;
    if (isEdit) {
      setPackages(packages.map(pkg => pkg.id === modalData.id ? modalData : pkg));
    } else {
      setPackages([...packages, { ...modalData, id: packages.length + 1 }]);
    }
    closeModal();
  };

  const handleDelete = id => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  return (
    <div className="test-package-manage">
      <h2>Gói xét nghiệm</h2>
      <button className="add-btn" onClick={openAddModal}><FaPlus /> Thêm gói</button>
      <table className="package-table">
        <thead>
          <tr>
            <th>Tên gói</th>
            <th>Mô tả</th>
            <th>Giá (VNĐ)</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {packages.map(pkg => (
            <tr key={pkg.id}>
              <td>{pkg.name}</td>
              <td>{pkg.desc}</td>
              <td>{pkg.price.toLocaleString()}</td>
              <td>{pkg.status}</td>
              <td>
                <button className="edit-btn" onClick={() => openEditModal(pkg)}><FaEdit /></button>
                <button className="delete-btn" onClick={() => handleDelete(pkg.id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEdit ? 'Sửa gói xét nghiệm' : 'Thêm gói xét nghiệm'}</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <input name="name" value={modalData.name} onChange={handleChange} placeholder="Tên gói" required />
              <textarea name="desc" value={modalData.desc} onChange={handleChange} placeholder="Mô tả" required />
              <input name="price" type="number" value={modalData.price} onChange={handleChange} placeholder="Giá" required />
              <select name="status" value={modalData.status} onChange={handleChange}>
                <option>Đang hoạt động</option>
                <option>Ngừng hoạt động</option>
              </select>
              <div className="modal-actions">
                <button type="submit">{isEdit ? 'Lưu' : 'Thêm'}</button>
                <button type="button" onClick={closeModal}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPackageManagePage; 