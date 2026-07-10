import { useState } from "react";
import PasswordInput from '../component/PasswordInput';
import bg from "../assets/cloud.jpg"
import { useNavigate, useLocation } from 'react-router-dom'
import { resetPassword } from "../api/auth.service";
import LoadingScreen from "../component/LoadingScreen";


const NewPassword = () => {
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const otp = location.state?.otp;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validate = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please retype your password";
        } else if (password && password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleReset = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await resetPassword(email, otp, password);
            alert("Password reset successful");
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        } finally{
            setLoading(false);
        }
    };

    if(loading){
        return <LoadingScreen/>
    }

    return (
        <div
            className="h-screen flex items-center justify-center"
            style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div className="bg-white/20 backdrop-blur-md w-full max-w-sm border border-white/30 p-7 rounded-lg shadow-lg">
                <div className="flex flex-col mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Reset your password</h1>
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                        <PasswordInput
                            label="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>
                    <div>
                        <PasswordInput
                            label="Retype New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1 mt-4">
                    <button
                        className='bg-black text-white py-2 rounded-lg text-sm cursor-pointer'
                        onClick={handleReset}
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewPassword;