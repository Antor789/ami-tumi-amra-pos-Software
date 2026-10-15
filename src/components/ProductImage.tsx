import React, { useState } from 'react';
import { Shirt, Smartphone, Sparkles, Tag } from 'lucide-react';
import { ProductCategory } from '../types';

interface ProductImageProps {
  src: string;
  alt: string;
  category?: ProductCategory;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category = 'Apparel',
  className = 'w-full h-full object-cover',
}) => {
  const [hasError, setHasError] = useState(false);

  const renderCategoryIcon = () => {
    switch (category) {
      case 'Apparel':
        return <Shirt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Electronics':
        return <Smartphone className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'Fragrance':
        return <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      default:
        return <Tag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  if (hasError || !src) {
    return (
      <div className={`bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/80 flex flex-col items-center justify-center p-2 text-center select-none ${className}`}>
        {renderCategoryIcon()}
        <span className="text-[10px] font-medium text-slate-500 mt-1 line-clamp-1 max-w-[90%]">
          {alt || 'Sheba Item'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
