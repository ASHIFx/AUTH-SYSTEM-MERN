import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../component/LoadingScreen';

const AuthGoogle = () => {
    const [searchParams] = useSearchParams();
    const { setAccessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            setAccessToken(token);
            navigate('/home');
        } else {
            navigate('/');
        }
    }, []);

    return <LoadingScreen />;
};

export default AuthGoogle;