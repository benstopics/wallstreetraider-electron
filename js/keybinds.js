// Keybind persistence + helpers (client-side).
//
// Design goals:
// - Do not depend on the backend.
// - Store binds in localStorage.
// - Provide simple, safe key capture helpers.

const LS_COMPANY = 'wsr_company_keybinds_v1';
const LS_GLOBAL = 'wsr_global_keybinds_v1';

// Actions referenced by id in the stored objects.
// Keep ids stable to preserve user settings.
export const GLOBAL_ACTIONS = [
  { id: 'DB_SEARCH', label: 'Database Search' },
  { id: 'CHANGE_LAW_FIRM', label: 'Change Law Firm' },
  { id: 'HARASS_LAWSUIT', label: 'Harassment Lawsuit' },
  { id: 'SPREAD_RUMORS', label: 'Spread Rumors' },
  { id: 'TOGGLE_AUTOPILOT', label: 'Toggle Global Autopilot' },
  { id: 'NOTEPAD', label: 'Notepad' },
  { id: 'CALCULATOR', label: 'Calculator' },
  { id: 'HELP', label: 'Help' },
];

function safeJsonParse(str, fallback) {
  try {
    const v = JSON.parse(str);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export function loadCompanyKeybinds() {
  if (typeof localStorage === 'undefined') return [];
  return safeJsonParse(localStorage.getItem(LS_COMPANY) || '[]', []);
}

export function saveCompanyKeybinds(rows) {
  if (typeof localStorage === 'undefined') return;
  const clean = Array.isArray(rows) ? rows.map((r) => ({
    companyId: Number(r.companyId),
    primary: r.primary ?? null,
    secondary: null,
  })).filter((r) => Number.isFinite(r.companyId)) : [];
  localStorage.setItem(LS_COMPANY, JSON.stringify(clean));
}

export function clearCompanyKeybinds() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(LS_COMPANY);
}

export function loadGlobalKeybinds() {
  if (typeof localStorage === 'undefined') return {};
  return safeJsonParse(localStorage.getItem(LS_GLOBAL) || '{}', {});
}

export function saveGlobalKeybinds(binds) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(LS_GLOBAL, JSON.stringify(binds || {}));
}

export function clearGlobalKeybinds() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(LS_GLOBAL);
}

export function formatCode(code) {
  if (!code) return '—';
  // Present something readable like "Ctrl+Shift+K".
  return String(code)
    .replace('CTRL+', 'Ctrl+')
    .replace('ALT+', 'Alt+')
    .replace('SHIFT+', 'Shift+')
    .replace('META+', 'Meta+')
    .replace('ARROW', 'Arrow');
}

export function isEditableTarget(t) {
  if (!t) return false;
  const tag = (t.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (t.isContentEditable) return true;
  return false;
}

// Disallow binds that conflict with core UI.
export function isForbiddenKey(code) {
  const c = String(code || '').toUpperCase();
  return c === 'SPACE' || c === 'SPACEBAR' || c.endsWith('+SPACE') || c === 'ESCAPE';
}

// Convert a keyboard event to a stable bind string.
// We prefer e.code for layout-independent bindings.
export function eventToBindCode(e) {
  if (!e) return null;
  const parts = [];
  if (e.ctrlKey) parts.push('CTRL');
  if (e.altKey) parts.push('ALT');
  if (e.shiftKey) parts.push('SHIFT');
  if (e.metaKey) parts.push('META');

  const base = e.code || e.key;
  if (!base) return null;
  const norm = String(base).toUpperCase();
  parts.push(norm);
  return parts.join('+');
}
