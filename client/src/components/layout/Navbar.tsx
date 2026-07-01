import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Link, useNavigate } from 'react-router';
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
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconMenu } from '../ui/IconMenu';

// Define the interface for the props
interface HeaderProps {
  onClick?: () => void; // Optional function that takes no arguments and returns void
  onToggle?: () => void;
}
const Header: React.FC<HeaderProps> = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Cambiar a false por defecto
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setApplicationMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    // navigate("/auth");
    setIsLoggedIn(!isLoggedIn);
    setIsMenuOpen(false);
  };

  const handleRegister = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home size={18} /> },
    { path: '/home', label: 'Test', icon: <Layers size={18} /> },
    { path: '/cuotas', label: 'Cuotas', icon: <GalleryVertical size={18} /> },
    { path: '/fixtures', label: 'Fixtures', icon: <Target size={18} /> },
    { path: '/predictor', label: 'Predictor', icon: <Target size={18} /> },
    { path: '/mimo', label: 'Mimo', icon: <Zap size={18} /> },
    { path: '/equipos', label: 'Equipos', icon: <ShieldAlert size={18} /> },
    { path: '/about', label: 'Nosotros', icon: <Info size={18} /> },
    { path: '/contacto', label: 'Contacto', icon: <Phone size={18} /> },
  ];

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <header className="sticky top-0 z-50 flex w-full border-gray-200 bg-betano-primary text-gray-100 shadow-lg dark:border-gray-100 dark:bg-betano-secondary dark:text-white lg:border-b">
      <div className="flex grow flex-col items-center justify-between lg:flex-row lg:px-6">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray-100 px-3 py-3 dark:border-white/30 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <Link to="/" className="flex items-center text-white lg:hidden">
            <Zap size={20} className="fill-white" />
            <span className="border border-white bg-white px-0.5 py-0 text-lg font-black uppercase text-betano-primary">
              Bet
            </span>
            <span className="border border-white px-0.5 py-0 text-lg font-black uppercase">
              Play
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <IconMenu onClick={toggleApplicationMenu}>
              <Search size={20} />
            </IconMenu>
            {/* <!-- Dark Mode Toggler --> */}
            <ThemeToggle />
            {/* <!-- Dark Mode Toggler --> */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="z-99999 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-betano-primary hover:bg-white/30 hover:text-white dark:text-betano-secondary dark:hover:bg-white/50 dark:hover:text-white lg:hidden"
            >
              {/* Hamburger Icon */}
              <Menu className="" size={20} />
              {/* Cross Icon */}
            </button>
          </div>

          <div className="hidden lg:block">
            <form action="https://formbold.com/s/unique_form_id" method="POST">
              <div className="relative">
                <button className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Search or type command..."
                  className="shadow-xs focus:outline-hidden focus:ring-3 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-100 outline-none placeholder:text-gray-200 focus:border-amber-300 focus:ring-amber-500/10 dark:border-gray-100 dark:bg-dark-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-amber-800 xl:w-[430px]"
                />
              </div>
            </form>
          </div>
        </div>
        {isApplicationMenuOpen && (
          <AnimatePresence mode="popLayout">
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`flex w-full items-center justify-between gap-4 px-5 py-3 shadow-md lg:flex lg:justify-end lg:px-0 lg:shadow-none`}
            >
              <div className="relative">
                <button className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Search or type command..."
                  className="h-11 w-full rounded-lg border border-gray-100/70 bg-transparent px-12 py-2.5 text-sm text-gray-100 shadow-indigo-500 placeholder:text-gray-100/70 focus:shadow-md focus:outline-none"
                />
              </div>

              <button className="inline-flex items-center justify-center rounded-lg bg-betano-green px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-betano-green focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                <Search />
              </button>
            </motion.div>
          </AnimatePresence>
        )}
        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-2 min-w-72 rounded-b-xl shadow-lg">
                {/* Navigation Links */}
                <div className="p-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 rounded-lg px-4 py-2 ${
                        location.pathname === item.path
                          ? 'border border-white/50 bg-betano-green'
                          : 'hover:bg-betano-green hover:text-white'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Auth Buttons Mobile */}
                {!isLoggedIn && (
                  <div className="space-y-3 border-t border-gray-100 p-4 dark:border-gray-100/30">
                    <button
                      onClick={handleLogin}
                      className="flex w-full items-center justify-center space-x-2 rounded-lg border border-white px-4 py-3 text-gray-700 hover:bg-gray-50 dark:border-white dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <LogIn size={18} />
                      <span>Iniciar Sesión</span>
                    </button>
                    <button
                      onClick={handleRegister}
                      className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-green-600 to-betano-green px-4 py-3 text-white hover:from-green-600 hover:to-betano-green"
                    >
                      <UserPlus size={18} />
                      <span>Crear Cuenta</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
