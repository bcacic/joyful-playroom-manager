
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card = ({ children, className, hoverable = false, ...props }: CardProps) => {
  return (
    <div 
      className={cn(
        "bg-card rounded-lg border border-border p-6 shadow-sm transition-all duration-200 animate-scale", 
        hoverable && "hover:shadow-md hover:-translate-y-1",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
