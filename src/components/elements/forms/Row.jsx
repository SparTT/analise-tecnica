export default function Row({ name, labelText, inputType, placeholder, value, required, disabled }) {

  inputType = !inputType ? 'text' : inputType
  required = !required ? false : required
  value = !value ? '' : value
  disabled = !disabled ? '' : disabled

  return (
    <div className='mb-5'>
      <label htmlFor={name} className='block text-slate-50 text-sm font-bold mb-2'>
        {labelText}
      </label>
      <input
        type={inputType}
        name={name}
        id={name}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
        focus:outline-none focus:shadow-outline disabled:text-gray-400 disabled:bg-gray-300"
        placeholder={placeholder}
        defaultValue={value}
        required={required}
        disabled={disabled}
      />
    </div>
  )
}