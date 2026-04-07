// Wall Street Raider Tutorial Steps
// Each step contains:
// - id: unique identifier
// - title: step title shown in header
// - content: HTML content for the step (static)
// - contentFn: function(gameState) - returns dynamic HTML content based on game state (use instead of content)
// - highlightSelector: CSS selector for element to spotlight (null for centered modal)
// - position: 'left', 'right', 'top', 'bottom', or 'center'
// - helpId: help section ID for "Learn more" link (from HELP_STRUCTURE)
// - advanceOn: object specifying what triggers auto-advancement to next step
//   - click: CSS selector - advances when element matching selector is clicked
//   - action: string - advances when this API action is called (e.g., 'buyStock', 'viewIndustry')
//   - tab: string - advances when this tab is selected
//   - state: function - advances when this returns true based on game state
// - allowInteraction: boolean - if true, user can interact with highlighted element
// - sidebarMode: boolean - if true, tutorial shows in sidebar mode (for transaction flows)

// Helper to format currency amounts nicely (values are in millions)
function formatAmount(millions, dlrSign = '$', euro = '') {
    if (millions >= 1000) {
        const billions = millions / 1000;
        return `${dlrSign}${billions.toLocaleString('en-US', { maximumFractionDigits: 1 })} billion${euro}`;
    }
    return `${dlrSign}${millions.toLocaleString('en-US', { maximumFractionDigits: 0 })} million${euro}`;
}

