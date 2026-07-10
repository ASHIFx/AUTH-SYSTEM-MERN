import InputField from "../component/InputField";
import { useState } from "react";
import PasswordInput from '../component/PasswordInput';
import googleLogo from "../assets/googlelogo.png";
import facebookLogo from "../assets/facebooklogo.png";
import bg from "../assets/cloud.jpg"
import { useNavigate } from 'react-router-dom'
import { registerUser} from "../api/auth.service";
import LoadingScreen from "../component/LoadingScreen";


const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!firstname.trim()) {
            newErrors.firstname = "First name is required";
        }

        if (!lastname.trim()) {
            newErrors.lastname = "Last name is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const username = firstname + " " + lastname;
            await registerUser(username, email, password);
            navigate('/verify-email', { state: { email } });
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen/>
    }

    return (
        <div
            className="h-screen flex items-center justify-center"
            style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div className="bg-white/20 backdrop-blur-md w-full max-w-sm border border-white/30 p-7 rounded-lg shadow-lg">
                <div>
                    <div className="flex flex-col mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Get started now!</h1>
                        <p className="text-xs text-gray-500">Create an account to continue</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <InputField label="First Name" type="text" placeholder="Enter First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                                {errors.firstname && (
                                    <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
                                )}
                            </div>
                            <div>
                                <InputField label="Last Name" type="text" placeholder="Enter Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                                {errors.lastname && (
                                    <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <InputField label="Email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 mt-6">
                        <button className='bg-black text-white py-2 rounded-lg text-sm cursor-pointer' onClick={handleSignUp}>Sign up</button>
                        <p className='text-center'>or</p>
                        <div className="flex justify-center text-sm"><a onClick={() => navigate('/')} className="cursor-pointer">Already have an account?</a></div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <hr className="flex-1 border-gray-400" />
                        <span className='text-sm text-gray-600'>or continue with</span>
                        <hr className="flex-1 border-gray-400" />
                    </div>
                    <div className='flex justify-center gap-5 mt-4'>
                        <a href={`${import.meta.env.VITE_API_URL}/api/auth/google`}>
                            <img src={googleLogo} alt="Google" className="w-10 rounded-4xl" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp