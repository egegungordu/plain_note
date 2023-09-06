import { useEffect, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

export default function Popover({
  children,
  show,
  onClose,
  side,
}: {
  children?: React.ReactNode;
  show?: boolean;
  onClose?: () => void;
  side?: "top" | "bottom" | "left" | "right";
}) {
  const popoverElement = useRef<HTMLDivElement>(null);

  useOnClickOutside(popoverElement, onClose ?? (() => {}));

  return (
    <>
      {show && (
        <div
          ref={popoverElement}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg"
        >
          {children}
        </div>
      )}
    </>
  );
}
