import { StoreItemSelect, contactsSelect, scenarioType } from './schema'
import { add } from 'date-fns'
import { getLocales } from 'expo-localization'

type storeItemSeed = Omit<StoreItemSelect, 'id'>
type contactSeed = Omit<contactsSelect, 'id'>
type scenarioSeed = Omit<scenarioType, 'id'>

const { regionCode } = getLocales()[0]

// Mapping of region codes to phone extensions (country calling codes)
const regionToPhoneExtension: Record<string, string> = {
  US: '+1', // United States
  CA: '+1', // Canada
  GB: '+44', // United Kingdom
  AU: '+61', // Australia
  SG: '+65', // Singapore
  MY: '+60', // Malaysia
  IN: '+91', // India
  CN: '+86', // China
  JP: '+81', // Japan
  KR: '+82', // South Korea
  // Add more mappings as needed
}

// Default to +1 if region code is not found in mapping or is null
const phoneExtension = regionCode
  ? regionToPhoneExtension[regionCode] || '+1'
  : '+1'

export const storeItemsSeed: storeItemSeed[] = [
  {
    name: 'Cereal Bars',
    quantity: 5,
    dateExpiry: add(new Date(), { months: 6 }).toISOString(),
    category: 'food',
    notes: '5 honey chocolate bars.',
    photoUrl: null,
  },
  {
    name: 'Bottled Water',
    quantity: 4,
    dateExpiry: add(new Date(), { months: 12 }).toISOString(),
    category: 'food',
    notes: '300ml mineral water',
    photoUrl: null,
  },
  {
    name: 'Can of Tuna',
    quantity: 2,
    dateExpiry: add(new Date(), { months: 24 }).toISOString(),
    category: 'food',
    notes: '200g tuna in olive oil.',
    photoUrl: null,
  },
  {
    name: 'Chilli Sauce',
    quantity: 1,
    dateExpiry: add(new Date(), { weeks: 5 }).toISOString(),
    category: 'food',
    notes: "Simply can't live without it.",
    photoUrl: null,
  },
  {
    name: 'Instant Noodles',
    quantity: 6,
    dateExpiry: add(new Date(), { days: 15 }).toISOString(),
    category: 'food',
    notes: '6 packets of IndoMie',
    photoUrl: null,
  },
  {
    name: 'Dried Prunes',
    quantity: 1,
    dateExpiry: add(new Date(), { hours: 20 }).toISOString(),
    category: 'food',
    notes: 'bought during a sales',
    photoUrl: null,
  },
  {
    name: 'Paracetamol',
    quantity: 12,
    dateExpiry: add(new Date(), { hours: 12 }).toISOString(),
    category: 'medicine',
    notes: '1 slab of Paracetamol for fever relief',
    photoUrl: null,
  },
  {
    name: 'Bandages',
    quantity: 1,
    dateExpiry: add(new Date(), { months: 15 }).toISOString(),
    category: 'medicine',
    notes: '1 roll',
    photoUrl: null,
  },
  {
    name: 'Gasoline',
    quantity: 1,
    dateExpiry: add(new Date(), { months: 12 }).toISOString(),
    category: 'supplies',
    notes: '1 canister, to check every 12 months',
    photoUrl: null,
  },
  {
    name: 'Map',
    quantity: 1,
    dateExpiry: add(new Date(), { months: 12 }).toISOString(),
    category: 'supplies',
    notes: '1 large map of town. Keep updated copy of map.',
    photoUrl: null,
  },
  {
    name: 'Batteries',
    quantity: 6,
    dateExpiry: add(new Date(), { days: 25 }).toISOString(),
    category: 'supplies',
    notes: 'Batteries for flashlights etc...',
    photoUrl: null,
  },
  {
    name: 'Socks',
    quantity: 2,
    dateExpiry: add(new Date(), { months: 3 }).toISOString(),
    category: 'clothing',
    notes: '2 extra pairs for cold weather',
    photoUrl: null,
  },
  {
    name: 'Poncho',
    quantity: 1,
    dateExpiry: add(new Date(), { months: 24 }).toISOString(),
    category: 'clothing',
    notes: 'for outdoor survival',
    photoUrl: null,
  },
]

export const contactsSeed: contactSeed[] = [
  {
    name: 'Bro Methuselah',
    phoneNumber: `${phoneExtension} 12345678`,
    remarks: 'Very elderly brother. Cannot drive. Needs assistance.',
    priority: 'critical',
    accounted: false,
  },
  {
    name: 'Dad',
    phoneNumber: `${phoneExtension} 77889900`,
    remarks: 'Lives 30mins away. In flood prone area.',
    priority: 'high',
    accounted: false,
  },
  {
    name: 'Mom',
    phoneNumber: `${phoneExtension} 36776777`,
    remarks: 'Lives 30mins away. In flood prone area.',
    priority: 'high',
    accounted: false,
  },
  {
    name: 'Sis Dorcas',
    phoneNumber: `${phoneExtension} 36776777`,
    remarks: 'Lives alone. Accessible only by Home Line.',
    priority: 'high',
    accounted: false,
  },
  {
    name: 'Sis Eunice',
    phoneNumber: `${phoneExtension} 12312309`,
    remarks: 'Lives with her son. Can be reached easily.',
    priority: 'normal',
    accounted: false,
  },
]

export const scenarioSeed: scenarioSeed[] = [
  {
    eventName: 'Fire',
    remarks: `1. Grab the GoBag.\n2. Call emergency services.\n3. Evacuate to a safe location.\n4. Stay safe.`,
  },
  {
    eventName: 'Hurricane Season',
    remarks: `1. Make sure enough gasoline.\n2. Grab the GoBag.\n3. Leave the area immediately.\n4. Follow evacuation orders.`,
  },
  {
    eventName: 'Violent Person',
    remarks:
      'Do not approach or engage the person. Look for the nearest exit. Extend help and warning to others. Call the cops if you are threatened.',
  },
]
