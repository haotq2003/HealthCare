
import { useMemo } from 'react';
import jwtDecode from 'jwt-decode';

export const useDecodedToken = () => {
  const token = localStorage.getItem('accessToken');

  const decoded = useMemo(() => {
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }, [token]);

  return decoded;
};
