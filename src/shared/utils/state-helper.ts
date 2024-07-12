import { useState, useEffect } from "react";

export function usePersistantState(key: string, defaultValue: boolean) {
  const [value, setValue] = useState(() => {
    const storedValue = window.sessionStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    console.log("key : Value ", key , value);
  }, [key, value]);

  return [value, setValue];
}