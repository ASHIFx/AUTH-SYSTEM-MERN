import InputField from "../component/InputField";
import { useState } from "react";
import bg from "../assets/cloud.jpg"
import { useNavigate } from 'react-router-dom'
import LoadingScreen from '../component/LoadingScreen';
import OtpInput from "../component/OtpInput";
import OtpTimer from "../component/OtpTimer";
import { verifyForgotOtp, forgotPassword } from "../api/auth.service";

const ForgotPassword = () => {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [showOtp, setShowOtp] = useState(false);

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            setError("Email is required");
            return false;
        }
        if (!emailRegex.test(email)) {
            setError("Enter a valid email address");
            return false;
        }
        setError('');
        return true;
    };

    const handleOtpComplete = async (otpValue) => {
        setLoading(true);
        try {
            await verifyForgotOtp(email, otpValue);
            navigate('/password/new', { state: { email, otp: otpValue } });
        } catch (err) {
            setErrors({ general: err.response?.data?.message ||"Invalid OTP"});
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            await forgotPassword(email);
            alert("OTP resent successfully");
        } catch (err) {
            setErrors({ general: err.response?.data?.message || "Failed to resend OTP"});
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        if (!validateEmail()) return;

        setLoading(true);
        try {
            await forgotPassword(email);
            setShowOtp(true);
        } catch (err) {
            setErrors({ general: err.response?.data?.message || "Something went wrong"});
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div
            className="h-screen flex items-center justify-center"
            style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div className="bg-white/20 backdrop-blur-md w-full max-w-sm border border-white/30 p-7 rounded-lg shadow-lg">
                {!showOtp ? (
                    <>
                        <div className="flex flex-col mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">Find your account</h1>
                            <p className="text-xs text-gray-500">Enter your email.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <InputField label="Email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                {error && (
                                    <p className="text-red-500 text-xs mt-1">{error}</p>
                                )}
                                {errors.general && (
                                <p className="text-red-500 text-xs mt-2 text-center">{errors.general}</p>
                                )}
                            </div>
                            <button
                                className='bg-black text-white py-2 rounded-lg text-sm cursor-pointer'
                                onClick={handleContinue}
                            >
                                Continue
                            </button>
                        </div>
                    </>
                ) : (
                <>
                    <div className="flex flex-col mb-2">
                        <h1 className="text-2xl font-bold text-gray-800">Verify Email</h1>
                        <p className="text-xs text-gray-500">OTP sent to {email}</p>
                    </div>
                    <OtpInput length={6} onComplete={handleOtpComplete} />
                    <OtpTimer duration={60} onResend={handleResendOtp} />
                </>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword