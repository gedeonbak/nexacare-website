// UTM capture for landing-page attribution.
//
// Pattern (per _UTM_Convention.md — Morgan, 2026-05-28):
//   - On page mount, read utm_source/medium/campaign/content/term from URL
//   - Persist in BOTH sessionStorage (in-tab) AND a 90-day first-party cookie
//     (cross-tab, returning-visitor attribution)
//   - On form submit, read stored UTMs and forward to HubSpot + Slack
//
// Convention: last-touch overwrite (a new ?utm_campaign overrides the prior
// stored values). To switch to first-touch preservation, add an `nx_utm_first_*`
// pair — out of scope for v1.

export interface UTMData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

const STORAGE_KEY = "nexacare_utm";
const COOKIE_NAME = "nexacare_utm";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

function emptyUTM(): UTMData {
  return {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  };
}

function hasAnyValue(utm: UTMData): boolean {
  return Object.values(utm).some((v) => v !== "");
}

// ── Cookie helpers (first-party, no consent banner needed for functional cookies) ──

function writeCookie(value: string): void {
  if (typeof document === "undefined") return;
  // Use leading-dot domain so cookie survives www → apex navigation.
  // In local dev (localhost), drop the Domain attribute or browsers reject it.
  const isLocal = window.location.hostname === "localhost" ||
                  window.location.hostname === "127.0.0.1";
  const domainAttr = isLocal ? "" : "; Domain=.nexacaremanagement.com";
  const secureAttr = isLocal ? "" : "; Secure";
  document.cookie =
    `${COOKIE_NAME}=${encodeURIComponent(value)}` +
    `; Max-Age=${COOKIE_MAX_AGE}` +
    `; Path=/` +
    domainAttr +
    `; SameSite=Lax` +
    secureAttr;
}

function readCookie(): UTMData | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    const raw = decodeURIComponent(match.split("=")[1]);
    const parsed = JSON.parse(raw) as Partial<UTMData>;
    return { ...emptyUTM(), ...parsed };
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Read UTM params from URL. If any are present, persist to sessionStorage AND
 * a 90-day cookie. If none in URL but cookie has values, rehydrate sessionStorage
 * (returning visitor case).
 *
 * Returns the resulting UTM object after capture/rehydration.
 */
export function captureUTM(): UTMData {
  if (typeof window === "undefined") return emptyUTM();

  const params = new URLSearchParams(window.location.search);
  const fromUrl: UTMData = {
    utm_source:   params.get("utm_source")   || "",
    utm_medium:   params.get("utm_medium")   || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content:  params.get("utm_content")  || "",
    utm_term:     params.get("utm_term")     || "",
  };

  if (hasAnyValue(fromUrl)) {
    // New touch — last-touch overwrite in both stores.
    const json = JSON.stringify(fromUrl);
    sessionStorage.setItem(STORAGE_KEY, json);
    writeCookie(json);
    return fromUrl;
  }

  // No UTMs in URL. If sessionStorage is empty but cookie has values,
  // rehydrate so form-submit reads consistent data.
  if (!sessionStorage.getItem(STORAGE_KEY)) {
    const fromCookie = readCookie();
    if (fromCookie && hasAnyValue(fromCookie)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromCookie));
      return fromCookie;
    }
  }

  return getStoredUTM();
}

/**
 * Read previously captured UTMs. Prefers sessionStorage (in-tab), falls back
 * to cookie (cross-session). Returns empty UTM if neither has data.
 */
export function getStoredUTM(): UTMData {
  if (typeof window === "undefined") return emptyUTM();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...emptyUTM(), ...(JSON.parse(raw) as Partial<UTMData>) };
    }
  } catch {
    /* fall through */
  }
  return readCookie() ?? emptyUTM();
}
