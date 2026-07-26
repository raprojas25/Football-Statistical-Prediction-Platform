import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  containerKey: string;
}

export const TableContainer: React.FC<ContainerProps> = ({
  children,
  containerKey,
}) => {
  return (
    <motion.div
      key={containerKey}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="mt-2 overflow-x-auto"
    >
      {children}
    </motion.div>
  );
};
