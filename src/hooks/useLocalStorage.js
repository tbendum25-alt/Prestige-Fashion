import { useEffect, useState } from 'react';

// useState persistant. Retourne aussi une éventuelle erreur d'écriture (quota plein, navigation privée…).
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setError(null);
    } catch (e) {
      setError(e);
    }
  }, [key, value]);

  return [value, setValue, error];
}
