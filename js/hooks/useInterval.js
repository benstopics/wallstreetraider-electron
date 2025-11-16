import { useEffect, useRef } from '../lib/preact.standalone.module.js';

function useInterval(callback, delay) {
  const savedCallback = useRef(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay); // Use the provided delay
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;
