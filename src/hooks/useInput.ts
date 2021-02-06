import { useState } from "react";

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event: { target: { value: any; }; }) => {
        setValue(event.target.value);
      }
    }
  }
}