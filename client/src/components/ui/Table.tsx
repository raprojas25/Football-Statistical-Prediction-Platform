import { ReactNode } from 'react';

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}
// Props for TableHead
interface TableHeadProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
  align?: 'stard' | 'center' | 'end';
}
// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
  isHeader?: boolean;
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  className?: string; // Optional className for styling
  align?: 'stard' | 'center' | 'end';
  rowSpan?: number;
}
const textAlign = {
  center: 'text-center',
  stard: 'text-left',
  end: 'text-right',
};

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <table className={`min-w-full text-xs ${className}`}>{children}</table>
  );
};

// TableHeader Component
const THead: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return (
    <tbody
      className={`divide-y border-slate-200 dark:divide-slate-600/80 ${className}`}
    >
      {children}
    </tbody>
  );
};

// TableRow Component
const TR: React.FC<TableRowProps> = ({
  children,
  className,
  isHeader = false,
}) => {
  return (
    <tr
      className={`${isHeader ? 'border-b border-slate-200 bg-white/5 text-slate-700 dark:border-betano-border dark:text-betano-muted' : 'text-slate-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-betano-surface/50'} ${className}`}
    >
      {children}
    </tr>
  );
};

// TableRow Component
const TH: React.FC<TableHeadProps> = ({
  children,
  className,
  align = 'center',
}) => {
  return (
    <th
      className={`whitespace-nowrap px-2 py-2 ${textAlign[align]} ${className}`}
    >
      {children}
    </th>
  );
};

// TableRow Component
const TD: React.FC<TableCellProps> = ({
  children,
  className,
  align = 'center',
  rowSpan,
  ...props
}) => {
  return (
    <td
      rowSpan={rowSpan}
      {...props}
      className={`whitespace-nowrap px-2 py-2 ${textAlign[align]} ${className}`}
    >
      {children}
    </td>
  );
};

export { Table, THead, TBody, TR, TD, TH };
