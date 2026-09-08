import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  GalleryVertical,
  Home,
  Info,
  Layers,
  LogIn,
  Menu,
  Phone,
  Search,
  ShieldAlert,
  Target,
  UserPlus,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';
import Logo from '../ui/Logo';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Inicio', icon: Home },
  { path: '/home', label: 'Test', icon: Layers },
  { path: '/cuotas', label: 'Cuotas', icon: GalleryVertical },
  { path: '/fixtures', label: 'Fixtures', icon: Target },
  { path: '/predictor', label: 'Predictor', icon: Target },
  { path: '/mimo', label: 'Mimo', icon: Zap },
  { path: '/equipos', label: 'Equipos', icon: ShieldAlert },
  { path: '/about', label: 'Nosotros', icon: Info },
  { path: '/contacto', label: 'Contacto', icon: Phone },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="border-betano-border bg-betano-primary/95 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
        {/* Logo */}
        <Logo size="sm" />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'text-betano-primary dark:text-betano-primary'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="bg-betano-primary/10 dark:bg-betano-primary/15 absolute inset-0 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon size={16} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-1">
          {/* Desktop search */}
          <div className="relative hidden lg:block">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar..."
              className="focus:border-betano-primary focus:ring-betano-primary/20 dark:border-betano-border dark:focus:border-betano-primary dark:focus:ring-betano-primary/30 h-8 w-44 rounded-lg border border-gray-200 bg-gray-50 pr-3 pl-8 text-xs text-gray-700 placeholder-gray-400 transition-all outline-none focus:w-56 focus:ring-1 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
            />
          </div>

          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!isSearchOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-200 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Buscar"
          >
            <Search size={17} />
          </button>

          {/* Theme toggle */}
          <div className="[&>button]:h-8 [&>button]:w-8 [&>button]:rounded-lg [&>button]:border-0 [&>button]:bg-transparent [&>button]:text-gray-200 [&>button]:hover:bg-gray-100 [&>button]:hover:text-gray-700 dark:[&>button]:text-gray-200 dark:[&>button]:hover:bg-white/10 dark:[&>button]:hover:text-white">
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-200 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-200/50 lg:hidden"
          >
            <div className="px-3 py-2.5 sm:px-6">
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Buscar partidos, equipos..."
                  className="focus:border-betano-primary focus:ring-betano-primary/20 h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pr-3 pl-9 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-1"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="dark:border-betano-border dark:bg-betano-surface overflow-hidden border-t border-gray-200 bg-white lg:hidden"
          >
            <div className="px-2 py-2">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-betano-primary/10 text-betano-primary'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {active && (
                      <span className="bg-betano-primary ml-auto h-1.5 w-1.5 animate-pulse rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Auth buttons */}
            {!isLoggedIn && (
              <div className="dark:border-betano-border border-t border-gray-200 px-4 py-3">
                <button
                  onClick={() => navigate('/auth')}
                  className="dark:border-betano-border flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  <LogIn size={16} />
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="from-betano-primary to-betano-secondary mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-l px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  <UserPlus size={16} />
                  Crear Cuenta
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
