import React from 'react';

export interface TabItem {
  /** Identificador único del tab (se usa como valor en activeTab) */
  id: string;
  /** Texto visible del tab */
  label: string;
}

interface TabsProps {
  /** Array de objetos con id y label */
  tabs: TabItem[];
  /** ID del tab actualmente activo */
  activeTab: string;
  /** Callback que se ejecuta al hacer clic en un tab, recibe el id del tab */
  onChange: (tabId: string) => void;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

/**
 * Componente Tabs con diseño de borde inferior (Tailwind UI style).
 * Soporta scroll horizontal en móviles y modo oscuro.
 */
const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 border-b-2 px-1 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
              } `}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
