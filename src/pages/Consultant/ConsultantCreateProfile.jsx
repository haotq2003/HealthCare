import React, { useState } from 'react';
import { ConsultantService } from '../../services/ConsultantService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper
} from '@mui/material';

const ConsultantCreateProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    degree: '',
    experience: '',
    bio: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Dữ liệu gửi đi:", form); 
      await ConsultantService.createProfile(user.id, {
        ...form,
        experience: Number(form.experience), // đảm bảo là số
      });
      toast.success('Tạo hồ sơ thành công. Vui lòng đăng nhập lại');
      logout();
      navigate('/login');
    } catch (error) {
      toast.error('Lỗi khi tạo hồ sơ');
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Tạo hồ sơ tư vấn viên
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Bằng cấp"
            name="degree"
            value={form.degree}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Kinh nghiệm (năm)"
            name="experience"
            type="number"
            value={form.experience}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Giới thiệu"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={4}
            margin="normal"
          />

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Lưu hồ sơ
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ConsultantCreateProfile;
