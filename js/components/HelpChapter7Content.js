import { html } from '../lib/preact.standalone.module.js';

export default function HelpChapter7Content({ helpLink }) {
    return html`<div>
        <h2 align="center"><strong>CHAPTER VII.</strong></h2>

        <div id="chap07_VII(A)">
            <h3><strong>A. IN GENERAL.</strong></h3>
            <br/>

            <p>Except for borrowing money or making loan repayments, or taking a
            few other minor actions on the MISC. Menu, all other transactions
            in Wall $treet Raider, such as buying or selling stock, bonds, or
            other assets, are done by clicking on one of the six buttons in
            the "Transactions" grouping of buttons on the main menu screen.
            Each such major transaction executed from the "Transactions" grouping
            that is completed counts as one of the 5 transactions allowed on a
            player's turn (or 10 transactions, in case of the "alternative" version
            of Wall Street Raider). Other actions, such as borrowing money or repaying
            loans, or doing stock splits or corporate name changes, can be done by
            clicking on the "MISC" button on the main screen and selecting an item
            such as "Borrow Money" or "Repay Loan" from the pop-up Menu that will appear,
            but none of those actions count against you as one of your 5 (or 10)
            allowed transactions per turn.</p>
            <br/>

            <p>To initiate a transaction, click on one of the six "Transactions"
            buttons:  Buy Stock, Sell Stock, Buy/Sell, Financing, Management, or
            Other Trans., on the main menu screen, and, except when clicking on
            the Buy Stock or Sell Stock buttons, one of four different Menus
            will pop up, each listing anywhere from 2 to 13 possible transactions,
            with a button for each. Then click on the appropriate button to perform
            the type of transaction you wish to do.</p>
            <br/>

            <p>Note that, while viewing each Transactions pop-up Menu, the Menu
            screen will have a text-box on the left, describing the allowable
            functions, and sometimes will include other useful information,
            such as the current buying power (cash plus line of credit) of the
            currently selected ${helpLink('chap03_III(A)', 'Active Entity')}
            (unless it is not the ${helpLink('chap03_III(A)', 'Transacting Entity')}).
            The various buttons for the different types of transactions will
            appear in a vertical row on the right side of the pop-up Menu.  At the
            bottom of that dialog screen will be 3 additional buttons:  A "Close" button
            to close the Menu and exit back to the main menu screen; a "Player"
            button (click it to instantly change the Active Entity that is to do
            the desired transaction to you, the player); and a "My Corps." button,
            which will let you select a corporate entity you control as the new
            ${helpLink('chap03_III(A)', 'Active Entity')}, which will do the transaction(s)
            you are planning to execute.</p>
            <br/>

            <p>This Chapter VII describes the various "FINANCING" transactions that
            you can do if you select the "FINANCING" button.</p>
        </div>
        <br/>

        <div id="chap07_VII(B)">
            <h3><strong>B. "FINANCING" BUTTON AND MENU.</strong></h3>
            <br/>

            <p>Clicking on the "FINANCING" button brings up a Menu with a
            number of command buttons that allow you, or a company you control,
            to engage in various types of financing transactions (other than
            borrowing from a bank), such as public or private offerings of new
            shares of stock, issuing or buying back corporate bonds, contributing
            capital to a 100%-owned subsidiary corporation, liquidating a company,
            having a corporation pay out an "extraordinary dividend," spinning
            off (distributing) the stock of a subsidiary, or doing a startup of
            a new company. Each of these transactions is a way to get money or
            other assets into, or out of, a corporation. Each of the various
            command buttons on the FINANCING Menu, which pops up when you
            click on the "FINANCING" button, is described below.</p>
            <br/>

            <p>While financing transactions on this Menu can generally only be
            performed by you or a company you control, Version 8.70 and later
            versions now allow you to do certain financing transactions (public stock
            issuance, bond issuance, or calling/buying back bonds) on behalf of
            an Exchange-Traded Fund (ETF) that is managed/advised by a company
            you control, IF THE ETF IS THE CURRENTLY SELECTED "ACTIVE ENTITY."
            However, there are some special limitations that apply if you are
            having an ETF engage in issuing stock or bonds: An ETF your company
            manages can only issue stock once a year, in December, and only if
            the ETF's net asset value per share is up 15% for that year to date;
            and bond issuances are limited to issuances of "straight bonds" on
            behalf of an ETF -- it cannot issue convertible bonds, unlike
            companies.</p>
            <br/>

            <p>You will notice that, of the 10 transactions buttons that
            usually appear on this Menu, only the first 9 will appear
            if the ${helpLink('chap03_III(A)', 'Transacting Entity')} is a
            bank or insurance company, and only the first 2 ("Start Up New
            Corp." and "Capital Contribution") will be visible if the
            ${helpLink('chap03_III(A)', 'Transacting Entity')} is you, the player.
            However, additional buttons may appear if the current "Active Entity"
            is an ETF that is managed and advised by a company you control.
            In that case, you may be able to have the ETF do a public stock
            issuance, issue bonds, or buy back or call bonds it has issued.</p>

            <div id="chap07_VII(B)(1)">
                <h4><strong>1. START UP NEW CORP.</strong></h4>
                <br/>

                <p>Click on the "Start Up New Corp."
                command button on the "FINANCING" transactions Menu, if you wish
                to start up a brand new company.  You, or any company you control
                (except a bank) can start up a new company and put money in it,
                after which you or your controlled company will own 100% of the
                stock of the new startup company.  The startup company can be a
                holding / trading company, which merely holds the cash you put into
                it, until you direct it to do something with the cash, or you can
                choose to have the startup be a company in any of the 69 other
                industry groups in the Wall $treet Raider simulation.</p>
                <br/>

                <p>You can even start up your own bank or insurance company, although
                you will need $1 billion (U.S.) or the equivalent in whatever currency
                you have configured the game for, to start a bank or insurance company.
                Only $100 million (U.S.), or the equivalent, is needed to start up
                any other company.  There are substantial startup costs, which will
                vary, depending on the size of the company's initial capital, and its
                industry category.  A holding / trading company is the least expensive
                kind of company to start up.  Banks and insurance companies are by far
                the most expensive to start up, as they must obtain many different
                government approvals before they can commence doing business, in any
                civilized country in the world.</p>
                <br/>

                <p>New companies face a number of limitations for 2 to 4 years after
                they are started up.  A new, startup company is:</p>
                <br/>

                <ul>
                    <li>Not able to do IPO's (initial public offerings of stock) for
                    several years, until the company is "seasoned";</li>
                    <br/>

                    <li>Not able to issue junk bonds to raise money for several years;</li>
                    <br/>

                    <li>Not likely to find a merger partner, since most existing companies
                    will not want to be taken over in a merger by a new company with no
                    "track record" or history; and</li>
                    <br/>

                    <li>Hard to sell.  Unless you are playing at Difficulty Level 1
                    (the easiest level), you will not be able to sell your stock in a
                    startup company while you still own 100% of the company, as there
                    is assumed to be no market for such closely-held stock. (And you
                    can't take the company public either, as noted above!) So you will
                    be stuck with your investment in a startup company for several
                    years, unless you have to sell it in a forced sale, such as when
                    you have a "${helpLink('chap03_III(I)', 'margin call')}", although,
                    if you want to sell it badly enough, some unrelated company may
                    offer to buy a large part of its stock at a substantial discount,
                    like 30% or 40% below its fair value.</li>
                </ul>
                <br/>

                <p>Note that when you form a new startup corporation, it will be given
                a default name and stock symbol (but you will be asked then if you
                wish to change either).  Later on, at any time during the rest of
                the game, you can also change the name and/or symbol for any company
                you control, by clicking on the "MISC" button on the main menu screen,
                and then selecting the "${helpLink('chap11_XI(C)(5)', 'Name Change button')}" from the menu that pops up.)</p>
                <br/>

                <p>You will also be informed that your new company will be incorporated
                and based in a certain country, and asked if you wish to select a
                different country as headquarters. If you answer "Yes," a list of
                53 possible countries where the company can be incorporated will be
                displayed, and you can select one by clicking or double-clicking on
                the name of the country. You may want to incorporate in a country
                like Korea or Japan, where it will generally be harder for an
                opposing player or some large corporation to mount a takeover of
                your company, if you later reduce your controlling interest to
                well below 50%. (Of course, if it is based in Korea or Japan, that
                might mean your company will suffer rather severely if either of
                those countries gets nuked by North Korean missiles....)</p>
                <br/>

                <p>Companies incorporated in the U.S., U.K., Canada, and Australia
                are the easiest to take over in a merger, all other things being
                equal. Those incorporated in other "First World" countries, such as
                Denmark, Germany, Hong Kong, Ireland, Netherlands, New Zealand, Norway,
                Sweden, the Philippines, Singapore, South Africa, and Switzerland are
                somewhat more difficult to take over in mergers. Most difficult to take
                over are companies incorporated in Korea, Japan, France, or any of the
                other 53 countries you can choose from. Thus, for defensive purposes,
                to make merger takeovers of your company by hostile players more
                difficult, you may want to incorporate your company in a country like
                Korea, or a Third World country like Sri Lanka, Pakistan, or Peru.</p>
                <br/>

                <p>The simulation provides for up to 1590 companies, and only about
                1,000 are in existence at one time, usually, as companies are constantly
                being formed or being liquidated out of existence.  Thus, while it is
                possible that the program might run out of unused "shell" companies
                that you can use, and thus you might be unable to find an dormant
                company to use as a startup, that is highly unlikely to ever occur.</p>
                <br/>

                <p>It is assumed that it takes a considerable amount of your time and
                energy to start up a new company in a new business.  Thus, each player
                (and his or her companies) may only start up 3 new companies in any
                2-year period, and no more than 2 in any one year.</p>
                <br/>

                <p>Doing a startup can be a cheap way to gain entry to a highly
                profitable industry, since most of the stocks in such an industry
                will often be priced at multiples of 5 or 10 times their net worth.
                By starting your own company in such an industry from scratch, you
                can put in, say, $250 million into the company, and have it acquire
                about $250 million of business assets, instead of paying several
                times that much by buying the stock of an established company.
                However, it may be a while before your company starts showing profits,
                since it will have substantial startup costs to write off in its
                first year of operation.  By the time it becomes profitable, you
                may find that its industry is no longer so profitable, but taking
                risks is what Wall $treet Raider is all about....</p>
            </div>
            <br/>

            <div id="chap07_VII(B)(2)">
                <h4><strong>2. CAPITAL CONTRIBUTION.</strong></h4>
                <br/>

                <p>Click on the "Capital
                Contribution" button if you wish to contribute capital (money,
                stock, or bonds) to a company in which you personally own 100%
                of the stock, or if you wish to have a parent company that you
                control contribute capital (cash, stock, or, in some cases,
                bonds or capital assets) to a subsidiary company of which it
                owns 100% of the stock.</p>
                <br/>

                <p>This can be a useful strategy if the subsidiary company
                has large tax loss carryovers, or a poor credit rating. Making
                a large injection of money, stock of another company, government
                or corporate bonds, or capital assets into the subsidiary would
                not only improve its credit rating (reducing the rate of interest
                it pays on any bank loans it owes), but the income earned on the
                injected capital could be sheltered from taxation by its tax loss
                carryovers. (However, be aware that contributing capital assets
                to a holding company sub that has tax loss carryovers will cause
                it to lose its carryovers, due to the "change in business." You
                will be warned if the sub is a holding company and it has
                substantial loss carryovers.)</p>
                <br/>

                <p>This type of tax strategy would make sense only if the
                parent company that contributes or injects capital into
                the subsidiary has no tax loss carryovers of its own, so
                that, for instance, contributing a billion dollars to the
                subsidiary that has tax losses would shift the income that
                could be earned on that billion dollars from being taxed
                (if earned by the parent company) to NOT being taxed (if
                earned by the subsidiary).</p>
                <br/>

                <p>Note that if you (or a parent company you control) make
                a capital contribution to a 100%-owned company, the capital
                contribution increases the value of the company, but also
                increases the "tax basis" (cost) of your or the contributing
                company's stock holdings in the company receiving the capital
                contribution.  For example, if you paid 500 million to buy
                100% of the stock of XYZ Corporation, you would incur no
                gain or loss if you sold it for 500 million.</p>
                <br/>

                <p>However, if you contribute 1,000 million of capital to XYZ, the
                stock might rise in value to 1500 million, but if you sold it
                for 1500 million, you would still have no gain, since your tax
                basis, or cost, was increased to 1500 million when you made
                the capital contribution of 1,000 million.  Wall $treet Raider
                automatically makes such adjustments, and keeps track of your
                "tax basis" in all stocks or bonds you or any companies invest
                in, in order to compute the amount of the gain or loss when you
                or they sell the stocks or bonds.</p>
                <br/>

                <p>When contributing stock to a subsidiary, the tax basis of the
                stock in the hands of the contributing player or company usually
                carries over, unchanged, to the subsidiary, and increases the player
                or parent company's tax basis in its stock of the subsidiary to
                which it made the capital contribution. However, if the contributing
                parent company has a negative tax basis ("excess loss account")
                in the shares of stock it is transferring to the subsidiary,
                and retains some shares, but retains less than 80% of the
                stock of the company whose shares are being transferred, that
                will trigger a recognition of taxable gain (income) on the
                "${helpLink('glossary_XCESS', 'excess loss account')}" attributable
                to the retained shares.  But if ParentCo owns 80% of XYZ Company
                and transfers all of the XYZ stock to subsidiary ABC Company,
                the excess loss account is simply transferred to ABC as its
                tax basis for the XYZ stock, and no taxable gain is recognized.
                (However, if ParentCo owns 80% of XYZ and transfers only 40%,
                retaining 40%, it will have to pay tax on the recapture of the
                entire "excess loss account," and ABC will take a zero tax
                basis -- instead of the negative tax basis -- in the shares it
                receives as the capital contribution.)</p>
                <br/>

                <p>Similarly, players or banks or insurance companies that own
                government or corporate bonds may contribute such bonds to
                100%-owned banks or insurance companies (but not to other
                companies, since industrial companies and holding/trading
                companies are not allowed to hold bonds in Wall $treet Raider).
                The tax basis of the contributed bonds "carries over" to the
                subsidiary bank or insurance company to which the bonds are
                contributed, and the tax basis of the contributed bonds
                increases the player's or parent company's stock in the
                subsidiary.  However, if you or a bank or insurer you
                control holds 100% of the stock of an industrial company
                and also owns some of its bonds, you may contribute its
                own bonds to the subsidiary. For example, if you own
                100% of the stock of XYZ Corporation and also own some
                of the corporate bonds issued by XYZ, you may contribute
                some or all of its bonds you own to XYZ. In that case,
                instead of XYZ Corporation becoming the owner of its
                own bonds, the contributed bonds are simply canceled in
                a non-taxable transaction, reducing the amount XYZ owes
                as bond indebtedness.</p>
                <br/>

                <p>The mechanics of doing a capital contribution are not complicated
                -- just click on the "Capital Contribution" command button, and
                if you (or the other ${helpLink('chap03_III(A)', 'Transacting Entity')})
                own only one 100% subsidiary, you will be asked how much or what you
                (or your controlled company) wish to contribute to your, or its,
                subsidiary.</p>
                <br/>

                <p>If you or your company owns two or more 100%-owned subsidiary
                companies, you will be asked if you wish to see a list of
                companies you or the parent company own, and if you answer
                "Yes," a list of your (or the parent company's) stock portfolio
                will be displayed, and you can select the company to which the
                capital contribution is to be made by clicking or double-clicking
                on its name on the portfolio list.</p>
                <br/>

                <p>Once you have selected the company to which the capital
                contribution is to be made, the following dialog or submenu
                will appear, allowing you to select one of four types of assets
                that can be contributed, cash, business assets, stock, or bonds:</p>
                <br/>

                <p align="center"><img src="capcont.jpg" alt="capcont.jpg (20390 bytes)" WIDTH="390" HEIGHT="297" /></p>
                <br/>

                <p>Think of a "capital contribution" as merely moving
                money or other assets "downstream" into a wholly-owned company
                -- you are simply putting cash or other assets into the company,
                to strengthen it. This is the opposite of a dividend, where the
                company distributes money to its stockholders, sending the money
                "upstream."  If you make a capital contribution to a company,
                you may be able to later take the money back out of the
                corporation as an "extraordinary dividend," as discussed in
                the next section. However, as an individual, any dividend you
                take out will be fully taxable, and a portion may be taxable
                to any corporation shareholder. In addition, if the amount
                taken out is a significant percentage of the company's assets,
                the dividend may be treated as a "partial liquidation" for
                tax purposes, in which case it would be fully taxable to
                either an individual stockholder, or to a corporation that
                owns 79% or less of the payor's stock. (However, an 80% or
                greater corporate stockholder, receiving a dividend from
                its subsidiary, will not be taxed at all on the dividend,
                but will instead reduce its "tax basis" in the stock of
                the subsidiary -- which will increase its taxable gain
                if it sells the subsidiary's stock for a gain.)</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <strong>PLANNING TIP:</strong>${' '}  Having a parent company drop
                    capital assets down into a subsidiary may be a preferable
                    way of exiting an industry, where the parent company is
                    losing money, or earning a very poor return, on its capital
                    assets in, for instance, the steel industry. Instead of
                    selling off the assets, perhaps for a very large loss,
                    consider creating a new subsidiary, dropping the steel
                    industry assets down into the subsidiary, and then either
                    selling off the sub's stock, or perhaps even merging the
                    sub (with its crummy assets) with a company controlled by
                    an opposing player, and then selling off the stock in the
                    merged companies. You may incur a smaller loss than simply
                    selling off or scrapping the capital assets, and may be
                    able to stick an opposing player with a "loser" company,
                    as well.
                </blockquote>
                <br/>

                <blockquote style="border-left: 4px solid #d9534f; padding-left: 16px; margin: 16px 0; background-color: rgba(217, 83, 79, 0.1);">
                    <strong>IMPORTANT LEGAL RESTRICTION:</strong>${' '}  In some cases, where the parent
                    company is a bank, bank regulators may limit the amount of capital the
                    bank can contribute to a subsidiary, if over half of the bank's net worth
                    would be invested in stocks, after such a capital contribution. (However,
                    this restriction only applies to <u>cash</u> or <u>bond</u> contributions
                    by a bank to its subsidiary -- there is no limit on contributing stock of
                    one company a bank owns to another subsidiary, since this does not
                    increase the bank's overall investment in stocks.)
                </blockquote>
            </div>
            <br/>

            <div id="chap07_VII(B)(3)">
                <h4><strong>3. PUBLIC STOCK OFFERING.</strong></h4>
                <br/>

                <p>Click on the "Public Stock
                Offering" command button to have a corporation you control make
                a public offering of its stock, in order to raise new capital.</p>
                <br/>

                <p>You will be advised that the company has, for example,
                100 million shares of stock issued at present, and that your
                underwriters (brokers) advise that you should be able to issue
                from 5 to 25 million new shares, if 100 million are currently
                issued and outstanding (roughly 5% to 25% of the existing
                number of shares).  Enter a number in the range specified for
                the number (in millions, or billions if configured to play in
                Yen, Korean Won, Indian Rupees, or Icelandic Kronur) of shares
                you want to have the company issue. The actual number of shares
                your underwriters will be able to sell will not always be exactly
                the number you wanted to sell, as in real life, but will usually
                be pretty close to that number.  Also, if your company becomes
                extremely large, the capital markets may not be able to absorb
                as large a public offering of stock as you may want to issue.
                An attempt to issue over $100 billion (U.S.) of new stock may
                not be successful. (However, the $100 billion limit on public
                stock offerings is indexed, or increased, after the third year
                of a game, increasing by 6% each year, compounded quarterly.)</p>
                <br/>

                <p>Note that issuing new stock will dilute your percent of
                ownership, which may even cause you to lose control of the
                company.  For example, if you own 20% of a company and it
                issues 20 million new shares, your percentage ownership
                will be 20/120 of the total, or less than 17% after the
                transaction, causing you to lose voting control.  (After
                such a transaction, you will still own your 20 million
                shares, but they will only represent 16.7% of the 120
                million total shares that will exist after the offering,
                versus your 20% ownership bloc just before the offering.)</p>
                <br/>

                <p>A Public Stock Offering is useful as a last resort when
                a company must raise funds for some purpose (a takeover
                perhaps), and cannot do so by borrowing, issuing junk
                bonds or selling off assets.  It may also make sense
                when stock of a company you control has run up to a
                ridiculously high price, and you think it may be getting
                ready to head south.  That's the time to sell some new
                shares to the long-suffering Public and raise a lot of
                hard cash, increasing the company's net worth considerably
                to ride out any hard times that may be coming.  That money
                may come in handy a year or two later when the price of
                the stock has fallen out of bed and you want to buy back
                the publicly-held shares at bargain basement prices.</p>
                <br/>

                <p>A company can only do an occasional public offering.
                It may be a year or two or more before you can do another,
                so use this command sparingly.</p>
                <br/>

                <p>Also, a new company, with less than 2 or 3 years of
                "seasoning," is not ready to do an "IPO" (initial public
                offering), so you will be unable to offer stock to the public
                for a startup company.  However, you may be able to do a
                "private offering" (see next section) to a venture capital
                investor (an unrelated corporation) or to yourself or to
                another company you control.  But if your company has a negative
                net worth, and is on the brink of bankruptcy, it will not
                be able to do either a public offering or a private offering,
                since most investors don't want to pour their money into a
                company that is on its deathbed. Most will prefer to wait,
                like vultures, until the company goes bankrupt and sheds a
                lot of its debt, and then may buy into it.  That won't do
                you much good, of course, if you own stock in the company
                that is going down the drain.... You will probably be broke
                by then, too, and will be standing out on some street corner
                selling apples or begging for dimes, or reduced to dealing
                with pawnbrokers, rather than stockbrokers.</p>
                <br/>

                <p>Even if your company is in satisfactory financial
                condition and has been in business for many years, it
                may sometimes be impossible to sell stock in it, in
                either a public offering or a private offering, if the
                conditions in your company's industry are so bad, with
                companies incurring serious losses, that your brokers
                are unable to find buyers for stock in such a depressed
                industry group -- doing so would be like trying to sell
                stock in a "dot.com" IPO in the aftermath of the dot.com
                bubble and ensuing crash, in 2002 -- not an easy task.</p>
                <br/>

                <p><strong>MANAGING AN ETF:</strong> In Version 8.70 or later, if the selected
                "Active Entity" is an ETF (Exchange-Traded Fund) whose
                investment advisor is an insurer or securities broker
                that you control, the Public Stock Offering button can
                be used to issue new stock for the ETF (which will increase
                the fund's total assets under management and thus increase
                the management fees your company earns for advising the
                ETF). However, such an ETF can only issue stock once a
                year, in the month of December, and may only do so if
                the ETF's net asset value per share has increased by at
                least 15% since the beginning of that year.</p>
            </div>
            <br/>

            <div id="chap07_VII(B)(4)">
                <h4><strong>4. PRIVATE STOCK OFFERING.</strong></h4>
                <br/>

                <p>A private offering of
                stock works just like a "public offering" described in the
                preceding section, except that your brokers will try to
                find a private investor to buy new stock that your company
                will issue. Usually, your brokers will be able to find a
                sucker -- excuse us, er... an investor -- to buy stock in
                your company, unless the company, or its industry group,
                is in dire financial condition. This function also gives
                you a choice of having your controlled company do a private
                stock offering to you (the player) or to any other company
                you control, other than a bank.</p>
                <br/>

                <p>In Wall $treet Raider, any company except an ETF may do,
                or at least attempt to do, a private stock offering.</p>
                <br/>

                <p>Unlike public offerings, there is no size limit on a
                private offering. However, if your company is trying to
                raise too large an amount of capital from a private offering,
                your underwriters (brokers) may sometimes be unable to find
                a buyer that can come up with that amount of cash. Private
                offerings to unrelated "white knight" companies are done at
                a slight (5%) discount from the current market price, in
                order to induce a large buyer to take a substantial position
                in your company.</p>
                <br/>

                <p>A "private offering" can also sometimes be used as a
                defensive "White Knight" maneuver, as this tactic is known
                on Wall Street. For example, if you control less than 51% of
                a company and are getting nervous about a possible takeover
                of your company by another player, but don't have the financing
                to shore up your position, consider using the "Private Stock
                Offering" transaction feature. Your company's creative investment
                bankers will do their usual magic and try to find a LARGE neutral
                company to sell the new shares to, and you can even use some of
                the proceeds of the offering to buy back some stock from the
                public, using the "LBO (Leveraged BuyOut)" function, thereby
                keeping the shares off the public market where an opponent could
                easily get at them.</p>
                <br/>

                <p>Since the shares held by the "White Knight" will usually be
                voted against any attempted merger takeover, you can make it
                tough for the circling sharks to take control of your company
                with the overpriced stock of some cat-and-dog company they own.
                Thus you can do a fairly good job of "shark-proofing" your
                company from hostile raids by creatively utilizing the "Private
                Stock Offering" and "LBO" (or "Greenmail") transactions in
                conjunction with each other.</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <strong>EXAMPLE:</strong>${' '}  If you own 34% of XYZ Corporation and
                    a "White Knight" investor (neutral -- not controlled by you
                    or another player) owns 17% of XYZ, an opponent will be
                    hard-pressed to force you to accept stock of his or her nearly
                    comatose (but high-priced) company in a stock-for-stock merger,
                    since 51% of the stock of XYZ will be voted against such a
                    merger.  Thus, at worst, an opponent could do a cash tender
                    offer for the Public's 49%. (A very clever and vicious opponent
                    might then make XYZ Corporation propose a merger with his/her
                    over-priced company, once he/she has control of XYZ, and then
                    dump his/her stock in the merged company, driving the price
                    down before you have a chance to sell your stock in the merged
                    entity.  And it goes without saying that, if you were CEO of
                    the company, he or she would first fire you, to cut off your
                    salary.)
                </blockquote>
                <br/>

                <p>Having your controlled company do a private offering can
                also be a way of increasing your percentage of control of
                the company, without having to do a "tender offer" purchase
                of stock at a price well above the market price. Simply have
                your company issue new stock to you or another company you
                control at the current market price. This can also be useful
                if, for instance, your company ABC controls 77% of XYZ, with
                the other 23% held by an opposing player or his or her company.
                XYZ could sell new shares to ABC to increase ABC's holdings
                of XYZ to 80% or more, in order to allow the two companies
                to pay their taxes on a consolidated tax return basis (so
                that, for example, ABC's tax losses could offset XYZ's
                taxable income).</p>
            </div>
            <br/>

            <div id="chap07_VII(B)(5)">
                <h4><strong>5. ISSUE BONDS.</strong></h4>
                <br/>

                <p>An alternative mode of financing,
                other than borrowing from the bank or issuing new stock, is
                for a company to use this command button to issue corporate
                bonds (considered to be "investment grade" if they are given
                a credit rating of AAA, AA, A or BBB, or considered "junk
                bonds" if your company will have a credit rating of BB or
                lower after issuing the bonds). If your company has no unused
                line of credit from its lending bank, either because it has
                already borrowed up to its line of credit, or because an
                opposing player controls the lending bank and has frozen your
                line of credit, your company may still be able to borrow by
                issuing bonds, unless it already has a bond issue outstanding.</p>
                <br/>

                <p>Corporate bonds are a security, like stocks, but represent
                a debt the issuing company owes to anyone who buys the bonds,
                unlike stock, which represents an ownership interest in the
                company. Thus, if you buy a company's bonds, even if you
                buy them from some person other than the issuing company, it
                is as though you had loaned money to the company in exchange
                for its "I.O.U.," or as if you had bought an "I.O.U." from the
                person who did lend money to the company.  ("I.O.U." means
                "I owe you....")</p>
                <br/>

                <p>Many people have no idea what a bond is -- it is really
                just an I.O.U. issued by a corporation (or by a government,
                in the case of treasury bonds, or government bonds, or "gilts"
                as they are called in the U.K.); an I.O.U. where the issuer
                agrees to pay a certain rate of interest until a certain
                date in the future, when it must repay the principal amount
                of the debt to whomever owns the I.O.U. at that time, at the
                bond's "face value" or par value (100% of face value).  If
                the company decides to pay off the bonds early, it may be
                able to "call" the bonds for redemption, but it if does, it
                usually must pay a little more than par, such as 105 (105%
                of face value).  It's not really that complicated, when
                you realize that a bond is just a glorified I.O.U. or
                promissory note, is it?</p>
                <br/>

                <p>In Wall $treet Raider, a company can only have one issue
                of its bonds outstanding at any one time.  To issue new bonds,
                it must first pay off any old bonds it has issued, either
                by buying them up on the public bond market, or by "calling"
                the bonds at above par, usually at a price of 105 (or in the
                last 4 years before the bonds mature, at 104, then 103, then
                102 then 101). However, in Wall $treet Raider, an issue of
                bonds cannot be called early if there are ten or more years
                remaining before they are due to be paid off, at maturity.</p>
                <br/>

                <p>There is a limit to how much capital can be raised by a
                very large company, through a bond issuance -- which is $150
                billion (U.S.), or the equivalent in whatever other currency
                the current game is configured for. (But the $150 billion
                limit is indexed, or increased, after three years of play,
                increasing by 6% each year, compounded quarterly.)</p>
                <br/>

                <p>Sometimes bonds will be held by an opposing player or a
                company controlled by another player, and you cannot force
                them to sell the bonds back to your company, and you may be
                unable to call the bonds for early redemption, if they do
                not mature for another 10 years, so you may be completely
                unable to pay off the existing bond issue when you want to
                float a larger issue of new bonds, to raise more capital.
                You might want to remember that fact, and buy a few bonds
                in an opposing player's main company, just to make sure his
                or her company can't call in its bonds and refinance with a
                much larger bond issue.</p>
                <br/>

                <p>If your company is able to issue bonds, the underwriters
                (stockbrokers) will tell you how much (face value) you can
                issue.  The larger the amount you issue, generally, the more
                you will reduce your company's credit rating, and thus the
                higher interest rate you will have to agree to pay on the bonds.
                When you enter an amount you want to issue, the underwriting
                brokers will tell you what the credit rating will be, and
                if it is not "AAA" or "AA" will suggest that you might want
                to issue a smaller amount, and seek to get a better credit
                rating and a lower "coupon" or interest rate.  Thus, you might
                try to issue the maximum amount your brokers say they can
                float for your company, say $10,000 million, with a "CC"
                credit rating, and a 12.0% interest rate. You will be given
                the choice of going ahead with that transaction, by clicking
                on the "Yes" button, or clicking on "No" and entering a smaller
                amount. For example, you might decide to issue only $3,000
                million, and would find (depending on the general level of
                interest rates) that that would improve the credit rating on
                the bonds to "BBB" and lower the interest you would be paying
                on them to only 9.25%, and thus you might choose to go with
                the smaller amount of $3,000 million. (Or else cancel the
                offering altogether, if interest rates seem too high.)</p>
                <br/>

                <p>Another factor that affects the interest rate an issuer of
                bonds will have to pay is the number of years before the bond
                is due to mature (be paid off). The longer the term of years
                until maturity, the higher the interest rate, all other things
                being equal. In Version 9.75 or later versions, once you have
                decided on the amount of a bond issuance and how much of the
                proceeds, if any, will be applied to paying off some or all of
                the issuer's bank loan, the program will show you a tentative
                interest rate, based on a 10-year term until maturity. (Or,
                in the case of an index fund ETF you manage, based on a 5-year
                maturity). You can either issue the bonds at that point, or
                you are asked if you want to see what the interest rate would
                be if you choose a different maturity, ranging anywhere from
                3 years to 20 years in the future (3 to 5 years in the future
                for bonds of index fund ETFs, which are extremely risky entities
                and often go bankrupt, defaulting on their debts).</p>
                <br/>

                <p>Thus you can try different maturities, until you decide on
                a term and interest rate that suits you. In general, if you are
                borrowing at a very low interest rate, you will want to choose
                to issue a longer-term bond, like 15 or 20 years, even at a
                somewhat higher rate than the issuer would pay on short-term
                bonds. Thus, you would benefit from having the use of the money
                at a low interest rate for many years. But if rates are very high,
                you may want to issue bonds for just a short term like 3 to 5
                years, so your company won't have to pay the high rate very
                long. Of course, the company could get in trouble if it issues
                3-year bonds, invests the money in assets and cannot generate
                enough funds to pay off the bonds that soon, perhaps forcing it
                to sell assets at a bad time, in a "fire sale," when the bonds
                come due.</p>
                <br/>

                <p>In recent releases of Wall $treet Raider, another alternative
                that can enable you to issue bonds at a lower interest rate is
                to issue convertible bonds, although ETFs are not allowed to
                issue convertible bonds in Wall $treet Raider. Also, while
                other ("straight") bonds can be issued for terms of 3 to 20
                years, in Wall $treet Raider, convertible bonds can only be
                issued for a term ranging from 3 to 10 years, or 3 to 5 years
                in the case of ETFs that are index funds.</p>
                <br/>

                <p>Convertible bonds are like "straight" bonds except that they
                can be converted into stock, usually at a price about 10% to 20%
                above the current stock price, a price which is set when the
                convertible bonds are issued. Because of this "equity kicker"
                feature, buyers are usually willing to accept a considerably
                lower interest rate on convertible bonds than on a "straight"
                bond issued with the same credit rating, since they have a
                chance to make significant capital gains if the underlying
                stock appreciates above the conversion price, in which case
                the bonds will rise in price accordingly.</p>
                <br/>

                <p>After issuance, if the underlying stock declines substantially,
                the convertible bonds will usually decline also, but to a lesser
                extent, so that they may sell at 50%, 100% or even several
                hundred percent above the value of the shares each bond could be
                converted into, which is called the "conversion premium." If, on
                the other hand, the issuer's stock rises sharply, the initial
                conversion premium of about 10% to 20% will gradually shrink,
                often to as little as 1% or so, if the stock rises to about 60%
                or more above the conversion price. From that point on, if the
                stock continues to rise, the bonds will rise at almost exactly
                the same rate as the stock and the issuing company is likely
                to force all the bondholders to convert their bonds into stock.</p>
                <br/>

                <p>In the real world, since convertible bonds always trade
                at a price that is somewhat above their conversion value,
                it is almost unheard of for anyone to actually convert their
                bonds voluntarily, since they can get more by selling them
                than by converting the bonds into stock and then selling
                the stock. Thus, conversion usually only occurs when the
                convertible bonds mature (if the stock price is above the
                conversion price of the bonds at the time) or when the
                issuer "calls" its bonds for a forced conversion into the
                stock. If a convertible bond issued at 100 rises in price
                to something like 200 or more, the issuer will often call
                the bonds for conversion into stock, saving the expense of
                paying interest on the bonds.</p>
                <br/>

                <p>Note that your company's total debt, immediately after the
                bond offering, including accrued taxes and bank loans, as
                well as the new bonds that will be outstanding, is taken into
                account in determining the issuing company's credit rating
                when the bonds are issued. Thus you are always offered the
                option of applying some or all of the proceeds of the bond
                issue to pay off some or all of your company's bank loan at
                the same time the bonds are issued, which will help you to
                get a lower interest rate than if you issued the bonds on
                top of the bank loan, and then later decided to use some of
                the money to pay off the bank loan.</p>
                <br/>

                <p>A good time to issue bonds is when interest rates are at
                a very low level, such as a "prime rate" of about 4% or 5%.
                Since bank loans have a floating interest rate, it is often
                a good idea, even though you will pay a slightly higher
                interest rates on bonds than you are currently paying on a
                bank loan, to issue bonds when rates are low and pay off
                your bank loans, locking in the low interest rate on the
                bonds for 10 or 15 years or more. In short, sock away a lot
                of capital when money rates are cheap. Then, if the prime
                rate goes up to 12% or 15% a year or two later, you won't be
                stuck paying the bank 14%, 16%, 18% or even more on a floating
                rate loan. You may still be paying interest (fixed) on
                the bonds at about 6%, and can invest the money at a much
                higher interest rate.</p>
                <br/>

                <p>Also, if interest rates soar after you issue bonds, you may
                be able to buy back your company's bonds from the public at a
                discounted price of about 60% or 70% of par. Since you issued the
                bonds at par (100), if you can buy back 200 million (face value)
                of the bonds for a price of 60 (120 million total), your company
                will have an instant gain (taxable, unfortunately) equal to the
                difference, or some 80 million of profit, in this example.</p>
                <br/>

                <p>If you click on the "Issue Bonds" button and your company
                has bonds already outstanding, a long message will appear,
                informing you that you can't issue new bonds until the old ones
                are paid off, and asking you if you want to try to redeem (call)
                the bonds at a certain price, such as at 105. If there are bonds
                in public hands, the message will tell you their current market
                price, and will note how many can be bought from public bondholders.
                If, for example, the bonds were trading at 88, or could be called
                ("redeemed") at 105, it would obviously be better to answer "No"
                and buy back the bonds on the open market at 88 cents on the
                dollar, rather than redeem them at 1.05 on the dollar.</p>
                <br/>

                <p>If none of the bonds are in the hands of the public, and you answer
                "No," that you don't want to call (redeem) the bonds, you will be given
                a chance to buy some of the bonds back from various banks and insurance
                companies that hold your company's bonds, not at market price, but
                at a price 5 points above market price (or at 93, in the above example).
                Thus, there may be several possible ways in which your company can buy
                back some or all of its bonds, at widely differing prices.</p>
                <br/>

                <p>If, like most players of Wall $treet Raider, you have a cunning,
                larcenous mind, you may see a company whose bonds are trading at 70
                cents on the dollar, but has the money to buy them back, so you may
                think, "Aha! I'll buy up all the bonds, then buy enough stock to
                control the company briefly, and have it 'call' all its bonds (owned
                by me) at 105!  Hmmm.... So I pay 70 for them, and quickly sell them
                back to the company at 105, a 50% instant profit.  How sweet it is!"</p>
                <br/>

                <p>Sorry, but that would be a breach of ethics, a conflict of interest
                situation, so you would not be allowed to call in the bonds, if they
                were trading at much less than the call price of 105.  Nice try,
                though.  It shows you are beginning to think like one of the larcenous
                yellow-eyed wolves that lurk on Wall Street, ever on the lookout for
                quick ways to fleece the unsuspecting public stockholders.</p>
                <br/>

                <p>Congratulations!</p>
                <br/>

                <p>One way you CAN sometimes make a large, quick profit on bonds,
                without having to bet right on the direction of bond prices, is to
                buy bonds selling well below par in a company with a weak credit
                rating, then have it merge with (acquire) a somewhat larger company,
                which will greatly improve its credit rating, causing the bonds to
                rise sharply in price. Of course, you may lose as much money trying
                to get in and out of the company's stock as you made on the bonds,
                so this tactic will not always work to perfection, but it can add
                to your profits if you like the company and were planning to buy
                control of it and do a merger with another company anyway. A quick
                profit on the side, on the company's junk bonds, when its credit
                rating suddenly is upgraded after the merger, could never hurt.</p>
                <br/>

                <p>Note that when interest rates get very high, your company
                may be unable to float "junk bonds" at any price.  Also,
                if your company's credit rating is too poor or the company
                is too small, or too new (such as a startup company) you may
                be unable to get an investment banker to underwrite (peddle)
                the bonds for you.  Junk bonds are a sometime thing, mostly
                issued in "bull" markets.</p>
                <br/>

                <p>In Wall $treet Raider, bonds have a lower priority in
                bankruptcy than bank loans, so they tend to have a higher yield,
                when issued, than the company would have to pay on the same
                amount of bank debt. But you will notice that when you do a
                new issuance of bonds, the bonds will initially trade at well
                above the issue price, and their yield to maturity at the
                current market price will often be LOWER than the interest rate
                the company pays on bank loans.  How can that be?  That is because,
                in pricing the bonds, the market takes into account the fact that
                the company still has the cash available, and could pay off that
                much debt easily. However, once the issuing company invests the
                cash (for example, in stocks or business assets), the bonds will
                then tend to trade at a lower price, as the company is no longer
                as liquid as it was.</p>
                <br/>

                <p>Thus, if you had plans to manipulate the price of your company's
                bonds up and down, simply by borrowing from the bank to reduce
                the company's credit rating, buying the bonds, then having the
                company pay back down its bank debt, restoring its good credit
                rating and running the bond price back up, as was possible in
                earlier versions of Wall $treet Raider, you will discover that
                that particular tactic no longer has any effect on the bond
                price. Another good "loophole" closed....</p>
                <br/>

                <p><strong><u>MANAGING AN ETF:</u></strong> In Version 8.70 or later, if
                the selected "Active Entity" is an ETF (Exchange-Traded Fund)
                whose investment advisor is an insurer or securities broker that
                you control, the ISSUE BONDS button can be used to issue bonds
                for the ETF, to the same extent as for a company you control,
                except that in W$R, an ETF cannot issue convertible bonds.</p>
                <br/>

                <p><strong><u>NOTE:</u></strong> This button will not usually appear on the
                "FINANCING" Menu if the current ${helpLink('chap03_III(A)', 'Active Entity')}
                or ${helpLink('chap03_III(A)', 'Transacting Entity')} is you, the
                player, rather than a corporation you control -- since you can't,
                as an individual, issue bonds. However if the "Active Entity" is
                an ETF that is managed by one of your controlled companies, this
                button will always appear.</p>
            </div>
            <br/>

            <div id="chap07_VII(B)(6)">
                <h4><strong>6. BUY BACK OR CALL BONDS.</strong></h4>
                <br/>

                <p>Click on this button to
                have a company you control buy back its bonds, either on the
                public bond market, at slightly above market price, or directly
                from existing bank or insurance company holders of its bonds,
                at 5 points above the market price. A company you control can
                also buy back bonds that are owned by you or by another company
                you control, at the current market price of the bonds.</p>
                <br/>

                <p>In general, you would want to buy back a company's bonds
                when their market price is significantly below par (100).
                For example, if XYZ Corporation's bonds were trading at 88,
                you could have the company buy them back for roughly that
                price. To the extent the buyback price is less than 100
                (100% of face value), the difference will all be reported
                as income by the issuing company, since the company is
                paying off its debt at a discount.</p>
                <br/>

                <p>Alternatively, you can sometimes have the company "call"
                its bonds for early redemption (wholly or in part). "Calling"
                in or "redeeming" its bonds prior to their date of maturity
                would usually be done when interest rates have declined,
                and the company is still paying a high rate of interest
                on a bond issue, say 12%, when it could sell new bonds
                at only 7% or 8%.  In that case, the bonds might be
                trading on the market at about 109 or 110, so it would
                be better to "call" in the bonds at 105 or whatever the
                current call price may be (which will be less than 105
                if the bonds have only 4 years or less until maturity).
                Better to call them at 105 (with no brokerage commissions),
                than to try to buy them on the open market at 109 plus
                commissions, for example. Redemption prices depend on
                how many years are left until the bonds are to be paid
                off (maturity):</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <pre>
         Years to Maturity     Call Price as % of Face Value
         -----------------     -----------------------------
           10 or more years        (Not callable)
           5 to 9 years                 105
           4 years                      104
           3 years                      103
           2 years                      102
           1 year                       101
           Less than 1 year             100
                    </pre>
                </blockquote>
                <br/>

                <p>However, it is not always possible to do an early "call"
                or "redemption" of bonds.  In Wall $treet Raider, the rule
                is that bonds are not callable at all until there are less
                than ten years remaining before they maturity.  Thus, when
                you float new bonds, it may be several years before they
                become "callable."  Also, if you (or a company you control)
                owns any of the bonds, and you try to have the issuer call
                the bonds early, that is a "conflict of interest" and is
                not permitted, unless the bonds' market price is somewhat
                above par (above 100) at the time.</p>
                <br/>

                <p>If company buys back or calls its bonds at a price
                greater than 100, the excess over face value (100) that
                it pays is treated as an expense item, which can hurt
                its reported earnings for that quarter.  In addition,
                it will pay the bondholders accrued interest at the time
                of the buyback or redemption.</p>
                <br/>

                <p><strong>MANAGING AN ETF:</strong> In Version 8.70 or later, if the selected
                "Active Entity" is an ETF (Exchange-Traded Fund) whose
                investment advisor is an insurer or securities broker
                that you control, and the ETF has issued bonds, you can use
                this button to have the ETF buy back some or all of its bonds.</p>
                <br/>

                <p><strong><u>NOTE:</u></strong>  The "Buy Back or Call Bonds" button will
                not usually appear on the "FINANCING" Menu if the current
                ${helpLink('chap03_III(A)', 'Transacting Entity')} is you, the
                player, rather than a corporation you control. However if the
                "Active Entity" is an ETF that is managed by one of your
                controlled companies, this button will always appear.</p>
            </div>
            <br/>

            <div id="chap07_VII(B)(7)">
                <h4><strong>7. EXTRAORDINARY DIVIDEND.</strong></h4>
                <br/>

                <p>Click on this button if you wish
                to have the currently selected ${helpLink('chap03_III(A)', 'Transacting Entity')}
                pay out a special, or "extraordinary" dividend to its stockholders. This
                transaction is for corporations only -- individual players don't pay
                dividends to anyone. To prevent you from thoroughly looting a corporation,
                and leaving its bank lender and bondholders holding the bag when
                the company implodes, there are strict limits on how much you can
                have a company pay out as an "extraordinary dividend." Also, banks
                and insurance companies are sometimes prohibited from doing so by
                government regulators, as well, and are much more limited in the
                amount they can pay out than other companies, when they are allowed
                to make such a distribution at all.</p>
                <br/>

                <p>Any company that has a very poor credit rating will also be
                unable to pay an extraordinary dividend, and the amount a company
                is allowed to pay out will be limited, to prevent a payout that
                is so large it would nearly bankrupt the company.</p>
                <br/>

                <p>Generally, an extraordinary dividend is taxable to the same
                extent as regular, quarterly dividends a company pays out. That
                is, it is fully taxable to an individual player; only 50% of
                the payout is taxable to a corporation that owns less than 20%
                of the stock of the payor, generally; only 35% is taxable to a
                corporation that owns 20% to 79% (or that is under common control
                with the payor, even if it owns less than 20%) of the stock; and
                none of the dividend is taxable to a company that owns 80% to 100%
                of the payor.</p>
                <br/>

                <p>That is the general rule.  However, if the dividend represents
                a significant percentage (which varies) of the assets of the
                paying company, or if the payor company tries to do multiple
                extraordinary distributions, then you will be warned that the
                payout will be considered a "partial liquidation" by the tax
                authorities, and thus will be fully taxable to ALL recipients,
                including corporations (except a parent corporation owning
                80% or more of the payor's stock), and you will be given a
                chance to call off the transaction, rather than have any
                corporate recipients of the dividend incur large tax
                liabilities.</p>
                <br/>

                <p>You will notice that when a company pays out a large
                "extraordinary dividend," the price of its stock will drop
                immediately after, roughly reflecting the reduction of its
                net worth (and credit rating) that results from paying out
                the dividend.</p>
                <br/>

                <p>The "Extraordinary Dividend" is an tool used for many decades
                past by real corporate "raiders" (looters) to strip a company
                of its liquid assets after they have bought up its stock at a
                depressed price. It works well in Wall $treet Raider too, if
                you don't get hit by too large a tax bite.</p>
                <br/>

                <p>Note that if you have sold a stock short in a company
                that pays out an extraordinary dividend, or even regular
                quarterly dividends, you must pay, as an expense item,
                an amount equal to the dividend you would have received
                if you had been "long" that amount of shares. That expense
                is not deductible, except as a capital loss against any
                capital gains you may realize in the same year or later.
                (Which is only fair, since the reduced value of the shorted
                stock after the company pays a large dividend will increase
                your capital gain when you cover your short position in the
                stock.)</p>
                <br/>

                <p>Version 8.70, which added the ability to manage an
                Exchange-Traded Fund (ETF), if you control the insurance
                company or securities broker that is the investment manager
                for the ETF, allows you to manage the ETF's investments, but
                also lets you direct the ETF to do certain other financial
                transactions, including payment of extraordinary dividends.
                Special rules apply to an extraordinary dividend paid by an
                ETF:</p>
                <br/>

                <ul>
                    <li>No such distribution can be made if the ETF has any
                    indebtedness, or would have indebtedness after paying the
                    dividend and paying any required capital gains distributions
                    at the end of the current calendar quarter;</li>
                    <br/>

                    <li>The amount of such distribution is limited to 30% of
                    the ETF's cash equivalents (cash + T-bills);</li>
                    <br/>

                    <li>No such dividend payment can be made if the total of
                    the ETF's cash and T-bills is a negative amount; and</li>
                    <br/>

                    <li>Extraordinary dividends paid by an ETF are not taxable,
                    but instead just reduce the shareholder's tax basis in the
                    ETF stock held by the shareholder (but if the amount received
                    is greater than the holder's tax basis, the excess is a
                    capital gain for a player or an "extraordinary gain" for a
                    corporation).</li>
                </ul>
            </div>
            <br/>

            <div id="chap07_VII(B)(8)">
                <h4><strong>8. TAX-FREE LIQUIDATION.</strong></h4>
                <br/>

                <p>The "Tax-Free Liquidation"
                function is used to liquidate one wholly-owned corporation into
                another, in a nontaxable liquidation. Click on this command
                button to begin either of type of liquidation. If it is
                allowable, a nontaxable liquidation will be done. If not,
                you will be asked if you want the company to instead do a
                "taxable" liquidation (if possible). Tax-free liquidations
                are discussed in this segment, and "taxable" liquidations
                in ${helpLink('chap07_VII(B)(9)', 'Section VII(B)(9)')} below.</p>
                <br/>

                <p>To liquidate the currently selected ${helpLink('chap03_III(A)', 'Transacting Entity')}
                into its parent corporation in a nontaxable liquidation, the
                liquidating company must be a 100%-owned subsidiary of another
                company <strong><em>in the same industry group,</em></strong> which you
                control, generally. However, it is also possible to do a
                nontaxable liquidation of any 100%-owned holding/trading
                company or to liquidate any 100%-owned industrial corporation
                (but not a bank or insurance company) into a holding/trading
                company.</p>
                <br/>

                <p>If the entity you wish to liquidate (which you will also control
                if you control its parent corporation) is not a 100%-owned holding
                company or 100%-owned subsidiary of another company in the same industry,
                a nontaxable liquidation will not generally be possible, but the
                program will give you a chance to instead attempt to do a "taxable"
                liquidation (unless the company you wish to liquidate is a bank or
                an insurance company, in which case it can only be liquidated, if
                at all, in a nontaxable subsidiary liquidation, into another bank
                or insurance company).</p>
                <br/>

                <p>Let's assume that the ${helpLink('chap03_III(A)', 'Active Entity')}
                that you wish to liquidate is XYZ Corporation, a 100%-owned subsidiary
                of ABC Corporation, in the same industry. Once you have selected
                XYZ Corporation as the Active Entity and you click on the
                "Tax-Free Liquidation" button to commence the process of liquidating
                XYZ Corporation into ABC Corporation, its parent company, you
                will be asked to confirm that you want to liquidate XYZ Corporation.
                If you answer "Yes" (by clicking on the "Yes" button), the
                nontaxable liquidation will usually occur.</p>
                <br/>

                <p>However, in some cases a government agency will require the
                company that is to be liquidated to first "divest" (sell off) its
                stock in a company it owns, before the liquidation will be approved.
                In that case, you will be given a choice of making the divestment,
                or canceling the planned liquidation of XYZ Corporation. Then, even
                if you agree to do the divestiture, you might be informed tha XYZ
                must divest another stock it owns.... And so on.</p>
                <br/>

                <p>In other cases, inexplicably, you may simply be told, with
                no further explanation, that a government banking or insurance
                regulatory agency has decided not to allow the liquidation of
                the company, if the company is a bank or insurance company.
                That's just the way bureaucracies work, often very arbitrarily.
                Such is life and commerce. You can always try it again at a later
                date, and you might have better luck at that time.</p>
                <br/>

                <p>Even if you get past all the government regulatory hurdles, if
                both ABC and XYZ have issued bonds, and neither has enough money
                or line of credit to fully pay off its bonds before completing the
                liquidation, then the bondholders of either ABC or XYZ may well
                block the liquidation. However, if the two companies have similar
                credit ratings for their bonds, and their bonds are trading at
                nearly the same prices, the bondholders may not object, and the
                bondholders of XYZ will swap their XYZ bonds for new ABC bonds
                as part of the liquidation. Or, if only the liquidated company
                has bonds issued and outstanding before the liquidation,
                the surviving company (ABC in this example) will then assume
                the liability for those bonds (unless they are convertible
                bonds), so the name of the issuing company will change on the
                bonds, but nothing else.</p>
                <br/>

                <p>In some cases, the bondholders of one company or the
                other may block the liquidation, unless you, or companies
                you control, own over 50% of the bonds of both companies
                -- the parent and the subsidiary you are attempting to
                liquidate into the parent. If that occurs, you may need
                to go into the bond market and buy up more than half of
                the total bonds issued by each of the two companies,
                before trying again to complete the liquidation.</p>
                <br/>

                <p>If your company meets all the above requirements for
                a nontaxable liquidation, the liquidation is very simple
                to do in Wall $treet Raider. This type of liquidation is
                not a taxable transaction.</p>
                <br/>

                <p>The real question is:  When <em>should</em> you liquidate a
                company into another?  Understand that when you liquidate one
                company into another in a nontaxable type of liquidation, all
                the various assets, liabilities, tax losses, etc. of the
                liquidated company are generally transferred to the parent
                company and added to its assets, etc., and the liquidated
                company ceases to exist.  (Although, as a dormant "shell"
                company, it may later be resuscitated as a startup company.
                We recycle everything in Wall $treet Raider!)</p>
                <br/>

                <p>While tax losses of a liquidated company generally carry over
                to the surviving parent company in a nontaxable liquidation, that
                is true only if neither of the two companies are holding / trading
                companies. If one or both of the two companies are holding / trading
                companies, the tax loss carryovers of the liquidated company, if
                any, will disappear forever, and be wasted, when you liquidate the
                subsidiary. Or, if the parent company is a holding / trading
                company that has tax losses, those losses will also disappear if it
                liquidates a subsidiary that is NOT a holding company.  However,
                you will be warned about the potential loss of any large tax loss
                carryovers, and given an opportunity to cancel the liquidation, if
                either the parent company or the subsidiary has tax loss carryovers
                that would be lost upon doing the liquidation.</p>
                <br/>

                <p>Here are a few suggestions as to when you might want to
                liquidate a company in a nontaxable liquidation (or not):</p>
                <br/>

                <ul>
                    <li><strong><u><em>To increase market share.</em></u></strong>  If you control
                    two companies in the same industry, and each has a 20% market share,
                    neither may be very profitable. However, if you liquidate one into
                    the other, the combination of their "business assets" will mean that
                    the surviving company will have a 40% market share, which should
                    make it the "800-pound gorilla" in its industry and increase its
                    profitability considerably.</li>
                    <br/>

                    <li><strong><u><em>To realize net asset values.</em></u></strong>  If one
                    company you control owns 100% of a subsidiary and the subsidiary's
                    stock value is much less than its net worth, liquidating the
                    subsidiary will immediately increase the net worth of the
                    parent company. However, if the subsidiary's stock sells
                    for more than its net worth, liquidation may not be a good
                    idea, since doing so will <em>reduce</em> the net worth of the
                    parent company.  That is, if the sub's stock is worth $100
                    million and its net assets are only $75 million, the stock
                    is a $100 million asset in the hands of the parent -- but
                    if it liquidates the sub, it will instead receive the $75
                    million of net assets in place of the stock, lowering
                    its net worth by $25 million, and possibly affecting its
                    credit rating and borrowing power adversely.</li>
                    <br/>

                    <li><strong><u><em>To shelter a profitable company from taxes.</em></u></strong>
                    If a company you control has a high income on which it is paying
                    taxes, and no tax losses to shelter such income, it can acquire
                    a nearly bankrupt company in the same industry (other than a
                    holding/trading company) with tax loss "carryovers" and liquidate
                    it. It will "inherit" the liquidated company's tax losses. Or if
                    your company has large tax losses it can't use, have it acquire
                    and liquidate a profitable subsidiary in the same industry. The
                    future earnings from the assets acquired from the subsidiary will
                    be sheltered by your company's tax losses. (However, in the latter
                    case, you can accomplish the same thing by having your "loss" company
                    acquire any kind of profitable subsidiary, in any industry -- and as
                    long as the parent ("loss") company owns at least 80% of the stock
                    of the subsidiary, they will file consolidated tax returns, which
                    means that the profits of the subsidiary will be sheltered by the
                    tax loss carryovers of the parent company.)</li>
                    <br/>

                    <li><strong><u><em>To affect credit rating.</em></u></strong> If you liquidate
                    a subsidiary that has a low credit rating into a parent company
                    with a good credit rating, the parent company's credit rating
                    may be hurt and it may have its line of credit reduced or
                    eliminated as well. On the other hand, liquidating a sub
                    with a good credit rating may (sometimes) improve the parent's
                    credit rating, saving on interest expense, if the subsidiary
                    is free of debt, or nearly so, and if its stock was trading at
                    less than its net worth per share.</li>
                </ul>
                <br/>

                <p><strong><u>NOTE:</u></strong>  The "Tax-Free Liquidation" button will
                not appear on the "FINANCING" menu if the current
                ${helpLink('chap03_III(A)', 'Active Entity')} or Transacting Entity
                is you, the player, rather than a corporation. Humans don't get
                liquidated, at least not in a financial sense.</p>
            </div>
            <br/>

            <div id="chap07_VII(B)(9)">
                <h4><strong>9. TAXABLE LIQUIDATION.</strong></h4>
                <br/>

                <p>Any company that you control
                can usually be liquidated in a "taxable" liquidation, except
                for a bank or an insurance company (which can only be liquidated,
                if at all, in a nontaxable liquidation, as described in the
                preceding segment). However, you cannot do a taxable liquidation
                of a company if it does not have enough assets to pay off all of
                its debts and tax liabilities. That is, no taxable liquidation
                is allowed if the company has a negative net worth, generally.
                Also, you cannot liquidate an ETF in either a taxable or a tax-free
                liquidation in this simulation.</p>
                <br/>

                <p>In Wall $treet Raider, a "taxable" liquidation is quite
                different from a nontaxable one. Instead of transferring
                all the liquidated company's assets and liabilities to a
                100% owner (parent) corporation, in a "taxable" liquidation
                the company to be liquidated must first sell all of its
                non-cash assets, pay off bondholders, and pay off any bank
                loans, advances from players, and accrued income taxes it
                owes. Then the company simply distributes the remaining
                cash to each of its shareholders, in proportion to their
                percentage of stock ownership in the company, and then it
                goes out of existence.</p>
                <br/>

                <p>We refer to it as a "taxable" liquidation because any
                shareholders (including both players and corporation
                shareholders) who own stock in the liquidating corporation
                will receive cash in exchange for their stock, and will
                recognize a taxable gain or loss for income tax purposes,
                depending on whether the cash received in the liquidation is
                more or less than the shareholder's cost or "tax basis" for
                the stock. For an individual player, any gain or loss will
                be a capital gain or loss, with a capital gain taxed at the
                lower capital gains tax rate, and a capital loss deductible
                only against other capital gains. Corporations that have a
                gain or loss on their stock of the liquidated company will
                include the gain or loss in their taxable income, paying
                tax at regular corporate rates if the transaction results
                in a gain, but the gain or loss will be treated as an
                "extraordinary" item, rather than part of operating income,
                in the recipient company's next earnings report.</p>
                <br/>

                <p>Unlike most nontaxable liquidations, in a "taxable"
                liquidation any tax loss carryovers of the liquidated
                company always disappear and are lost forever. However,
                you will be warned and given a chance to cancel the
                taxable liquidation if the company you are about to
                liquidate has large tax loss carryovers.</p>
                <br/>

                <p>While it is usually possible to do a taxable liquidation
                of any company you control (other than a bank or insurance
                company), there may be situations where it will not be possible,
                such as where the company is unable to pay off all its
                bondholders, or where it may not be able to sell its business
                assets (capital assets) at a reasonable price, and the loss
                from "scrapping" those assets might be so great that it
                would make the liquidation financially inadvisable, from
                the standpoint of the stockholders, such as you.</p>
                <br/>

                <p>In other cases, the company you wish to liquidate might be
                unable to sell the stock of a nearly bankrupt subsidiary to
                anyone, so you may have to wait until the subsidiary's stock
                becomes worthless in bankruptcy, or recovers and becomes
                marketable again, before your company can sell off that
                particular stock and complete the liquidation process.</p>
                <br/>

                <p>Before Version 9.0, if your company was subject to ongoing
                asbestos litigation costs or "SuperFund" environmental
                clean-up charges that could bankrupt it, its stock might
                trade at less than its net worth, so doing a taxable
                liquidation was one way of recovering the value of its
                assets before the company was bankrupted or badly damaged
                by the litigation. That was a nice loophole, a good way to
                weasel out of a bad situation and stop the bleeding.</p>
                <br/>

                <p>However, in the current version, the company must set
                aside a large sum for the payment of future damages before
                it is allowed to do a taxable liquidation. The amount it must
                pay out is the greater of: 5% of its total assets; or $200
                million if it is subject to asbestos liability (or $100 million
                if it is subject to "SuperFund" liability).</p>
                <br/>

                <p>There are not many situations where you will want to do
                a taxable liquidation of a company in Wall $treet Raider,
                but we have added this type of liquidation to the program,
                at the request of a number of users, and we hope you will
                find it to be a useful new financial tool. Since the
                company that is going through a "taxable" liquidation
                will need to turn all of its assets into cash before it
                liquidates, and will often have to sell the assets at
                prices somewhat less than their current value, you may
                often come away with more cash by instead selling your
                stock in the company, rather than liquidating the company
                to get at its cash.</p>
                <br/>

                <p>Some situations where it might be advisable to do a
                "taxable" liquidation of a company you control would be
                as follows:</p>
                <br/>

                <ul>
                    <li><strong><u><em>When the stock sells at a large discount.</em></u></strong>
                    If you control a company, especially one that already has
                    most of its assets in the form of cash, or other assets
                    that can be sold at close to their current value, and its
                    stock trades at a very deep discount to net worth per share,
                    it may make sense to liquidate it and get the company's net
                    cash after it sells off its assets. For example, if a
                    company has most of its assets in the form of cash, and
                    has a net worth per share of $20 per share, but is trading
                    for only $13 a share, and you control it (whether or not you
                    own 100% of the stock), you would be better off to liquidate
                    the company and perhaps receive about $20 a share (or even $15
                    a share, if it had to sell off stocks or capital assets and
                    incurred large selling costs). That would be better than
                    selling your stock at $13 a share (and perhaps getting only
                    $10 or $11 net, if you owned a large bloc of the stock, sale
                    of which would drive down the market price even further when
                    you unloaded it).</li>
                    <br/>

                    <li><strong><u><em>When you are unable to sell your stock.</em></u></strong>
                    In some cases, where you own 100% of the stock of a company,
                    you may be unable to sell your stock until the company
                    is able to do a public or private offering of its stock,
                    to make its shares you own salable by you. And in some
                    cases, it may not be able to do an offering, due to market
                    conditions or other factors, or if it has recently done stock
                    offerings, and you bought up all of its stock. If you don't
                    want to own the company any more, and can't sell its stock,
                    you can always consider liquidating it in a taxable
                    liquidation and turning your investment into cash in that
                    way, as a reasonable alternative. (Unless it is a bank or
                    an insurance company, of course.)</li>
                </ul>
                <br/>

                <p><strong><u>NOTE:</u></strong> The "Taxable Liquidation" button
                will not appear on the "FINANCING" Menu, if the current
                ${helpLink('chap03_III(A)', 'Transacting Entity')} is you, the player, or is a
                bank or insurance company, since none of those types of
                entities are allowed to do a taxable liquidation in Wall
                $treet Raider.</p>
            </div>
            <br/>

            <div id="chap07_VII(B)(10)">
                <h4><strong>10. SPIN-OFF SUBSIDIARY.</strong></h4>
                <br/>

                <p>Any parent corporation
                may, in most cases, spin off (distribute) the stock of a
                subsidiary company, or part of such stock, to the stockholders
                of the parent company, in proportion to their holdings of
                the parent's stock.  For example, if A owns 60% of ParentCo,
                B owns 30% of ParentCo, and "the Public" owns the other 10%,
                and ParentCo spins off 50% of SubCo, A will receive 30% of
                SubCo, B will receive 15% of SubCo, and "the Public" will
                receive 5% of SubCo (60%, 30%, and 10% of 50%, respectively).</p>
                <br/>

                <p>Because a spin-off is, in effect, a dividend (but paid in
                the form of stock of another company, rather than in cash),
                it is similar to an extraordinary dividend, and too large a
                spin-off, in terms of value of the spun-off stock, may harm
                the parent company's credit rating and financial viability.
                For that reason, the government may prevent this kind of
                potential fraud on creditors of the parent company, and may
                block the spin-off, if the distribution would reduce the
                parent company's credit rating by more than 3 notches (such
                as from AAA to BB, which would be 4 notches -- to AA, to A,
                to BBB, and to BB).  Also, if the spin-off would reduce
                the credit rating to CCC or lower, it will not be permitted,
                nor will it be permitted if the credit rating is already
                CCC or lower. (For banks or insurance companies, the
                restrictions are somewhat tighter -- no spin-off is allowed
                that will reduce the credit rating of the bank or insurer to
                less than BBB.)</p>
                <br/>

                <p>Taxability is usually a very important factor when
                doing a spin-off.  A taxable spin-off can be a disaster,
                financially.  If the tax authorities rule that a spin-off
                is taxable, it will be treated as taxable income to each
                shareholder receiving stock, except an 80% or greater
                corporate owner; the value of the stock received will be
                the taxable amount (and will become the "tax basis" of
                such stock) for each recipient of the spun-off shares.
                In addition, if the value of the stock being spun off
                is greater than its "tax basis," the parent company
                will be treated as though it sold the
                stock at the current market value, and will have an
                extraordinary gain on the distribution of the stock.
                Such gain, fully taxable to the parent company, may
                further reduce its credit rating, because of the tax
                it will soon have to pay on such gain.</p>
                <br/>

                <p>Note that if the stock distributed has a market value
                that is <em>less</em> than its tax basis, the loss will
                not be allowed as a taxable loss or deduction. (This
                is essentially the same as U.S. Internal Revenue
                Service rules on taxable distributions of property by
                a corporation.)</p>
                <br/>

                <p>In Wall $treet Raider, a spin-off can qualify as a
                nontaxable transaction only if four requirements are all met:</p>
                <br/>

                <ul>
                    <li>At least 80% of the stock of subsidiary company
                    must be distributed in the spin-off;</li>
                    <br/>

                    <li>The stock of the spun-off company must not currently
                    be a holding/trading company;</li>
                    <br/>

                    <li>The company being spun off must have a history of
                    having been engaged in an active trade or business (which
                    includes banking or insurance industries, but not holding/trading
                    companies) for at least the last five years, without interruption,
                    as an 80% subsidiary of the parent company that is doing the
                    spin-off; and</li>
                    <br/>

                    <li>The company being spun off must not have cash and cash
                    equivalents (T-bills) as over 2/3 of its total assets.</li>
                </ul>
                <br/>

                <p>If the spin-off distribution does not meet all four
                of the above tests, it will be ruled a taxable spin-off
                by the tax authorities. (These rules also rather closely
                parallel the general rules for tax-free spin-offs under U.S.
                tax laws, as administered by the Internal Revenue Service.)</p>
                <br/>

                <p>Note that you can get around the second requirement
                in Wall $treet Raider by having the subsidiary that is a
                holding/trading company acquire business assets, so it is
                no longer a holding/trading company. But even so, you will
                have to wait for 5 years to pass before it can be spun-off
                in a nontaxable transaction. Similarly, if the company that
                wants to spin off a subsidiary owns less than 80% of the
                subsidiary, it can increase its ownership percentage to at
                least 80%, but will still have to wait for at least five
                years until it can do a tax-free spin-off.</p>
                <br/>

                <p>Note also, with regard to the 5-year holding period, where
                SubCo is spun-off in a "nontaxable" (to shareholders) spin-off
                by ParentCo, and thus becomes an 80% or greater owned sub
                of GrandParentCo, its original acquisition date will "carry
                over" as a sub of GrandParentCo (or else it will become
                the acquisition date on which GrandParentCo acquired ParentCo).
                For example, let us say SubCo become an active business
                100% subsidiary of ParentCo in 2008, and GrandParentCo acquired
                100% control of ParentCo in 2017 (assuming ParentCo is also
                an active business since 2017). Then, in 2020, ParentCo spins
                off 100% of the SubCo stock, tax-free, to ParentCo's parent company,
                GrandParentCo.  The 5-year holding period by ParentCo is easily
                met, since it held 80% or more of SubCo since 2008. SubCo's
                acquisition date would (generally) carry over as a subsidiary of
                GrandParentCo, which now owns 100% of SubCo, but since ParentCo
                wasn't acquired by GrandParentCo until 2017, that later date
                becomes the deemed acquisition date of SubCo, rather than 2008
                (or the date, 2020, it was spun-off to GrandParentCo). In this
                example, GrandParentCo could not immediately do a nontaxable
                spin-off of the SubCo stock, but it would only have to wait for
                2 years, to 2022 (2022 - 2017 deemed acquisition date = 5 years),
                in order to be able to do a tax-free spin-off of SubCo.  Changing
                the facts a bit, if GrandParentCo had held 80% or more of ParentCo
                since 2006, then SubCo's (later) acquisition date of 2008 (by ParentCo)
                would "carry over" after it is spun-off by ParentCo to GrandParentCo.
                Under those facts, GrandParentCo could IMMEDIATELY, without
                waiting, do a tax-free spin-off of the SubCo stock. This is all
                a bit complex, but simply look at the bottom of the "Financial
                Profile" page for an 80% subsidiary that you wish to spin-off,
                to see what year it became an 80% "active business" subsidiary
                of the parent company. If that date was at least 5 years earlier,
                then a tax-free spin-off of the subsidiary may be possible, if
                all the other tax requirements are met.</p>
                <br/>

                <p>In a nontaxable spin-off, the parent company (usually)
                will not recognize any gain on the stock it spins off,
                and none of the shareholders recognize any taxable income,
                unless a shareholder receives less than 1% of the spun-off
                company, in which case the fractional percentage is
                cashed out, treated as immediately sold at the current
                value, with a zero tax basis, but is treated as a capital
                gain. The shareholder's tax basis for the stock received
                in a nontaxable spin-off is an allocated fraction of
                the recipient's tax basis in the shares of the parent
                company.</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <strong>TAX BASIS EXAMPLE:</strong>${' '} You own stock in ParentCo, in which
                    your "tax basis" is $150 million. ParentCo spins off stock of
                    SubCo to you, and immediately after the spin-off the ParentCo
                    stock has a total market value of $2,000 million and the SubCo
                    stock you received has a value of $1,000 million. The total
                    value of your ParentCo stock and the SubCo stock you received
                    is, therefore, $3,000 million. Since the SubCo stock is worth
                    1/3 of the total value, its tax basis in your hands would be
                    1/3 of the $150 million basis you had in ParentCo, or $50
                    million, and your basis for the ParentCo shares would be
                    reduced to $100 million.  Thus, your total tax basis is
                    still $150 million, but your investment has been split
                    into two companies, so your tax basis has to be allocated
                    between the two companies' stocks, in proportion to their
                    relative values.
                </blockquote>
                <br/>

                <p>Some "nontaxable" spin-offs are not entirely nontaxable.
                If ParentCo has a negative tax basis, or
                ${helpLink('glossary_XCESS', 'excess loss account')} for
                the stock it owns in SubCo, any spin-off that reduces ParentCo's
                ownership of SubCo below 80% will trigger the "recapture" of
                the excess loss account (as taxable income), either immediately,
                or fairly soon after the spin-off occurs. This is true even if
                the spin-off is of 80% or more of the SubCo stock, and otherwise
                qualifies as nontaxable. Thus, in such a case, stockholders
                of ParentCo will not be taxable on the stock they receive in
                a "nontaxable" spin-off, and the amount of gain the parent
                corporation must include in taxable income is limited to the
                amount of the excess loss account that must be recaptured as
                taxable income.</p>
                <br/>

                <p>For example, if the stock of SubCo has an excess loss
                account (a tax basis of $-400 million in the hands of ParentCo),
                but is worth $10,000 million, ParentCo would have to report
                a taxable gain of $10,400 million in a taxable spin-off, but
                only $400 million, the excess loss account amount, in a
                "nontaxable" spin-off.</p>
                <br/>

                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <strong>PLANNING TIPS:</strong>${' '} Doing a spin-off of a subsidiary
                    that is losing money currently, but which you don't want
                    to sell, can be a good way to retain ownership of it, but
                    will stop its losses from harming the reported income of
                    its parent company. For example, if you own 100% of
                    (profitable) ParentCo, and ParentCo owns 80% of SubCo,
                    which is reporting losses (perhaps because it is spending
                    heavily on R & D or marketing), and thus is dragging down
                    ParentCo's results, consider spinning off all 80% of SubCo
                    in a nontaxable spin-off. After the spin-off you will own
                    a slightly shrunken but more profitable ParentCo and will
                    now directly own 80% of SubCo. The fact that SubCo is losing
                    money will not affect you directly, when you hold its stock
                    as an individual player (though, of course, its stock value
                    may decline or it may become bankrupt and worthless if the
                    losses continue). Once the losses stop, if you turn SubCo
                    around (due to heavy R & D spending, for example), you
                    could then contribute its stock back to ParentCo as a
                    nontaxable ${helpLink('chap07_VII(B)(2)', 'capital contribution')}
                    (if you own 100% of ParentCo).
                    <br/><br/>

                    <p>Another use of spin-offs is to take the place of
                    mergers or cash buy-outs (and save on merger expenses).
                    For example, assume Company A owns 100% of Company B,
                    which owns 80% of Company C. You would like for Company
                    A to own the Company C stock directly, but Company B will
                    have a big taxable gain if A buys the C stock from B.
                    Or, if A merges with C, there will be merger fees to
                    pay. Instead of either of those approaches, consider
                    simply having Company B spin off its 80% holdings of
                    C in a tax-free spin-off, after which Company A will
                    then own 80% of the C shares directly, without incurring
                    any merger fees or taxes.</p>
                    <br/>

                    <p>A spin-off can also be a useful tactic where you
                    control Company A, which is saddled with ongoing losses
                    from asbestos litigation or from "Superfund" (environmental
                    clean-up) costs that are devastating the company. If
                    Company A has a large and profitable subsidiary, Company B,
                    you may want to spin-off all of the stock of Company B (if
                    allowed) before Company A is bankrupted. Once you have
                    extracted A's valuable asset, the stock of B, then you can
                    get rid of the A stock by selling it (or better yet, by
                    merging it with a stock of a competing player and then
                    selling it).</p>
                </blockquote>
                <br/>

                <p>Certain other tax-free transactions do not affect a company's
                5-year holding period under the spin-off rules. For example,
                if Company A owns 100% of B and B owns 80% or more of C, and
                Company A drops 80% or more of the Company C stock down into B
                as a capital contribution, C's 5-year (or less) holding period as
                an 80%-owned active business will not be affected. The same is
                true if A owns 100% of B, which owns 80% or more of C, and B goes
                through a nontaxable liquidation, so that the C stock is
                distributed tax-free up to A in the liquidation.</p>
                <br/>

                <p><strong><u>NOTE:</u></strong> The "Spin-Off Subsidiary" button will not
                appear on the "FINANCING" Menu, if the current
                ${helpLink('chap03_III(A)', 'Transacting Entity')} is you, the
                player, since only a corporation may do a spin-off to its
                shareholders in Wall $treet Raider (or in real life).</p>
            </div>
        </div>
    </div>`;
}
