import { useState } from "react";
import ShowPwdIcon from '@/shared/icon/showPwd';
import HidePwdIcon from '@/shared/icon/hidePwd';

export default function PasswordInput({ id, label, value, onChange, error, required = true, ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="form-input pr-12"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {show ? <HidePwdIcon /> : <ShowPwdIcon />}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
