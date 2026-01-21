// HelpModal.jsx (Preact + htm) - Refactored with hardcoded hierarchy
import { html, useState, useRef, useCallback } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import HelpChapter1Content from './HelpChapter1Content.js';
import HelpChapter2Content from './HelpChapter2Content.js';
import HelpChapter3Content from './HelpChapter3Content.js';
import HelpChapter4Content from './HelpChapter4Content.js';

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
  }
];

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

export default function HelpModal({ show, onClose }) {
  const [selectedId, setSelectedId] = useState('intro');
  const contentRef = useRef(null);

  const flatStructure = flattenStructure(HELP_STRUCTURE);

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
          // If anchor not found in structure, try to scroll within current content
          const element = document.getElementById(anchorId);
          if (element && contentRef.current) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.warn('Help anchor not found:', anchorId);
          }
        }
      }}
    >${linkText}</a>`;
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

  if (!show) return null;

  return html`
    <${Modal}
      show=${show}
      onClose=${onClose}
      class="help-modal"
      style=${{ "--modal-w": "80vw", "--modal-h": "80vh" }}
    >
      <nav class="help-sidebar" role="navigation" aria-label="Help">
        <ul class="help-flat">
          ${flatStructure.map(item => {
            const isActive = item.id === selectedId || item.parentId === selectedId;
            const isHeader = item.component && !item.parentId;

            return html`
              <li key=${item.id}>
                <button
                  type="button"
                  style=${{ paddingLeft: `${10 + item.depth * 16}px` }}
                  class=${`help-item ${isActive ? 'active' : ''} ${isHeader ? 'is-header' : ''}`}
                  onClick=${() => handleItemClick(item)}
                >${item.label}</button>
              </li>
            `;
          })}
        </ul>
      </nav>
      <div class="help-content" ref=${contentRef}>
        ${ContentComponent && html`<${ContentComponent} helpLink=${helpLink} />`}
      </div>
    <//>
  `;
}
