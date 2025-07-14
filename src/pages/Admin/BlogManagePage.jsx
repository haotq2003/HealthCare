// BlogManagePage.jsx (Refactored to use MUI instead of Ant Design)

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Typography,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import MuiAlert from '@mui/material/Alert';
import { blogService } from '../../services/BLogService';
import ImageUploader from '../../common/ImageUploader';

const BlogManagePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState({ title: '', headline: '', summary: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [contents, setContents] = useState([{ title: '', detail: '' }]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAllBlogs();
      console.log(data)
      setBlogs(data);
    } catch {
      showSnackbar('Lỗi khi tải danh sách blog', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (blog = null) => {
    setEditingBlog(blog);
    setOpen(true);
    if (blog) {
      setForm({ title: blog.title, headline: blog.headline, summary: blog.summary });
      setImageUrl(blog.thumbnailUrl || '');
      setContents(blog.contents?.length ? blog.contents : [{ title: '', detail: '' }]);
    } else {
      setForm({ title: '', headline: '', summary: '' });
      setImageUrl('');
      setContents([{ title: '', detail: '' }]);
    }
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!form.title || !form.headline || !form.summary) return showSnackbar('Vui lòng nhập đầy đủ thông tin', 'error');
    if (!imageUrl) return showSnackbar('Vui lòng tải ảnh', 'error');
    if (contents.some(c => !c.title || !c.detail)) return showSnackbar('Vui lòng nhập nội dung đầy đủ', 'error');

    const payload = { ...form, thumbnailUrl: imageUrl, contents };

    try {
      if (editingBlog) {
        await blogService.updateBlog({ ...payload, id: editingBlog.id });
        showSnackbar('Cập nhật blog thành công');
      } else {
        await blogService.createBlog(payload);
        showSnackbar('Tạo blog mới thành công');
      }
      handleClose();
      fetchBlogs();
    } catch {
      showSnackbar('Lỗi khi lưu blog', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await blogService.deleteBlog(id);
      showSnackbar('Xóa blog thành công');
      fetchBlogs();
    } catch {
      showSnackbar('Lỗi khi xóa blog', 'error');
    }
  };

  return (
    <div className="container" style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>Quản lý Blog</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Thêm blog mới</Button>

      {loading ? <CircularProgress style={{ marginTop: 24 }} /> : (
        <Table style={{ marginTop: 24 }}>
          <TableHead>
            <TableRow>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Tóm tắt</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Số phần</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map(blog => (
              <TableRow key={blog.id}>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.summary}</TableCell>
                <TableCell><img src={blog.thumbnailUrl} alt="thumb" style={{ width: 60, height: 40 }} /></TableCell>
                <TableCell>{blog.contents?.length || 0}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(blog)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(blog.id)}><DeleteIcon color="error" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{editingBlog ? 'Cập nhật blog' : 'Tạo blog mới'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tiêu đề"
            fullWidth
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tiêu đề phụ (headline)"
            fullWidth
            value={form.headline}
            onChange={e => setForm({ ...form, headline: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tóm tắt"
            fullWidth
            multiline
            rows={2}
            value={form.summary}
            onChange={e => setForm({ ...form, summary: e.target.value })}
          />

          <ImageUploader onImageUploaded={setImageUrl} />
          {/* {imageUrl && <img src={''} alt="Uploaded" style={{ width: 120, marginTop: 8 }} />} */}

          <Typography variant="h6" style={{ marginTop: 16 }}>Nội dung chi tiết</Typography>
          {contents.map((c, idx) => (
            <Accordion key={idx} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{c.title || `Phần ${idx + 1}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="Tiêu đề phần"
                  fullWidth
                  margin="dense"
                  value={c.title}
                  onChange={e => setContents(prev => prev.map((item, i) => i === idx ? { ...item, title: e.target.value } : item))}
                />
                <TextField
                  label="Chi tiết"
                  fullWidth
                  multiline
                  rows={3}
                  margin="dense"
                  value={c.detail}
                  onChange={e => setContents(prev => prev.map((item, i) => i === idx ? { ...item, detail: e.target.value } : item))}
                />
              </AccordionDetails>
            </Accordion>
          ))}
          <Button onClick={() => setContents(prev => [...prev, { title: '', detail: '' }])}>+ Thêm phần nội dung</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">{editingBlog ? 'Cập nhật' : 'Tạo mới'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} elevation={6} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default BlogManagePage;
