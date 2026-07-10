import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/auth.axios';
import LoadingScreen from "./LoadingScreen";


const ProtectedRoute = ({ children }) => {
  const { accessToken, setAccessToken } = useAuth();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (accessToken) {
       
        setAllowed(true);
        setChecking(false);
        return;
      }

    
      try {
        const res = await api.post('/refresh-token');
        setAccessToken(res.data.accessToken);
        setAllowed(true);
      } catch {
   
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, []);

  if (checking) return <LoadingScreen />;
  if (!allowed) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;