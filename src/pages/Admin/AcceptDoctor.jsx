import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./UserPage.module.scss"; // dùng chung style table
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const AcceptConsultant = () => {
  const [pendingConsultants, setPendingConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetchPendingConsultants();
  }, []);

  const token = localStorage.getItem("accessToken");

  const fetchPendingConsultants = async () => {
    try {
      const res = await axios.get("https://localhost:7276/api/Admin/users", {
        params: { ConsultantStatus: 0 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingConsultants(res.data.data.items);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách tư vấn viên");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedConsultant) return;

    try {
      await axios.put(
        `https://localhost:7276/api/Admin/${selectedConsultant.id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Duyệt thành công!");
      setPendingConsultants((prev) =>
        prev.filter((c) => c.id !== selectedConsultant.id)
      );
    } catch (error) {
      toast.error("Duyệt thất bại.");
      console.error(error);
    } finally {
      handleCloseConfirm();
    }
  };

  const handleOpenConfirm = (consultant) => {
    setSelectedConsultant(consultant);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedConsultant(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Duyệt tư vấn viên</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : pendingConsultants.length === 0 ? (
        <p>Không có tư vấn viên nào chờ duyệt.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>SĐT</th>
                {/* <th>Ngày tạo</th> */}
                <th className={styles.textCenter}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pendingConsultants.map((consultant) => (
                <tr key={consultant.id}>
                  <td>{consultant.name || consultant.fullName}</td>
                  <td>{consultant.email}</td>
                  <td>{consultant.phoneNumber || '—'}</td>
                  {/* <td>
                    {consultant.createdAt
                      ? new Date(consultant.createdAt).toLocaleDateString()
                      : "—"}
                  </td> */}
                  <td className={styles.textCenter}>
                    <button
                      onClick={() => handleOpenConfirm(consultant)}
                      className={styles.deleteBtn}
                    >
                      Duyệt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Xác nhận duyệt</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn duyệt tư vấn viên{" "}
            <strong>{selectedConsultant?.name || selectedConsultant?.fullName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Hủy</Button>
          <Button onClick={handleApprove} color="success" variant="contained">
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AcceptConsultant;
