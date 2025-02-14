const Select = ({
  label,
  name,
  required,
  error,
  options,
  value,
  className,
  ...props
}) => {
  return (
    <>
      <div className={`block relative ${className}`}>
        <label className="block mb-1" htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          className="block bg-gray-800 w-full py-3 px-4 outline-0 border-0 rounded"
          id={name}
          name={name}
          required={required}
          value={value}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    </>
  );
};

export default Select;
