import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import QuoteOfTheDay from './QuoteOfTheDay.js';
import VideoBackground from './VideoBackground.js';
import { renderMultilineText } from './helpers.js';

// TODO: set your actual asset paths/links
const LOGO_SRC = 'assets/wallstreetraider_logo.png';
const REDDIT_URL = 'https://www.reddit.com/r/WallStreetRaider/';
const DISCORD_URL = 'https://discord.gg/fuBtyj8B';
const REDDIT_WIDGET = 'assets/reddit-widget.png';
const DISCORD_WIDGET = 'assets/discord-widget.png';

const CHANGELOG = [
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
            "Fixed lagging game speed due to too many text report updates"
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
              <h3 class="wsr-block-title">Welcome to the Playtest!</h3>
  <p>Thanks for joining the Wall Street Raider Playtest. Read this, then dive in.</p>

  <h4>Basics</h4>
  <ul>
    <li>Start with <strong>New Game</strong> for a clean save. Use <strong>Load Game</strong> to resume.</li>
    <li>Explore the menus. Most features are enabled, but some are still work-in-progress.</li>
    <li>If something looks wrong, try to reproduce it once before reporting.</li>
  </ul>

  <h4>Join the Community</h4>
  <p>
    Hop into our Discord and request the <strong>@Playtester</strong> role to access the testing channels: <a href="${DISCORD_URL}" target="_blank" rel="noopener">Join the Discord</a>.
    <br/>
    Also visit the subreddit: <a href="${REDDIT_URL}" target="_blank" rel="noopener">r/WallStreetRaider</a>.
  </p>

  <h4>How to Report a Bug</h4>
  <ol>
    <li><strong>One issue per report</strong> with a clear title.</li>
    <li><strong>Steps to reproduce</strong> from a fresh launch or save.</li>
    <li><strong>Expected vs. actual</strong> result in one sentence each.</li>
    <li><strong>Evidence</strong>: screenshot or short video; attach a relevant save if possible.</li>
    <li><strong>System info</strong>: OS version, CPU/GPU, RAM, display resolution.</li>
  </ol>

  <details>
    <summary>Copy-paste Bug Report Template</summary>
    <pre>
Title:
Build/Version: v0.9.x (date)

Summary:
Concise description of the problem.

Steps to Reproduce:
1)
2)
3)

Expected Result:
What you thought would happen.

Actual Result:
What happened instead (include any error text).

Attachments:
Screenshot/video link; save file if relevant.

System Info:
OS, CPU/GPU, RAM, Resolution.
    </pre>
  </details>

  <p>Thanks for testing. Your reports directly shape the next build.</p>
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
