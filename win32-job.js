// Win32 Job Object wrapper — kernel-enforced lifecycle binding for child
// processes. When the last handle to the Job closes (which the OS does
// automatically when Electron exits, *for any reason* including crashes),
// the kernel terminates every process in the Job. This eliminates
// orphan-wsr.exe scenarios at the source: no PID tracking, no enumeration,
// no taskkill. The kernel does it, invisibly to AV behavioral monitors.
//
// All koffi/Win32 calls are wrapped in try/catch — if the FFI fails to
// load (binary mismatch, etc.) the helpers return null/false and main.js
// falls back to the existing manual reap. We never throw upward.

'use strict';

let _koffi = null;
let _kernel32 = null;
let _fns = null;
let _structs = null;
let _initFailed = false;

// Win32 constants (raw values from WinNT.h / WinBase.h)
const JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE = 0x00002000;
const JobObjectExtendedLimitInformation = 9;
const PROCESS_SET_QUOTA = 0x0100;
const PROCESS_TERMINATE = 0x0001;

function _init() {
    if (_fns) return true;
    if (_initFailed) return false;
    try {
        _koffi = require('koffi');
        _kernel32 = _koffi.load('kernel32.dll');

        const HANDLE = 'void *';
        const DWORD = 'uint32';
        const BOOL = 'int32';
        const ULONG_PTR = 'uintptr';
        const SIZE_T = 'uintptr';

        const JOBOBJECT_BASIC_LIMIT_INFORMATION = _koffi.struct('JOBOBJECT_BASIC_LIMIT_INFORMATION', {
            PerProcessUserTimeLimit: 'int64',
            PerJobUserTimeLimit: 'int64',
            LimitFlags: DWORD,
            MinimumWorkingSetSize: SIZE_T,
            MaximumWorkingSetSize: SIZE_T,
            ActiveProcessLimit: DWORD,
            Affinity: ULONG_PTR,
            PriorityClass: DWORD,
            SchedulingClass: DWORD,
        });
        const IO_COUNTERS = _koffi.struct('IO_COUNTERS', {
            ReadOperationCount: 'uint64',
            WriteOperationCount: 'uint64',
            OtherOperationCount: 'uint64',
            ReadTransferCount: 'uint64',
            WriteTransferCount: 'uint64',
            OtherTransferCount: 'uint64',
        });
        const JOBOBJECT_EXTENDED_LIMIT_INFORMATION = _koffi.struct('JOBOBJECT_EXTENDED_LIMIT_INFORMATION', {
            BasicLimitInformation: JOBOBJECT_BASIC_LIMIT_INFORMATION,
            IoInfo: IO_COUNTERS,
            ProcessMemoryLimit: SIZE_T,
            JobMemoryLimit: SIZE_T,
            PeakProcessMemoryUsed: SIZE_T,
            PeakJobMemoryUsed: SIZE_T,
        });

        _structs = { JOBOBJECT_EXTENDED_LIMIT_INFORMATION };

        _fns = {
            CreateJobObjectW: _kernel32.func('__stdcall', 'CreateJobObjectW', HANDLE, ['void *', 'void *']),
            SetInformationJobObject: _kernel32.func('__stdcall', 'SetInformationJobObject', BOOL, [HANDLE, 'int32', 'void *', DWORD]),
            AssignProcessToJobObject: _kernel32.func('__stdcall', 'AssignProcessToJobObject', BOOL, [HANDLE, HANDLE]),
            OpenProcess: _kernel32.func('__stdcall', 'OpenProcess', HANDLE, [DWORD, BOOL, DWORD]),
            CloseHandle: _kernel32.func('__stdcall', 'CloseHandle', BOOL, [HANDLE]),
            GetLastError: _kernel32.func('__stdcall', 'GetLastError', DWORD, []),
        };
        return true;
    } catch (e) {
        console.warn('[win32-job] koffi/kernel32 init failed:', e.message);
        _initFailed = true;
        _koffi = null;
        _kernel32 = null;
        _fns = null;
        _structs = null;
        return false;
    }
}

// Create a kill-on-job-close Job Object. Returns the opaque handle on
// success, null on any failure. The handle is intentionally opaque to
// callers — they pass it back to assignProcessToJob and that's it.
function createKillOnCloseJob() {
    if (!_init()) return null;
    try {
        const handle = _fns.CreateJobObjectW(null, null);
        if (!handle) {
            console.warn('[win32-job] CreateJobObjectW failed, GLE =', _fns.GetLastError());
            return null;
        }

        const sz = _koffi.sizeof(_structs.JOBOBJECT_EXTENDED_LIMIT_INFORMATION);
        const buf = Buffer.alloc(sz);
        _koffi.encode(buf, _structs.JOBOBJECT_EXTENDED_LIMIT_INFORMATION, {
            BasicLimitInformation: {
                PerProcessUserTimeLimit: 0n,
                PerJobUserTimeLimit: 0n,
                LimitFlags: JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE,
                MinimumWorkingSetSize: 0,
                MaximumWorkingSetSize: 0,
                ActiveProcessLimit: 0,
                Affinity: 0,
                PriorityClass: 0,
                SchedulingClass: 0,
            },
            IoInfo: {
                ReadOperationCount: 0n, WriteOperationCount: 0n, OtherOperationCount: 0n,
                ReadTransferCount: 0n, WriteTransferCount: 0n, OtherTransferCount: 0n,
            },
            ProcessMemoryLimit: 0,
            JobMemoryLimit: 0,
            PeakProcessMemoryUsed: 0,
            PeakJobMemoryUsed: 0,
        });

        const ok = _fns.SetInformationJobObject(handle, JobObjectExtendedLimitInformation, buf, sz);
        if (!ok) {
            console.warn('[win32-job] SetInformationJobObject failed, GLE =', _fns.GetLastError());
            try { _fns.CloseHandle(handle); } catch (_) {}
            return null;
        }
        return handle;
    } catch (e) {
        console.warn('[win32-job] createKillOnCloseJob threw:', e.message);
        return null;
    }
}

// Assign a child process (by PID) to a Job Object. Returns true on success.
// Safe to call repeatedly — assigning the same process twice is a no-op
// in the kernel (returns ERROR_ACCESS_DENIED but the process is already in).
// Caller should pass the job handle from createKillOnCloseJob.
function assignProcessToJob(jobHandle, pid) {
    if (!jobHandle || !_init()) return false;
    if (!Number.isInteger(pid) || pid <= 0) return false;
    let processHandle = null;
    try {
        processHandle = _fns.OpenProcess(PROCESS_SET_QUOTA | PROCESS_TERMINATE, 0, pid);
        if (!processHandle) {
            console.warn(`[win32-job] OpenProcess(${pid}) failed, GLE =`, _fns.GetLastError());
            return false;
        }
        const ok = _fns.AssignProcessToJobObject(jobHandle, processHandle);
        if (!ok) {
            console.warn(`[win32-job] AssignProcessToJobObject(${pid}) failed, GLE =`, _fns.GetLastError());
            return false;
        }
        return true;
    } catch (e) {
        console.warn('[win32-job] assignProcessToJob threw:', e.message);
        return false;
    } finally {
        if (processHandle) {
            try { _fns.CloseHandle(processHandle); } catch (_) {}
        }
    }
}

module.exports = { createKillOnCloseJob, assignProcessToJob };
