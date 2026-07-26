import { Mail, Phone, GitCommit, GitBranch } from "lucide-react";
import Logo from "../ui/Logo";

const Footer = () => {
  return (
    <footer className="bg-slate-700 dark:bg-slate-800 text-white w-full border-t border-betano-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Columna 1: Logo y descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Logo size="md"/>
            </div>
            <p className="text-gray-400 text-sm">
              Conectamos a la comunidad con las actividades culturales de
              nuestra provincia.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white text-sm">
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/calendario"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Calendario
                </a>
              </li>
              <li>
                <a
                  href="/publicar-evento"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Publicar Evento
                </a>
              </li>
              <li>
                <a
                  href="/directorio"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Directorio
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/terminos"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a
                  href="/privacidad"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
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
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
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

