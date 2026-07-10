import { useState } from "react";
import bg from "../assets/cloud.jpg"
import { useNavigate, useLocation } from "react-router-dom";
import OtpInput from "../component/OtpInput";
import OtpTimer from "../component/OtpTimer";
import { verifyOtp, resendOtp } from "../api/auth.service";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../component/LoadingScreen";


const Verify = () => {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setAccessToken } = useAuth();
    const email = location.state?.email;

    const handleOtpComplete = async (otpValue) => {
        setLoading(true);
        try {
            const data = await verifyOtp(email, otpValue);
            setAccessToken(data.accessToken);
            navigate('/home');
        } catch (err) {
            alert(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            await resendOtp(email);
            alert("OTP resent");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to resend");
        } finally {
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
                    <h1 className="text-2xl font-bold text-gray-800">Verify Email!</h1>
                    <p className="text-xs text-gray-500">OTP sent to {email}</p>
                </div>
                <div>
                    <OtpInput length={6} onComplete={handleOtpComplete} />
                    <OtpTimer duration={60} onResend={handleResendOtp} />

                </div>
            </div>
        </div>
    )
}

export default Verify