import { forwardRef } from 'react';

const InputField = forwardRef(function InputField({ label, unit, placeholder, value, onChange, error, hint, type = 'text' }, ref) {
  return (
    <div ref={ref}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 pr-12 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200'
          }`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">{unit}</span>
      </div>
      {hint && !error && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});

export default InputField;
