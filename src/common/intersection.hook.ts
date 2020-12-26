import { useState, useEffect } from 'react';

export const useIntersectionObserver = (options: any) => {
  const [ref, setRef] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entity]) => {
      setVisible(entity.isIntersecting);
    }, options);

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, options]);

  return [setRef as any, visible];
};
