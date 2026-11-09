const API = "https://api.github.com/users/";

function apiError(kind, extra = {}) {
  return Object.assign(new Error(kind), { kind }, extra);
}

function formatResetTime(header) {
  const seconds = Number(header);
  if (!seconds) return null;
  const date = new Date(seconds * 1000);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export async function fetchGithubUser(login) {
  let response;
  try {
    response = await fetch(API + encodeURIComponent(login), {
      headers: { Accept: "application/vnd.github+json" },
    });
  } catch {
    throw apiError("network");
  }
  if (response.status === 404) throw apiError("not_found");
  if (response.status === 403 || response.status === 429) {
    throw apiError("rate_limit", { resetAt: formatResetTime(response.headers.get("x-ratelimit-reset")) });
  }
  if (!response.ok) throw apiError("unknown");
  return response.json();
}

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}

export function normalizeUrl(value) {
  const url = (value || "").trim();
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}
