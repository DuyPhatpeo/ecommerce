import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  show: boolean;
  toggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

export default function PasswordField({
  label,
  name,
  value,
  show,
  toggle,
  onChange,
  placeholder,
  error,
}: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-1 relative">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>

      {/* Input wrapper */}
      <div className="relative">
        {/* Icon khóa */}
        <Lock
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-3.5 border rounded-xl outline-none transition 
            ${
              error
                ? "border-red-400 bg-red-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:bg-white"
                : "border-gray-200 bg-gray-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:bg-white"
            }`}
        />

        {/* Nút toggle hiển thị mật khẩu */}
        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

        {/* ❗ Thông báo lỗi (không đẩy layout) */}
        {error && (
          <p className="absolute -bottom-5 left-1 text-xs text-red-500 bg-white px-1 rounded">
            {error}
          </p>
        )}
      </div>

      {/* Giữ chỗ lỗi cố định */}
      <div className="h-5" />
    </div>
  );
}
