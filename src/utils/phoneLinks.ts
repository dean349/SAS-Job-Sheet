export type DevicePlatform = 'android' | 'ios' | 'other';

export function detectDevicePlatform(): DevicePlatform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) {
    return 'android';
  }
  const isIOSUA = /iPad|iPhone|iPod/i.test(ua);
  const isIPadOS =
    typeof navigator.platform === 'string' &&
    navigator.platform === 'MacIntel' &&
    typeof navigator.maxTouchPoints === 'number' &&
    navigator.maxTouchPoints > 1;
  if (isIOSUA || isIPadOS) {
    return 'ios';
  }
  return 'other';
}

export function isEmbeddedIframe(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function normalizePhoneForDial(rawPhone: string): string {
  const trimmed = rawPhone.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('+')) {
    return `+${trimmed.slice(1).replace(/\D/g, '')}`;
  }
  return trimmed.replace(/\D/g, '');
}

export function buildTelHref(rawPhone: string): string {
  const normalized = normalizePhoneForDial(rawPhone);
  return normalized ? `tel:${normalized}` : '';
}

/**
 * Builds a cross-platform SMS URI:
 * - Android (Google Messages / Samsung Messages / Chrome): `sms:+1...?body=...`
 * - iOS (Apple Messages / Safari): `sms:+1...?&body=...`
 * - Blank message (no body): `sms:+1...`
 */
export function buildSmsHref(
  rawPhone: string,
  body?: string,
  platform: DevicePlatform = detectDevicePlatform()
): string {
  const normalized = normalizePhoneForDial(rawPhone);
  if (!normalized) return '';
  if (!body) {
    return `sms:${normalized}`;
  }
  const encodedBody = encodeURIComponent(body);
  if (platform === 'ios') {
    return `sms:${normalized}?&body=${encodedBody}`;
  }
  // Standard RFC 5724 / Android Intent syntax (?body= works across Android SMS apps)
  return `sms:${normalized}?body=${encodedBody}`;
}

export function getNativeLinkProps(embedded: boolean = isEmbeddedIframe()): {
  target?: '_blank';
  rel?: 'noopener noreferrer';
} {
  if (embedded) {
    return { target: '_blank', rel: 'noopener noreferrer' };
  }
  return {};
}
