import { useState, useEffect, useCallback } from "react";

const useMousePosition = (isDown) => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  const updateMousePosition = useCallback(
    (e) => {
      if (isDown === true) setMousePosition({ x: e.clientX, y: e.clientY });
    },
    [isDown]
  );

  useEffect(() => {
      window.addEventListener("mousedown", (e) =>
        setMousePosition({ x: e.clientX, y: e.clientY })
      );
      window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mousedown", (e) => setMousePosition({x: e.clientX, y: e.clientY}));
    };
  }, [isDown]);

  return mousePosition;
};

export default useMousePosition;
