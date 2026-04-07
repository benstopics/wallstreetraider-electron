import { html, useMemo } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import { insertCurrencySymbols } from './helpers.js';
import { TUTORIAL_STEPS } from './TutorialSteps.js';

const SWAP_INFO_TEXT = `
Create interest rate swaps here. Wall Street Raider 
allows you to enter into customized negotiated interest rate
swap derivative contracts, in effect allowing you or your companies
to make huge speculative bets on the future direction of interest
rates, with no up-front payments or investment -- just a lot of
risk, with large potential rewards.

Players or companies with a credit rating of "BBB" or better
and with a net worth of at least $1 billion U.S. (or equivalent)
may enter into interest rate swap agreements with a counterparty,
if a counterparty can be found. The "notional value" of any one
such agreement cannot exceed 10 times the net worth of you or your
company that is seeking to enter into the agreement, or if less, 
$10,000,000 million ($10 trillion) U.S. dollars (or the equivalent
in another currency). The notional value is the amount on which
both the fixed rate of interest and the current rate of interest
are computed at the end of each quarter. The difference in rates,
times the notional value (divided by 4), is paid by one party
to the other each quarter, depending on who is "winning the bet"
at that moment.

You may enter into more than one such swap contract, but not if the
total "notional value" of all your contracts would exceed 10 times
your net worth or $10 trillion, whichever is less. 

The same rules apply to a bank, insurance company, or securities
brokerage that you control. Any other corporation is subject
to all the same requirements but can never have more than one swap
agreement in place at one time.

Each time you enter into a swap agreement, there must be
a "counterparty" taking the other side of the "bet." The
counterparty will generally be a bank, brokerage firm, or
an insurance company. These counterparties, if they have a
"AAA" credit rating, are subject to the same limits on the
size of swaps agreements they can have at any one time. For
such counterparties with credit ratings of AA, A, or BBB,
the multiplier of net worth limit, instead of being 10 times
net worth, is reduced to 8, 5, or 2, respectively, depending
on the credit rating. For any company that is not a bank,
insurance company, or securities brokerage company, the
multiplier is 2 times net worth and such companies may not
become a counterparty if they already have one swap agreement
in place. A counterparty must also have a net worth of at
least $1 billion (U.S.) or the equivalent in any other
currency in order to enter into a swap agreement.

The "long" party to an interest rate swap agrees to receive a
fixed rate of interest from the other party for an agreed
period of time, for up to five years into the future. The
"short" party will, in exchange, receive a variable rate
of interest of the type chosen, which can be the banks' Prime
Rate, or the yield-to-maturity rate on either the long-term
government bond or the short-term government bond. 

The varying rate is determined at the end of each quarter and is
compared to the fixed rate that is to be received by the "long"
party to the swap. If the fixed rate is higher, the net interest
rate differential, as a percentage of the notional principal
amount of the contract, is paid to the "long" party (divided by
4, since there are 4 quarters in a year). If the varying rate is
higher than the fixed rate, the "long" party instead pays the
difference to the "short" party. Interest is calculated on the
agreed "notional" principal amount.

No money changes hands when a swap agreement is entered into.
Instead, one party pays the other party the interest rate
differential at the end of each calendar quarter after the
agreement goes into effect. (When you make an offer, you specify
the quarter and year in which the swap agreement will go into
effect, and when it will end, which can be the same quarter.)

Thus, in effect, if the contract is based on the Prime Rate, the
"long" party is betting that the Prime Rate will fall, while the
"short" party is betting the Prime Rate will rise. Similarly,
if the "bet" is on one of the government bond rates, the
"long" party is betting that interest rate will fall (usually
because the price of the bond is rising) and vice versa in
the case of the "short" party.

Since you will usually be dealing with financial "sharks" (brokers,
insurers, banks), you will seldom be able to enter into a swap
agreement where you actually receive the current Prime Rate as
the"fixed rate," if you are the long party, for example (or the
current Long Bond or Short Bond Rate, if the swap is based on
either of those current rates). For example, if you want to be
"long" on a Prime Rate swap when the Prime is 9%, a bank or
brokerage house may only offer to pay you 8.5% as the fixed
rate, not 9% -- "Take it or leave it."

Or, if you want to be the "short" party when the Prime Rate is
9%, you might have to agree to pay a fixed rate of 9.75% if you
want a counterparty to take your "bet." However, in some rare
cases, a counterparty will accept your offer without making a
counter-offer. (Usually because they know something you don't.)

However, if you control a bank, broker, or insurer that wants
to create a swap, the counteroffer it will be given will still
usually be at a slightly unfavorable fixed rate, but will not
be quite as bad as you or one of your industrial companies will
receive. (Think of it as a "professional courtesy discount" from
one shark to another....)

To create a contract, you must do the following:

  (1) First, select an interest rate on which it will be based
(Prime, Long Bond, or Short Bond Rate);

  (2) Choose whether you want the "long" side of the contract
or the "short" side;

  (3) Enter a notional principal amount (which can't be more
than 10 times your or your company's net worth, or $100,000
million (or the equivalent in the currency in which you are
playing), whichever is less, or you may run afoul of other
limits mentioned above, where you have other existing swap
contracts; and

  (4) Finally, you must select the year and quarter in which the
swap will begin and end, starting no sooner than the next quarter
and ending no later than 5 years after the next quarter. A swap
cannot begin until the next calendar quarter, although it can
begin at a much later date, up to 5 years in the future. Large
swap agreements with a notional value of $10 billion or more
cannot begin later than 4 calendar quarters after the current
quarter.

Once you have entered your desired terms, click on the "OFFER"
button to attempt to find a counterparty. If one is found, it
may accept your terms, but will usually make a counter-offer at
a fixed rate that is lower (if you are the "long" party) or that
is higher than the current rate (if you are the "short" party).
You can either accept a counter-offer, or reject it, if you feel
it is too unfair. (Don't expect any charity, when dealing with
the likes of a Goldman Sachs or a J.P. Morgan. The world of Wall
Street is many things; "fair" is not one of them.)

There are 3 ways a swap contract, once entered into, can terminate:

  (1) By its terms, when it expires;

  (2) Automatically, if either party goes bankrupt, or if a corporate
party becomes insolvent (negative net worth); or

  (3) When you choose an early termination.

At times, when a counterparty is teetering on the edge of bankruptcy
and has little or no cash, it may default on payments it owes you, or
only make partial payments, which is not all bad, since if it made the
full payment and thereby was bankrupted, the contract would be canceled
at that point.

Note that you can choose to terminate a swap contract, but to do
so you must pay the counterparty a termination fee, an amount equal
to at least a half-year's interest rate differential at the rates
then in effect, if the differential is currently unfavorable. (If the
current rate differential is favorable to you, you probably would not
want to terminate the contract!) However, in any case the termination
fee will rarely be less than 0.5% of the notional principal amount the
contract is based upon (or from 1% to as much as 3% if the contract has
more than one year left to run). The longer the remaining term of the
contract, the higher the termination fee, and the longer the commencement
of the the swap is deferred, the higher the termination fee.

As in the real world, these swap agreements are derivative instruments
that do not show up as assets or as liabilities on companies' balance
sheets. As such, they are "weapons of mass financial destruction,"
as Warren Buffett has termed them, which can destroy banks or other
entities that have a large exposure from such derivatives. 

Since you will be betting against the "house," on their terms,
when you enter into a swap agreement, much like playing at a
casino, you should expect to lose much of the time, though you
may occasionally win a jackpot. Think of doing swaps as a last,
desperate resort -- sort of like trying to get out of debt by
going to Las Vegas and trying your luck at the tables.... knowing
that the "house" sets the rules and usually wins.

In the real investment world, the terms of the swap agreements that
a company has entered into are kept secret from investors, generally.
(In W$R, if you control a company, you can view all of its swaps
contracts and their terms by using the swaps submenu "View List of Swap
Contracts" button.) Only a small footnote will appear in a company's
Financial Profile, which only discloses the total "notional amount"
of all such swaps contracts a company has entered into, if any, so
you will have no clue, when reading the company's financial information,
as to whether it is "long" or "short" in such contracts, or whether the
swaps are likely to be profitable or disastrous for the company in
coming periods.

In older versions of the simulation, you also did not know if the
counterparties to any of the company's swaps were likely to go broke
and default on the contracts, even when the company had bet right on
the direction of interest rates, since you could not find out the
identity of the counterparties. (Pretty much like the real world of
Wall Street, eh?)

However, those limits on disclosure all were removed in Version 7.0
of W$R, which added a "Who Owns What?" button to the General Research
Menu, allowing you peek "under the hood" and see a summary of the
terms of all interest rate swap agreements that are currently in
effect, including those where a player is a party to a swap agreement.

Occasionally, you may see a news item or a brief sentence in a Research
Report on a company, stating that it is generating large profits or losses
on interest rate swaps. Otherwise, information on these derivatives
contracts is something you may often overlook, and you can get a rude
surprise when an otherwise profitable company in whose stock you have
invested suddenly reports that it is incurring huge losses on interest
rate swaps, which may go on for years in some cases.

Being aware of that kind of information can be very profitable in
itself. For example, if a company you control has a highly profitable
swap agreement in place, you may want to consider selling short
the stock of the counterparty, which you will know is likely to be
incurring some very large losses under the swap agreement, for as
long as it remains in effect and the terms remain unfavorable to it.`;

