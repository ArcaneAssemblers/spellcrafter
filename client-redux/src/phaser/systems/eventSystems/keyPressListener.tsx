import { useEffect, useState } from 'react';

export const useWASDKeys = () => {
  const [keysDown, setKeysDown] = useState<{ [key: string]: boolean }>({ W: false, A: false, S: false, D: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['W', 'A', 'S', 'D'].includes(key)) {
        setKeysDown(prevKeys => ({ ...prevKeys, [key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['W', 'A', 'S', 'D'].includes(key)) {
        setKeysDown(prevKeys => ({ ...prevKeys, [key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keysDown;
};
