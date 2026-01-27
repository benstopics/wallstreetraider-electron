// Wall Street Raider Tutorial Steps
// Each step contains:
// - id: unique identifier
// - title: step title shown in header
// - content: HTML content for the step
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

export const TUTORIAL_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to Wall Street Raider!',
        content: `
            <p>Welcome to the world of high-stakes finance! This tutorial will teach you the fundamentals of building your financial empire.</p>
            <p><strong>Goal:</strong> Learn to research companies, make investments, and eventually take control of corporations to maximize your wealth.</p>
            <p class="tutorial-tip">You can pause this tutorial at any time by pressing Escape, and resume later from the Toolbar.</p>
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
        id: 'balance-sheet',
        title: 'Your Starting Position',
        content: `
            <p>You start with <strong>$100 billion</strong> in Treasury Bills (T-bills). This is your investment capital.</p>
            <p>Your Balance Sheet shows:</p>
            <ul>
                <li><strong>Cash:</strong> Immediate funds (earns no interest)</li>
                <li><strong>Other Assets:</strong> T-bills, stocks, bonds</li>
                <li><strong>Net Worth:</strong> Your total wealth - grow this!</li>
            </ul>
            <p class="tutorial-tip">T-bills are safe and earn interest, but stocks offer much higher growth potential.</p>
        `,
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
            <p>Click <strong>Market Reports</strong> to see industry performance and find promising sectors.</p>
            <p class="tutorial-tip">Look for industries with strong growth rates and high profitability - these make good investment targets.</p>
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
        id: 'industry-selection',
        title: 'Exploring Industries',
        content: `
            <p>You're now viewing the Market Reports. You'll see tabs for different industries on the left.</p>
            <p>When looking at an industry, check:</p>
            <ul>
                <li><strong>Short-term growth rate:</strong> Immediate momentum</li>
                <li><strong>Long-term growth rate:</strong> Sustained potential</li>
                <li><strong>Return on Assets:</strong> 20%+ is excellent</li>
            </ul>
            <p>Click on any <strong>industry tab</strong> to see the companies within it.</p>
            <p class="tutorial-action"><strong>Action:</strong> Click on an industry tab (e.g., "Airlines", "Banking") to continue.</p>
        `,
        highlightSelector: '[data-tutorial="industry-tabs"]',
        position: 'right',
        helpId: 'chap10_X(D)(9)',
        advanceOn: {
            action: 'viewIndustry',
            // Advances when viewing a specific industry (not the summary)
            state: (gameState) => gameState.currentIndustry > 0
        },
        allowInteraction: true
    },
    {
        id: 'company-selection',
        title: 'Selecting a Company',
        content: `
            <p>You're now viewing companies in an industry. Click on any <strong>company symbol</strong> (like "AAL" or "DAL") to view its detailed profile.</p>
            <p>When comparing companies, consider:</p>
            <ul>
                <li><strong>Stock price trends:</strong> Is it rising or falling?</li>
                <li><strong>Analyst ratings:</strong> BUY or STRONG BUY are favorable</li>
                <li><strong>Market cap:</strong> $500M - $2B is affordable for initial investments</li>
            </ul>
            <p class="tutorial-action"><strong>Action:</strong> Click on a company symbol to continue.</p>
        `,
        highlightSelector: null,
        position: 'center',
        helpId: 'chap10_X(C)',
        advanceOn: {
            action: 'viewCorp'
        },
        allowInteraction: true
    },
    {
        id: 'company-tabs',
        title: 'Company Information Tabs',
        content: `
            <p>You're now viewing a company's profile. Notice the tabs below:</p>
            <ul>
                <li><strong>General:</strong> Overview, stock chart, and analyst ratings</li>
                <li><strong>Earnings:</strong> Quarterly earnings history</li>
                <li><strong>Financials:</strong> Balance sheet and management rating</li>
                <li><strong>Cashflow:</strong> Cash flow projections</li>
            </ul>
            <p>Try clicking on the <strong>Earnings</strong> tab to see the company's earnings history.</p>
            <p class="tutorial-action"><strong>Action:</strong> Click on any company tab to continue.</p>
        `,
        highlightSelector: '[data-tutorial="tab-row"]',
        position: 'bottom',
        helpId: 'chap10_X(D)',
        advanceOn: {
            click: '[data-tutorial^="tab-"]'
        },
        allowInteraction: true
    },
    {
        id: 'buy-stock',
        title: 'Making Your First Investment',
        content: `
            <p>Now let's buy some stock! Find the <strong>Buy Stock</strong> button.</p>
            <p>For your first investment, try buying <strong>5%</strong> or less of the company.</p>
            <p class="tutorial-why"><strong>Why 5%?</strong></p>
            <ul>
                <li>You can buy/sell at market price (no tender offer required)</li>
                <li>Lower risk while learning</li>
                <li>Easy to exit if needed</li>
            </ul>
            <p class="tutorial-tip">Buying over 5% requires a tender offer at a premium price.</p>
            <p class="tutorial-action"><strong>Action:</strong> Click "Buy Stock" to continue.</p>
        `,
        highlightSelector: '[data-tutorial="buy-stock"]',
        position: 'left',
        helpId: 'chap06_VI(B)(1)',
        advanceOn: {
            click: '[data-tutorial="buy-stock"]',
            action: 'buyStock'
        },
        allowInteraction: true,
        sidebarMode: true // Stay visible during buy stock flow
    },
    {
        id: 'buy-stock-confirm',
        title: 'Completing Your Purchase',
        content: `
            <p>A dialog has appeared asking how much stock to buy.</p>
            <p><strong>Enter a percentage</strong> (try 5 or less) and click Submit.</p>
            <p>The transaction will execute at the current market price.</p>
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
        title: 'Understanding Ownership',
        content: `
            <p><strong>Congratulations!</strong> You now own stock in a company.</p>
            <p>Ownership levels matter for what you can do:</p>
            <ul>
                <li><strong>0-5%:</strong> Easy to buy/sell, no control</li>
                <li><strong>5-20%:</strong> Significant stake, still passive</li>
                <li><strong>20%+:</strong> <strong>CONTROL</strong> - you make management decisions!</li>
                <li><strong>51%+:</strong> Majority control</li>
            </ul>
            <p>Controlling a company unlocks powerful management options!</p>
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
        id: 'acting-as-dropdown',
        title: 'The "Acting As" Dropdown',
        content: `
            <p>This dropdown shows who you're currently making decisions for.</p>
            <p>Right now, you're acting as yourself (the player). When you control a company (20%+ ownership), it will appear here.</p>
            <p>Select a company from this dropdown to manage its operations.</p>
            <p class="tutorial-tip">Try clicking it to see your options!</p>
        `,
        highlightSelector: '[data-tutorial="acting-as-dropdown"]',
        position: 'bottom',
        helpId: 'chap03_III(A)',
        advanceOn: null, // Manual advance
        allowInteraction: true
    },
    {
        id: 'taking-control',
        title: 'Taking Control of a Company',
        content: `
            <p>To take control of a company, you need at least <strong>20%</strong> ownership.</p>
            <p><strong>Important:</strong> Buying more than 5% at once requires a tender offer, meaning you'll pay a premium (typically 10-15% above market price).</p>
            <p>The premium is worth it - you gain the power to manage the company!</p>
            <p class="tutorial-tip">Start with a small company (lower market cap) - it's easier to acquire 20%!</p>
        `,
        highlightSelector: null,
        position: 'center',
        helpId: 'chap04_IV(B)',
        advanceOn: null, // Manual advance
        allowInteraction: false
    },
    {
        id: 'control-benefits',
        title: 'Benefits of Control',
        content: `
            <p>When you control a company (20%+ ownership), you can:</p>
            <ul>
                <li>Set growth rates and expansion plans</li>
                <li>Manage R&D and marketing spending</li>
                <li>Buy/sell corporate assets</li>
                <li>Make acquisition decisions</li>
                <li>Set dividend policies</li>
            </ul>
            <p>Use the "Acting As" dropdown to switch to your controlled company, then explore the Cashflow tab for management options.</p>
        `,
        highlightSelector: '[data-tutorial="acting-as-dropdown"]',
        position: 'bottom',
        helpId: 'chap08_VIII(A)',
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
        `,
        highlightSelector: '[data-tutorial="database-search"]',
        position: 'bottom',
        helpId: 'chap10_X(E)(12)',
        advanceOn: null, // Manual advance
        allowInteraction: true
    },
    {
        id: 'complete',
        title: 'Tutorial Complete!',
        content: `
            <p><strong>Congratulations!</strong> You've learned the basics:</p>
            <ul>
                <li>Pausing the game to think strategically</li>
                <li>Researching industries and companies</li>
                <li>Making investments (up to 5% for easy trading)</li>
                <li>Viewing your portfolio</li>
                <li>Taking control of companies (20%+)</li>
            </ul>
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Find a promising company and invest in it</li>
                <li>Build up to 20% ownership to take control</li>
                <li>Explore the Cashflow tab when controlling a company</li>
            </ul>
            <p class="tutorial-tip">Click <strong>Help</strong> anytime for detailed explanations of any feature!</p>
        `,
        highlightSelector: null,
        position: 'center',
        helpId: 'intro',
        advanceOn: null, // End of tutorial
        allowInteraction: false
    }
];

// Map of action names to tutorial step IDs that should advance when that action occurs
export const ACTION_ADVANCE_MAP = {
    'stopTicker': 'pause-game',
    'viewIndustry': ['market-reports', 'industry-selection'],
    'viewCorp': 'company-selection',
    'buyStock': 'buy-stock',
    'viewPlayer': 'view-player'
};

// Get the step index by ID
export function getStepIndexById(id) {
    return TUTORIAL_STEPS.findIndex(step => step.id === id);
}

// Check if an action should advance the tutorial
export function shouldAdvanceOnAction(actionName, currentStepId) {
    const advanceSteps = ACTION_ADVANCE_MAP[actionName];
    if (!advanceSteps) return false;

    if (Array.isArray(advanceSteps)) {
        return advanceSteps.includes(currentStepId);
    }
    return advanceSteps === currentStepId;
}

export default TUTORIAL_STEPS;
