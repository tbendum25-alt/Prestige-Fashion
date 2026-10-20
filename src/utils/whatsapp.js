import { STORE } from '../data/config.js';
import { formatPrice } from './format.js';

export function buildOrderMessage({ customer, lines, total, ref }) {
  const rows = lines
    .map((l) => `• ${l.qty} × ${l.product.name} (${[l.size, l.color].filter(Boolean).join(', ')}) — ${formatPrice(l.qty * l.product.price)}`)
    .join('\n');
  return [
    `Bonjour ${STORE.name}, je souhaite passer commande (réf. ${ref}) :`,
    '',
    rows,
    '',
    `Total : ${formatPrice(total)}`,
    '',
    `Nom : ${customer.name}`,
    `Téléphone : ${customer.phone}`,
    `Ville : ${customer.city}`,
    `Adresse de livraison : ${customer.address}`,
    customer.note ? `Remarque : ${customer.note}` : '',
  ].filter((x, i, a) => x !== '' || a[i - 1] !== '').join('\n');
}

export const whatsappUrl = (message) =>
  `https://wa.me/${String(STORE.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