export const TUTORIAL_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to Wall Street Raider!',
        content: `
            <p>Welcome to the world of high-stakes finance! This tutorial will teach you the fundamentals of building your financial empire.</p>
            <p>All the headlines and numbers you see are reporting on events in a detailed simulation of the real world of economics and finance. This simulation is a living world in which you will operate and compete.</p>
            <p><strong>Goal:</strong> Learn to research companies, make investments, and eventually take control of corporations to maximize your wealth.</p>
            <p class="tutorial-tip">You can pause this tutorial at any time by pressing Escape, and resume later by clicking the <strong>Tutorial</strong> button in the toolbar. Use the <strong>Left/Right Arrow</strong> keys to navigate between steps.</p>
        `,
        highlightSelector: null,
        position: 'center',
        helpId: 'intro',
        advanceOn: null, // Manual advance only
        allowInteraction: false
    },
    {
        id: 'pause-game',
        title: 'Pause the Game',
        content: `
            <p>First, let's pause the game so you can learn at your own pace.</p>
            <p>Click the <strong>Pause/Play</strong> button to stop the simulation.</p>
            <p class="tutorial-tip">The game runs in real-time, so pausing gives you time to make decisions without pressure. You can also press <strong>Spacebar</strong> to toggle pause.</p>
            <p class="tutorial-action"><strong>Action:</strong> Click the pause button to continue.</p>
        `,
        highlightSelector: '[data-tutorial="pause-button"]',
        position: 'bottom',
        helpId: 'chap05_V(D)(2)',
        advanceOn: {
            click: '[data-tutorial="pause-button"]',
            state: (gameState) => !gameState.isTickerRunning
        },
        allowInteraction: true
    },
    {
        id: 'fullscreen-toggle',
        title: 'Toggle Fullscreen',
        content: `
            <p>Before we continue, let's make sure the game looks comfortable on your screen.</p>
            <p>Click the <strong>Fullscreen</strong> button to toggle fullscreen mode on or off.</p>
            <p class="tutorial-tip">You can toggle fullscreen anytime during gameplay.</p>
        `,
        highlightSelector: '[data-tutorial="fullscreen-button"]',
        position: 'bottom',
        helpId: 'chap05_V(D)(2)',
        advanceOn: null, // Manual advance
        allowInteraction: true
    },
    {
        id: 'settings-dropdown',
        title: 'Open Settings',
        content: `
            <p>Now let's adjust the UI zoom level.</p>
            <p>Click the <strong>Settings</strong> button to open the settings menu.</p>
            <p class="tutorial-action"><strong>Action:</strong> Click "Settings" to continue.</p>
        `,
        highlightSelector: '[data-tutorial="settings-dropdown"]',
        position: 'bottom',
        helpId: 'chap05_V(D)(2)',
        advanceOn: {
            click: '[data-tutorial="settings-dropdown"]'
        },
        allowInteraction: true
    },
    {
        id: 'display-settings',
        title: 'Display Settings',
        content: `
            <p>Click <strong>Display</strong> to open the display settings where you can adjust the UI zoom level.</p>
            <p class="tutorial-tip">Zoom in or out to make the interface comfortable for your screen size.</p>
        `,
        highlightSelector: null,
        position: 'left',
        helpId: 'chap05_V(D)(2)',
        advanceOn: null, // Manual advance after they've seen it
        allowInteraction: true,
        sidebarMode: true
    },
    {
        id: 'balance-sheet',
        title: 'Your Starting Position',
        contentFn: (gameState) => {
            const cash = gameState.cash || 0;
            const otherAssets = gameState.otherAssets || 0;
            const totalAssets = cash + otherAssets;
            const sweepEnabled = gameState.sweepSetting;
            const dlrSign = gameState.dlrSign || '$';
            const euro = gameState.euro || '';

            let holdingsText;
            if (cash > 0 && otherAssets === 0) {
                holdingsText = `You currently have <strong>${formatAmount(cash, dlrSign, euro)}</strong> in cash.`;
            } else if (otherAssets > 0 && cash === 0) {
                holdingsText = `You currently have <strong>${formatAmount(otherAssets, dlrSign, euro)}</strong> in Treasury Bills (T-bills).`;
            } else if (cash > 0 && otherAssets > 0) {
                holdingsText = `You currently have <strong>${formatAmount(cash, dlrSign, euro)}</strong> in cash and <strong>${formatAmount(otherAssets, dlrSign, euro)}</strong> in other assets.`;
            } else {
                holdingsText = `You currently have <strong>${formatAmount(totalAssets, dlrSign, euro)}</strong> to invest.`;
            }

            const sweepText = sweepEnabled
                ? `<strong>Sweep</strong> is currently <strong>ON</strong>, which automatically transfers idle cash into T-bills to earn interest (~5%).`
                : `<strong>Sweep</strong> is currently <strong>OFF</strong>. Your cash earns no interest. You can enable Sweep in <strong>Settings</strong> to automatically transfer idle cash into T-bills.`;

            return `
                <p>${holdingsText} This is your investment capital.</p>
                <p>${sweepText}</p>
                <p>Your Balance Sheet shows:</p>
                <ul>
                    <li><strong>Cash:</strong> Immediate funds (earns no interest)</li>
                    <li><strong>Other Assets:</strong> T-bills, stocks, bonds</li>
                    <li><strong>Net Worth:</strong> Your total wealth - grow this!</li>
                </ul>
                <p class="tutorial-tip">T-bills are safe and earn interest, but stocks offer much higher growth potential.</p>
            `;
        },
        highlightSelector: '[data-tutorial="balance-sheet"]',
        position: 'right',
        helpId: 'chap05_V(C)(3)',
        advanceOn: null, // Manual advance
        allowInteraction: false
    },
    {
        id: 'market-reports',
        title: 'Finding Investment Opportunities',
        content: `
            <p>Before investing, you need to research the market.</p>
            <p>Click <strong>Market Reports</strong> to open the research tools.</p>
            <p class="tutorial-action"><strong>Action:</strong> Click "Market Reports" to continue.</p>
        `,
        highlightSelector: '[data-tutorial="market-reports"]',
        position: 'bottom',
        helpId: 'chap10_X(E)',
        advanceOn: {
            click: '[data-tutorial="market-reports"]',
            action: 'viewIndustry'
        },
        allowInteraction: true
    },
    {
        id: 'industry-growth-rates-tab',
        title: 'Market Reports Overview',
        content: `
            <p>You're now in Market Reports. The tabs show different research tools:</p>
            <ul>
                <li><strong>Heat Maps:</strong> Visual overview of market performance</li>
                <li><strong>Industry Growth Rates:</strong> Compare industry growth potential</li>
                <li><strong>Economic Data:</strong> Key economic indicators</li>
                <li><strong>Interest Rates:</strong> Current lending and borrowing rates</li>
                <li><strong>Companies With Most...:</strong> Rankings by market share, cash, etc.</li>
                <li><strong>Who Owns What?:</strong> Ownership of derivatives and stocks</li>
                <li><strong>Who's Ahead?:</strong> Player rankings</li>
            </ul>
            <p>Click the <strong>Industry Growth Rates</strong> tab to find profitable industries.</p>
            <p class="tutorial-action"><strong>Action:</strong> Click "Industry Growth Rates" to continue.</p>
        `,
        highlightSelector: '[data-tutorial="tab-industry-growth-rates"]',
        position: 'bottom',
        helpId: 'chap10_X(E)(2)',
        advanceOn: {
            click: '[data-tutorial="tab-industry-growth-rates"]'
        },
        allowInteraction: true
    },
    {
        id: 'industry-selection',
        title: 'Choosing a Profitable Industry',
        content: `
            <p>This report shows growth rates for all industries. Look for:</p>
            <ul>
                <li><strong>Short-term growth rate:</strong> Recent momentum (higher is better)</li>
                <li><strong>Long-term growth rate:</strong> Sustained potential</li>
            </ul>
            <p><strong>BIOTECHNOLOGY</strong> is excellent for beginners - it typically has high growth rates in both short and long term!</p>
            <p>Click on an <strong>industry name</strong> (like BIOTECHNOLOGY) to see its companies.</p>
            <p class="tutorial-action"><strong>Action:</strong> Click on any industry to continue.</p>
        `,
        highlightSelector: null,
        position: 'center',
        helpId: 'chap10_X(E)(2)',
        advanceOn: {
            action: 'viewIndustry',
            state: (gameState) => gameState.activeIndustryNum > 0
        },
        allowInteraction: true
    },
    {
        id: 'company-selection',
        title: 'Selecting a Company',
        contentFn: (gameState) => {
            // Find the best company to recommend for the tutorial
            // Requirements: 100% publicly owned, not controlled by a corporation, affordable 20% stake
            const allCompanies = gameState.allCompanies || [];
            const reports = [
                ...(gameState.industrySummaryReport || []),
                ...(gameState.industryProjectionReport || [])
            ];
            const playerFunds = ((gameState.cash || 0) + (gameState.otherAssets || 0)) * 1000000;

            // Parse company IDs from reports that are 100% public (no %_C marker means no corporate ownership)
            const publicCompanyIds = new Set();
            reports.forEach(line => {
                if (typeof line !== 'string') return;
                // Skip lines with %_C (has corporate ownership - not 100% public)
                if (line.includes('%_C')) return;
                // Extract company ID from @C followed by digits
                const match = line.match(/@C(\d+)/);
                if (match) {
                    publicCompanyIds.add(parseInt(match[1], 10));
                }
            });

            // Filter companies: 100% public, affordable (can buy 20%), and in current industry
            const activeIndustry = gameState.activeIndustryNum;
            const candidates = allCompanies.filter(company => {
                if (!publicCompanyIds.has(company.id)) return false;
                if (activeIndustry && company.industryId !== activeIndustry) return false;
                const marketCapDollars = company.price * company.outstandingShares;
                const costFor20Percent = marketCapDollars * 0.2;
                return costFor20Percent > 0 && playerFunds >= costFor20Percent;
            });

            // Rank by analyst rating, then by smallest market cap
            const ratingOrder = ['STRONG BUY', 'BUY', 'HOLD', 'SELL', 'STRONG SELL'];
            const getRatingFromReport = (companyId) => {
                for (const line of reports) {
                    if (typeof line !== 'string') continue;
                    if (line.includes(`@C${String(companyId).padStart(4, '0')}`)) {
                        for (const rating of ratingOrder) {
                            if (line.includes(rating)) return ratingOrder.indexOf(rating);
                        }
                    }
                }
                return 999; // Unknown rating
            };

            candidates.sort((a, b) => {
                const ratingA = getRatingFromReport(a.id);
                const ratingB = getRatingFromReport(b.id);
                if (ratingA !== ratingB) return ratingA - ratingB;
                // Tiebreaker: smaller market cap
                return a.marketCap - b.marketCap;
            });

            const recommended = candidates[0];

            // If no suitable company found, tell user to try a different industry
            if (!recommended) {
                return `
                    <p>You're now viewing companies in an industry.</p>
                    <p><strong>No suitable company found in this industry.</strong></p>
                    <p>For this tutorial, you need a company that is:</p>
                    <ul>
                        <li><strong>100% publicly owned</strong> - no corporate controllers</li>
                        <li><strong>Affordable</strong> - you can buy a 20% stake</li>
                    </ul>
                    <p class="tutorial-tip">Go back to <strong>Market Reports</strong> and try a different industry with smaller companies.</p>
                `;
            }

            const marketCapMillions = recommended.marketCap;
            const dlrSign = gameState.dlrSign || '$';
            const euro = gameState.euro || '';
            const formattedCap = marketCapMillions >= 1000
                ? `${dlrSign}${(marketCapMillions / 1000).toFixed(1)}B${euro}`
                : `${dlrSign}${marketCapMillions.toFixed(0)}M${euro}`;

            return `
                <p>You're now viewing companies in an industry. For this tutorial, we're looking for a company you can <strong>take control of</strong>.</p>
                <p>The ideal target is:</p>
                <ul>
                    <li><strong>100% publicly owned</strong> - no corporate controllers blocking you</li>
                    <li><strong>Affordable</strong> - you can buy a 20% controlling stake</li>
                </ul>
                <p class="tutorial-tip"><strong>Recommended:</strong> Click on <strong>${recommended.symbol}</strong> (${recommended.name}) - Market cap: ${formattedCap}. This company is 100% public and you can afford to take control!</p>
                <p class="tutorial-action"><strong>Action:</strong> Click on a company symbol to continue.</p>
            `;
        },
        highlightSelector: null,
        position: 'center',
        helpId: 'chap10_X(C)',
        advanceOn: {
            action: 'viewCorp'
        },
        allowInteraction: true
    },
    {
        id: 'company-financials',
        title: 'Exploring Company Financials',
        content: `
            <p>Let's dig into this company's financial health. Click on the <strong>Financials</strong> tab to see the full picture.</p>
            <p class="tutorial-action"><strong>Action:</strong> Click on the "Financials" tab to continue.</p>
        `,
        highlightSelector: '[data-tutorial="tab-financials"]',
        position: 'bottom',
        helpId: 'chap10_X(D)',
        advanceOn: {
            click: '[data-tutorial="tab-financials"]'
        },
        allowInteraction: true
    },
    {
        id: 'financials-deep-dive',
        title: 'Reading the Balance Sheet',
        content: `
            <p>The Financials tab reveals the company's true financial position. Here's what to look for:</p>
            <p><strong>Balance Sheet Items:</strong></p>
            <ul>
                <li><strong>Cash & Receivables:</strong> Liquid assets for operations and acquisitions</li>
                <li><strong>Inventories:</strong> Goods awaiting sale</li>
                <li><strong>Plant & Equipment:</strong> Physical assets and production capacity</li>
                <li><strong>Goodwill:</strong> Premium paid for past acquisitions</li>
            </ul>
            <p><strong>Liabilities & Equity:</strong></p>
            <ul>
                <li><strong>Accounts Payable:</strong> Short-term obligations</li>
                <li><strong>Long-Term Debt:</strong> Bonds and loans - watch the interest rates!</li>
                <li><strong>Stockholders' Equity:</strong> Book value of all shares</li>
            </ul>
            <p><strong>Financial Ratios:</strong></p>
            <ul>
                <li><strong>Debt/Equity:</strong> Lower is safer - high debt increases bankruptcy risk</li>
                <li><strong>Return on Equity:</strong> Higher means better profitability</li>
                <li><strong>Net Worth Per Share:</strong> Compare to stock price to find bargains</li>
            </ul>
            <p><strong>Credit Info:</strong> Shows credit rating (AAA to D), unused line-of-credit (LOC), and borrowing rate (rates change based on Federal Reserve policy changes to the prime rate).</p>
            <p class="tutorial-tip">Check the <strong>Footnotes</strong> for important details about pending litigation, patents, or other factors affecting value!</p>
        `,
        highlightSelector: null,
        position: 'left',
        helpId: 'chap10_X(D)(3)',
        advanceOn: null,
        allowInteraction: true,
        sidebarMode: true
    },
    {
        id: 'buy-recommendation',
        title: 'Evaluating This Company',
        contentFn: (gameState) => {
            // Currency symbols from game state
            const dlrSign = gameState.dlrSign || '$';
            const euro = gameState.euro || '';

            // Parse data from financialProfile (string array from Financials tab)
            const financialProfile = gameState.financialProfile || [];
            const playerFunds = ((gameState.cash || 0) + (gameState.otherAssets || 0)) * 1000000;

            // Helper to find and parse a line from financialProfile
            const findLine = (searchText) => {
                for (const line of financialProfile) {
                    if (typeof line === 'string' && line.toLowerCase().includes(searchText.toLowerCase())) {
                        return line;
                    }
                }
                return null;
            };

            // Parse Credit Rating (e.g., "Credit Rating: AA")
            let creditRating = null;
            const creditLine = findLine('Credit Rating:');
            if (creditLine) {
                creditRating = creditLine.split(/Credit Rating:/i)[1]?.trim();
            }

            // Parse Public Ownership (e.g., " Public owns:      87 % of the stock")
            let publicOwnership = null;
            const publicLine = findLine('Public owns:');
            if (publicLine) {
                // Handle varying whitespace: " Public owns:      87 % of the stock"
                const match = publicLine.match(/Public owns:\s*(\d+)\s*%/i);
                if (match) publicOwnership = parseFloat(match[1]);
            }

            // Check if controlled by NO ONE (e.g., "Controlled by:    NO ONE")
            let controlledByNoOne = false;
            const controlLine = findLine('Controlled by:');
            if (controlLine && controlLine.toLowerCase().includes('no one')) {
                controlledByNoOne = true;
            }

            // Parse Return on Equity (e.g., "Return on Equity (5): 12%")
            let roe = null;
            const roeLine = findLine('Return on Equity');
            if (roeLine) {
                const match = roeLine.match(/Return on Equity\s*\(\d+\):\s*([\d.-]+)%?/);
                if (match) roe = parseFloat(match[1]);
            }

            // Parse Tax Loss Carryover (e.g., "Tax Loss Carryover: $50M")
            let taxLoss = null;
            const taxLine = findLine('Tax Loss Carryover:');
            if (taxLine) {
                taxLoss = taxLine.split(/Tax Loss Carryover:/i)[1]?.trim();
            }

            // Parse Dividend Payout (e.g., "Dividend Payout Per Share: $1.50")
            let dividend = null;
            const dividendLine = findLine('Dividend Payout Per Share:');
            if (dividendLine) {
                dividend = dividendLine.split(/Dividend Payout Per Share:/i)[1]?.trim();
            }

            // Get market cap from current company
            const allCompanies = gameState.allCompanies || [];
            const activeCorpNum = gameState.activeEntityNum;
            const currentCompany = allCompanies.find(c => c.id === activeCorpNum);

            // First check if player can afford 20% control - this is required for tutorial
            let canAfford20Percent = false;
            let costFor20PercentMillions = 0;
            if (currentCompany) {
                const marketCapDollars = currentCompany.price * currentCompany.outstandingShares;
                const costFor20Percent = marketCapDollars * 0.2;
                costFor20PercentMillions = costFor20Percent / 1000000;
                canAfford20Percent = costFor20PercentMillions > 0 && playerFunds >= costFor20Percent;
            }

            // If player can't afford 20% control, show warning and skip other analysis
            if (!canAfford20Percent) {
                const cost20Formatted = costFor20PercentMillions > 0 ? formatAmount(costFor20PercentMillions, dlrSign, euro) : 'unknown';
                const yourFunds = formatAmount((playerFunds / 1000000), dlrSign, euro);
                return `
                    <p><strong>This company is not ideal for this tutorial.</strong></p>
                    <p>To learn about taking control, you need a company where you can afford a 20% stake.</p>
                    <ul>
                        <li>20% control costs ~${cost20Formatted}</li>
                        <li>You have ${yourFunds}</li>
                    </ul>
                    <p>Go back to <strong>Market Reports</strong> and find a smaller company that's 100% publicly owned and not controlled by anyone.</p>
                    <p class="tutorial-tip">Use the <strong>Previous</strong> button to go back, or click <strong>Market Reports</strong> in the toolbar.</p>
                `;
            }

            const pros = [];
            const cons = [];

            // Credit Rating evaluation (B or higher is favorable)
            if (creditRating) {
                const goodRatings = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B'];
                const badRatings = ['CCC', 'CC', 'C', 'D'];
                if (goodRatings.some(r => creditRating.toUpperCase().startsWith(r))) {
                    pros.push(`Credit Rating: <strong>${creditRating}</strong> - low debt risk`);
                } else if (badRatings.some(r => creditRating.toUpperCase().startsWith(r))) {
                    cons.push(`Credit Rating: <strong>${creditRating}</strong> - high debt risk`);
                }
            }

            // Controlled by NO ONE is a big pro
            if (controlledByNoOne) {
                pros.push(`<strong>Not controlled by anyone</strong> - open for the taking!`);
            }

            // Public Ownership evaluation
            if (publicOwnership !== null) {
                if (publicOwnership >= 100) {
                    pros.push(`<strong>100%</strong> publicly owned - all shares available`);
                } else if (publicOwnership >= 80) {
                    pros.push(`<strong>${publicOwnership}%</strong> publicly owned - easy to accumulate shares`);
                } else if (publicOwnership >= 50) {
                    pros.push(`<strong>${publicOwnership}%</strong> publicly owned - control is still attainable`);
                } else {
                    cons.push(`Only <strong>${publicOwnership}%</strong> publicly owned - insiders control majority`);
                }
            }

            // Return on Equity evaluation
            if (roe !== null) {
                if (roe >= 15) {
                    pros.push(`Return on Equity: <strong>${roe}%</strong> - excellent profitability`);
                } else if (roe >= 10) {
                    pros.push(`Return on Equity: <strong>${roe}%</strong> - good profitability`);
                } else if (roe > 0) {
                    pros.push(`Return on Equity: <strong>${roe}%</strong> - positive ROE`);
                } else if (roe < 0) {
                    cons.push(`Return on Equity: <strong>${roe}%</strong> - losing money`);
                }
            }

            // Tax Loss Carryover evaluation
            if (taxLoss && taxLoss !== '$0' && taxLoss !== '0') {
                pros.push(`Tax Loss Carryover: <strong>${taxLoss}</strong> - reduces future tax liability`);
            }

            // Dividend evaluation (skip if zero)
            if (dividend) {
                const dividendNum = parseFloat(dividend.replace(/[$,]/g, ''));
                if (dividendNum > 0) {
                    pros.push(`Dividend: <strong>${dividend}</strong> per share - provides income`);
                }
            }

            // Market cap and affordability - we know they can afford it if we got here
            if (currentCompany) {
                const marketCapMillions = currentCompany.marketCap;
                pros.push(`You can afford 20% control`);

                if (marketCapMillions < 500) {
                    pros.push(`Small cap (${formatAmount(marketCapMillions, dlrSign, euro)}) - easier to control`);
                } else if (marketCapMillions >= 5000) {
                    cons.push(`Large cap (${formatAmount(marketCapMillions, dlrSign, euro)}) - expensive to control`);
                }
            }

            let prosText = pros.length > 0
                ? `<p><strong>Favorable factors:</strong></p><ul>${pros.map(p => `<li>${p}</li>`).join('')}</ul>`
                : '';
            let consText = cons.length > 0
                ? `<p><strong>Considerations:</strong></p><ul>${cons.map(c => `<li>${c}</li>`).join('')}</ul>`
                : '';

            return `
                <p>Based on the Financials tab, here's what stands out:</p>
                ${prosText}
                ${consText}
                ${pros.length === 0 && cons.length === 0 ? '<p>Take time to review the balance sheet details above.</p>' : ''}
                <p>Ready to invest? Click on the <strong>Overview</strong> tab to access the Buy button.</p>
                <p class="tutorial-action"><strong>Action:</strong> Click on the "Overview" tab to continue.</p>
            `;
        },
        highlightSelector: '[data-tutorial="tab-overview"]',
        position: 'bottom',
        helpId: 'chap10_X(D)',
        advanceOn: {
            click: '[data-tutorial="tab-overview"]'
        },
        allowInteraction: true
    },
    {
        id: 'buy-stock',
        title: 'Taking Control of a Company',
        content: `
            <p>Now let's buy enough stock to <strong>take control</strong>! Click the <strong>Buy Stock</strong> button.</p>
            <p>To control a company, you need at least <strong>20%</strong> ownership.</p>
            <p class="tutorial-why"><strong>Why 20%?</strong></p>
            <ul>
                <li>20%+ ownership gives you <strong>control</strong> of the company</li>
                <li>You can make management decisions, set strategy, and grow the business</li>
                <li>This is the heart of Wall Street Raider!</li>
            </ul>
            <p class="tutorial-tip">Buying more than 5% requires a tender offer at a premium price, but it's worth it for control.</p>
            <p class="tutorial-action"><strong>Action:</strong> Click "Buy Stock" to continue.</p>
        `,
        highlightSelector: '[data-tutorial="buy-stock"]',
        position: 'left',
        helpId: 'chap06_VI(B)(1)',
        advanceOn: {
            action: 'buyStock'
        },
        allowInteraction: true
    },
    {
        id: 'buy-stock-confirm',
        title: 'Completing Your Purchase',
        content: `
            <p>A dialog has appeared asking how much stock to buy.</p>
            <p><strong>Enter 20</strong> (or more) to gain control of this company, then click Submit.</p>
            <p>Since you're buying more than 5%, this will be a tender offer at a premium above market price.</p>
            <p class="tutorial-tip">Watch the Balance Sheet - your T-bills will convert to stock holdings!</p>
        `,
        highlightSelector: null,
        position: 'left',
        helpId: 'chap06_VI(C)',
        advanceOn: {
            // Advances when a stock purchase is completed
            action: 'modalResult',
            state: (gameState, prevState) => {
                // Check if portfolio changed (stock was purchased)
                return gameState.portfolioChanged === true;
            }
        },
        allowInteraction: true,
        sidebarMode: true
    },
    {
        id: 'ownership-levels',
        title: 'You Now Control a Company!',
        content: `
            <p><strong>Congratulations!</strong> You now control this company with 20%+ ownership!</p>
            <p>As the controlling shareholder, you can:</p>
            <ul>
                <li>Set growth rates and expansion plans</li>
                <li>Manage R&D and marketing spending</li>
                <li>Buy/sell corporate assets and make acquisitions</li>
                <li>Set dividend policies</li>
            </ul>
            <p class="tutorial-tip">The "Acting As" dropdown will now show this company - select it to manage operations!</p>
        `,
        highlightSelector: null,
        position: 'center',
        helpId: 'chap03_III(G)',
        advanceOn: null, // Manual advance
        allowInteraction: false
    },
    {
        id: 'view-player',
        title: 'Viewing Your Portfolio',
        content: `
            <p>Let's check your portfolio. Click the <strong>View Player</strong> button to see all your holdings.</p>
            <p>The Player View shows:</p>
            <ul>
                <li><strong>Financials:</strong> Your complete balance sheet</li>
                <li><strong>Stocks & Bonds:</strong> All your investments</li>
                <li><strong>My Corporations:</strong> Companies you control</li>
            </ul>
            <p class="tutorial-action"><strong>Action:</strong> Click "View Player" to continue.</p>
        `,
        highlightSelector: '[data-tutorial="view-player"]',
        position: 'bottom',
        helpId: 'chap05_V(C)(3)',
        advanceOn: {
            click: '[data-tutorial="view-player"]',
            action: 'viewPlayer'
        },
        allowInteraction: true
    },
    {
        id: 'portfolio-tab',
        title: 'Your Stock Portfolio',
        content: `
            <p>Click on the <strong>Stocks & Bonds</strong> tab to see your investments.</p>
            <p>Here you can:</p>
            <ul>
                <li>See all stocks and bonds you own</li>
                <li>View your cost basis and current value</li>
                <li>Sell or buy more of your holdings</li>
            </ul>
            <p class="tutorial-action"><strong>Action:</strong> Click the "Stocks & Bonds" tab to continue.</p>
        `,
        highlightSelector: '[data-tutorial="tab-stocks-bonds"], [data-tutorial="tab-stocks-&-bonds"]',
        position: 'bottom',
        helpId: 'chap10_X(D)(6)',
        advanceOn: {
            click: '[data-tutorial="tab-stocks-bonds"], [data-tutorial="tab-stocks-&-bonds"]'
        },
        allowInteraction: true
    },
    {
        id: 'portfolio-overview',
        title: 'Understanding Your Portfolio',
        content: `
            <p>This is your <strong>Stock & Bond Portfolio</strong>. Here's what each column means:</p>
            <p><strong>Stock Portfolio:</strong></p>
            <ul>
                <li><strong>SYM:</strong> The stock ticker symbol</li>
                <li><strong>PCT% HELD:</strong> Your ownership percentage (20%+ = control!)</li>
                <li><strong>SHARE PRICE:</strong> Current market price per share</li>
                <li><strong>DIV. YIELD:</strong> Annual dividend as % of share price</li>
                <li><strong>VALUE:</strong> Current market value of your holdings (in millions)</li>
                <li><strong>TAX BASIS:</strong> What you paid (used to calculate capital gains)</li>
            </ul>
            <p><strong>Bond Portfolio:</strong> Shows any corporate or government bonds you own, with face value, market value, and credit ratings.</p>
            <p class="tutorial-tip">Click <strong>Sell</strong> next to any holding to sell shares. Click <strong>Spin-Off</strong> to spin off a division (if you control the company).</p>
        `,
        highlightSelector: null,
        position: 'left',
        helpId: 'chap10_X(D)(6)',
        advanceOn: null, // Manual advance
        allowInteraction: true,
        sidebarMode: true
    },
    {
        id: 'acting-as-dropdown',
        title: 'Managing Your Company',
        content: `
            <p>The <strong>"Acting As"</strong> dropdown shows who you're making decisions for.</p>
            <p>Since you now control a company with 20%+ ownership, it appears in this dropdown!</p>
            <p><strong>Try it now:</strong> Click the dropdown and select your company to manage its operations.</p>
            <p class="tutorial-tip">When acting as a company, you can access the Cashflow tab to set growth rates, R&D spending, dividends, and more!</p>
        `,
        highlightSelector: '[data-tutorial="acting-as-dropdown"]',
        position: 'bottom',
        helpId: 'chap03_III(A)',
        advanceOn: null, // Manual advance
        allowInteraction: true
    },
    {
        id: 'view-acting-as',
        title: 'Quick Navigation: View Button',
        content: `
            <p>Notice the <strong>"← View"</strong> button next to the dropdown?</p>
            <p>This button appears whenever you're <strong>acting as</strong> a different entity than the one you're <strong>viewing</strong>.</p>
            <p><strong>Click it</strong> to quickly jump to and view the company you're managing - so you can see their financials, make decisions, and monitor their performance all at once!</p>
            <p class="tutorial-tip">This is very useful when you control multiple companies and need to switch between them quickly.</p>
        `,
        highlightSelector: '[data-tutorial="view-acting-as"]',
        position: 'bottom',
        helpId: 'chap03_III(A)',
        advanceOn: null, // Manual advance
        allowInteraction: true
    },
    {
        id: 'database-search',
        title: 'Database Search',
        content: `
            <p>The <strong>Database Search</strong> tool helps you find specific investment opportunities.</p>
            <p>You can search for companies by:</p>
            <ul>
                <li>Industry, market cap, or stock price</li>
                <li>Financial metrics (P/E ratio, ROA, etc.)</li>
                <li>Ownership levels and control status</li>
            </ul>
            <p>This is especially useful for finding undervalued companies or acquisition targets!</p>
            <p class="tutorial-action"><strong>Action:</strong> Click "Database Search" to continue.</p>
        `,
        highlightSelector: '[data-tutorial="database-search"]',
        position: 'bottom',
        helpId: 'chap10_X(E)(12)',
        advanceOn: {
            click: '[data-tutorial="database-search"]'
        },
        allowInteraction: true
    },
    {
        id: 'complete',
        title: 'Tutorial Complete!',
        content: `
            <p><strong>Congratulations!</strong> You've learned the fundamentals:</p>
            <ul>
                <li>Pausing the game to think strategically</li>
                <li>Researching industries and companies</li>
                <li>Viewing your portfolio</li>
                <li>Taking control of companies (20%+)</li>
            </ul>
            <p><strong>Using the Help System:</strong></p>
            <p>As you explore the simulation, use the <strong>Help</strong> button to search for any unfamiliar term or feature. The Help system provides comprehensive documentation.</p>
            <p><strong>Recommended Reading:</strong></p>
            <ul>
                <li><strong>Basic Strategies</strong> - Investment approaches and profit-making techniques</li>
                <li><strong>Buy/Sell Transactions</strong> - All available trading operations</li>
                <li><strong>Financing Transactions</strong> - Debt, equity, and corporate finance options</li>
                <li><strong>Appendices</strong> - In-depth explanations of the simulation's mechanics</li>
            </ul>
            <p class="tutorial-tip">Wall Street Raider simulates real-world finance and M&A transactions - mastering these mechanics is key to building your empire!</p>
        `,
        highlightSelector: null,
        position: 'center',
        helpId: 'intro',
        advanceOn: null, // End of tutorial
        allowInteraction: false
    }
];

export default TUTORIAL_STEPS;
