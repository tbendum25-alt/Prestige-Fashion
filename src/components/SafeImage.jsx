import { useState } from 'react';
import { STORE } from '../data/config.js';

// Image avec chargement progressif et visuel de remplacement si la photo est indisponible.
export default function SafeImage({ src, alt = '', className = '', eager = false }) {
  const [state, setState] = useState(src ? 'loading' : 'error');

  if (state === 'error') {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt || 'Image indisponible'}>
        <span className="img-fallback__mark">{STORE.shortName}</span>
        {alt && <span className="img-fallback__text">{alt}</span>}
      </div>
    );
  }
  return (
    <img
      className={`${className} ${state === 'loading' ? 'is-loading' : 'is-loaded'}`}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      onLoad={() => setState('loaded')}
      onError={() => setState('error')}
    />
  );
}
