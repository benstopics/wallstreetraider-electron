import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import VideoBackground from './VideoBackground.js';
import { renderMultilineText } from './helpers.js';

// TODO: set your actual asset paths/links
const LOGO_SRC = 'assets/wallstreetraider_logo.png';
const REDDIT_URL = 'https://www.reddit.com/r/WallStreetRaider/';
const DISCORD_URL = 'https://discord.com/invite/5ujV5Cp9Ej';
const REDDIT_WIDGET = 'assets/reddit-widget.png';
const DISCORD_WIDGET = 'assets/discord-widget.png';

const CHANGELOG = [
    {
        ver: "v10.0.10",
        items: [
            "Fix logger",
            "Ask to save game when clicking Exit Game",
            "Fix cashflow warning 'Would you like to view PoorCo cashflow projection now?' now opens cashflow projection of PoorCo", // TODO
            /*
            Important Financial Alert

FINANCIAL ALERT RE NIKE, INC.! NIKE, INC. officials say the company is projecting a significant cash flow deficit in the next three months and may soon be making forced sales of assets due to severe liquidity problems. DO YOU WANT TO VIEW A CASH FLOW PROJECTION FOR NKE NOW?
            */
            "Remove CPU priority boosting for frontend and backend now that IPC is implemented",
            "Only refresh reports that are visible to improve performance",
            "Migrate financial news update popup to Electron dialog",
            "In-game time is actual time of day in game based on market open hours",
            "Implement Zustand for state management to improve performance and reduce complexity",
            "Optimized hyperlink matching by only building regex once",
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
            "“Complex options strategies on low-priced stocks” has lots of whitespace for some reason",
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


const MainMenu = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await api.getQuoteOfTheDay();
                console.log(data);
                if (data && data.quote) {
                    setQuote(data.quote);
                }
            } catch (err) {
                console.error('Error fetching quote of the day:', err);
            }
        })();
    }, []);

    return html`
    <div class="wsr-root">
      <${VideoBackground} />
      <div class="wsr-overlay">
        <header class="wsr-topbar glass">
          <img src=${LOGO_SRC} alt="Wall Street Raider" class="wsr-logo" />
          
            <div class="wsr-buttons" style="margin: 0 auto;">
              <button class="btn green main-menu" onClick=${api.loadGame}>Load Game</button>
              <button class="btn green main-menu" onClick=${api.newGame}>New Game</button>
            </div>

          <div class="wsr-version">Early Access</div>
        </header>

        <main class="wsr-main">
          <section class="">
          
            <div class="wsr-block">
                <div class="quote-overlay glass">
              <h3 class="wsr-block-title">Quote of the Day</h3>
                    <blockquote class="flex flex-col">
                        ${renderMultilineText(quote.trim(), { additionalDelimiters: ['--.*'] })}
                    </blockquote>
                </div>
            </div>

            <div class="wsr-block">
                <div class="wsr-ann-welcome">
              <div class="h-full overflow-y-auto" style="max-height:40vh;">
              <h3 class="wsr-block-title">Win32 to Electron Conversion Roadmap</h3>
  <p>As part of our commitment to future-proofing Wall Street Raider and ensuring cross-platform compatibility, we are actively working to replace all legacy Win32 code with modern Electron implementations. This transition is critical for the game's long-term sustainability and feature expansion.</p>

  <h4>Next Steps in the Conversion</h4>
  <ul>
    <li>- Swaps</li>
    <li>- Advanced Options</li>
    <li>- Picklist</li>
    <li>- Database Search</li>
    <li>- Settings/Cheats Menu</li>
    <li>- Change Law Firm</li>
    <li>- Spread Rumors</li>
    <li>- Harassing Lawsuit</li>
    <li>- Capital Contributions</li>
  </ul>

  <p>We appreciate your patience and support as we undertake this significant upgrade. Stay tuned for updates as we complete each milestone!</p>
</div>
                </div>
            </div>
          </section>

          <!-- Right: community + changelog -->
          <aside class="wsr-rail">
            <div class="flex flex-row gap-4">
                <a class="flex-[1] glass wsr-widget" href=${REDDIT_URL} target="_blank" rel="noopener">
                <img src=${REDDIT_WIDGET} alt="Reddit: r/WallStreetRaider" style="width: auto; height: 40px" />
                <div class="wsr-widget-label">Join r/WallStreetRaider</div>
                </a>

                <a class="flex-[1] glass wsr-widget" href=${DISCORD_URL} target="_blank" rel="noopener">
                <img src=${DISCORD_WIDGET} alt="Discord server" style="width: auto; height: 40px" />
                <div class="wsr-widget-label">Join the Discord</div>
                </a>
            </div>

            <section class="flex-[1] glass wsr-card wsr-changelog">
              <div class="h-full overflow-y-auto">
                <h3 class="wsr-block-title">Changelog</h3>
                <ul>
                    ${CHANGELOG.map(c => html`
                    <li class="wsr-change">
                        <div class="wsr-change-ver">${c.ver}</div>
                        <ul class="wsr-change-list">
                        ${c.items.map(it => html`<li>• ${it}</li>`)}
                        </ul>
                    </li>
                    `)}
                </ul>
              </div>
            </section>
          </aside>
        </main>

        <footer class="wsr-footer glass">
          <div>© 1986 - ${new Date().getFullYear()} Hackjack Games • Roninsoft</div>
          <div class="wsr-legal">Simulated markets. Not investment advice.</div>
        </footer>
      </div>
    </div>
  `;
};

export default MainMenu;
