import LoadingButton from 'components/LoadingButton/LoadingButton';
import { useInput } from 'hooks/useInput';
import 'react-toastify/dist/ReactToastify.css'
import React from 'react';

import './MaxForm.css'

interface MaxFormProps {
  onSubmit(value: string): void;
  loading: boolean;
  max?: string;
  onCancel?: VoidFunction;
  onMaxText?: string;
}

const MaxForm: React.FC<MaxFormProps> = ({ max, loading, onSubmit, onCancel, onMaxText }) => {
  const { value, setValue, bind } = useInput(max ?? "10");
  const maximise = () => max && setValue(max);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit(value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='user-input-container'>
        <input className='user-input' type="number" {...bind} />
        { max && <button type="button" className='max-button' onClick={maximise}>
          MAX
        </button> }
      </div>
      <p>{max && value === max && onMaxText}</p>
      <div className='cancel-confirm-container'>
        <button type="button" onClick={onCancel}> 
          Cancel 
        </button>
        <LoadingButton loading={loading} text="Confirm"/>
      </div>
    </form>
  )
} 

export default MaxForm;

