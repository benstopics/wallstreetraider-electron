import { html } from '../lib/preact.standalone.module.js';

export default function HelpChapter10Content({ helpLink }) {
    return html`<div>
        <h2 align="center"><strong>CHAPTER X.</strong></h2>

        <div id="chap10_X(A)">
            <h3><strong>A. IN GENERAL.</strong></h3>
            <br/>

            <p>Wall ${'$'}treet Raider has a wide range of research features you can use, to help
            you find and manage your investments. Six buttons on the main screen are grouped
            together in the "Research" area, two of which ("Select Player" and  "Select Corp.")
            can be used to select the ${helpLink('chap03_III(A)', 'Active Entity')} that you
            wish to investigate, if you control the entity, that will be the entity that will
            do one or more transactions, as the ${helpLink('chap03_III(A)', 'Transacting Entity')}.</p>
            <br/>

            <p>Two other Research buttons are "Entity Info," which brings up a menu
            of research tools that focus on a particular company or on you, the player;
            and the "General" button for general research on a particular industry or
            comparisons of industries, or general economic data, plus certain other
            information or research tools. Finally, two additional buttons appear in
            this group, a "My News" button, to list headlines affecting you and your
            companies, and a "Select Last" button to reselect, as the
            ${helpLink('chap03_III(A)', 'Active Entity')}, the corporate entity that
            was previously the Active Entity before the current selection.</p>
            <br/>

            <p>The functions of each of these six buttons, and the two research
            Menus that pop up when you click on the "Entity Info" or "General"
            research buttons, are discussed in the following  paragraphs.</p>
        </div>
        <br/>

        <div id="chap10_X(B)">
            <h3><strong>B. "SELECT PLAYER."</strong></h3>
            <br/>

            <p>This button provides a quick
            way for you to change the ${helpLink('chap03_III(A)', 'Active Entity')}
            from a corporation to you, the player. Just click on this button
            and you become the Active Entity. After you do so, when you select
            any of the research or transaction functions, such as "List
            Portfolio" or "Buy Stock," the information shown in a research
            feature will be about you, or the entity doing a transaction
            will be you, as the Active Entity.</p>
        </div>
        <br/>

        <div id="chap10_X(C)">
            <h3><strong>C. "SELECT CORP."</strong></h3>
            <br/>

            <p>Click on this button
            to change the ${helpLink('chap03_III(A)', 'Active Entity')} being researched,
            or to select a corporation (that you control) that will do transactions.
            When you do so, an input box will pop up, and you can either type
            in the company's stock symbol (if you know it), and click on OK
            or the [RETURN] key, or else click on the "Look Up" button, to
            display a scrollable drop-list of all currently existing corporations,
            listed in alphabetical order. If you click on the "Look Up" button,
            you can then begin typing in the first 3 or 4 or more letters of the
            company's name, in order to jump quickly to the company's name/stock
            symbol in the list, and then either click on "OK" or press the [RETURN]
            key to select that company as the Active Entity.</p>
            <br/>

            <p>The Active Entity does not have to be a company that you control.
            Thus, once selected, you can do any of several types of research on it,
            by clicking on any of the "Research Report," "Earnings Report," "Credit
            Info" or "Financial Profile" buttons, and information for that company will
            instantly be displayed. However, if you go to a Transactions Menu while
            the Active Entity is a company you do not control, and you click on a
            transaction button, such as "Buy Stock," the entity doing the buying will
            be the LAST Active Entity you selected that you DO control (if you still
            control it), or if there was none, or you no longer control that company,
            the buying/selling (transacting) entity will be you, the player.</p>
            <br/>

            <p>This system greatly simplifies and reduces the number of necessary steps
            required to do a transaction, such as buying a stock. For example, if you
            control ABC Company, you might make it the ${helpLink('chap03_III(A)', 'Active Entity')},
            and check to see if it has available cash or credit to buy stock in another
            company. Then you could do some research on several companies, selecting each
            as ${helpLink('chap03_III(A)', 'Active Entity')}, until you find one that you
            want ABC to buy, which we will call XYZ Corp. Once you have decided, you
            don't need to change the Active Entity back to ABC -- you can instead click
            on the "BUY / SELL" button to pull up the "Buy / Sell" transactions menu,
            click on the "Buy Stock" button, and the last company you have selected
            as "Active Entity," XYZ Corp., will have its stock symbols already displayed
            in the symbol entry box, as the stock that ABC is buying, so all you will
            need to do to initiate the trade is click on the "OK" button. (In effect,
            the program tries to "read your mind" and anticipate which company you
            are planning to buy, buy bonds of, merge with, etc., based on the last
            company whose Research Report or financial statements you viewed.)</p>
            <br/>

            <p>Notice that if you use the either the "SELECT PLAYER" button or the
            "SELECT CORP." button on the main menu screen when a Menu is open,
            doing so will close the Menu dialog.  Thus, unless you WANT to
            close a particular Menu dialog, you can instead use the "SELECT
            PLAYER" or "MY CORPS." buttons that also appear on each pop-up
            research or transactions Menu. Doing so will not just close
            the Menu dialog, but will instead close it and instantly
            reopen a new version of the Menu after you have changed the
            ${helpLink('chap03_III(A)', 'Active Entity')}, revised to reflect
            the newly selected ${helpLink('chap03_III(A)', 'Active Entity')}.
            The Menu choices will differ considerably, depending on the
            type of entity: player, bank, insurer, holding/trading company,
            ETF, or other (industrial) company.</p>
            <br/>

            <p>Notice that when you select a company as the "Active Entity," it will
            automatically be listed as one of the 15 companies on your "Streaming
            Stock Quotes" watch list, unless the list is already full or unless
            you have recently deleted that company from the watch list, in which
            case it will not be added back to the list</p>
        </div>
        <br/>

        <div id="chap10_X(D)">
            <h3><strong>D. "ENTITY INFO" BUTTON AND MENU.</strong></h3>
            <br/>

            <p>Click on this button
            to bring up a pop-up Menu with as many as 13 buttons on the right side
            of the Menu dialog box. Each of those buttons, if clicked, will display
            financial statements, research reports, or other types of information
            pertaining to the company or player that is the currently selected
            ${helpLink('chap03_III(A)', 'Active Entity')}. In addition,
            the dialog box will contain a text window, with instructions for
            using the Entity Info Menu (during the first year of a game
            only), and will give company information, such as its latest
            earnings (and trend), next quarter's projected earnings, who
            controls the company, and an analysis of the company's industry
            situation or an industry forecast (except for Holding/Trading
            Companies). Industry projections are only given for banks or
            insurance companies when there are somewhat extreme economic
            conditions.</p>
            <br/>

            <p>However, if the Active Entity is you, the player, and not a
            corporation, several of the buttons on this Menu will be absent
            or different, since there are no Research Reports, Shareholder lists,
            or quarterly Earnings Reports for individuals, only for corporations.
            Also, for an individual player, the text box on the left side of the
            Menu will contain different information than for a corporation --
            information about your personal tax liability and the estimated income
            tax you will owe for the current year, based on current and projected
            data.</p>
            <br/>

            <p>You can select any of the 16 buttons described below to obtain
            detailed financial and investment information about the currently
            selected "active  entity." Note that anywhere from 8 to 10 of the
            buttons listed below will appear on the "Entity Info" pop-up menu,
            depending on whether the currently selected ${helpLink('chap03_III(A)', 'Active Entity')}
            is a player, a holding company, a bank, an insurance company, or
            an industrial corporation (any corporation in any other industry).</p>
            <br/>

            <div id="chap10_X(D)(1)">
                <h4><strong>1. CHANGING THE ACTIVE ENTITY.</strong></h4>
                <br/>

                <p>At any time
                while you are viewing the "Entity Info" pop-up menu, if you wish
                to view information for another entity, click on the "Player"
                button near the bottom of the pop-up menu to select yourself as
                the ${helpLink('chap03_III(A)', 'Active Entity')}, or click on the
                "Select Corp." button, also at the bottom of the pop-up dialog,
                to select any corporation as the Active Entity. If you, the
                player, are the Active Entity, a "My Corporations" button will
                also be displayed. Clicking on it will display a list of only
                those corporations you control, from which you may select one
                by clicking on it. (If you only control one corporation, it will
                automatically become the Active Entity when you click on "My Corps.")</p>
                <br/>

                <p>As soon as you have made your new selection, the pop-up Menu
                will be re-drawn, and changed to reflect the newly selected entity.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(2)">
                <h4><strong>2. RESEARCH REPORT.</strong></h4>
                <br/>

                <p>Click on this item to view a
                "research report" on the current ${helpLink('chap03_III(A)', 'Active Entity')},
                if it is a corporation, and not you, the player.
                The research report is an analytical report on the company's
                financial performance and situation, as well as a
                recommendation as to the company's stock, if it is publicly
                traded, which will be either "Strong Buy," "Buy," "Hold," or
                "Sell."  Such recommendations tend to be right more often than
                not, but as in the real world, are frequently wrong, so you
                should not totally rely on the "Analyst's Recommendation" on
                any stock. As they say on Wall Street, "Those who know don't
                tell, and those who tell don't know."  So you still have to
                rely on your own judgment. Analysts tend to be inherently
                over-optimistic.</p>
                <br/>

                <p>The Research Report will also include a listing of any
                recent news headlines that include the stock symbol of the
                company in question. The Research Report also includes a
                per-share earnings projection for the company, for the coming
                quarter. As in the real world, such "analysts' estimates" are
                often off the mark, especially in the case of diversified
                companies with numerous subsidiaries and other holdings, and
                tend to be more accurate for relatively simple companies
                engaged in a single line of business, with no subsidiaries or
                bond holdings, loans, etc., to muddy the waters. (Earnings
                projections are updated at least 2 or 3 times for every
                company during each quarter, or more often when the company
                is involved in certain major transactions, such as mergers.)</p>
                <br/>

                <p>This button is visible if the current ${helpLink('chap03_III(A)', 'Active Entity')}
                is a corporation. If the Active Entity is a player, this button is not
                shown. This button also appears (at all times) on the main
                Wall ${'$'}treet Raider screen, so you do not have to open the Entity
                Info Menu to access it. If you click on this button on the main
                screen when the currently selected Active Entity is you, the
                player, a Research Report will be displayed for the last company
                that had been the ${helpLink('chap03_III(A)', 'Active Entity')}, since
                there are no research reports on players, only on corporations.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(3)">
                <h4><strong>3. FINANCIAL PROFILE.</strong></h4>
                <br/>

                <p>Click on this button to see
                a detailed financial profile of the currently selected "active
                entity" -- either the current player whose turn it is, or any
                corporation.  The profile will include a financial balance sheet,
                showing the value of the player or company's assets, the amount
                of any debts or other liabilities, such as accrued taxes of
                corporations, and the net worth of the player or company -- total
                assets minus total liabilities.</p>
                <br/>

                <p>The "financial profile" will show a considerable amount of
                additional information about the player or company, which will
                vary, based on the type of entity (player, bank, insurance
                company, holding/trading company, or industrial company). Items
                shown for an individual player will include year-to-date taxable
                ordinary income or loss, the amount of any capital gains or
                capital losses, and the player's employment status and estimated
                (approximate) CEO salary, if any.</p>
                <br/>

                <p>The profile for a bank will show as assets the totals of its
                business loans, consumer loans, and mortgage loans. As liabilities
                for a bank, the amount of its demand deposits, certificates of
                deposit (interest-bearing accounts), and interbank debt will be
                shown.  The profile for an insurance company will show as a liability
                the amount of its insurance policy reserves. Profiles for any
                industrial companies (those other than banks, insurers and
                holding/trading companies) will show as assets the company's
                Business Assets/Equipment, and its Working Capital (accounts
                receivable from customers and inventories, if any).</p>
                <br/>

                <p>Profiles for any player, bank or insurance company will show
                the amount of government bonds and corporate bonds, if any,
                that are owned, as assets.</p>
                <br/>

                <p>Depending on the type of corporation, certain variables
                that may be set by the controlling player are shown, such as
                the percent of sales or revenues spent on R & D or marketing;
                the dividend payout ratio, as a percent of net income; and
                (except for banks) the company's growth rate in investment
                in business assets, or growth rate in insurance in force
                (policy reserves) for an insurance company.</p>
                <br/>

                <p>The financial profile for any corporation will show a number
                of other important items of information about the company, such
                as its earnings for the current year and the past four full years;
                net worth per share, and the current stock market price per share
                of its stock; the amount of any bonds issued and owed by the
                company, and the market price of such bonds; the number of shares
                of stock issued, and the "total stock capitalization" of the
                company -- the market value of all its stock.  Various other
                items shown for all types of companies include certain financial
                ratios, such as the price-to-earnings ratio for its stock,
                debt-to-equity ratio, return on equity, and, if the company is
                paying dividends on its stock, the dividend yield.</p>
                <br/>

                <p>Other miscellaneous information is also given, such as a company's
                industry group category; who, if anyone controls the company;
                the country where the company is incorporated; the amount of any
                tax loss carryovers from prior years; and the amount of salary
                the company pays to its CEO or President. The main WSR screen
                shows the current day of the year and the day on which the next
                earnings report is due to be released, as "Next Earnings."</p>
                <br/>

                <p>If a company has issued bonds, a footnote will be provided
                at the bottom of the profile, giving details about the bonds,
                such as interest rate paid, yield at current market price, and
                when the bonds must be paid off. If there are antitrust lawsuits
                against the company, either pending or threatened, this will
                also be disclosed in a footnote.</p>
                <br/>

                <p>Financial profiles for both players and companies provide
                credit information such as credit rating, ranging from "AAA"
                to "D"; the unused line of credit, if any, from the player's
                or company's lending bank; the interest paid on borrowings;
                and the name of the player or company's bank, from which it
                borrows. Also will be shown for a player is his or her
                employment status, either "Unemployed" or the name of the
                company of which the player is the CEO and the year in which
                the player first became CEO.</p>
                <br/>

                <p>Note that you can click on the name of any company that appears
                in the financial profile, and that company will then become the
                selected ${helpLink('chap03_III(A)', 'Active Entity')} when you close
                that window, in the event you want to look up various types of
                information on that company. (Or double-click on the company's name
                to select that company and close the window.) If the current player's
                name (you) appears in the financial profile of a corporation, you
                can also click on your name to select yourself as the Active Entity.</p>
                <br/>

                <p>This button also appears (at all times) on the main Wall ${'$'}treet Raider
                screen, so you do not have to open the Entity Info Menu to access it.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(4)">
                <h4><strong>4. EARNINGS REPORT.</strong></h4>
                <br/>

                <p>Click on this button to see
                the most recent news release of quarterly earnings for the
                company (and of annual earnings, at the end of the 4th quarter
                of each year). The report will give the company's per-share
                earnings (and total amount earned) for the most recent quarter,
                and gives comparative per-share earnings for the same quarter
                of the prior year, as well as the most recent calendar quarter,
                plus a comparison of year-to-date earnings for the current
                year versus the prior year. It also shows the company's profit
                margin (which equals the return on business assets in Wall
                ${'$'}treet Raider), and other information items such as the amount
                of taxes paid, if any, and rate of growth of its sales.</p>
                <br/>

                <p>Other items of information, specific to banks or insurance
                companies, are shown for those types of companies, such as
                underwriting profits and growth of insurance in force for
                an insurance company, or additions to bad debt reserves for
                banks.  Various cash-raising actions may also be shown, such
                as sales of business assets, or sales of stocks or bonds, or
                bank borrowings (or repayments on bank loans).</p>
                <br/>

                <p>Dividends paid or any changes in dividend payments will
                also be mentioned in the earnings report.</p>
                <br/>

                <p>The Earnings Report will include a listing of any recent
                news headlines that include the name or stock symbol of the
                company in question.</p>
                <br/>

                <p>This button is shown if the current ${helpLink('chap03_III(A)', 'Active Entity')}
                is a corporation. It does not appear if the Active Entity
                is the player.  This button also appears (at all times) on the main
                Wall ${'$'}treet Raider screen, so you do not have to open the Entity
                Info Menu to access it. If you click on this button on the main
                screen when the currently selected Active Entity is you, the
                player, an Earnings Report will be displayed for the last company
                that had been the Active Entity, since there are no earnings reports
                on players, only on corporations.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(5)">
                <h4><strong>5. LIST SHAREHOLDERS.</strong></h4>
                <br/>

                <p>Click on this button to see
                a list of shareholders of the company that is the currently
                selected ${helpLink('chap03_III(A)', 'Active Entity')}.  The
                list will show the percentage of the company that is owned
                by each major shareholder, and the percentage owned by "the
                Public."</p>
                <br/>

                <p>Note that you can click on the name of any company that is shown
                in the shareholder list screen, and that company will then become
                the selected Active Entity as soon as you click on the "OK" button
                to close that window, in the event you want to look up various types
                of information on that company. (Or double-click on the company's
                name to select that company and close the window.) Clicking on a
                player's name will not cause that player to become the "active
                entity" unless it is the name of the player whose turn it is at
                the moment (you). You cannot make another player the Active Entity
                during your turn. (However, once the game is ended, clicking on the
                name of another player who is a shareholder <u>will</u> make that
                player the ${helpLink('chap03_III(A)', 'Active Entity')}, in which
                case you will then be able to view his or her options and bond
                portfolios and all other financial information. Otherwise,
                during a game, another player's holdings and tax situation are
                generally private information, not accessible to the other
                players, except for stock holdings.)</p>
                <br/>

                <p>This button is visible only if the current Active Entity" is
                a corporation; it will not be shown if the current Active Entity
                is an individual player (since no one can own shares in the player
                -- slavery is illegal, even in Wall ${'$'}treet Raider). This button
                also appears (at all times) on the main Wall ${'$'}treet Raider
                screen, so you do not have to open the Entity Info Menu to
                access it. If you click on this button on the main screen when
                the currently selected Active Entity is you, the player, a
                Shareholder List will be displayed for the last company that had
                been the ${helpLink('chap03_III(A)', 'Active Entity')}.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(6)">
                <h4><strong>6. LIST PORTFOLIO.</strong></h4>
                <br/>

                <p>Clicking on this button allows you to
                instantly view the stock and bond portfolio of the currently selected
                ${helpLink('chap03_III(A)', 'Active Entity')}, which can be either the
                current player or any company that is the Active Entity.  Doing so
                will give a listing of each company in which the player or company
                owns stock (or is "short"), the stock symbol of each stock owned or
                shorted, the percent of the company's stock the player or other
                Active Entity owns or is short, the current price per share of the
                stock, the dividend yield percentage for the stock and the total
                value of the shares owned.</p>
                <br/>

                <p>The total value of all the stocks owned will also be shown, as well as
                any "Analyst's Rating" (buy/sell recommendations) regarding each stock,
                if it is publicly traded. Short positions are shown as negative amounts.</p>
                <br/>

                <p>If the Active Entity is the player, the portfolio list will also
                show the total values of any options owned or shorted by the player.
                If the net value of "short" positions is greater than "long" (owned)
                option positions, the net value figure will be a negative amount.</p>
                <br/>

                <p>If the Active Entity is one that can invest in bonds, such as an
                individual player, a bank or an insurance company, the portfolio listing
                will also have a section that shows each government or corporate bond
                owned, a description of the bond, the current market price of the bond,
                the amount (face value) owned and market value of that particular bond
                holding, and the bond's yield to maturity.  The total value of the bond
                portfolio is also shown.</p>
                <br/>

                <p>In addition, this screen will show the total value of the entire stock,
                option, and bond portfolios of the selected Active Entity.</p>
                <br/>

                <p>You can click on the name of any company whose stock or bonds
                are listed in the portfolio and that company will then become
                the selected Active Entity as soon as the portfolio list window
                is closed by clicking on the "OK" button, in the event you want
                to look up various types of information on that company. (Or
                double-click on the company's name to instantly select that
                company and close the window.)</p>
                <br/>

                <p>This button also appears (at all times) on the main Wall
                ${'$'}treet Raider screen, so you do not have to open the Entity
                Info Menu to access it.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(7)">
                <h4><strong>7. DIAGRAM OF HOLDINGS.</strong></h4>
                <br/>

                <p>Clicking on this button causes
                a graphic diagram to be drawn and displayed, showing an entity's
                stock holdings (and in the case of a corporation, who owns it).
                Each stockholder or holding is shown in a small box, above or
                below the name of the ${helpLink('chap03_III(A)', 'Active Entity')},
                with stockholders shown above, and stock portfolio holdings shown
                below. Each such box in the diagram contains a company's stock
                symbol and the percentage of ownership of the Active Entity.
                Short positions in a stock are also shown, with ownership
                represented as a negative percentage.</p>
                <br/>

                <p>Click on the box for any company (or player, where the player
                is you), and the diagram is immediately redrawn with that company
                or player now shown as the Active Entity, with your or its stock
                holdings and/or the holders of its stock. (The one exception is if
                you click on a shareholder who is one of the competing players --
                you don't get to see a list of the other players' portfolios --
                that is private information, which you will have to dig for, to
                find.)</p>
            </div>
            <br/>

            <div id="chap10_X(D)(8)">
                <h4><strong>8. CREDIT INFO.</strong></h4>
                <br/>

                <p>Click on this button
                to see credit information for the currently selected ${helpLink('chap03_III(A)', 'Active Entity')}
                (player or a corporation).  The entity's credit rating and unused
                line of credit, if any, will be shown, as well as the interest rate
                he/she/it must pay on bank loans, and the identity of the player or
                company's lending bank.  However, if the Active Entity for which
                credit information is being shown is a bank, then the only information
                that will be shown for it is its credit rating and the rate it pays
                on interbank loans (<em>i.e.,</em> the SOFR rate).</p>
            </div>
            <br/>

            <div id="chap10_X(D)(9)">
                <h4><strong>9. INDUSTRY SUMMARY.</strong></h4>
                <br/>

                <p>The "Industry Summary"
                command button, when it is clicked, gives you several comparative
                financial yardsticks for all the companies in a particular industry.
                For example, you can quickly eyeball the book values (net
                worth) per share of each company in the industry you
                selected, since the display shows each company's book value
                per share as a percentage of its stock price per share.  Also
                listed is each company's "P/E RATIO" (price-earnings ratio), its
                "RETURN ON EQUITY" (after tax earnings as a % of the company's
                current net worth), its dividend yield percentage, and current
                credit rating.  For each company shown in the summary, the current
                "Analyst's Rating" (Buy, Sell, Hold, etc.) will be shown, if the
                company's stock is publicly traded.</p>
                <br/>

                <p>Adjacent to the percentage numbers in the "Price to Net Worth"
                column of figures, you may see any of 3 notations:</p>

                <ul>
                    <li>A "_P" notation (signifying a company controlled by you,
                    the player);</li>
                    <br/>

                    <li>A "_H" notation (signifying a "hostile" company controlled
                    by another player); or</li>
                    <br/>

                    <li>A "_C" notation (signifying a company that is controlled
                    by another company, but not controlled by any player).</li>
                </ul>
                <br/>

                <p>The above markers make it easier for you to see, at a
                glance, which companies in the industry are controlled by
                whom, or by other companies.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(10)">
                <h4><strong>10. INDUSTRY PROJECTION.</strong></h4>
                <br/>

                <p>If you click on this button, you
                will see displayed, for the current "selected industry" group (which will
                be the industry of the current ${helpLink('chap03_III(A)', 'Active Entity')},
                if that entity is a corporation), a projection for each company in
                the industry of its rate of return on investment in "business assets"
                and its estimated market share percentage, projected 6 months into the
                future. This screen also displays certain information that is also
                displayed in the "Industry Summary" projection, such as credit rating,
                price as a percent of net worth per share, and dividend yield, for
                each company shown.</p>
                <br/>

                <p>Adjacent to the percentage numbers in the "Projected Market Share"
                column of figures, you may see any of 3 notations:</p>

                <ul>
                    <li>A "_P" notation (signifying a company controlled by you,
                    the player);</li>
                    <br/>

                    <li>A "_H" notation (signifying a "hostile" company controlled
                    by another player); or</li>
                    <br/>

                    <li>A "_C" notation (signifying a company that is controlled
                    by another company, but not controlled by any player).</li>
                </ul>
                <br/>

                <p>The above markers make it easier for you to see, at a
                glance, which companies in the industry are controlled by
                whom, or by other companies.</p>
                <br/>

                <p>On the "Industry Projection" information display, you will also
                see the current rate of growth in capacity (growth in business
                assets such as plant and equipment) for each company in the
                industry. The "Industry Projection" function also shows the
                percentage, if any, of sales or revenues being spent on productivity
                improvements, for each company in the industry being reported on.
                This expenditure would be for R & D (research and development)
                for companies in tech-oriented industries, or for marketing and/or
                advertising for companies in those industries where R & D spending
                is not relevant, such as retailing.</p>
                <br/>

                <p>The projections of rate of return on capital assets are based on
                the anticipated rate of growth in demand for the industry's product
                and the planned rate of growth in supply (capacity) for all the
                companies in the industry, as well as the planned growth rate and
                productivity spending for the individual company. As such, these
                projections are never precisely accurate, since the industry demand
                growth projection can change at the drop of a hat, and since
                companies in the industry are constantly revising their capacity
                growth plans in reaction to changes in their own situation,
                industry demand, and in the economy.</p>
                <br/>

                <p>As in the real world, these types of projections can be
                very useful, but take them with a grain of salt. However,
                you can usually tell at a glance whether the growth in
                capacity is outstripping the projected rate of demand
                growth (or vice versa). For example, if all the major
                companies in an industry are planning to expand capacity at
                an annual rate of 30 to 40%, and projected demand growth
                is only 5%, it's a safe bet that that industry is going to
                have a severe problem of oversupply within a few months or
                calendar quarters, unless something changes very soon.</p>
                <br/>

                <p>Projections are not available for the banking, insurance,
                and holding company industry groups, or ETFs. Thus, the
                "Industry Projection" command button does not appear when
                the currently selected Active Entity is a company in any
                of those four types of financial industries. Also, if the
                current Active Entity is you, the player, this button does
                not appear.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(11)">
                <h4><strong>11. LIST BANK LOANS.</strong></h4>
                <br/>

                <p>If the currently selected
                ${helpLink('chap03_III(A)', 'Active Entity')} is a bank,
                this button will allow you to see a list of all
                the bank's corporate (and player) loan customers.</p>
                <br/>

                <p>The list that is displayed when you click on this button will
                show all the business loans made by the bank, giving for each
                loan the name of the borrower (player or company), the amount
                of the loan balance, the borrower's credit rating, the current
                (floating) interest rate on the loan, and the percentage that
                each loan accounts for, of the bank's total loan portfolio.</p>
                <br/>

                <p>If the player who controls the bank has frozen lending to
                any of the bank's loan customers on the list, a "FROZ." notation
                will appear after the data listed for a player or company's
                frozen loan.</p>
                <br/>

                <p>Also shown are the total amount of consumer and mortgage loans,
                and the average interest rates on each. Clicking or double-clicking
                on any company's name in the list will select that company as the
                current ${helpLink('chap03_III(A)', 'Active Entity')}.</p>
                <br/>

                <p><strong><u>NOTE:</u></strong>  This button does not appear if the currently
                selected Active Entity is not a bank.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(12)">
                <h4><strong>12. TAX BASIS INFO.</strong></h4>
                <br/>

                <p>Clicking on this button will
                display the stock and bond portfolio holdings of the currently
                selected ${helpLink('chap03_III(A)', 'Active Entity')}, in the
                same manner as the "List Portfolio" button described above,
                except that the last column of data on the right side of the
                window will display your tax cost, or "tax basis" for
                each stock or bond investment of the Active Entity, instead of
                the "Analyst's Rating" that is shown in that column if you click
                on the "List Portfolio" button. For stocks that have been sold
                short, negative values will be shown for the current value and
                the tax basis. In that case, the "tax basis" is the amount you
                received when you sold the stock short.</p>
                <br/>

                <div style="background-color: rgba(13, 84, 115, 0.1); border-left: 4px solid rgba(13, 84, 115, 0.5); padding: 15px; margin: 10px 0;">
                    <p>NOTE: In Versions after 8.50, W${'$'}R has changed the way bonds
                    owned by banks or insurance companies are valued, on the
                    Financial Profile and in computing the net worth of the bank
                    or insurer. W${'$'}R now values bonds held by banks or insurers at
                    their tax basis (cost, as adjusted for any amortization of
                    bond premium or discount), rather than at their market value.
                    That is because it assumed that bonds will be held until paid
                    off at maturity. However, if bonds are "D"-rated, they will be
                    valued at market value, if the market value is less than their
                    tax basis. This change will smooth out much of the extreme
                    fluctuations in the net worth of banks and insurance companies
                    when interest rates are very high or very low.</p>

                    <p>However, bonds held by players are still shown at their
                    market value on the player's Personal Financial Statement and
                    their market value is used when computing a player's net worth,
                    as in previous versions of Wall Street Raider.</p>
                </div>
                <br/>

                <p>If the Active Entity whose portfolio is being displayed
                owns or has sold short options, a single line item will also
                show the total value and total tax basis of the options
                holdings and/or options that have been sold short. The
                values shown for options may be negative amounts if some
                or all of the options positions are short positions.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(13)">
                <h4><strong>13. LIST ADVANCES TO CORPS.</strong></h4>
                <br/>

                <p>Clicking on this button will display a list of all advances
                (demand loans) you have made to companies you control (or which
                you controlled at the time you made the advances to them). The
                list will show each company that owes you money, the amount
                of the advance, and the company's credit rating. Click or
                double-click on any company's name to select that company as
                the ${helpLink('chap03_III(A)', 'Active Entity')}. For the
                glossary description, with more details on advances,
                ${helpLink('glossary_ADVANCES', 'click here')}.</p>
                <br/>

                <p><strong><u>NOTE:</u></strong> This button only appears when the
                currently selected Active Entity is you, the player.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(14)">
                <h4><strong>14. LIST OPTIONS.</strong></h4>
                <br/>

                <p>Clicking
                on this button allows you to see a listing of all of the put and call
                option positions for the current ${helpLink('chap03_III(A)', 'Active Entity')},
                and to see whether there is a gain or loss on each position at
                the moment. All option prices are shown at the "bid" price
                for the option. That is the price you will receive when selling
                an option, and at the last instant before an option expires,
                if it is "in-the-money," will be equal to the amount the option
                is in-the-money. However, when you buy (or buy back, if short)
                an option, you will have to pay an "asked" price, which is
                generally about 2% greater than the "bid" price and which,
                unlike the bid price, is never zero.</p>
                <br/>

                <p>Wall ${'$'}treet Raider can keep track of up to 1,000 option contracts
                at any point in time. Since options are constantly expiring as
                time progresses, it is unlikely that you could ever create that
                many separate contracts at one time, although there are some random
                options transactions by uncontrolled companies, most of which are
                intended to increase their holdings of stock in their major subsidiaries.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(15)">
                <h4><strong>15. LIST FUTURES CONTRACTS.</strong></h4>
                <br/>

                <p>Click on this button to see a list of all the commodities or index
                futures positions held (long or short) by the current
                ${helpLink('chap03_III(A)', 'Active Entity')}
                (you or a company). The display will show the unit price (per barrel,
                ounce, bushel, etc.) agreed upon when you entered into the futures
                contract and will also show the "${helpLink('glossary_NOTIONAL', 'notional value')}" of each contract (the contract price per unit times the
                number of units you have agreed to buy or sell at a future date)
                and the current value of the contract. The difference is the gain
                or loss you are currently showing on the contract, which is shown
                in the far right-hand column.</p>
                <br/>

                <p>To sell any of the futures contracts which you are "long" or
                to buy back any contracts you are short (you may close any portion,
                or the entire amount, of any contract ), just click on the line
                item for that futures contract to trade it. (This only functions
                if you control the Active Entity whose contracts are being
                viewed.)</p>
            </div>
            <br/>

            <div id="chap10_X(D)(16)">
                <h4><strong>16. CASH FLOW PROJECTION.</strong></h4>
                <br/>

                <p>This menu item will display for you a detailed 3-month cash
                flow projection for a corporation, if the corporation is the
                current "Active Entity," or a one-year cash flow projection
                for you, the player, if you are the currently selected "Active
                Entity." The projections go into considerable detail, although
                the income tax calculation is a rough estimate in some cases,
                when there are complex intercompany transactions between companies
                and their subsidiaries when they own 80% or more of the stock of
                the subsidiaries.</p>
                <br/>

                <p>In such cases, the fortunes of the subsidiaries (their
                taxable income or loss situation) may require the parent or
                the subsidiary to reimburse the other company for the tax benefit
                of its losses, or the sub will compensate the parent for the
                sub's taxable income that increases the tax liability of the
                parent, which is the only entity in the consolidated tax filing
                group that directly pays the consolidated group's income tax to
                the tax authority -- unless it is the 80% sub of another corporation,
                which can in turn be an 80% sub of yet another corporation and...
                you can see why this gets a bit too complex to forecast with
                any great accuracy. So, as the projection itself states, the
                income tax calculation may be a "rough estimate".</p>
                <br/>

                <p>The cash flow projection feature for corporations is a
                new one, appearing in versions after v. 8.72, and a related
                feature is that you may be given warnings, such as in Research
                Reports, of impending cash flow problems, where a company
                appears to be heading towards a situation in the next 3 months
                where it runs out of cash and cash equivalents (T-bills), and
                also has little or no bank line of credit to cover the projected
                cash deficits. In such cases, you will need to take various
                actions to conserve or raise cash, if you do not wish to have
                the company liquidate assets in forced sales.</p>
                <br/>

                <p>Such actions you can take on behalf of the company may include:</p>

                <ul>
                    <li>issuing stock or bonds;</li>
                    <br/>

                    <li>selling off some superfluous assets;</li>
                    <br/>

                    <li>cutting (or completely eliminating) dividend payments;</li>
                    <br/>

                    <li>cutting productivity (R & D or marketing) spending; or,</li>
                    <br/>

                    <li>in the case of industrial companies, slashing the growth
                    rate (capital spending) of business assets to zero or less.</li>
                </ul>
                <br/>

                <p>Also, when you increase productivity spending, the dividend,
                or the growth rate for a company you control, if the change
                will likely result in a forced liquidation of assets in the
                next three months, the cash flow diagnostic will instantly
                alert you of that fact, in which case you may want to reverse
                that changed setting, or take other ameliorative actions to
                prevent such a cash crunch.</p>
                <br/>

                <p>As a research tool, the cash flow projection can also be
                useful in identifying fast-growing, high-flying companies that
                are "burning" through a lot of cash and are projected to soon
                hit a financial wall when they run out of cash and bank financing,
                in which case such companies may be good short sale candidates,
                based on the expectation that they will soon have to "pull in
                their horns," so to speak.</p>
                <br/>

                <p>In versions after v. 9.05, corporate cash flow projections now
                show, as a subtotal, net cash flow before debt repayments, before
                arriving at the total (final) net cash flow. This is a more useful
                way of displaying the numbers, since in many cases some or all of
                the amount to be repaid can be borrowed right back, depending on
                a company's credit rating at the time repayment has been made.</p>
                <br/>

                <p>The software function that computes and displays a corporation's
                cash flow projection is also utilized to diagnose a company's
                cash flow, whether it is positive or negative, and if negative,
                how serious it is. Thus, for any company in which you directly
                own stock or have a short position in the stock, or for any
                company that you control, the program may halt the stock ticker
                and display a cash flow alert if it appears a company in which
                you have such an equity interest is about to run out of cash and
                credit, and be forced to liquidate assets. Such warnings will not
                occur more frequently than once a quarter for a particular company,
                and once such a warning is given, it may not be repeated for a
                considerable time for that company.</p>
                <br/>

                <p>Even if you don't have an equity interest in a company, if
                it is the current Active Entity or the most recent previously
                selected Active Entity, the cash flow warning may also pop up for
                such company, which may be helpful if you were studying the stock
                and considering investing in it or shorting it.</p>
                <br/>

                <p>Note that if you control a lot of companies and are receiving
                frequent cash flow warning pop-up messages, that may become
                somewhat annoying. If so, go to the <em><strong>Settings</strong></em>
                pull-down menu at the top of the main screen and select the
                ${helpLink('chap05_V(B)(3)(g)', 'Suppress Cash Flow Warnings')}
                item to suppress such pop-up messages.</p>
                <br/>

                <p>The Cash Flow Projection button does not appear on the Entity Info
                Menu if the selected "Active Entity" is a bank. Banks are usually
                swimming in cash and other liquid assets and, in any case, are
                constantly receiving new deposits or loan repayments as customers
                earn money, or are lending out funds as customers draw on their
                lines of credit. In addition, banks are almost constantly buying
                or selling bonds or other financial assets (mortgages, consumer
                and business loans), in order to maintain a targeted level of
                liquidity, which would make cash flow forecasts miseading or, at
                best, meaningless.</p>
            </div>
            <br/>

            <div id="chap10_X(D)(17)">
                <h4><strong>17. MY CORPS.</strong></h4>
                <br/>

                <p>Clicking on this button will display a list of all the corporations
                which you currently control, listing the name and various other
                items of information for each, such as recent and projected quarterly
                earnings, credit rating, and "analyst's ratings" (buy, sell,
                hold, etc.) for the company's stock. Click or double-click on any
                company's name on the list to select that company as the "active
                entity." (If you control only one company, clicking on this button
                will select that company as Active Entity; if you control
                only two companies and one is currently the
                ${helpLink('chap03_III(A)', 'Active Entity')}, clicking on
                this button will automatically select the other as the new
                Active Entity.</p>
                <br/>

                <p><strong><u>NOTE:</u></strong> This button only appears on the
                Entity Info Menu when the currently selected Active Entity is
                you, the player. However, this button also appears at all times
                on the main Wall ${'$'}treet Raider screen, in the "Quick Search
                Functions" group of buttons.</p>
            </div>
        </div>
        <br/>

        <div id="chap10_X(E)">
            <h3><strong>E. "GENERAL" (RESEARCH) BUTTON AND MENU</strong></h3>
            <br/>

            <p>Click on this button to bring up a menu of "general" research
            features.  These functions are for doing general investment
            research (not on any particular company), such as economic
            data, tax rates, interest rates, news headlines, industry
            information, and various types of pre-configured database
            searches.</p>
            <br/>

            <p>The right-hand side of the "General Research" Menu that pops
            up has 12 buttons, each of which is a research tool described below.
            The left-hand portion of the dialog box contains a text box with
            instructions for using this Menu, and also contains other
            current information, such as central bank monetary policy and
            an analysis and a forecast for the currently selected industry
            (which can be selected from the "Industry Group Selected" drop
            list on the left side of the main screen, or by selecting a
            company in the desired industry group as the
            ${helpLink('chap03_III(A)', 'Active Entity')}).</p>
            <br/>

            <p>The text box also contains a textual analysis of the current
            state of the economy and forecast.</p>
            <br/>

            <p>Besides doing research on industry groups or database
            searches for companies with largest market share or market cap,
            or companies with the largest cash hoards or tax losses, the
            functions on this Menu also provide a number of economic
            statistics and interest rate information that will help you to
            shape your investment decisions. Thus, for example, if interest
            rates are high and the Federal Reserve (or other Central Bank)
            is tightening the money supply, you may want to stay away from
            investments in stocks of companies that are sensitive to
            interest rates, such as housing development or building
            materials stocks. Or if the economy (Gross Domestic Product,
            or GDP, is the term used for the overall economy) is growing
            rapidly, various cyclical stocks like autos, steel, base
            metals, and airlines should usually do well.</p>
            <br/>

            <p>Similarly, you need to be aware of trends in oil prices,
            since high oil prices tend to be detrimental to transportation
            industries such as airlines, trucking, shipping, and railroads,
            while low oil prices benefit those industries, and tend to
            eventually stimulate economic growth, as well. High oil prices
            tend to mainly benefit oil companies and oil service companies,
            though the resulting inflationary effects may also benefit the
            precious metals industry at times.</p>
            <br/>

            <p>Several key indicators are updated every few seconds on the
            main Wall ${'$'}treet Raider screen, including the Prime Rate of
            interest charged by banks, yields on government bonds, crude
            oil prices, the economic growth rate, and the stock market index.
            For more details on economic indicators and interest rates, see
            the descriptions of the "Economic Statistics" and "Interest Rates"
            buttons, described below.</p>
            <br/>

            <p>The various general research functions (buttons) on the
            "General (Research)" Menu are described in the paragraphs
            below.</p>
            <br/>

            <div id="chap10_X(E)(1)">
                <h4><strong>1. MARKET SHARE.</strong></h4>
                <br/>

                <p>Clicking on this button does a database
                search in which all companies with a market share of 20% or more in their
                respective industries (not including banking, insurance or holding/trading
                company industries) are listed, ranked in order of their market share
                percentage, starting with the company with the largest market share. This
                is a good starting point for finding potential targets for anti-trust
                lawsuits.</p>
                <br/>

                <p>Even if a company has well under 50% market share, and is thus
                not, by itself, a prime target for anti-trust suits, it may be under
                common control with other companies in the industry, which together may
                have a combined market share of 50%, 60%, or more. A quick way to find
                out if a company with a large market share (say 35%) is a potential
                target of an anti-trust lawsuit is to view a Research Report for the
                company. A ${helpLink('chap10_X(D)(2)', 'Research Report')} will tell
                you if a company, together with any "affiliated companies" (other
                companies controlled by the same player or company) in the same
                industry, have a combined market share of more than 25% in that
                industry and will also tell you what the combined percentage market
                share is.</p>
                <br/>

                <p>Note that market share is not a relevant concept for banks, insurance
                companies, holding companies, or ETF's, in Wall ${'$'}treet Raider.</p>
            </div>
            <br/>

            <div id="chap10_X(E)(2)">
                <h4><strong>2. INDUSTRIAL GROWTH RATES.</strong></h4>
                <br/>

                <p>If you want to see a
                broad overview of the growth in demand projected for the next
                year for each of 67 industries, click on this button, and you
                will see displayed a list of all 71 industries and the projected
                annual demand growth rate for 67 of them (not relevant for the 4
                financial industries), based on the current economic forecast,
                as well as the industry's expected long-term growth rate.  See
                ${helpLink('appendix_(D)', 'APPENDIX D')} for a list of industries'
                usual growth rates and basic characteristics relating to each
                industry.</p>
                <br/>

                <p>The list of industries will also show the current rate of return
                on capital assets (business assets, such as plant and equipment)
                for each non-financial industry, which in Wall ${'$'}treet Raider is the
                same as the pre-tax profit margin on sales, assuming ${'$'}1 of capital
                assets generates ${'$'}1 of sales per year.</p>
                <br/>

                <p>This listing does not include financial companies: the banking,
                insurance, or holding/trading company industry groups.</p>
                <br/>

                <p>Click on and highlight any industry before closing this window,
                and that will make the industry you highlighted the "selected
                industry," whose data will be shown when you click on either the
                "Industry Projection" button or the "Industry Summary" button (in
                the "GENERAL" Research Menu -- those two buttons in the "ENTITY
                INFO" Research Menu will continue to show data for the industry of
                whatever company, if any, is the most recently selected Active Entity).
                Double-click on any industry listed to close the window and select
                that industry as the one whose data is to be shown in this
                "GENERAL" Research Menu.</p>
            </div>
            <br/>

            <div id="chap10_X(E)(3)">
                <h4><strong>3. INDUSTRY PROJECTION.</strong></h4>
                <br/>

                <p>If you click on this
                button you will see displayed, for the current "selected industry"
                group (shown as the "Industry Group Selected" on the left side of
                the main screen), a projection for each company in the industry of
                its rate of return on investment in "business assets" and its
                estimated market share percentage, projected 6 months into the
                future.  This screen also displays certain information that is also
                displayed in the "Industry Summary" projection, such as credit rating,
                price as a percent of net worth per share, and dividend yield, for
                each company shown.</p>
                <br/>

                <p>On the "Industry Projection" information display, you will also
                see the current rate of growth in capacity (growth in business
                assets such as plant and equipment) for each company in the
                industry.  The "Industry Projection" function also shows the
                percentage, if any, of sales or revenues being spent on productivity
                improvements, for each company in the industry being reported on.
                This expenditure would be for R & D (research and development)
                for companies in tech-oriented industries, or for marketing and/or
                advertising for companies in those industries where R & D spending
                is not relevant, such as retailing.</p>
                <br/>

                <p>The projections of rate of return on capital assets are based on
                the anticipated rate of growth in demand for the industry's product
                and the planned rate of growth in supply (capacity) for all the
                companies in the industry.  As such, these projections are never
                precisely accurate, since the demand growth projection can change
                at the drop of a hat, and since companies in the industry are
                constantly revising their capacity growth plans in reaction to
                changes in their own situation, industry demand, and in the
                economy.</p>
                <br/>

                <p>As in the real world, these types of projections can be
                very useful, but take them with a grain of salt.  However,
                you can usually tell at a glance whether the growth in
                capacity is outstripping the projected rate of demand
                growth (or vice versa). For example, if all the companies
                in an industry are planning to expand capacity at an
                annual rate of 30 to 40%, and projected demand growth is
                only 5%, it's a safe bet that that industry is going to
                have a severe problem of oversupply within a few months
                or calendar quarters, unless something changes very soon.</p>
                <br/>

                <p>Note that projections are not available for the banking,
                insurance and holding company industry groups. Thus the
                "Industry Projection" command button does not work when any
                of those three types of financial industries is the "selected
                industry." Also, when the Selected Industry is the Exchange-Traded
                Funds (EFT) industry, this button is replaced by a button
                that is labeled "FUND INVESTMENT STRATEGY."</p>
            </div>
            <br/>

            <div id="chap10_X(E)(4)">
                <h4><strong>4. INDUSTRY SUMMARY.</strong></h4>
                <br/>

                <p>The "Industry Summary" command
                button, when it is clicked, gives you several comparative
                financial yardsticks for all the companies in a particular industry.
                For example, you can quickly view the book values (net worth) per
                share of each company in the industry you selected, since the
                display shows each company's book value per share as a percentage
                of its stock price per share. Also listed is each company's
                "P/E RATIO" (price-earnings ratio), its "RETURN ON EQUITY" (after
                tax earnings as a % of the company's current net worth), its
                dividend yield percentage, and current credit rating. In addition,
                for each company shown in the summary, the current "Analyst's Rating"
                (Buy, Sell, Hold, etc.) will be shown, if the company's stock is
                publicly traded.</p>
            </div>
            <br/>

            <div id="chap10_X(E)(5)">
                <h4><strong>5. ECONOMIC STATISTICS.</strong></h4>
                <br/>

                <p>For a summary of various
                economic indicators and tax rates, click on the "Economic
                Statistics" command button on this Menu and you will
                see the following items:</p>
                <br/>

                <ul>
                    <li><strong><u><em>Current Growth Rate, U.S. GDP:</em></u></strong> This is the
                    current annual rate of growth for U.S. Gross Domestic Product ("GDP"),
                    which is used in Wall ${'$'}treet Raider as a proxy for the growth rate
                    of the world economy.  This indicates how fast the world economy
                    as a whole is growing.  A normal growth rate in this simulation is
                    about 2.5% to 3.0%.  Note that the growth rate of demand for many
                    industries depends in large part on growth in GDP, so this is a
                    very important economic indicator.</li>
                    <br/>

                    <li><strong><u><em>Prime Interest Rate:</em></u></strong> This is the rate
                    of interest that banks are currently charging on loans to their
                    best customers -- players or companies with "AAA" credit ratings.
                    Players or companies with lesser credit ratings pay higher interest
                    rates, as is detailed in ${helpLink('appendix_(C)', 'APPENDIX C')}.</li>
                    <br/>

                    <li><strong><u><em>Prices of Government Bonds:</em></u></strong> The prices of
                    the government "long bond" (10 to 20 years maturity) and "short
                    bond" (0 to 10 years maturity) are shown, as well as the coupon,
                    or nominal interest rate on each.</li>
                    <br/>

                    <li><strong><u><em>Annual Housing Starts:</em></u></strong> This figure is a
                    projection (in '000s of units) of annual housing starts, which is
                    obviously of great importance to the housing and building materials
                    industries.  A typical number for annual housing starts at the
                    beginning of a game is around 1,000 to 1,200 ('000), or 1.0 to
                    1.2 million.</li>
                    <br/>

                    <li><strong><u><em>Corporate/Personal Tax Rates:</em></u></strong> Self-explanatory.
                    These are the current rates of tax paid by corporations and by
                    individual players. The rates for corporations and individuals vary
                    from time to time, ranging from about 20% to 50%.  Capital gains of
                    individuals are taxed at much lower rates than "ordinary income"
                    (salary, interest and dividend income). As in the real world, you
                    will find that although there is an occasional tax cut, tax rates
                    tend to rise over the years, since the government's need for money
                    (to attract or buy votes in the next election) is insatiable.</li>
                    <br/>

                    <li><strong><u><em>Other Tax Rates:</em></u></strong> Self-explanatory.
                    Tax rates for any of six different types of taxes on capital
                    (when imposed) will be listed here, and footnotes below explain
                    each such tax. None of these taxes are ever imposed unless you
                    are playing at Difficulty Level 4 (in the recent versions of W${'$'}R).</li>
                    <br/>

                    <li><strong><u><em>Crude Oil Price Per Barrel:</em></u></strong> Self-explanatory.
                    High oil prices are usually good for the oil and oil service industries
                    and not so good for the various transportation industries. An average
                    price for oil is ${'$'}100 (U.S.) per barrel (previously ${'$'}50 or ${'$'}35) in the
                    current version of this simulation. The price of spot crude oil in Wall
                    ${'$'}treet Raider is always quoted in U.S. dollars (the way OPEC prices
                    oil), even if you have configured a game for a different currency.</li>
                    <br/>

                    <li><strong><u><em>Global 1500 Stock Index:</em></u></strong> This is an indicator
                    of stock market prices, an average based on the prices of all of
                    the stocks of corporations in existence at any given moment, in
                    the Wall ${'$'}treet Raider database.  The index is a capitalization
                    weighted index.  That is, it is based on the value of the total
                    of the stock price times number of shares for every corporation,
                    added up, and then divided by a divisor.  The divisor is adjusted
                    each time any company issues new stock, such as in a startup, a
                    merger or public offering, or when it buys back its stock in an
                    LBO.  The index is always at 5,000 at the start of a game.</li>
                    <br/>

                    <li><strong><u><em>National Debt:</em></u></strong> This item shows the total
                    amount of the government's national debt, represented by government
                    bonds issued, and grows throughout the game. (We won't say <em>which</em>
                    government's debt it is.)  Usually, this item is accompanied by a
                    footnote that shows the total amount of such debt currently held
                    by the players and corporations in the simulation.  The remaining
                    government debt is the amount of long- and short-term bonds that
                    are available for purchase from the public.  This figure is usually
                    not very relevant to you, unless you have trillions of dollars
                    (Euros, etc.) to invest, and want to buy government bonds, in which
                    case any purchase or sale of more than 1/2 of 1% of the "float" of
                    the bond you are buying or selling will be the maximum you can
                    trade without affecting the market price of the bonds.
                    <br/><br/>
                    The total national debt starts out as ${'$'}125 trillion (or equivalent
                    in currencies other than U.S. dollars, and grows at 6%. If you
                    are playing a version of the game that lets you play more then
                    35-year games, the national debt stops growing after 50 years,
                    at which point it will be about 18.4 times the initial amount.
                    This means that total holdings by players and companies may
                    eventually exceed the total amount of bonds issued by "the
                    government." In that case, trades are limited in size to
                    ${'$'}1 billion (U.S. dollars or equivalent). It is also possible,
                    but very unlikely, that total bond holdings could exceed the
                    national debt amount, in a shorter game of 50 years, or even
                    35 years.</li>
                </ul>
            </div>
            <br/>

            <div id="chap10_X(E)(6)">
                <h4><strong>6. INTEREST RATES.</strong></h4>
                <br/>

                <p>Click on this button to see what
                various key interest rates are at the moment. The different rates
                shown are as follows:</p>
                <br/>

                <ul>
                    <li><strong><u><em>Prime Interest Rate:</em></u></strong> This is the rate of
                    interest that banks are currently charging their best customers --
                    players or companies with "AAA" credit ratings.
                    <br/><br/></li>

                    <li><strong><u><em>YTM:  Government Bonds:</em></u></strong> The "yield to maturity"
                    for both the "long" and the "short" government bond are shown.  These
                    are the percentage rates of return on both types of bonds at the current
                    bond price, if held to maturity, and are computed by using standard
                    discounted cash flow equations, but based on quarterly payments of
                    interest. (In the real world, most bonds pay interest semiannually, but
                    is becoming more common for bonds to pay quarterly or even monthly.)
                    If the price of a bond is below par (less than 100), then the yield on
                    the bond will be more than its nominal, or "coupon" yield; and vice
                    versa if the bond price is over 100.
                    <br/><br/></li>

                    <li><strong><u><em>Treasury Bill (T-bill) Rate:</em></u></strong> This is the
                    interest rate players and companies earn on their holdings of
                    Treasury bills, which are very safe short-term debt securities
                    issued by the government, which typically pay a very low interest
                    rate.
                    <br/><br/></li>

                    <li><strong><u><em>Bank CD Rate:</em></u></strong> This is the rate of
                    interest banks are currently paying on Certificates of Deposit
                    ("CDs"). In Version 8.50, players or corporations do not
                    hold CDs, but most of the bank deposits (usually around 90%)
                    held by the "Public" are in CDs, with only a small percentage
                    in DDs (demand deposits, that pay no interest).
                    <br/><br/></li>

                    <li><strong><u><em>SOFR Rate:</em></u></strong> SOFR stands for "Secured
                    Overnight Financing Rate," which, in the real world and in Wall
                    ${'$'}treet Raider, replaced the LIBOR ("London Interbank Offered
                    Rate") in 2023. This is the average rate of interest large banks
                    have to pay when they must borrow from another bank overnight.
                    Interbank loan transactions all take place automatically in
                    Wall ${'$'}treet Raider, so this is merely for your information,
                    in case you are wondering why a particular bank is doing so
                    well or so poorly. At times the SOFR interbank loan rate may
                    be well above or below the rate banks are earning on their
                    loan portfolios. In W${'$'}R, banks don't generally borrow from each
                    other unless they are out of cash and have sold off most or all
                    of their government bond holdings.
                    <br/><br/>
                    As real world news disclosed back in 2012, the LIBOR rate has
                    been rigged for years by crooks at 20 or more of the world's
                    largest banks, manipulated to increase their profitability on
                    various debt instruments.  Accordingly, in the real world, the
                    LIBOR rate was to be phased out at the end of 2021, possibly to
                    be replaced by the Secured Overnight Financing (SOFR) Rate and
                    Overnight Index Swap (OIS) Rate, or possibly by other alternative
                    standard reference rates to be used in loan and interest rate
                    swap transactions. (In fact, the LIBOR rate has been phased out
                    in the real world after June 30, 2023 and generally replaced by
                    the SOFR rate and we have also replaced it with SOFR in this
                    simulation in 2023.)
                    <br/><br/>In Wall ${'$'}treet Raider, a "SOFR rate" is used only as
                    the rate at which banks pay interest on interbank loans, and is
                    loosely related to the Prime Rate and rates paid on CDs. Banks
                    with less-than-Sterling credit ratings will pay a rate somewhat
                    higher than the SOFR rate on their interbank borrowings in Wall
                    ${'$'}treet Raider.
                    <br/><br/></li>

                    <li><strong><u><em>Consumer Loans Rate:</em></u></strong> This is the average
                    rate banks are currently earning on consumer loans, such as car
                    loans and credit cards, and is usually several points higher than
                    the "prime rate" or the rate on mortgage loans.  This is because
                    there are frequent large bad debt charge-offs on a bank's
                    consumer loan portfolio, usually occurring about once a year,
                    which are often 3% or more of the consumer loan portfolio, so
                    the apparent high rate of return on these loans is somewhat
                    misleading, as the net return is about the same as on mortgage
                    loans, after bad debts write-offs are considered.
                    <br/><br/></li>

                    <li><strong><u><em>Prime Mortgage Rate:</em></u></strong> This is the
                    average rate banks are currently earning on mortgage loans, which
                    is usually just a bit higher than the "prime rate," since these
                    are pretty safe loans, with only small annual bad debt losses.
                    <br/><br/></li>

                    <li><strong><u><em>Subprime Mortgage Rate:</em></u></strong> This is the
                    rate banks and insurance companies are currently earning on
                    risky "subprime" mortgage loan securities, which generally pay
                    very high interest rates, but are very risky and have high
                    rates of default, resulting at times in massive bad debt
                    losses for the holders.</li>
                </ul>
            </div>
            <br/>

            <div id="chap10_X(E)(7)">
                <h4><strong>7. VIEW NEWS.</strong></h4>
                <br/>

                <p>Click on this command
                button to display a list of up to 60 of the most recent news
                headlines, including such recent events as changes in central bank
                (such as the U.S. Federal Reserve) monetary policy, political news,
                news of corporate takeovers, earnings reports, actions taken
                by players or their companies, various catastrophes or windfalls
                affecting companies or industries, and the like. Check the headlines
                frequently, to keep abreast of events you may not have noticed on the
                scrolling news ticker, or that may have occurred on your
                opponent's turn (such as transactions by your opponent).</p>
            </div>
            <br/>

            <div id="chap10_X(E)(8)">
                <h4><strong>8. WHO'S AHEAD?</strong></h4>
                <br/>

                <p>If at any time during play, you want
                to know who is winning the current game of Wall ${'$'}treet Raider,
                simply click on the "Who's Ahead?" button, which will tell you.
                In addition, the Difficulty Level (1 to 4) you have chosen for
                the current game will be shown. You will also be shown simplified
                balance sheet information for each player:  Cash, other assets,
                total assets, bank debt, and net worth.</p>
                <br/>

                <p>Other, more detailed information is also shown for each player,
                including the identity of the player's largest controlled company,
                a list of some or all of the stocks directly owned by the player, the
                bank from which each player borrows, the player's credit rating, and
                employment status, such as "CEO of XYZ Corporation" or "Unemployed"
                or "On the dole."</p>
                <br/>

                <p>Click on any line of text that shows a company name or a single
                stock symbol, and that company will be selected as the "active
                entity."</p>
                <br/>

                <p>The same information as above is shown at the end of a game,
                including an announcement of who the winner of the game was.</p>
            </div>
            <br/>

            <div id="chap10_X(E)(9)">
                <h4><strong>9. MOST CASH</strong></h4>
                <br/>

                <p>This is a pre-configured database search button
                that allows you, with a single button click, to see a list of the 100 companies with
                the largest cash balances at the moment, ranked from 1 to 100. You will be
                shown the name of each company and its cash balance, plus you will also see the
                credit rating and market capitalization of each company.</p>
            </div>
            <br/>

            <div id="chap10_X(E)(10)">
                <h4><strong>10. LARGEST TAX LOSSES.</strong></h4>
                <br/>

                <p>This is a pre-configured database search button
                that allows you, with a single button click, to see a list of all the companies with
                tax loss carryovers, ranked from largest to smallest. The displayed information
                will also show the credit rating and market capitalization of each company. This
                information can be very useful in your tax strategy, enabling you to find a
                company with large tax losses that you can use to hold an 80% or greater
                interest in your profitable companies, sheltering their profits from taxes (since
                they will report their taxes on a consolidated basis with the parent company
                that has the tax loss carryovers). (This is a bit unrealistic, and would generally
                not be the case in the real world, at least under the U.S. tax system, where the
                I.R.S. would drastically limit the use of the carryovers in most cases.)</p>
            </div>
            <br/>

            <div id="chap10_X(E)(11)">
                <h4><strong>11. LARGEST MARKET CAP.</strong></h4>
                <br/>

                <p>This is a pre-configured database search button
                that allows you, with a single button click, to see a list of the 100 companies with
                the largest market capitalizations – that is, with the largest market value – ranked
                from 1 to 100. A company's market cap is simply its stock price multiplied by the
                number of shares of its stock that are issued and outstanding. Also displayed for
                each company listed is its credit rating and the stock symbol of the company that
                controls it, if any.  If it is controlled by you or another player, it will display the
                code "_P" if controlled by you, or "_H" if controlled by a hostile (competing)
                player, instead of a stock symbol.  (This function is handy for finding large
                companies that may be good targets for antitrust lawsuits.)</p>
            </div>
            <br/>

            <div id="chap10_X(E)(12)">
                <h4><strong>12. DATABASE SEARCH.</strong></h4>
                <br/>

                <p>In doing your investment
                research, looking for possible bargains, it is helpful
                in Wall ${'$'}treet Raider, as in the real world, to have the
                help of computer "screens" to assist you in finding likely
                investment candidates. Clicking on the "Database Search" button
                does just that in this simulation, enabling you to sift through
                the large database of companies to find stocks or corporate
                bonds that might be good investments. When you click on this
                button, it brings up a search screen, which has checkboxes
                for 12 search factors you can use, and all but three of them
                can be further modified, if you select them.</p>
                <br/>

                <p>To select any of the search factors listed on the Database Search
                screen, just click to check the checkbox by that item. Then either
                enter a number in the right-hand column if you want to set your own
                parameter, such as 6% as a minimum dividend yield, or in some cases,
                click on the "Change" button to change certain non-numerical settings,
                such as minimum credit rating or quality of management.</p>
                <br/>

                <p>When you make any changes in checkboxes or amounts shown in the
                changeable boxes in the right-hand column, the program immediately
                updates the number of companies that meet your search parameters,
                shown in a highlighted box near the bottom of the screen. To view
                the list of companies that meet your search criteria, click on the
                Display Results button. (But if more than 1,000 companies meet your
                search criteria, you will need to change the factors you are using,
                to narrow down the number of companies to 1,000 or fewer, before you
                can display the results.)</p>
                <br/>

                <p>Note that if a company fails to meet your criteria for any single
                checked item, then that company will not be included in the list
                of qualifying companies.</p>
                <br/>

                <p>A brief description of each of the search factors is as follows:</p>
                <br/>

                <ul>
                    <li><strong><u><em>High Return on Equity (At Least x%):</em></u></strong>  If this box
                    is checked, and a whole percentage number is entered in the textbox for
                    this item, such as 20%, the database search will only include companies
                    that earned at least x% (20% for example) on their equity or net worth,
                    in the last full calendar year (based on net worth at the end of that
                    year). You can enter any value from -99% to +1,000% in the text box.
                    <br/><br/></li>

                    <li><strong><u><em>Low P/E Ratio Stocks -- P/E Less Than:</em></u></strong>  If this
                    box is checked, the database search will exclude any company that has a
                    ${helpLink('glossary_PE', 'P/E ratio')} higher than the amount entered
                    in the textbox for this item. Thus, if you enter 10 (for a price-earnings
                    ratio of 10), the only companies that qualify will be those with P/
                    E ratios of 10 or less, based on the last calendar year's earnings. (If
                    you enter zero or less, the checkbox for this item will be turned off,
                    automatically.)
                    <br/><br/></li>

                    <li><strong><u><em>Stock Price Less Than x% of Net Worth:</em></u></strong>  If you
                    check this box, the database search will exclude from consideration any
                    company whose stock sells for more than the percentage entered in the
                    textbox for this item, in relation to its net worth per share. Thus, if
                    you enter 95%, and a company sells for 110% of its net worth per share,
                    it will not be included in the list of companies that meet your search
                    criteria. (If you enter zero or less, the checkbox for this item will
                    be turned off, automatically.)
                    <br/><br/></li>

                    <li><strong><u><em>Dividend Yield Is x% or More:</em></u></strong>  If you check
                    this box, the only companies that will meet your criteria are those whose
                    dividend yield is equal to or higher than the percentage you enter in the
                    textbox for this item. (If you enter zero or less, the checkbox for this item will
                    be turned off, automatically.)
                    <br/><br/></li>

                    <li><strong><u><em>Minimum/Maximum Market Capitalization:</em></u></strong>  If this
                    box is checked, the only companies that will meet your screening criteria
                    are those whose total market value is equal to or greater than the
                    minimum amount (in millions or billions) you enter in the minimum
                    capitalization textbox, and whose total market value is equal to or less
                    than the amount you enter in the maximum capitalization textbox for this
                    item. The default values are a minimum capitalization of 200 million,
                    and a maximum of 1,000 million.  Thus, for example, a company whose
                    total market value (of its stock) is greater than 1,000 million would
                    not meet your search criteria if you accept the default values. (If you
                    enter zero or less in either of the input boxes for this feature, the
                    value for that input item will be reset at the default value of 200 or
                    1,000, automatically.)
                    <br/><br/>
                    This screening factor is very helpful if you have only a certain
                    amount to invest, say ${'$'}2,000 million, and want to put most of it
                    into one company with a 20% ownership.  Thus you might set this
                    screen for companies with total market caps of about ${'$'}5,000 minimum
                    to about ${'$'}8,000 maximum, of which you could afford to buy 20% of
                    their stock.
                    <br/><br/></li>

                    <li><strong><u><em>Earnings Up Next Quarter by x% or More:</em></u></strong>  If
                    this box is checked, the only companies that will meet your criteria
                    are companies whose earnings are projected to be up by the percentage
                    you specify in the textbox for this item. This search factor is a
                    comparison of the earnings for the most recently reported quarter and
                    the current quarter (for which earnings have not yeat been reported),
                    so this is a very sensitive indicator of a company's changing fortunes.
                    (If you enter zero or less, the checkbox for this item will be turned off,
                    automatically.)
                    <br/><br/></li>

                    <li><strong><u><em>Earnings Up Last 1, 2 or 3 Years:</em></u></strong>  If this box is
                    checked, the only companies that will meet your criteria are those whose
                    earnings have gone up in the last year, or the last 2 years in a row, or 3
                    years in a row, as you select. The textbox for this item is not editable,
                    but you can click on the 'Change' button to change the number of years to
                    1, 2, or 3, or back to 1. If this item is checked, the company must also
                    show a year over year quarterly earnings increase if it has reported
                    earnings for 1 to 3 quarters of the current year, or it will be treated
                    as not meeting this test.
                    <br/><br/></li>

                    <li><strong><u><em>Management Rated at Least:</em></u></strong>  If this box is
                    checked, you can select only companies that, relative to others in their
                    industry, are considered to have Good, Average, or Poor management. Use
                    the "Change" button to select one of the above. If you select "Good," then
                    only companies with good management will meet your test. If you select
                    Average, then companies with either "Average" or "Good" management will
                    qualify.  If you select "Poor," it is the same as not checking the box
                    for this item, since all companies have at least "Poor" management, if
                    not better.
                    <br/><br/></li>

                    <li><strong><u><em>Credit Rating Is at Least:</em></u></strong>  If this box is
                    checked, the database search only picks out companies that have at least
                    as good a credit rating as listed in the box for this item. While the
                    textbox is not editable, clicking the 'Change' button will change the
                    credit rating displayed, which ranges from lowest minimum of D, to C,
                    to CC, to CCC, to B, to BB, to BBB, to A, to AA to the highest credit
                    rating, which is AAA.  If you select this search factor, note that the
                    list of companies that will be displayed will show the credit rating
                    for each, with the companies sorted alphabetically. In versions after
                    Version 9.05, when searching for stocks to trade, if you check the
                    Credit Rating box, the list of companies that is displayed will be
                    sorted by credit rating, rather than alphabetically.
                    <br/><br/>
                    Similarly, if you are doing a bond search, the bond issuers that
                    will be displayed will be sorted based on credit rating. However, in
                    Versions 9.0 and later, that is only the case if you have checked the
                    Credit Rating box -- otherwise, the bond issuers will be sorted by
                    the maturity date of the bonds, making it easy to find very short-term
                    or very long-term bonds, depending upon what you are looking for.
                    <br/><br/></li>

                    <li><strong><u><em>Analyst Rating is:</em></u></strong>  If this box is checked,
                    the database search only picks out companies that have the stock
                    analyst performance and valuation rating as listed in the box for
                    this item. While the textbox is not editable, clicking the "Change"
                    button will change the rating level displayed, which ranges from
                    highest of "Strong Buy," to "Buy," "Hold," "Sell," and the lowest
                    rating of "Strong Sell." Note that as in real life the Wall ${'$'}treet
                    Raider stock analyst's ratings are not always that reliable, but
                    this still can be a useful addition to other criteria you are using
                    to find a company to invest in, by selecting only stocks with the
                    "Strong Buy" or "Buy" rating. Or, if you are looking for short
                    sale candidates, use this criterion to search for companies with
                    "Strong Sell" or "Sell" ratings.
                    <br/><br/></li>

                    <li><strong><u><em>Exclude Financials, Holding Companies, or If You
                    Control:</em></u></strong> If this box is checked, the database search
                    will exclude the stocks of banks, insurance companies, holding
                    companies, and stocks of any companies you already control. Thus,
                    the only companies whose stocks or bonds will be displayed are
                    those of industrial companies that you do not control.
                    <br/><br/></li>

                    <li><strong><u><em>Industry Supply/Demand Improving:</em></u></strong>  If this box
                    is checked, companies in any industry where the supply/demand situation
                    is not improving or stable will be excluded, except that this factor
                    applies only to 'industrials,' and not to banks, insurance companies, or
                    holding / trading companies. None of the three latter groups of
                    companies will be excluded due to your checking this factor. However,
                    you may choose to exclude such financial stocks by checking the box
                    described in the preceding paragraph.
                    <br/><br/></li>

                    <li><strong><u><em>Search One Industry: (Select Industry To Search):</em></u></strong>
                    If this box is checked, you can narrow your search further by limiting
                    it to companies in one industry (other than Exchange-Traded Funds -- ETFs).
                    When you check this box, a list of all 70 industries will pop up and
                    you can pick the industry you want to search. For example, if you want to
                    only search for banks whose earnings are projected to rise by 10% or more
                    next quarter, you would click on this box to limit your search to banks.
                    But if you limit your search to any of either the banking, insurance, or
                    holding/trading company industries, remember to uncheck the box that
                    excludes financial companies and holding/trading companies; otherwise,
                    your search will turn up zero companies, as the two settings will cancel
                    out each other if both turned on.
                    <br/><br/></li>

                    <li><strong><u><em>Has Positive Cash Flow.</em></u></strong> Check this box
                    if you want to find companies that are projecting positive cash
                    flow for the next three months. The companies that have positive
                    cash flow tend to be companies that are very healthy and able to
                    reduce their debt levels, if any, which may make them attractive
                    investments. However, if you want to also select companies that
                    have negative cash flow, but that have positive cash flow before
                    taking into account required debt repayments, check the following
                    item (or both it and this item).
                    <br/><br/></li>

                    <li><strong><u><em>... Or (Has Positive Cash Flow) Before Debt Repayment.</em></u></strong>
                    Checking this box will exclude from the list of selected companies
                    those that are projected to have negative cash flow for the next
                    three months, even before making required debt repayments, but will
                    not exclude companies having negative cash flow overall, but positive
                    cash flow before their required debt payments (paying off bank
                    lines of credit or paying off bonds that come due in the next
                    three months). In short, the companies that meet this criterion
                    are those generating net cash flow from operations, but the amount
                    of debt repayments they must make in the coming three months is
                    greater than the amount of cash that will be generated from
                    operations. Thus, such companies will generally be paying down
                    their debts, but in doing so may be depleting their cash and
                    cash equivalents or may be incurring cash and cash equivalent
                    deficits due to debt repayments, which will cause them to either
                    draw on their line of credit and borrow back part of the loan
                    payment they made or, if they have no remaining line of credit,
                    will be forced to liquidate some of their assets in order to make
                    the loan repayment or bond payoff.
                    <br/><br/>
                    Before you check this item, it is not necessary to first check the
                    "HAS POSITIVE CASH FLOW" item
                    <br/><br/>
                    <strong>NOTE:</strong> Even if either or both of the above cash-flow factors
                    are checked, no cash flow analysis will be done for any banks, and
                    banks will be excluded from the list of companies that meet your
                    search criteria when searching for companies with positive cash flow.
                    <br/><br/></li>

                    <li><strong><u><em>Find Short Sale Candidates:</em></u></strong> While all of the
                    above search criteria are designed to help you find good stocks to
                    buy, this feature looks for stocks that you are more likely to
                    profit from if you sell them short, rather than acquire them. For an
                    explanation of what it means to sell a stock short, see the
                    ${helpLink('chap03_III(P)', 'FAQ on Short Sales')} in Chapter 3. Clicking
                    on this item on the Database Search menu screen will search for and
                    generate a list of stocks of companies that are likely to be good
                    stocks to sell short.
                    <br/><br/>
                    Use this item software to do a "smart" search of companies that have
                    certain negative characteristics that indicate that their stocks
                    may be headed down soon, and that you may want to consider selling
                    short. Alternatively, you may instead want to buy put options on
                    such stocks, which is another way to take advantage of a decline in
                    a stock's price. The program considers and weighs a number of factors,
                    such as stock price momentum, earnings decreases, high price-to-net
                    worth ratios, high (or infinite) price-earnings ratios, bad credit
                    ratings, and negative cash flow projections. If enough such negatives
                    are found, the company's stock will be selected and displayed on the
                    list of short sale candidates that you will be able to pick from.
                    <br/><br/>
                    Note that, with a few exceptions, such as for market cap,
                    exclusion of financial companies, and limiting search to a
                    single industry, any other items you have selected, such as
                    dividend yield or improving industry supply-demand conditions,
                    will automatically be de-selected if you check this item. That
                    is because all the other search criteria you may have selected
                    are looking for "good" companies, while the search for short
                    sale candidates looks for "bad" or overpriced companies. Thus,
                    if both types of search criteria were selected, no companies
                    would qualify as both "good" and "bad."
                    <br/><br/>
                    Sometimes you may be thinking of investing in a stock
                    that appears to be very cheap, perhaps tottering on the edge
                    of bankruptcy reorganization, but you feel it may be a good
                    investment if it turns around. It may be, but you may want
                    to think twice about acquiring it if it shows up on a list
                    of short sale candidates, using this database search function,
                    since the simulation considers a lot of factors with regard
                    to a company's prospects and its possible demise.
                    <br/><br/></li>

                    <li><strong><u><em>...But Exclude Bankrupt Companies:</em></u></strong>
                    Many of the companies that the "FIND SHORT SALE CANDIDATES"
                    criterion will select will be companies that have a "D"
                    credit rating (under bankruptcy court protection). Since
                    the simulation will not allow you to sell short the shares
                    of such "walking dead" stocks or buy put options on them,
                    you can click on this item to exclude all such D-rated
                    stocks from being selected and listed.
                    <br/><br/>
                    This checkbox item is not functional unless you have first
                    checked the "FIND SHORT SALE CANDIDATES" checkbox item.
                    <br/><br/></li>

                    <li><strong><u><em>Has Bonds Issued and Outstanding:</em></u></strong>  All of
                    the above search criteria are useful in trying to find stocks to
                    invest in. This search criterion is only useful as part of your search
                    for corporate bonds to invest in. If this box is checked, the database
                    search will exclude from consideration any company that does not have
                    a bond issue outstanding. You would generally check this item only
                    if you are looking for good corporate bonds to invest in, and perhaps
                    select only a few other criteria, such as credit rating, good
                    management, and whether or not the industry supply/demand situation
                    is improving for a given bond issuer. Factors like P/E ratio or Price
                    to Net Worth would not be very relevant if you are doing a search for
                    corporate bonds to invest in.
                    <br/><br/>
                    If you select this factor, the list of companies displayed will
                    show the bonds' credit rating and the year they mature. Checking
                    this box causes the search routine to assume you are interested
                    only in finding corporate bonds to invest in, rather than stocks
                    (though many of the criteria, such as credit rating, earnings
                    trends, and the like, may be the same for both stocks and bonds).
                    Thus, if you have checked this box, the listing of corporate bonds
                    will show a number of bond details, such as interest rate, yield
                    to maturity, date of maturity, credit rating, the amount issued,
                    and the amount in public hands that are available for purchase, and
                    the list of all bonds that meet your criteria will be displayed in
                    descending order of their credit rating. An asterisk (*) will
                    appear after the credit rating of any bond issue that is a
                    convertible bond (convertible into stock of the issuing company).
                    <br/><br/>
                    <strong><u>NOTE:</u></strong> If you check this box, to search for bonds, the
                    database search program will automatically UNcheck the box below it
                    that is for showing convertible bonds only.
                    <br/><br/></li>

                    <li><strong><u><em>Show Convertible Bonds (Only):</em></u></strong> Clicking
                    on this box will automatically UNcheck the "Has Bonds Issued and
                    Outstanding" box immediately above it, since this item is for
                    showing convertible bonds, only. When this box is clicked, a message
                    will pop up, asking you if you want to ignore the conversion prices
                    of the convertible bonds, or if you have set a conversion premium
                    limit, it will ask if you want to change that limit. If you choose
                    to ignore the conversion prices of convertible bonds (or enter
                    zero to change a prior premium setting greater than zero), then
                    the search program will display ALL convertible bonds that are
                    publicly traded, unless you have set some other search criteria,
                    such as credit rating or analyst stock rating, that disqualify
                    some of the companies that have issued convertible bonds.
                    <br/><br/>
                    If, instead, you choose to exclude bonds that are trading at
                    a large premium over their conversion value, you can enter that
                    percentage, which can be 1% or any higher percentage, like 300%.
                    If, for example, you enter 30%, the search program will exclude
                    any convertible bonds that are trading at a price that reflects
                    a premium of more than 30% over the value of the bonds if they
                    were to be exchanged for stock at that moment. This is useful,
                    since convertibles that trade at a very large premium, like
                    100% or more, above their conversion value will have only a minor
                    price response, if any, to changes in the underlying stock, and
                    may only go up 15% or 20% or so even if the stock doubles. Such
                    a "busted convertible" trades more like a non-convertible bond
                    unless or until the stock it converts into makes a major up move.
                    <br/><br/>
                    As an example, if XYZ's convertible bonds are convertible into
                    20 shares of stock for each ${'$'}1,000 face value bond, and the stock
                    sells for ${'$'}37.50 a share, the "conversion value" of the bond is
                    only ${'$'}750 per ${'$'}1,000 bond, or a bond price of 75. If the bonds
                    are trading at 100, rather than 75, the "conversion premium" in
                    the price of the bonds would be 25 points, or 33.3% above the
                    bonds' conversion value of 75. So if you have chosen to exclude
                    bonds trading at more than a 30% premium from the search, the XYZ
                    bonds would not meet your search criteria, and would not be shown.
                    By using a relatively low premium percentage, like 15% or 20%,
                    you can zero in on bonds that will behave, price-wise, much more
                    like the underlying stock, if the stock rises.</li>
                </ul>
                <br/>

                <p>Once you have selected all the factors you want to apply in your
                search, and if the number of companies that qualify is greater than zero
                but not more than 1,000, click on the "Display Results" button to view the
                list of companies that meet your criteria. You can then double-click on
                any such company to select it as the 'Active Entity,' for doing further
                research on the company.</p>
                <br/>

                <p>Note that when you exit the Database Search function, and re-enter it
                later, your search criteria are preserved from before (but the number of
                companies that now qualify will probably have changed). Thus, once you
                have selected what you consider a good set of search parameters, you can
                periodically click on the Database Search button and see what companies,
                if any, newly fit the search parameters you have determined. There is
                also a "Recall DB Search List" button in this same group of "Quick Search"
                buttons, which you can click on to instantly bring up your search list
                without first having to open the "Database Search" data entry screen.</p>
                <br/>

                <p>To clear all the checkboxes and search parameters on the DataBase
                Search screen, click on the "Clear Checkboxes" button.</p>
            </div>
            <br/>

            <div id="chap10_X(E)(13)">
                <h4><strong>13. WHO OWNS WHAT?</strong></h4>
                <br/>

                <p>Click on this menu button to "look under
                the hood" (take a peek at corporate data). A submenu will appear that
                allows you to see lists of any of the following:</p>

                <ul>
                    <li>Players and companies with long or short positions in commodity
                    or stock index futures, showing the amount and size of each position,
                    as well as the contract price to be paid or received at expiration.</li>
                    <br/>

                    <li>Players and companies that own physical commodities, showing the
                    commodity and the amount owned, plus the price (cost) per barrel,
                    ounce, or bushel owned.</li>
                    <br/>

                    <li>Players and companies that are parties to interest rate swap
                    agreements, listing the "long" parties alphabetically, showing the
                    fixed interest rate they are receiving, and the stock symbol for
                    the counterparty to whom they will be paying the varying interest
                    rate each quarter (Prime, Long Bond, or Short Bond interest
                    rate), as well as showing the period the swap is or will be in
                    effect.</li>
                    <br/>

                    <li>Companies that have long or short options positions, showing
                    for each position whether the company is long or short, the type
                    of option (puts or calls), and the stock which is subject to the
                    option.</li>
                    <br/>

                    <li>Companies, other than Exchange-Traded Funds (ETF's), that own
                    stocks in other corporations, showing each stock owned, the percentage
                    of that company that is owned, and the currently stock analyst rating
                    of the stock.</li>
                    <br/>

                    <li>Exchange-Traded Funds (ETFs), showing the name of the company
                    that is the investment adviser/manager for each ETF, the base annual
                    management fee (as a percent of the ETF's total assets) paid to the
                    adviser, and the amount of the total assets held by the ETF, in
                    millions (or billions, in some currencies).</li>
                </ul>
            </div>
        </div>
        <br/>

        <div id="chap10_X(F)">
            <h3><strong>F. "SELECT LAST (or stock symbol)" BUTTON.</strong></h3>
            <br/>

            <p>Click on this button to make the last corporate entity that was
            selected by you as the Active Entity the newly selected
            ${helpLink('chap03_III(A)', 'Active Entity')}.  This button
            will be grayed out at start of a game, but once you have
            selected an Active Entity, such as ABC Company, and then
            select another Active Entity, such as DEF Company, then ABC
            Company will be the company whose stock symbol appears on
            the button.  The button will then read "Select ABC"
            (rather than "Select Last"), and if you click on it,
            ABC will again become the Active Entity and the button
            will then read "Select DEF."</p>
            <br/>

            <p>In short, each time you click on this button, generally, it will
            toggle back and forth between the two most recently selected active
            entities (unless you select yourself, the player, as Active Entity).</p>
            <br/>

            <p>This button is provided as a convenience, to make it easier
            for you to switch back and forth between two entities, quickly
            selecting one or the other as the Active Entity, with a minimum
            of keystrokes or button clicks.</p>
        </div>
        <br/>

        <div id="chap10_X(G)">
            <h3><strong>G. "MY NEWS" BUTTON.</strong></h3>
            <br/>

            <p>Click on this button to
            view a list of recent news headlines to be displayed, if any of
            the recent headlines contains your player name, or the stock
            symbol of any stock you directly own, or the stock symbol of any
            company in which you directly or indirectly have a controlling
            interest. It allows you to see any recent news items affecting
            you or any companies in which you have an investment or which
            you control.</p>
            <br/>

            <p>This feature will not only collect and display any recent
            news items regarding you, companies you control, or stocks
            you own directly (or are short), but now will also look for
            news items on any stocks on which you (or any company you
            control) has an options position or owns any stock in.</p>
        </div>
        <br/>

        <div id="chap10_X(H)">
            <h3><strong>H. "QUICK SEARCH FUNCTIONS" GROUP OF BUTTONS.</strong></h3>
            <br/>

            <p>Recent versions of Wall ${'$'}treet Raider include a group of nine "Quick
            Search" buttons in the middle lower portion of the main screen that allow
            you to access a number of program features without first opening a menu, with
            a single button click. Eight of these buttons are the same as buttons that
            are also found in the  ${helpLink('chap10_X(D)', 'Entity Info Menu')}:</p>

            <ul>
                <li>Research Report</li>
                <li>Financial Profile</li>
                <li>Earnings Report</li>
                <li>List Portfolio</li>
                <li>List Put and Call Options</li>
                <li>List Shareholders</li>
                <li>List Futures Contracts</li>
                <li>My Corps</li>
            </ul>
            <br/>

            <p>See the description for each of the above buttons in the section on the
            Entity Info Menu.</p>
            <br/>

            <p>This group of buttons also includes the Recall DB Search List button,
            which recalls your customized database search of companies, updated for
            current values. This group previously also included the Database Search
            button (which is now found on the General Research Menu). Both of these
            buttons and their functions are discussed below.</p>
            <br/>

            <div id="chap10_X(H)(1)">
                <h4><strong>1. RECALL DB SEARCH LIST.</strong></h4>
                <br/>

                <p>This button, when clicked, brings up
                a list of companies that now meet your search parameter specifications that
                you last entered using the DataBase Search function, saving you the trouble
                of bringing up the DataBase Search data entry screen or re-entering your
                search parameters. The list of companies displayed will  vary as time
                passes, since more or fewer companies will meet your search specifications
                at any given point in time.</p>
            </div>
            <br/>

            <div id="chap10_X(H)(2)">
                <h4><strong>2. OTHER QUICK SEARCH BUTTONS.</strong></h4>
                <br/>

                <p>The eight other buttons in the "Quick
                Search Functions" grouping are all the same as similarly named buttons on the
                ${helpLink('chap10_X(D)', 'Entity Research Menu')} (Entity Info button), and their functions
                are explained in the section on the Entity Research Menu. However, note that if the
                current ${helpLink('chap03_III(A)', 'Active Entity')} is you, the player,
                and you click on the Research Report, Earnings Report, or List Shareholders
                buttons in this grouping, those items are not relevant for a player,
                so clicking on them will instead cause information to be displayed (such
                as a Research Report) for the corporation that you had most recently
                selected as the active entity.</p>
            </div>
        </div>
        <br/>
    </div>`;
}
