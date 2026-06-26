import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export interface UserData {
  lang: string;
  balance: number;
  job: string | null;
  jobPay: number;
  lastCrime: number;
  lastWork: number;
  lastRob: number;
  lastFindJob: number;
  lastDaily: number;
  lastWeekly: number;
  lastBeg: number;
  lastSlots: number;
  lastFish: number;
  lastHunt: number;
  lastDig: number;
  lastGamble: number;
  inventory: string[];
  bank: number;
  level: number;
  xp: number;
}

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "data");
const DATA_FILE = join(DATA_DIR, "fahbot.json");

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function loadStore(): Map<string, UserData> {
  ensureDir();
  if (!existsSync(DATA_FILE)) return new Map();
  try {
    const raw = readFileSync(DATA_FILE, "utf-8");
    const obj = JSON.parse(raw) as Record<string, UserData>;
    return new Map(Object.entries(obj));
  } catch {
    return new Map();
  }
}

function persistStore() {
  ensureDir();
  const obj: Record<string, UserData> = {};
  for (const [k, v] of store) obj[k] = v;
  writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), "utf-8");
}

const store = loadStore();

const DEFAULT_USER: Omit<UserData, never> = {
  lang: "en",
  balance: 0,
  job: null,
  jobPay: 0,
  lastCrime: 0,
  lastWork: 0,
  lastRob: 0,
  lastFindJob: 0,
  lastDaily: 0,
  lastWeekly: 0,
  lastBeg: 0,
  lastSlots: 0,
  lastFish: 0,
  lastHunt: 0,
  lastDig: 0,
  lastGamble: 0,
  inventory: [],
  bank: 0,
  level: 1,
  xp: 0,
};

export function getUser(id: string): UserData {
  if (!store.has(id)) {
    store.set(id, { ...DEFAULT_USER });
  }
  return store.get(id)!;
}

export function saveUser(id: string, data: UserData): void {
  store.set(id, data);
  persistStore();
}

export function getAllUsers(): Map<string, UserData> {
  return store;
}

export function addXp(id: string, amount: number): { leveledUp: boolean; level: number } {
  const user = getUser(id);
  user.xp += amount;
  const xpNeeded = user.level * 100;
  if (user.xp >= xpNeeded) {
    user.xp -= xpNeeded;
    user.level += 1;
    saveUser(id, user);
    return { leveledUp: true, level: user.level };
  }
  saveUser(id, user);
  return { leveledUp: false, level: user.level };
}
