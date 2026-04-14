import { html, useState, useEffect, useMemo } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import VideoBackground from './VideoBackground.js';
import { renderMultilineText } from './helpers.js';
import SettingsModal from './SettingsModal.js';
import Button from './Button.js';
import LocalizationDropdown from './LocalizationDropdown.js';
import localeManager from '../locale/localeManager.js';

// Read version from version.txt (single source of truth)
let APP_VERSION = '10.0.15';
try {
    if (typeof require === 'undefined') throw new Error('no require');
    const _fs = require('fs'), _path = require('path');
    const vFile = _path.join(__dirname, 'version.txt');
    APP_VERSION = _fs.readFileSync(vFile, 'utf8').trim();
} catch (e) { /* fallback to hardcoded */ }

const LOGO_SRC = 'assets/wallstreetraider_logo.png';
const WEBSITE_URL = 'https://wallstreetraider.com';
const REDDIT_URL = 'https://www.reddit.com/r/WallStreetRaider/';
const DISCORD_URL = 'https://discord.com/invite/5ujV5Cp9Ej';
const STEAM_URL = 'https://store.steampowered.com/app/3525620/Wall_Street_Raider/';

// ── Lore snippets from the origin story ──
const LORE_SNIPPETS = [
    "In 1967, a Harvard Law student began filling notebooks with ideas for a board game simulating all of American capitalism. It took 16 years for personal computers to catch up with his vision.",
    "A Disney game studio tried for over a year with a team in Armenia. Commodore mailed the source code back after three months. For 40 years, the code was indecipherable to anyone but its creator.",
    'A hedge fund manager wrote: "I played Wall Street Raider for years and started doing what I\'d been doing in the game with my real clients." His Price Waterhouse audited 10-year return: 44% compounded annually.',
    "At 3 AM, Jenkins would race to encode financial logic before understanding slipped away. The result: code that worked perfectly for decades, yet even he no longer fully comprehended.",
    "Over 200 CEOs and investment bankers have credited Wall Street Raider with shaping their careers \u2014 from a teenager in the Philippines playing the free demo to a forex trader at Morgan Stanley in Shanghai.",
    '115,000 lines of code written by forty distinct versions of Michael Jenkins, competing across four decades, governed by what one developer described as "laws written on top of laws that were interpreted wrong."',
    "A player from the Philippines: \"I've been playing since I was 13, living in a third world country. Couldn't even afford the full version. I played the two-year demo for years. It taught me so much that now I'm working for Morgan Stanley.\"",
    'In 1983, Jenkins sat at a Kaypro computer with a five-inch screen, typed 10 PRINT "HELLO", and realized: "This isn\'t that complicated." He stayed up until 5 AM writing code. Four decades later, he still hadn\'t stopped.',
];

