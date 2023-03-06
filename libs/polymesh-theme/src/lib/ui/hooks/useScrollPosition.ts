import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const { scrollY: scrollYMotion, scrollX: scrollXMotion } = useScroll();

  useMotionValueEvent(scrollYMotion, 'change', (latest) => {
    setScrollY(latest);
  });
  useMotionValueEvent(scrollXMotion, 'change', (latest) => {
    setScrollX(latest);
  });

  return { scrollY, scrollX };
};

export default useScrollPosition;
