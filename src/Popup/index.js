import { useState } from 'react';

import Model from './Popup.model';
import View  from './Popup.view';

export const Popup = () => {
  // Define the state with useState hook
  const [ popup, setPopup ] = useState(Model);

  const handleChange = (e) => {
    setPopup({ ...popup, [e.target.name] : e.target.value });
  };

  const handleOpen = (e) => {};

  const handleStart = (e) => {};

  const handleStop = (e) => {};

  return (
    <View
      model = { popup }
      onChange = { handleChange }
      onOpen = { handleOpen }
      onStart = { handleStart }
      onStop = { handleStop }
    />
  );
};