// ── Changelog data ──
const CHANGELOG = [
    {
        ver: "v10.0.15",
        sections: [
            {
                heading: "New Features",
                items: [
                    "Price Alerts \u2014 set high/low thresholds on any stock, commodity, or rate; alerts fire as toast notifications and persist across sessions",
                    "Clear Chart History \u2014 button on company view to wipe price chart data for the current entity",
                    "Company Target Picker \u2014 Merger, Greenmail, LBO, Lawsuits, and Spread Rumors now open a searchable company selector instead of acting on the viewed entity",
                    "Acting-As Picker \u2014 trade actions on non-controlled companies prompt \"Who is performing this action?\" with player and controlled company choices",
                    "Interactive Tutorial system \u2014 guided walkthrough tooltips for new players",
                    "My News filter in Business/World News \u2014 toggle to show only headlines affecting your controlled companies",
                    "Who Owns filter \u2014 filter shareholders list by sector, entity type, or ownership percentage",
                    "Expandable full-screen charts \u2014 click expand icon on any price chart for a larger view",
                    "Streaming Quotes toolbar: Fill, Clear, and Alerts buttons in panel header",
                    "About dialog with version info, credits, and links accessible from main menu",
                    "Scoreboard button in toolbar for quick access to player rankings",
                    "Growth Throttle control in Settings \u2014 adjust economic growth speed",
                    "Become ETF Advisor action for eligible player entities",
                    "Auto-Add to Streaming Quotes option \u2014 automatically adds viewed companies to ticker",
                    "Database Search remembers last query and auto-saves results between sessions",
                    "Bond Yield-to-Maturity column in portfolio bond listings",
                    "Last Entity / Last Industry quick-nav buttons in navigation panel",
                ]
            },
            {
                heading: "UI/UX Improvements",
                items: [
                    "ActionBar restructured \u2014 streamlined to Corporate and Hostile dropdowns; entity label shows what you're viewing",
                    "Hotkey labels always visible \u2014 tab letters, button numbers, and navigation badges no longer hidden behind Shift",
                    "Reduced Shift+letter conflicts \u2014 only Shift+C (Corporate) and Shift+H (Hostile) remain, freeing capital letters for typing",
                    "Elect as CEO moved from button bar to Corporate dropdown to reduce button wrapping",
                    "Responsive toolbar layout \u2014 toolbar items wrap cleanly at smaller window sizes",
                    "Navigation panel redesigned: history managed server-side, back/forward no longer causes UI freezes",
                    "Chart rendering improvements: better axis labels, tooltip formatting, and color consistency",
                    "Currency denomination support throughout all financial displays and reports",
                    "Improved modal sizing and positioning for text-heavy dialogs",
                    "Streaming Quotes panel: duplicate ticker prevention, better add/remove flow",
                    "Portfolio view column alignment and number formatting improvements",
                    "Settings panel reorganized with clearer section grouping",
                    "Close button added to Price Alerts modal",
                ]
            },
            {
                heading: "Bug Fixes",
                items: [
                    "Fix Merger not working \u2014 reworked to use target company picker with proper entity switching in PB bridge",
                    "Fix Harassing Lawsuit not working \u2014 now uses target picker instead of acting on viewed entity",
                    "Fix Spread Rumors not working \u2014 now uses target picker instead of acting on viewed entity",
                    "Fix Antitrust and other lawsuit buttons not functioning under Hostile dropdown",
                    "Fix Merger \"can't merge with itself\" error \u2014 target picker filters out controlled companies",
                    "Fix \"must be acting as this company\" merger error \u2014 PB bridge now saves/restores ActvEntyNum",
                    "Fix Greenmail & LBO incorrectly clickable when acting as Player \u2014 now properly disabled",
                    "Fix Browse for Sale Items missing on Player Cashflow tab",
                    "Fix hotkey 0 not triggering 10th button (e.g., Restructure)",
                    "Fix single-letter stock symbols incorrectly triggering hyperlink detection in news text",
                    "Fix industry alias names not hyperlinking correctly in news headlines",
                    "Fix Acting As entity not tracking correctly after navigation changes",
                    "Fix excessive re-renders during game state polling causing UI lag",
                    "Fix Advanced Options calculator entering infinite loop on certain strike prices",
                    "Fix clicking outside modal unintentionally dismissing important dialogs",
                    "Fix Options tab incorrectly restricted for ETF entities",
                    "Fix commodity and crypto trade flows failing when asset id was 0",
                    "Fix ETF company selection modal using legacy Win32 dialog instead of Electron dropdown",
                    "Fix short sale guard condition checking wrong variable in PB bridge",
                    "Fix save directory defaulting to install path instead of user documents",
                    "Fix database search results capped at 200 rows",
                ]
            },
            {
                heading: "Performance & Infrastructure",
                items: [
                    "Adaptive polling \u2014 200ms on main menu, 50ms during gameplay; eliminates per-poll console spam",
                    "Debug logger system for structured diagnostic output without console noise",
                    "IPC mode foundation for future native Electron\u2013engine communication",
                    "hasPublicShares field added to game state for accurate public offering eligibility checks",
                ]
            },
        ]
    },
    {
        ver: "v10.0.14.1",
        sections: [
            {
                heading: "New Features",
                items: [
                    "Disable Hotkeys toggle in Settings \u2192 Keyboard Shortcuts panel",
                    "Portfolio lines are now clickable \u2014 stock and bond rows link to the issuing company without needing explicit hyperlink markers",
                    "Command prompt resolves single-token symbols directly (e.g., type \"AAPL\" to navigate)",
                ]
            },
            {
                heading: "UI/UX Improvements",
                items: [
                    "Swapped Acting As and Viewing rows \u2014 Acting As is now the top row for quicker access",
                    "Text report modals (e.g., Research Report) now use fixed-width pre-formatted layout with horizontal scroll instead of wrapping",
                    "Consistent line-number gutter alignment in selectable portfolio and report views",
                    "Removed pulsing border animation on disabled action buttons",
                ]
            },
            {
                heading: "Performance & Fixes",
                items: [
                    "Stock ticker scrolling now updates DOM directly instead of re-rendering at 50fps",
                    "Spark chart cache bounded to 200 entries to prevent unbounded memory growth",
                    "Fixed useGameStore re-subscribing on every render when using custom selectors",
                    "Cash flow projection content now aligns to top instead of centering vertically",
                ]
            },
        ]
    },
    {
        ver: "v10.0.14",
        sections: [
            {
                heading: "New Features",
                items: [
                    "Keyboard hotkey system with 73 bindings \u2014 hold Shift to see shortcuts on buttons, tabs, and menus. Reference panel in Settings",
                    "Line selection: use number keys to select lines in portfolio views, then letter keys for inline actions (S=Sell, E=Exercise, etc.)",
                    "Cheat Menu accessible from toolbar (Disable Lawsuits, Insider Info, Add/Subtract Cash) \u2014 auto-enables Unethical Scenarios",
                    "Migrate Bank Allocation, Advance Funds, Greenmail, and Planned Tender Offer Premium from Win32 to Electron",
                    "Picture event popups (Black Swan, Ponzi, etc.) now rendered natively instead of launching external PIX.EXE",
                    "Delete saves from Load Game menu, load specific save files by name",
                    "Expanded command prompt with 70+ commands and improved autocomplete",
                    "Smart stock ticker with hover-to-pause",
                ]
            },
            {
                heading: "Gameplay & AI Fixes",
                items: [
                    "AI companies now liquidate T-Bills before borrowing on line of credit",
                    "Fixed Advanced Options validation allowing free options trading via blank/zero strike prices",
                    "Improved options premium messaging \u2014 distinguishes net-credit trades from pure buys/sells",
                    "Interest rate swap expiration date selection now uses dropdowns with all valid expirations",
                    "Confirmation dialog when selling business loans",
                    "Cash flow projections show inline message instead of blocking popup when unavailable",
                ]
            },
            {
                heading: "UI/UX Improvements",
                items: [
                    "Disabled \"Must be acting as...\" buttons now switch Acting Entity when clicked",
                    "Action bar reorganized into Trade (3-col), Corporate, Finance, Hostile, and Banking menus",
                    "Unified navigation panel with back/forward history, Ctrl+J/K to cycle Acting Entity",
                    "Asset price charts optimized with hover crosshair showing date and price",
                    "Currency symbols throughout UI now match selected currency instead of hardcoded USD",
                    "New game modal remembers last used settings; ticker speed saved to config",
                    "Standardized font sizes with CSS variables, toolbar wraps at higher zoom levels",
                    "Modals: Enter submits/closes, auto-focus input, scroll fix, tutorial tooltip overlap fix",
                    "Added Redeem button next to Bonds Due in Financials tab",
                    "Unethical Scenarios togglable in Settings; updated legacy Win32 menu references",
                    "Improved error popup with stack trace for better bug reporting",
                ]
            },
            {
                heading: "Bug Fixes",
                items: [
                    "Fix navigation history arrows freezing game",
                    "Fix startup choices cancel button not working",
                    "Fix Sell Physical/Sell Crypto showing wrong error when player owns physical commodities",
                    "Fix Buy/Sell commodity and crypto flows when no specific asset is pre-selected",
                    "Fix individual autopilot toggle buttons under My Corporations tab",
                    "Fix Business/World News text insert codes, info modal line breaks",
                    "Fix textboxes and graphs rendering on top of settings menu",
                    "Fix notifications bar and market reports scrolling issues",
                    "Fix large cash amounts overflowing 32-bit integers",
                    "Fix game exit/restart lifecycle \u2014 game process stays alive for clean restart",
                    "Fixed database search tool analyst rating was reversed"
                ]
            },
        ]
    },
    {
        ver: "v10.0.13",
        items: [
            "Fix Info modal content not scrolling when too tall",
            "Hide tabs and buttons if active entity is in industry which does not support them",
            "Text/Graph toggle button in Shareholders and My Corporations tab",
            "Advanced Options auto-trade expiration year/month selection is now dropdown of all available expirations",
            "Fix Advanced Options auto-trade setting target as acting company when target was chosen via company select modal",
            "Fix blank options price box in Advanced Options due to white text white background",
            "Symmetrized auto-trade strikes around ATM, narrowed strangles from 23% to 10% OTM for realism, added Bull Put and Bear Put spreads, removed call-only butterfly/condor strategies",
            "Overhauled option pricing model: removed excessive discounts that made puts ~38% underpriced, credit strategies like Iron Butterfly now have realistic risk/reward",
            "Option premiums now adjust based on industry volatility (tech/biotech higher, utilities/packaged foods lower)",
            "Fixed P/L chart calculations for multi-leg options - chart now correctly shows profit/loss at all stock prices",
            "Optimize charts and text reports, remove update throttling"
        ]
    },
    {
        ver: "v10.0.12",
        items: [
            "Can now start game with more than 1 computer player and rename them like normal",
            "Can create new company again",
            "Navigation history saving now",
            "Inline text report buttons (sell, cover, etc. contracts) working again",
            "Fix crash when buying a fourth corporate loan as a bank",
            "Fix Call In loan button logic being inverted (now correctly enabled for BB or worse)",
            "Fix news event popups showing stale data (e.g. Bitcoin options instead of actual event)",
            "Fix scenario event placeholders not being replaced (e.g. @AMOUNT showing instead of dollar value)",
            "Re-organize style sheets and simplify CSS classes, restore button colors",
            "Improve visual accessibility eg. add drop shadow to all text to make it pop, lighten panel background color",
            "Fix startup selecting country other than United States for incorporation",
            "Fix hide tutorial bugging out ticker start/stop",
            "Fix asset price charts show zero in first month of game",
            "Optimize asset price chart data fetching and rendering to be real-time",
            "Remove single-letter translation keys to eliminate confusion",
            "Overhaul ETF view by fixing buttons and adding 'Act As Investment Advisor' functionality",
            "Ability to buy stocks and options of a company without it being the active entity (helpful for ETFs especially)",
            "Migrate Change Bank from Win32 to Electron",
            "When viewing the company you are acting as, the Buy/Sell/Short buttons in General tab now buy on behalf of that company prompt for company selection with advanced search similar to Command Prompt",
            "Restore window minimize/maximize/close buttons on main window",
            "Fix swaps tab incorrectly showing Acting Entity swaps instead of active entity swaps",
            "Fix paragraph separation in text reports and info modals",
            "Replace SWAP INFO button with tooltip",
            "Widen info modals to better fit long lines at higher zoom levels",
            "Fix filter lag in Database Search tool and fix Price-to-Book filter and column",
            "Fix navigation history quirks",
            "Add action bar with submenus for all top-level buttons",
            "New Shareholder Graph can be toggled back to old text report in Settings menu",
        ]
    },
    {
        ver: "v10.0.11",
        items: [
            "Overhaul GUI look and feel with modern styles and improved usability",
            "Submit string input modals with Enter key",
            "Savescumming support (advanced game saving/loading, custom save names, fix exit game)",
            "Fix loan tab softlocking due to syntax error",
            "Major command prompt improvements including autocomplete preview and help text",
            "Market heat maps for companies and sectors",
            "Include industry and market reports pages in navigation history",
            "Changed time-of-day to progress bar to eliminate confusion",
            "Migrate Interest Rate Swaps from Win32 to Electron",
            "Interest Rate Swaps tab for viewing and managing swaps",
            "Fix Earnings popups w/ menu setting",
            "Migrate Advanced Options from Win32 to Electron",
            "Migrate Picklist from Win32 to Electron",
            "Migrate Database Search from Win32 to Electron",
            "Restore and migrate Settings menu to Electron",
            "Migrate Change Law Firm from Win32 to Electron",
            "Migrate Spread Rumors from Win32 to Electron",
            "Migrate Harassing Lawsuit from Win32 to Electron",
            "Migrate Capital Contributions from Win32 to Electron",
            "CustomData API endpoint for mods to store custom game data",
            "Localization support framework",
            "Add Microsoft Visual C++ to Steam Common Redistributables installation list",
            "Migrated Strategy Manual to Help menu",
            "Display settings modal with zoom controls",
            "Fix Unethical Scenarios functionality",
            "Fix player cashflow projection",
            "Modulate interest rates to be more realistic",
            "Tutorial system",
            "Solved Network IO suspended reconnect after computer sleep",
            "Ownership graphs",
        ]
    },
    {
        ver: "v10.0.10",
        items: [
            "Fix logger",
            "Ask to save game when clicking Exit Game",
            "Fix cashflow warning 'Would you like to view PoorCo cashflow projection now?' now opens cashflow projection of PoorCo",
            "Remove CPU priority boosting for frontend and backend now that IPC is implemented",
            "Only refresh reports that are visible to improve performance",
            "Migrate financial news update popup to Electron dialog",
            "In-game time is actual time of day in game based on market open hours",
            "Implement Zustand for state management to improve performance and reduce complexity",
            "Optimized hyperlink matching by only building regex once",
            "Allow player to specify exact ticker speed from 1-100",
        ]
    },
    {
        ver: "v10.0.9",
        items: [
            "Add Exit Game button",
            "Fix create new game with non-USD currency causing crash",
            "Fix change company name/symbol/country causing crash",
            "Complete rewrite of options handling to fix numerous bugs including sell/cover/exercise buttons, company hyperlinks, and incorrect option pricing",
            "Add back in tax basis column to Stocks & Bonds portfolio tab",
            "Clean up unintended hyperlink matches in text reports"
        ]
    },
    {
        ver: "v10.0.8",
        items: [
            "Fix scrolling issues on multiple tabs to to incorrect flex and centering styles.",
            "Fix cancel button on string input modal which fixes multiple issues e.g. cancel set growth rate.",
            "Fix new game character name mixup",
            "Fix change symbol input error due to null terminator handling.",
            "Fix save game loading animation",
            "Fix options contract company hyperlink and sell/cover/exercise buttons",
            "Fix market reports load industry tabs loading animation",
            "Fix market reports update lag",
            "Clicking on industry in market reports now automatically changes to industry tab",
            "Add 'Browse For Sale Items' button to Cashflow tab in Player View",
            "Fix ETF and Holding Co. industry summaries and hide projections for banking, insurance, holding co., and etf industries",
            "Add company symbol to Acting As and Navigation Control dropdowns",
            "Fix Spin-Off button showing next to bonds contracts",
            "Fix crashing on Startup Choices popup",
            "Fix advance ticker once when user interacts with the UI",
            "Fix start/stop ticker lag",
            "Attempt to improve user interaction responsiveness when ticker is running by optimizing ticker advance logic",
        ]
    },
    {
        ver: "v10.0.7",
        items: [
            "Resolved sporadic loading animation behavior by optimizing in-progress simulation processes to prevent it from getting stuck.",
            "Addressed crashes caused by British pounds and Japanese yen currency handling.",
            "Increased the size of 'Acting As' buttons for improved accessibility.",
            "Fixed navigation issues with forward, backward, and 'View Player' buttons.",
            "Resolved a modalResult dereferencing issue related to strParam1.",
            "Removed the Cancel button from dialogs originally designed for Yes/No responses to prevent backend logic conflicts.",
            "Replaced legacy Win32 popups with modern dialogs for creating new games.",
            "Fixed a bug causing a two-year game limit regardless of startup choices for game length.",
            "Resolved Error 9 and incorrect value sharing between C++ and PowerBasic by ensuring proper memory handling for user input events.",
            "Addressed a UI update issue that occasionally caused crashes.",
            "Improved market report throttling to ensure reasonable refresh rates during ticker activity.",
            "Optimized advisory updates by implementing throttling.",
            "Adjusted the initial ticker speed to be more gradual."
        ]
    },
    {
        ver: "v10.0.6",
        items: [
            "Resolved an issue causing an endless loop of humorous 'Game Over' text.",
            "Removed the Steam overlay from the Electron build to address launch-related issues.",
            "Fixed sporadic behavior of the loading animation and ensured it no longer gets stuck."
        ],
    },
    {
        ver: "v10.0.5",
        items: [
            "Resolved scrolling issues in the Financials tab.",
            "Replaced 'Prepay Taxes' and 'Startup' buttons in the Player View for improved clarity.",
            "Enhanced responsiveness of the Play/Pause button by toggling tick mode outside the update loop.",
            "Fixed an issue where the loading screen occasionally remained visible after the program resumed.",
            "Removed outdated UI navigation instructions when posting offers.",
            "Corrected functionality of the 'Interest Rate Swaps' button for companies.",
            "Updated error message to 'Must be acting as this company' to avoid truncation.",
            "Fixed missing 'CFIG.WSR' causing default computer player names to break.",
            "Revised old sample text referencing outdated UI at the start of a new game.",
            "Implemented decryption for save files.",
            "Changed save game location to '%LOCALAPPDATA%\\Wall Street Raider\\Saves'.",
            "Optimized market report tab updates by staggering them."
        ],
    },
    {
        ver: "v10.0.4",
        items: [
            "Improve responsiveness of play, pause, and speed control buttons.",
            "Ensure margin account report does not display negative numbers; cap values at zero.",
            "Resolve excessive whitespace caused by multiple newlines in information popups.",
            "Migrate '# of computers' and currency configuration popups to Electron dialogs.",
            "Fix 'must control company' error when attempting to create a startup.",
            "Resolve issues with the Set Dividend button functionality.",
            "Fix disappearing Stock and Options buttons in the company profile when zooming in.",
            "Simplify Streaming Quotes interface by adding Star and Trashcan icons with descriptions, removing the active entity from the top of the quotes list to reduce confusion, and adding a dedicated button to manage quotes.",
            "Introduce a 'View Items for Sale' button."
        ],
    },
    {
        ver: "v10.0.3",
        items: [
            "Speed up ticker as much as I can",
            "Add Prime Rate and GDP graphs",
            "\u201CComplex options strategies on low-priced stocks\u201D has lots of whitespace for some reason",
            "Spacebar as pause/unpause",
            "Simplify info popup to have green OK button instead of red Close button at top right",
            "Fix acting as dropdown and view player buttons not showing when viewing market reports"
        ],
    },
    {
        ver: "v10.0.2",
        items: [
            "Fixed capital contribute button",
            "Fixed lagging game speed due to too many text report updates",
        ],
    },
    {
        ver: "v10.0.1",
        items: [
            "Dialogs now appear in front by replacing legacy Win32 dialogs with Electron dialogs.",
            "Investigated CALC button issue; could not reproduce. May have been a symptom of Error 9.",
            "Options list now correctly displays 'You have no options' when empty (intended behavior).",
            "Navigation clarified: use the Financials tab to switch from Options view. To view Player or Company financials, select the entity under 'Acting As:' and then press the appropriate View button.",
            "Migrated QuikMesg to Electron.",
            "Replaced UpdateUI logic in Ui.cpp to resolve 'resource deadlock would occur' error with a deadlock-safe broadcast_state_change().",
            "Fixed issue where ActiveEntity changes sometimes failed to apply (infinite loop).",
            "Deadlock fixes in broadcast_state_change() resolved freezing and unresponsive states, ticker start/stop failures, and hyperlink issues. Likely also fixed game-stopping behavior on July 1.",
            "Fixed Error 9 caused by GameEvent stack memory leak. Tested on actions like Exercise Early and Buy Calls.",
            "Migrated all MSGBOX and QuikMesg calls to Electron modals.",
            "Added branded loading GIF icon.",
            "Expanded and improved main menu video background with additional clips."
        ]
    }
];

