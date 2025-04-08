import React from 'react'

interface AuthInputProps {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  icon: React.ReactNode
  type?: string
}

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = 'text'
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-800 font-normal text-base mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">{icon}</div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md text-gray-500 focus:outline-none"
        required
      />
    </div>
  </div>
)

export default AuthInput
