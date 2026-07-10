import bg from "../assets/cloud.jpg"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from "../api/auth.service";
import LoadingScreen from "../component/LoadingScreen";
import { useState } from "react";

const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setAccessToken } = useAuth();

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setAccessToken(null);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Logout failed");
        } finally  {
            setLoading(false);
        }
    };

    if(loading){
        return <LoadingScreen/>
    }

    return (
        <div
            className="h-screen flex items-center justify-center flex-col gap-4"
            style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div className="bg-white/20 backdrop-blur-md w-full max-w-sm border border-white/30 p-7 rounded-lg shadow-lg">
                <div className="flex flex-col mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Home Page!</h1>
                    <p className="text-md text-gray-700 mt-4">Hey, welcome! Really glad you made it here and took the time to try this out. This is still a work in progress and your feedback genuinely matters — if something felt off, broken, or could just be better, drop a comment below. Every bit helps. Thanks for being here.</p>
                </div>
                <div className="flex flex-col gap-2 text-sm text-gray-700">
                    <p>✅ Account created</p>
                    <p>✅ Email verified</p>
                    <p>✅ Logged in successfully</p>
                </div>
            </div>
            <button
                className='bg-black text-white py-2 rounded-lg text-sm cursor-pointer w-xs'
                onClick={handleLogout}
            >
                Log out
            </button>
        </div>
    )
}

export default HomePage