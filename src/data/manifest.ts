export type BrandName = 'SAS' | 'A Luxury Vans';

export type ShipId =
  | 'ALL'
  | 'Virgin'
  | 'Celebration'
  | 'Magic'
  | 'Allure'
  | 'MSC Poesia'
  | 'Independence of the Seas'
  | 'BERTHS';

export type StatusFilterId =
  | 'ALL'
  | 'UNCONFIRMED'
  | 'CONFIRMED'
  | 'UNPAID'
  | 'HOTELS'
  | 'HANDWRITTEN';

export interface ShipTabMeta {
  id: Exclude<ShipId, 'ALL' | 'BERTHS'>;
  shortLabel: string;
  fullName: string;
  terminal: ManifestEntry['terminal'];
  access: 'Bridge' | 'Tunnel';
  line: string;
  pickupHint: string;
}

export interface ManifestEntry {
  id: number;
  pickup: string;
  terminal: 'V' | 'F' | 'D' | 'A' | 'AA';
  access: 'Bridge' | 'Tunnel';
  ship: string;
  line: string;
  name: string;
  phoneDisplay: string;
  phoneRaw: string;
  incomplete?: boolean;
  dropoff: string;
  pax: number;
  rate: number;
  type: 'Printed' | 'Handwritten';
  note: string;
}

export interface BerthNote {
  ship: string;
  terminal: string;
  access: string;
  details: string;
  accent: 'indigo' | 'teal';
}

