export interface UTMData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

export function captureUTM(): UTMData {
  if (typeof window === "undefined") return emptyUTM();
  const params = new URLSearchParams(window.location.search);
  const utm: UTMData = {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
  };
  // Only store if we have at least one UTM param
  if (Object.values(utm).some((v) => v !== "")) {
    sessionStorage.setItem("nexacare_utm", JSON.stringify(utm));
  }
  return utm;
}

export function getStoredUTM(): UTMData {
  if (typeof window === "undefined") return emptyUTM();
  try {
    return JSON.parse(
      sessionStorage.getItem("nexacare_utm") || "{}"
    ) as UTMData;
  } catch {
    return emptyUTM();
  }
}

function emptyUTM(): UTMData {
  return {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  };
}
