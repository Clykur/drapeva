// ============================================================
// DRAPEVA — Shipping Distance Service
// Uses OSRM (free, open-source road routing) + Nominatim (reverse geocoding)
// ============================================================

/** Default Drapeva store coordinates (NPS School Road, Chikkabellandur, Karnataka) */
const DEFAULT_STORE_LAT = 12.9043695;
const DEFAULT_STORE_LNG = 77.7157816;

export type DistanceStatus = "pending" | "success" | "failed";

export interface DistanceResult {
  distanceKm: number;
  shippingCharge: number;
  status: DistanceStatus;
  calculatedAt: string; // ISO timestamp
}

export interface ReverseGeocodeResult {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface StoreOrigin {
  lat: number;
  lng: number;
}

// ============================================================
// Store Origin — read from site_settings, fall back to default
// ============================================================

/**
 * Extracts store lat/lng from the site_settings array.
 * Falls back to the hard-coded Drapeva HQ coordinates if not configured.
 */
export function getStoreOrigin(settings: { key: string; value: unknown }[]): StoreOrigin {
  const findNum = (key: string, fallback: number): number => {
    const entry = settings.find((s) => s.key === key);
    if (entry && entry.value !== undefined && entry.value !== null) {
      const n = Number(entry.value);
      if (isFinite(n)) return n;
    }
    return fallback;
  };

  return {
    lat: findNum("store_latitude", DEFAULT_STORE_LAT),
    lng: findNum("store_longitude", DEFAULT_STORE_LNG),
  };
}

// ============================================================
// Reverse Geocoding — Nominatim (OpenStreetMap)
// ============================================================

/**
 * Converts GPS coordinates into a structured address using Nominatim.
 * Returns null on failure — callers must handle gracefully.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<ReverseGeocodeResult | null> {
  if (!isValidCoord(lat, lng)) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { "Accept-Language": "en" },
      },
    );
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    const addr = data?.address || {};

    const locality =
      addr.suburb || addr.neighbourhood || addr.village || addr.sublocality || addr.locality || "";
    const road = addr.road || addr.street || addr.pedestrian || "";
    const line1 = [locality, road].filter(Boolean).join(", ");
    const line2 = [addr.city_district, addr.county].filter(Boolean).join(", ");

    return {
      line1,
      line2,
      city: addr.city || addr.town || addr.village || addr.county || "",
      state: addr.state || "",
      postalCode: addr.postcode || "",
      country: addr.country || "India",
    };
  } catch {
    return null;
  }
}

// ============================================================
// Road Distance — OSRM (Open Source Routing Machine)
// ============================================================

/**
 * Calculates the road driving distance in kilometres between two coordinate pairs
 * using the public OSRM API.  Returns null on any error.
 */
export async function calculateRoadDistanceKm(
  origin: StoreOrigin,
  destLat: number,
  destLng: number,
): Promise<number | null> {
  if (!isValidCoord(origin.lat, origin.lng)) return null;
  if (!isValidCoord(destLat, destLng)) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    // OSRM route endpoint: coords are lng,lat (note: OSRM uses lon first)
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${origin.lng},${origin.lat};${destLng},${destLat}` +
      `?overview=false&steps=false`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();

    if (data?.code !== "Ok" || !data?.routes?.[0]) return null;

    // distance returned in metres — convert to km, round to 2 dp
    const metres: number = data.routes[0].distance;
    return Math.round((metres / 1000) * 100) / 100;
  } catch {
    return null;
  }
}

// ============================================================
// Straight-line (Haversine) fallback
// ============================================================

/**
 * Haversine straight-line distance in km — used as a fallback
 * when OSRM is unavailable.  Road distance is typically ~1.3–1.5× this.
 */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ============================================================
// Shipping charge computation
// ============================================================

/** Free delivery within FREE_DELIVERY_MAX_KM, otherwise configured flat rate */
export const FREE_DELIVERY_MAX_KM = 1000;

/**
 * Returns the shipping charge based on distance.
 * @param distanceKm   Road or haversine distance in km
 * @param configuredCost  Admin-configured flat shipping cost (e.g. 299)
 */
export function computeShippingCharge(distanceKm: number, configuredCost: number): number {
  return distanceKm <= FREE_DELIVERY_MAX_KM ? 0 : configuredCost;
}

// ============================================================
// Full calculation pipeline
// ============================================================

/**
 * Master function: given store origin + customer coordinates + configured cost,
 * returns a fully resolved DistanceResult.
 * - Tries OSRM first; falls back to Haversine * 1.4 if OSRM fails.
 * - Returns `status: 'failed'` if neither works.
 */
export async function resolveDistance(
  storeLat: number,
  storeLng: number,
  customerLat: number,
  customerLng: number,
  configuredShippingCost: number,
): Promise<DistanceResult> {
  const now = new Date().toISOString();

  if (!isValidCoord(storeLat, storeLng) || !isValidCoord(customerLat, customerLng)) {
    return {
      distanceKm: 0,
      shippingCharge: configuredShippingCost,
      status: "failed",
      calculatedAt: now,
    };
  }

  // 1. Try OSRM road distance
  const osrmKm = await calculateRoadDistanceKm(
    { lat: storeLat, lng: storeLng },
    customerLat,
    customerLng,
  );

  if (osrmKm !== null) {
    return {
      distanceKm: osrmKm,
      shippingCharge: computeShippingCharge(osrmKm, configuredShippingCost),
      status: "success",
      calculatedAt: now,
    };
  }

  // 2. Fallback — Haversine with road-factor multiplier (1.4)
  try {
    const straightKm = haversineKm(storeLat, storeLng, customerLat, customerLng);
    const estimatedKm = Math.round(straightKm * 1.4 * 100) / 100;
    return {
      distanceKm: estimatedKm,
      shippingCharge: computeShippingCharge(estimatedKm, configuredShippingCost),
      status: "success",
      calculatedAt: now,
    };
  } catch {
    return {
      distanceKm: 0,
      shippingCharge: configuredShippingCost,
      status: "failed",
      calculatedAt: now,
    };
  }
}

// ============================================================
// Utilities
// ============================================================

function isValidCoord(lat: number, lng: number): boolean {
  return (
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0) // reject null island
  );
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
