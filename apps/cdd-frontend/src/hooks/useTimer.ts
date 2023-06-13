import { useEffect, useRef } from 'react';

const useTimer = (callback: () => void, delay: number | null) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const savedCallback = useRef<() => void>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    if (delay !== null) {
      const id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

export default useTimer;
