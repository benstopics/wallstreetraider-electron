// Wall Street Raider Tutorial Steps
// Each step contains:
// - id: unique identifier
// - title: step title shown in header
// - content: HTML content for the step
// - highlightSelector: CSS selector for element to spotlight (null for centered modal)
// - position: 'left', 'right', 'top', 'bottom', or 'center'
// - helpLinks: array of help chapter IDs for "Learn more" links

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
        helpLinks: []
    },
    {
        id: 'pause-game',
        title: 'Pause the Game',
        content: `
            <p>First, let's pause the game so you can learn at your own pace.</p>
            <p>This is the <strong>Pause/Play</strong> button. Click it to stop the simulation.</p>
            <p class="tutorial-tip">The game runs in real-time, so pausing gives you time to make decisions without pressure. You can also press <strong>Spacebar</strong> to toggle pause.</p>
        `,
        highlightSelector: '[data-tutorial="pause-button"]',
        position: 'bottom',
        helpLinks: []
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
        helpLinks: []
    },
    {
        id: 'market-reports',
        title: 'Finding Investment Opportunities',
        content: `
            <p>Before investing, you need to research the market.</p>
            <p>Click <strong>Market Reports</strong> to see industry performance and find promising sectors.</p>
            <p class="tutorial-tip">Look for industries with strong growth rates and high profitability - these make good investment targets.</p>
        `,
        highlightSelector: '[data-tutorial="market-reports"]',
        position: 'bottom',
        helpLinks: []
    },
    {
        id: 'industry-selection',
        title: 'Exploring Industries',
        content: `
            <p>After clicking Market Reports, you'll see a list of industries. When looking at an industry, check:</p>
            <ul>
                <li><strong>Short-term growth rate:</strong> Immediate momentum</li>
                <li><strong>Long-term growth rate:</strong> Sustained potential</li>
                <li><strong>Return on Assets:</strong> 20%+ is excellent</li>
            </ul>
            <p>Click on any industry name to see the companies within it.</p>
            <p class="tutorial-tip">Click "Next" to continue learning while exploring.</p>
        `,
        highlightSelector: null,
        position: 'center',
        helpLinks: []
    },
    {
        id: 'company-analysis',
        title: 'Selecting a Company',
        content: `
            <p>When looking at companies in an industry, consider:</p>
            <ul>
                <li><strong>Stock price trends:</strong> Is it rising or falling?</li>
                <li><strong>Analyst ratings:</strong> BUY or STRONG BUY are favorable</li>
                <li><strong>Market cap:</strong> $500M - $2B is affordable for initial investments</li>
            </ul>
            <p>Click on any company symbol to view its detailed profile.</p>
        `,
        highlightSelector: null,
        position: 'center',
        helpLinks: []
    },
    {
        id: 'company-tabs',
        title: 'Company Information Tabs',
        content: `
            <p>When viewing a company, you'll see several tabs with different information:</p>
            <ul>
                <li><strong>General:</strong> Overview and stock chart</li>
                <li><strong>Earnings:</strong> Quarterly earnings history</li>
                <li><strong>Financials:</strong> Balance sheet and management rating</li>
                <li><strong>Cashflow:</strong> Cash flow projections</li>
            </ul>
            <p>Click these tabs to explore different aspects of a company's performance.</p>
        `,
        highlightSelector: '[data-tutorial="tab-row"]',
        position: 'bottom',
        helpLinks: []
    },
    {
        id: 'buy-stock',
        title: 'Making Your First Investment',
        content: `
            <p>When viewing a company, you can buy its stock using the <strong>Buy Stock</strong> button.</p>
            <p>For your first investment, try buying <strong>5%</strong> or less of the company.</p>
            <p class="tutorial-why"><strong>Why 5%?</strong></p>
            <ul>
                <li>You can buy/sell at market price (no tender offer required)</li>
                <li>Lower risk while learning</li>
                <li>Easy to exit if needed</li>
            </ul>
            <p class="tutorial-tip">Buying over 5% requires a tender offer at a premium price.</p>
        `,
        highlightSelector: '[data-tutorial="buy-stock"]',
        position: 'left',
        helpLinks: []
    },
    {
        id: 'ownership-levels',
        title: 'Understanding Ownership',
        content: `
            <p>After buying stock, you become a shareholder. Ownership levels matter:</p>
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
        helpLinks: []
    },
    {
        id: 'acting-as-dropdown',
        title: 'The "Acting As" Dropdown',
        content: `
            <p>This dropdown shows who you're currently making decisions for.</p>
            <p>Right now, you're acting as yourself (the player). When you control a company (20%+ ownership), it will appear here.</p>
            <p>Select a company from this dropdown to manage its operations.</p>
        `,
        highlightSelector: '[data-tutorial="acting-as-dropdown"]',
        position: 'bottom',
        helpLinks: []
    },
    {
        id: 'taking-control',
        title: 'Taking Control of a Company',
        content: `
            <p>To take control, you need at least <strong>20%</strong> ownership.</p>
            <p><strong>Important:</strong> Buying more than 5% at once requires a tender offer, meaning you'll pay a premium (typically 10-15% above market price).</p>
            <p>The premium is worth it - you gain the power to manage the company!</p>
        `,
        highlightSelector: null,
        position: 'center',
        helpLinks: []
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
            <p>Use the "Acting As" dropdown to switch to your controlled company, then explore the Management options.</p>
        `,
        highlightSelector: '[data-tutorial="acting-as-dropdown"]',
        position: 'bottom',
        helpLinks: []
    },
    {
        id: 'tools-menu',
        title: 'The Tools Menu',
        content: `
            <p>The <strong>Tools</strong> menu provides additional features:</p>
            <ul>
                <li><strong>Database Search:</strong> Find companies matching specific criteria</li>
                <li><strong>Change Law Firm:</strong> Affects transaction success rates</li>
                <li><strong>Toggle Autopilot:</strong> Let the AI manage operations</li>
            </ul>
            <p>Database Search is especially useful for finding undervalued companies!</p>
        `,
        highlightSelector: '[data-tutorial="tools-menu"]',
        position: 'bottom',
        helpLinks: []
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
                <li>Taking control of companies (20%+)</li>
                <li>Managing controlled companies</li>
            </ul>
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Find a promising company and invest in it</li>
                <li>Build up to 20% ownership to take control</li>
                <li>Explore the Management menu when controlling a company</li>
            </ul>
            <p class="tutorial-tip">Click <strong>Help</strong> anytime for detailed explanations of any feature!</p>
        `,
        highlightSelector: null,
        position: 'center',
        helpLinks: []
    }
];

export default TUTORIAL_STEPS;
