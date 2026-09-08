import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  type KeyboardEvent,
} from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface SelectOption<TValue = string> {
  label: string;
  value: TValue;
}

interface SelectProps<TOption, TValue> {
  options: TOption[];
  value?: TValue;
  onChange?: (value: TValue) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  error?: string;
  className?: string;
  getOptionLabel?: (option: TOption) => string;
  getOptionValue?: (option: TOption) => TValue;
}

function Select<TOption, TValue>({
  options = [],
  value,
  onChange,
  placeholder = 'Selecciona...',
  id,
  name,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  error,
  className = '',
  getOptionLabel = (opt) => (opt as Record<string, unknown>).label as string,
  getOptionValue = (opt) => (opt as Record<string, unknown>).value as TValue,
}: SelectProps<TOption, TValue>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [internalSelection, setInternalSelection] =
    useState<SelectOption<TValue> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const normalizedOptions = useMemo<SelectOption<TValue>[]>(
    () =>
      options.map((opt) => {
        if (typeof opt === 'string') {
          return { label: opt, value: opt as unknown as TValue };
        }
        return {
          label: getOptionLabel(opt),
          value: getOptionValue(opt),
        };
      }),
    [options, getOptionLabel, getOptionValue],
  );

  const selectedOption = useMemo<SelectOption<TValue> | null>(
    () =>
      value !== undefined
        ? (normalizedOptions.find((opt) => opt.value === value) ?? null)
        : internalSelection,
    [value, normalizedOptions, internalSelection],
  );

  const filteredOptions = useMemo<SelectOption<TValue>[]>(
    () =>
      normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [normalizedOptions, searchTerm],
  );

  const listboxId = `${id ?? name ?? 'select'}-listbox`;

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredOptions.length]);

  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[highlightedIndex] as
      | HTMLElement
      | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex]);

  useEffect(() => {
    if (isOpen && searchable) {
      searchRef.current?.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = useCallback(
    (option: SelectOption<TValue>) => {
      if (value === undefined) {
        setInternalSelection(option);
      }
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm('');
      triggerRef.current?.focus();
    },
    [value, onChange],
  );

  const handleSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'Escape':
          if (searchTerm) {
            setSearchTerm('');
          } else {
            setIsOpen(false);
            triggerRef.current?.focus();
          }
          e.preventDefault();
          break;

        case 'Enter':
          e.preventDefault();
          if (filteredOptions.length > 0 && highlightedIndex >= 0) {
            handleSelect(filteredOptions[highlightedIndex]);
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

        case 'Home':
          e.preventDefault();
          setHighlightedIndex(0);
          break;

        case 'End':
          e.preventDefault();
          setHighlightedIndex(filteredOptions.length - 1);
          break;

        case 'Tab':
          setIsOpen(false);
          break;
      }
    },
    [disabled, searchTerm, filteredOptions, highlightedIndex, handleSelect],
  );

  const handleTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      switch (e.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
        case 'ArrowUp':
          e.preventDefault();
          setIsOpen(true);
          break;
      }
    },
    [disabled],
  );

  const displayText = selectedOption
    ? getOptionLabel(selectedOption)
    : placeholder;

  return (
    <div ref={containerRef} className={`relative min-w-44 ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={name ?? placeholder}
        aria-controls={isOpen ? listboxId : undefined}
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={[
          'flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm shadow-sm transition-all duration-200',
          'focus:ring-2 focus:outline-none',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
            : 'border-betano-border focus:border-betano-primary focus:ring-betano-primary/30',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:border-gray-400',
          'bg-betano-surface text-betano-text',
        ].join(' ')}
      >
        <span
          className={`flex-1 truncate ${
            !selectedOption ? 'text-gray-400 dark:text-gray-500' : ''
          }`}
        >
          {displayText}
        </span>

        <ChevronDown
          size={18}
          className={`ml-2 shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}

      {isOpen && !disabled && (
        <div className="dark:border-betano-border dark:bg-betano-surface absolute z-20 mt-1 w-full origin-top rounded-lg border border-gray-200 bg-white shadow-xl">
          {searchable && (
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchRef}
                type="text"
                aria-label={searchPlaceholder}
                className="border-betano-border w-full rounded-t-lg border-0 border-b bg-transparent py-2.5 pr-8 pl-9 text-sm text-gray-800 placeholder-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder-gray-500"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {searchTerm && (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Limpiar búsqueda"
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          <ul
            ref={listRef}
            role="listbox"
            id={listboxId}
            className="max-h-60 overflow-auto py-1 text-sm"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-gray-400 dark:text-gray-500">
                No hay resultados
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = selectedOption?.value === option.value;
                const isHighlighted = highlightedIndex === index;

                return (
                  <li
                    key={`${option.value}`}
                    role="option"
                    aria-selected={isSelected}
                    className={[
                      'flex cursor-pointer items-center justify-between px-3 py-2.5 text-sm transition-colors',
                      isSelected
                        ? 'bg-betano-primary/15 text-betano-primary'
                        : isHighlighted
                          ? 'dark:bg-betano-light/50 bg-gray-100 text-gray-900 dark:text-gray-100'
                          : 'dark:hover:bg-betano-light/30 text-gray-700 hover:bg-gray-50 dark:text-gray-300',
                    ].join(' ')}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check size={16} className="ml-2 shrink-0" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {name && (
        <input
          type="hidden"
          name={name}
          value={
            selectedOption?.value != null ? String(selectedOption.value) : ''
          }
        />
      )}
    </div>
  );
}

export default Select;
