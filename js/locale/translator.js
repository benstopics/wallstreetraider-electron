/**
 * Build a phrase-translator for "English blob" -> "translated blob"
 * using a trie + longest-match scanning + overlap safety + optional LRU cache.
 *
 * Dictionary must be FLAT:
 *   { "Cancel": "取消", "OK": "确定", ... }
 *
 * Usage:
 *   const tr = createTranslator(zhDict, { enabled: true, cacheSize: 5000 });
 *   tr.translate("Cancel Order"); // replaces any matching phrases found
 *   tr.setEnabled(false);         // passthrough
 */
export function createTranslator(dict, opts = {}) {
    if (!dict || typeof dict !== "object") {
        throw new Error("createTranslator: dict must be an object of {english: translated}.");
    }

    const options = {
        enabled: opts.enabled ?? true,
        // Require non-word boundaries around matches to avoid replacing inside identifiers.
        // Example: won't replace "OK" inside "BROKER_OKAY" if true.
        requireBoundaries: opts.requireBoundaries ?? true,
        // Cache translated blobs (big speedup if you translate the same UI text repeatedly)
        cacheSize: Number.isFinite(opts.cacheSize) ? opts.cacheSize : 3000,
        // Optional normalization (keep conservative by default to avoid mismatches)
        normalizeKey: opts.normalizeKey ?? ((s) => s),
    };

    // ---------------- Trie ----------------
    function makeNode() {
        return { next: new Map(), value: null, keyLen: 0 };
    }

    const root = makeNode();
    let maxKeyLen = 0;

    // Insert all keys into trie
    for (const [rawKey, rawVal] of Object.entries(dict)) {
        if (typeof rawKey !== "string" || typeof rawVal !== "string") continue;
        const key = options.normalizeKey(rawKey);
        if (!key) continue;

        maxKeyLen = Math.max(maxKeyLen, key.length);

        let node = root;
        for (let i = 0; i < key.length; i++) {
            const ch = key[i];
            let child = node.next.get(ch);
            if (!child) {
                child = makeNode();
                node.next.set(ch, child);
            }
            node = child;
        }
        node.value = rawVal;
        node.keyLen = key.length;
    }

    // ---------------- LRU cache ----------------
    const cache = new Map(); // key: input string, value: output string
    function cacheGet(k) {
        const v = cache.get(k);
        if (v === undefined) return undefined;
        // refresh LRU
        cache.delete(k);
        cache.set(k, v);
        return v;
    }
    function cacheSet(k, v) {
        if (options.cacheSize <= 0) return;
        if (cache.has(k)) cache.delete(k);
        cache.set(k, v);
        if (cache.size > options.cacheSize) {
            // delete oldest
            const oldest = cache.keys().next().value;
            cache.delete(oldest);
        }
    }

    // ---------------- Boundary helpers ----------------
    // Define "word char" as alnum or underscore; tune if you want.
    function isWordCharCode(code) {
        // 0-9
        if (code >= 48 && code <= 57) return true;
        // A-Z
        if (code >= 65 && code <= 90) return true;
        // a-z
        if (code >= 97 && code <= 122) return true;
        // underscore
        return code === 95;
    }

    function boundaryOk(text, start, end) {
        if (!options.requireBoundaries) return true;

        // left boundary
        if (start > 0) {
            const left = text.charCodeAt(start - 1);
            const first = text.charCodeAt(start);
            // If both sides are "word chars", we're in the middle of a token.
            if (isWordCharCode(left) && isWordCharCode(first)) return false;
        }

        // right boundary
        if (end < text.length) {
            const last = text.charCodeAt(end - 1);
            const right = text.charCodeAt(end);
            if (isWordCharCode(last) && isWordCharCode(right)) return false;
        }

        return true;
    }

    // ---------------- Translator core ----------------
    function translate(text) {
        if (!options.enabled || typeof text !== "string" || text.length === 0) return text;

        const cached = cacheGet(text);
        if (cached !== undefined) return cached;

        // Fast skip: if no key can match, no work.
        // (Optional: you can remove this; it’s just a cheap guard)
        if (maxKeyLen === 0) {
            cacheSet(text, text);
            return text;
        }

        const matches = [];
        const n = text.length;

        // Longest-match scan using trie from each position.
        // Complexity is usually fine for UI strings; caching helps a lot.
        for (let i = 0; i < n; i++) {
            let node = root;
            let bestVal = null;
            let bestEnd = -1;

            // Walk forward from i
            // Stop early if we exceed maxKeyLen or no next char
            const limit = Math.min(n, i + maxKeyLen);
            for (let j = i; j < limit; j++) {
                node = node.next.get(text[j]);
                if (!node) break;

                if (node.value != null) {
                    const end = j + 1;
                    if (boundaryOk(text, i, end)) {
                        bestVal = node.value;
                        bestEnd = end;
                    }
                }
            }

            if (bestVal != null) {
                matches.push({ start: i, end: bestEnd, value: bestVal });
                // Skip ahead to avoid overlapping inside this match (greedy longest)
                i = bestEnd - 1;
            }
        }

        if (matches.length === 0) {
            cacheSet(text, text);
            return text;
        }

        // Rebuild output
        let out = "";
        let cursor = 0;
        for (const m of matches) {
            if (m.start < cursor) continue; // safety
            out += text.slice(cursor, m.start);
            out += m.value;
            cursor = m.end;
        }
        out += text.slice(cursor);

        cacheSet(text, out);
        return out;
    }

    return {
        translate,
        setEnabled(v) {
            options.enabled = !!v;
        },
        clearCache() {
            cache.clear();
        },
    };
}
