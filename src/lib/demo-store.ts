import { DemoData, DemoNotification, DemoUser, seedDemoData } from '@/data/rentease';

const DATA_KEY = 'rentease-demo-data';
const SESSION_KEY = 'rentease-demo-session';
const DATA_CHANGE_EVENT = 'rentease-data-change';
const SESSION_CHANGE_EVENT = 'rentease-session-change';

type DemoCollection = keyof DemoData;
type CollectionRecord<TKey extends DemoCollection> = DemoData[TKey][number];

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasStrings(value: unknown, fields: string[]): value is Record<string, string> {
  return isObject(value) && fields.every((field) => typeof value[field] === 'string');
}

function hasNumbers(value: unknown, fields: string[]) {
  return isObject(value) && fields.every((field) => typeof value[field] === 'number' && Number.isFinite(value[field]));
}

function hasRecords<T extends { id: string }>(
  value: unknown,
  validate: (record: unknown) => record is T,
): value is T[] {
  return Array.isArray(value) && value.every(validate);
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function cloneSeed(): DemoData {
  return structuredClone(seedDemoData);
}

function hasCollections(value: unknown): value is Omit<DemoData, 'notifications'> & { notifications?: DemoNotification[] } {
  if (!isObject(value)) return false;
  const isUser = (entry: unknown): entry is DemoUser => hasStrings(entry, ['id', 'name', 'email', 'password', 'phone', 'role', 'status'])
    && ['tenant', 'landlord', 'admin'].includes(entry.role)
    && ['Active', 'Suspended'].includes(entry.status);
  const isProperty = (entry: unknown): entry is DemoData['properties'][number] => hasStrings(entry, [
    'id', 'slug', 'title', 'type', 'address', 'city', 'image', 'landlordId',
    'availability', 'approval', 'description', 'availableFrom',
  ]) && hasNumbers(entry, ['rent', 'bedrooms', 'bathrooms', 'area'])
    && ['Apartment', 'House', 'Studio'].includes(entry.type)
    && ['Available', 'Occupied', 'Archived'].includes(entry.availability)
    && ['Approved', 'Pending', 'Rejected'].includes(entry.approval)
    && Array.isArray(entry.amenities) && entry.amenities.every((amenity) => typeof amenity === 'string');
  const isApplication = (entry: unknown): entry is DemoData['applications'][number] => hasStrings(entry, [
    'id', 'tenantId', 'propertyId', 'submittedAt', 'status', 'message',
  ]) && ['Pending', 'Approved', 'Rejected', 'Cancelled'].includes(entry.status);
  const isRental = (entry: unknown): entry is DemoData['rentals'][number] => hasStrings(entry, [
    'id', 'tenantId', 'propertyId', 'startDate', 'endDate', 'status',
  ]) && hasNumbers(entry, ['rent'])
    && ['Active', 'Ending soon', 'Ended'].includes(entry.status);
  const isPayment = (entry: unknown): entry is DemoData['payments'][number] => hasStrings(entry, [
    'id', 'rentalId', 'kind', 'dueDate', 'status',
  ]) && hasNumbers(entry, ['amount'])
    && ['Rent', 'Water', 'Electricity', 'Internet'].includes(entry.kind)
    && ['Paid', 'Due', 'Overdue'].includes(entry.status)
    && (!isObject(entry) || entry.paidAt === undefined || typeof entry.paidAt === 'string');
  const isMaintenance = (entry: unknown): entry is DemoData['maintenance'][number] => hasStrings(entry, [
    'id', 'tenantId', 'propertyId', 'category', 'description', 'priority', 'status', 'submittedAt',
  ]) && ['Low', 'Normal', 'Urgent'].includes(entry.priority)
    && ['Open', 'In progress', 'Resolved'].includes(entry.status);
  const isNotification = (entry: unknown): entry is DemoNotification => hasStrings(entry, [
    'id', 'userId', 'message', 'href', 'createdAt',
  ]) && (!isObject(entry) || entry.readAt === undefined || typeof entry.readAt === 'string');

  return hasRecords(value.users, isUser)
    && hasRecords(value.properties, isProperty)
    && hasRecords(value.applications, isApplication)
    && hasRecords(value.rentals, isRental)
    && hasRecords(value.payments, isPayment)
    && hasRecords(value.maintenance, isMaintenance)
    && (value.notifications === undefined || hasRecords(value.notifications, isNotification));
}

function announce(eventName: string) {
  if (isBrowser()) window.dispatchEvent(new Event(eventName));
}

function persistSeed(seed: DemoData) {
  try {
    window.localStorage.setItem(DATA_KEY, JSON.stringify(seed));
  } catch (error) {
    console.error('Unable to initialize RentEase demo data in local storage.', error);
  }
}

export function initializeDemoData(): DemoData {
  if (!isBrowser()) return cloneSeed();

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(DATA_KEY);
  } catch (error) {
    console.error('Unable to access RentEase demo data in local storage.', error);
    return cloneSeed();
  }

  if (!raw) {
    const seed = cloneSeed();
    persistSeed(seed);
    return seed;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!hasCollections(parsed)) {
      console.error('Saved RentEase demo data has an unsupported structure; restoring the original demo records.');
      const seed = cloneSeed();
      persistSeed(seed);
      return seed;
    }

    const migrated: DemoData = {
      users: parsed.users,
      properties: parsed.properties,
      applications: parsed.applications,
      rentals: parsed.rentals,
      payments: parsed.payments,
      maintenance: parsed.maintenance,
      notifications: parsed.notifications ?? [],
    };
    if (!parsed.notifications) persistSeed(migrated);
    return migrated;
  } catch (error) {
    console.error('Unable to parse RentEase demo data; restoring the original demo records.', error);
    const seed = cloneSeed();
    persistSeed(seed);
    return seed;
  }
}

