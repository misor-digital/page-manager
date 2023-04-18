export const Input = (props) => {
  const {
    type = 'text',
    placeholder,
    name,
    value,
    onChange,
    disabled,
  } = props;

  return (   
    <input
      className = 'form-control'
      type = { type }
      placeholder = { placeholder }
      name = { name }
      value = { value }
      onChange = { onChange }      
      disabled = { disabled }
    />
  );
};