export const MANIFEST_DATA: ManifestEntry[] = [
  // Terminal V — Virgin Voyages (PortMiami Bridge) — 16 pax ($320)
  { id: 1, pickup: 'PortMiami', terminal: 'V', access: 'Bridge', ship: 'Virgin', line: 'Virgin Voyages', name: 'Sarah', phoneDisplay: '716-866-6631', phoneRaw: '+17168666631', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 2, pickup: 'PortMiami', terminal: 'V', access: 'Bridge', ship: 'Virgin', line: 'Virgin Voyages', name: 'Michelle', phoneDisplay: '216-849-7841', phoneRaw: '+12168497841', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 1, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 3, pickup: 'PortMiami', terminal: 'V', access: 'Bridge', ship: 'Virgin', line: 'Virgin Voyages', name: 'Piriyanga', phoneDisplay: '647-298-8716', phoneRaw: '+16472988716', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 4, pickup: 'PortMiami', terminal: 'V', access: 'Bridge', ship: 'Virgin', line: 'Virgin Voyages', name: 'Clifton', phoneDisplay: '214-215-7450', phoneRaw: '+12142157450', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 5, pickup: 'PortMiami', terminal: 'V', access: 'Bridge', ship: 'Virgin', line: 'Virgin Voyages', name: 'Chelsea', phoneDisplay: '713-373-7198', phoneRaw: '+17133737198', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Handwritten', note: 'Handwritten addition' },
  { id: 6, pickup: 'PortMiami', terminal: 'V', access: 'Bridge', ship: 'Virgin', line: 'Virgin Voyages', name: 'Felicia', phoneDisplay: '614-285-7734', phoneRaw: '+16142857734', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Handwritten', note: 'Handwritten addition' },
  { id: 7, pickup: 'PortMiami', terminal: 'V', access: 'Bridge', ship: 'Virgin', line: 'Virgin Voyages', name: 'Judit', phoneDisplay: '843-601-8601', phoneRaw: '+18436018601', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Right column (no hotel -> FLL)' },
  { id: 8, pickup: 'PortMiami', terminal: 'V', access: 'Bridge', ship: 'Virgin', line: 'Virgin Voyages', name: 'Oasia', phoneDisplay: '917-684-2050', phoneRaw: '+19176842050', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 1, rate: 20, type: 'Printed', note: 'Right column (no hotel -> FLL)' },
  { id: 9, pickup: 'PortMiami', terminal: 'V', access: 'Bridge', ship: 'Virgin', line: 'Virgin Voyages', name: 'Anne', phoneDisplay: '581-234-3795', phoneRaw: '+15812343795', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Right column (no hotel -> FLL)' },

  // Terminal F — Carnival Celebration (PortMiami Bridge) — 44 pax ($880)
  { id: 10, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Isaac', phoneDisplay: '513-568-2484', phoneRaw: '+15135682484', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 11, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Brian', phoneDisplay: '515-229-4238', phoneRaw: '+15152294238', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 6, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 12, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Kathie', phoneDisplay: '905-973-2580', phoneRaw: '+19059732580', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 4, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 13, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Emily', phoneDisplay: '231-683-7107', phoneRaw: '+12316837107', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 3, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 14, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Gary', phoneDisplay: '419-576-9908', phoneRaw: '+14195769908', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 8, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 15, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Terry', phoneDisplay: '513-258-4529', phoneRaw: '+15132584529', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 1, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 16, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Nancy', phoneDisplay: '330-416-5769', phoneRaw: '+13304165769', dropoff: 'Fairfield Hotel', pax: 2, rate: 20, type: 'Printed', note: 'Hotel drop-off: Fairfield' },
  { id: 17, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Naja', phoneDisplay: '248-212-5435', phoneRaw: '+12482125435', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Right column (no hotel -> FLL)' },
  { id: 18, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Angela', phoneDisplay: '606-521-2492', phoneRaw: '+16065212492', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Right column (no hotel -> FLL)' },
  { id: 19, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Terry', phoneDisplay: '502-500-0772', phoneRaw: '+15025000772', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 4, rate: 20, type: 'Printed', note: 'Right column (no hotel -> FLL)' },
  { id: 20, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Eve', phoneDisplay: '484-274-5945', phoneRaw: '+14842745945', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Right column (no hotel -> FLL)' },
  { id: 21, pickup: 'PortMiami', terminal: 'F', access: 'Bridge', ship: 'Celebration', line: 'Carnival', name: 'Marilyn', phoneDisplay: '608-698-4749', phoneRaw: '+16086984749', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 8, rate: 20, type: 'Printed', note: 'Right column (no hotel -> FLL)' },

  // Terminal D — Carnival Magic (PortMiami Tunnel) — 10 pax ($200)
  { id: 22, pickup: 'PortMiami', terminal: 'D', access: 'Tunnel', ship: 'Magic', line: 'Carnival', name: 'Patricia', phoneDisplay: '585-705-4978', phoneRaw: '+15857054978', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 23, pickup: 'PortMiami', terminal: 'D', access: 'Tunnel', ship: 'Magic', line: 'Carnival', name: 'Susan', phoneDisplay: '518-330-4106', phoneRaw: '+15183304106', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 4, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 24, pickup: 'PortMiami', terminal: 'D', access: 'Tunnel', ship: 'Magic', line: 'Carnival', name: 'Jeff', phoneDisplay: '712-253-5452', phoneRaw: '+17122535452', dropoff: 'Hilton Garden Inn', pax: 2, rate: 20, type: 'Printed', note: 'Hotel drop-off: Hilton Garden Inn' },
  { id: 25, pickup: 'PortMiami', terminal: 'D', access: 'Tunnel', ship: 'Magic', line: 'Carnival', name: 'Donna', phoneDisplay: '607-346-7610', phoneRaw: '+16073467610', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Right column (no hotel -> FLL)' },

  // Terminal A — Royal Caribbean Allure (PortMiami Tunnel) — 16 pax ($320)
  { id: 26, pickup: 'PortMiami', terminal: 'A', access: 'Tunnel', ship: 'Allure', line: 'Royal Caribbean', name: 'Pierre', phoneDisplay: '438-389-6818', phoneRaw: '+14383896818', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 27, pickup: 'PortMiami', terminal: 'A', access: 'Tunnel', ship: 'Allure', line: 'Royal Caribbean', name: 'Lindsey', phoneDisplay: '708-525-0524', phoneRaw: '+17085250524', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 6, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 28, pickup: 'PortMiami', terminal: 'A', access: 'Tunnel', ship: 'Allure', line: 'Royal Caribbean', name: 'Jackie', phoneDisplay: '410-207-5234', phoneRaw: '+14102075234', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 4, rate: 20, type: 'Handwritten', note: 'Handwritten addition' },
  { id: 29, pickup: 'PortMiami', terminal: 'A', access: 'Tunnel', ship: 'Allure', line: 'Royal Caribbean', name: 'Yvette', phoneDisplay: '79-721-2090', phoneRaw: '', incomplete: true, dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'First digit cut off on printout' },
  { id: 30, pickup: 'PortMiami', terminal: 'A', access: 'Tunnel', ship: 'Allure', line: 'Royal Caribbean', name: 'Bernie', phoneDisplay: '905-317-7223', phoneRaw: '+19053177223', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Right column (no hotel -> FLL)' },

  // Terminal AA — MSC Poesia & Independence of the Seas (PortMiami Tunnel) — 7 pax ($140)
  { id: 31, pickup: 'PortMiami', terminal: 'AA', access: 'Tunnel', ship: 'MSC Poesia', line: 'MSC Cruises', name: 'Cynthia', phoneDisplay: '203-241-4299', phoneRaw: '+12032414299', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 2, rate: 20, type: 'Printed', note: 'Left column' },
  { id: 32, pickup: 'PortMiami', terminal: 'AA', access: 'Tunnel', ship: 'MSC Poesia', line: 'MSC Cruises', name: 'Kenneth', phoneDisplay: '916-397-0880', phoneRaw: '+19163970880', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 1, rate: 20, type: 'Handwritten', note: 'Handwritten addition' },
  { id: 33, pickup: 'PortMiami', terminal: 'AA', access: 'Tunnel', ship: 'Independence of the Seas', line: 'Royal Caribbean', name: 'Jimmy', phoneDisplay: '937-789-8829', phoneRaw: '+19377898829', dropoff: 'Fort Lauderdale Airport (FLL)', pax: 4, rate: 20, type: 'Handwritten', note: 'Handwritten bottom (Official berth: AAA)' }
];

export const SHIP_TABS: ShipTabMeta[] = [
  {
    id: 'Virgin',
    shortLabel: 'Virgin',
    fullName: 'Virgin Voyages',
    terminal: 'V',
    access: 'Bridge',
    line: 'Virgin Voyages',
    pickupHint: 'PortMiami Bridge · Terminal V commercial shuttle lane outside arrivals.',
  },
  {
    id: 'Celebration',
    shortLabel: 'Celebration',
    fullName: 'Carnival Celebration',
    terminal: 'F',
    access: 'Bridge',
    line: 'Carnival',
    pickupHint: 'PortMiami Bridge · Terminal F commercial pickup zone (includes Nancy -> Fairfield Hotel).',
  },
  {
    id: 'Magic',
    shortLabel: 'Magic',
    fullName: 'Carnival Magic',
    terminal: 'D',
    access: 'Tunnel',
    line: 'Carnival',
    pickupHint: 'PortMiami Tunnel · Walk across crosswalk to front of Garage D where commercial shuttles load.',
  },
  {
    id: 'Allure',
    shortLabel: 'Allure',
    fullName: 'Allure of the Seas',
    terminal: 'A',
    access: 'Tunnel',
    line: 'Royal Caribbean',
    pickupHint: 'PortMiami Tunnel · Middle Ground Transportation island at Zone 7 (check Yvette missing digit).',
  },
  {
    id: 'MSC Poesia',
    shortLabel: 'MSC Poesia',
    fullName: 'MSC Poesia',
    terminal: 'AA',
    access: 'Tunnel',
    line: 'MSC Cruises',
    pickupHint: 'PortMiami Tunnel · Terminal AA commercial shuttle pickup bay.',
  },
  {
    id: 'Independence of the Seas',
    shortLabel: 'Independence',
    fullName: 'Independence of the Seas',
    terminal: 'AA',
    access: 'Tunnel',
    line: 'Royal Caribbean',
    pickupHint: 'PortMiami Tunnel · Handwritten at bottom of sheet under AA (Official berth: Terminal AAA).',
  },
];

export const STATUS_FILTERS: { id: StatusFilterId; label: string }[] = [
  { id: 'ALL', label: 'All Status' },
  { id: 'UNCONFIRMED', label: 'Needs Confirm' },
  { id: 'CONFIRMED', label: 'Yellow Confirmed' },
  { id: 'UNPAID', label: 'Cash Unpaid' },
  { id: 'HOTELS', label: 'Hotels' },
  { id: 'HANDWRITTEN', label: 'Handwritten' },
];

export const EXTRA_BERTH_NOTES: BerthNote[] = [
  {
    ship: 'NCL Aqua',
    terminal: 'Terminal B',
    access: 'PortMiami Tunnel',
    details: 'Primary Morning Staging Lot across from Terminal B',
    accent: 'indigo'
  },
  {
    ship: 'MSC Explorer 3 (Explora III)',
    terminal: 'Terminal C',
    access: 'PortMiami Tunnel',
    details: 'Commercial shuttle island across crosswalk',
    accent: 'indigo'
  },
  {
    ship: 'Seven Seas Grandeur',
    terminal: 'Terminal J',
    access: 'PortMiami Bridge',
    details: 'Southside Caribbean Way commercial bay',
    accent: 'teal'
  }
];

export function getTerminalBadgeClasses(terminal: ManifestEntry['terminal']): string {
  switch (terminal) {
    case 'V':
      return 'bg-rose-500/15 text-rose-300 border-rose-500/35';
    case 'F':
      return 'bg-sky-500/15 text-sky-300 border-sky-500/35';
    case 'D':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/35';
    case 'A':
      return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35';
    case 'AA':
      return 'bg-purple-500/15 text-purple-300 border-purple-500/35';
  }
}

export function buildSmsMessage(item: ManifestEntry, brandName: BrandName): string {
  const destText =
    item.dropoff === 'Fort Lauderdale Airport (FLL)' ? 'FLL Airport' : item.dropoff;

  let terminalHint = '';
  if (item.terminal === 'D') {
    terminalHint =
      ' Note: For Terminal D, walk across the crosswalk to the front of Garage D where commercial shuttles load.';
  } else if (item.terminal === 'A') {
    terminalHint =
      ' Note: For Terminal A, walk out to the middle Ground Transportation island at Zone 7.';
  }

  return `Good morning ${item.name}! This is Dean with ${brandName} staged here at PortMiami for your ${item.ship} transfer to ${destText}. Please reply with your airline/flight # and call or text me as soon as you clear Customs with all bags in hand.${terminalHint}`;
}
