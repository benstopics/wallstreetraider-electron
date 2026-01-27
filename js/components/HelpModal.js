// HelpModal.jsx (Preact + htm) - Refactored with hardcoded hierarchy + Pre-indexed Search
import { html, useState, useRef, useCallback, useEffect } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import HelpChapter1Content from './HelpChapter1Content.js';
import HelpChapter2Content from './HelpChapter2Content.js';
import HelpChapter3Content from './HelpChapter3Content.js';
import HelpChapter4Content from './HelpChapter4Content.js';
import HelpChapter5Content from './HelpChapter5Content.js';
import HelpChapter6Content from './HelpChapter6Content.js';
import HelpChapter7Content from './HelpChapter7Content.js';
import HelpChapter8Content from './HelpChapter8Content.js';
import HelpChapter9Content from './HelpChapter9Content.js';
import HelpChapter10Content from './HelpChapter10Content.js';
import HelpChapter11Content from './HelpChapter11Content.js';
import HelpAppendicesContent from './HelpAppendicesContent.js';
import HelpGlossaryContent from './HelpGlossaryContent.js';
import Button from './Button.js';

// Help navigation structure with hardcoded hierarchy
const HELP_STRUCTURE = [
    {
        id: 'intro',
        label: 'Introduction',
        depth: 0,
        component: HelpChapter1Content
    },
    {
        id: 'getting-started',
        label: 'Getting Started',
        depth: 0,
        component: HelpChapter2Content,
        subsections: [
            { id: 'chap02_II(1)', label: 'Step 1 - Now What?', depth: 1 },
            { id: 'chap02_II(2)', label: 'Step 2 - Options Before/After Starting', depth: 1 },
            { id: 'chap02_II(3)', label: 'Step 3 - Start a New Game', depth: 1 },
            { id: 'chap02_II(4)', label: 'Step 4 - Resume Saved Game', depth: 1 },
            { id: 'chap02_II(5)', label: 'Step 5 - Saving a Game', depth: 1 },
            { id: 'chap02_II(6)', label: 'Step 6 - Completing a Game', depth: 1 }
        ]
    },
    {
        id: 'faqs',
        label: 'FAQs',
        depth: 0,
        component: HelpChapter3Content,
        subsections: [
            { id: 'chap03_III(A)', label: 'A. Active Entity & Transacting Entity', depth: 1 },
            { id: 'chap03_III(B)', label: 'B. How to Select an Entity', depth: 1 },
            { id: 'chap03_III(C)', label: 'C. Turn Duration', depth: 1 },
            { id: 'chap03_III(D)', label: 'D. My Balance Sheet', depth: 1 },
            { id: 'chap03_III(E)', label: 'E. Industry Group Selected', depth: 1 },
            { id: 'chap03_III(F)', label: 'F. How Realistic Is W$R?', depth: 1 },
            { id: 'chap03_III(G)', label: 'G. What Is "Control"?', depth: 1 },
            { id: 'chap03_III(H)', label: 'H. Circular Stock Ownership', depth: 1 },
            { id: 'chap03_III(I)', label: 'I. Margin Calls & Net Worth', depth: 1 },
            { id: 'chap03_III(J)', label: 'J. Line of Credit', depth: 1 },
            { id: 'chap03_III(K)', label: 'K. Cheat Mode', depth: 1 },
            { id: 'chap03_III(L)', label: 'L. Time Progression', depth: 1 },
            { id: 'chap03_III(M)', label: 'M. Back Door to W$R', depth: 1 },
            { id: 'chap03_III(N)', label: 'N. Executive Compensation', depth: 1 },
            { id: 'chap03_III(O)', label: 'O. Goodwill', depth: 1 },
            { id: 'chap03_III(P)', label: 'P. Short Sales', depth: 1 },
            { id: 'chap03_III(Q)', label: 'Q. ETF Management', depth: 1 }
        ]
    },
    {
        id: 'strategies',
        label: 'Basic Strategies',
        depth: 0,
        component: HelpChapter4Content,
        subsections: [
            { id: 'chap04_IV(A)', label: 'A. Basic Strategies in W$R', depth: 1 },
            { id: 'chap04_IV(A)(1)', label: '1. Turn Around a Company', depth: 2 },
            { id: 'chap04_IV(A)(2)', label: '2. Monopolize an Industry', depth: 2 },
            { id: 'chap04_IV(A)(3)', label: '3. Startups', depth: 2 },
            { id: 'chap04_IV(A)(4)', label: '4. Tax Strategies', depth: 2 },
            { id: 'chap04_IV(A)(5)', label: '5. Speculating in Junk Bonds', depth: 2 },
            { id: 'chap04_IV(A)(6)', label: '6. Gain Control of Key Lenders', depth: 2 },
            { id: 'chap04_IV(A)(7)', label: '7. Hardball Tactics', depth: 2 },
            { id: 'chap04_IV(A)(8)', label: '8. Earn Executive Compensation', depth: 2 },
            { id: 'chap04_IV(A)(9)', label: '9. Incorporate Yourself!', depth: 2 },
            { id: 'chap04_IV(A)(10)', label: '10. Passive Investing', depth: 2 },
            { id: 'chap04_IV(A)(11)', label: '11. Options Trading', depth: 2 },
            { id: 'chap04_IV(A)(12)', label: '12. Trading Futures', depth: 2 },
            { id: 'chap04_IV(A)(13)', label: '13. Trading Physical Commodities', depth: 2 },
            { id: 'chap04_IV(A)(14)', label: '14. Trading Cryptocurrencies', depth: 2 },
            { id: 'chap04_IV(B)', label: 'B. Gaining Control of Companies', depth: 1 },
            { id: 'chap04_IV(C)', label: 'C. Increasing Company Profitability', depth: 1 },
            { id: 'chap04_IV(C)(1)', label: '1. Productivity Spending', depth: 2 },
            { id: 'chap04_IV(C)(2)', label: '2. Increasing Market Share', depth: 2 },
            { id: 'chap04_IV(C)(3)', label: '3. Diversification & Restructuring', depth: 2 },
            { id: 'chap04_IV(C)(4)', label: '4. Change the Management Team', depth: 2 },
            { id: 'chap04_IV(C)(5)', label: '5. Other Ways to Increase Profitability', depth: 2 },
            { id: 'chap04_IV(D)', label: 'D. Industry & Company Financial Ratios', depth: 1 },
            { id: 'chap04_IV(E)', label: 'E. Understanding Financial Statements', depth: 1 },
            { id: 'chap04_IV(F)', label: 'F. Option Pricing', depth: 1 },
            { id: 'chap04_IV(G)', label: 'G. Banking & Insurance Companies', depth: 1 },
            { id: 'chap04_IV(H)', label: 'H. Exchange-Traded Funds (ETFs)', depth: 1 },
            { id: 'chap04_IV(I)', label: 'I. Mergers & Acquisitions', depth: 1 },
            { id: 'chap04_IV(J)', label: 'J. Bankruptcies & Liquidations', depth: 1 },
            { id: 'chap04_IV(K)', label: 'K. The Economic Model', depth: 1 },
            { id: 'chap04_IV(L)', label: 'L. Stock Price Determination', depth: 1 },
            { id: 'chap04_IV(M)', label: 'M. Bond Pricing & Yields', depth: 1 },
            { id: 'chap04_IV(N)', label: 'N. Interest Rates & the Federal Reserve', depth: 1 },
            { id: 'chap04_IV(O)', label: 'O. Commodity Markets', depth: 1 },
            { id: 'chap04_IV(P)', label: 'P. Foreign Exchange & Currencies', depth: 1 },
            { id: 'chap04_IV(Q)', label: 'Q. Real Estate & Mortgages', depth: 1 },
            { id: 'chap04_IV(R)', label: 'R. Additional Topics', depth: 1 }
        ]
    },
    {
        id: 'main-menu',
        label: 'The Main Menu',
        depth: 0,
        component: HelpChapter5Content,
        subsections: [
            { id: 'chap05_V(A)', label: 'A. In General', depth: 1 },
            { id: 'chap05_V(B)', label: 'B. Pulldown Menu Items', depth: 1 },
            { id: 'chap05_V(B)(1)', label: '1. File Menu', depth: 2 },
            { id: 'chap05_V(B)(2)', label: '2. Game Options Menu', depth: 2 },
            { id: 'chap05_V(B)(3)', label: '3. Settings Menu', depth: 2 },
            { id: 'chap05_V(B)(4)', label: '4. Help Menu', depth: 2 },
            { id: 'chap05_V(C)', label: 'C. Information Displays', depth: 1 },
            { id: 'chap05_V(C)(1)', label: '1. Active Entity Selected', depth: 2 },
            { id: 'chap05_V(C)(2)', label: '2. Industry Group Selected', depth: 2 },
            { id: 'chap05_V(C)(3)', label: '3. My Balance Sheet', depth: 2 },
            { id: 'chap05_V(C)(4)', label: '4. Game Status Info', depth: 2 },
            { id: 'chap05_V(C)(5)', label: '5. Economic Data Display', depth: 2 },
            { id: 'chap05_V(C)(6)', label: '6. Stock and News Tickers', depth: 2 },
            { id: 'chap05_V(C)(7)', label: '7. Search Function Buttons', depth: 2 },
            { id: 'chap05_V(C)(8)', label: '8. Streaming Stock Quotes', depth: 2 },
            { id: 'chap05_V(D)', label: 'D. Non-Menu Button Functions', depth: 1 },
            { id: 'chap05_V(D)(1)', label: '1. Go Button', depth: 2 },
            { id: 'chap05_V(D)(2)', label: '2. Ticker On/Off Button', depth: 2 },
            { id: 'chap05_V(D)(3)', label: '3. Logo Image (Cheat)', depth: 2 }
        ]
    },
    {
        id: 'buy-sell-menu',
        label: 'Buy/Sell Transactions',
        depth: 0,
        component: HelpChapter6Content,
        subsections: [
            { id: 'chap06_VI(A)', label: 'A. In General', depth: 1 },
            { id: 'chap06_VI(B)', label: 'B. "Buy/Sell" Button and Menu', depth: 1 },
            { id: 'chap06_VI(B)(1)', label: '1. Buy Stock (or Cover Short)', depth: 2 },
            { id: 'chap06_VI(B)(2)', label: '2. Sell Stock (or Sell Short)', depth: 2 },
            { id: 'chap06_VI(B)(3)', label: '3. Buy Corporate Bonds', depth: 2 },
            { id: 'chap06_VI(B)(4)', label: '4. Sell Corporate Bonds', depth: 2 },
            { id: 'chap06_VI(B)(5)', label: '5. Trade Government Bonds', depth: 2 },
            { id: 'chap06_VI(B)(6)', label: '6. Merger', depth: 2 },
            { id: 'chap06_VI(B)(7)', label: '7. Greenmail', depth: 2 },
            { id: 'chap06_VI(B)(8)', label: '8. LBO (Leveraged Buyout)', depth: 2 },
            { id: 'chap06_VI(B)(9)', label: '9. Buy Corporate Assets', depth: 2 },
            { id: 'chap06_VI(B)(10)', label: '10. Sell Corporate Assets', depth: 2 },
            { id: 'chap06_VI(B)(11)', label: '11. Buy or Sell Bank Loans', depth: 2 },
            { id: 'chap06_VI(B)(12)', label: '12. Buy Call Options', depth: 2 },
            { id: 'chap06_VI(B)(13)', label: '13. Sell Call Options', depth: 2 },
            { id: 'chap06_VI(B)(14)', label: '14. Buy Put Options', depth: 2 },
            { id: 'chap06_VI(B)(15)', label: '15. Sell Put Options', depth: 2 },
            { id: 'chap06_VI(B)(16)', label: '16. Trade Futures', depth: 2 },
            { id: 'chap06_VI(B)(17)', label: '17. Trade Commodities', depth: 2 },
            { id: 'chap06_VI(B)(18)', label: '18. Trade Cryptocurrencies', depth: 2 },
            { id: 'chap06_VI(B)(19)', label: '19. Advanced Option Trading', depth: 2 },
            { id: 'chap06_VI(C)', label: 'C. Buy Stock Button', depth: 1 },
            { id: 'chap06_VI(D)', label: 'D. Sell Stock Button', depth: 1 }
        ]
    },
    {
        id: 'financing-menu',
        label: 'Financing Transactions',
        depth: 0,
        component: HelpChapter7Content,
        subsections: [
            { id: 'chap07_VII(A)', label: 'A. In General', depth: 1 },
            { id: 'chap07_VII(B)', label: 'B. "Financing" Button and Menu', depth: 1 },
            { id: 'chap07_VII(B)(1)', label: '1. Start Up New Corp.', depth: 2 },
            { id: 'chap07_VII(B)(2)', label: '2. Capital Contribution', depth: 2 },
            { id: 'chap07_VII(B)(3)', label: '3. Public Stock Offering', depth: 2 },
            { id: 'chap07_VII(B)(4)', label: '4. Private Stock Offering', depth: 2 },
            { id: 'chap07_VII(B)(5)', label: '5. Issue Bonds', depth: 2 },
            { id: 'chap07_VII(B)(6)', label: '6. Buy Back or Call Bonds', depth: 2 },
            { id: 'chap07_VII(B)(7)', label: '7. Extraordinary Dividend', depth: 2 },
            { id: 'chap07_VII(B)(8)', label: '8. Tax-Free Liquidation', depth: 2 },
            { id: 'chap07_VII(B)(9)', label: '9. Taxable Liquidation', depth: 2 },
            { id: 'chap07_VII(B)(10)', label: '10. Spin-Off Subsidiary', depth: 2 }
        ]
    },
    {
        id: 'management-menu',
        label: 'Management Transactions',
        depth: 0,
        component: HelpChapter8Content,
        subsections: [
            { id: 'chap08_VIII(A)', label: 'A. In General', depth: 1 },
            { id: 'chap08_VIII(B)', label: 'B. "Management" Button and Menu', depth: 1 },
            { id: 'chap08_VIII(B)(1)', label: '1. Elect Me as CEO', depth: 2 },
            { id: 'chap08_VIII(B)(2)', label: '2. Resign as CEO', depth: 2 },
            { id: 'chap08_VIII(B)(3)', label: '3. Change Managers', depth: 2 },
            { id: 'chap08_VIII(B)(4)', label: '4. Set Dividend Payout', depth: 2 },
            { id: 'chap08_VIII(B)(5)', label: '5. Set Productivity Spending', depth: 2 },
            { id: 'chap08_VIII(B)(6)', label: '6. Set Growth Rate%', depth: 2 },
            { id: 'chap08_VIII(B)(7)', label: '7. Restructure', depth: 2 },
            { id: 'chap08_VIII(B)(8)', label: '8. Antitrust Suit', depth: 2 },
            { id: 'chap08_VIII(B)(9)', label: '9. Set Fund Advisor Fee', depth: 2 },
            { id: 'chap08_VIII(B)(10)', label: '10. Become ETF Advisor', depth: 2 },
            { id: 'chap08_VIII(B)(11)', label: '11. Turn Autopilot On/Off', depth: 2 },
            { id: 'chap08_VIII(B)(12)', label: '12. Asset Allocation', depth: 2 }
        ]
    },
    {
        id: 'other-trans-menu',
        label: 'Other Transactions',
        depth: 0,
        component: HelpChapter9Content,
        subsections: [
            { id: 'chap09_IX(A)', label: 'A. In General', depth: 1 },
            { id: 'chap09_IX(B)', label: 'B. "Other Trans." Button and Menu', depth: 1 },
            { id: 'chap09_IX(B)(1)', label: '1. Harassing Lawsuit', depth: 2 },
            { id: 'chap09_IX(B)(2)', label: '2. Spread Rumors', depth: 2 },
            { id: 'chap09_IX(B)(3)', label: '3. Change Bank', depth: 2 },
            { id: 'chap09_IX(B)(4)', label: '4. Call in Bank Loan', depth: 2 },
            { id: 'chap09_IX(B)(5)', label: '5. Freeze/Unfreeze Loans', depth: 2 },
            { id: 'chap09_IX(B)(6)', label: '6. Buy or Sell Bank Loans', depth: 2 },
            { id: 'chap09_IX(B)(7)', label: '7. Exercise Call Option', depth: 2 },
            { id: 'chap09_IX(B)(8)', label: '8. Exercise Put Option', depth: 2 },
            { id: 'chap09_IX(B)(9)', label: '9. Decrease Earnings', depth: 2 },
            { id: 'chap09_IX(B)(10)', label: '10. Increase Earnings', depth: 2 },
            { id: 'chap09_IX(B)(11)', label: '11. Interest Rate Swaps', depth: 2 },
            { id: 'chap09_IX(B)(12)', label: '12. For Sale Items', depth: 2 },
            { id: 'chap09_IX(B)(13)', label: '13. Buy Subprime Mortgages', depth: 2 },
            { id: 'chap09_IX(B)(14)', label: '14. Sell Subprime Mortgages', depth: 2 }
        ]
    },
    {
        id: 'research-menus',
        label: 'Research Menus and Tools',
        depth: 0,
        component: HelpChapter10Content,
        subsections: [
            { id: 'chap10_X(A)', label: 'A. In General', depth: 1 },
            { id: 'chap10_X(B)', label: 'B. "Select Player"', depth: 1 },
            { id: 'chap10_X(C)', label: 'C. "Select Corp."', depth: 1 },
            { id: 'chap10_X(D)', label: 'D. "Entity Info" Button and Menu', depth: 1 },
            { id: 'chap10_X(D)(1)', label: '1. Changing the Active Entity', depth: 2 },
            { id: 'chap10_X(D)(2)', label: '2. Research Report', depth: 2 },
            { id: 'chap10_X(D)(3)', label: '3. Financial Profile', depth: 2 },
            { id: 'chap10_X(D)(4)', label: '4. Earnings Report', depth: 2 },
            { id: 'chap10_X(D)(5)', label: '5. List Shareholders', depth: 2 },
            { id: 'chap10_X(D)(6)', label: '6. List Portfolio', depth: 2 },
            { id: 'chap10_X(D)(7)', label: '7. Diagram of Holdings', depth: 2 },
            { id: 'chap10_X(D)(8)', label: '8. Credit Info', depth: 2 },
            { id: 'chap10_X(D)(9)', label: '9. Industry Summary', depth: 2 },
            { id: 'chap10_X(D)(10)', label: '10. Industry Projection', depth: 2 },
            { id: 'chap10_X(D)(11)', label: '11. List Bank Loans', depth: 2 },
            { id: 'chap10_X(D)(12)', label: '12. Tax Basis Info', depth: 2 },
            { id: 'chap10_X(D)(13)', label: '13. List Advances to Corps', depth: 2 },
            { id: 'chap10_X(D)(14)', label: '14. List Options', depth: 2 },
            { id: 'chap10_X(D)(15)', label: '15. List Futures Contracts', depth: 2 },
            { id: 'chap10_X(D)(16)', label: '16. Cash Flow Projection', depth: 2 },
            { id: 'chap10_X(D)(17)', label: '17. My Corps', depth: 2 },
            { id: 'chap10_X(E)', label: 'E. "General" (Research) Button and Menu', depth: 1 },
            { id: 'chap10_X(E)(1)', label: '1. Market Share', depth: 2 },
            { id: 'chap10_X(E)(2)', label: '2. Industrial Growth Rates', depth: 2 },
            { id: 'chap10_X(E)(3)', label: '3. Industry Projection', depth: 2 },
            { id: 'chap10_X(E)(4)', label: '4. Industry Summary', depth: 2 },
            { id: 'chap10_X(E)(5)', label: '5. Economic Statistics', depth: 2 },
            { id: 'chap10_X(E)(6)', label: '6. Interest Rates', depth: 2 },
            { id: 'chap10_X(E)(7)', label: '7. View News', depth: 2 },
            { id: 'chap10_X(E)(8)', label: '8. Who\'s Ahead?', depth: 2 },
            { id: 'chap10_X(E)(9)', label: '9. Most Cash', depth: 2 },
            { id: 'chap10_X(E)(10)', label: '10. Largest Tax Losses', depth: 2 },
            { id: 'chap10_X(E)(11)', label: '11. Largest Market Cap', depth: 2 },
            { id: 'chap10_X(E)(12)', label: '12. Database Search', depth: 2 },
            { id: 'chap10_X(E)(13)', label: '13. Who Owns What?', depth: 2 },
            { id: 'chap10_X(F)', label: 'F. "Select Last" Button', depth: 1 },
            { id: 'chap10_X(G)', label: 'G. "My News" Button', depth: 1 },
            { id: 'chap10_X(H)', label: 'H. "Quick Search Functions" Group of Buttons', depth: 1 },
            { id: 'chap10_X(H)(1)', label: '1. Recall DB Search List', depth: 2 },
            { id: 'chap10_X(H)(2)', label: '2. Other Quick Search Buttons', depth: 2 }
        ]
    },
    {
        id: 'other-menu-functions',
        label: 'Other Menu Functions',
        depth: 0,
        component: HelpChapter11Content,
        subsections: [
            { id: 'chap11_XI(A)', label: 'A. In General', depth: 1 },
            { id: 'chap11_XI(B)', label: 'B. "End Turn" or "My Chart" Button', depth: 1 },
            { id: 'chap11_XI(B)(1)', label: '1. End Turn Button', depth: 2 },
            { id: 'chap11_XI(B)(2)', label: '2. My Chart Button', depth: 2 },
            { id: 'chap11_XI(C)', label: 'C. "Misc" Button and Menu', depth: 1 },
            { id: 'chap11_XI(C)(1)', label: '1. Borrow Money', depth: 2 },
            { id: 'chap11_XI(C)(2)', label: '2. Repay Loan', depth: 2 },
            { id: 'chap11_XI(C)(3)', label: '3. Stock Split', depth: 2 },
            { id: 'chap11_XI(C)(4)', label: '4. Reverse Split', depth: 2 },
            { id: 'chap11_XI(C)(5)', label: '5. Name Change', depth: 2 },
            { id: 'chap11_XI(C)(6)', label: '6. Advance to Corp.', depth: 2 },
            { id: 'chap11_XI(C)(7)', label: '7. Recall Advance', depth: 2 },
            { id: 'chap11_XI(C)(8)', label: '8. Prepay Income Tax', depth: 2 },
            { id: 'chap11_XI(C)(9)', label: '9. Offer to Sell Stock', depth: 2 },
            { id: 'chap11_XI(C)(10)', label: '10. Offer to Sell Assets', depth: 2 },
            { id: 'chap11_XI(C)(11)', label: '11. Set Price or Rate Alert', depth: 2 },
            { id: 'chap11_XI(C)(12)', label: '12. Trade Treasury Bills', depth: 2 },
            { id: 'chap11_XI(D)', label: 'D. "Cheat" Button and Menu', depth: 1 },
            { id: 'chap11_XI(E)', label: 'E. "Chart" Button', depth: 1 }
        ]
    },
    {
        id: 'appendices',
        label: 'Appendices',
        depth: 0,
        component: HelpAppendicesContent,
        subsections: [
            { id: 'appendix_(B)', label: 'B. Company Names and Stock Symbols', depth: 1 },
            { id: 'appendix_(C)', label: 'C. Credit Ratings and Loan Rates', depth: 1 },
            { id: 'appendix_(D)', label: 'D. Industry Information', depth: 1 },
            { id: 'appendix_(D)(1)', label: '1. Industry Volatility & Growth', depth: 2 },
            { id: 'appendix_(D)(2)', label: '2. Factors Affecting Demand', depth: 2 },
            { id: 'appendix_(E)', label: 'E. Strategy and Tactics', depth: 1 },
            { id: 'appendix_(E)(1)', label: '1. Strategic Goals', depth: 2 },
            { id: 'appendix_(E)(2)', label: '2. Sneaky Tactics', depth: 2 }
        ]
    },
    {
        id: 'glossary',
        label: 'Glossary',
        depth: 0,
        component: HelpGlossaryContent
    }
];