// Helper to get current step ID from step index
function getCurrentStepId(tutorialStep) {
    const step = TUTORIAL_STEPS[tutorialStep];
    return step ? step.id : null;
}

// Define tooltip conditions and content
// Each tooltip has:
// - condition: function(gameState) - returns true if tooltip should show
// - title: tooltip title
// - content: static HTML content
// - tutorialStepId: (optional) step ID where tutorial-specific advice applies
// - tutorialAdvice: (optional) tutorial-specific advice shown only when on that step
const TUTORIAL_TOOLTIPS = [
    // ==================== EXISTING TOOLTIPS ====================
    {
        id: 'buy-from-related-entity',
        condition: (gameState) => {
            return gameState.modalTitle && gameState.modalType > 0 &&
                   gameState.modalTitle.includes('Buy from Related or Uncontrolled Entity');
        },
        title: 'Buying from Institutional Shareholders',
        content: `
            <p>This dialog appears because <strong>other companies own shares</strong> in the stock you're trying to buy.</p>
            <p style="margin-top: 10px;"><strong>Click "Yes"</strong> if you want to buy shares directly from these institutional shareholders instead of on the open market. Reasons to do this:</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li>Hostile takeover - you need to acquire shares from resistant owners</li>
                <li>Gaining control - you need their shares to reach majority ownership</li>
                <li>Getting institutions out of the picture</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Click "No"</strong> to buy shares on the open market instead.</p>
            <p style="margin-top: 10px;"><em>Note: Institutional shareholders typically demand a premium above market price, which may be cost-prohibitive.</em></p>
        `,
        tutorialStepId: 'buy-stock-confirm',
        tutorialAdvice: `Click <strong>"No"</strong> to buy shares on the open market.`
    },
    {
        id: 'offer-assets-for-sale',
        condition: (gameState) => {
            return gameState.modalTitle && gameState.modalType > 0 &&
                   (gameState.modalTitle.includes('Offer of Assets for Sale') ||
                    gameState.modalTitle.includes('Asset Sale by'));
        },
        title: 'Offer To Sell Assets vs. Direct Sale',
        content: `
            <p>You're offering corporate assets for sale at a <strong>5% discount from book value</strong>. Here's why this is usually better than a direct "Sell Corporate Assets" transaction:</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>No 10% sales commission</strong> — direct asset sales cost you 10% in commissions. Posting an offer costs nothing.</li>
                <li><strong>Net 5% better price</strong> — even at the 5% discount, you keep 95 cents on the dollar vs. only 90 cents after commission on a direct sale.</li>
                <li><strong>Doesn't use a transaction</strong> — posting the offer is free. Only counts as a transaction if a buyer actually accepts.</li>
            </ul>
            <p style="margin-top: 8px;"><strong>The catch:</strong> There's no guarantee a buyer will accept before the offer expires (end of current or next quarter). Only companies in the same industry group or holding/trading companies can accept.</p>
            <p style="margin-top: 8px;"><em>If you need cash immediately, use "Sell Corporate Assets" instead. If you can wait a quarter, the offer route nets you more.</em></p>
        `
    },
    {
        id: 'interest-rate-swaps',
        condition: (gameState) => gameState.modalType === 7,
        title: 'Interest Rate Swaps',
        content: `<div style="max-height: 400px; overflow-y: auto; font-size: var(--font-size-sm); line-height: 1.4;">${SWAP_INFO_TEXT.replaceAll('\n\n', '<<PARA>>').replaceAll('\n', ' ').replaceAll('<<PARA>>', '<br><br>')}</div>`
    },

    // ==================== PRIORITY 1: HIGH IMPACT ====================

    {
        id: 'merger-premium-pct',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Merger Premium'),
        title: 'Merger Premium',
        content: `
            <p>The <strong>merger premium</strong> is the percentage above the target company's current stock price that you're offering to pay.</p>
            <p style="margin-top: 8px;">For example, if the stock trades at $50 and you offer a 20% premium, you're offering $60 per share.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Higher premium</strong> = more likely the target's board will accept, but costs more</li>
                <li><strong>Lower premium</strong> = cheaper, but more likely to be rejected</li>
                <li><strong>Typical range</strong>: 10-40% in real-world M&A deals</li>
            </ul>
            <p style="margin-top: 8px;">The target's board of directors will vote on whether to accept. They consider the premium, the company's prospects, and whether shareholders would benefit. A very low premium may trigger a rejection or even a competing bid.</p>
            <p style="margin-top: 8px;"><em>Tip: If the target company is financially distressed, a lower premium may suffice. Healthy, growing companies typically demand higher premiums.</em></p>
        `
    },
    {
        id: 'stock-transaction-financing',
        condition: (gs) => gs.modalType > 0 && gs.modalTitle && gs.modalTitle.includes('Transaction Financing'),
        title: 'Transaction Financing',
        content: `
            <p>You don't have enough cash to complete this purchase outright. This dialog asks whether you want to <strong>borrow on your line of credit</strong> to cover the shortfall.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Yes</strong>: Borrow the difference. Increases your debt and leverage ratio</li>
                <li><strong>No</strong>: Cancel the transaction entirely</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Risks of borrowing:</strong></p>
            <ul style="margin: 4px 0 8px 20px; list-style-type: disc;">
                <li>Higher debt-to-equity ratio may lower your credit rating</li>
                <li>Interest payments reduce future cash flow</li>
                <li>If the investment loses value, you still owe the debt</li>
                <li>Excessive leverage can lead to margin calls or forced liquidation</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: Using leverage (borrowed money) amplifies both gains and losses. Borrow only if you're confident in the investment.</em></p>
        `
    },
    {
        id: 'tax-free-liquidation',
        condition: (gs) => gs.modalType > 0 && gs.modalTitle && (
            gs.modalTitle.includes('Tax-Free Liquidation') || gs.modalTitle.includes('Tax Benefits')
        ),
        title: 'Tax-Free Liquidation',
        content: `
            <p>A <strong>tax-free liquidation</strong> dissolves a subsidiary and merges all its assets and liabilities into the parent company, without triggering a taxable event.</p>
            <p style="margin-top: 8px;"><strong>When this makes sense:</strong></p>
            <ul style="margin: 4px 0 8px 20px; list-style-type: disc;">
                <li>The subsidiary has valuable assets you want in the parent</li>
                <li>Simplifying your corporate structure (fewer entities to manage)</li>
                <li>The subsidiary has tax losses that can offset the parent's income</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Caution:</strong></p>
            <ul style="margin: 4px 0 8px 20px; list-style-type: disc;">
                <li>You must own enough of the subsidiary (typically 80%+) for tax-free treatment</li>
                <li>The subsidiary ceases to exist; its stock is cancelled</li>
                <li>All debts of the subsidiary become your parent company's responsibility</li>
            </ul>
        `
    },
    {
        id: 'form-advanced-options',
        condition: (gs) => gs.modalType === 6,
        title: 'Advanced Options Strategies',
        content: `
            <p>This form lets you construct <strong>multi-leg options strategies</strong> that combine calls and puts at different strike prices and expirations.</p>
            <p style="margin-top: 8px;"><strong>Common strategies:</strong></p>
            <ul style="margin: 4px 0 8px 20px; list-style-type: disc;">
                <li><strong>Straddle</strong>: Buy both a call and put at the same strike. Profits from large moves in either direction</li>
                <li><strong>Strangle</strong>: Similar to straddle but with different strikes. Cheaper, but needs a bigger move to profit</li>
                <li><strong>Bull/Bear Spread</strong>: Buy and sell options at different strikes. Limits both profit and loss</li>
                <li><strong>Butterfly</strong>: Three strikes, profits when stock stays near the middle strike</li>
                <li><strong>Condor</strong>: Four strikes, profits when stock stays in a range</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Key concepts:</strong></p>
            <ul style="margin: 4px 0 8px 20px; list-style-type: disc;">
                <li><strong>Strike price</strong>: Price at which the option can be exercised</li>
                <li><strong>In the money</strong>: Call strike below stock price (or put strike above)</li>
                <li><strong>Premium</strong>: Price you pay for the option (affected by time to expiry and volatility)</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: Selling (writing) options generates income but creates unlimited potential losses for naked calls. Always understand your maximum loss before entering a position.</em></p>
        `
    },
    {
        id: 'form-bank-allocation',
        condition: (gs) => gs.modalType === 10,
        title: 'Bank Asset Allocation',
        content: `
            <p>As a bank's controlling shareholder, you decide how to allocate the bank's lending portfolio across different categories.</p>
            <p style="margin-top: 8px;"><strong>Allocation categories:</strong></p>
            <ul style="margin: 4px 0 8px 20px; list-style-type: disc;">
                <li><strong>Prime loans</strong>: Safest, lowest returns. Loans to high-quality borrowers</li>
                <li><strong>Subprime loans</strong>: Higher risk, higher returns. More defaults but better margins</li>
                <li><strong>Consumer loans</strong>: Personal and credit card loans. Moderate risk and return</li>
                <li><strong>Mortgage loans</strong>: Real estate-backed. Sensitive to interest rate changes and housing market</li>
                <li><strong>Cash equivalents/T-bills</strong>: Safest, lowest return. Required for regulatory capital</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Percentages must total 100%.</strong> Banks with too much in risky categories may face regulatory intervention or suffer heavy losses during economic downturns.</p>
            <p style="margin-top: 8px;"><em>Tip: Maintain a balanced portfolio. Heavy subprime concentration can generate great returns in good times but catastrophic losses in a recession.</em></p>
        `
    },
    {
        id: 'greenmail-pct',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Greenmail'),
        title: 'Greenmail',
        content: `
            <p><strong>Greenmail</strong> is a controversial corporate tactic where you acquire a significant stake in a target company, then pressure it to buy back your shares at a premium.</p>
            <p style="margin-top: 8px;"><strong>How it works:</strong></p>
            <ol style="margin: 4px 0 8px 20px; list-style-type: decimal;">
                <li>Accumulate shares in the target company</li>
                <li>Threaten a hostile takeover or proxy fight</li>
                <li>The target pays a premium to buy back your shares and make you go away</li>
            </ol>
            <p style="margin-top: 8px;">Enter the <strong>percentage of the target's shares</strong> you want to demand they repurchase. The target may accept, negotiate, or refuse outright.</p>
            <p style="margin-top: 8px;"><em>Named by combining "greenback" (money) with "blackmail." While legal, greenmail is widely criticized and some companies have adopted anti-greenmail charter provisions.</em></p>
        `
    },
    {
        id: 'lbo-pct',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('LBO'),
        title: 'Leveraged Buyout (LBO)',
        content: `
            <p>A <strong>leveraged buyout</strong> uses primarily borrowed money (debt) to acquire a company. The target company's own assets and cash flows are used as collateral for the loans.</p>
            <p style="margin-top: 8px;"><strong>How it works:</strong></p>
            <ol style="margin: 4px 0 8px 20px; list-style-type: decimal;">
                <li>You put up a small amount of equity (your own money)</li>
                <li>Borrow the rest from banks and bond markets</li>
                <li>Use the combined funds to buy out all other shareholders</li>
                <li>The acquired company's cash flow services the debt</li>
            </ol>
            <p style="margin-top: 8px;"><strong>Risks:</strong></p>
            <ul style="margin: 4px 0 8px 20px; list-style-type: disc;">
                <li>Heavy debt burden can crush the company if earnings decline</li>
                <li>Interest rate increases make debt payments more expensive</li>
                <li>If the company can't service its debt, bankruptcy follows</li>
            </ul>
            <p style="margin-top: 8px;"><em>Famous LBOs: RJR Nabisco (1989, $25 billion), the inspiration for "Barbarians at the Gate."</em></p>
        `
    },

    // ==================== PRIORITY 2: MEDIUM IMPACT ====================

    {
        id: 'stock-purchase-pct',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Stock Purchase'),
        title: 'Stock Purchase',
        content: `
            <p>Enter the <strong>percentage of outstanding shares</strong> you want to buy, not a dollar amount.</p>
            <p style="margin-top: 8px;">For example, entering "5%" means you want to buy 5% of all shares that exist for this company. The total cost depends on the current stock price and number of shares outstanding.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Small purchases</strong> (1-5%): Minimal market impact, good for building a position gradually</li>
                <li><strong>Large purchases</strong> (10%+): May drive the price up significantly; SEC reporting requirements kick in at 5% ownership</li>
                <li><strong>Control threshold</strong>: 50%+ gives you voting control of the company</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: Very large buy orders may not be fully filled if there aren't enough shares available on the market.</em></p>
        `
    },
    {
        id: 'stock-sale-pct',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Stock Sale'),
        title: 'Stock Sale',
        content: `
            <p>Enter the <strong>percentage of your holdings</strong> you want to sell.</p>
            <p style="margin-top: 8px;">For example, if you own 1,000,000 shares and enter "50%", you'll sell 500,000 shares.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li>Large sales may depress the stock price</li>
                <li>Selling below 50% ownership means losing control of the company</li>
                <li>Short-term gains (held less than 1 year) are taxed at a higher rate</li>
            </ul>
        `
    },
    {
        id: 'stock-tender-offer-premium',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Tender Offer Premium'),
        title: 'Tender Offer',
        content: `
            <p>A <strong>tender offer</strong> is a public bid to buy shares directly from all shareholders at a specified price, bypassing the open market.</p>
            <p style="margin-top: 8px;">The <strong>premium</strong> is how much above the current market price you're willing to pay. A higher premium attracts more shareholders to tender (sell) their shares to you.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>vs. Open market</strong>: Tender offers are faster for acquiring large blocks but more expensive</li>
                <li><strong>Typical premiums</strong>: 10-30% above market price</li>
                <li>All shares are purchased at the same price (the tender price)</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: Tender offers are especially useful for hostile takeovers when you want to acquire shares directly from shareholders without board approval.</em></p>
        `
    },
    {
        id: 'spinoff-pct',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Spin Off'),
        title: 'Spin-Off',
        content: `
            <p>A <strong>spin-off</strong> creates a new, independent company by distributing shares of a subsidiary to existing shareholders.</p>
            <p style="margin-top: 8px;">Enter the <strong>percentage of the subsidiary's stock</strong> to distribute. Shareholders of the parent receive proportional shares of the new company.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>100% spin-off</strong>: Complete separation; parent retains no ownership</li>
                <li><strong>Partial spin-off</strong>: Parent keeps some ownership stake</li>
                <li>Spin-offs are typically tax-free for shareholders</li>
            </ul>
            <p style="margin-top: 8px;"><em>Why spin off? "Unlocking value" when a subsidiary's worth isn't reflected in the parent's stock price, or when the businesses have different growth profiles.</em></p>
        `
    },
    {
        id: 'capital-contrib-type',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Contribution of Capital'),
        title: 'Capital Contribution',
        content: `
            <p>You're contributing capital from a parent company to a subsidiary. Choose the <strong>type of contribution</strong>:</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Cash</strong>: Direct cash transfer. Simplest option, immediately usable by the subsidiary</li>
                <li><strong>Business Assets</strong>: Transfer physical assets (property, equipment). May have tax implications</li>
                <li><strong>Stock</strong>: Transfer shares of other companies you hold. Useful for portfolio restructuring</li>
                <li><strong>Bonds</strong>: Transfer government or corporate bond holdings</li>
            </ul>
            <p style="margin-top: 8px;">Capital contributions increase the subsidiary's equity without creating debt. Unlike a loan, contributions are not repaid.</p>
        `
    },
    {
        id: 'option-strike-price',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Stock Price ='),
        title: 'Option Strike Price',
        content: `
            <p>The <strong>strike price</strong> is the price at which you can buy (call) or sell (put) the underlying stock when exercising the option.</p>
            <p style="margin-top: 8px;"><strong>For calls (right to buy):</strong></p>
            <ul style="margin: 4px 0 8px 20px; list-style-type: disc;">
                <li><strong>In the money</strong>: Strike below current stock price (has intrinsic value)</li>
                <li><strong>At the money</strong>: Strike equals current stock price</li>
                <li><strong>Out of the money</strong>: Strike above current stock price (cheaper, but riskier)</li>
            </ul>
            <p style="margin-top: 8px;"><strong>For puts (right to sell):</strong> The opposite applies.</p>
            <p style="margin-top: 8px;">The option's price (premium) includes <strong>intrinsic value</strong> (how far in the money) plus <strong>time value</strong> (potential for the stock to move before expiration).</p>
            <p style="margin-top: 8px;"><em>Tip: Out-of-the-money options are cheap but expire worthless more often. In-the-money options cost more but have a better chance of being profitable.</em></p>
        `
    },
    {
        id: 'bond-maturity-change',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Bonds Will Mature'),
        title: 'Bond Maturity',
        content: `
            <p><strong>Bond maturity</strong> is the number of years until the bond's face value is repaid to the bondholder.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Shorter maturity</strong> (1-5 years): Lower yield but less interest rate risk. Easier to refinance</li>
                <li><strong>Longer maturity</strong> (10-30 years): Higher yield but more sensitive to interest rate changes</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Interest rate risk:</strong> When rates rise, existing bond prices fall (more for longer maturities). When rates fall, bond prices rise.</p>
            <p style="margin-top: 8px;"><em>Tip: If you expect interest rates to rise, issue shorter-maturity bonds so you can refinance at better terms sooner.</em></p>
        `
    },
    {
        id: 'select-law-firm',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Law Firm'),
        title: 'Choosing a Law Firm',
        content: `
            <p>Your choice of law firm affects <strong>legal costs and success rates</strong> in lawsuits.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Cheap firm</strong>: Low fees, but lower chance of winning cases</li>
                <li><strong>Average firm</strong>: Balanced cost and competence</li>
                <li><strong>Expensive firm</strong>: High fees, but significantly better odds in court</li>
            </ul>
            <p style="margin-top: 8px;">This affects all your legal proceedings: antitrust suits, harassment suits, and defending against lawsuits filed against you.</p>
            <p style="margin-top: 8px;"><em>Tip: If you plan aggressive legal tactics (antitrust suits, hostile takeovers), invest in a top firm. If you're just defending occasionally, a cheaper firm may suffice.</em></p>
        `
    },
    {
        id: 'etf-reset-mgmt-fee',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Management Fee'),
        title: 'ETF Management Fee',
        content: `
            <p>As the fund's adviser, you earn a <strong>management fee</strong> (a percentage of assets under management) each quarter.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Higher fee</strong>: More income for you, but reduces the fund's net returns for shareholders</li>
                <li><strong>Lower fee</strong>: Less income, but attracts more investors and keeps regulators happy</li>
                <li><strong>Fee limits</strong>: Different fund types have maximum fee caps</li>
            </ul>
            <p style="margin-top: 8px;">After a 2-year measurement period, the fund's performance is reviewed. Poor performance relative to fees may trigger regulatory action or investor flight.</p>
            <p style="margin-top: 8px;"><em>Tip: Typical real-world ETF fees range from 0.03% to 0.75%. Actively managed funds charge more (0.5%-2%).</em></p>
        `
    },
    {
        id: 'commodity-futures',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Futures'),
        title: 'Commodity Futures Trading',
        content: `
            <p><strong>Futures contracts</strong> are agreements to buy or sell a commodity at a predetermined price on a future date.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Going long</strong> (buying): You profit if the commodity price rises</li>
                <li><strong>Going short</strong> (selling): You profit if the commodity price falls</li>
                <li><strong>Contracts</strong>: Each contract represents a fixed quantity of the commodity</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Margin and leverage:</strong> You only put up a fraction of the contract's value (margin). This creates leverage that amplifies both gains and losses.</p>
            <p style="margin-top: 8px;"><strong>Margin calls:</strong> If the market moves against you, you must deposit more funds. If you can't meet a margin call, your positions may be forcibly liquidated.</p>
            <p style="margin-top: 8px;"><em>Warning: Commodity futures are highly leveraged instruments. Losses can exceed your initial investment.</em></p>
        `
    },
    {
        id: 'bond-convertible-price',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Conversion Price'),
        title: 'Convertible Bond Conversion Price',
        content: `
            <p>The <strong>conversion price</strong> determines how many shares of stock each bond can be converted into.</p>
            <p style="margin-top: 8px;">For example, a $1,000 bond with a $50 conversion price converts into 20 shares ($1,000 / $50).</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Lower conversion price</strong>: More shares per bond (more dilutive to existing shareholders), but easier to sell the bonds</li>
                <li><strong>Higher conversion price</strong>: Fewer shares per bond (less dilution), but bonds are less attractive to buyers</li>
                <li><strong>Conversion premium</strong>: Typically 15-30% above current stock price</li>
            </ul>
            <p style="margin-top: 8px;"><em>Convertible bonds pay lower interest rates than regular bonds because of the conversion privilege. They're a way to raise capital that may be less dilutive than a direct stock offering.</em></p>
        `
    },

    // ==================== ADDITIONAL: CORPORATE ACTIONS ====================

    {
        id: 'restructuring-amount',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Restructuring'),
        title: 'Corporate Restructuring',
        content: `
            <p>A <strong>restructuring charge</strong> is a one-time expense for reorganizing the company. This is a write-down that reduces reported earnings but may improve future profitability.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li>Covers costs like layoffs, plant closures, and asset write-downs</li>
                <li>Reduces current earnings but removes drag on future performance</li>
                <li>The stock price may drop initially but recover if the restructuring improves operations</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: Sometimes called a "big bath" when companies take all their bad news at once to reset expectations.</em></p>
        `
    },
    {
        id: 'stock-offering-amount',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Stock Offering'),
        title: 'Public Stock Offering',
        content: `
            <p>Issuing new shares of stock to raise capital. The company sells shares to the public and receives the proceeds (minus underwriting fees).</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Dilution</strong>: Existing shareholders' ownership percentage decreases</li>
                <li><strong>Stock price impact</strong>: New supply of shares typically depresses the price temporarily</li>
                <li><strong>No debt</strong>: Unlike bonds, equity doesn't need to be repaid</li>
            </ul>
            <p style="margin-top: 8px;">The underwriter may reject the offering if market conditions are unfavorable or the offering is too large relative to the company's market capitalization.</p>
        `
    },
    {
        id: 'bond-issue-corporate',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Issue Corporate Bonds'),
        title: 'Issuing Corporate Bonds',
        content: `
            <p><strong>Corporate bonds</strong> are debt instruments. The company borrows money from bond buyers and promises to pay interest (the coupon rate) plus repay the principal at maturity.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Advantages</strong>: No ownership dilution, interest payments are tax-deductible</li>
                <li><strong>Risks</strong>: Fixed obligation regardless of company performance; default leads to bankruptcy</li>
                <li><strong>Credit rating</strong>: Better ratings mean lower interest rates. Poor ratings make bonds expensive</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: Bonds are ideal when you need capital but don't want to dilute ownership. Best issued when interest rates are low.</em></p>
        `
    },
    {
        id: 'capitalize-new-company',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Capitalize New Company'),
        title: 'New Company Capitalization',
        content: `
            <p>Set the <strong>initial capital</strong> for your new startup company. This is the cash the company will have to begin operations.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>More capital</strong>: Stronger balance sheet, easier to get loans, more room to grow</li>
                <li><strong>Less capital</strong>: Preserves your personal cash, but the company may struggle initially</li>
            </ul>
            <p style="margin-top: 8px;">The company will issue shares based on this capitalization. You'll own 100% initially, but you can later sell shares to the public via a stock offering.</p>
        `
    },
    {
        id: 'extraordinary-dividend',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Extraordinary Dividend'),
        title: 'Extraordinary Dividend',
        content: `
            <p>An <strong>extraordinary (special) dividend</strong> is a one-time cash payment to shareholders, separate from the regular dividend.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li>Typically paid when a company has excess cash it doesn't need for operations</li>
                <li>Reduces the company's cash reserves by the total amount paid</li>
                <li>The stock price usually drops by approximately the dividend amount on the ex-date</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: As a controlling shareholder, declaring a large extraordinary dividend is a way to extract cash from the company. But be careful not to leave it undercapitalized.</em></p>
        `
    },
    {
        id: 'stock-split-ratio',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Stock Split'),
        title: 'Stock Split',
        content: `
            <p>A <strong>stock split</strong> divides existing shares into more shares at a proportionally lower price. A <strong>reverse split</strong> combines shares into fewer shares at a higher price.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Forward split</strong> (e.g., 2:1): Each share becomes 2 shares at half the price. Makes shares more affordable for retail investors</li>
                <li><strong>Reverse split</strong> (e.g., 1:5): Every 5 shares become 1 share at 5x the price. Often done to avoid delisting due to low stock price</li>
            </ul>
            <p style="margin-top: 8px;">Splits don't change the total value of your holdings or the company's market capitalization. They're purely cosmetic.</p>
        `
    },

    // ==================== ADDITIONAL: BANKING ====================

    {
        id: 'borrow-credit-line',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Line of Credit'),
        title: 'Borrowing on Credit Line',
        content: `
            <p>Your <strong>line of credit</strong> is a pre-approved borrowing limit from your bank. You can draw funds up to this limit as needed.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li>Interest accrues on the borrowed amount</li>
                <li>Your credit limit depends on your net worth and credit rating</li>
                <li>Excessive borrowing reduces your credit rating</li>
                <li>If your credit rating drops, your line of credit may be reduced</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: Keep some borrowing capacity in reserve for opportunities or emergencies. Don't max out your credit line.</em></p>
        `
    },
    {
        id: 'advance-funds',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Advance Funds'),
        title: 'Advancing Funds',
        content: `
            <p>You can <strong>advance funds</strong> (make a loan) from your personal account to a company you control. This is different from a capital contribution.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Advance</strong>: Treated as a loan; can be recalled later</li>
                <li><strong>Capital contribution</strong>: Permanent equity; cannot be taken back</li>
                <li>Advances show as debt on the company's balance sheet</li>
            </ul>
            <p style="margin-top: 8px;">You can also <strong>forgive</strong> advances, converting them from debt to equity (effectively a capital contribution after the fact).</p>
        `
    },
    {
        id: 'bank-tbill-trade',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && (
            gs.modalTitle.includes('T-bill') || gs.modalTitle.includes('T-Bill')
        ),
        title: 'Treasury Bill Trading',
        content: `
            <p><strong>Treasury bills (T-bills)</strong> are short-term government securities, considered the safest investment available.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li>Backed by the full faith of the government</li>
                <li>Very liquid; can be bought and sold easily</li>
                <li>Low returns compared to loans or corporate bonds</li>
                <li>Banks hold T-bills as part of their cash equivalents and regulatory capital</li>
            </ul>
            <p style="margin-top: 8px;"><em>For banks: T-bills provide safety and liquidity but earn less than loans. Balance your T-bill holdings against lending opportunities.</em></p>
        `
    },

    // ==================== ADDITIONAL: LEGAL ====================

    {
        id: 'antitrust-damages',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('AntiTrust Damages'),
        title: 'Antitrust Damages',
        content: `
            <p>You're filing an antitrust lawsuit against a competitor. Enter the <strong>amount of damages</strong> you're seeking.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Treble damages</strong>: Under U.S. antitrust law, courts can award 3x the actual damages</li>
                <li><strong>Higher claims</strong>: More potential payout but lower chance of winning the full amount</li>
                <li><strong>Settlement</strong>: Cases often settle before trial for a fraction of the claimed amount</li>
            </ul>
            <p style="margin-top: 8px;">Your law firm quality affects the outcome. The defendant may countersue or try to settle.</p>
            <p style="margin-top: 8px;"><em>Antitrust suits can only be filed against companies in the same industry as your company.</em></p>
        `
    },

    // ==================== ADDITIONAL: BONDS ====================

    {
        id: 'bond-buyback',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Bond Buyback'),
        title: 'Bond Buyback',
        content: `
            <p>A <strong>bond buyback</strong> means repurchasing your company's own outstanding bonds from the market.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Reduces debt</strong>: Lowers total outstanding bonds and future interest payments</li>
                <li><strong>Discount opportunity</strong>: If bonds are trading below face value (e.g., due to market conditions), buying them back at a discount is profitable</li>
                <li><strong>Improves ratios</strong>: Reduces debt-to-equity ratio, may improve credit rating</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: Bond buybacks are especially attractive when your bonds are trading at a steep discount to face value.</em></p>
        `
    },
    {
        id: 'bond-redemption',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Bond Redemption'),
        title: 'Bond Redemption (Calling Bonds)',
        content: `
            <p><strong>Bond redemption</strong> (or "calling" bonds) means paying off bonds before their maturity date at a specified call price.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li>Usually done when interest rates have fallen, allowing the company to refinance at lower rates</li>
                <li>The call price is typically at or slightly above face value (a "call premium")</li>
                <li>Not all bonds are callable; it depends on the terms when issued</li>
            </ul>
        `
    },
    {
        id: 'bond-govt-trade',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('GOVERNMENT') && gs.modalTitle.includes('BONDS'),
        title: 'Government Bond Trading',
        content: `
            <p><strong>Government bonds</strong> are debt securities issued by the government. They come in two main varieties:</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Long bonds</strong>: Higher yield, more sensitive to interest rate changes. Prices rise when rates fall</li>
                <li><strong>Short bonds</strong>: Lower yield, less price volatility. Closer to cash equivalents</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Trading strategy:</strong> Government bonds are often used to bet on interest rate direction. If you expect rates to fall, buy long bonds (their prices will rise). If you expect rates to rise, sell or avoid them.</p>
            <p style="margin-top: 8px;"><em>Government bonds are the safest fixed-income investment, backed by the taxing power of the sovereign government.</em></p>
        `
    },

    // ==================== ADDITIONAL: OPTIONS ====================

    {
        id: 'option-buy-contracts',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && /Buy .+ (Call|Put)/.test(gs.modalTitle),
        title: 'Buying Options',
        content: `
            <p>Enter the <strong>number of option contracts</strong> to buy. Each contract typically represents 100 shares of the underlying stock.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Buying calls</strong>: You profit if the stock price rises above the strike price plus the premium paid</li>
                <li><strong>Buying puts</strong>: You profit if the stock price falls below the strike price minus the premium paid</li>
                <li><strong>Maximum loss</strong>: Limited to the premium paid (the cost of the option)</li>
            </ul>
            <p style="margin-top: 8px;">Options have an <strong>expiration date</strong>. If the option is out of the money at expiration, it expires worthless and you lose 100% of your investment.</p>
        `
    },
    {
        id: 'option-sell-contracts',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && /Sell .+ (Call|Put)/.test(gs.modalTitle),
        title: 'Selling (Writing) Options',
        content: `
            <p>Enter the <strong>number of option contracts</strong> to sell (write). You receive the premium upfront but take on an obligation.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Selling calls</strong>: You must sell shares at the strike price if exercised. <strong>Naked calls have unlimited loss potential</strong></li>
                <li><strong>Selling puts</strong>: You must buy shares at the strike price if exercised. Max loss = strike price x shares</li>
                <li><strong>Covered calls</strong>: If you own the underlying shares, selling calls is less risky (income strategy)</li>
            </ul>
            <p style="margin-top: 8px;"><em>Warning: Writing naked options (without owning the underlying) carries extreme risk and requires significant collateral. Your credit rating must meet minimum requirements.</em></p>
        `
    },

    // ==================== ADDITIONAL: COMMODITY / PHYSICAL ====================

    {
        id: 'physical-commodity',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && (
            gs.modalTitle.includes('Physical') || gs.modalTitle.includes('physical')
        ),
        title: 'Physical Commodity Trading',
        content: `
            <p><strong>Physical commodities</strong> are actual raw materials (gold, oil, etc.) that you purchase for delivery and storage, as opposed to futures contracts.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>No leverage</strong>: You pay the full price upfront (unlike futures which use margin)</li>
                <li><strong>Storage costs</strong>: Physical holdings may incur storage fees</li>
                <li><strong>No expiration</strong>: Unlike futures, you hold physical commodities indefinitely</li>
                <li><strong>Position limits</strong>: Regulatory limits on how much you can hold</li>
            </ul>
            <p style="margin-top: 8px;"><em>Physical commodities are safer than futures (no margin calls) but tie up more capital.</em></p>
        `
    },

    // ==================== ADDITIONAL: ETF ====================

    {
        id: 'etf-seek-adviser',
        condition: (gs) => gs.modalType > 0 && gs.modalTitle && (
            gs.modalTitle.includes('Adviser') || gs.modalTitle.includes('adviser')
        ),
        title: 'ETF Advisory Role',
        content: `
            <p>Becoming an ETF's <strong>investment adviser</strong> gives you control over the fund's investment decisions and earns you a management fee.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li>You earn a percentage of assets under management each quarter</li>
                <li>You control the fund's portfolio (buying/selling holdings)</li>
                <li>Advisory appointments may require a fee to secure</li>
                <li>Poor fund performance may lead to being replaced</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: Managing an ETF is a steady income stream. But if the fund performs poorly, you may lose the advisory role and the fee income that comes with it.</em></p>
        `
    },

    // ==================== ADDITIONAL: GAME LIFECYCLE ====================

    {
        id: 'newgame-computer-players',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('computer player'),
        title: 'Computer Players',
        content: `
            <p>Choose how many <strong>AI-controlled opponents</strong> will compete against you.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Fewer players</strong>: Less competition, more opportunities for you to acquire companies and control industries</li>
                <li><strong>More players</strong>: More realistic market dynamics, more competition for deals, harder to dominate</li>
            </ul>
            <p style="margin-top: 8px;">Computer players actively trade stocks, launch takeovers, file lawsuits, and compete for control of companies just like you do.</p>
        `
    },
    {
        id: 'newgame-currency',
        condition: (gs) => gs.modalType === 3 && gs.modalTitle && gs.modalTitle.includes('Currency'),
        title: 'Currency Selection',
        content: `
            <p>Choose the <strong>base currency</strong> for your game. All monetary values will be displayed in this currency.</p>
            <p style="margin-top: 8px;">This is a cosmetic choice that affects how numbers are displayed. The underlying game mechanics remain the same regardless of currency selection. Exchange rates between currencies fluctuate during the game.</p>
            <p style="margin-top: 8px;"><em>The currency conversion rate can be changed later during the game via the Settings menu.</em></p>
        `
    },
    {
        id: 'form-startup-choices',
        condition: (gs) => gs.modalType === 5,
        title: 'Game Startup Choices',
        content: `
            <p>Configure the starting conditions for your new game.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>Starting money</strong>: How much cash each player begins with. More money = easier start</li>
                <li><strong>Game length</strong>: Number of years the game will run. Longer games allow more complex strategies</li>
                <li><strong>Difficulty</strong>: Affects market volatility, AI aggressiveness, and economic conditions</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: For your first game, use default settings. The standard difficulty provides a balanced experience.</em></p>
        `
    },

    // ==================== ADDITIONAL: COMMON CONFIRMATIONS ====================

    {
        id: 'margin-call',
        condition: (gs) => gs.modalType > 0 && gs.modalTitle && gs.modalTitle.includes('Margin Call'),
        title: 'Margin Call',
        content: `
            <p>A <strong>margin call</strong> means your account has fallen below the minimum required equity. You must deposit additional funds or liquidate positions to meet the requirement.</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li>Caused by losses on leveraged positions (borrowed money)</li>
                <li>If you don't meet the call, positions may be forcibly liquidated at unfavorable prices</li>
                <li>Forced liquidation often locks in losses at the worst possible time</li>
            </ul>
            <p style="margin-top: 8px;"><em>Tip: Avoid margin calls by not over-leveraging. Keep a cash reserve to absorb short-term market swings.</em></p>
        `
    },
    {
        id: 'credit-info',
        condition: (gs) => gs.modalType > 0 && gs.modalTitle && (
            gs.modalTitle.includes('Credit') && gs.modalTitle.includes('Rating')
        ),
        title: 'Credit Rating',
        content: `
            <p>A company's <strong>credit rating</strong> reflects its ability to repay debt, from AAA (highest) to D (default).</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li><strong>AAA-AA</strong>: Investment grade, low borrowing costs</li>
                <li><strong>A-BBB</strong>: Still investment grade but higher rates</li>
                <li><strong>BB and below</strong>: "Junk" bonds; very high borrowing costs, difficulty raising capital</li>
            </ul>
            <p style="margin-top: 8px;">Key factors: debt-to-equity ratio, cash flow, profitability, industry conditions. High leverage (lots of debt) is the fastest way to get downgraded.</p>
        `
    },
];