// ── Inline SVG icons for social links ──
const RedditIcon = () => html`<svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.768 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.67 13.95c-.165 1.098-1.01 1.985-2.108 2.149-1.098.165-2.168-.353-2.706-1.227-.538-.873-.455-2.01.206-2.798.66-.787 1.748-1.073 2.746-.72.998.353 1.694 1.263 1.762 2.296.033.1.05.2.05.3h.05zm-12.34 0c.165 1.098 1.01 1.985 2.108 2.149 1.098.165 2.168-.353 2.706-1.227.538-.873.455-2.01-.206-2.798-.66-.787-1.748-1.073-2.746-.72-.998.353-1.694 1.263-1.762 2.296-.033.1-.05.2-.05.3h-.05zm10.92 3.55c-.66.66-2.04 1.5-5.25 1.5s-4.59-.84-5.25-1.5c-.22-.22-.22-.58 0-.8.22-.22.58-.22.8 0 .44.44 1.68 1.17 4.45 1.17s4.01-.73 4.45-1.17c.22-.22.58-.22.8 0 .22.22.22.58 0 .8zM17.5 10c-.83 0-1.5-.67-1.5-1.5S16.67 7 17.5 7s1.5.67 1.5 1.5S18.33 10 17.5 10zm-11 0c-.83 0-1.5-.67-1.5-1.5S5.67 7 6.5 7 8 7.67 8 8.5 7.33 10 6.5 10z"/></svg>`;
const DiscordIcon = () => html`<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>`;
const SteamIcon = () => html`<svg viewBox="0 0 24 24"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.985 1.3 1.215 1.27.496 2.702-.136 3.199-1.406.241-.616.246-1.289.012-1.908-.233-.618-.688-1.098-1.28-1.332-.59-.232-1.213-.23-1.77-.03l1.523.63c.936.367 1.4 1.43 1.036 2.368-.367.94-1.43 1.403-2.368 1.036l-.18-.073zm11.81-9.3c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/></svg>`;
const GlobeIcon = () => html`<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.5c.827 0 1.74.85 2.444 2.542.273.656.503 1.41.68 2.24H8.876c.177-.83.407-1.584.68-2.24C10.26 4.35 11.173 3.5 12 3.5zm-3.635 1.14c-.322.668-.594 1.42-.804 2.242H4.767a8.527 8.527 0 0 1 3.598-2.242zm7.27 0a8.527 8.527 0 0 1 3.598 2.242h-2.794c-.21-.822-.482-1.574-.804-2.242zM4.253 8.382h3.08A20.372 20.372 0 0 0 7.1 11.25H3.564a8.437 8.437 0 0 1 .689-2.868zm4.592 0h6.31c.165.9.26 1.86.283 2.868H8.562c.023-1.009.118-1.968.283-2.868zm7.822 0h3.08a8.437 8.437 0 0 1 .689 2.868H16.9a20.372 20.372 0 0 0-.233-2.868zM3.564 12.75H7.1c.028 1.013.113 1.984.233 2.868h-3.08a8.437 8.437 0 0 1-.689-2.868zm5.002 0h6.868c-.023 1.009-.118 1.968-.283 2.868h-6.302a19.38 19.38 0 0 1-.283-2.868zm8.434 0h3.436a8.437 8.437 0 0 1-.689 2.868h-3.08c.12-.884.205-1.855.233-2.868zm-9.876 4.368h5.752a12.13 12.13 0 0 1-.68 2.24C11.74 21.15 10.827 22 12 22c-1.173 0-2.26-.85-2.444-2.542 0 0-.273-.656-.68-2.24h.248zm-2.56 0h2.794c.21.822.482 1.574.804 2.242A8.527 8.527 0 0 1 4.564 17.118zm10.078 0h2.794a8.527 8.527 0 0 1-3.598 2.242c.322-.668.594-1.42.804-2.242z"/></svg>`;

