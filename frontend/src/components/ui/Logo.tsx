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

const Logo: React.FC<LogoProps> = ({ showText = true, size = 'md', className = '' }) => {
  const s = sizes[size];

  return (
    <Link to="/" className={`flex shrink-0 items-center gap-2 ${s.container} ${className}`}>
      <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-betano-primary to-betano-secondary p-1.5 shadow-lg shadow-betano-primary/20">
        <Zap size={s.icon} className="fill-white text-white" />
      </div>
      {showText && (
        <span className="flex items-baseline gap-0 font-black uppercase leading-none tracking-tight">
          <span
            className={`${s.text} ${s.py} rounded-l-md bg-betano-primary px-1 text-white border border-white`}
          >
            Bet
          </span>
          <span
            className={`${s.text} ${s.py} rounded-r-md border border-white px-1 text-betano-primary bg-white`}
          >
            Play
          </span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