// ============================================================================
// SEARCH INDEX IMPLEMENTATION
// ============================================================================

// ============================================================================
// AHO-CORASICK ALGORITHM FOR PATTERN MATCHING
// ============================================================================

class AhoCorasickNode {
    constructor() {
        this.children = new Map();
        this.fail = null;
        this.output = [];
    }
}

class AhoCorasick {
    constructor() {
        this.root = new AhoCorasickNode();
    }

    // Add a pattern to the trie
    addPattern(pattern) {
        let node = this.root;
        const lowerPattern = pattern.toLowerCase();

        for (const char of lowerPattern) {
            if (!node.children.has(char)) {
                node.children.set(char, new AhoCorasickNode());
            }
            node = node.children.get(char);
        }

        node.output.push(pattern);
    }

    // Build failure links using BFS
    buildFailureLinks() {
        const queue = [];

        // Initialize failure links for depth-1 nodes
        for (const [char, child] of this.root.children) {
            child.fail = this.root;
            queue.push(child);
        }

        // BFS to build failure links
        while (queue.length > 0) {
            const current = queue.shift();

            for (const [char, child] of current.children) {
                queue.push(child);

                let fail = current.fail;
                while (fail !== null && !fail.children.has(char)) {
                    fail = fail.fail;
                }

                child.fail = fail ? fail.children.get(char) : this.root;
                child.output = [...child.output, ...child.fail.output];
            }
        }
    }

