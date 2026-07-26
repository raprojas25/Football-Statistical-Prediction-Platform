import { type ReactNode } from 'react';

interface BoxSpinProps {
  children: ReactNode;
  active?: boolean;
  className?: string;
}

const BoxSpin: React.FC<BoxSpinProps> = ({ children, active = true, className = '' }) => {
  if (!active) return <>{children}</>;

  return (
    <div className={`relative overflow-hidden rounded-lg p-px ${className}`}>
      <div
        className="absolute inset-0 animate-border-spin h-[200%] -top-6/12"
        style={{
          background:
            'conic-gradient(rgb(244, 114 ,182, 0.6) 0deg, rgb(192, 132 ,252, 1) 0deg, transparent 100deg )',
          filter: 'blur(3px)',
        }}
      />
      <div className="relative flex justify-items-stretch justify-center place-items-stretch items-stretch h-full w-full">{children}</div>
    </div>
  );
};

export default BoxSpin;
