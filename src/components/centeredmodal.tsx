import { createPortal } from "react-dom";

export default function CenteredModal({
  children,
  onClose,
  show,
}: {
  children?: React.ReactNode;
  onClose?: () => void;
  show?: boolean;
}) {
  return (
    <>
      {show &&
        createPortal(
          <div className="z-10 fixed inset-0 flex items-center justify-center">
            <div
              onClick={onClose}
              className="fixed inset-0 bg-neutral-900/50"
            />
            <div className="z-30 relative bg-neutral-900 rounded-lg shadow-lg border border-neutral-800">
              {children}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