    // Search for all patterns in text and return match positions
    search(text) {
        const matches = [];
        let node = this.root;
        const lowerText = text.toLowerCase();

        for (let i = 0; i < lowerText.length; i++) {
            const char = lowerText[i];

            // Follow failure links until we find a match or reach root
            while (node !== this.root && !node.children.has(char)) {
                node = node.fail;
            }

            if (node.children.has(char)) {
                node = node.children.get(char);
            }

            // Record all patterns that end at this position
            if (node.output.length > 0) {
                for (const pattern of node.output) {
                    matches.push({
                        start: i - pattern.length + 1,
                        end: i + 1,
                        pattern: pattern
                    });
                }
            }
        }

        return matches;
    }
}

// Highlight search terms in text using Aho-Corasick results
function highlightMatches(text, matches) {
    if (!matches || matches.length === 0) return text;

    // Sort matches by start position
    const sortedMatches = [...matches].sort((a, b) => a.start - b.start);

    // Merge overlapping matches
    const mergedMatches = [];
    let current = sortedMatches[0];

    for (let i = 1; i < sortedMatches.length; i++) {
        const next = sortedMatches[i];
        if (next.start <= current.end) {
            // Overlapping - extend current
            current.end = Math.max(current.end, next.end);
        } else {
            mergedMatches.push(current);
            current = next;
        }
    }
    mergedMatches.push(current);

    // Build highlighted text
    let result = '';
    let lastEnd = 0;

    for (const match of mergedMatches) {
        // Add text before match
        result += text.substring(lastEnd, match.start);
        // Add highlighted match
        result += `<mark class="search-highlight">${text.substring(match.start, match.end)}</mark>`;
        lastEnd = match.end;
    }

    // Add remaining text
    result += text.substring(lastEnd);

    return result;
}

