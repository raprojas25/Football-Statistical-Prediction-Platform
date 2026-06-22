import React from 'react';

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  props: React.HtmlHTMLAttributes<HTMLElement>;
}

export const IconMenu: React.FC<Props> = ({ children, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white bg-gray-100 text-betano-primary transition-colors hover:bg-white/60 hover:text-white dark:text-betano-secondary dark:hover:text-white"
      {...props}
    >
      {children}
    </button>
  );
};
