import { type ReactNode } from 'react';

interface BoxSpinProps {
  children: ReactNode;
  active?: boolean;
  className?: string;
}

const BoxSpin: React.FC<BoxSpinProps> = ({
  children,
  active = true,
  className = '',
}) => {
  if (!active) return <>{children}</>;

  return (
    <div className={`relative overflow-hidden rounded-lg p-px ${className}`}>
      <div
        className="animate-border-spin absolute inset-0 -top-6/12 h-[200%]"
        style={{
          background:
            'conic-gradient(rgb(244, 114 ,182, 0.6) 0deg, rgb(192, 132 ,252, 1) 0deg, transparent 100deg )',
          filter: 'blur(3px)',
        }}
      />
      <div className="relative flex h-full w-full place-items-stretch items-stretch justify-center justify-items-stretch">
        {children}
      </div>
    </div>
  );
};

export default BoxSpin;
