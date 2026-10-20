import { useEffect } from 'react';
import { STORE } from '../data/config.js';

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${STORE.name}` : STORE.name;
  }, [title]);
}
