import { Input } from './Input';
import { Button } from "./Button";

export const Form = (props) => {
  const {
    model,
    onChange,
    onOpen,
    onStart,
    onStop,
  } = props;

  return (
    <form
      noValidate
    >

      <Input
        type = 'url'
        placeholder = 'URL to open in a new tab'
        name = 'url'
        value = { model.url }
        onChange = { onChange }
        disabled = { disabled.url }
      />

      <Input
        type = 'number'
        placeholder = 'Interval between reloads in seconds'
        name = 'interval'
        value = { model.interval }
        onChange = { onChange }
        disabled = { disabled.interval }
      />

      <Button
        title = 'Open URL'
        className = 'btn-primary'
        handleClick = { onOpen }
        disabled = { disabled.open }
      />

      <Button
        title = 'Start'
        className = 'btn-secondary'
        handleClick = { onStart }
        disabled = { disabled.start }
      />

      <Button
        title = 'Stop'
        className = 'btn-primary'
        handleClick = { onStop }
        disabled = { disabled.stop }
      />

      { dateElement }
    </form>
  );
};
