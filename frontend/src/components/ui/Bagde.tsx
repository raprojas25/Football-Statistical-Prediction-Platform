import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'muted'
    | 'primary'
    | 'default'
    | 'purple'
    | 'blue'
    | 'red'
    | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  leftIcon?: React.ElementType;
  rightIcon?: React.ElementType;
  className?: string;
  ariaLabel?: string;
  as?: React.ElementType;
  rest?: React.HTMLAttributes<HTMLElement>;
}

export const Badge: React.FC<BadgeProps> = React.forwardRef(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = '',
      ariaLabel,
      as: Component = 'span',
      ...rest
    },
    ref,
  ) => {
    // Base: inline-flex con bordes redondeados
    const baseClasses = 'inline-flex items-center rounded w-auto';

    // Mapeo de variantes (modo oscuro incluido)
    const variants = {
      success:
        'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
      danger: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
      warning:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
      info: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400',
      muted: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      primary:
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      outline:
        'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-transparent',
      red: 'bg-red-600 text-white',
      purple:
        'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400',
    };

    // Tamaños y clases asociadas
    const sizeClasses = {
      xs: {
        box: 'px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ',
        icon: 'w-2.5 h-2.5',
        gap: 'gap-0.5',
      },
      sm: {
        box: 'px-2 py-0.5 text-[11px] font-medium tracking-wide',
        icon: 'w-3 h-3',
        gap: 'gap-1',
      },
      md: {
        box: 'px-2.5 py-1 text-sm font-medium',
        icon: 'w-3.5 h-3.5',
        gap: 'gap-1.5',
      },
      lg: {
        box: 'px-3 py-2 text-base font-semibold',
        icon: 'w-4 h-4',
        gap: 'gap-2',
      },
    };

    const { box, icon: iconSize, gap } = sizeClasses[size];
    const variantClasses = variants[variant] || variants.default;

    // Construir clases finales
    const badgeClasses = [baseClasses, variantClasses, box, gap, className]
      .filter(Boolean)
      .join(' ');

    // Etiqueta accesible por defecto usando children (si es texto)
    const defaultAriaLabel =
      ariaLabel || (typeof children === 'string' ? children : undefined);

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
  },
);
