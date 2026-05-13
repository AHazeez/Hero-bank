import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  type,
  children,
  className = '',
  onClose
}) => {
  const typeClasses = {
    success: 'bg-green-bg text-green border border-green/20',
    error: 'bg-red-bg text-red border border-red/20',
    warning: 'bg-amber-bg text-amber border border-amber/20',
    info: 'bg-blue-bg text-blue border border-blue/20'
  };

  const classes = `
    alert
    p-3.5 rounded-r text-sm
    ${typeClasses[type]}
    ${className}
  `.trim();

  return (
    <div className={classes}>
      <div className="flex items-center justify-between">
        <div>{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current hover:opacity-70"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
