import { Phone, Star, Check, DollarSign } from 'lucide-react';
import { ManifestEntry, getTerminalBadgeClasses } from '../data/manifest';

interface ManifestTableProps {
  items: ManifestEntry[];
  confirmedMap: Record<number, boolean>;
  paidMap: Record<number, boolean>;
  onOpenModal: (item: ManifestEntry) => void;
  onToggleConfirmed: (id: number) => void;
  onTogglePaid: (id: number) => void;
}

export function ManifestTable({
  items,
  confirmedMap,
  paidMap,
  onOpenModal,
  onToggleConfirmed,
  onTogglePaid,
}: ManifestTableProps) {
  return (
    <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
      <table className="w-full text-left border-collapse min-w-[820px]">
        <thead>
          <tr className="bg-cyan-950/70 text-cyan-100 text-xs uppercase tracking-wider border-b border-slate-800">
            <th className="py-3 px-3.5 font-bold">Pickup</th>
            <th className="py-3 px-2.5 font-bold">Term</th>
            <th className="py-3 px-3 font-bold">Ship</th>
            <th className="py-3 px-3 font-bold">Passenger</th>
            <th className="py-3 px-3 font-bold">Phone (Tap Call/Text)</th>
            <th className="py-3 px-3 font-bold">Drop-Off</th>
            <th className="py-3 px-2.5 font-bold text-center">Pax</th>
            <th className="py-3 px-3 font-bold text-right">Cash Due</th>
            <th className="py-3 px-3 font-bold text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-sm">
          {items.map((item) => {
            const isConfirmed = !!confirmedMap[item.id];
            const isPaid = !!paidMap[item.id];
            const cashTotal = item.pax * item.rate;
            const isHotel = item.dropoff !== 'Fort Lauderdale Airport (FLL)';

            return (
              <tr
                key={item.id}
                className={`transition-colors ${
                  isConfirmed ? 'bg-amber-950/35' : 'hover:bg-slate-800/50'
                }`}
              >
                <td className="py-2.5 px-3.5 text-xs font-semibold text-slate-300 whitespace-nowrap">
                  {item.pickup}
                </td>
                <td className="py-2.5 px-2.5 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-extrabold border ${getTerminalBadgeClasses(
                      item.terminal
                    )}`}
                  >
                    {item.terminal}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-xs font-bold text-white whitespace-nowrap">
                  <span>{item.ship}</span>
                  {item.type === 'Handwritten' && (
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                      HW
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-sm font-extrabold text-white whitespace-nowrap">
                  {item.name}
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onOpenModal(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-transform active:scale-95 ${
                      item.incomplete
                        ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 hover:bg-amber-600/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span className="tabular-nums">{item.phoneDisplay}</span>
                  </button>
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isHotel
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-500/15 text-cyan-300'
                    }`}
                  >
                    {item.dropoff}
                  </span>
                </td>
                <td className="py-2.5 px-2.5 text-center text-xs font-extrabold text-white tabular-nums">
                  {item.pax}
                </td>
                <td className="py-2.5 px-3 text-right text-xs font-extrabold text-emerald-400 tabular-nums">
                  ${cashTotal}
                </td>
                <td className="py-2.5 px-3 text-center whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleConfirmed(item.id)}
                      aria-label={isConfirmed ? 'Remove yellow highlight' : 'Highlight yellow'}
                      className={`min-w-[32px] min-h-[32px] inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                        isConfirmed
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isConfirmed ? 'fill-slate-950' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onTogglePaid(item.id)}
                      aria-label={isPaid ? 'Mark unpaid' : 'Mark cash paid'}
                      className={`min-w-[44px] min-h-[32px] inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        isPaid
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isPaid ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Paid</span>
                        </>
                      ) : (
                        <DollarSign className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
