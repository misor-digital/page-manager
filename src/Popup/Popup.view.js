import { Form } from './components/Form';

export const PopupView = (props) => {
  const {
    model,
    onChange,
    onOpen,
    onStart,
    onStop,
  } = props;

  return (
    <div className='main-container'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>User Config</h1>

            <Form
              model = { model }
              onChange = { onChange}
              onOpen = { onOpen }
              onStart = { onStart }
              onStop = { onStop }
            />
            
          </div>
        </div>
      </div>
    </div>
  );
};
