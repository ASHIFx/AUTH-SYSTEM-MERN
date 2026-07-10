const InputField = ({ label, type = "text", placeholder, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default InputField;