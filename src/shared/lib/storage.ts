/**
 * Wrapper tipado sobre `localStorage`.
 *
 * - SSR-safe: si `window`/`localStorage` no existen, los getters devuelven null
 *   y los setters son no-op (no tiran).
 * - JSON corrupto se ignora silenciosamente (devuelve null).
 * - Todas las llaves del proyecto deben empezar con `phplus.` y versionarse
 *   con `.v1`, `.v2`, etc.
 * - `makeNamespacedStorage(prefix)` da una "tabla" donde cada item es una
 *   llave separada (útil para seeds de mock DB).
 */

const hasLocalStorage = (): boolean => {
  try {
    return (
      typeof globalThis !== "undefined" &&
      typeof globalThis.localStorage !== "undefined"
    );
  } catch {
    return false;
  }
};

function get<T = unknown>(key: string): T | null {
  if (!hasLocalStorage()) return null;
  try {
    const raw = globalThis.localStorage.getItem(key);
    if (raw == null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): T {
  if (!hasLocalStorage()) return value;
  try {
    globalThis.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota o storage deshabilitado: silencioso */
  }
  return value;
}

function remove(key: string): void {
  if (!hasLocalStorage()) return;
  try {
    globalThis.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function withDefault<T>(key: string, defaultValue: T): T {
  const value = get<T>(key);
  return value == null ? defaultValue : value;
}

export const storage = {
  get,
  set,
  remove,
  withDefault,
};

/* ------------------------------------------------------------------ */
/* Namespaced storage (tabla por feature)                              */
/* ------------------------------------------------------------------ */

const SEP = ":";

export type NamespacedStorage<T> = {
  get<U = T>(id: string): U | null;
  set<U = T>(id: string, value: U): U;
  remove(id: string): void;
  list(): T[];
  ids(): string[];
  clear(): void;
};

export function makeNamespacedStorage<T = unknown>(
  prefix: string,
): NamespacedStorage<T> {
  const k = (id: string) => `${prefix}${SEP}${id}`;

  return {
    get<U = T>(id: string): U | null {
      return storage.get<U>(k(id));
    },
    set<U = T>(id: string, value: U): U {
      return storage.set<U>(k(id), value);
    },
    remove(id: string) {
      storage.remove(k(id));
    },
    list(): T[] {
      if (!hasLocalStorage()) return [];
      const items: T[] = [];
      try {
        for (let i = 0; i < globalThis.localStorage.length; i++) {
          const key = globalThis.localStorage.key(i);
          if (key && key.startsWith(prefix + SEP)) {
            const v = storage.get<T>(key);
            if (v != null) items.push(v);
          }
        }
      } catch {
        /* ignore */
      }
      return items;
    },
    ids(): string[] {
      if (!hasLocalStorage()) return [];
      const ids: string[] = [];
      try {
        for (let i = 0; i < globalThis.localStorage.length; i++) {
          const key = globalThis.localStorage.key(i);
          if (key && key.startsWith(prefix + SEP)) {
            ids.push(key.slice(prefix.length + SEP.length));
          }
        }
      } catch {
        /* ignore */
      }
      return ids;
    },
    clear() {
      if (!hasLocalStorage()) return;
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < globalThis.localStorage.length; i++) {
          const key = globalThis.localStorage.key(i);
          if (key && key.startsWith(prefix + SEP)) keysToRemove.push(key);
        }
        for (const key of keysToRemove)
          globalThis.localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };
}
