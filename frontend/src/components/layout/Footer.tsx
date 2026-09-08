import { Mail, Phone, GitCommit, GitBranch } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
  return (
    <footer className="border-betano-border w-full border-t bg-slate-700 text-white dark:bg-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Columna 1: Logo y descripción */}
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <Logo size="md" />
            </div>
            <p className="text-sm text-gray-400">
              Conectamos a la comunidad con las actividades culturales de
              nuestra provincia.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-400 hover:text-white">
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/calendario"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Calendario
                </a>
              </li>
              <li>
                <a
                  href="/publicar-evento"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Publicar Evento
                </a>
              </li>
              <li>
                <a
                  href="/directorio"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Directorio
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/terminos"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a
                  href="/privacidad"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-gray-400" />
                <span className="text-sm text-gray-400">+51 987 654 321</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-400" />
                <span className="text-sm text-gray-400">
                  info@culturaviva.com
                </span>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <a href="#" className="hover:text-blue-400">
                  <GitCommit size={20} />
                </a>
                <a href="#" className="hover:text-pink-400">
                  <GitBranch size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Plataforma de Actividades Culturales.
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
