import React, { useState, useEffect, useMemo } from 'react';

const PLACEHOLDER = '/images/products/placeholder.svg';
const LOCAL_EXTS = ['jpg', 'png', 'webp'];

const SafeImage = ({ src, alt, className, ...rest }) => {
  const candidates = useMemo(() => {
    if (!src) return [PLACEHOLDER];
    if (src.startsWith('data:') || src.startsWith('http')) return [src, PLACEHOLDER];
    const hasExt = /\.(jpe?g|png|webp|gif|svg)$/i.test(src);
    const base = src.replace(/\.(jpe?g|png|webp|gif|svg)$/i, '');
    const list = [];
    if (hasExt) list.push(src);
    for (const ext of LOCAL_EXTS) list.push(`${base}.${ext}`);
    list.push(PLACEHOLDER);
    return [...new Set(list)];
  }, [src]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [src]);

  const currentSrc = candidates[Math.min(index, candidates.length - 1)];

  const handleError = () => {
    setIndex((i) => Math.min(i + 1, candidates.length - 1));
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
      {...rest}
    />
  );
};

export default SafeImage;