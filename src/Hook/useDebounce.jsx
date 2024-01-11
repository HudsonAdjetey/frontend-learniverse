import React, { useCallback, useEffect, useState } from "react";

const useDebounce = ({ value, delay = 1000 }) => {
  const [debounceValue, setDebounceValue] = useState(value);

  const handleDebounce = useCallback(() => {
    const id = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [value, debounceValue]);

  useEffect(() => {
    handleDebounce;
  }, [value]);
  return debounceValue;
};

export default useDebounce;
