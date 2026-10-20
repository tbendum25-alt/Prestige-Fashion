export const formatPrice = (n) =>
  `${new Intl.NumberFormat('fr-FR').format(Math.round(n || 0)).replace(/\u202f/g, '\u00a0')}\u00a0FCFA`;

export const discountPercent = (price, oldPrice) =>
  oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

export const formatDate = (ts) =>
  new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
