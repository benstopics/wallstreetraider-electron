import { html } from '../lib/preact.standalone.module.js';

export default function HelpChapter8Content({ helpLink }) {
    return html`<div>
        <h2 align="center"><strong>CHAPTER VIII.</strong></h2>

        <div id="chap08_VIII(A)">
            <h3><strong>A. IN GENERAL.</strong></h3>
            <br/>

            <p>Except for borrowing money or making loan repayments, all other
            transactions in Wall $treet Raider, such as buying or selling stock,
            bonds, or other assets, are done by clicking on one of the six
            buttons on the "Transactions" grouping of buttons on the main menu
            screen. Each such transaction selected from the "Transactions"
            grouping that is completed counts as one of the 5 (or 10 in the
            "alternative" version of W$R) transactions allowed on a player's
            turn. Other actions, such as borrowing money or repaying loans,
            or doing stock splits or corporate name changes, can be done by
            clicking on the "MISC" button on the main screen and selecting an
            item such as "Borrow Money" or "Repay Loan" from the pop-up Menu
            that will appear, but none of those actions count against you as
            one of your 5 allowed transactions per turn.</p>
            <br/>

            <p>To initiate a transaction, click one of the six "Transactions"
            buttons:  Buy Stock, Sell Stock, Buy/Sell, Financing, Management, or
            Other Trans., on the main menu screen, and, except when clicking on
            the Buy Stock or Sell Stock buttons, one of four different Menus
            will pop up, each listing anywhere from 2 to 13 possible transactions,
            with a button for each. Then click on the appropriate button to begin
            the type of transaction you wish to do.</p>
            <br/>

            <p>Note that, while viewing each Transactions pop-up Menu, the Menu
            screen will have a text-box on the left, describing the allowable functions,
            and sometimes will include other useful information, such as the current
            buying power (cash plus line of credit) of the currently selected
            ${helpLink('chap03_III(A)', 'Active Entity')}, if it is also the
            ${helpLink('chap03_III(A)', 'Transacting Entity')}.</p>
            <br/>

            <p>The various buttons for the different types of transactions will
            appear in a vertical row on the right side of the pop-up Menu.  At the
            bottom of that dialog screen will be 3 additional buttons:  A "Close" button
            to close the Menu and exit back to the main menu screen; a "Player"
            button (click it to instantly change the Active Entity that is to do
            the desired transaction to you, the player); and a "My Corps." button,
            which will let you select a corporate entity you control as the new
            ${helpLink('chap03_III(A)', 'Active Entity')}, which will do the transaction(s)
            you are planning to execute.</p>
            <br/>

            <p>The next segment that follows describes the various "MANAGEMENT"
            transactions that you can do if you select the "MANAGEMENT" button.</p>
        </div>
        <br/>

        <div id="chap08_VIII(B)">
            <h3><strong>B. "MANAGEMENT" BUTTON AND MENU.</strong></h3>
            <br/>

            <p>Clicking on the "MANAGEMENT" button brings up a pop-up Menu that has
            various command buttons which allow you do a number of different
            transactions that affect the way your controlled company is
            managed, such as by setting the rate at which it will expand
            its investment in business assets, by determining how much it
            will spend each year on productivity expenses (such as
            Research & Development, or marketing/advertising), or by
            setting the amount per share that the company will pay out
            as dividends.</p>
            <br/>

            <p>Other management functions in this group of transaction
            buttons include changing (firing) the management team, electing
            yourself as CEO of the corporation (thus earning a fat salary),
            resigning as CEO, filing antitrust lawsuits against competitors
            in your company's industry, and doing corporate "restructurings,"
            in an attempt to "turn around" an unprofitable and inefficient,
            poorly-performing company.</p>
            <br/>

            <p>The text box that appears when you are viewing the
            Management Menu will tell you, if you are unemployed, if
            you could be drawing a large executive pay package (salary
            and bonus) if you had yourself elected CEO of the company
            you control which offers the highest CEO pay (not counting
            executive stock options). The text box also will offer advice
            from time to time on other tactics you may want to adopt,
            such as filing an antitrust suit against a company in the
            industry your currently selected company is in, or other
            suggestions such as changing a company's management or
            doing a restructuring if it is poorly run.</p>
            <br/>

            <p>The use of each of these management tools is described
            below, in the following paragraphs.</p>
            <br/>

            <p>You will note that, if the current ${helpLink('chap03_III(A)', 'Transacting Entity')}
            is you, the player, rather than a corporation, that only
            the first two buttons described below will appear on the
            "FINANCING" Menu, since the other transaction buttons on
            this Menu are for corporations only.  Also, certain other
            buttons will not appear if the Transacting Entity is a bank,
            an insurance company, or a holding / trading company. All
            eight buttons appear only if the Transacting Entity is an
            "industrial" type of corporation (any corporation but a
            bank, insurer, or holding company).</p>

            <div id="chap08_VIII(B)(1)">
                <h4><strong>1. ELECT ME AS CEO OF (COMPANY).</strong></h4>
                <br/>

                <p>The "Elect CEO" command button can be used to elect yourself president or CEO (chief executive
                officer) of a company you control. Clicking on that button will
                automatically make you the president and CEO of whichever
                ${helpLink('chap03_III(A)', 'Transacting Entity')} (company) you
                have currently selected, if any, if you control the company.
                Or, if you only control one company at the moment, clicking on
                this button will cause you to be elected as its CEO, even if it
                is not the currently selected Transacting Entity or Active Entity.</p>
                <br/>

                <p>While you will already control the company and its board of
                directors, by virtue of your stock holdings, even if you are not
                its CEO, having the board of directors elect you to the position
                of CEO means that you will then be able to draw a salary from the
                company and you may also be granted (restricted) executive stock
                options from time to time. This is good, usually.</p>
                <br/>

                <p>You may also receive an annual performance bonus of 150%, 300%,
                or 500% of salary (or twice those amounts if you control 51% of the
                company's stock), if you are able to consistently increase your
                company's earnings by more than 15% a year for several years while
                you are its CEO, and you will receive a 100% bonus each year even
                if you do a terrible job of running the company, as long as you
                control 51% of its stock, directly or indirectly.</p>
                <br/>

                <p>To receive more than a 100% bonus, not only must earnings
                increase by over 15% a year, but you must also have been the
                CEO since <em>before</em> the years in which such earnings growth
                was achieved. (Wall $treet Raider keeps track of the year you were
                hired.) Thus, "seniority" is important, so if you click on this
                button to become CEO of a company and already are CEO of another
                company with which you have seniority that will be lost, you
                will be asked if you are sure you are willing to lose that
                "seniority" and start from zero as a new CEO of another company,
                with no seniority.</p>
                <br/>

                <p>For more details on how bonuses are computed, see the FAQ
                item on ${helpLink('chap03_III(N)', 'Executive Compensation')}.</p>
                <br/>

                <p>When you select this command button, you will be shown what
                your estimated annual compensation will be from that company. (The
                greater the company's stock price, the higher your salary will be,
                in general). Base salary compensation is paid quarterly, so long
                as you remain president/CEO, while any bonuses you receive are
                paid at the end of each year. Any cash compensation paid to you
                is taxable income to you, and is a deductible expense for the
                corporation, which reduces its income. The value of stock options
                granted to you is a cash expense to the company if the options
                have value at the time they expire, or if you sell the vested
                options back to the company before expiration.</p>
                <br/>

                <p>Stock options are granted in the first month of each quarter (but
                no options are granted if the company's stock is not publicly traded).
                Each grant is for 2% of the company's stock, or 8% over the course
                of a year. The options all expire in two years after the date of
                grant and are restricted -- meaning that you cannot (voluntarily)
                sell them during the first year after the date they were granted.
                If you do sell them, the amount you receive will be taxable income,
                but qualifies for favorable capital gains tax rates. You recognize
                no taxable income if the options expire worthless, or if you exercise
                them to buy newly issued stock from the company (which will buy an
                equal amount of publicly traded stock on the open market, to prevent
                dilution of its stock). However, if you exercise the options, you
                will be buying the stock at below its current price, so if you
                immediately sell the stock you may have a capital gain, because
                of the bargain purchase price.</p>
                <br/>

                <p>You can only serve as president of one company at any time,
                so you will usually want to be CEO of whichever company you
                control that can pay the largest CEO salary. But once you lose
                "control" of a company of which you are the president/CEO, you
                will also lose your job, by the end of the current calendar year,
                or sooner if you take another CEO job or are fired by another
                player who takes over the company. If you lose your job as CEO
                of a company and no longer control the company, any unvested
                executive options the company has granted you in the last year
                will immediately be canceled -- that is, forfeited, so losing
                your position and control of your company can be expensive.</p>
                <br/>

                <p>Using this command button counts as one of your 5 plays per turn
                (unless you are already president of the company selected, in
                which case it will merely show you your estimated salary level,
                but will not count as a play).</p>
                <br/>

                <p>As a rule, the greater the size of your company, the larger
                the CEO salary it will pay you and the more your executive stock
                options will be worth. However, the compensation calculation is
                fairly complex. Its starting point is the total stock market value
                of the company, but that is reduced for any "passive assets"
                the company holds, such as cash or stocks of other companies,
                after adding back debt. In short, you don't get paid a lot to
                simply have the company sit on a lot of cash, or invest in a few
                stocks -- it has to have a lot of money invested in business
                assets and working capital in order for you to be able to
                justify a large cash compensation package.</p>
                <br/>

                <p>Thus, if the company's passive assets, less debts, are greater
                than its market value, the "base" number on which your salary is
                computed would be less than zero, in which case you would only
                receive the minimum annual CEO salary of $0.2 million ($200,000)
                U.S., or the equivalent in any other currency. Hence, if you
                can get the company's stock up to where it trades for more than
                its net worth per share, you will be able to increase your pay,
                plus cash in big on your stock options. This, in the real world,
                is called "incentive compensation" for "getting the stock up."
                It works the same way here.</p>
                <br/>

                <p>The CEO salary for banks and insurance companies starts
                out as being calculated at half that for other companies, but
                the capitalization number (stock value) on which it is based
                is not reduced by the value of bonds owned by the bank, or by
                stocks or bonds owned by an insurance company. Those are not
                treated as "passive assets" for those kinds of companies, as
                those kinds of assets are part of their main businesses of investing
                in financial instruments. The CEO salary for an insurance company
                may also be increased somewhat in some cases, based on the amount
                of insurance the company has in force (or its policy reserves).</p>
                <br/>

                <p>Note that if you are CEO of a company, and an opposing
                player takes control of the company, they may fire you
                immediately, either by electing themselves as the new
                CEO, using this command button, or else by using the
                "${helpLink('chap08_VIII(B)(2)', 'Change Managers')}" button
                discussed in subparagraph (3) below to fire the existing
                management team (including you).</p>
            </div>
            <br/>

            <div id="chap08_VIII(B)(2)">
                <h4><strong>2. RESIGN AS CEO OF (COMPANY).</strong></h4>
                <br/>

                <p>The "Resign as CEO" command button allows you to resign from your position as President and CEO
                of a company. Use this feature if you prefer not to draw a salary
                or bonus from any company you control. This may be advisable,
                since drawing a salary from one of your companies will constitute
                a considerable expense for the company and will reduce its reported
                earnings and cash flow somewhat, which may also reduce its stock
                price. Resigning as CEO of a company will be particularly
                appropriate if the company is either in weak financial condition,
                or has accumulated tax loss carryovers, and thus is unable to
                obtain an immediate tax benefit from the expense of paying
                salary and/or bonuses to you.</p>
                <br/>

                <p>To receive more than a 100% bonus as a company CEO, not only
                must its earnings increase by over 15% a year, but you must also
                have been the CEO since <em>before</em> the years in which such
                earnings growth was achieved. (Wall $treet Raider keeps track of
                the year you were hired.) Thus, "seniority" is important, so if
                you click on this button to resign as CEO of a company with which
                you already have seniority that will be lost, you will be asked
                if you are sure you are willing to lose that "seniority," since
                you might be eligible for large bonuses if you could turn the
                company around and increase its earnings in subsequent years.</p>
                <br/>

                <p>For more details on how bonuses are computed, see the FAQ
                item on ${helpLink('chap03_III(N)', 'Executive Compensation')}.</p>
            </div>
            <br/>

            <div id="chap08_VIII(B)(3)">
                <h4><strong>3. CHANGE MANAGERS.</strong></h4>
                <br/>

                <p>The "Change Managers" command button (to change a company's management team) is a tool that
                allows a player who controls a company to fire the management
                team of the company if they appear to be incompetent or lackluster.
                In Wall $treet Raider, you can usually tell if an industrial
                company (any non-financial company) is incompetently managed
                if its return on business assets, adjusted for its level of
                productivity spending (R & D, or marketing/advertising) is
                significantly lower than that of other companies with similar
                market share in its industry. Or, when reading a research
                report on the company in the "ENTITY INFO" research Menu
                (using the "${helpLink('chap10_X(D)(2)', 'Research Report')}"
                command button), you will note that there is usually a comment
                in the report on the management's capabilities, good, bad, or
                indifferent.</p>
                <br/>

                <p>In any case, if you want to re-throw the dice for your
                company, by putting in a new management team, use the "Change
                Managers" command button to do so. Simply click on that button
                on the "MANAGEMENT" Menu that pops up when you click on the
                "MANAGEMENT" button on the main menu screen and you will be
                informed as to how much it is going to cost the company to pay
                off the managers you are firing, before you give your final
                approval to their termination.</p>
                <br/>

                <p>Note that if you fire management of a particular company
                too frequently, you will develop a bad reputation, and may
                have a hard time attracting qualified replacements.</p>
                <br/>

                <p>In any case, once you have fired and replaced a company's
                management team, nothing will happen immediately, except that
                the severance pay and other costs of the termination may put
                a fairly good-sized dent in the company's earnings for that
                calendar quarter.  Then it may be months or even a year or
                two later before you begin to see any results.  It may turn
                out that the new management team is made up of geniuses....or
                idiots....or something in between. In any case, if you watch
                the news headlines carefully, you will eventually see an
                announcement, describing how the new management team has
                turned the company around; or is no better than the old
                managers; or has turned out to be a complete disaster!</p>
                <br/>

                <p>This function is separate from the "${helpLink('chap08_VIII(B)(1)', 'Elect CEO')}" feature described above, which is used only to elect
                yourself as president and CEO of one of the companies you control.
                The "Elect CEO" function is not generally used for firing existing
                managers, except in the rare case where you take control of a company
                whose CEO is one of the other players. In that case, whether you
                have the company's board of directors elect you as the new CEO,
                using the "Elect CEO" command button, or you use the "Change Management"
                command button to fire all of the existing management team, the other
                player who is CEO of the company will immediately be fired, and will
                cease drawing a salary (but will receive a "${helpLink('glossary_CHUTE', 'golden parachute')}" payment, usually).</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <hr />
                    <p>Note that, since you control the company, your firing of the
                    management team will never mean that you are also fired, if you happen
                    to be the CEO of the company when you fire the management team.  As
                    long as you control the company, your job is safe, even if you are
                    doing a miserable job of running the company.  Only your underlings
                    lose their jobs in the "house-cleaning." (By the way, this is
                    <u>EXACTLY</u> the way things work in the real world....  It's the Golden
                    Rule -- "He who has the gold, makes the rules.")  May it ever be so....</p>
                    <hr />
                </blockquote>
                <br/>

                <p><strong><u>NOTE:</u></strong>  This button will not appear on the
                "MANAGEMENT" Menu if the current ${helpLink('chap03_III(A)', 'Transacting Entity')}
                is you, the player, as it is only relevant for a corporate entity.</p>
            </div>
            <br/>

            <div id="chap08_VIII(B)(4)">
                <h4><strong>4. SET DIVIDEND PAYOUT.</strong></h4>
                <br/>

                <p>Click on the "Set Dividend Payout" button if you want to change the amount a company pays out each
                quarter as dividends.  The amount of payout will be based on the
                payout amount per share that you set. The program will tell you how
                much per share you may set the dividend at, from zero to a certain
                amount, such as $1.50 per share.  In general, the better your company's
                credit rating, the higher the dividend payments it can make.</p>
                <br/>

                <p>If the company has a negative net worth or "D" credit rating, it
                will cease paying out any regular dividends, and it may be forced
                to reduce its dividend if its credit rating falls too low, such as to
                "CCC" or lower.</p>
                <br/>

                <p>Be aware that dividends paid out by a company to a player
                may result in double taxation, unless the player has enough
                expenses (such as interest on loans) to shelter the dividends
                he or she receives from tax.  Thus, in the simplest case, if a
                company earns $100 million pre-tax, and pays a 40% income tax,
                its after-tax earnings will be $60 million. If it then pays
                out 100% of its net income (the $60 million) to its owner,
                assuming the player owns 100% of the company's stock, that
                $60 million will be taxed to the player at, for example,
                45%, so that the player only gets to keep $33 million after
                income taxes -- out of the $100 million the company earned
                and paid out! Thus, the "double taxation" of the company's
                earnings would add up to $67 million, or 67% of the $100
                million the company earned, a very confiscatory tax rate.
                And if rates were very high, such as 50% and 55% corporate
                and individual rates, for example, the combined rates would
                amount to 77.5%, leaving you with only $22.5 million after
                taxes on the $100 million earned by the company.  Ouch!
                That's no way to get rich!</p>
                <br/>

                <p>Therefore, it is often better <u>not</u> to pay out dividends,
                unless the player needs the cash to pay interest expenses on a
                bank loan.  To the extent you can, it is usually best to leave
                profits in the corporation you control, which should eventually
                cause its earnings and stock price to rise.  Then, if you sell
                the stock, you will pay the second tax at the much lower capital
                gains tax rate.  Or, if you hold the stock until the end of the
                game, you <u>NEVER</u> pay the double tax at all.  (Which is
                somewhat like the real-life tax planning strategy of dying
                before you have to sell your stocks.)</p>
                <br/>

                <p>Remember, if your company owns stock in one or more
                subsidiaries, its reported income from those subsidiaries
                will increase its net income, and thus increase the amount
                it is paying out, if, for example, it pays out 40% of its
                earnings as dividends.  But its reported income from those
                subsidiaries may be much more (or less) than any cash it
                receives as dividends from the subsidiaries, so you may
                notice that the parent company has plenty of reported income,
                but little or no cash coming in, and may be forced to borrow
                more and  more, in order to keep paying out dividends.  One
                solution in that case would be to make sure the subsidiaries
                are also paying out a similar percentage of their income, in
                cash, to the parent company.</p>
                <br/>

                <p>Using the "Set Dividend Payout" command button, you can set
                a company's dividend payout within a range that is permitted by
                the program (which is generally based on the company's credit
                rating).  The maximum yield you can set, using the "Set
                Dividend Payout" command button is as follows:</p>
                <br/>

                <blockquote>
                    <strong><small>
                    <pre>${`Credit Rating    Maximum Dividend Yield You Can Set
-------------    ----------------------------------
     AAA           20% (if company has no debt; otherwise
                   11%, or 10% if it is a bank or insurer)
      AA           20% (if company has no debt; otherwise
                   11%, or 10% if it is a bank or insurer)
       A           10%
     BBB           9%
      BB           8%
       B           7%
     CCC           6%
      CC           5%
       C           4%
       D           0%`}</pre>
                    </small></strong>
                </blockquote>
                <br/>

                <p>The program computes the above maximum yield, and, based
                on the current price of the company's stock, computes the
                per share dividend amount equal to that dividend yield, which
                is displayed as the maximum you can increase the dividend
                rate to when using the "Set Dividend Payout" feature.</p>
                <br/>

                <p>A stock may have a dividend yield that is higher than
                the percentages in the above table, if its stock price
                declines after you have set the dividend at the maximum level.
                In that case, you can change the dividend to a lower payout,
                which can still be higher than in the above table, but lower
                than the current payout amount. If no player controls a
                company and its dividend yield percentage is very high, the
                program will generally reduce the dividend payout to a more
                reasonable level; or, if the company gets into financial
                trouble, will cut out the dividend entirely.</p>
                <br/>

                <p><strong><u>NOTE:</u></strong>  This button will not appear on the
                "MANAGEMENT" Menu if the current ${helpLink('chap03_III(A)', 'Transacting Entity')}
                is you, the player, as it is only relevant for a corporate
                entity.</p>
            </div>
            <br/>

            <div id="chap08_VIII(B)(5)">
                <h4><strong>5. SET PRODUCTIVITY SPENDING.</strong></h4>
                <br/>

                <p>Click on the "Set Productivity Spending" button to change a company's level of spending on various
                productivity programs that may improve its long-term efficiency and
                profitability.  This expenditure setting will be a percentage of sales
                to be spent, in the case of companies other than banks or insurance
                companies (in their case it will be a different measure).  For certain
                industrial companies, mostly "high-tech" companies, but also including
                companies such as auto manufacturers and mining companies, this setting
                will be for "R & D" (Research and Development) expenditures, while for
                all other companies productivity spending will be assumed to be for
                marketing and advertising expenditures.</p>
                <br/>

                <p>Setting "productivity" spending at any percentage will directly
                reduce current profit margins (which in this simulation are the same
                as return on investment on business assets), by that percentage , but
                such expenditures may result in increases in a company's long-term
                profitability, such as from technical breakthroughs in R & D programs,
                or from successful advertising and marketing campaigns.</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <hr />
                    <p><strong>EXAMPLE:</strong> Your computer company is spending 0% of
                    sales on R & D, and is projected to earn a 20% profit margin
                    on sales (which means a 20% return on capital assets, in Wall $treet
                    Raider). You might decide that the company is not operating very
                    efficiently, if most of its competitors are earning about 40%.
                    Thus, you might increase your company's R & D spending to 15% of
                    sales.</p>

                    <p>The immediate effect of the increase in R & D spending would
                    be to reduce the projected rate of return by 15 percentage
                    points, or from 20% the next quarter to only 5%.  Ouch!</p>
                    <hr />
                </blockquote>
                <br/>

                <p>However, you may find after a few quarters that the company is
                improving its relative profitability, thanks to the R & D spending,
                and is earning about 20% again, even AFTER paying 15% of sales
                each quarter for R & D, and that research reports on the company
                now say that its management is "very capable."  Nice! In that case,
                you might slash R & D spending back to zero, in which case the
                company might now suddenly be earning 40% on its assets, or to a
                "maintenance level" of 5%, in which case it would be earning 35%
                on its assets (assuming industry overall profitability has not
                changed).</p>
                <br/>

                <p>Of course, increased R & D spending or spending on marketing
                does not always pay off, or it may take years before it pays off.
                In effect, high spending on "productivity" factors, such as R & D
                or marketing/advertising, will penalize short-term profitability,
                but may (or may not) increase long-term profits.  The higher the
                percentage spent on such productivity items, the more you will
                penalize earnings in the near term, but the more likely you are
                to increase profits due to achieving some kind of breakthrough in
                your R & D program, or building customer loyalty through effective
                marketing.</p>
                <br/>

                <p>Naturally, you can use such productivity spending to "manage"
                a company's earnings to a considerable extent.  However, the
                stock market is not entirely stupid, and so the stock price of
                your company will tend to reflect the level of productivity
                spending, so that such expenditures are quietly added back to
                reported earnings, when calculating a company's "real" earning
                power, in the Wall $treet Raider stock pricing algorithm. So,
                while using this setting to manipulate your company's earnings
                may have some effect on its stock price, the effect will be a
                lot less than you might have expected.</p>
                <br/>

                <p>You can set a company's level of productivity spending at anywhere
                from 0% to 30% of sales.</p>
                <br/>

                <p>Productivity spending by a bank tends to improve the bank's profit
                margins, by enabling it to bring in more deposits and loan business
                for a given amount of overhead expense (salaries, facilities, etc.),
                thus improving its profitability on its lending "spread" (the difference
                between what it has to pay for money and what it earns from lending it
                out). Of course, in the short run, the additional marketing and
                advertising costs will tend to hurt its profit margins.</p>
                <br/>

                <p>Productivity spending by an insurance company can increase its
                underwriting ratio, either increasing its underwriting profits or
                reducing underwriting losses on its insurance operations, in the
                long run, though it will reduce such profits or increase losses in
                the short run.</p>
                <br/>

                <blockquote style="border-left: 4px solid #d9534f; padding-left: 16px; margin: 16px 0; background-color: rgba(217, 83, 79, 0.1);">
                    <hr />
                    <p><strong><u>NOTE:</u></strong> A company with a high or mediocre management rating
                    will tend to become less profitable over time, as a rule, if it spends
                    little or nothing on productivity (R & D, marketing/advertising) to
                    maintain its edge. Thus, if your company's management is rated "very
                    capable" and you want to keep it that way, you may need to dedicate
                    a fairly high percentage of sales to productivity spending, say 6% or
                    more. Anything less than 4% will generally do little or nothing to
                    prevent a decline in the efficiency of management, although it may
                    make current profitability look better.</p>
                    <hr />
                </blockquote>
                <br/>

                <p><strong><u>NOTE:</u></strong>  This transaction button does not appear on
                the "MANAGEMENT" Transactions Menu if the current
                ${helpLink('chap03_III(A)', 'Transacting Entity')} is a
                player or a holding / trading company.</p>
            </div>
            <br/>

            <div id="chap08_VIII(B)(6)">
                <h4><strong>6. SET GROWTH RATE%.</strong></h4>
                <br/>

                <p>Click on this button to set the growth rate, in capital assets (business assets) for your non-financial
                company, or the growth rate of insurance in force, for an insurance
                company, or growth in deposits for a bank. If the current
                ${helpLink('chap03_III(A)', 'Transacting Entity')} is you,
                the individual player, or a holding / trading company,
                this button does not appear on the "MANAGEMENT" Menu.</p>
                <br/>

                <p>For an industrial company (meaning, in this simulation, a company
                in any industry other than banking or insurance, or a holding/trading
                company), increasing its growth rate means that it will put more
                money each year into expanding its asset base (plant and equipment).
                This may improve its earnings, but may put a dent in the company's
                cash flow.  For example, if you set the growth rate at 40%, and a
                company has 1 billion in business assets, it will need to purchase
                another 400 million of assets over the coming year, which will need
                to be funded out of profits, its existing cash, or cash that the
                company raises by borrowing, issuing bonds, issuing new stock, or
                selling off stock investments it holds in other companies.</p>
                <br/>

                <p>Rapid growth (if your company has the cash flow to support it)
                can be good in two ways:  It increases the amount of assets on
                which the company earns a return on investment (sales are assumed
                to increase in a 1-to-1 relationship to a company's business
                assets), and may increase the company's market share in the
                industry, if it is growing faster than the rest of the companies
                in the industry.  In general, the larger a company's market share,
                the more profitable it is likely to be, at any given level of
                management competence.</p>
                <br/>

                <p>The downside of rapid growth of your industrial company is that,
                if it is unprofitable (earning a lower return on its investment
                in business assets than the rate of interest it has to pay),
                such rapid expansion will reduce the company's profits, or
                will increase its losses if it is losing money on its business
                operations. In addition, if your company has a significant market
                share such as 30 or 40% of the industry's sales/assets, its rapid
                growth may help its <em>relative</em> profitability, but may cause
                the total "supply" or "capacity" of the industry to increase
                faster than demand growth, thus lowering profitability of all
                the companies in the industry.  In that case, if a company has
                a large market share and is growing at 30%, and you suddenly
                change its growth rate to, for example, -10%, you will notice
                that the projected profitability of all the companies in the
                industry, including yours, will suddenly be much better than
                a moment before, since your large company is now expected to
                DISinvest in capital assets, rather than rapidly investing
                and expanding its capacity.</p>
                <br/>

                <p>Note that if a company's growth rate is negative, it will
                generally begin to lose "market share" in its industry (unless
                the rest of the companies in the industry are shrinking even
                faster, on average).  However, the good side of this is that
                if your company has 1 billion in assets and its growth rate
                is set at -10%, that means that after one year, its assets
                will have depreciated to 900 million.  The 100 million shrinkage
                of assets will be tax-free cash flow the company will receive,
                from assumed depreciation at the 10% rate. In effect, it is
                turning business assets to cash, at a rate of 10% a year.</p>
                <br/>

                <p>Notice also that, for any amount of business assets, a
                company will need to tie up a certain amount in "working
                capital" -- such as inventory and accounts receivable. The
                cash needed to finance working capital does not earn any
                interest -- it is simply "dead money" tied up in inventory and/or
                accounts receivable. The larger the size of your business, the
                more cash that will have to be devoted to working capital. In
                this simulation, we assume that, on average, working capital
                needs to be about 12% of business assets (but can range from 5%
                to 20%, as noted below). Thus, in the above examples, if your
                $1 billion company grows at 40% for a year, it will not only
                need to pour $400 million of cash into the new business assets,
                but might also need 12% of that amount, or another $48 million,
                to commit to its increased needs for working capital, so you
                really need to invest $448 million of cash to increase your
                income-producing business assets by $400 million.</p>
                <br/>

                <p>On the other hand, if your company with $1 billion of business
                assets is shrinking its sales and business assets by -10% a year, it
                not only generates $100 million in cash flow from the depreciation
                (shrinking) of assets, but will also need $12 million less working
                capital, so that such shrinkage actually "frees up" $112 million
                in cash that it can invest, or use to pay down its debts.</p>
                <br/>

                <p>If you increase the profitability of your company, due to
                R & D spending, restructuring or otherwise, you will tend to
                reduce the percentage of business assets that must be tied up
                in working capital, to as little as 5% (rather than 12%), due
                to greater management efficiency. On the other hand, if your
                company is poorly managed, the amount that may be tied up as
                working capital may rise to as much as 20% of business assets.</p>
                <br/>

                <p>Note that a company almost never has the "correct" amount of
                working capital, as determined by the amount of business assets
                and its efficiency rating. The "correct" amount of working capital
                is always a target, and once each quarter, the software compares
                the target amount to the actual amount of working capital, and if
                there is a working capital shortage, transfers half the difference
                from cash to working capital or, if there is excess working capital,
                transfers half the difference from working capital to cash. These
                regular transfers occur when the company is not in a cash flow
                crisis. If there is a "cash crunch" and the company has no line of
                credit and no T-bills or stocks to sell, it may partially dip into
                working capital to try to cover the cash deficit, impairing working
                capital temporarily.</p>
                <br/>

                <p>For an insurance company, the growth rate you set for it is
                the rate at which it expands its "insurance in force" (and policy
                reserves). The insurance policy reserves are like an interest-free
                loan -- cash received from customers that must be put aside in
                order to pay insurance claims, but which the company can invest
                meanwhile to earn investment income or gains. The company may even
                earn an "underwriting profit" on its insurance in force, if it is
                well-run and if insurance claims it must pay out are less than the
                amount it takes in from customers as premium income.  Usually, the
                goal is to roughly break even on underwriting, since the company
                gets to keep whatever profits it makes after-tax on investing the
                policy reserves.</p>
                <br/>

                <p>Growing its reserves means the insurance company will have more of
                such "interest-free loans" from customers to invest and earn dividends,
                interest and (perhaps) capital gains on, so it would seem that growing
                as fast as possible would be a good thing. However, as in the real
                world of insurance, things are never that simple.</p>
                <br/>

                <p>In Wall $treet Raider, the faster an insurer grows its reserves,
                the less profitable its "underwriting ratio" will be. Thus, a
                well run insurer with $1,000 million of reserves, growing at 0%
                a year, might earn a 5% underwriting profit on its insurance
                business, meaning it pays out only $950 million in claims for $1,000
                million it receives from customers as premiums, for a $50 million
                underwriting profit, in addition to any investment income it earns
                on the $1,000 million of reserves.  However, if you increase its
                growth rate to 20%, it might increase its reserves to $1,200 million
                in a year, but its underwriting profit of 5% might turn into an
                underwriting loss of 3%, or a $36 million loss.  However, it will
                have permanently increased the amount of its reserves it can
                invest by $200 million, so it may be worth the temporary losses,
                to get access to that much capital, which can be invested for many
                years to come, like a long-term interest-free loan.</p>
                <br/>

                <p>An insurance company's underwriting ratio is a function of
                three factors in this simulation: The competence of the insurer's
                management; its growth rate (the faster the growth, the lower the
                profitability, all other things being equal); and the percentage
                of revenues spent on advertising and marketing (which will
                decrease current profitability, but may improve long-term
                profitability, by improving the competence level or efficiency
                of management).</p>
                <br/>

                <p>Conversely, if the insurer decreases its growth rate, perhaps even
                to a negative rate, its reserves will shrink, but its underwriting
                ratio will improve (as it is assumed it is "weeding out" its most
                unprofitable, high-risk customers). If an insurance company you
                control is losing a large amount each quarter on underwriting losses,
                you can do two things to improve profitability in the short run --
                reduce its growth rate of insurance in force (reserves), and slash
                its spending on "productivity" expenditures (advertising and
                marketing) to 0%, using the ${helpLink('chap08_VIII(B)(4)', 'Set Productivity Spending')} function described above. These
                actions will be harmful in the long run, but can improve profits
                in the short term.</p>
                <br/>

                <p>For banks, the growth rate setting determines the rate at
                which deposits (demand deposits and "CDs" -- certificates of
                deposit, on which interest must be paid) grow -- or shrink.
                Setting a rapid growth rate for demand deposits for a bank you
                control can be a good thing, as it brings in more money for
                the bank to try to invest more profitably than the cost of
                the deposits. Those costs include interest that the bank must
                pay on CDs (but no interest is paid on demand deposits),
                plus bank overhead costs for keeping more deposits and
                customers.</p>
                <br/>

                <p>In addition, when that new money is invested in loans
                or corporate bonds (but not in T-bills or government bonds),
                the bank will have to increase its reserve for bad debts,
                an immediate expense, even if those debts don't go bad any
                time soon.</p>
                <br/>

                <p>The maximum growth rate you can set for a company in Wall $treet
                Raider is +60% (30% for insurance companies or 10% for banks); the
                lowest growth rate (shrinking rate) is -10%, or -5% for banks.
                However, if your industrial company is forced to sell off business
                assets due to a lack of cash or line of credit, and a deficit in
                cash, the program will automatically reduce the company's growth
                rate, without awaiting your permission, sometimes to levels of even
                less than -10%, to as low as -25%.</p>
            </div>
            <br/>

            <div id="chap08_VIII(B)(7)">
                <h4><strong>7. RESTRUCTURE.</strong></h4>
                <br/>

                <p>The "Restructure" command button can be used, when all else fails, to try to turn around a company's
                poor profitability.  When you select this function, you will be
                prompted to enter a percentage, up to 50 percent, of the business
                assets of the company that you wish to write down to zero.  The
                effect of the write-off will be to scrap assets, close factories,
                and send hordes of faithful, lifelong employees out into the
                streets to become homeless beggars and to sleep under bridges.
                That's sad, and unfortunate, but the bottom line is the bottom line,
                isn't it? And this <em>should</em> improve the company's profits.
                Right?</p>
                <br/>

                <p>A restructuring write-off will also drastically slash
                current earnings and net worth of the company, so you may be
                limited to writing off considerably less than 50% of business
                assets, if your company is already in weak financial condition,
                with a low credit rating.</p>
                <br/>

                <p>But...the restructuring will tend to increase the profitability
                of the company's remaining assets in subsequent periods, unless
                the company was already well run and doing about as well
                as possible in earning a return on its assets.  (The research
                reports generated by the "${helpLink('chap10_X(D)(2)', 'Research Report')}" command on the "ENTITY INFO" research Menu will
                give you a reading on whether management is doing a good or
                poor job, or something in between.)</p>
                <br/>

                <p>The large loss generated in the quarter of the write-off will
                save taxes and may also help to make earnings comparisons for the
                next year or so look very good, as the situation turns around, and
                the company starts to earn profits again. Or so you hope -- if you
                can afford to hold onto the company's stock that long, without getting
                margin calls from your bank lender.... However, note that if the
                restructuring charge is large enough, your accountants may decide to
                classify the restructuring write-off as an "extraordinary item,"
                which will not be reflected in your current "operating earnings,"
                which is what the market looks at in valuing your company's stock.</p>
                <br/>

                <blockquote style="border-left: 4px solid #d9534f; padding-left: 16px; margin: 16px 0; background-color: rgba(217, 83, 79, 0.1);">
                    <hr />
                    <p><strong>CAUTION:</strong>  A large restructuring write-off by a company
                    that is already in weak financial condition may push it
                    much closer to bankruptcy!  As in the real world, there
                    are always tradeoffs, tradeoffs, tradeoffs....</p>
                    <hr />
                </blockquote>
                <br/>

                <p><strong><u>NOTE:</u></strong>  This button is not displayed if the
                currently selected ${helpLink('chap03_III(A)', 'Active Entity')}
                or ${helpLink('chap03_III(A)', 'Transacting Entity')} is
                you, the player, as this function is only applicable to
                corporations. It is also not displayed if the current
                Transacting Entity is a bank, insurance company, or a
                holding / trading company, none of which have "capital assets"
                to write down, in Wall $treet Raider.</p>
            </div>
            <br/>

            <div id="chap08_VIII(B)(8)">
                <h4><strong>8. ANTITRUST SUIT.</strong></h4>
                <br/>

                <p>If you can't compete with them, sue them!</p>
                <br/>

                <p>That is what the "Antitrust Suit" command button is for.  Click on
                this button if you wish to have your company file a lawsuit against
                another company that is monopolizing your industry (other than in the
                banking, insurance, or holding / trading company industries). This
                button is not displayed if the current ${helpLink('chap03_III(A)', 'Active Entity')}
                or ${helpLink('chap03_III(A)', 'Transacting Entity')} is you, the player,
                or if the Transacting Entity is a bank, insurance company or
                holding / trading company that you control.</p>
                <br/>

                <p>The "Antitrust Suit" command button permits a company you control
                to sue another company in the same industry for ANTITRUST damages
                of up to $250 billion (U.S.).  As in the real business world,
                antitrust suits in Wall $treet Raider can be brought just to harass
                a financially weak competitor, or they can be a powerful force for
                preventing a monopoly from developing in a particular industry.  Note,
                however, that there is always a chance that you will be successfully
                countersued if the jury finds you guilty of frivolous or malicious
                prosecution.... Litigation is a very risky business.</p>
                <br/>

                <p>But if you see that another player has a stranglehold on
                market share in a particular industry, particularly if his
                company (or several of his companies, in the aggregate)
                control more than a 50% market share, consider buying up
                control of a company in that industry and having it file
                an antitrust suit against one of the offending companies.
                It may also be profitable to bring suit against a large
                company that dominates an industry, even if no opposing
                player owns or controls it.</p>
                <br/>

                <p>In Wall $treet Raider antitrust suits, your suit will not
                have a prayer of success, and you will be countersued, if the
                defendant company and companies under common control with
                it have less than a 20% market share in the industry in
                question.  Furthermore, you don't have much chance of getting
                a good settlement and only a long shot chance of winning at
                trial if the defendant has (or controls) less than a 50%
                market share.  But at over 50% market share the odds of
                your winning or extracting a very healthy settlement from
                the defendant go up at an almost exponential rate, the
                greater the defendant's market share.</p>
                <br/>

                <p>Before you file an antitrust suit, note that you can select the
                level of legal representation you will have -- cheap, average, or
                expensive -- using the "${helpLink('chap05_V(B)(3)(d)', 'Select Law Firm')}" item on the "${helpLink('chap05_V(B)(3)', 'SETTINGS')}"
                menu on the main Wall $treet Raider menu screen. As you might guess,
                your odds of getting a good settlement or winning the case are
                considerably better with a better law firm than with a cheapo firm
                of ambulance-chasers -- but you may not be able to afford the best.
                Once you select a law firm, your company and the defendant both
                have to pay their legal fees, just before the case goes to trial
                or when it is settled.</p>
                <br/>

                <p>The defendant's fees will be for a randomly selected law firm,
                cheap, average or expensive, and thus may be more, less than, or the
                same as yours. (If the defendant company is controlled by an opposing
                player, its law firm will be whichever firm that player has selected
                to represent him or her in all Wall $treet Raider litigation.)</p>
                <br/>

                <p>When you click on the "Antitrust Suit" button, you will be
                asked to enter the stock symbol of the company that you wish for
                your company to file suit against.  The defendant company must be
                in the same industry as your company, and your suit will be thrown
                out of court if your firm has already filed an antitrust suit in
                recent years, so you can't keep suing someone over and over, unless
                you wait a while.</p>
                <br/>

                <p>Once you have selected the target (defendant), you will be told how
                much you can sue for, at a maximum, which is the lesser of $250 billion
                (U.S.), the defendant company's net worth, or the largest amount
                you can afford to sue for, using your selected law firm.  Since
                the legal fees you pay are based on the size of the suit that is
                being filed, you can obviously sue for a bigger amount if you
                hire a "cheap" law firm, like Shyster, Finagle & Whiplash, than
                if you have selected a more expensive law firm to represent you.</p>
                <br/>

                <p>If you are able to pay the legal fees, the litigation
                begins.  As part of the pre-trial maneuvering, your attorneys
                will want to know how much is the minimum you would accept if
                the defendant makes you an offer in settlement.  For example,
                if you are suing for $1,000 million, and you know your legal
                fees for your "cheap" law firm will be $35 million, you might
                enter $75 million, if you know you have a weak case. On the
                other hand, if you know you have a strong case, such as
                where the defendant has a 70% market share, you might only
                be willing to settle for a minimum of $200 million, or even
                $500 million.</p>
                <br/>

                <p>Once your case comes up for trial, which may take a few
                quarters or years of play, a message will pop up on the screen,
                during your turn, informing you that the defendant has either
                accepted your settlement offer, or rejected it.  If the
                defendant decides to take your settlement offer, it will pay
                that amount to your company and the case is closed.  If it
                rejects your settlement offer, the case goes to trial -- in
                that case, sit back and hope for the best... anything can
                happen. You might win a lot of money with a favorable decision,
                or the jury may find for the defendant, in which case no one
                wins (but you both lose, by having to pay legal fees); and in
                some cases, if your case is found to be frivolous, the court
                may force your company to pay damages in a countersuit by the
                defendant. Note that an antitrust suit will be decided on
                the basis of how much market share the defendant company
                had at the time you initiated the suit.</p>
                <br/>

                <p>Needless to say, winning a large antitrust judgment can
                make your company's net worth and stock price go up quite a lot, even after
                taxes -- while losing a big judgment may put your company in bankruptcy
                court and its shareholders on welfare. In either case, your winnings or loss
                from a case will be "extraordinary" income or loss, and won't improve or
                decrease your company's operating earnings it reports. However, if a case
                is settled out of court, the net gain or loss (after legal fees) will directly
                affect operating earnings for both parties to the litigation.</p>
                <br/>

                <p>What, you may ask, do you do if an opponent succeeds in
                buying up every company in an industry, establishing a
                complete monopoly? If you can't get control of a company
                in that industry, how can you hope to bring an antitrust
                suit against one of the opponent's companies?  Easily.
                You use the "Start Up" button to start up a new company
                in that industry, and have it file the lawsuit.  Since
                the other player will still control almost 100% of the
                industry, now you're ready to file suit against one of
                his or her companies, and you should have an almost open
                and shut case.  Take no prisoners...!</p>
                <br/>

                <p>After you have played Wall $treet Raider for a while, you
                will notice that every time a company becomes very dominant
                in an industry and is on the verge of completely driving all
                its competitors out of business, it wisely cuts back its
                growth to avoid getting much over a 50% market share.  As
                we mentioned earlier, companies that are not controlled by
                a player in Wall $treet Raider are fairly "smart"--and no one
                with even half a brain wants to become a clay pigeon for a
                horde of money-hungry lawyers to take shots at.</p>
                <br/>

                <p>Of course, you will be trying to gain a commanding market
                share in any industry that your company is in, so you can
                earn monopolistic profits, but it is rather difficult in
                the Windows version of Wall $treet Raider to achieve such
                dominance (legally), just as it is in the real world.  Any
                attempts to buy up or merge with competitor companies that
                would give you a very large market share, over 55%, will
                usually be blocked by a government agency, to prevent you
                from obtaining a monopoly, as will any attempts to buy the
                assets directly from your competitors.  Your own board of
                directors will even prevent you from making huge purchases
                of new business assets that would create excessive capacity
                conditions in the industry, as well.</p>
                <br/>

                <p>Thus, to monopolize its industry, your company will
                usually need to simply grow faster than the rest of the
                companies in the industry, until it starts to squeeze them
                out and bankrupt them. And once it gets to that point,
                beware -- as your company will almost certainly be sued by
                other companies in the industry, once your market share
                gets up to about 50%.</p>
            </div>
            <br/>

            <div id="chap08_VIII(B)(9)">
                <h4><strong>9. SET FUND ADVISOR FEE.</strong></h4>
                <br/>

                <p>Each ETF (exchange-traded fund) is assigned a fund investment manager/advisor by the
                program at the start of a new game. The ETF will pay an
                annual fee to the advisor that ranges from 0.2% to 1.0% of
                the fund's total assets. The randomly selected advisor is
                usually a securities brokerage firm, but can sometimes
                be an insurance company. If you control a securities
                broker or an insurance company, the "SET FUND ADVISOR FEE"
                button will show up on the Management Menu for that company,
                and if your company is the advisor to any ETF's, you may
                change the annual advisory fee charged, to anywhere from
                0.2% to 1.0% of fund assets.</p>
                <br/>

                <p>Otherwise, for any other company you control, other
                than a securities broker or insurance company, this button
                is not displayed on the Management Menu.</p>
                <br/>

                <p>If your company manages more than one ETF, you will be
                asked, for each ETF, if you want to change the management
                fee, unless you click on the "Cancel" button, to return
                to the menu, when given the choice of Yes/No/Cancel.</p>
                <br/>

                <p>While it might seem like a no-brainer to set the fee
                as high as possible, a high fee will create a significant
                drag on the ETF's performance over a period of several
                years, while a low fee will enable the ETF to grow faster.
                If an ETF's stock price (adjusted for any capital gains
                distributions) does very poorly relative to the Stock
                Index over a 5-year period, your company may in some
                cases be fired by the ETF, which will randomly select
                some other broker or insurer to manage it. On the other
                hand, if the fund significantly outperforms the market
                over a 5-year period, your company's fees will not only
                be growing, but your company may be rewarded by the ETF
                issuing new stock, increasing the amount of assets under
                management by 10% to 25% and thereby increasing your
                company's management fees accordingly.</p>
                <br/>

                <p>In the case of a bond fund or index fund ETF, the
                management fee is always limited to 0.2% in Wall $treet
                Raider, and there are no incentive bonus fees for
                superior performance, since the investing and trading
                done by index funds and bond funds all occurs in
                accordance with an algorithm, and you are not allowed
                to do trades for those types of ETFs, even if they are
                managed by an insurance company or brokerage company
                that you control.</p>
                <br/>

                <p>Be aware also, in Version 8.70 or higher, that if you
                set the base fee at an annual rate higher than the 0.2%
                (of total assets) minimum, your company that advises the
                ETF will not be eligible for any performance bonus fees.
                It can only earn such gain-sharing bonus fees for
                superior performance (over 20% increase in net asset
                value of the ETF in a 2-year measuring period) and only
                if the base fee is set at the 0.2% annual rate for the
                entire measuring period.</p>
                <br/>

                <p>In Version 8.70 or later, you cannot increase the current
                base management fee unless the net asset value per share (as
                adjusted for dividends or return-of-capital distributions)
                of the ETF has performed by at least 2% better than the
                Global Stock Index benchmark in the last 24 months.</p>
                <br/>

                <p>Other than being fired as fund manager for poor performance
                of the fund, as noted above, the only other ways in which a
                broker or insurer can lose its management contract with an ETF
                are as follows:</p>
                <br/>

                <ul>
                    <li>The ETF goes bankrupt.</li>
                    <br/>

                    <li>The ETF is disqualified and becomes a regular (taxable)
                    holding/trading company, when some player or company
                    acquires over 15% of its stock.</li>
                    <br/>

                    <li>The company that is the fund advisor goes through
                    bankruptcy.</li>
                    <br/>

                    <li>The fund advisor goes through a liquidation. However,
                    if it is a non-taxable liquidation in which all of
                    its assets are transferred to the parent corporation,
                    the investment management contract transfers over to
                    the parent corporation. Similarly, if a brokerage
                    firm (the advisor) sells all of its business assets
                    to another company, or does a capital contribution
                    of all of its business assets to a 100%-owned
                    subsidiary, the management contract will also be
                    transferred to the other company.</li>
                    <br/>

                    <li>The fund advisor, if it is a securities broker,
                    is forced to sell off all of its business assets or
                    scrap them, becoming a holding/trading company.</li>
                </ul>
            </div>
            <br/>

            <div id="chap08_VIII(B)(10)">
                <h4><strong>10. BECOME ETF ADVISOR.</strong></h4>
                <br/>

                <p>This button only appears in Version 8.70 or later and only if the
                current "Transacting Entity" or "Active Entity" is an
                insurance company or securities broker that you control,
                and then only if that company does not currently act as
                the investment advisor and manager of an Exchange-Traded
                Fund (ETF). When this button does appear for an insurance
                company or securities broker that you control, click on
                it if you wish to have your company purchase from the
                current advisor of an ETF the contractual right to manage
                the ETF and receive management fees.</p>
                <br/>

                <p>The price to purchase such rights to manage an ETF
                is 10 times the current base annual fee charged to the
                ETF by its current manager/advisor or, in the case of
                an index fund or bond fund ETF, 5 times the base annual
                fee. The cost will be treated as a purchase of "goodwill"
                and amortized over a period of years, if the purchasing
                company is a securities broker. However, if the purchaser
                is an insurance company, it must write off the cost as a
                current expense, which may greatly decrease the insurer's
                earnings and net worth.</p>
                <br/>

                <p>Note that in the case of a bond fund or index fund ETF,
                the management fee that your company receives is always
                limited to 0.2% of net assets in Wall $treet Raider and
                there are no incentive bonus fees for superior performance,
                since the investmenting and trading done by index funds and
                bond funds all occurs in accordance with an algorithm and
                you are not allowed to do trades for those types of ETFs,
                even if they are managed by an insurance company or brokerage
                company that you control.</p>
            </div>
            <br/>

            <div id="chap08_VIII(B)(11)">
                <h4><strong>11. TURN AUTOPILOT ON/OFF.</strong></h4>
                <br/>

                <p>It is now possible in Wall Street Raider to change the AutoPilot setting
                for an individual company that you control, even if you
                have a different "global" AutoPilot setting that you
                have set on the "Game Options Menu." For example, you
                may have used the Game Options Menu to turn the AutoPilot
                setting "ON" for all your companies, but may decide for a
                particular company that you do not want to delegate its
                management to the program, so you can use the TURN AutoPilot
                ON (OFF) button (on the Management Menu) to turn off AutoPilot
                for that company. Or turn it back ON.</p>
            </div>
            <br/>

            <div id="chap08_VIII(B)(12)">
                <h4><strong>12. ASSET ALLOCATION.</strong></h4>
                <br/>

                <p>(For banks only.) Version 8.50 introduced this new feature, an asset allocation strategy
                for all banks. This button on the Management Menu allows you
                to change the asset allocation for any bank that you control,
                to determine how its assets -- all assets other than business
                loans, which are somewhat out of the bank's control, and
                equities (stocks and options) -- are allocated.</p>
                <br/>

                <p>A typical default allocation would be about 30% in
                prime mortgages, 25% in consumer loans, 15% in subprime
                mortgages, 20% in bonds (government and corporate) and
                10% in cash equivalents (cash and short-term T-bills).
                All banks are assigned allocation percentages at the start
                of each game, which a player can change for a bank that
                he or she controls.</p>
                <br/>

                <p>(The default setting for such automatic asset allocation is
                "ON," but in W$R Versions after 8.50, an "OFF" button has been
                added to the Asset Allocation menu that pops up when you click
                on the ASSET ALLOCATION button. If you select the "OFF" setting
                for a bank you control, you will have to manage its loan and
                bond portfolios, since the automatic allocation and re-allocations
                of consumer loans, mortgages, bonds, and cash-equivalents will
                cease, unless you turn the setting back on.)</p>
                <br/>

                <p>The only restrictions on your allocation is that the allocation
                percentages, in total, must add up to 100% and you must allocate
                at least 10% to cash equivalents. (Banks always need to keep a lot
                of cash and other liquid assets on hand, as in the real world.)
                Click on the yellow "Update Total" button to see if the percentages
                you have entered add up to 100%.</p>
                <br/>

                <p>When you set these asset allocation parameters, your bank will
                gradually begin selling off some of the above assets and buying
                others to seek to achieve the percentage allocations you have
                specified, which make take a month or two. Of course, you could
                do the transactions yourself, say, for example, putting 50%
                of the assets to be allocated in bonds, 40% in consumer loans,
                and leaving 10% in cash equivalents, before or after setting
                those allocation percentages, which the bank would then seek
                to maintain.</p>
                <br/>

                <p>These allocations will be operative instructions to your bank,
                whether it is on "AutoPilot" or not, to try to maintain the asset
                allocation percentages you have decided upon.</p>
                <br/>

                <p>If a bank you control is on AutoPilot, the "cash equivalent"
                portion will typically be invested about 60% to 80% in Treasury
                bills and the rest will be cash. If your controlled bank is NOT on
                AutoPilot, it will not automatically buy T-bills. In that case,
                from time to time, you can transfer all of its cash to T-bills,
                but as the bank collects interest on loans, pays taxes, and such,
                the amount of T-bills may decrease and cash may build up somewhat,
                in which case you may need to keep on eye on the bank's finances
                and re-invest its cash in T-bills from time to time.</p>
                <br/>

                <p>NOTE: If you lose control of a bank, and your allocation
                percentages were pretty extreme, like 80% for one class of assets,
                the bank may go back to a more standard and conservative "default"
                set of allocation percentages. Also, if you have turned off
                automatic asset allocation for a bank, and lose control of the
                bank, so that it is no longer controlled by a human player, it
                will revert back to automatic asset allocation.</p>
                <br/>

                <p>Your bank will attempt to achieve and maintain the asset allocation
                percentages you have chosen, but when it makes more business loans
                (or receives business loan repayments) or engages in stock or
                option transactions, those events will increase or decrease cash
                and T-bills, causing the software to begin buying or selling bonds,
                mortgages, or consumer loans, in order to re-establish the "target"
                allocation percentages.</p>
                <br/>

                <p>However, in some cases, it will refrain from acting. For example,
                during a "subprime crisis" period, no selling of subprime mortgages
                (at a loss) will occur (unless you, as manager, take action to
                sell such mortgages). That's because selling subprimes in that
                time of crisis would usually result in selling them at a large
                discount, for a loss, and would probably be foolish.</p>
                <br/>

                <p>Similarly, when interest rates are very high, your bank will sell few,
                if any, bonds; and if interest rates are very low, it will generally
                refrain from buying more bonds, even if it is "under-invested" in bonds
                under the allocation formula you have established, until interest rates
                return to a more "normal" level.</p>
                <br/>

                <p>The asset allocation feature allows you to experiment with different
                banking strategies, such as high-risk strategies like putting 90%
                of the assets in the five categories in one category, like subprime
                mortgages, and only 10% in cash equivalents, or perhaps do things like
                increase the allocation percentage for bonds when interest rates are
                high and rising, or reduce it when rates are low and falling.</p>
                <br/>

                <p>Note that in Version 8.50 or later, even if you load a saved game
                file from an earlier W$R version, the program will assign a "default"
                set of allocation percentages to all banks. Similarly, when you start
                a new game, all banks are assigned default allocation percentage
                settings, so once you take control of a bank, you may want to use
                this Asset Allocation button to see what the parameters are -- and
                change the percentages, if you don't like the default settings.</p>
                <br/>

                <p>Each time you use the Asset Allocation dialog will constitute one
                of the 5 or 10 transactions allowed on your turn, unless you exit
                the dialog by using the "Cancel" button.</p>
                <br/>

                <p>The ASSET ALLOCATION button does not appear on the management
                menu except for a bank you control.</p>
            </div>
        </div>
    </div>`;
}