const MainMenu = () => {
    const [quote, setQuote] = useState('');
    const loreSnippet = useMemo(() => LORE_SNIPPETS[Math.floor(Math.random() * LORE_SNIPPETS.length)], []);

    useEffect(() => {
        (async () => {
            try {
                const data = await api.getQuoteOfTheDay();
                if (data && data.quote) {
                    setQuote(data.quote);
                }
            } catch (err) {
                console.error('Error fetching quote of the day:', err);
            }
        })();
    }, []);

    const { showHelp } = api.useWSRContext();
    const localeWarning = localeManager.getWarningForLocale(localeManager.getCurrentLocale());


    return html`
    <div class="wsr-root" data-testid="main-menu">
      ${!window.__WSR_E2E && html`<${VideoBackground} />`}
      <div class="wsr-overlay">

        <!-- ── Header ── -->
        <header class="wsr-topbar glass">
          <div class="wsr-topbar-brand">
            <img src=${LOGO_SRC} alt="Wall Street Raider" class="wsr-logo-sm" />
            <span class="wsr-terminal-title">Jenkins Terminal v${APP_VERSION}</span>
          </div>
          <div class="wsr-topbar-right">
            <${Button} class="btn main-menu" data-testid="btn-help" onClick=${() => showHelp()}>Help</${Button}>
            <${SettingsModal}>
              <${Button} class="btn main-menu">Settings</${Button}>
            <//>
            <${LocalizationDropdown} />
            <span class="wsr-version">Early Access</span>
          </div>
        </header>

        <!-- ── Hero ── -->
        <div class="wsr-hero-wrap">
          <div class="wsr-hero">
            <img src=${LOGO_SRC} alt="Wall Street Raider" class="wsr-hero-logo" />

            <div class="wsr-divider"></div>

            <div class="wsr-tagline">The most realistic Wall Street simulation ever created</div>

            <div class="wsr-stats">
              <span class="wsr-stat">
                <span class="wsr-stat-value">1,600</span>
                <span class="wsr-stat-label">Simulated Companies</span>
              </span>
              <span class="wsr-stat-sep">\u00b7</span>
              <span class="wsr-stat">
                <span class="wsr-stat-label">Played in</span>
                <span class="wsr-stat-value">124</span>
                <span class="wsr-stat-label">countries</span>
              </span>
              <span class="wsr-stat-sep">\u00b7</span>
              <span class="wsr-stat">
                <span class="wsr-stat-label">In development for</span>
                <span class="wsr-stat-value">40</span>
                <span class="wsr-stat-label">years</span>
              </span>
            </div>

            <div class="wsr-divider"></div>

            <div class="wsr-hero-buttons">
              <${Button} class="btn green main-menu" data-testid="btn-load-game" onClick=${api.loadGame}>Load Game</${Button}>
              <${Button} class="btn green main-menu" data-testid="btn-new-game" onClick=${api.newGame}>New Game</${Button}>
              <${Button} class="btn main-menu" data-testid="btn-exit" onClick=${api.exitToDesktop}>Exit</${Button}>
            </div>

            ${quote && html`
              <div class="wsr-quote-wrap">
                <blockquote class="wsr-quote">
                  ${renderMultilineText(quote.trim(), { additionalDelimiters: [] })}
                </blockquote>
              </div>
            `}
          </div>
        </div>

        <!-- ── Bottom panels ── -->
        <div class="wsr-panels">
          <!-- The Story -->
          <div class="wsr-panel">
            <div class="wsr-panel-header">
              <span class="wsr-panel-title">The Story</span>
            </div>
            <div class="wsr-panel-body">
              <p class="wsr-lore-text">${loreSnippet}</p>
              <a class="wsr-lore-link" href=${WEBSITE_URL} target="_blank" rel="noopener">
                Read the full story at wallstreetraider.com \u2192
              </a>
            </div>
          </div>

          <!-- Changelog -->
          <div class="wsr-panel">
            <div class="wsr-panel-header">
              <span class="wsr-panel-title">Changelog</span>
            </div>
            <div class="wsr-panel-body">
              <ul class="wsr-changelog-list">
                ${CHANGELOG.map(c => html`
                  <li class="wsr-change">
                    <div class="wsr-change-ver">${c.ver}</div>
                    ${c.sections ? c.sections.map(s => html`
                      <div class="wsr-change-section-heading">${s.heading}</div>
                      <ul class="wsr-change-list">
                        ${s.items.map(it => html`<li>\u2022 ${it}</li>`)}
                      </ul>
                    `) : html`
                      <ul class="wsr-change-list">
                        ${c.items.map(it => html`<li>\u2022 ${it}</li>`)}
                      </ul>
                    `}
                  </li>
                `)}
              </ul>
            </div>
          </div>
        </div>

        <!-- ── Footer ── -->
        <footer class="wsr-footer glass">
          <span class="wsr-footer-copy">Copyright \u00a9 1986-${new Date().getFullYear()}, All Rights Reserved, Ben Ward and HackJack Games</span>
          ${localeWarning}
          <div class="wsr-social-bar">
            <a class="wsr-social-link" href=${REDDIT_URL} target="_blank" rel="noopener">
              <${RedditIcon} /> Reddit
            </a>
            <a class="wsr-social-link" href=${DISCORD_URL} target="_blank" rel="noopener">
              <${DiscordIcon} /> Discord
            </a>
            <a class="wsr-social-link" href=${STEAM_URL} target="_blank" rel="noopener">
              <${SteamIcon} /> Steam
            </a>
            <a class="wsr-social-link" href=${WEBSITE_URL} target="_blank" rel="noopener">
              <${GlobeIcon} /> Website
            </a>
          </div>
          <span class="wsr-legal">Simulated markets. Not investment advice.</span>
        </footer>

      </div>
    </div>
  `;
};

export default MainMenu;