// Hook to check if a tooltip is active (for use by TutorialModal)
// Tooltips show when tooltipsSetting is enabled OR when tutorial is enabled
export function useActiveTooltip() {
    const gameState = api.useGameStore(s => s.gameState);
    const tooltipsSetting = gameState.tooltipsSetting;
    const tutorialEnabled = gameState.tutorialEnabled;

    return useMemo(() => {
        // Show tooltips if either tooltips setting is on OR tutorial is enabled
        if (!tooltipsSetting && !tutorialEnabled) return null;
        return TUTORIAL_TOOLTIPS.find(tooltip => tooltip.condition(gameState));
    }, [gameState, tooltipsSetting, tutorialEnabled]);
}

export default function TutorialTooltip() {
    const gameState = api.useGameStore(s => s.gameState);
    const activeTooltip = useActiveTooltip();

    if (!activeTooltip) return null;

    // Check if we should show tutorial-specific advice
    const currentStepId = getCurrentStepId(gameState.tutorialStep || 0);
    const showTutorialAdvice = gameState.tutorialEnabled &&
                               activeTooltip.tutorialStepId &&
                               currentStepId === activeTooltip.tutorialStepId;

    return html`
        <div class="tutorial-tooltip-container">
            <div class="tutorial-tooltip-header">
                <span class="tutorial-tooltip-icon">💡</span>
                <h4 class="tutorial-tooltip-title">${insertCurrencySymbols(activeTooltip.title)}</h4>
            </div>
            <div
                class="tutorial-tooltip-content"
                dangerouslySetInnerHTML=${{ __html: activeTooltip.content }}
            ></div>
            ${showTutorialAdvice ? html`
                <div class="tutorial-action" style="margin-top: 14px;">
                    <strong>For this tutorial:</strong> <span dangerouslySetInnerHTML=${{ __html: activeTooltip.tutorialAdvice }}></span>
                </div>
            ` : null}
            <div class="tutorial-tooltip-hint">
                To disable these tips, go to Settings and turn off "Tooltips"
            </div>
        </div>
    `;
}

// Export tooltips array for external use if needed
export { TUTORIAL_TOOLTIPS };