export function readDemoData(): DemoData {
  return initializeDemoData();
}

export function writeDemoData(data: DemoData) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(DATA_KEY, JSON.stringify(data));
    announce(DATA_CHANGE_EVENT);
  } catch (error) {
    console.error('Unable to save RentEase demo data in local storage.', error);
    throw new Error('Your browser could not save the demo changes. Check available storage and try again.', { cause: error });
  }
}

export function updateDemoData(mutate: (data: DemoData) => void): DemoData {
  const data = readDemoData();
  mutate(data);
  writeDemoData(data);
  return data;
}

export function createDemoId(prefix: string): string {
  const unique = isBrowser() && typeof window.crypto?.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${unique}`;
}

export function createDemoNotification(userId: string, message: string, href: string): DemoNotification {
  return {
    id: createDemoId('notification'),
    userId,
    message,
    href,
    createdAt: new Date().toISOString(),
  };
}

export function addDemoRecord<TKey extends DemoCollection>(
  collection: TKey,
  record: CollectionRecord<TKey>,
): DemoData {
  return updateDemoData((data) => {
    (data[collection] as CollectionRecord<TKey>[]).unshift(record);
  });
}

export function editDemoRecord<TKey extends DemoCollection>(
  collection: TKey,
  id: string,
  update: (record: CollectionRecord<TKey>) => void,
): DemoData {
  return updateDemoData((data) => {
    const record = (data[collection] as Array<CollectionRecord<TKey> & { id: string }>).find((item) => item.id === id);
    if (record) update(record);
  });
}

export function deleteDemoRecord<TKey extends DemoCollection>(collection: TKey, id: string): DemoData {
  return updateDemoData((data) => {
    const records = data[collection] as Array<CollectionRecord<TKey> & { id: string }>;
    data[collection] = records.filter((record) => record.id !== id) as DemoData[TKey];
  });
}

export function resetDemoData(): DemoData {
  const seed = cloneSeed();
  writeDemoData(seed);
  writeSession(null);
  return seed;
}

export function readSession(): DemoUser | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: unknown = JSON.parse(raw);
    if (!session || typeof session !== 'object' || typeof (session as DemoUser).id !== 'string') {
      throw new Error('Saved demo session has an unsupported structure.');
    }
    return readDemoData().users.find((user) => user.id === (session as DemoUser).id) ?? null;
  } catch (error) {
    console.error('Unable to read RentEase demo session from browser storage.', error);
    try {
      window.localStorage.removeItem(SESSION_KEY);
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch (storageError) {
      console.error('Unable to clear the invalid RentEase demo session.', storageError);
    }
    return null;
  }
}

export function writeSession(user: DemoUser | null, remember = true) {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
    if (user) {
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem(SESSION_KEY, JSON.stringify({ id: user.id }));
    }
  } catch (error) {
    console.error('Unable to update the RentEase demo session in browser storage.', error);
    throw new Error('Your browser could not save the demo session. Check browser storage and try again.', { cause: error });
  } finally {
    announce(SESSION_CHANGE_EVENT);
  }
}
