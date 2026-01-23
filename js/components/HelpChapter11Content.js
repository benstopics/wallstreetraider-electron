import { html } from '../lib/preact.standalone.module.js';

export default function HelpChapter11Content({ helpLink }) {
    return html`<div>
        <h2 align="center"><strong>CHAPTER XI.</strong></h2>

        <div id="chap11_XI(A)">
            <h3><strong>A. IN GENERAL.</strong></h3>
            <br/>

            <p>In addition to the transactions you can do by clicking on any
            of the "Transactions" buttons, as described in Chapters VI, VII, VIII
            and IX, each of which will use up one of the 5 transactions you are
            allowed to do on each turn, the four "Other" buttons ("END TURN" (or
            "MY CHART" in some versions), "MISC" and "STOCK CHART") allow you to
            either end your turn immediately, view a chart of your net worth, do
            certain miscellaneous transactions that do NOT use up any of your
            5 transactions per turn, or view a stock chart for a corporation that
            is the currently selected ${helpLink('chap03_III(A)', 'Active Entity')}.</p>
            <br/>

            <p>The "MISC" item brings up a Miscellaneous Menu that allows you to
            perform various functions such as borrowing from the bank, making a
            bank loan repayment, doing a stock split or reverse stock split for
            a company you control, or doing any of several other functions.</p>
        </div>
        <br/>

        <div id="chap11_XI(B)">
            <h3><strong>B. "END TURN" or "MY CHART" BUTTON.</strong></h3>
            <br/>

            <p>In most versions of Wall Street Raider, there is an "End Turn" button in the "Other"
            group of buttons in the upper right portion of the main screen, while in
            some, more challenging versions, it is replaced by a "My Chart" button,
            since in those versions a (human) player's turn only ends at the end
            of a month and cannot be ended prematurely by the player (unless the
            player goes bankrupt and is ejected from the game). The functions of
            either the "End Turn" or "My Chart" button, whichever appears in your
            version of the game, are described below.</p>
            <br/>

            <div id="chap11_XI(B)(1)">
                <h4><strong>1. END TURN BUTTON.</strong></h4>
                <br/>

                <p>Click on this button to end your turn,
                and allow the next player to take his/her/its turn before your
                turn expires due to time passage or use of all five of your maximum
                allowable transactions. If you are playing against other (human)
                players, you can get tricky and try to end your turn just before a
                quarter ends, or just before mid-quarter, if you can figure out when
                that is. One of a players 5 allowable deductions is lost at the end
                and again at the mid-point of each calendar quarter.</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <hr />
                    <p><em>Sneaky Hint:</em> If playing against another human player, before
                    using the "End Turn" button to end your turn, use the "Select Corp."
                    button and instead of entering a stock symbol, type in the company
                    number "748" or "1500" instead. Then, when an earnings report pops
                    up for that ${helpLink('chap03_III(A)', 'Active Entity')},
                    it will be very near the middle or the end of the quarter,
                    so click on "End Turn" then to end your turn.</p>

                    <p>Then, when the next player begins his or her turn, if he/she starts
                    the ticker, the current calendar quarter will immediately end, and
                    that player will only have four transactions left to do, since one
                    transaction is deducted each time a quarter ends, as well as at
                    mid-quarter. This is sneaky, but effective, at least for the first
                    time you pull that trick out of the hat.)</p>
                    <hr />
                </blockquote>
                <br/>

                <p><strong>NOTE:</strong> This button does not appear in some versions of
                Wall Street Raider, which do not allow you to end your turn until
                a month of game play has elapsed. Instead, the "MY CHART" button
                (see next paragraph) appears in those versions of the simulation.</p>
            </div>
            <br/>

            <div id="chap11_XI(B)(2)">
                <h4><strong>2. MY CHART BUTTON.</strong></h4>
                <br/>

                <p>If you are playing a version of Wall
                Street Raider in which this button appears, instead of an "End
                Turn" button, it is because this version ends a (human) player's
                turn at the end of a month, regardless of whether the player has
                used any or all of his or her 10 transactions (instead of 5 in other
                versions) that are allowed per turn. The player's does not end when
                all 10 transactions are used, but continues (with no more transactions
                allowed) until the month ends. Thus, in that version of the game,
                there is no need for an "End Turn" button, since each player's turn
                lasts exactly one calendar month of "game time."</p>
                <br/>

                <p>The "My Chart" button, if clicked on, simply displays a five-year
                chart of the current player's net worth, the same as if the user
                clicked on the "Net Worth" number on the "My Balance Sheet" section
                of the screen. (Some players, who never bothered to read this manual
                or the "Help" files for Wall Street Raider, have been unaware that
                they could click on the "Net Worth" amount to see a chart of their
                net worth. We think the "My Chart" button will make more players
                aware of the availability of that chart.)</p>
            </div>
        </div>
        <br/>

        <div id="chap11_XI(C)">
            <h3><strong>C. "MISC" BUTTON AND MENU.</strong></h3>
            <br/>

            <p>Clicking on this
            button brings up a short Menu with only five, seven, or eight
            of eleven possible buttons for doing transactions: borrowing,
            repaying a loan, doing stock splits or reverse splits, prepaying
            estimated income tax, advancing money to a controlled company
            or recalling such an advance, setting a stock price alert,
            setting a price alert on a commodity or cryptocurrency, offering
            to sell shares of stock owned by a player or company, offering
            (by an industrial company) to sell business assets, or changing a
            company's name and/or its stock symbol for the rest of the game.
            Unlike other transactions, doing any of the actions on this menu
            will NOT be considered as one of your five allowable transactions
            per turn (or ten allowable transactions per turn on the more
            challenging "alternative version" of Wall Street Raider).</p>
            <br/>

            <p>The number and type of buttons that will appear will differ,
            depending on whether the ${helpLink('chap03_III(A)', 'Transacting Entity')}
            is you, the player, or is a bank, an insurance company, a holding
            company, or an industrial company, or whether the current
            ${helpLink('chap03_III(A)', 'Active Entity')} is an Exchange-Traded
            Fund (ETF) managed by a company you control. The only button that
            always appears on the "MISC" Menu is the "Set Price or Rate Alert"
            button, which will give you stock price alerts on the currently selected
            ${helpLink('chap03_III(A)', 'Active Entity')} or on a commodity or
            cryptocurrency on which you wish to receive an alert if it reaches
            a certain price, or if you wish to receive alerts when the economic
            growth rate (GDP rate) or one of the interest rates reaches a
            certain level.</p>
            <br/>

            <div id="chap11_XI(C)(1)">
                <h4><strong>1. BORROW MONEY.</strong></h4>
                <br/>

                <p>When you click on this box, if you, or
                a company you control are the ${helpLink('chap03_III(A)', 'Transacting Entity')},
                a dialog box will pop up, telling you the maximum you can borrow on your
                line of credit from the bank (if anything). (If the current "active
                entity" is a company you do not control, then the action will be
                taken by the last selected Active Entity that you do control,
                which may be a company or you, the player.) The amount you can borrow
                will also be shown as the default amount in the input area of that
                dialog box, so if you wish to borrow the maximum amount, you need
                only to click on the "OK" button or press the [ENTER] key. If you
                wish to borrow a smaller amount, type the amount into the input
                area, and then click on the "OK" button or press the [ENTER] key.</p>
                <br/>

                <p>If you click on the "Borrow Money" button when the Active Entity
                is a company you do not control, you will see an error message, telling
                you that you do not control that company, and thus you cannot make it
                borrow money. This prevents you from accidentally borrowing money
                for the wrong company, when the currently selected Active Entity is
                a company that you think you control, when you have just lost your
                control of it.</p>
                <br/>

                <p>If the currently selected Active Entity (one controlled by you)
                is a bank, or if the last Active Entity you selected that you
                controlled (the ${helpLink('chap03_III(A)', 'Transacting Entity')})
                was a bank, this button will not usually appear, since banks don't
                borrow on lines of credit. They lend.</p>
                <br/>

                <p>MANAGING AN ETF: In Version 8.70 or later, if the selected
                "Active Entity" is an ETF (Exchange-Traded Fund) whose investment
                advisor is an insurer or securities broker that you control, the
                BORROW MONEY button can be used to have the ETF borrow funds from
                its bank, as you direct, if it has a line of credit.</p>
            </div>
            <br/>

            <div id="chap11_XI(C)(2)">
                <h4><strong>2. REPAY LOAN.</strong></h4>
                <br/>

                <p>If you wish to repay all or part of
                a bank loan owed by you, or owed by a corporation you control,
                click on this button. A small dialog box will appear, and you can
                enter the amount you want to repay. If you, or your company, want to
                pay off the entire loan, or as much as you can with available cash
                and T-bills, simply click on "OK" or press the [ENTER] key. Otherwise,
                type in the lesser amount to be repaid before you click on "OK" or press
                [ENTER].</p>
                <br/>

                <p>If you do not control the lending bank, and one of your corporations
                you control is making the loan repayment, a 2% "prepayment penalty"
                will apply, if you are playing a game at Difficulty Level 3 or 4, unless
                the lending bank is also controlled by you. (You will be warned of the
                prepayment penalty, if it would apply, before you complete the repayment.)</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <hr />
                    <p><strong>MONEY-SAVING TIP:</strong> Before you have your company make a loan
                    repayment that would incur a prepayment penalty, you may want to have it
                    change banks to a bank you control, if that is possible, either by using
                    the "Change Bank" button on the "OTHER TRANS" Menu, or by taking
                    action to acquire control of the bank that is the lender to your company,
                    before the company makes the repayment. Or, you might have a bank you
                    control buy the loan from the other bank, if it is for sale, using the
                    "Buy or Sell Bank Loans" button on the "OTHER TRANS" (or on the "BUY / SELL")
                    Menu.</p>
                    <hr />
                </blockquote>
                <br/>

                <p>Note that the prepayment penalty does not apply to repayments of
                loans by players -- it applies only to corporate loan prepayments.
                The penalty is an expense (like additional interest) to the borrower,
                and is additional income for the bank lender that holds the loan.</p>
                <br/>

                <p>If you click on the "Repay Loan" button when the Active Entity is
                a company you do not control, you will see an message on the left side
                of the dialog box, telling you that you do not control that company,
                and thus you cannot make it repay the loan.</p>
                <br/>

                <p>If the currently selected Active Entity (one controlled by
                you) owes you or another an "advance," for money your or another
                player loaned to the entity, you will first be asked if you want
                to pay off some or all of the advance, if you click on the "Repay
                Loan" button. After you answer that question, you will then be asked
                if you (or your company, if it is the acting entity) want to pay off
                some or all of its bank loan -- if there is a loan balance owed.</p>
                <br/>

                <p>MANAGING AN ETF: In Version 8.70 or later, if the selected
                "Active Entity" is an ETF (Exchange-Traded Fund) whose investment
                advisor is an insurer or securities broker that you control, the
                REPAY LOAN button can be used by such ETF to make a repayment of
                all or part of any bank loan it owes, as you direct.</p>
            </div>
            <br/>

            <div id="chap11_XI(C)(3)">
                <h4><strong>3. STOCK SPLIT.</strong></h4>
                <br/>

                <p>Click on this button if you want to
                declare a stock split for the stock of a company you control
                (which is currently selected as the ${helpLink('chap03_III(A)', 'Active Entity')}).
                You will be able to "split" the stock by increasing the number of
                shares by a multiplier of any amount from 1 to 10. Note that this
                will have no effect on the value of your holdings -- just as cutting
                a pizza into 8 slices instead of 4 will not increase the total
                amount of pizza for your family of 4 people, just by giving each
                person two small slices instead of 1 large slice. However, many
                novice investors think stock splits are important and have asked
                us to add this feature to the program, so we have done so.</p>
                <br/>

                <p>In the real world, a stock split usually occurs after a stock
                has had a large run up, to, say, ${'$'}100 per share, and many small
                investors believe that they somehow will receive something for
                nothing when a split occurs, so they often rush to buy a stock
                when the company announces it will do a stock split, so that a
                split does often add to the momentum of a stock, in the short
                run, a perfect example of a "self-fulfilling prophecy."</p>
                <br/>

                <p>Also, by reducing the price of a stock from ${'$'}100 to ${'$'}25 or ${'$'}33
                by doing a 4- or 3-for-1 split, the stock may become somewhat
                more attractive to small "odd-lot" investors, many of whom would
                be unable to afford the purchase of 100 shares (a "round lot" in
                U.S. markets) at the higher price, so there is usually some minor
                increase in demand for a stock after it has split. However, as
                investors have become more educated in recent years, and small
                investors become less of a factor in markets, splits no longer
                have very much effect on a stock's price, usually.</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <hr />
                    <p><strong>SPLIT EXAMPLE:</strong> If a company has 100 million shares
                    (and you own 10 million of them, or 10% of the stock), and the
                    stock trades for ${'$'}200 per share, your stock is worth ${'$'}2 billion (or
                    ${'$'}2,000 million in the British numbering system). If you split
                    the stock 2-for-1, the company will have 200 million shares
                    outstanding, and you will still own 10% of them, or 20 million
                    shares. However, the stock price will drop by a half, to ${'$'}100
                    per share, so your holdings will still be worth ${'$'}2 billion
                    (${'$'}2,000 million).</p>
                    <hr />
                </blockquote>
                <br/>

                <p>Note that you can only split a stock that trades for at least
                10 per share in Wall ${'$'}treet Raider. Also, no split is allowed
                that would reduce the stock's price per share below 3.00 (in
                dollars, yen, Euros, etc.). If the stock price gets to be too
                high, above 1,000 a share, the program will automatically split
                the stock for you.</p>
                <br/>

                <p>Any time a split occurs, all prior earnings, losses, etc.
                are automatically adjusted to reflect the split. Thus, if
                your stock earned ${'$'}5.00 per share the previous year, and
                you do a 2-for-1 stock split, the prior year's earnings
                will be restated as ${'$'}2.50 per share.</p>
                <br/>

                <p>The Stock Split button does not appear when the currently
                selected ${helpLink('chap03_III(A)', 'Active Entity')} is you,
                the player and does not appear if the currently selected
                Active Entity is a company that you do not control.</p>
            </div>
            <br/>

            <div id="chap11_XI(C)(4)">
                <h4><strong>4. REVERSE SPLIT.</strong></h4>
                <br/>

                <p>Click on this button to do a
                reverse stock split. Reverse stock splits are usually done
                when a stock's price has gotten embarrassingly low, so that
                it appears to be a nearly worthless "penny stock." You can
                reduce the number of outstanding shares and increase the
                per-share price, by selecting any reverse split factor greater
                than 1, up to 10 (which will be the divisor). Thus, if your
                stock, which is in a company you control, is all the way down
                to ${'$'}2.50 a share, you might choose to do a 1-for-10 reverse
                split, which would increase the per-share price to ${'$'}25. The
                number of shares would be reduced by dividing by 10.</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <hr />
                    <p><strong>TIP FOR OPTIONS TRADERS:</strong> If you are unable
                    to buy or sell put or call options on a stock because the
                    market price is less than 5.00 a share and you control
                    the company, have it do a reverse stock split to get the
                    price per share up above 5.00, so you can do the option
                    trades.</p>
                    <hr />
                </blockquote>
                <br/>

                <p>No reverse split is allowed if the stock price is already
                over 100 per share (in whatever currency you have selected
                for the current game).</p>
                <br/>

                <p>If your company's stock price falls below 3.00 per share,
                the program may automatically do a 1-for-10 reverse split,
                in some cases. As with stock splits, reverse splits have
                no effect on the value of your holdings.</p>
                <br/>

                <p>Any time a reverse split occurs, all prior earnings, losses,
                etc. are automatically adjusted to reflect the reverse split.
                Thus, if your stock earned ${'$'}.25 per share the previous year,
                and you do a 1-for-10 reverse stock split, the prior year's
                earnings would be restated as ${'$'}2.50 per share.</p>
                <br/>

                <p>The Reverse Split button does not appear when the currently
                selected ${helpLink('chap03_III(A)', 'Active Entity')} is you,
                the player, and does not appear if the currently selected
                Active Entity is a company that you do not control.</p>
            </div>
            <br/>

            <div id="chap11_XI(C)(5)">
                <h4><strong>5. NAME CHANGE.</strong></h4>
                <br/>

                <p>Click on this button if you wish to change
                the name of a company you control, for the rest of the current game.
                When prompted for the new name, type in a company name, not less than
                5 nor more than 25 characters in length. You can also change its stock
                symbol, by entering a stock symbol of from 1 to 4 letters. The new
                name will be saved as part of the data of the current game, if you
                save the game, to be continued later.</p>
                <br/>

                <p>However, using this "Name Change" feature will not have any
                effect on the company names for the next new game you start. To make
                permanent name changes, you need to have the "Customizer" utility
                program (file name CUSTOMIZ.EXE), installed in the same directory as
                the main Wall ${'$'}treet Raider file (file name WSR.EXE). If the Customizer
                is present, use the Game Options Menu, "Customizer Utility" menu item,
                to branch to that utility program, which allows you to change the
                name, stock symbol, and country where incorporated, for any
                company in the simulation -- permanently (unless you decide to
                change it back, or to something else, later).</p>
                <br/>

                <p><strong><u>NOTE:</u></strong> The "Name Change" button will not appear on the
                "MISC" Menu unless the current ${helpLink('chap03_III(A)', 'Active Entity')}
                is a corporation you control, or unless the last Active Entity that
                you selected during your turn was a company you control. Only company
                names can be changed. (You cannot change the player name you selected
                at the start of a game, once the game has begun.)</p>
            </div>
            <br/>

            <div id="chap11_XI(C)(6)">
                <h4><strong>6. ADVANCE TO CORP.</strong></h4>
                <br/>

                <p>Click on this button if you wish
                to loan (advance) funds to any company that you control. This is
                a useful tool in many situations, such as where you control a
                company that has bonds outstanding that sell at a deep discount,
                and you would like to have the company buy them back, but it has
                no cash or line of credit, and is thus unable to do so. It is also
                a good way to finance a company you control, when you don't wish
                for it to issue bonds, at a time when interest rates are too
                high, or its credit rating is poor and it either cannot issue
                bonds, or would pay too high an interest rate if it did. You,
                the player, will also usually earn a somewhat higher interest
                rate on the funds you advance to a corporation than if you
                left the money in the bank, earning at the CD rate (in most
                cases).</p>
                <br/>

                <p>The loans you make will pay you interest at the same
                Prime Rate charged by banks at the time interest is paid,
                but no principal payments will be made, unless you demand
                payment, in full or in part. If the borrowing company's
                credit rating falls to "D" (the lowest rating), it will no
                longer pay you interest in cash, but will instead "accrue"
                the interest and add it to the amount it owes you.</p>
                <br/>

                <p>Advances are "demand loans," meaning that you can demand
                full or partial repayment at any time from the borrowing
                corporation, regardless of whether or not you still control
                the corporation at the time. However, your loan or advance
                is a subordinated debt. That means it has a lower priority
                than bank loans, bonds issued, or other liabilities (such
                as deposits of a bank, or policy reserves of an insurer),
                in the event the borrower gets in financial trouble or
                goes bankrupt.</p>
                <br/>

                <p>Thus, unless the borrower has at least a "BB" or better
                credit rating (BBB, A, AA, or AAA), you may not always be
                able to call in an advance, if doing so would result in
                the borrower still having a low credit rating. Since
                calling in some or all of the advance will reduce the
                borrower's debts and, therefore, may improve its credit
                rating, it may sometimes be possible to call in some or
                all of an advance when the borrower's credit is worse
                than BB before the loan repayment is made, however.</p>
                <br/>

                <p>See the next section, regarding the "Recall Advance"
                button, which is used when you wish to call in (demand
                repayment of) an advance you have made to any company.
                If you control a company and wish for it to repay an
                advance to you, you can select "PLAYER" as the "active
                entity" and use the "Recall Advance" button to call in
                the advance. If you control a company that owes an
                advance to an opposing player, and wish to have it
                pay off the advance to the other player, select the
                company as ${helpLink('chap03_III(A)', 'Active Entity')} and
                use the "Repay Loan" button (also on this MISC Menu) to
                repay the advance (or attempt to, if your company has an
                adequate credit rating). If a player advances funds to
                a controlled bank, and then loses control, the advance
                will automatically be repaid, almost immediately (unless
                the bank's credit rating is less than "BB").</p>
                <br/>

                <p><strong><u>NOTE:</u></strong> The "Advance to Corp." button is
                only displayed if the currently selected
                ${helpLink('chap03_III(A)', 'Active Entity')} is you, the
                player or if the ${helpLink('chap03_III(A)', 'Transacting Entity')}
                is you, the player.</p>
            </div>
            <br/>

            <div id="chap11_XI(C)(7)">
                <h4><strong>7. RECALL ADVANCE.</strong></h4>
                <br/>

                <p>Click on this button if you
                wish to call in an advance (a demand loan) that you have
                made to a corporation that you control (or controlled at
                the time you made the advance).</p>
                <br/>

                <p>You can call in an advance at any time, provided the
                borrowing corporation is in relatively sound financial
                condition, with a credit rating of BB, BBB, A, AA, or
                AAA. In some cases, you may also be able to call in
                (demand repayment of) some or all of an advance even
                if the company's credit rating is lower than "BB" (but
                not if its credit rating is "D").</p>
                <br/>

                <p>In instances where repayment to you of an advance would
                impair the company's ability to pay off its senior creditors,
                such as bank lenders or bondholders (or bank depositors,
                general creditors, or insurance policy holders, if the company
                that owes you money is a bank or insurance company), you
                will be given an opportunity to "forgive" (write-off, as
                a capital loss) a percentage of your advance to the
                company in question. That may improve its credit rating
                enough so that you can then be repaid the rest of the
                advance. (The amount of the advance that you forgive
                is nontaxable income to the borrower company, but will
                reduce or eliminate any tax losses of the company, dollar
                for dollar. The debt forgiveness is a capital loss to you,
                for tax purposes. However, note that if you directly own 100%
                of the stock of the borrower company, the debt forgiveness
                is not a capital loss to you and does not reduce tax loss
                carryovers of the company, but is instead treated as a capital
                contribution by you, which increases your tax basis in the stock.)</p>
                <br/>

                <p>Some clever players, realizing that forgiving advances to
                a company will instantly improve its balance sheet and thus
                drive up the company's stock price, may be tempted to buy a
                huge number of call options on the stock (or sell a huge number
                of put options short on it, which is roughly the same), before
                doing the forgiveness of the advance. Nice try, but in the
                recent versions of W${'$'}R this is considered a conflict of interest,
                and you will have to close out any such long call option positions
                or short put option positions on the stock before you can do
                a debt forgiveness of an advance to a corporation. Similarly,
                since Version 8.0 introduced convertible bonds into the simulation,
                if you or your controlled companies own the convertible bonds of
                the debtor company and you try to drive its stock up, and thus the
                price of the convertible bonds, by forgiving an advance to the
                company, that is also not permitted.</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <hr />
                    <p><strong><u>NOTE:</u></strong> The "Recall Advance" button will
                    not appear on the MISC menu unless you, the player, are the
                    currently selected ${helpLink('chap03_III(A)', 'Active Entity')},
                    or the ${helpLink('chap03_III(A)', 'Transacting Entity')} is you, the player (or both).</p>
                    <hr />
                </blockquote>
            </div>
            <br/>

            <div id="chap11_XI(C)(8)">
                <h4><strong>8. PREPAY INCOME TAX.</strong></h4>
                <br/>

                <p>Click on this button to prepay
                some or all of your estimated income tax for the current year.
                While the program automatically prepays some of your estimated
                taxes at the end of each quarter during the year, you may want
                to add to the amount prepaid, so that you do not get a rude
                shock by having to pay taxes at the end of the year, at a time
                when you may be fully invested and may be forced to sell some
                of your holdings in order to pay the tax. You can prepay any
                amount up to 20% of your net worth in any one payment (if you
                have sufficient cash and line of credit). Note that once you
                make a tax prepayment, your net worth is reduced, which will
                also reduce your line of credit and may lower your credit rating.</p>
                <br/>

                <p>While this feature was designed mainly for prepaying your
                income taxes, any income tax refund at the end of the year
                can be used to pay other taxes, such as the Wealth Tax or
                Corporate Shares Tax that may apply if you are playing at
                Difficulty Level 4. Thus, in some cases you may want to overpay
                your expected income tax liability in order to make sure you
                are able to pay the Wealth Tax on billionaires or the Corporate
                Shares Tax on stocks you owe, if either of those taxes is
                applicable to you.</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <hr />
                    <p><strong><u>NOTE:</u></strong> The "Prepay Income Tax" button will
                    not appear on the MISC menu unless you, the player, are the
                    currently selected ${helpLink('chap03_III(A)', 'Active Entity')}.</p>
                    <hr />
                </blockquote>
            </div>
            <br/>

            <div id="chap11_XI(C)(9)">
                <h4><strong>9. OFFER TO SELL STOCK.</strong></h4>
                <br/>

                <p>Click on this
                button if you wish to offer for sale a stock owned by
                you or by a company you control. All offers to sell
                are at a 5% discount from the market price, determined
                at the time the offer is accepted by another player or
                company. If you have a large block of stock, and would
                greatly depress the market price if you tried to dump
                it all, this may be a better way to dispose of the stock,
                and without paying a brokerage commission.</p>
                <br/>

                <p>The higher the Analyst's Rating for the stock you are
                offering, the more likely the offer is to be snapped up
                by a buyer. However, if the stock has a "Strong Sell"
                rating, the offer probably will not be accepted.</p>
                <br/>

                <p>All offers expire at the end of the current quarter or,
                if you choose, at the end of the next calendar quarter.</p>
                <br/>

                <p>If you wish to cancel an offer that you have listed,
                go to the "OTHER TRANS." menu and click on the
                ${helpLink('chap09_IX(B)(12)', '"For Sale Items"')} button
                and select the item for the stock you have offered from
                the list of items for sale. You will then be asked if
                you wish to cancel the offer and remove it from the list.</p>
                <br/>

                <p>In Version 8.71 and later, it has become more difficult
                or even impossible to find a buyer for stock of very large
                companies, with the likelihood of a sale using this feature
                declining the larger the company is, partly because there
                are fewer potential buyers that will have sufficient
                liquidity to buy such a large company, and in no case will
                a potential buyer spend more than ${'$'}500 billion (U.S.) to
                snap up your offer.</p>
                <br/>

                <p>Posting an offer of an item for sale does not count as one
                of the five transactions on your turn. However, if the offer,
                or part of the offer, is accepted, it will count as a
                transaction.</p>
            </div>
            <br/>

            <div id="chap11_XI(C)(10)">
                <h4><strong>10. OFFER TO SELL ASSETS.</strong></h4>
                <br/>

                <p>Click on this
                button if a company you control wishes to sell some
                or all of its business assets. All offers to sell
                are at a 5% discount from the cost of the assets. You
                may receive a better price, even at a 5% discount,
                than you would if you tried selling them otherwise,
                and there is no 10% commission if a buyer accepts
                your offer. However, there is no guarantee that your
                offer will be accepted before it expires.</p>
                <br/>

                <p>All offers expire at the end of the current quarter or,
                if you choose, at the end of the next calendar quarter.</p>
                <br/>

                <p>If you wish to cancel an offer that you have listed,
                go to the "OTHER TRANS." menu and click on the
                ${helpLink('chap09_IX(B)(12)', '"For Sale Items"')} button
                and select the offer of assets your company has listed
                for sale. You will then be asked if you wish to cancel
                the offer and remove it from the list.</p>
                <br/>

                <p>Posting an offer of an item for sale does not count as one
                of the five transactions on your turn. However, if the offer,
                or part of the offer, is accepted, it will count as a
                transaction.</p>
            </div>
            <br/>

            <div id="chap11_XI(C)(11)">
                <h4><strong>11. SET PRICE OR RATE ALERT.</strong></h4>
                <br/>

                <p>Click on this
                button to set up a price alert on the stock of the current
                ${helpLink('chap03_III(A)', 'Active Entity')} or on a
                commodity or cryptocurrency when the selected item reaches
                a certain price point you set. When you first click on it,
                you will see the following menu of types of price alerts,
                for a stock (usually the current "Active Entity"), or for
                the Stock Index, or for any of five commodities, or
                either of the two crytocurrencies, or rate alerts for
                the three different interest rates in the simulation or
                the rate of GDP growth, as shown here:</p>
                <br/>

                <p align="center"><img src="alerts.jpg" alt="alerts.jpg (59098 bytes)" WIDTH="375" HEIGHT="352" /></p>
                <br/>

                <p>Choose the asset on which you want to set up a price
                alert from the list shown and then click on the "APPLY"
                button to make the selection.</p>
                <br/>

                <p>Then, simply enter a price (or rate, in the case of an
                interest rate or GDP growth rate) when prompted and if it
                is above the current price of the stock (or Stock Index or
                commodity or cryptocurrency), you will be alerted (on your
                turn only) if the item's price equals or exceeds the price
                you have entered; or if you enter a price below the current
                price of the item, you will be alerted if the price of the
                item falls to or below the price you specified. A rate alert
                when a certain rate reaches a level that you specify works
                the same way as a price alert. You can have multiple price
                alerts on any stock, the Stock Index, a commodity or
                cryptocurrency, and multiple rate alerts can be set up on
                an interest rate or on the GDP growth rate.</p>
                <br/>

                <p>Note that if there are multiple human players and, for
                example, a stock meets your price objective of, say, 40 a
                share or above, while it is another (human) player's turn,
                the notification will not be triggered. When it becomes your
                turn again, you will instantly be notified if the stock's
                price is still above 40, but if the stock has fallen back
                below 40 when your turn starts, you will not be notified
                when your turn begins, and the alert will remain in effect
                until the stock either reaches 40 again and you are notified,
                or until the alert expires.</p>
                <br/>

                <p>Once an alert is entered, it will remain in effect for
                approximately one year of game play or until the alert is
                triggered, whichever occurs first. When the asset or rate
                reaches the price point or rate level you have set, a message
                will pop up, notifying you that your specified price or rate
                objective for that item (also specified) has been met.</p>
                <br/>

                <p align="center">SUGGESTIONS FOR USING PRICE OR RATE ALERTS:</p>
                <br/>

                <ul>
                    <li>The stock price alert feature is particularly
                    useful if you own convertible bonds and the underlying stock
                    is near or below the conversion price. In that case, you might
                    want to set a price alert on the stock for a price point 30%
                    to 50% or so above the conversion price of the bonds, as a
                    reminder, if the stock makes a big up move, that it may be
                    time to cash in the bonds for a nice profit. That way, you
                    can in most cases buy a convertible bond and forget about it
                    until it either pays off at maturity, is called, or has run
                    up significantly in value and you get the notice that the
                    underlying stock has moved up a lot, so the bonds may then
                    be trading at 130 to 150 or so.</li>
                    <br/>

                    <li>Another of the ways setting a stock alert can be useful
                    is, for example, if you have bought or sold "out-of-the-money"
                    call options on a stock, in which case you might want to be
                    alerted if the options suddenly become "in-the-money," by
                    setting a stock price alert at or slightly above the option
                    strike (exercise) price.</li>
                    <br/>

                    <li>A more typical use of price alerts, for a commodity or
                    cryptocurrency, as well as for a stock, is when you want to
                    buy the item but feel it is currently overpriced, and want
                    to be notified if it falls to a price point where you would
                    consider buying it. Or, likewise, if you own an asset but
                    plan to sell it if it reaches a certain higher price, you can
                    set up a price alert so you will be notified if it reaches
                    that price.</li>
                    <br/>

                    <li>If you have large positions in interest rate-sensitive
                    investments, such as bonds or financial companies, or
                    housing and building materials stocks, you may want to set
                    up an interest rate alert, such as for the Prime Rate, at
                    a level where you want to be reminded that interest rates
                    have risen or fallen significantly, so that it may be time
                    to either cut back or increase your exposure to interest
                    rate-sensitive securities, or interest rate swaps.</li>
                </ul>
                <br/>
            </div>
            <br/>

            <div id="chap11_XI(C)(12)">
                <h4><strong>12. TRADE TREASURY BILLS.</strong></h4>
                <br/>

                <p>Use this button to
                either sell short-term Treasury bills ("T-bills") or buy them,
                for yourself or any company you control. In Version 8.50 and
                later of Wall Street Raider, "cash" (bank demand deposits)
                of players or companies do not pay interest. (We decided you
                needed more of a challenge....) In all earlier versions of
                the game, "cash" of players or companies in Wall Street
                Raider was assumed to be interest-bearing Certificates of
                Deposit (CDs).</p>
                <br/>

                <p>However, in the real world, companies do not tie up all their
                liquid assets in such restricted time deposits. Thus, to make the
                simulation more realistic, companies will now generally keep a
                portion of their liquid assets in non-interest-bearing bank demand
                deposits (like checking accounts), and a portion invested in
                ultra-safe short-term Treasury bills issued by the Government.
                This change will tend to make banks more profitable in Wall Street
                Raider if a bank has large bank deposits from companies or players
                in the simulation. Banks will also be able to (safely) invest what
                would otherwise be idle cash in T-bills, to earn interest. For
                other companies, other than banks, it will make the game a bit more
                challenging....</p>
                <br/>

                <p>T-bills are very liquid assets and are a cash equivalent; also,
                they pay interest, at the T-Bill Rate, which is usually a rate
                that is somewhat less than the interest rate on short-term
                government bonds, but is certainly better than nothing.</p>
                <br/>

                <p>Thus, you will generally want to keep most of your liquid
                funds invested in T-bills, in order to earn interest, albeit at a
                pretty low interest rate. T-bills are the safest of all assets,
                unless the government goes broke and defaults (very rare, but
                possible, in Wall Street Raider). Bank deposits ("cash") in
                W${'$'}R, on the other hand, can be lost if the bank goes bankrupt
                -- which is not that unusual an event in this simulation!</p>
                <br/>

                <p>Companies that are not controlled by a player, or which are
                controlled by a player, but are on "AutoPilot," will generally
                keep between 60% and 80% of any liquid funds invested in
                T-bills and between 20% and 40% in cash, for their operations.
                The software automatically makes these re-allocations when the
                percentages of cash and T-bills fall out of the above ranges,
                automatically, for all such companies, although this is done
                on a gradual basis, not all at once.</p>
                <br/>

                <p>If a player turns on the "sweep" setting, to automatically
                sweep the player's cash immediately to pay down debt, but the
                player does not owe any debt at the moment, then any free cash
                balances of the player will automatically be "swept" (invested)
                entirely in T-bills instead of being applied to loan reduction.</p>
                <br/>

                <p>Thus, this function for buying or selling T-bills will mostly
                be used to buy T-bills for companies that are actively managed
                (those not on "AutoPilot") or for a player's account if he or
                she has turned the "sweep" setting to OFF.</p>
                <br/>

                <p>Buying or selling T-bills with this function is not counted as
                one of the five transactions (ten in the "alternative" version
                of W${'$'}R) a player is allowed to do on each turn.</p>
            </div>
        </div>
        <br/>

        <div id="chap11_XI(D)">
            <h3><strong>D. "CHEAT" BUTTON AND MENU.</strong></h3>
            <br/>

            <p>Click on this button to
            bring up a small "Cheat Menu." The CHEAT MENU has 3 items, the
            first one being the "add cash" option, which will disqualify you
            from winning the current game if you use it to add cash to your
            bank account. In releases prior to Version 8.9, you could add unlimited
            amounts to your account, like 939,490,421,513,040,049,892, which was
            totally unrealistic and could throw the entire simulation out of
            whack just as such a sudden appearance of so much new money would
            totally disrupt the real world economy. Thus, there is now a limit
            of ${'$'}1 trillion that you may add to your bank account, and doing so
            disqualifies you from winning the game or setting a new personal best
            record, but does not disqualify the other players. (In v. 7.83 and
            earlier, if you added cash to your account, the same amount was
            added to the accounts of all the other players, and all players
            were disqualified. That is no longer the case, so the other players
            are not disqualified.)</p>
            <br/>

            <p>Three other cheats, two involving inside information, are now
            available on this menu � receiving advance notice of upcoming mergers
            or information on a surprising upcoming major change in a company�s
            earnings � either for the better or for the worse. Feel free to
            use these (risky) cheats, neither of which will disqualify your
            game score. The other new cheat lets you disable some or all of the
            game's antitrust rules.</p>
            <br/>

            <p>Buying the stock (or in some cases, shorting it, depending on the
            information) after you have received the "leaked" insider information
            is usually quite profitable. Your "record high score" possibilities
            will also not be disqualified if you use either of these two new cheats
            � but you will risk incurring massive fines for trading on such
            illegal inside "information." (The more often you trade on such inside
            information, the greater the odds that you will be caught and fined by
            the authorities, of course.)</p>
            <br/>

            <p>Once you have decided to receive an "inside information" stock tip,
            you can also use the same item on the Cheat Menu to get a status report
            from your tipster, letting you know if the information is still valid.
            (Assuming that your tipster hasn't been arrested or imprisoned for
            securities fraud, or if he or she is possibly a stool pigeon, "squealing"
            on you.)</p>
            <br/>

            <p>Once you have been "prosecuted" (or acquitted), if either occurs,
            you will no longer be able to obtain tips from your "insider" source
            for the rest of the game. Note that in the "shareware" version, only
            one tip per game (per player) is allowed.</p>
            <br/>

            <p>Version 9.50 of Wall Street Raider added a fourth cheat item to the
            Cheat Menu, as suggested by a player who felt the antitrust rules made
            it too difficult to dominate or completely monopolize an industry.
            (Of course, that is what antitrust laws are supposed to do!) So
            Wall Steet Raider now offers a cheat option to turn off either the
            private (corporate) antitrust suits by companies against companies,
            or the government restrictions, which include blocking some mergers
            or takeovers that would potentially be anti-competitive, and in
            some cases imposing large fines or forcing divestment of some
            companies a player controls in an industry that his/her companies
            dominate or have monopolized.</p>
            <br/>

            <p>This new cheat lets you either turn off the private antitrust
            suits or eliminate the government restrictions (and fines and
            divestitures), or turn off both, so that there are NO antitrust
            rules, and there is unfettered, cutthroat competition between
            players who seek to monopolize industries. Turning off all the
            antitrust rules in Wall Street Raider is a bit like turning back
            the clock to the "robber baron" days of the late 1800s, when there
            were few, if any, limits on monopolies and unfair competition in
            business. So, if you like that kind of lawless environment, use
            this cheat to turn off the antitrust rules, or to at least turn
            off some of them.</p>
            <br/>

            <p>If you do use the "no antitrust rules" cheats, however, be
            aware that any such change remains in force for the rest of
            the current game, and all of the players in that game will be
            disqualified from achieving a record high game score. However,
            using this cheat will not disqualify any player from being the
            winner of the current game, since this cheat will affect all
            players equally, at least in theory. (It will give you an
            unfair advantage if you are not playing against any other
            human players, since the computer players will not specifically
            try to monopolize any industry.)</p>
            <br/>

            <p>The Cheat Menu is not accessible if "Cheat Mode" has been
            turned off on the "Settings" pull-down menu by any player,
            unless "Cheat Mode" is turned back on.</p>
        </div>
        <br/>

        <div id="chap11_XI(E)">
            <h3><strong>E. "CHART" BUTTON.</strong></h3>
            <br/>

            <p>Clicking on
            this button causes a stock chart to be displayed for
            the current ${helpLink('chap03_III(A)', 'Active Entity')} if
            that entity is a corporation or, if you (the player) are
            the current Active Entity, the chart that will be displayed
            is for the last corporation that WAS the Active Entity.</p>
            <br/>

            <p>The program keeps track of the monthly high, low,
            and ending stock price of each of the companies in the
            simulation as a game is played, for the most recent
            five years of play. Thus charts will display up to 60
            months of stock price information for a company and
            can give you a quick view of how the company has been
            faring in the stock market.</p>
            <br/>

            <p>The price action for each month is shown as a vertical
            bar on the graph, with the upper end of each bar representing
            the highest stock price for that month and the bottom
            end representing the lowest price. The short horizontal
            marker on each such bar shows where the stock traded
            on the last day of the month. Stock prices are calibrated
            on the right side of the chart, and dates are marked on
            the bottom of the chart, with the larger date markers
            representing the point where each year ends and the
            smaller markers representing the end of each calendar
            quarter.</p>
            <br/>

            <p>Stock prices used in making the charts are stored
            by the program when you save a game file. Note that
            game files will save or be retrieved a bit slower than
            in prior versions of Wall ${'$'}treet Raider, since the large
            mass of stock price data has more than doubled the size
            of saved game files, from about 500kb in Version 4.10
            and earlier versions, to about 5 to 10 megabytes in Version
            4.50 and later that save the stock price records.</p>
            <br/>

            <p>While a stock price chart is a bit unrealistic for a
            company that is privately owned (has no publicly traded
            shares), the stock chart can be thought of as tracking
            its fair value from month to month, as though its stock
            were being traded.</p>
            <br/>

            <p>Note that when a new company is started up at any
            time during a game, it will not be possible to view its
            price charts until it has been in existence for 3 months
            or more. Similarly, if all of the stock of a company is
            canceled when it goes through a "Chapter 11" bankruptcy,
            with new stock issued, the price history of its old
            stock will be wiped clean, since the company is
            essentially starting over, from the standpoint of stock
            ownership.</p>
            <br/>

            <p>The only other situation (rare) where a stock's
            chart cannot be displayed is where the stock price
            has exceeded 10,000 dollars (Euros, pounds, etc.)
            per share during the last five years of game play.
            In that unlikely event, you could do one or more
            ${helpLink('chap11_XI(C)(3)', 'stock splits')}, so
            that the restated (split) price would no longer
            exceed 10,000 at any point in the period covered
            by the stock chart.</p>
            <br/>

            <p>A "BUY" button appears on most stock charts, allowing
            you to click on it to quickly begin the process of buying
            the displayed stock. In some cases, where the charted stock
            is not the current ${helpLink('chap03_III(A)', 'Active Entity')},
            if it is the entity that would be buying (itself), or in certain
            other cases, the "BUY" button is not always displayed, such as
            where the buying entity (you or a company you control) already
            owns and/or has short positions in 15 other stocks.</p>
            <br/>

            <p><strong><u>NOTE:</u></strong> The stock charts feature is
            not enabled in the "shareware" version of Wall
            ${'$'}treet Raider.</p>
        </div>
        <br/>
    </div>`;
}
