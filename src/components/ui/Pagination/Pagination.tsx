// components/ui/Pagination/Pagination.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';
import Button from '../../../components/ui/Button';

export interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  className,
  siblingCount = 1,
}) => {
  // Versión numerada (con totalPages)
  if (totalPages !== undefined) {
    const range = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const generatePages = () => {
      const totalNumbers = siblingCount * 2 + 3;
      if (totalPages <= totalNumbers) {
        return range(1, totalPages);
      }
      const leftSibling = Math.max(currentPage - siblingCount, 1);
      const rightSibling = Math.min(currentPage + siblingCount, totalPages);
      const showLeftDots = leftSibling > 2;
      const showRightDots = rightSibling < totalPages - 1;

      if (!showLeftDots && showRightDots) {
        const leftRange = range(1, 3 + 2 * siblingCount);
        return [...leftRange, '...', totalPages];
      }
      if (showLeftDots && !showRightDots) {
        const rightRange = range(totalPages - (3 + 2 * siblingCount) + 1, totalPages);
        return [1, '...', ...rightRange];
      }
      if (showLeftDots && showRightDots) {
        const middleRange = range(leftSibling, rightSibling);
        return [1, '...', ...middleRange, '...', totalPages];
      }
      return [];
    };

    const pages = generatePages();

    return (
      <nav className={twMerge('flex items-center justify-center space-x-1', className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        {pages.map((page, index) => {
          if (page === '...') {
            return <span key={index} className="px-3 py-2">...</span>;
          }
          const isActive = page === currentPage;
          return (
            <Button
              key={page}
              variant={isActive ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={isActive ? 'pointer-events-none' : ''}
            >
              {page}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
        {/* Indicador de página actual / total */}
        <span className="ml-4 text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </span>
      </nav>
    );
  }

  // Versión simple (sin totalPages)
  return (
    <div className={twMerge('flex items-center justify-center space-x-4', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
      >
        Anterior
      </Button>
      <span className="text-sm text-gray-600">Página {currentPage}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        Siguiente
      </Button>
    </div>
  );
};

export default Pagination;