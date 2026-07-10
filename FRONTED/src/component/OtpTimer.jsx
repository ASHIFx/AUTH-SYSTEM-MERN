import { useState, useEffect, useRef } from "react";

const OtpTimer = ({ duration = 60, onResend }) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    setSecondsLeft(duration);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    await onResend?.();
    startTimer();
  };

  return (
    <div className="text-center text-sm mt-3">
      {secondsLeft > 0 ? (
        <p className="text-gray-500">
          Resend OTP in <span className="font-semibold">{secondsLeft}s</span>
        </p>
      ) : (
        <button
          onClick={handleResend}
          className="text-blue-600 font-medium cursor-pointer"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
};

export default OtpTimer;