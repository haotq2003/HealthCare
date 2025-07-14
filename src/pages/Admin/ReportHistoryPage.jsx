import React, { useEffect, useState } from "react";
import { RevenueService } from "../../services/RevenueService";
import styles from "./UserPage.module.scss";

const ReportHistoryPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await RevenueService.getAllReport();
        console.log(res.data)
        setReports(res.data || []);
      } catch (error) {
        // Optionally show a toast or error message
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Lịch sử xuất báo cáo</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : reports.length === 0 ? (
        <p>Không có báo cáo nào.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Loại báo cáo</th>
                <th>Thời gian bắt đầu</th>
                <th>Thời gian kết thúc</th>
                <th>Ghi chú</th>
                <th>Người xuất</th>
                <th>Thời gian tạo</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  {/* <td>{report.id}</td> */}
                  <td>{report.reportType}</td>
                  <td>{new Date(report.periodStart).toLocaleString()}</td>
                  <td>{new Date(report.periodEnd).toLocaleString()}</td>
                  <td>{report.notes}</td>
                  <td>{report.generatedBy}</td>
                  <td>{new Date(report.createdTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportHistoryPage; 