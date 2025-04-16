import React from 'react'

interface DropdownProps {
  label: string
  options: string[]
  selected: string
  onChange: (value: string) => void
  className?: string
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, selected, onChange, className }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={selected}
        onChange={e => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown
