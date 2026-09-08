import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { icon: 16, text: 'text-sm', py: 'py-1', container: 'h-9' },
  md: { icon: 20, text: 'text-lg', py: 'py-1', container: 'h-11' },
  lg: { icon: 24, text: 'text-xl', py: 'py-1.5', container: 'h-13' },
};

const Logo: React.FC<LogoProps> = ({
  showText = true,
  size = 'md',
  className = '',
}) => {
  const s = sizes[size];

  return (
    <Link
      to="/"
      className={`flex shrink-0 items-center gap-2 ${s.container} ${className}`}
    >
      <div className="from-betano-primary to-betano-secondary shadow-betano-primary/20 flex items-center justify-center rounded-lg bg-gradient-to-br p-1.5 shadow-lg">
        <Zap size={s.icon} className="fill-white text-white" />
      </div>
      {showText && (
        <span className="flex items-baseline gap-0 leading-none font-black tracking-tight uppercase">
          <span
            className={`${s.text} ${s.py} bg-betano-primary rounded-l-md border border-white px-1 text-white`}
          >
            Bet
          </span>
          <span
            className={`${s.text} ${s.py} text-betano-primary rounded-r-md border border-white bg-white px-1`}
          >
            Play
          </span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
