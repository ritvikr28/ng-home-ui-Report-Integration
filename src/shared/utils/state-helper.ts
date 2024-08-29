import React, { useState, useEffect } from "react";

export function usePersistantState(key: string, defaultValue: boolean): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [value, setValue]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(() => {
   const storedValue: string | null = window.sessionStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}