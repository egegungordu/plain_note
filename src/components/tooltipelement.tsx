import { createPortal } from "react-dom";

interface TooltipElement<T extends React.ElementType> {
  text: String;
  as?: T;
  offset?: number;
  children?: React.ReactNode;
  className?: String;
}

export default function TooltipElement<T extends React.ElementType = "div">({
  text,
  as,
  offset,
  children,
  className,
  ...props
}:
  TooltipElement<T>
  & Omit<React.ComponentPropsWithoutRef<T>, keyof TooltipElement<T>>
) {
  const Component = as || "div";

  return (
    <Component className={`relative group/tooltip ${className}`} {...props}>
      <span
        style={{
          top: `-${offset ?? 16}px`
        }}
        className={[
          "whitespace-nowrap",
          "rounded",
          "bg-black",
          "px-2",
          "py-1",
          "text-neutral-300",
          "text-xs",
          "absolute",
          "left-1/2",
          "-translate-y-full",
          "-translate-x-1/2",
          "before:content-['']",
          "before:absolute",
          "before:-translate-x-1/2",
          "before:left-1/2",
          "before:top-full",
          "before:border-4",
          "before:border-transparent",
          "before:border-t-black",
          "opacity-0",
          "group-hover/tooltip:opacity-100",
          "transition",
          "pointer-events-none",
        ].join(" ")}
      >
        {text}
      </span>
      {children}
    </Component>

  )

}