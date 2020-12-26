import { useRef, useEffect } from 'react';

/*
  Custom Hook
*/
export default function useOuterClick(callback: (e: any) => void, title?: string) {
  const innerRef = useRef<any>();
  const callbackRef = useRef<any>();

  // set current callback in ref, before second useEffect uses it
  useEffect(() => {
    // useEffect wrapper to be safe for concurrent mode
    callbackRef.current = callback;
  });

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };

    // read most recent callback and innerRef dom node from refs
    function handleClick(e: any) {
      if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target)) {
        callbackRef.current(e);
      }
    }
  }, []); // no need for callback + innerRef dep

  return innerRef; // return ref; client can omit `useRef`
}
