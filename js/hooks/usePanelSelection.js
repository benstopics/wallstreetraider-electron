import { useState, useMemo } from '../lib/preact.standalone.module.js';

/**
 * Hook for panel selection (mouse-only version, hotkey system removed).
 *
 * @param {{ panelCount: number, startNumber: number }} opts
 * @returns {{ selectedPanelNumber: number|null, setSelectedPanelNumber: Function, shiftHeld: boolean, panelNumbers: Set<number> }}
 */
export function usePanelSelection({ panelCount, startNumber }) {
    const [selectedPanelNumber, setSelectedPanelNumber] = useState(null);

    // Build set of valid panel numbers
    const panelNumbers = useMemo(() => {
        const s = new Set();
        for (let i = 0; i < panelCount; i++) s.add(startNumber + i);
        return s;
    }, [panelCount, startNumber]);

    return { selectedPanelNumber, setSelectedPanelNumber, shiftHeld: false, panelNumbers };
}