// Stop words to exclude from search index
const STOP_WORDS = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'will',
    'have', 'has', 'had', 'been', 'their', 'there', 'what', 'when', 'where',
    'which', 'who', 'whom', 'whose', 'why', 'how', 'all', 'each', 'every',
    'both', 'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too',
    'very', 'can', 'could', 'may', 'might', 'must', 'shall', 'should', 'would',
    'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'under', 'again', 'further', 'then', 'once', 'here', 'any',
    'but', 'not', 'only', 'own', 'same', 'so', 'out', 'just', 'now', 'also'
]);

// Tokenize text into searchable words
function tokenize(text) {
    if (!text) return [];

    return text
        .toLowerCase()
        .split(/[^a-z0-9]+/)  // Split on non-alphanumeric characters
        .filter(word => word.length > 2)  // Ignore short words
        .filter(word => !STOP_WORDS.has(word));  // Remove stop words
}

// Extract text from htm template by rendering it to a dummy container
function extractTextFromComponent(component) {
    try {
        // Create a dummy helpLink that returns plain text string
        const textHelpLink = (id, text) => {
            // Convert any non-string values to string
            if (typeof text === 'object' && text !== null) {
                return '';
            }
            return String(text);
        };

        // Call the component to get the htm template
        const rendered = component({ helpLink: textHelpLink });

        // Recursively extract text from htm template objects
        function extractFromTemplate(node) {
            if (node == null) return '';

            // If it's a string, return it
            if (typeof node === 'string') return node;
            if (typeof node === 'number') return String(node);

            // If it's an htm template object with props/children
            if (typeof node === 'object') {
                // Check for htm template structure
                if (node.type && node.props) {
                    // Extract from children
                    if (node.props.children) {
                        if (Array.isArray(node.props.children)) {
                            return node.props.children.map(extractFromTemplate).join(' ');
                        }
                        return extractFromTemplate(node.props.children);
                    }
                }

                // If it's an array, process each item
                if (Array.isArray(node)) {
                    return node.map(extractFromTemplate).join(' ');
                }

                // Try to get props or just stringify
                if (node.props && typeof node.props === 'object') {
                    return extractFromTemplate(node.props);
                }
            }

            return '';
        }

        let text = extractFromTemplate(rendered);

        // Also try simple string conversion as fallback
        if (!text || text.length < 10) {
            text = String(rendered);
        }

        // Remove script and style tags with their content
        text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

        // Remove HTML tags
        text = text.replace(/<[^>]+>/g, ' ');

        // Decode HTML entities
        text = text.replace(/&nbsp;/g, ' ');
        text = text.replace(/&amp;/g, '&');
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');
        text = text.replace(/&quot;/g, '"');
        text = text.replace(/&#39;/g, "'");

        // Normalize whitespace
        text = text.replace(/\s+/g, ' ').trim();

        // Remove any remaining [object Object] strings
        text = text.replace(/\[object Object\]/g, '');

        return text;
    } catch (error) {
        console.error('Error extracting text from component:', error);
        return '';
    }
}

// Build search index from help structure (for fast mode)
// Indexes titles and full chapter content
function buildSearchIndex(structure) {
    const index = new Map(); // word -> Set of section IDs

    structure.forEach(chapter => {
        // Index the chapter title
        const titleWords = tokenize(chapter.label);
        titleWords.forEach(word => {
            if (!index.has(word)) {
                index.set(word, new Set());
            }
            index.get(word).add(chapter.id);
        });

        // Index the chapter content
        if (chapter.component) {
            const content = extractTextFromComponent(chapter.component);
            const contentWords = tokenize(content);

            contentWords.forEach(word => {
                if (!index.has(word)) {
                    index.set(word, new Set());
                }
                index.get(word).add(chapter.id);
            });
        }

        // Index subsections (titles only)
        if (chapter.subsections) {
            chapter.subsections.forEach(subsection => {
                const subsectionWords = tokenize(subsection.label);
                subsectionWords.forEach(word => {
                    if (!index.has(word)) {
                        index.set(word, new Set());
                    }
                    index.get(word).add(subsection.id);
                });
            });
        }
    });

    return index;
}

// Extract snippet with context around a match
function extractSnippet(text, matchStart, matchEnd, contextLength = 80) {
    const start = Math.max(0, matchStart - contextLength);
    const end = Math.min(text.length, matchEnd + contextLength);

    let snippet = text.substring(start, end);

    // Add ellipsis if we're not at the start/end
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    // Calculate the match position within the snippet
    const snippetMatchStart = matchStart - start + (start > 0 ? 3 : 0); // +3 for '...'
    const snippetMatchEnd = snippetMatchStart + (matchEnd - matchStart);

    return {
        text: snippet,
        matchStart: snippetMatchStart,
        matchEnd: snippetMatchEnd
    };
}

// Deep search: Returns detailed results with snippets for each match
function searchDeepWithSnippets(query, structure) {
    const queryLower = query.toLowerCase();
    const results = [];

    console.log('[Deep Search] Starting search for:', query);
    const startTime = performance.now();

    // Build Aho-Corasick for efficient multi-pattern matching
    const ac = new AhoCorasick();
    ac.addPattern(queryLower);
    ac.buildFailureLinks();

    structure.forEach(chapter => {
        // Search in chapter title
        if (chapter.label.toLowerCase().includes(queryLower)) {
            const titleLower = chapter.label.toLowerCase();
            const matchStart = titleLower.indexOf(queryLower);
            results.push({
                chapterId: chapter.id,
                chapterLabel: chapter.label,
                sectionId: chapter.id,
                sectionLabel: chapter.label,
                matchType: 'title',
                snippet: {
                    text: chapter.label,
                    matchStart: matchStart,
                    matchEnd: matchStart + queryLower.length
                },
                charOffset: 0
            });
        }

        // Search in chapter content
        if (chapter.component) {
            const content = extractTextFromComponent(chapter.component);
            const matches = ac.search(content);

            matches.forEach(match => {
                const snippet = extractSnippet(content, match.start, match.end, 80);
                results.push({
                    chapterId: chapter.id,
                    chapterLabel: chapter.label,
                    sectionId: chapter.id,
                    sectionLabel: chapter.label,
                    matchType: 'content',
                    snippet: snippet,
                    charOffset: match.start
                });
            });
        }

        // Search in subsection titles
        if (chapter.subsections) {
            chapter.subsections.forEach(subsection => {
                if (subsection.label.toLowerCase().includes(queryLower)) {
                    const titleLower = subsection.label.toLowerCase();
                    const matchStart = titleLower.indexOf(queryLower);
                    results.push({
                        chapterId: chapter.id,
                        chapterLabel: chapter.label,
                        sectionId: subsection.id,
                        sectionLabel: subsection.label,
                        matchType: 'title',
                        snippet: {
                            text: subsection.label,
                            matchStart: matchStart,
                            matchEnd: matchStart + queryLower.length
                        },
                        charOffset: 0
                    });
                }
            });
        }
    });

    const endTime = performance.now();
    console.log(`[Deep Search] Found ${results.length} matches in ${Math.round(endTime - startTime)}ms`);

    return results;
}

// Search the index with ranked results
function searchIndexRanked(query, index) {
    const queryWords = tokenize(query);

    if (queryWords.length === 0) {
        return [];
    }

    const scores = new Map(); // section ID -> score

    // For each query word, add to scores
    queryWords.forEach(word => {
        const matches = index.get(word);
        if (matches) {
            matches.forEach(id => {
                scores.set(id, (scores.get(id) || 0) + 1);
            });
        }
    });

    // Sort by score (descending) and return IDs
    return Array.from(scores.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([id, score]) => id);
}

// Flatten structure for sidebar rendering
function flattenStructure(structure) {
    const flat = [];
    structure.forEach(item => {
        flat.push(item);
        if (item.subsections) {
            item.subsections.forEach(sub => {
                flat.push({ ...sub, parentId: item.id });
            });
        }
    });
    return flat;
}

export default function HelpModal({ show, onClose, initialSectionId }) {
    const [selectedId, setSelectedId] = useState('intro');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState('deep'); // 'fast' or 'deep'
    const [indexReady, setIndexReady] = useState(false);
    const [selectedMatchIndex, setSelectedMatchIndex] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const contentRef = useRef(null);
    const searchIndexRef = useRef(null);
    const ahoCorasickRef = useRef(null);
    const searchAbortRef = useRef(null);

    const searchInputRef = useRef(null);

    // Navigate to initial section when modal opens with a specific section
    useEffect(() => {
        if (show && initialSectionId) {
            // Find if this is a subsection to get the parent chapter
            const flatStructure = flattenStructure(HELP_STRUCTURE);
            const targetItem = flatStructure.find(item => item.id === initialSectionId);

            if (targetItem) {
                // Set the selected ID (use parent if it's a subsection)
                const chapterId = targetItem.parentId || targetItem.id;
                setSelectedId(chapterId);

                // If it's a subsection, scroll to it after content renders
                if (targetItem.parentId || targetItem.id !== chapterId) {
                    setTimeout(() => {
                        const element = document.getElementById(initialSectionId);
                        if (element && contentRef.current) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 150);
                } else {
                    // Main chapter, scroll to top
                    if (contentRef.current) {
                        contentRef.current.scrollTop = 0;
                    }
                }
            }
        }
    }, [show, initialSectionId]);

    // Debounce search query to prevent blocking typing
    useEffect(() => {
        // Clear previous timeout
        if (searchAbortRef.current) {
            clearTimeout(searchAbortRef.current);
        }

        // If query is empty, update immediately
        if (!searchQuery.trim()) {
            setDebouncedSearchQuery('');
            setIsSearching(false);
            return;
        }

        // Show searching indicator
        setIsSearching(true);

        // Debounce the search query
        searchAbortRef.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 200); // 200ms debounce

        return () => {
            if (searchAbortRef.current) {
                clearTimeout(searchAbortRef.current);
            }
        };
    }, [searchQuery]);

    const flatStructure = flattenStructure(HELP_STRUCTURE);

    // Build search index when modal opens
    useEffect(() => {
        if (show && !searchIndexRef.current) {
            // Build index asynchronously to avoid blocking UI
            setTimeout(() => {
                console.log('Building search index...');
                const startTime = performance.now();
                searchIndexRef.current = buildSearchIndex(HELP_STRUCTURE);
                const endTime = performance.now();
                console.log(`Search index built in ${Math.round(endTime - startTime)}ms`);
                console.log(`Index contains ${searchIndexRef.current.size} unique terms`);
                setIndexReady(true);
            }, 0);
        }
    }, [show]);

    // Apply Aho-Corasick highlighting to content when in deep search mode
    useEffect(() => {
        if (!contentRef.current || !ahoCorasickRef.current || searchMode !== 'deep' || !searchQuery) {
            return;
        }

        const ac = ahoCorasickRef.current;
        const contentElement = contentRef.current;

        // Remove any existing highlights first
        contentElement.querySelectorAll('mark.search-highlight').forEach(mark => {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize(); // Merge adjacent text nodes
        });

        // Function to highlight text in a single text node
        const highlightTextNode = (textNode) => {
            const text = textNode.textContent;
            const matches = ac.search(text);

            if (matches.length === 0) return;

            const highlighted = highlightMatches(text, matches);

            // Create a temporary container to parse the HTML
            const temp = document.createElement('span');
            temp.innerHTML = highlighted;

            // Replace the text node with the highlighted content
            const parent = textNode.parentNode;
            while (temp.firstChild) {
                parent.insertBefore(temp.firstChild, textNode);
            }
            parent.removeChild(textNode);
        };

        // Walk through all text nodes in the content
        const walker = document.createTreeWalker(
            contentElement,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip script, style, already highlighted content, and anchor tags
                    // Anchor tags (from helpLink) are managed by Preact - modifying them causes duplication
                    const parent = node.parentNode;
                    if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.tagName === 'MARK' || parent.tagName === 'A') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Only process nodes with actual text content
                    if (node.textContent.trim().length === 0) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // Apply highlighting to all text nodes
        textNodes.forEach(highlightTextNode);

        console.log('[Aho-Corasick] Applied highlighting to', textNodes.length, 'text nodes');
    }, [searchQuery, searchMode, selectedId]); // Re-run when query, mode, or selected content changes

    // Perform search asynchronously when debounced query changes
    useEffect(() => {
        if (!debouncedSearchQuery.trim()) {
            ahoCorasickRef.current = null;
            setSearchResults(null);
            setIsSearching(false);
            return;
        }

        // Use requestAnimationFrame to yield to the browser for smoother typing
        const performSearch = () => {
            if (searchMode === 'fast') {
                // Fast mode: Use pre-indexed search (returns section IDs)
                ahoCorasickRef.current = null;
                if (!indexReady) {
                    setSearchResults(null);
                    setIsSearching(false);
                    return;
                }
                const matchingIds = searchIndexRanked(debouncedSearchQuery, searchIndexRef.current);

                if (matchingIds.length === 0) {
                    setSearchResults([]);
                } else {
                    // Filter flatStructure to only matching sections
                    setSearchResults(flatStructure.filter(item => matchingIds.includes(item.id)));
                }
            } else {
                // Deep mode: Snippet-based search with Aho-Corasick highlighting
                const results = searchDeepWithSnippets(debouncedSearchQuery, HELP_STRUCTURE);

                // Build Aho-Corasick automaton for highlighting
                const ac = new AhoCorasick();
                const queryTerms = [debouncedSearchQuery.trim().replace(/\s+/g, ' ')];
                queryTerms.forEach(term => {
                    if (term.length > 0) {
                        ac.addPattern(term);
                    }
                });
                ac.buildFailureLinks();
                ahoCorasickRef.current = ac;

                console.log('[Deep Search] Built Aho-Corasick automaton for highlighting with', queryTerms.length, 'patterns');

                setSearchResults(results);
            }
            setIsSearching(false);
        };

        // Use requestAnimationFrame to avoid blocking the main thread during typing
        const rafId = requestAnimationFrame(() => {
            // Use setTimeout(0) to further yield to allow any pending UI updates
            setTimeout(performSearch, 0);
        });

        return () => cancelAnimationFrame(rafId);
    }, [debouncedSearchQuery, searchMode, indexReady, flatStructure]);

    // Display either search results or full structure
    // In deep mode with search, we show snippet-based results
    // In fast mode or no search, we show section-based structure
    const displayStructure = searchResults || flatStructure;
    const isSnippetMode = searchQuery && searchMode === 'deep' && searchResults && searchResults.length > 0 && searchResults[0].snippet;

    // Find currently selected chapter/section
    const selectedItem = HELP_STRUCTURE.find(item =>
        item.id === selectedId || (item.subsections && item.subsections.some(sub => sub.id === selectedId))
    );

    // If a subsection is selected, get its parent component
    const ContentComponent = selectedItem?.component;

    // Create helpLink function for internal navigation
    const helpLink = useCallback((anchorId, linkText) => {
        return html`<a
      href="#"
      class="help-internal-link"
      onClick=${(e) => {
                e.preventDefault();

                // Find if this anchor belongs to a specific section
                const targetSection = flatStructure.find(item => item.id === anchorId);

                if (targetSection) {
                    // If it's a different chapter/section, switch to it first
                    if (targetSection.parentId) {
                        setSelectedId(targetSection.parentId);
                    } else {
                        setSelectedId(targetSection.id);
                    }

                    // Then scroll to the anchor after a brief delay to let content render
                    setTimeout(() => {
                        const element = document.getElementById(anchorId);
                        if (element && contentRef.current) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 100);
                } else {
                    // Anchor not found in structure - determine parent chapter from prefix
                    let targetChapterId = null;

                    if (anchorId.startsWith('glossary_')) {
                        targetChapterId = 'glossary';
                    } else if (anchorId.startsWith('appendix_')) {
                        targetChapterId = 'appendices';
                    } else if (anchorId.startsWith('chap01_') || anchorId === 'chap01') {
                        targetChapterId = 'intro';
                    } else if (anchorId.startsWith('chap02_') || anchorId === 'chap02') {
                        targetChapterId = 'getting-started';
                    } else if (anchorId.startsWith('chap03_') || anchorId === 'chap03') {
                        targetChapterId = 'main-screen';
                    } else if (anchorId.startsWith('chap04_') || anchorId === 'chap04') {
                        targetChapterId = 'chap04';
                    } else if (anchorId.startsWith('chap05_') || anchorId === 'chap05') {
                        targetChapterId = 'chap05';
                    } else if (anchorId.startsWith('chap06_') || anchorId === 'chap06') {
                        targetChapterId = 'chap06';
                    } else if (anchorId.startsWith('chap07_') || anchorId === 'chap07') {
                        targetChapterId = 'chap07';
                    } else if (anchorId.startsWith('chap08_') || anchorId === 'chap08') {
                        targetChapterId = 'chap08';
                    } else if (anchorId.startsWith('chap09_') || anchorId === 'chap09') {
                        targetChapterId = 'chap09';
                    } else if (anchorId.startsWith('chap10_') || anchorId === 'chap10') {
                        targetChapterId = 'chap10';
                    } else if (anchorId.startsWith('chap11_') || anchorId === 'chap11') {
                        targetChapterId = 'chap11';
                    }

                    if (targetChapterId) {
                        // Navigate to the chapter first, then scroll to anchor
                        setSelectedId(targetChapterId);
                        setTimeout(() => {
                            const element = document.getElementById(anchorId);
                            if (element && contentRef.current) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }, 100);
                    } else {
                        // Try to scroll within current content as fallback
                        const element = document.getElementById(anchorId);
                        if (element && contentRef.current) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                            console.warn('Help anchor not found:', anchorId);
                        }
                    }
                }
            }}
    > ${linkText} </a>`;
    }, [flatStructure]);

    // Handle sidebar item click
    const handleItemClick = useCallback((item) => {
        if (item.component || item.parentId) {
            // This is a main chapter or subsection with content
            setSelectedId(item.id);

            // If it's a subsection, scroll to it after selecting parent
            if (item.parentId) {
                setTimeout(() => {
                    const element = document.getElementById(item.id);
                    if (element && contentRef.current) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            } else {
                // Main chapter selected, scroll to top
                if (contentRef.current) {
                    contentRef.current.scrollTop = 0;
                }
            }
        }
    }, []);

    // Handle clicking on a snippet-based search result
    const handleSnippetClick = useCallback((result, resultIndex) => {
        console.log('[Navigation] Navigating to match:', result);

        setSelectedId(result.chapterId);
        setSelectedMatchIndex(resultIndex);

        // Wait for content to render, then scroll to the specific match
        setTimeout(() => {
            if (!contentRef.current || !ahoCorasickRef.current) return;

            // Find all highlighted marks
            const highlights = contentRef.current.querySelectorAll('mark.search-highlight');

            if (highlights.length > 0) {
                // Try to find the specific match based on charOffset
                let targetHighlight = highlights[0];

                // Calculate which highlight corresponds to this result
                // For now, just use the first one, but we could be more precise
                // by comparing text content or position

                // Remove focused-match class from all
                highlights.forEach(h => h.classList.remove('focused-match'));

                // Add focused-match to target
                targetHighlight.classList.add('focused-match');

                // Scroll to it
                targetHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });

                console.log('[Navigation] Scrolled to match, total highlights:', highlights.length);
            }
        }, 200);
    }, []);

    const searchInputFocusedOn = searchInputRef.current === document.activeElement;

    if (!show) return null;

    return html`
    <${Modal}
      show=${show}
      onClose=${onClose}
      enableClickOutsideClose=${!searchInputFocusedOn}
      class="help-modal"
      style=${{ "--modal-w": "80vw", "--modal-h": "80vh" }}
    >
      <nav class="help-sidebar" role="navigation" aria-label="Help">
        <div class="help-search-container">
          <input
            ref=${searchInputRef}
            type="text"
            class="help-search-input"
            placeholder=${!indexReady ? "Building search index..." : isSearching ? "Searching..." : "Search help..."}
            value=${searchQuery}
            disabled=${!indexReady}
            onInput=${(e) => setSearchQuery(e.target.value)}
          />
          ${searchQuery && html`
            <${Button}
              type="button"
              class="help-search-clear"
              onClick=${() => {
                setSearchQuery('')
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }}
              title="Clear search"
            >×</button>
          `}
        </div>
        <!--<div class="help-search-mode-toggle">
          <label class="help-search-mode-label">Search Mode:</label>
          <${Button}
            type="button"
            class=${`help-mode-btn ${searchMode === 'fast' ? 'active' : ''}`}
            onClick=${() => setSearchMode('fast')}
            title="Fast search using pre-indexed content (instant results)"
          >
            ⚡ Fast
          </button>
          <${Button}
            type="button"
            class=${`help-mode-btn ${searchMode === 'deep' ? 'active' : ''}`}
            onClick=${() => setSearchMode('deep')}
            title="Deep search through all content (slower, more thorough)"
          >
            🔍 Deep
          </button>
        </div>-->
        <!--${searchQuery && html`
          <div class="help-search-status">
            <small>Using <strong>${searchMode === 'fast' ? 'Fast' : 'Deep'}</strong> search${searchMode === 'fast' && !indexReady ? ' (building index...)' : ''}</small>
          </div>
        `}-->
        ${searchQuery && searchResults && searchResults.length === 0 && html`
          <div class="help-no-results">
            No results found for "${searchQuery}"
          </div>
        `}
        ${isSnippetMode ? html`
          <ul class="help-search-results">
            ${displayStructure.map((result, index) => {
                const isActive = selectedId === result.chapterId && selectedMatchIndex === index;

                // Ensure snippet text is a string
                const snippetText = String(result.snippet?.text || '');

                // Skip if snippet is invalid
                if (!snippetText || snippetText.includes('[object Object]')) {
                    console.warn('[Snippet] Invalid snippet for result:', result);
                    return null;
                }

                const beforeMatch = snippetText.substring(0, result.snippet.matchStart);
                const matchText = snippetText.substring(result.snippet.matchStart, result.snippet.matchEnd);
                const afterMatch = snippetText.substring(result.snippet.matchEnd);

                return html`
              <li key=${`${result.sectionId}-${index}`} class="search-result-item ${isActive ? 'active' : ''}">
                <${Button}
                  type="button"
                  class="search-result-button"
                  onClick=${() => handleSnippetClick(result, index)}
                >
                  <div class="search-result-path">
                    <span class="search-result-chapter">${result.chapterLabel}</span>
                    ${result.sectionLabel !== result.chapterLabel && html`
                      <span class="search-result-separator">›</span>
                      <span class="search-result-section">${result.sectionLabel}</span>
                    `}
                  </div>
                  <div class="search-result-snippet">
                    ${beforeMatch}<mark class="snippet-match">${matchText}</mark>${afterMatch}
                  </div>
                </button>
              </li>
            `;
            })}
          </ul>
        ` : html`
          <ul class="help-flat">
            ${displayStructure.map(item => {
                const isActive = item.id === selectedId || item.parentId === selectedId;
                const isHeader = item.component && !item.parentId;

                return html`
              <li key=${item.id}>
                <${Button}
                  type="button"
                  style=${{ paddingLeft: `${10 + item.depth * 16}px` }}
                  class=${`help-item ${isActive ? 'active' : ''} ${isHeader ? 'is-header' : ''}`}
                  onClick=${() => handleItemClick(item)}
                >${item.label}</button>
              </li>
            `;
            })}
          </ul>
        `}
      </nav>
      <div class="help-content" ref=${contentRef}>
        <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
        <p><strong>Note: This documentation is a port of the W$R v9.75 Strategy Manual PDF
          and is a work in progress. Some UI descriptions and navigation instructions may differ
          from W$R v10 Remastered.</strong></p>
        </blockquote>
        ${ContentComponent && html`<${ContentComponent} helpLink=${helpLink} />`}
      </div>
    <//>
  `;
}
