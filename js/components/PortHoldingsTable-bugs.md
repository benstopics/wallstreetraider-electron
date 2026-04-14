# PortHoldingsTable Action Button Bug Report

---

## 1. OPTIONS: Sell and Exercise pass wrong ID — CONFIRMED BUG

**Symptom:** "That options contract # 532 does not exist." Exercise button does nothing.

**Root cause:** `PortHoldingsTable.js:462-467` passes `row.companyId` to `sellCalls`, `sellPuts`,
`exerciseCallOptionsEarly`, `exercisePutOptionsEarly`. The game engine expects the **options
contract slot index** (1-based position in the `optionsContracts[]` array), not the underlying
company ID.

`OptionsTab.js:92` shows the correct pattern:
```js
// id is formatted as "slot|companyId" in the hyperlink (@OPT<slot>|<companyId>)
)(parseInt(id.split('|')[0]));         // slot → sellCalls/sellPuts
api.setViewAsset(parseInt(id.split('|').pop()));  // companyId → navigation only
```

Error "contract # 532" = NIPPON CHEMCO company ID (532) being interpreted as a slot number.
`row.slot` is already populated from the C++ backend (`{"slot", i}` in section 5.3).

**Fix:**
- [x] Replace `row.companyId` with `row.slot` in all four option action calls (`PortHoldingsTable.js:462-467`)

---

## 2. FUTURES (Close) and PHYSICALS (Sell) — Confirmed missing actAs in PB

**Symptom:** Buttons do nothing.

**Root cause — confirmed at all three layers:**

### Layer A: Events not in PB acting-as override list
In `ui.inc` lines 833-840, the acting-as override SELECT CASE is:
```
CASE 60, 70, 80, 90, 100, 110, 120, 125, 130, 135, 280, 290, 300, 310, 340, 350
```
Events **150, 170, 190 are absent**. The override sets `PlayCo& = IntParam2` (the acting-as entity)
before the handler runs. Without being in this list, `PlayCo&` is never changed.

### Layer B: PB handlers use PlayCo& directly — no fallback
- Event 150 handler (`front.inc`): `FrontSellCommod(2&, PlayCo&, 0)` — PlayCo& hardcoded as seller
- Event 170 handler: `FrontBuyCommod(2&, PlayCo&, 0)` — PlayCo& hardcoded as buyer (for cover)
- Event 190 handler: `FrontSellPhysCommod(PlayCo&, ...)` — PlayCo& hardcoded as seller

Since `PlayCo&` = TIMBER (the human player) at all times, selling USHIBA's corn futures submits the
trade for TIMBER, which doesn't own them → game silently does nothing.

### Layer C: JS API functions have no actingAsId parameter
```js
// api.js — none accept actingAsId
export async function sellCommodityFutures(id)       { await postIdArg('/sell_commodity_futures', id); }
export async function coverShortCommodityFutures(id) { await postIdArg('/cover_short_commodity_futures', id); }
export async function sellPhysicalCommodity(id)      { await postIdArg('/sell_physical_commodity', id); }
```
Even if the PB layer were fixed, the JS side currently can't send actingAsId for these events.

**Fix required at all three layers:**
- [x] Add events 150, 170, 190 to both acting-as override CASE blocks in `ui.inc` (lines 834 and 1839)
- [x] Change `sellCommodityFutures`, `coverShortCommodityFutures`, `sellPhysicalCommodity` in `api.js` from `postIdArg` → `postIdArgWithActingAs`, add `actingAsId = 0` param
- [x] Pass `actAs` in `PortHoldingsTable.js:471-475`

---

## 3. SWAPS: Terminate and Details — Confirmed missing actAs in PB

**Symptom:** Terminate does nothing when acting for a subsidiary.

**Root cause — same structure as issue 2:**

Events **724, 725 are absent** from the acting-as override CASE list in `ui.inc`.

PB handler (`front.inc`):
```basic
CASE 724 ' VIEW_SWAP_DETAILS
    TerminateSwap(IntParam1, 1)   ' mode 1 = view
CASE 725 ' TERMINATE_SWAP
    TerminateSwap(IntParam1, 2)   ' mode 2 = terminate
```
`TerminateSwap` looks up the swap by slot number (`IntParam1`) and uses `PlayCo&` to verify
ownership. PlayCo& = TIMBER → TIMBER is not a party to USHIBA's swap → nothing happens.

The slot number itself (`row.slot`) is correct — it matches the format used in
`InterestRateSwapsTab.js:82/93` which also calls `terminateSwap(id)` / `viewSwapDetails(id)`.

