import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const IconMenu: React.FC<Props> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
