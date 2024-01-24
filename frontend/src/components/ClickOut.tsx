import { useRef, useEffect } from 'react';
/**
 * Credit for this component to
 * https://medium.com/@shkim04/react-how-to-detect-click-outside-a-component-984fe2e003e8
 * Used rather than creating a dependency just for this function (eg. react-click-outside)
 */
interface ClickOutProps {
  children: React.ReactNode;
  exceptionRef?: React.RefObject<HTMLElement>;
  onClick: () => void;
  className?: string;
}

export default function ClickOut({
  children,
  exceptionRef,
  onClick,
  className,
}: ClickOutProps): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickListener);

    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  });

  const handleClickListener = (event: MouseEvent): void => {
    let clickIn;
    if (exceptionRef) {
      clickIn =
        (wrapperRef.current &&
          wrapperRef.current.contains(event.target as Node)) ||
        exceptionRef.current === event.target ||
        (exceptionRef.current &&
          exceptionRef.current.contains(event.target as Node));
    } else {
      clickIn =
        wrapperRef.current && wrapperRef.current.contains(event.target as Node);
    }

    if (clickIn) return;
    else onClick();
  };

  return (
    <div ref={wrapperRef} className={`${className || ''}`}>
      {children}
    </div>
  );
}
