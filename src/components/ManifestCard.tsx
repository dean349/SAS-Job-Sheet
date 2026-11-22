import { Phone, Star, Check, DollarSign } from 'lucide-react';
import { ManifestEntry, getTerminalBadgeClasses } from '../data/manifest';

interface ManifestCardProps {
  item: ManifestEntry;
  isConfirmed: boolean;
  isPaid: boolean;
  flightNote: string;
  onOpenModal: (item: ManifestEntry) => void;
  onToggleConfirmed: (id: number) => void;
  onTogglePaid: (id: number) => void;
  onUpdateFlightNote: (id: number, value: string) => void;
}

export function ManifestCard({
  item,
  isConfirmed,
  isPaid,
  flightNote,
  onOpenModal,
  onToggleConfirmed,
  onTogglePaid,
  onUpdateFlightNote,
}: ManifestCardProps) {
  const cashTotal = item.pax * item.rate;
  const isHotel = item.dropoff !== 'Fort Lauderdale Airport (FLL)';

  return (
    <article
      className={`rounded-2xl p-3.5 sm:p-4 border transition-colors duration-150 ${
        isConfirmed
          ? 'bg-amber-950/35 border-amber-400/60 ring-1 ring-amber-400/25'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Metadata & Cash Due */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap text-xs min-w-0">
          <span
            className={`px-2 py-0.5 rounded-md font-bold border whitespace-nowrap ${getTerminalBadgeClasses(
              item.terminal
            )}`}
          >
            TERM {item.terminal}
          </span>
          <span className="font-bold text-slate-200">{item.ship}</span>
          <span className="text-slate-400">({item.access})</span>
          {item.type === 'Handwritten' && (
            <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 whitespace-nowrap">
              HW
            </span>
          )}
        </div>
        <div className="text-right shrink-0 tabular-nums">
          <span className="text-sm font-extrabold text-emerald-400">${cashTotal}</span>
          <span className="text-xs text-slate-400 ml-1">
            ({item.pax} @ ${item.rate})
          </span>
        </div>
      </div>

      {/* Passenger Name + Compact Phone Button (Same Row, Zero Overlap) */}
      <div className="flex items-center justify-between gap-2.5 mt-2.5">
        <h3 className="text-lg font-extrabold text-white leading-tight truncate min-w-0">
          {item.name}
        </h3>

        <button
          type="button"
          onClick={() => onOpenModal(item)}
          className={`shrink-0 min-h-[38px] inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
            item.incomplete
              ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 hover:bg-amber-600/40'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
          }`}
        >
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span className="tabular-nums whitespace-nowrap">{item.phoneDisplay}</span>
        </button>
      </div>

      {/* Full-Width Drop-off Line */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
          PortMiami &rarr;
        </span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
            isHotel
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
          }`}
        >
          {item.dropoff}
        </span>
      </div>

      {/* Airline / Flight Quick Note Input */}
      <div className="mt-2.5">
        <input
          type="text"
          value={flightNote}
          onChange={(e) => onUpdateFlightNote(item.id, e.target.value)}
          placeholder="Airline / Flight # or pickup note..."
          aria-label={`Flight or pickup note for ${item.name}`}
          className="w-full min-h-[38px] bg-slate-950/75 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Bottom Action Toggles: Highlight Yellow & Cash Paid */}
      <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => onToggleConfirmed(item.id)}
          className={`min-h-[38px] py-1.5 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            isConfirmed
              ? 'bg-amber-400 text-slate-950 border-amber-300'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400/50 hover:text-white'
          }`}
        >
          <Star className={`w-3.5 h-3.5 shrink-0 ${isConfirmed ? 'fill-slate-950' : ''}`} />
          <span>{isConfirmed ? 'Highlighted' : 'Highlight Yellow'}</span>
        </button>

        <button
          type="button"
          onClick={() => onTogglePaid(item.id)}
          className={`min-h-[38px] py-1.5 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
            isPaid
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-400/50 hover:text-white'
          }`}
        >
          {isPaid ? (
            <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
          ) : (
            <DollarSign className="w-3.5 h-3.5 shrink-0" />
          )}
          <span className="tabular-nums">
            {isPaid ? `Cash Paid ($${cashTotal})` : 'Mark Cash Paid'}
          </span>
        </button>
      </div>
    </article>
  );
}
