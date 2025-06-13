import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  clickable = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-surface-200';
  const hoverClasses = hoverable || clickable ? 'hover:shadow-md transition-all duration-200' : '';
  const clickableClasses = clickable ? 'cursor-pointer' : '';
  
  const cardClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;

  const CardComponent = clickable || hoverable ? motion.div : 'div';
  const motionProps = clickable || hoverable ? {
    whileHover: { y: -2, scale: 1.01 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;