**Fix required:**
- [x] Add events 724, 725 to both acting-as override CASE blocks in `ui.inc` (lines 834 and 1839)
- [x] Change `terminateSwap` and `viewSwapDetails` in `api.js` from `postIdArg` → `postIdArgWithActingAs`, add `actingAsId = 0` param
- [x] Pass `actAs` in `PortHoldingsTable.js:478-479`

---

## 4. GOVT BONDS: Sell acting-as — Confirmed working in PB; issue is upstream

**Symptom:** User reports "acting as not working for sell govt bond."

**PB layer — confirmed correct:**

Events 125 and 135 **ARE** in the acting-as override CASE list (`ui.inc:834`). The override does
fire and PlayCo& is temporarily set to the actingAsId entity.

`TBondTrade` restriction check (from `front.inc` lines ~8009-8014):
```basic
IF (X&=1 OR X&=3) AND IndNum&(PlayCo&)<>0 AND IndNum&(PlayCo&)<>1 AND IndNum&(PlayCo&)<>2 THEN
    QuikMesg("Only players, banks, and insurers can trade government bonds.")
    EXIT SUB
END IF
```
This restriction applies **only to buy operations** (X=1 buy long, X=3 buy short). Sell operations
(X=2 from event 125, X=4 from event 135) skip this check entirely. Any entity that owns the bonds
can sell them.

**JS layer — confirmed correct:**
- `rawAssetType` is preserved in `normaliseRow` (base field `rawAssetType: rawType`)
- The GOVT_BOND_L / GOVT_BOND_S routing in `handleAction:457-458` is correct
- `sellLongGovtBonds(actAs)` uses `postIdArgWithActingAs` → actingAsId IS transmitted

