import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";



let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _client: postgres.Sql | null = null;

export const initDb = (url: string) => {
  if (_db) return _db;
  // Disable prefetch as it is not supported for "Transaction" pool mode
  _client = postgres(url, { prepare: false });
  _db = drizzle(_client, { schema });
  return _db;
};

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    if (!_db) {
      // Auto-init for local dev if process.env is available
      if (typeof process !== "undefined" && process.env && process.env.DATABASE_URL) {
        initDb(process.env.DATABASE_URL);
      } else {
        throw new Error("Database not initialized. Call initDb(url) first.");
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return Reflect.get(_db!, prop);
  },
});

export const client = new Proxy({} as postgres.Sql, {
    get(_target, prop) {
        if (!_client) {
             if (typeof process !== "undefined" && process.env && process.env.DATABASE_URL) {
                initDb(process.env.DATABASE_URL);
              } else {
                throw new Error("Database client not initialized. Call initDb(url) first.");
              }
        }
        return Reflect.get(_client!, prop);
    }
});
