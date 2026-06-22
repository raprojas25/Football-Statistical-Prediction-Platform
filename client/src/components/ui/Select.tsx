import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// Tipos internos normalizados
interface NormalizedOption {
  label: string;
  value: any;
}

interface SelectProps {
  options?: any[];
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => any;
}

const Select: React.FC<SelectProps> = ({
  options = [],
  value = undefined,
  onChange,
  placeholder = 'Selecciona...',
  id,
  name,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  getOptionLabel = (opt) => opt.label,
  getOptionValue = (opt) => opt.value,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [internalSelected, setInternalSelected] =
    useState<NormalizedOption | null>(null);

  // Normalizar opciones a objetos { label, value }
  const normalizedOptions: NormalizedOption[] = options.map((opt) =>
    typeof opt === 'string'
      ? { label: opt, value: opt }
      : { label: getOptionLabel(opt), value: getOptionValue(opt) },
  );

  // Estado controlado o interno
  const selectedOption: NormalizedOption | null =
    value !== undefined
      ? normalizedOptions.find((opt) => opt.value === value) || null
      : internalSelected;

  // Referencias
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filtrar opciones
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Seleccionar opción
  const handleSelect = (option: NormalizedOption) => {
    if (value === undefined) {
      setInternalSelected(option);
    }
    onChange?.(option.value);
    setIsOpen(false);
    setSearchTerm('');
    buttonRef.current?.focus();
  };

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Foco en el input de búsqueda al abrir
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Manejo de teclado en el input de búsqueda
  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Escape':
        if (searchTerm) {
          setSearchTerm('');
        } else {
          setIsOpen(false);
          buttonRef.current?.focus();
        }
        e.preventDefault();
        break;

      case 'Enter':
        e.preventDefault();
        if (filteredOptions.length > 0 && highlightedIndex >= 0) {
          onChange?.(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
          buttonRef.current?.focus();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev,
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;

      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  // Manejo de teclado en el botón principal
  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(true);
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        setIsOpen(true);
        break;
    }
  };

  const displayText = selectedOption
    ? getOptionLabel(selectedOption)
    : placeholder;

  return (
    <div ref={containerRef} className="relative min-w-44 font-sans">
      {/* Control visible */}
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
        disabled={disabled}
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-gray-600 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-primary-400 dark:focus:ring-primary-400 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex items-center justify-between`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleButtonKeyDown}
      >
        <span className="flex-1 overflow-hidden overflow-ellipsis">
          {displayText}
        </span>
        <ChevronDown
          size={20}
          className={`transform text-gray-600 transition-all duration-200 dark:text-gray-300 ${
            isOpen ? 'rotate-180' : ''
          } `}
        />
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          role="listbox"
          className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
        >
          {searchable && (
            <input
              ref={searchInputRef}
              type="text"
              className="w-full rounded-t-md border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          )}

          <ul
            ref={listRef}
            role="listbox"
            className="max-h-60 overflow-auto py-1 text-base sm:text-sm"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                No hay resultados
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  className={`flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 md:text-base ${
                    selectedOption?.value === option.value
                      ? 'bg-primary-200 text-primary-700 dark:bg-primary-600 dark:text-primary-300'
                      : ''
                  } `}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={selectedOption?.value === option.value}
                >
                  <span className="truncate">{getOptionLabel(option)}</span>
                  {selectedOption?.value === option.value && (
                    <Check
                      size={18}
                      className="text-primary-600 dark:text-primary-200"
                    />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Input oculto para formularios nativos */}
      {name && (
        <input
          type="hidden"
          id={id}
          name={name}
          value={selectedOption?.value ?? ''}
        />
      )}
    </div>
  );
};

export default Select;
