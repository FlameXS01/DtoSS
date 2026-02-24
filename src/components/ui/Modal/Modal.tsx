import React from 'react';
import { twMerge } from 'tailwind-merge';
import Button from '../Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      {/* Modal content */}
      <div
        className={twMerge(
          'relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-xl',
          className
        )}
      >
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        <div className="mb-6">{children}</div>
        {footer ? (
          <div className="flex justify-end space-x-2">{footer}</div>
        ) : (
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;