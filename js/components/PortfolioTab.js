import { html } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
// Hedge Fund UI removed in this build (UI-only).
import Tooltip from './Tooltip.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';
import Modal from './Modal.js';

// Stop orders are managed centrally in api.js and checked on each gameState refresh.

function getCompanyPrice(company) {
    if (!company) return null;
    const keys = ['price', 'sharePrice', 'stockPrice', 'lastPrice', 'currentPrice', 'quotePrice'];
    for (const k of keys) {
        const v = company[k];
        if (typeof v === 'number' && Number.isFinite(v)) return v;
    }
    return null;
}


const Tab = Tabs.Tab;

function IndexPanel({ title, bondId }) {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);

    const buy = bondId === api.TBOND_RATE_ID ? api.buyLongGovtBonds : api.buyShortGovtBonds;

    const disabledMessage = !actingAs
        ? "Must be acting as this company"
        : ![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId) ? "Only players, banks, and insurance companies can trade government bonds."
        : false;

    return html`
        <div class="flex flex-col w-full">
            <div class="flex flex-col" style="height: 100px">
                ${html`<${AssetPriceChart} chartTitle=${title} assetId=${bondId} />`}
            </div>
            ${!disabledMessage
                ? html`
                <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                    <button class="btn green flex-1 mx-1" onclick=${() => buy(bondId)}>Buy</button>
                </div>`
                : html`
                <${Tooltip} text=${disabledMessage}>
                    <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                        <button class="btn disabled flex-1 mx-1">Buy</button>
                    </div>
                <//>
            `}
        </div>
    `;
}

