import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Plus, AlertCircle } from 'lucide-react';
import React, { useEffect } from 'react';

interface ModalProps {
  showIcon?: boolean;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  showIcon = false, // renombrado y con mejor nombre
  isOpen,
  onClose,
  title,
  description,
  footer, // ahora puede ser ReactNode
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Manejo de tecla Escape
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) onClose();
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm"
          onClick={handleOverlayClick}
          role="presentation"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`flex w-full flex-col rounded-2xl bg-white shadow-2xl dark:bg-gray-800 ${sizeClasses[size]}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header - sin scroll, siempre visible */}
            <div
              className={`flex items-center justify-between border-b border-gray-200 dark:border-gray-700 ${showIcon ? 'p-6' : 'px-6 py-4'} `}
            >
              <div className="flex items-center space-x-3">
                {showIcon && (
                  <div className="rounded-lg bg-linear-to-br from-red-500 to-orange-500 p-2">
                    <Plus className="text-white" size={20} />
                  </div>
                )}
                <div>
                  <h2
                    id="modal-title"
                    className="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    {title}
                  </h2>
                  {description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido con scroll independiente */}
            <div className="max-h-[60vh] overflow-y-auto p-6">{children}</div>

            {/* Footer flexible */}
            {footer && (
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900/50">
                {typeof footer === 'string' ? (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <AlertCircle size={16} className="mr-2 shrink-0" />
                    {footer}
                  </div>
                ) : (
                  footer
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

//example

/*
<NewModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  title="Crear nuevo elemento"
  description="Completa los datos para continuar"
  showIcon
  footer={
    <div className="flex justify-end space-x-2">
      <button className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
    </div>
  }
  size="lg"
>
  contenido del modal
</NewModal>
*/
