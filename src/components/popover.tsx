import clsx from "clsx";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

export default function Popover({
  children,
  show,
  onClose,
  side = "t",
}: {
  children?: React.ReactNode;
  show?: boolean;
  onClose?: () => void;
  side?: "t" | "b" | "l" | "r" | "tl" | "tr" | "bl" | "br";
}) {
  const popoverElement = useRef<HTMLDivElement>(null);

  useOnClickOutside(popoverElement, onClose ?? (() => {}));

  return (
    <>
      {show && (
        <div
          ref={popoverElement}
          className={clsx(
            "absolute my-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg",
            side === "t" && "bottom-full left-1/2 -translate-x-1/2",
            side === "b" && "top-full left-1/2 -translate-x-1/2",
            side === "l" && "right-full top-1/2 -translate-y-1/2",
            side === "r" && "left-full top-1/2 -translate-y-1/2",
            side === "tl" && "bottom-full right-0",
            side === "tr" && "bottom-full left-0",
            side === "bl" && "top-full right-0",
            side === "br" && "top-full left-0 "
          )}
        >
          {children}
        </div>
      )}
    </>
  );
}
