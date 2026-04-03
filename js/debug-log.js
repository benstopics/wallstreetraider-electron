/**
 * Frontend Debug Logger
 *
 * Writes structured log entries to wsr_frontend.log when WSR_DEBUG_VERBOSE=1.
 * Also captures unhandled errors to wsr_frontend_errors.log.
 *
 * Usage:
 *   import { debugLog } from './debug-log.js';
 *   debugLog.log('REST', 'POST /buy_stock id=42 -> 200 (15ms)');
 */

// In a plain browser (phone access via serve), Node APIs are unavailable.
const isNode = typeof process !== 'undefined' && typeof process.env !== 'undefined' && typeof require !== 'undefined';
const fs = isNode ? require('fs') : null;
const path = isNode ? require('path') : null;

const isEnabled = isNode && process.env.WSR_DEBUG_VERBOSE === '1';

// Log directory: same directory as the app
const logDir = isNode ? process.cwd() : '';
const frontendLogPath = isNode ? path.join(logDir, 'wsr_frontend.log') : '';
const errorLogPath = isNode ? path.join(logDir, 'wsr_frontend_errors.log') : '';

// Max log file size: 5MB
const MAX_LOG_SIZE = 5 * 1024 * 1024;

function timestamp() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0');
    return `${hh}:${mm}:${ss}.${ms}`;
}

function rotateIfNeeded(filePath) {
    try {
        const stat = fs.statSync(filePath);
        if (stat.size > MAX_LOG_SIZE) {
            const backup = filePath + '.1';
            try { fs.unlinkSync(backup); } catch (_) {}
            fs.renameSync(filePath, backup);
        }
    } catch (_) {
        // File doesn't exist yet, that's fine
    }
}

function appendLog(filePath, line) {
    if (!fs) return;
    try {
        rotateIfNeeded(filePath);
        fs.appendFileSync(filePath, line + '\n');
    } catch (_) {
        // Silently fail — don't break the app over logging
    }
}

export const debugLog = {
    enabled: isEnabled,

    log(category, message) {
        if (!isEnabled) return;
        appendLog(frontendLogPath, `[${timestamp()}] [${category}] ${message}`);
    },

    error(category, message) {
        // Errors always go to the error log, regardless of WSR_DEBUG_VERBOSE
        appendLog(errorLogPath, `[${timestamp()}] [${category}] ${message}`);
        // Also to the debug log if verbose
        if (isEnabled) {
            appendLog(frontendLogPath, `[${timestamp()}] [ERROR:${category}] ${message}`);
        }
    },
};

// Write header on startup
if (isEnabled) {
    appendLog(frontendLogPath, `[${timestamp()}] === Frontend Debug Log Started ===`);
}

// Unhandled error and promise rejection handlers
window.addEventListener('error', (event) => {
    const msg = `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
    debugLog.error('UNHANDLED', msg);
    console.error('[WSR Debug] Unhandled error:', event.message);
});

window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason instanceof Error
        ? `${reason.message}\n${reason.stack}`
        : String(reason);
    debugLog.error('UNHANDLED_PROMISE', msg);
    console.error('[WSR Debug] Unhandled promise rejection:', reason);
});
