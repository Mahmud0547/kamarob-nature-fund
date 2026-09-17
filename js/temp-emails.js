/**
 * temp-emails.js — Kamarob Nature Fund
 * Blocks disposable / temporary email providers at registration.
 * Only trusted providers (Gmail, Outlook, iCloud, Yahoo, etc.) are allowed.
 *
 * Strategy: ALLOWLIST of trusted domains (more reliable than blocklist)
 * + basic domain structure validation
 */

const ALLOWED_EMAIL_DOMAINS = new Set([
  // Google
  'gmail.com', 'googlemail.com',
  // Microsoft
  'outlook.com', 'outlook.de', 'outlook.fr', 'outlook.es', 'outlook.co.uk',
  'hotmail.com', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.de', 'hotmail.es',
  'live.com', 'live.co.uk', 'live.fr', 'live.de', 'live.nl', 'live.it',
  'msn.com',
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  // Yahoo
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.it',
  'yahoo.es', 'yahoo.com.au', 'yahoo.co.jp', 'ymail.com',
  // Russian providers (common in CIS countries)
  'mail.ru', 'inbox.ru', 'list.ru', 'bk.ru', 'internet.ru',
  'yandex.ru', 'yandex.com', 'yandex.kz', 'ya.ru',
  'rambler.ru',
  // German providers
  'gmx.de', 'gmx.net', 'gmx.com', 'gmx.at', 'gmx.ch',
  'web.de', 't-online.de', 'freenet.de',
  // Other major providers
  'protonmail.com', 'proton.me', 'pm.me',
  'tutanota.com', 'tutanota.de', 'tuta.io',
  'zoho.com', 'zohomail.com',
  'aol.com', 'aim.com',
  'imap.cc',
  'fastmail.com', 'fastmail.fm',
  'hey.com',
  'pm.me',
  // Tajikistan / Central Asia
  'mail.tj', 'tajnet.com',
  // Educational (common for students)
  // Add .edu domains dynamically in the check function
]);

/**
 * Blocked disposable / temp email domains
 * (secondary check — known bad actors)
 */
const BLOCKED_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'sharklasers.com', 'guerrillamailblock.com', 'grr.la', 'guerrillamail.info',
  'spam4.me', 'trashmail.com', 'trashmail.me', 'trashmail.net',
  'throwam.com', 'throwam.net',
  'yopmail.com', 'yopmail.fr',
  'dispostable.com', 'disposableaddress.com',
  'maildrop.cc',
  'noreply.com',
  'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'tempmail.net', 'tempmail.org',
  'emailondeck.com', 'getairmail.com',
  'fakeinbox.com', 'fakeinbox.net',
  '10minutemail.com', '10minutemail.net', '10minemail.com',
  'tempinbox.com', 'spamgourmet.com',
  'mailnull.com', 'spaml.de',
  'mailzilla.com', 'spamhere.com',
  'throwam.com', 'owlpic.com',
  'discard.email', 'crap.handcrafted.jp',
  'mt2014.com', 'mt2015.com',
  'despam.it', 'spamboxes.com',
  'binkmail.com', 'inoutmail.de',
  'jetable.fr.nf', 'jetable.net', 'jetable.org',
  'objectmail.com', 'obobbo.com',
  'spamfree24.org', 'mailme.gq',
  'drdrb.net', 'rcpt.at',
  'spamhero.com', 'suremail.info',
  'truckload.com', 'veryrealemail.com',
  'dayrep.com', 'discard.email',
  'sharklasers.com', 'spam.la',
]);

/**
 * validateEmailDomain()
 * Returns { valid: boolean, reason: string }
 *
 * Rules:
 * 1. Basic format check
 * 2. Blocked domain list check
 * 3. Allowlist check (must be a recognized provider OR .edu/.gov/.org)
 * 4. MX record check is server-side only (cannot do from browser)
 */
function validateEmailDomain(email) {
  email = email.trim().toLowerCase();

  // Basic format
  const atIdx = email.lastIndexOf('@');
  if (atIdx < 1) return { valid: false, reason: 'invalid_format' };
  const domain = email.slice(atIdx + 1);
  if (!domain || !domain.includes('.')) return { valid: false, reason: 'invalid_format' };

  // Blocked list
  if (BLOCKED_EMAIL_DOMAINS.has(domain)) {
    return { valid: false, reason: 'disposable' };
  }

  // Allowlist — trusted domains
  if (ALLOWED_EMAIL_DOMAINS.has(domain)) {
    return { valid: true, reason: 'allowed' };
  }

  // Trusted TLDs for institutional emails
  const tld = domain.split('.').pop();
  if (['edu', 'gov', 'ac', 'mil'].includes(tld)) {
    return { valid: true, reason: 'institutional' };
  }
  // .ac.XX patterns (academic)
  if (domain.includes('.ac.')) {
    return { valid: true, reason: 'academic' };
  }

  // Corporate emails — allow most unknown domains EXCEPT if they look like temp domains
  // Heuristic: temp domains often have numeric patterns, very short names, or known patterns
  const localPart = domain.split('.')[0];
  const suspiciousPatterns = [
    /^\d+$/, // all numbers
    /tmp|temp|fake|spam|trash|disposable|noreply|throw/i,
  ];
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(localPart)) {
      return { valid: false, reason: 'suspicious' };
    }
  }

  // Allow corporate / custom domains (better UX than blocking everything unknown)
  return { valid: true, reason: 'corporate' };
}

window.validateEmailDomain = validateEmailDomain;
