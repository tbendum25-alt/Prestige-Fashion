// ============================================================
//  Réglages de la boutique : tout se change ici.
// ============================================================
export const STORE = {
  name: 'PRESTIGE FASHION',            // <- nom de la boutique (modifiable)
  shortName: 'PF',
  tagline: "L'élégance, portée au quotidien.",
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '22900000000',
  email: 'prestige-fashion@gmail.com',
  phone: '+229 01 29 22 64 64',
  address: 'Cotonou, Bénin',
  hours: 'Lun – Sam : 9h – 19h',
  socials: {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    youtube: 'https://www.youtube.com/',
  },
  currency: 'FCFA',
  adminPasscode: import.meta.env.VITE_ADMIN_PASSCODE || 'admin123',
};