**Conclusion:** The govtbond sell action is correctly implemented end-to-end. If the user saw
"acting as not working," the likely explanation is that the entity being tested (USHIBA) did not
actually hold govt bonds at the time (screenshot 1 confirms USHIBA's Holdings has no govt bonds),
so there was nothing to sell. The "not working" may have been a misread of an empty result.

---

## 5. CORP BOND: Player can't sell — Game restriction, not a bug

**Symptom:** "Corporate managers, other than at financial institutions..."

Confirmed intentional. `TBondTrade` (and the equivalent for corp bonds) restricts bond trading to
players (IndNum=0), banks (IndNum=1), and insurance companies (IndNum=2). TIMBER as an industrial
corporation falls outside this set. The game message is the expected output.

USHIBA subsidiary corp bond sells work because those actions pass actAs = USHIBA's entity ID,
and USHIBA's industry classification allows it.

---

## 6. SELL STOCK (Player): Wrong actAs — Two confirmed causes

**Symptom:** Sell on a player-directly-owned stock sends wrong entity; game says player doesn't
own it.

### Cause A: Stale `activeEntityNum` in Zustand store (confirmed mechanism)

`setViewAsset` in `api.js` does **not** perform a local optimistic state update:
```js
export async function setViewAsset(id) {
    await postIdArg('/set_view_asset', id);   // IPC call — awaits server round-trip
    // NO gameStore.setState() here
    // activeEntityNum only updates on next 50ms polling cycle
}
```
After switching from USHIBA's tab (activeEntityNum = USHIBA ≫ 10) to TIMBER's tab, the store still
holds USHIBA's entity number until the next poll (up to 50ms). If the user clicks Sell in that
window:
```js
const actAs = row.ownerCompanyId ?? (activeEntityNum > 10 ? activeEntityNum : 0);
// row.ownerCompanyId = null (player's direct stock)
// activeEntityNum = USHIBA's entity (stale, still > 10)
// actAs = USHIBA's entity  ← wrong, sends as intParam2 to event 70
```
Event 70 handler runs with PlayCo& temporarily set to USHIBA. Game checks if USHIBA owns the
target stock (it doesn't — the player owns it) → "player doesn't own that stock."

### Cause B: Row identity confusion (confirmed via table layout)

After the subsidiary drill-down backend changes, the player's Holdings tab now shows USHIBA's
subsidiary stocks (ELECTRONICS, COMPUTERS) alongside the player's own stocks. Both appear in the
same table. USHIBA's subsidiary rows have `ownerCompanyId = USHIBA_entity_ID` visually marked in
the Owner column, but if the user clicks the wrong row (especially if sorted near top by market
value), `actAs` = USHIBA's entity → the same failure mode as Cause A.

**Fix:**
- [x] Add optimistic `activeEntityNum` update in `setViewAsset` (`api.js`) — call `gameStore.setState` with the new entity ID immediately after the IPC call, before the next poll
- [x] Consider a stronger visual distinction for subsidiary rows (e.g., background tint or indentation) so the Owner column is harder to miss

---

## 7. SHORT STOCK: Does nothing — Confirmed two separate scenarios

### Scenario A: CommandPrompt "SHORT" without a company symbol

CommandPrompt `onKeyDown` (`CommandPrompt.js:233-234`):
```js
if (cmdEntry.takesId) {
    if (resolvedId !== undefined) cmdEntry.fn(resolvedId);
    // If resolvedId is undefined (no company typed), fn is never called → silent no-op
}
```
`SHORT` is registered with `takesId: true`. Typing "SHORT" with no company identifier results in
`resolvedId = undefined` → function is never called. **This is the silent no-op.** Typing
"SHORT NCHE" (or any recognized symbol) does call `shortStock(resolvedId)`.

### Scenario B: Short Stock button disabled when not acting as human player

```js
// useActionButtonProps.js:130-134
const canShortStockDisabled =
    isActingAsETFAdvisor ? "ETFs cannot short stocks"
    : actingAsId !== api.HUMAN1_ID   // HUMAN1_ID = 2
        ? `Only players can short stocks. Click to act as ${playerName}`
        : false;
```
`api.HUMAN1_ID = 2`. The button is disabled whenever `actingAsId` (from `gameState.actingAsId`) is
not 2. If the user is currently acting as a corporation (e.g., previously clicked "Act As USHIBA"),
the button shows the disabled tooltip on click but does not short anything.

### Scenario C: Short Stock button when enabled — should show selection modal

When enabled (actingAsId = 2, HUMAN1_ID), clicking calls `api.shortStock(actingAs ? 0 : activeEntityNum)`.
On the player portfolio tab: `actingAs = false`, `activeEntityNum = TIMBER entity (= 2 = HUMAN1_ID)`,
so `api.shortStock(2)` fires.

PB handler CASE 80 (`ui.inc`):
```basic
IF IntParam1 < 11 THEN
    SelectResult$ = SelectCompanyModal$("Type in the symbol or name of the company whose stock "
        & CoName$(PlayCo) & " will sell short:", "Short Stock on Behalf of " & CoName$(PlayCo))
    IF SelectResult$ = "" THEN EXIT SELECT
    IntParam1 = VAL(SelectResult$)
END IF
FrontSellShort(IntParam1)
```
Since 2 < 11, the PB game engine displays a company-selection modal. If this modal is not appearing
in Electron, it is a separate modal-intercept issue, not a short stock logic bug.

**Short Stock is not present in PortHoldingsTable** — it would need to be added as a separate row
action with `row.companyId` passed directly (skipping the modal).

**Fix:**
- [x] Document that CommandPrompt `SHORT` requires a company symbol (e.g., "SHORT NCHE") — the silent no-op when no symbol is given is confusing (the existing `[symbol]` hint in the autocomplete list already covers this; no code change needed)
- [x] Add a "Short" button to `PortHoldingsTable` `RowActions` for STOCK rows (where `row.quantity < 100` and `!row.ownerCompanyId`), passing `row.companyId` directly to skip the selection modal
- [ ] Investigate why the SelectCompanyModal triggered by the Short Stock button (Scenario C) may not be surfacing in Electron

---

## Summary Table

| # | Issue | Root Cause | Fix Location |
|---|---|---|---|
| 1 | Options Sell/Exercise | `row.companyId` → should be `row.slot` | `PortHoldingsTable.js:462-467` |
| 2 | Futures/Physical Close/Sell | Events 150/170/190 absent from PB override list; PlayCo& never switched | `ui.inc` (add to CASE), `api.js` (add actingAsId), `PortHoldingsTable.js` |
| 3 | Swap Terminate/Details | Events 724/725 absent from PB override list | `ui.inc` (add to CASE), `api.js` (add actingAsId), `PortHoldingsTable.js` |
| 4 | Govt Bond acting-as | No bug — events 125/135 in override, no sell restriction; entity likely had no bonds | None needed |
| 5 | Corp Bond (player) | Intentional game restriction | None — working as designed |
| 6 | Sell Stock wrong actAs | (A) Stale Zustand store (50ms window, no optimistic update); (B) Row confusion in drill-down | (A) Add optimistic `activeEntityNum` update in `setViewAsset`; (B) UX — maybe add clearer Owner column styling |
| 7 | Short Stock does nothing | (A) CommandPrompt requires symbol typed; (B) Disabled if not acting as HUMAN1_ID; (C) Modal may not surface in Electron | (A) UX doc; (B) correct by design; (C) separate modal issue |
