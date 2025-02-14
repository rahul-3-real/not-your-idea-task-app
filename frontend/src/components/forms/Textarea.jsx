const Textarea = ({ label, name, required, error, className, ...props }) => {
  return (
    <>
      <div className={`block relative ${className}`}>
        <label className="block mb-1" htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          className="block bg-gray-800 w-full py-3 px-4 outline-0 border-0 rounded"
          id={name}
          name={name}
          required={required}
          {...props}
        ></textarea>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    </>
  );
};

export default Textarea;
