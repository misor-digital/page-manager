export const Button = (props) => {
  const {
    title,
    className,
    handleClick,
    disabled,
  } = props;

  return (
    <button
      type = 'button'
      className = { `btn ${className}` }
      onClick = { handleClick }
      disabled = { disabled }
    >
      { title }
    </button>
  );
};
