import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Search,
  X,
  LayoutGrid,
  Table2,
  Ship,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import {
  BrandName,
  EXTRA_BERTH_NOTES,
  MANIFEST_DATA,
  ManifestEntry,
  SHIP_TABS,
  STATUS_FILTERS,
  ShipId,
  StatusFilterId,
  getTerminalBadgeClasses,
} from './data/manifest';
import { usePersistentState } from './hooks/usePersistentState';
import { ManifestCard } from './components/ManifestCard';
import { ManifestTable } from './components/ManifestTable';
import { ActionModal } from './components/ActionModal';

export default function App() {
  const [activeShip, setActiveShip] = useState<ShipId>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilterId>('ALL');
  const [currentView, setCurrentView] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');

  const [brandName, setBrandName] = usePersistentState<BrandName>('dean_brand', 'SAS');
  const [confirmedMap, setConfirmedMap] = usePersistentState<Record<number, boolean>>(
    'dean_confirmed_1122',
    {}
  );
  const [paidMap, setPaidMap] = usePersistentState<Record<number, boolean>>(
    'dean_paid_1122',
    {}
  );
  const [flightNotesMap, setFlightNotesMap] = usePersistentState<Record<number, string>>(
    'dean_notes_1122',
    {}
  );

  const [activePassenger, setActivePassenger] = useState<ManifestEntry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  }, []);

  const copyTextToClipboard = useCallback(
    async (text: string, message: string) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          showToast(message);
          return;
        }
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        tempInput.setAttribute('readonly', '');
        tempInput.setAttribute('aria-hidden', 'true');
        tempInput.style.position = 'fixed';
        tempInput.style.top = '0';
        tempInput.style.left = '0';
        tempInput.style.fontSize = '16px';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.focus({ preventScroll: true });
        tempInput.select();
        tempInput.setSelectionRange(0, text.length);
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(message);
      } catch {
        showToast('Press and hold to copy');
      }
    },
    [showToast]
  );

  const toggleConfirmed = useCallback(
    (id: number) => {
      setConfirmedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    },
    [setConfirmedMap]
  );

  const togglePaid = useCallback(
    (id: number) => {
      setPaidMap((prev) => ({ ...prev, [id]: !prev[id] }));
    },
    [setPaidMap]
  );

  const updateFlightNote = useCallback(
    (id: number, value: string) => {
      setFlightNotesMap((prev) => ({ ...prev, [id]: value }));
    },
    [setFlightNotesMap]
  );

  const handleSelectShip = useCallback((shipId: ShipId) => {
    setActiveShip(shipId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { confirmedCount, cashCollected } = useMemo(() => {
    let confirmed = 0;
    let cash = 0;
    for (const item of MANIFEST_DATA) {
      if (confirmedMap[item.id]) confirmed += 1;
      if (paidMap[item.id]) cash += item.pax * item.rate;
    }
    return { confirmedCount: confirmed, cashCollected: cash };
  }, [confirmedMap, paidMap]);

  // Per-ship aggregate counts for Ship Tabs
  const shipTabCounts = useMemo(() => {
    const counts: Record<
      string,
      { bookings: number; pax: number; confirmed: number; paidCash: number; totalCash: number }
    > = {};
    for (const shipMeta of SHIP_TABS) {
      counts[shipMeta.id] = { bookings: 0, pax: 0, confirmed: 0, paidCash: 0, totalCash: 0 };
    }
    for (const item of MANIFEST_DATA) {
      const bucket = counts[item.ship];
      if (!bucket) continue;
      bucket.bookings += 1;
      bucket.pax += item.pax;
      const due = item.pax * item.rate;
      bucket.totalCash += due;
      if (confirmedMap[item.id]) bucket.confirmed += 1;
      if (paidMap[item.id]) bucket.paidCash += due;
    }
    return counts;
  }, [confirmedMap, paidMap]);

  // Items scoped to the selected ship (or all ships) before applying status/search
  const shipScopedItems = useMemo(() => {
    if (activeShip === 'BERTHS') return [];
    if (activeShip === 'ALL') return MANIFEST_DATA;
    return MANIFEST_DATA.filter((item) => item.ship === activeShip);
  }, [activeShip]);

  // Dynamic counts for Status Filter pills based on active ship
  const statusFilterCounts = useMemo(() => {
    const counts: Record<StatusFilterId, number> = {
      ALL: shipScopedItems.length,
      UNCONFIRMED: 0,
      CONFIRMED: 0,
      UNPAID: 0,
      HOTELS: 0,
      HANDWRITTEN: 0,
    };
    for (const item of shipScopedItems) {
      if (confirmedMap[item.id]) counts.CONFIRMED += 1;
      else counts.UNCONFIRMED += 1;
      if (!paidMap[item.id]) counts.UNPAID += 1;
      if (item.dropoff !== 'Fort Lauderdale Airport (FLL)') counts.HOTELS += 1;
      if (item.type === 'Handwritten') counts.HANDWRITTEN += 1;
    }
    return counts;
  }, [shipScopedItems, confirmedMap, paidMap]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return shipScopedItems.filter((item) => {
      if (statusFilter === 'UNCONFIRMED' && confirmedMap[item.id]) return false;
      if (statusFilter === 'CONFIRMED' && !confirmedMap[item.id]) return false;
      if (statusFilter === 'UNPAID' && paidMap[item.id]) return false;
      if (statusFilter === 'HOTELS' && item.dropoff === 'Fort Lauderdale Airport (FLL)') {
        return false;
      }
      if (statusFilter === 'HANDWRITTEN' && item.type !== 'Handwritten') return false;

      if (!query) return true;
      const searchable = `${item.name} ${item.phoneDisplay} ${item.ship} ${item.terminal} ${item.dropoff} ${item.note} ${
        flightNotesMap[item.id] || ''
      }`.toLowerCase();
      return searchable.includes(query);
    });
  }, [shipScopedItems, statusFilter, searchQuery, confirmedMap, paidMap, flightNotesMap]);

  const filteredSummary = useMemo(() => {
    let totalPax = 0;
    let totalCash = 0;
    let paidCash = 0;
    for (const item of filteredItems) {
      totalPax += item.pax;
      const due = item.pax * item.rate;
      totalCash += due;
      if (paidMap[item.id]) {
        paidCash += due;
      }
    }
    return {
      bookingsCount: filteredItems.length,
      totalPax,
      totalCash,
      paidCash,
    };
  }, [filteredItems, paidMap]);

  const activeShipMeta = useMemo(
    () => SHIP_TABS.find((s) => s.id === activeShip) || null,
    [activeShip]
  );

  const activeShipIndex = useMemo(
    () => SHIP_TABS.findIndex((s) => s.id === activeShip),
    [activeShip]
  );

  const prevShip = activeShipIndex > 0 ? SHIP_TABS[activeShipIndex - 1] : null;
  const nextShip =
    activeShipIndex >= 0 && activeShipIndex < SHIP_TABS.length - 1
      ? SHIP_TABS[activeShipIndex + 1]
      : null;

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 pb-20">
      {/* Compact Sticky Top Command Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap shrink-0">
                11-22
              </span>
              <h1 className="text-sm sm:text-xl font-extrabold tracking-tight text-white truncate">
                PortMiami &rarr; FLL <span className="hidden sm:inline">/ Hotels</span>
              </h1>
            </div>
            <p className="hidden sm:block text-xs text-slate-400 mt-0.5">
              Tap a ship tab to isolate its berth, or tap any phone number to{' '}
              <span className="text-emerald-400 font-semibold">Call</span> /{' '}
              <span className="text-sky-400 font-semibold">Text</span>
            </p>
          </div>

          {/* Brand Toggle for Pre-filled SMS Scripts */}
          <div
            className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 shrink-0"
            role="group"
            aria-label="SMS Brand Name"
          >
            <button
              type="button"
              onClick={() => setBrandName('SAS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                brandName === 'SAS'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              SAS
            </button>
            <button
              type="button"
              onClick={() => setBrandName('A Luxury Vans')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                brandName === 'A Luxury Vans'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              A Luxury Vans
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 space-y-4">
        {/* Live Shift Metrics Strip */}
        <section aria-label="Overall shift totals">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Bookings
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white tabular-nums mt-0.5">
                33 <span className="text-xs font-medium text-slate-400">(5 HW)</span>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Total Pax
              </div>
              <div className="text-base sm:text-lg font-extrabold text-cyan-300 tabular-nums mt-0.5">
                93
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Confirmed
              </div>
              <div className="text-base sm:text-lg font-extrabold text-amber-300 tabular-nums mt-0.5">
                {confirmedCount} / 33
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Cash Paid
              </div>
              <div className="text-base sm:text-lg font-extrabold text-emerald-400 tabular-nums mt-0.5">
                ${cashCollected.toLocaleString()}{' '}
                <span className="text-xs font-medium text-slate-400">/ $1,860</span>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Ship Tabs Navigation */}
        <section aria-label="Ship navigation tabs" className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Ship className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ships &amp; Terminals</span>
            </div>
            {activeShip !== 'ALL' && (
              <button
                type="button"
                onClick={() => handleSelectShip('ALL')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 whitespace-nowrap"
              >
                Show All Ships
              </button>
            )}
          </div>

          <div
            className="flex items-stretch gap-2 overflow-x-auto overscroll-x-contain no-scrollbar pb-1"
            role="tablist"
            aria-label="Select ship"
          >
            {/* All Ships Tab */}
            <button
              type="button"
              role="tab"
              aria-selected={activeShip === 'ALL'}
              onClick={() => handleSelectShip('ALL')}
              className={`shrink-0 min-h-[48px] px-3.5 py-2 rounded-xl border text-left transition-colors flex flex-col justify-center whitespace-nowrap ${
                activeShip === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow'
                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-xs font-extrabold leading-tight">All Ships</span>
              <span
                className={`text-[11px] font-semibold tabular-nums mt-0.5 ${
                  activeShip === 'ALL' ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                33 · 93 pax
              </span>
            </button>

            {/* Individual Ship Tabs */}
            {SHIP_TABS.map((shipMeta) => {
              const isSelected = activeShip === shipMeta.id;
              const stats = shipTabCounts[shipMeta.id];
              const allConfirmed = stats.confirmed === stats.bookings && stats.bookings > 0;

              return (
                <button
                  key={shipMeta.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectShip(shipMeta.id)}
                  className={`shrink-0 min-h-[48px] px-3.5 py-2 rounded-xl border text-left transition-colors flex flex-col justify-center whitespace-nowrap ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow'
                      : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold leading-none border ${
                        isSelected
                          ? 'bg-slate-950/20 text-slate-950 border-slate-950/25'
                          : getTerminalBadgeClasses(shipMeta.terminal)
                      }`}
                    >
                      {shipMeta.terminal}
                    </span>
                    <span className="text-xs font-extrabold leading-tight">
                      {shipMeta.shortLabel}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] font-semibold tabular-nums mt-0.5 flex items-center gap-1.5 ${
                      isSelected ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    <span>
                      {stats.bookings} · {stats.pax} pax
                    </span>
                    {allConfirmed && (
                      <span
                        className={`font-bold ${
                          isSelected ? 'text-slate-950' : 'text-amber-300'
                        }`}
                      >
                        · Done
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Other Berths (0 Pax) Tab */}
            <button
              type="button"
              role="tab"
              aria-selected={activeShip === 'BERTHS'}
              onClick={() => handleSelectShip('BERTHS')}
              className={`shrink-0 min-h-[48px] px-3.5 py-2 rounded-xl border text-left transition-colors flex flex-col justify-center whitespace-nowrap ${
                activeShip === 'BERTHS'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow'
                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-xs font-extrabold leading-tight">Other Berths</span>
              <span
                className={`text-[11px] font-semibold tabular-nums mt-0.5 ${
                  activeShip === 'BERTHS' ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                B · C · J (0 pax)
              </span>
            </button>
          </div>
        </section>

        {/* Search + View Mode Switcher + Status Sub-Filters (hidden on BERTHS tab) */}
        {activeShip !== 'BERTHS' && (
          <section className="space-y-2.5" aria-label="Search and status filters">
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeShipMeta
                      ? `Search ${activeShipMeta.shortLabel} passengers...`
                      : 'Search name, phone, ship, hotel...'
                  }
                  aria-label="Search manifest"
                  className="w-full min-h-[42px] bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div
                className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0"
                role="group"
                aria-label="View mode"
              >
                <button
                  type="button"
                  onClick={() => setCurrentView('cards')}
                  className={`min-h-[34px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    currentView === 'cards'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('table')}
                  className={`min-h-[34px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    currentView === 'table'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  <span>Landscape</span>
                </button>
              </div>
            </div>

            {/* Secondary Status Filter Chips */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto overscroll-x-contain no-scrollbar pb-0.5"
              role="group"
              aria-label="Filter by booking status"
            >
              {STATUS_FILTERS.map((f) => {
                const isActive = statusFilter === f.id;
                const count = statusFilterCounts[f.id];
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStatusFilter(f.id)}
                    className={`shrink-0 min-h-[34px] px-3 py-1 rounded-full text-xs font-bold transition-colors border whitespace-nowrap tabular-nums ${
                      isActive
                        ? 'bg-slate-100 text-slate-950 border-white'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {f.label} ({count})
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Contextual Banner: Either All-Ships Destination Summary OR Active Ship Staging Card */}
        {activeShip === 'ALL' && (
          <section
            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
            aria-label="Destination breakdown"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  FLL Airport Drop-Off
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  31 bookings &bull; All rows without hotel
                </p>
              </div>
              <div className="text-right shrink-0 tabular-nums">
                <div className="text-sm font-extrabold text-white">89 Pax</div>
                <div className="text-xs font-bold text-emerald-400">$1,780</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Fairfield Hotel
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Nancy &bull; Celebration (Term F)
                </p>
              </div>
              <div className="text-right shrink-0 tabular-nums">
                <div className="text-sm font-extrabold text-white">2 Pax</div>
                <div className="text-xs font-bold text-emerald-400">$40</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Hilton Garden Inn
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Jeff &bull; Magic (Term D)
                </p>
              </div>
              <div className="text-right shrink-0 tabular-nums">
                <div className="text-sm font-extrabold text-white">2 Pax</div>
                <div className="text-xs font-bold text-emerald-400">$40</div>
              </div>
            </div>
          </section>
        )}

        {activeShipMeta && (
          <section
            aria-label="Active ship staging info"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-extrabold border whitespace-nowrap ${getTerminalBadgeClasses(
                    activeShipMeta.terminal
                  )}`}
                >
                  TERMINAL {activeShipMeta.terminal}
                </span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  {activeShipMeta.access} Access
                </span>
                <span className="text-slate-600" aria-hidden="true">
                  &middot;
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {activeShipMeta.line}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white">
                {activeShipMeta.fullName}
              </h2>
              <p className="text-xs text-slate-300 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{activeShipMeta.pickupHint}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 shrink-0 tabular-nums">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Ship Pax
                </div>
                <div className="text-base font-extrabold text-cyan-300">
                  {shipTabCounts[activeShipMeta.id].pax}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Confirmed
                </div>
                <div className="text-base font-extrabold text-amber-300">
                  {shipTabCounts[activeShipMeta.id].confirmed} /{' '}
                  {shipTabCounts[activeShipMeta.id].bookings}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Ship Cash
                </div>
                <div className="text-base font-extrabold text-emerald-400">
                  ${shipTabCounts[activeShipMeta.id].paidCash}{' '}
                  <span className="text-xs font-medium text-slate-400">
                    / ${shipTabCounts[activeShipMeta.id].totalCash}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Dedicated Other Berths View OR Passenger Manifest */}
        {activeShip === 'BERTHS' ? (
          <section
            aria-label="Other berth reference notes"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
          >
            <div>
              <h2 className="text-sm font-extrabold text-white">
                Bottom Handwritten Berth Notes (0 Passengers Listed)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Reference berths written at the bottom of the dispatch sheet for staging awareness.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {EXTRA_BERTH_NOTES.map((berth) => (
                <div
                  key={berth.ship}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5"
                >
                  <div className="flex items-center justify-between gap-2 font-bold text-white">
                    <span className="text-sm">{berth.ship}</span>
                    <span
                      className={`px-2 py-0.5 rounded border whitespace-nowrap ${
                        berth.accent === 'indigo'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                      }`}
                    >
                      {berth.terminal}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-2 leading-relaxed">
                    <span className="font-semibold text-slate-200">{berth.access}</span> &bull;{' '}
                    {berth.details}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Live Current View Load Summary (Pax & Potential Cash for active search/filter) */}
            <section
              aria-label="Current view load summary"
              className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2"
            >
              <div className="text-xs font-semibold text-slate-300">
                {activeShip === 'ALL' && statusFilter === 'ALL' && !searchQuery.trim()
                  ? 'Full Manifest Load'
                  : 'Filtered View Load'}
                <span className="text-slate-500 mx-1.5" aria-hidden="true">
                  &middot;
                </span>
                <span className="text-slate-400 tabular-nums">
                  {filteredSummary.bookingsCount}{' '}
                  {filteredSummary.bookingsCount === 1 ? 'booking' : 'bookings'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-extrabold tabular-nums">
                <span className="text-cyan-300">
                  {filteredSummary.totalPax} Pax
                </span>
                <span className="text-slate-600" aria-hidden="true">
                  &middot;
                </span>
                <span className="text-emerald-400">
                  ${filteredSummary.totalCash.toLocaleString()} Cash
                </span>
                {filteredSummary.paidCash > 0 && (
                  <span className="text-xs font-semibold text-slate-400">
                    (${filteredSummary.paidCash.toLocaleString()} paid)
                  </span>
                )}
              </div>
            </section>

            {filteredItems.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                <p className="text-slate-300 text-sm font-medium">
                  No passengers match the current ship and status filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 transition-colors"
                >
                  Clear Status &amp; Search Filters
                </button>
              </div>
            ) : currentView === 'cards' ? (
              <section
                aria-label="Passenger booking cards"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
              >
                {filteredItems.map((item) => (
                  <ManifestCard
                    key={item.id}
                    item={item}
                    isConfirmed={!!confirmedMap[item.id]}
                    isPaid={!!paidMap[item.id]}
                    flightNote={flightNotesMap[item.id] || ''}
                    onOpenModal={setActivePassenger}
                    onToggleConfirmed={toggleConfirmed}
                    onTogglePaid={togglePaid}
                    onUpdateFlightNote={updateFlightNote}
                  />
                ))}
              </section>
            ) : (
              <section aria-label="Passenger booking table">
                <ManifestTable
                  items={filteredItems}
                  confirmedMap={confirmedMap}
                  paidMap={paidMap}
                  onOpenModal={setActivePassenger}
                  onToggleConfirmed={toggleConfirmed}
                  onTogglePaid={togglePaid}
                />
              </section>
            )}

            {/* Quick Prev / Next Ship Stepper when viewing a single ship */}
            {activeShipMeta && (
              <nav
                aria-label="Step between ships"
                className="flex items-center justify-between gap-2.5 pt-2"
              >
                {prevShip ? (
                  <button
                    type="button"
                    onClick={() => handleSelectShip(prevShip.id)}
                    className="flex-1 min-h-[44px] flex items-center justify-start gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">
                      {prevShip.shortLabel} (Term {prevShip.terminal})
                    </span>
                  </button>
                ) : (
                  <div className="flex-1" />
                )}

                {nextShip ? (
                  <button
                    type="button"
                    onClick={() => handleSelectShip(nextShip.id)}
                    className="flex-1 min-h-[44px] flex items-center justify-end gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-colors"
                  >
                    <span className="truncate">
                      {nextShip.shortLabel} (Term {nextShip.terminal})
                    </span>
                    <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectShip('ALL')}
                    className="flex-1 min-h-[44px] flex items-center justify-end gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-cyan-300 transition-colors"
                  >
                    <span>Back to All Ships</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                )}
              </nav>
            )}

            {/* Bottom Handwritten Ship & Berth Reference Notes (when viewing ALL) */}
            {activeShip === 'ALL' && (
              <section className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Bottom Handwritten Berth Notes (0 Passengers Listed)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {EXTRA_BERTH_NOTES.map((berth) => (
                    <div
                      key={berth.ship}
                      className="bg-slate-950/60 border border-slate-800 rounded-xl p-3"
                    >
                      <div className="flex items-center justify-between gap-2 font-bold text-white">
                        <span>{berth.ship}</span>
                        <span
                          className={`px-2 py-0.5 rounded border whitespace-nowrap ${
                            berth.accent === 'indigo'
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                              : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                          }`}
                        >
                          {berth.terminal}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1.5">
                        {berth.access} &bull; {berth.details}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* iPhone Call / Text Action Sheet Modal */}
      <ActionModal
        passenger={activePassenger}
        brandName={brandName}
        onClose={() => setActivePassenger(null)}
        onCopy={copyTextToClipboard}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-cyan-500/50 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl whitespace-nowrap"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
