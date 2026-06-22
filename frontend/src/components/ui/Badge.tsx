import React from "react";
import { IconNode } from "lucide-react";

interface BadgeProps {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "purple"
    | "default"
    | "red"
    | "primary";
  size?: "xs" | "sm" | "md" | "lg";
  leftIcon?: IconNode;
  rightIcon?: IconNode;
  className?: string;
  ariaLabel: string;
  // children: React.ReactNode | string | number;
  children: React.ReactNode;
  as: React.ElementType;
  rest: React.HtmlHTMLAttributes<HTMLElement>;
}

export const Badge: React.FC<BadgeProps> = (
  {
    children,
    variant = "default",
    size = "md",
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className = "",
    ariaLabel,
    as: Component = "span",
    ...rest
  },
  ref,
) => {
  // Base: inline-flex con bordes redondeados
  const baseClasses = "inline-flex items-center rounded w-auto";

  const variants = {
    success:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    info: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    muted: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    primary:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    outline:
      "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-transparent",
    red: "bg-red-600 text-white",
    purple:
      "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300",
  };

  // Tamaños y clases asociadas
  const sizeClasses = {
    xs: {
      box: "px-1.5 py-0 text-[9px]",
      icon: "w-2.5 h-2.5",
      gap: "gap-0.5",
    },
    sm: {
      box: "px-2 py-1 text-xs font-medium",
      icon: "w-3 h-3",
      gap: "gap-1",
    },
    md: {
      box: "px-2.5 py-1 text-sm font-medium",
      icon: "w-3.5 h-3.5",
      gap: "gap-1.5",
    },
    lg: {
      box: "px-3 py-2 text-base font-semibold",
      icon: "w-4 h-4",
      gap: "gap-2",
    },
  };

  const { box, icon: iconSize, gap } = sizeClasses[size];
  const variantClasses = variants[variant] || variants.default;

  // Construir clases finales
  const badgeClasses = [baseClasses, variantClasses, box, gap, className]
    .filter(Boolean)
    .join(" ");

  // Etiqueta accesible por defecto usando children (si es texto)
  const defaultAriaLabel =
    ariaLabel || (typeof children === "string" ? children : undefined);

  return (
    <Component
      ref={ref}
      className={badgeClasses}
      aria-label={defaultAriaLabel}
      {...rest}
    >
      {LeftIcon && <LeftIcon className={iconSize} aria-hidden="true" />}
      {/* <span> */}
      {children}
      {/* </span> */}
      {RightIcon && <RightIcon className={iconSize} aria-hidden="true" />}
    </Component>
  );
};
