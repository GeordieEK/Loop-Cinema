import { useState } from 'react';

interface InputFieldWithErrorMessageProps {
  id: string;
  type?: string;
  labelText: string;
  initialValue?: string;
  validateValue?: (value: string) => [boolean, string];
  setValidationStatus: (status: boolean) => void;
  updateValue: (value: string) => void;
}

export default function InputFieldWithErrorMessage({
  id,
  type = 'text',
  labelText,
  initialValue,
  validateValue,
  setValidationStatus,
  updateValue,
}: InputFieldWithErrorMessageProps) {
  const [message, setMessage] = useState<string | undefined>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (validateValue) {
      const [validationResult, validationMessage] = validateValue(
        event.target.value
      );
      setMessage(validationMessage);
      setValidationStatus(validationResult);
      if (validationResult) {
        updateValue(event.target.value);
      }
    }
  };

  return (
    <div>
      <div className="orange_box_formfield">
        <label htmlFor={id}>{labelText}</label>
        <input
          type={type}
          id={id}
          name={id}
          defaultValue={initialValue}
          onChange={handleChange}
        />
      </div>
      <div className="error_message">
        <p>{message}</p>
      </div>
    </div>
  );
}