function PortfolioTab() {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const portfolio = api.useGameStore(s => s.gameState.portfolio);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];

    const companyById = useMemo(() => {
        const m = new Map();
        for (const c of allCompanies) if (c && c.id != null) m.set(Number(c.id), c);
        return m;
    }, [allCompanies]);

    const [stopModal, setStopModal] = useState(null); // { assetId, kind:'loss'|'gain', type, text, priceStr }

    // Auto-trigger happens inside api.checkStopOrders(), called from app.js on each refresh.

    const openStopModal = (kind, posType, assetId, lineText) => {
        const company = companyById.get(Number(assetId));
        const cur = getCompanyPrice(company);
        setStopModal({ kind, posType, assetId, text: lineText || '', currentPrice: cur, priceStr: cur != null ? String(cur) : '' });
    };

    const submitStopModal = () => {
        if (!stopModal) return;
        const p = Number((stopModal.priceStr || '').toString().replace(/[^0-9.\-]/g, ''));
        if (!Number.isFinite(p) || p <= 0) {
            setStopModal(null);
            return;
        }
        const assetId = Number(stopModal.assetId);
        const posType = stopModal.posType || 'C';
        const kind = stopModal.kind;
        const key = `${posType}:${assetId}`;

        const existing = api.getStopOrder(actingAsId, key) || {};
        const nextStopLoss = (kind === 'loss') ? p : (existing.stopLoss ?? null);
        const nextStopGain = (kind === 'gain') ? p : (existing.stopGain ?? null);
        api.setStopOrder(actingAsId, key, nextStopLoss, nextStopGain);
        setStopModal(null);
    };

    const clearStop = (assetId, posType, kind) => {
        const key = `${posType || 'C'}:${Number(assetId)}`;
        const existing = api.getStopOrder(actingAsId, key) || {};
        const nextStopLoss = (kind === 'loss') ? null : (existing.stopLoss ?? null);
        const nextStopGain = (kind === 'gain') ? null : (existing.stopGain ?? null);
        api.setStopOrder(actingAsId, key, nextStopLoss, nextStopGain);
    };

    return html`
            <div class="flex flex-col w-full">
                ${stopModal ? html`
                    <${Modal} show=${true} onClose=${() => setStopModal(null)} class="modal-card stop-modal">
                        <div class="flex items-center justify-between" style="gap: 12px;">
                            <div class="text-lg font-bold">${stopModal.kind === 'loss' ? 'Stop Loss' : 'Stop Gain'}</div>
                            <button class="btn" onClick=${() => setStopModal(null)} style="height: 24px;">Close</button>
                        </div>
                        <div class="opacity-80" style="margin-top: 6px;">
                            Current price: <b>${stopModal.currentPrice != null ? stopModal.currentPrice : '�'}</b>
                        </div>
                        <div style="margin-top: 10px;">
                            <div class="text-xs opacity-70" style="margin-bottom: 6px;">Sell automatically when price ${stopModal.kind === 'loss' ? 'falls to' : 'reaches'}:</div>
                            <input
                                type="text"
                                class="modal-input"
                                value=${stopModal.priceStr}
                                onInput=${(e) => setStopModal((prev) => prev ? { ...prev, priceStr: e.target.value } : prev)}
                            />
                        </div>
                        <div class="flex justify-between items-center" style="margin-top: 12px; gap: 10px;">
                            <button class="btn" onClick=${() => { clearStop(stopModal.assetId, stopModal.posType, stopModal.kind); setStopModal(null); }}>
                                Clear
                            </button>
                            <div class="flex gap-2">
                                <button class="btn" onClick=${() => setStopModal(null)}>Cancel</button>
                                <button class="btn green" onClick=${submitStopModal}>Save</button>
                            </div>
                        </div>
                    <//>
                ` : ''}
                <div class="flex flex-row items-center justify-start gap-5">
                    <div class="items-center flex flex-row justify-center">
                        <${ActingAsRequiredButton} 
                            disabledMessage=${actingAs ? "Cannot merge with yourself"
                                : actingAsIndustryId === api.PLAYER_IND ? "Must be acting as this company a company"
                                : false} 
                            onClick=${api.merger} 
                            label="Merge With"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.sellSubsidiaryStock} 
                            label="Offer Stock for Sale"
                            color="red"
                        />
                    </div>
                </div>
                <div class="flex flex-row flex-[1]">
                    <${IndexPanel} title="Long Bond" bondId=${api.TBOND_RATE_ID} />
                    <${IndexPanel} title="Short Bond" bondId=${api.SBOND_RATE_ID} />
                </div>
                <div class="flex flex-col items-center flex-[3]">
                    ${renderLines(portfolio,
                        ({ id }) => id && api.setViewAsset(id),
                        ({ type, id, text }) => {
                            const isGov = typeof text === 'string' && text.includes('GOVERNMENT');
                            const assetId = Number(id);
                            const stopKey = `${type || 'C'}:${assetId}`;
                            const stop = (actingAsId && Number.isFinite(assetId)) ? (api.getStopOrder(actingAsId, stopKey) || null) : null;
                            const hasStopLoss = (stop && typeof stop.stopLoss === 'number') ? stop.stopLoss : null;
                            const hasStopGain = (stop && typeof stop.stopGain === 'number') ? stop.stopGain : null;
                            return html`<div class="flex flex-row stop-btn-row">
                                ${!isGov && Number.isFinite(assetId) ? html`
                                    <button
                                        class=${`btn p-2 stop-btn stop-loss ${hasStopLoss != null ? 'is-set' : ''}`}
                                        title=${hasStopLoss != null ? `Stop Loss @ ${hasStopLoss}` : 'Set Stop Loss'}
                                        disabled=${!actingAs}
                                        onClick=${() => openStopModal('loss', type, assetId, text)}
                                    >SL</button>
                                    <button
                                        class=${`btn p-2 stop-btn stop-gain ${hasStopGain != null ? 'is-set' : ''}`}
                                        title=${hasStopGain != null ? `Stop Gain @ ${hasStopGain}` : 'Set Stop Gain'}
                                        disabled=${!actingAs}
                                        onClick=${() => openStopModal('gain', type, assetId, text)}
                                    >SG</button>
                                ` : ''}
                                <${ActingAsRequiredButton}
                                    disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                                    onClick=${() => (type === "S" ? api.coverShortStock
                                        : type === "J" ? api.sellCorporateBond
                                        : type === "GS" ? api.sellShortGovtBonds
                                        : type === "GL" ? api.sellLongGovtBonds
                                        : api.sellStock
                                    )(id)}
                                    label="${type === "S" ? "Cover" : "Sell"}"
                                    color="red"
                                />
                                ${!text.includes('GOVERNMENT') ?html`<${ActingAsRequiredButton} 
                                    disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                                    onClick=${() => api.spinOff(id)} 
                                    label="Spin-Off"
                                    color="blue"
                                />` : ''}
                            </div>`
                        }, hyperlinkRegex)} 
                </div>
            </div>
    `;
}

export default PortfolioTab;