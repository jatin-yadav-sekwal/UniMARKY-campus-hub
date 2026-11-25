import { decode } from "hono/jwt";

const JWKS_TTL_MS = 60 * 60 * 1000; // 1 hour

interface JWK {
  kid: string;
  kty: string;
  x: string;
  y: string;
  crv: string;
  alg: string;
  use: string;
}

interface JWKS {
  keys: JWK[];
}

let keyCache: Record<string, CryptoKey> = {};
let cacheFetchedAt = 0;

function jwksUrl(): string {
  const base = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  if (!base) {
    throw new Error("SUPABASE_URL is required to verify Supabase tokens");
  }
  return `${base}/auth/v1/.well-known/jwks.json`;
}

async function fetchKeys(): Promise<Record<string, CryptoKey>> {
  const response = await fetch(jwksUrl());
  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS: ${response.statusText}`);
  }

  const jwks = (await response.json()) as JWKS;
  const entries = await Promise.all(
    jwks.keys.map(async (jwk) => {
      const key = await crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["verify"]
      );
      return [jwk.kid, key] as const;
    })
  );

  return Object.fromEntries(entries);
}

export async function getSupabasePublicKey(token: string): Promise<CryptoKey> {
  const { header } = decode(token);
  const kid = header.kid;

  if (!kid) {
    throw new Error("Token header missing 'kid'");
  }

  const cacheFresh = Date.now() - cacheFetchedAt < JWKS_TTL_MS;
  if (cacheFresh && keyCache[kid]) {
    return keyCache[kid];
  }

  // Refetch when the cache is stale or the token references an unknown key
  // (Supabase rotates signing keys).
  keyCache = await fetchKeys();
  cacheFetchedAt = Date.now();

  const key = keyCache[kid];
  if (!key) {
    throw new Error(`No matching key found in JWKS for kid: ${kid}`);
  }

  return key;
}
