import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative mt-1">
        <input
          type={show ? "text" : "password"}
          placeholder="Enter Password"
          value={value}
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;