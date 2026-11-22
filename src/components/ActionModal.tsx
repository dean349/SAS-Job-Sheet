import { useEffect, useMemo, useState } from 'react';
import { Phone, MessageSquare, Copy, X } from 'lucide-react';
import {
  BrandName,
  ManifestEntry,
  buildSmsMessage,
  getTerminalBadgeClasses,
} from '../data/manifest';
import {
  buildSmsHref,
  buildTelHref,
  detectDevicePlatform,
  getNativeLinkProps,
  isEmbeddedIframe,
} from '../utils/phoneLinks';

interface ActionModalProps {
  passenger: ManifestEntry | null;
  brandName: BrandName;
  onClose: () => void;
  onCopy: (text: string, toastMessage: string) => void;
}

export function ActionModal({
  passenger,
  brandName,
  onClose,
  onCopy,
}: ActionModalProps) {
  const [missingDigit, setMissingDigit] = useState('');

  const platform = useMemo(() => detectDevicePlatform(), []);
  const linkProps = useMemo(() => getNativeLinkProps(isEmbeddedIframe()), []);

  useEffect(() => {
    setMissingDigit('');
  }, [passenger?.id]);

  useEffect(() => {
    if (!passenger) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passenger, onClose]);

  if (!passenger) return null;

  const cleanDigit = missingDigit.replace(/\D/g, '').slice(0, 1);
  const displayPhone = passenger.incomplete
    ? cleanDigit
      ? `${cleanDigit}79-721-2090`
      : '_79-721-2090'
    : passenger.phoneDisplay;

  const rawPhone = passenger.incomplete
    ? cleanDigit
      ? `+1${cleanDigit}797212090`
      : ''
    : passenger.phoneRaw;

  const smsBody = buildSmsMessage(passenger, brandName);
  const cashTotal = passenger.pax * passenger.rate;
  const hasPhone = Boolean(rawPhone);

  const telHref = hasPhone ? buildTelHref(rawPhone) : undefined;
  const smsPrefilledHref = hasPhone
    ? buildSmsHref(rawPhone, smsBody, platform)
    : undefined;
  const smsBlankHref = hasPhone ? buildSmsHref(rawPhone, undefined, platform) : undefined;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-passenger-name"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
    >
      <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-extrabold border whitespace-nowrap ${getTerminalBadgeClasses(
                  passenger.terminal
                )}`}
              >
                TERM {passenger.terminal} · {passenger.access.toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {passenger.ship} ({passenger.line})
              </span>
            </div>
            <h3
              id="modal-passenger-name"
              className="text-xl font-extrabold text-white mt-1.5"
            >
              {passenger.name}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 tabular-nums">
              {passenger.pax} Pax &bull; ${cashTotal} Cash Due &bull; {passenger.dropoff}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close action modal"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Missing Area Code Digit Helper (Only shown for Yvette) */}
        {passenger.incomplete && (
          <div className="mt-3.5 bg-amber-500/10 border border-amber-500/40 rounded-2xl p-3">
            <p className="text-xs text-amber-200 font-semibold leading-relaxed">
              First digit of {passenger.name}&apos;s area code was cut off on the printout (
              <span className="font-mono">_79-721-2090</span>). Enter the missing first
              digit to activate Call/Text:
            </p>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={missingDigit}
                onChange={(e) => setMissingDigit(e.target.value)}
                placeholder="9 or 2"
                aria-label="Missing first digit of area code"
                className="w-24 bg-slate-800 border border-amber-400/50 rounded-xl px-3 py-2 text-center text-base font-extrabold text-white focus:outline-none focus:border-amber-300"
              />
              <span className="text-sm font-mono text-slate-300">-79-721-2090</span>
            </div>
          </div>
        )}

        {/* Displayed Phone Number */}
        <div className="mt-3.5 flex items-center justify-between bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-2.5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Passenger Phone
            </div>
            <div className="text-lg font-extrabold tracking-wide text-white font-mono tabular-nums">
              {displayPhone}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onCopy(displayPhone, `Copied ${displayPhone}`)}
            className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 active:scale-95 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy #</span>
          </button>
        </div>

        {/* Primary Native Call & SMS Action Buttons (Android & iOS compatible) */}
        <div className="grid grid-cols-1 gap-2.5 mt-4">
          <a
            href={telHref}
            {...(hasPhone ? linkProps : {})}
            aria-disabled={!hasPhone}
            onClick={(e) => {
              if (!hasPhone) e.preventDefault();
            }}
            className={`min-h-[48px] flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-base shadow-lg shadow-emerald-950/50 transition ${
              !hasPhone ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <Phone className="w-5 h-5" />
            <span>Call Passenger Now</span>
          </a>

          <a
            href={smsPrefilledHref}
            {...(hasPhone ? linkProps : {})}
            aria-disabled={!hasPhone}
            onClick={(e) => {
              if (!hasPhone) e.preventDefault();
            }}
            className={`min-h-[48px] flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 active:scale-[0.99] text-white font-extrabold text-base shadow-lg shadow-sky-950/50 transition ${
              !hasPhone ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Text Dockside Pickup Msg</span>
          </a>

          <a
            href={smsBlankHref}
            {...(hasPhone ? linkProps : {})}
            aria-disabled={!hasPhone}
            onClick={(e) => {
              if (!hasPhone) e.preventDefault();
            }}
            className={`min-h-[44px] flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-[0.99] text-slate-200 font-bold text-sm transition ${
              !hasPhone ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <span>Open Blank Text Message</span>
          </a>
        </div>

        {/* Preview of Pre-filled SMS Text */}
        <div className="mt-3.5 bg-slate-950/85 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Pre-filled SMS Preview
            </span>
            <button
              type="button"
              onClick={() => onCopy(smsBody, 'Copied SMS template')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              Copy Text
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{smsBody}</p>
        </div>
      </div>
    </div>
  );
}
