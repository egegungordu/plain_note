interface TooltipElement<T extends React.ElementType> {
  text: String;
  as?: T;
  children?: React.ReactNode;
  className?: String;
}

export default function TooltipElement<T extends React.ElementType = "div">({
  text,
  as,
  children,
  className,
  ...props
}:
  TooltipElement<T>
  & Omit<React.ComponentPropsWithoutRef<T>, keyof TooltipElement<T>>
) {
  const Component = as || "div";

  return (
    <Component className={`relative group ${className}`} {...props}>
      <span
        className={[
          "whitespace-nowrap",
          "rounded",
          "bg-black",
          "px-2",
          "py-1",
          "text-neutral-300",
          "text-sm",
          "absolute",
          "-top-12",
          "left-1/2",
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
          "group-hover:opacity-100",
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