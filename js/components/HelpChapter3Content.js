import { html } from '../lib/preact.standalone.module.js';

export default function HelpChapter3Content({ helpLink }) {
    return html`<div>
        <h2><u>FAQ'S (FREQUENTLY ASKED QUESTIONS)</u></h2>
        <br/>
        <p>The following FAQ's will answer a number of general questions about
Wall $treet Raider, if you are new to this simulation.</p>
        <br/>

        <div id="chap03_III(A)">
            <h3><strong><em>A. WHAT IS MEANT BY THE "ACTIVE ENTITY" AND "TRANSACTING ENTITY"?</em></strong></h3>
            <br/>
            <p>At any time during a Wall $treet Raider game, the program is focused on one
player (which can only be the player whose turn it is at the moment) or on
one corporation. That player or corporation is the "Active Entity," and the
name of the currently selected Active Entity is always shown in the box on the
main menu screen, just under the words "Active Entity Selected."</p>
            <br/>
            <p>Various research-related or other buttons on various menus, such as "List
Portfolio," "Financial Profile," "Research Report," "List Shareholders,"
"List Options," "Credit Info," "Name Change," or "Diagram of Holdings"
buttons, will bring up information for the current "Active Entity" when pressed,
so you do not need to select the same company or entity each time you want to
view a Financial Profile, for example, or perform some function like borrowing
or repaying a loan or doing some other type of transaction. However, the
various transaction functions can be used only if the "Active Entity" is one
that you control. (Obviously, you, the player, "control" your own actions, but
to control a corporation, you, or entities you control, must own at least 20%
of its stock. For more on what constitutes "control" of a corporation in
Wall Street Raider, see the ${helpLink('chap03_III(G)', 'FAQ')} on that topic.)
You don't need to control the "Active Entity" you select in order to do
research on it, however, such as when you are trying to decide whether you
should invest in that company.</p>
            <br/>
            <p>Wall Street Raider also uses the concept of the "Transacting Entity," which
is the same as the "Active Entity" if the Active Entity is you, the player, or
is a company you control. If the "Active Entity" is a company you do NOT
control, the "Transacting Entity" is whatever entity controlled by you (you or
one of your companies) that was most recently the "Active Entity." This
distinction shows up when you click on any of the transactional menus on
the main screen -- the six buttons in the "Transactions" grouping or the
the "Misc. Menu" button in the "Other" grouping of buttons. For example,
if you select ABC, a company you control, as "Active Entity," and then
select XYZ, a company you do not control as "Active Entity," then ABC
remains as the "Transacting Entity."</p>
            <br/>
            <p>Thus, if you click on any of the seven transactional menu buttons, any
of the actions you select from one of those menus will be performed for
the "Transacting Entity," ABC, and not for the "Active Entity," XYZ, since
XYZ is not a company you control -- so you can't make it do transactions.
However, if you change the "Active Entity" back to ABC, which you control,
then it remains as the "Transacting Entity" as well as becoming the
"Active Entity."</p>
            <br/>
            <p>Note that in Versions 9.0 and later, the "Active Entity Selected" box
on the main screen now contains an item, "Acting Now," that shows the
name or stock symbol of your controlled company that is the Transacting
Entity, or shows your name if you are the Transacting Entity. (If your
name is too long, it will show "Me" instead of your name.)</p>
            <br/>
            <p>Click on that name or stock symbol, and that company (or you)
immediately becomes the "Active Entity" as well as the "Transacting
Entity." This is handy, in case you are ready to do a transaction
for that entity, but first want to go back for a moment to look at
its financial profile, for example, which you can now do with one
mouse click, instead of having to enter the company's stock symbol.</p>
            <br/>
            <p>The Entity Info Menu on the main screen, when you click on it, will
only display information based on the current "Active Entity," and the
"Transacting Entity" is not relevant for that menu or for the various
research buttons that are shown in the "Quick Search Function" grouping
of buttons at the bottom of the main screen.</p>
            <br/>
            <p>Thus, to summarize: The informational or research buttons or menus
on the main screen show information relevant to the "Active Entity,"
while the transactional menu buttons (and "Buy Stock" and "Sell Stock"
buttons) are for performing actions by the "Transacting Entity." The
"Active Entity" and the "Transacting Entity" are the same entity, unless
the "Active Entity" is a company that you do not control. (If the currently
selected Active Entity is a corporation that you do not control, the textbox
on the left side of the pop-up transactions menu will warn you that you don't
control that company, and that you cannot make it engage in a transaction,
except when it is an ETF whose assets are managed by an insurance company
or securities broker that you control.)</p>
            <br/>
            <p>This may all seem a bit convoluted, but is designed to save you keystrokes
and clicks. For example, let's say you control ABC Company, and you select
it as the "Active Entity." After looking to see how much money or credit
line it has, you decide you want ABC to make an acquisition, so you do some
research and look at several possible target companies, selecting each, in
turn, as the Active Entity. Then you go to the "BUY / SELL" transactions menu
to have ABC Company buy XYZ. When the BUY / SELL transactions menu appears,
you will see that the entity that is ready to do the acquisition is shown as
ABC Company -- so you don't have to go back and re-select ABC as the
Active Entity before you have it buy up the stock of XYZ.</p>
            <br/>
            <p>In short, Wall $treet Raider remembers the last "Active Entity" you selected
(the "Transacting Entity") that you controlled (and still control), and makes
it easy for you to have it do a transaction. (Of course, while you're in a
Transactions Menu, if you decide you want to have another entity you control
do a transaction, you can always use the "PLAYER" or "MY CORPS." buttons on
that Menu dialog window to quickly change the Active Entity to you, the player,
or to any corporation you control.)</p>
            <br/>
            <p>The program will attempt to "read your mind" when you click on a
transaction button to buy or sell stock or corporate bonds, do a merger,
file an antitrust suit against another company, or do various harassing
transactions, such as filing a harassing lawsuit or starting a rumor
campaign. The input box for entry of the stock symbol for the "target"
company will usually contain, as the default entry, the stock symbol of the
last company you selected as "Active Entity," if it is not the current
"Active Entity," or else the stock symbol of the currently selected
"Active Entity" if it is a company that is not under your control.
If the default stock symbol is the one you wanted to enter, just click
on "OK" to enter it and begin the transaction.</p>
            <br/>
            <p>Thus, you can select the entity (yourself or a company you control) that
you wish to have do a transaction, such as buying stock, and then do some
research until you find a stock you like, say XYZ Corp, and view research
reports or other information on XYZ. Then you can just click on the BUY / SELL
transactions menu button and click on "Buy Stock" on that menu (or, as a
shortcut, simply click on the "Buy Stock" button on the main screen) and the
stock selection input box that pops up will automatically show "XYZ" as the
default stock symbol, so you can then just click on "OK" to proceed with buying
the stock of XYZ. The program cannot always "read your mind," but you will
find it often seems able to.</p>
        </div>
        <br/>

        <div id="chap03_III(B)">
            <h3><strong><em>B. HOW DO I SELECT AN "ACTIVE ENTITY" OR "TRANSACTING ENTITY"?</em></strong></h3>
            <br/>
            <p>There are several ways:</p>
            <br/>
            <p><u>(1) ENTER A STOCK SYMBOL.</u> If you know a company's stock symbol,
type it into the "Stock Symbol" text box and click on the "Go" button
next to it, or press the [ENTER] key after typing in the symbol. (As in
the older DOS versions of Wall $treet Raider, you can enter a company's
number, from 11 to 1600, instead of a stock symbol, but company numbers
are not listed anywhere in this Windows version, except when you bring
up a company to edit its name or stock symbol in the "Customizer" utility
program.)</p>
            <br/>
            <p><u>(2) CLICK ON THE "SELECT CORP." BUTTON.</u> After you click on
this button, enter the stock symbol (if you know it) in the "Enter
Stock Symbol:" box, in the small dialog box that pops up. If you don't
know the symbol, click on the "Lookup" button on that dialog box, to
bring up a drop-list of all currently-existing companies (usually over
1,000) in the current game, listed alphabetically, and click on the
desired company to select it. Note that, when you click on the "Lookup"
button, rather than taking the time to scroll through the drop-list, you
can simply begin typing the first few letters of the company's name, if
you know it.</p>
            <br/>
            <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
            <p>For example, if you are looking for the stock symbol for Hecla Mining,
just start typing the letters of "Hecla" -- by the time you have typed
"HEC," the name and symbol of Hecla Mining will have appeared in the
drop-list box, and you can then click on "OK" at that point to select
Hecla (symbol "HCL") as the ${helpLink('chap03_III(A)', 'Active Entity')}.</p>
            </blockquote>
            <br/>
            <p><u>(3) PICK FROM VARIOUS LISTBOXES.</u> When you click on certain
information command buttons on the main screen, such as "List Portfolio,"
you can double-click on any company listed there to select it. For
example, if you want to pick a company you own as the ${helpLink('chap03_III(A)', 'Active Entity')},
click on "List Portfolio" to show a list of stocks and bonds you own
at present, and just double-click on the name of the company you
want to select. Or if you are using the "Finan. Profile" to view a
company's financial profile, and you see the name of its bank or
another company name listed there, simply click on the name to select
that corporation as the ${helpLink('chap03_III(A)', 'Active Entity')}.</p>
            <br/>
            <p><u>(4) CLICK ON "SELECT PLAYER" BUTTON TO SELECT PLAYER.</u> If a
corporation is the currently selected ${helpLink('chap03_III(A)', 'Active Entity')}, and you want to select
yourself (the player) as the Active Entity (and Transacting Entity),
just click on the "Select Player" button on the main screen or on any
of the research or transactions menus.</p>
            <br/>
            <p><u>(5) CLICK ON "MY CORPS" BUTTON TO SELECT A COMPANY YOU CONTROL.</u> The
program includes several "My Corps" buttons, on the main screen and on various
transactions and research menus. Clicking on "My Corps" will generally cause a
list of all the companies you control to be displayed, as well as certain items of
information about each. Pick any of the companies from the list displayed to make that
controlled company the ${helpLink('chap03_III(A)', 'Active Entity (and Transacting Entity)')},
so it can do transactions or you can see research information about it or its
industry group.</p>
            <br/>
            <p><u>(6) SELECT A COMPANY FROM THE "STREAMING STOCK QUOTES LIST."</u> If a
company's name is shown on your "Streaming Stock Quotes List," click on the
"Select" button at the top of the list, which will cause a "pick list" of
all the stocks on the streaming quotes list to be displayed in a box, from
which you can pick any such company as the ${helpLink('chap03_III(A)', 'Active Entity')} by double-clicking on
its name or highlighting its name and then clicking on the "OK" button.</p>
            <br/>
            <p><u>(7) CLICK ON THE "CONTROLLED BY" BOX IF A COMPANY NAME OR STOCK SYMBOL
APPEARS THERE.</u> If a company name or stock symbol appears in the "Controlled
By:" item in the "Active Entity Selected" area on the upper left part of the
main W$R screen, you can simply click on the name or stock symbol to select
that company as the new ${helpLink('chap03_III(A)', 'Active Entity (and Transacting Entity, as well)')}.</p>
            <br/>
            <p><u>(8) CLICK ON THE "ACTING NOW" ITEM AT THE BOTTOM OF THE "ACTIVE ENTITY SELECTED" BOX.</u>
If your name (or "Me") or a company name or stock symbol appears after the words "Acting Now..."
in the "Active Entity Selected" box, that is the entity that is currently ready to do
transactions, but if it is not also the currently selected "Active Entity," just click on
the name or symbol to make it (or you) also become the Active Entity, such as when you need
to take a quick look at that entity's financial profile before it buys something.</p>
            <br/>
            <p><u>(9) CLICK ON THE "SELECT XYZ" BUTTON ON THE MAIN SCREEN.</u> (Where XYZ is the
stock symbol of the company you wish to select as the Active Entity). This button
will almost always show the stock symbol of the corporation that was the most recent
previous Active Entity. Thus, if you have selected XYZ Corporation as the Active Entity,
using any of the other methods mentioned above, and you then select either yourself or
a different corporation as the new Active Entity, that button will read "Select XYZ,"
so that you can quickly change back to it as Active Entity again, by simply clicking
on that button. The only times this button will not display a stock symbol, as in
"Select ABC" or "Select XYZ" is at the start of a new game, or when the company
whose symbol was displayed on the button goes out of existence, due to liquidation
in bankruptcy or voluntary liquidation. In that case the button will read "Select
Last" and will not be functional until you have selected another company as Active
Entity, and it then ceases to be the Active Entity when either you or another company
is selected as Active Entity.</p>
        </div>
        <br/>

        <div id="chap03_III(C)">
            <h3><strong><em>C. HOW LONG DOES MY TURN LAST?</em></strong></h3>
            <br/>
            <p>On each turn, you can do up to 5 transactions from the various Transactions
submenus (Buy / Sell, Financing, Management, and Other Trans.), before your turn
ends. However, to speed things along, 2 of your unused transactions are
deducted in each calendar quarter, one at the mid-point and one at the end
of each quarter.</p>
            <br/>
            <p>Of course, if you are feeling rushed, you can always
turn off the stock and news tickers for a while, in order to do as many
transactions as you need to do on your turn, before turning the tickers
back on. However, some small increment of time elapses each time you
click on any feature, even if the ticker is turned off. Time marches on,
even if slowly.</p>
            <br/>
            <p>There is an "alternative," somewhat more challenging version of W$R,
available to registered users upon request, which allows up to 10 plays
per turn, but each (human) player's turn lasts for exactly one month of
game time. That prevents you, as some players are able to do, from doing
hundreds of transactions in the first two or three months of a new game,
taking over most of the industries in the game at lightning speed and
becoming trillionaires, which ceases to be realistic. In the alternative
version, you can do 10 plays on your turn, but once you do so, you have
to let the ticker run to the end of the current month before it is your
next turn (or the next human player's turn, if there are two or more
players other than computer players). This also gives the computer
player(s) more frequent turns, so you can't get quite as far ahead of
them so quickly at the start of a game.</p>
        </div>
        <br/>

        <div id="chap03_III(D)">
            <h3><strong><em>D. WHAT DO THE NUMBERS MEAN IN THE "My Balance Sheet" SECTION OF THE MAIN SCREEN?</em></strong></h3>
            <br/>
            <p>The 5 text boxes in the "My Balance Sheet" section provide a quick overview
of the financial situation for the current player, updated every few
seconds. Think of it as a simplified personal financial statement. (Click
on "Finan. Profile" to see a more detailed financial statement for your
personal holdings, any time you are the ${helpLink('chap03_III(A)', 'Active Entity')}.)</p>
            <br/>
            <p>The top box in the balance sheet section shows your cash (or, actually,
your non-interest-bearing bank demand deposits). "Other Assets" gives the
total market value of all your stocks, government bonds, and corporate
bonds. The middle box shows your total assets, and the fourth box shows
how much you owe your bank lender, if anything, and the bottom box shows
your net worth. All amounts are shown in either U.S. dollars or whatever
other currency you may have selected, in millions (or in billions, for
some currencies such as Japanese Yen, Korean Won, Indian Rupee, or
Icelandic Krona).</p>
            <br/>
            <p>For more details on "My Balance Sheet," ${helpLink('chap05_V(C)(3)', 'click here')}.</p>
        </div>
        <br/>

        <div id="chap03_III(E)">
            <h3><strong><em>E. WHAT IS THE PURPOSE OF THE "Industry Group Selected:" ITEM AND DROP-LIST ON THE MAIN WALL $TREET RAIDER SCREEN?</em></strong></h3>
            <br/>
            <p>Each time you select a different (corporate) ${helpLink('chap03_III(A)', 'Active Entity')},
the name of that company's industry will instantly appear just beneath the
"Industry Group Selected:" label on the main screen. Thus, if you
select LTV Corporation (in the steel industry), its industry group
is automatically selected for you. Then, when you click on
"${helpLink('chap10_X(E)(3)', 'Industry Projection')}" or
"${helpLink('chap10_X(E)(4)', 'Industry Summary')}" on either of the
research menus (Entity Info or General Menus), you will see industry
projections or summary financial data for the steel industry, without
having to "tell" the software the industry for which you want to see
information.</p>
            <br/>
            <p>However, if you want to view information for a particular industry,
without first selecting a company in that industry as ${helpLink('chap03_III(A)', 'Active Entity')},
you can just click on the drop-list where the name of the currently selected
industry is shown, and pick any of the 71 industries from that list. When
you select an industry group in this manner, the "General Research Menu"
will show data for that industry if you select an item such as an
"Industry Projection" or "Industry Summary," but the "Entity Research
Menu" will continue to show industry data for the industry to which the
currently selected Active Entity belongs. Also, except for the Banking,
Insurance, Holding/Trading Company, and Exchange-Traded Fund industries,
you can click on the "${helpLink('chap10_X(E)(2)', 'Industrial Growth Rates')}"
button on the "General Research Menu" to see industry growth projections
for all of the 67 other industrial groups, and double-clicking on any one
of them, or any of the 4 financial industries listed, will make it the "Industry
Group Selected," (again, only for purposes of the General Research Menu).</p>
        </div>
        <br/>

        <div id="chap03_III(F)">
            <h3><strong><em>F. HOW REALISTIC IS WALL $TREET RAIDER, COMPARED TO THE REAL FINANCIAL WORLD?</em></strong></h3>
            <br/>
            <p>Very realistic, for the most part. The author has had several careers
since graduating from Harvard Law School over 50 years ago, as a tax attorney
in a large law firm, as a tax CPA working on giant mergers with one of the
Big Four ("Big Eight" back then) CPA firms, as an economist with a national
economics consulting firm in Washington, D.C., as a million-selling author
of a series of business books in the 1980s and 1990s, and as a lifelong
active investor in the stock, bond, and option markets. The author has drawn
extensively on his background and experience in all those fields to make
Wall $treet Raider as realistic and enjoyable to use as possible.</p>
            <br/>
            <p>Wall $treet Raider contains a number of somewhat humorous and (often)
extreme "ethical choices" that pop up when "Cheat Mode" is turned on,
most of which may seem to go a bit overboard -- but even those are almost
entirely based on news accounts of actual skulduggery in the real world,
as are various disaster scenarios that occur in almost every game. Other
futuristic disaster scenarios may also seem to be pretty extreme, but as
the unpleasantness of 9-11-2001 or the 2020 "pandemic" so rudely informed
us, as well as the 2004 tsunami that killed nearly a quarter million people
in Asia, it's a crazy and often dangerous world we live in.</p>
            <br/>
            <p>"Under the hood," the internal logic of Wall $treet Raider is as realistic
as we can humanly make it, based on our experience and knowledge of corporate
finance, accounting, and business law. For example, in Wall $treet Raider we
actually keep 3 sets of financial records for each of the 1590 companies -- its
"real" (cash) transactions and earnings, its taxable earnings, and the reported
earnings, which may include non-cash items like "equity" in earnings of a
subsidiary or amortization of "goodwill" from asset purchases, and may exclude
cash income items such as dividends a company receives from subsidiaries from
reported income and all or partly from taxable income.</p>
            <br/>
            <p>Over several years, we became aware that some players were able to amass
hundreds of trillions of net worth (or more), mainly by doing gigantic profitable
trades of derivatives, such as options, futures, and interest rate swaps, and
that the limitations imposed by the simulation were unrealistically high. Thus,
for example, a player might buy options on many times more than 100% of the
total amount of stock issued by a company, which never happens in the real
world. We fixed that by limiting the total options positions of a particular
type by all entities on a stock, such as shorted puts, to 100% of the stock
(20% for long calls).</p>
            <br/>
            <p>More recently, it became apparent that some players were able to manipulate
the entire stock index by accumulating massive positions in stock index
futures, and then taking hugely profitable positions in commodity futures or
interest rate swaps, such as buying up futures on thousands of times as much
silver as is produced in the entire world in a year, which then drove
up the stock index, increasing the value of the index futures.... and you get
the picture.</p>
            <br/>
            <p>Thus, we have now put in some more rational limits on swaps and futures,
limiting a player's (and his companies') combined positions in futures on
a particular commodity to 10% of that commodity's real world annual production
as of 2017 (or 5% of oil production). Similar, more realistic limits have also
been put in place on buying physical commodities, based on estimated real-world
storage of grain, oil, etc., and on the size of interest rate swaps positions.</p>
            <br/>
            <p>Wall $treet Raider even provides a somewhat simplified version of some
of the most complex accounting known to man -- consolidated tax return
reporting, where all 80% subsidiaries (and their 80% or greater subsidiaries)
pay income tax on a consolidated basis. Of course, this isn't <em>totally</em>
realistic, since U.S. tax law doesn't generally let a U.S. company file
consolidated tax returns with foreign subsidiaries, and vice versa, and not
all countries allow any such consolidated tax reporting. But Wall $treet Raider
does allow it, as long as a single company owns at least 80% of the stock of
any other company, regardless of nationalities.</p>
            <br/>
            <p>In Wall $treet Raider, we have chosen to include a proportional share of the
earnings or losses of any (20% or greater) subsidiary in the earnings of the parent
corporation. This is similar to real-world "equity method" accounting, except
that we do the same even with a 100% subsidiary -- in the real world, all the
financial data of a 100% sub would be combined with the parent's data, which
Wall $treet Raider does not attempt to do, as that gets to be far too complex
where companies are constantly being gobbled up and spun off. Wall $treet Raider
just combines the reported income of the parent and its subs for the parent's
reporting of earnings (and shows a sub's earnings separately for it, something
not usually done for a consolidated subsidiary in the real accounting world).</p>
            <br/>
            <p>Also, in our "financial profile" balance sheets in Wall $treet Raider, we
had long shown investments in stocks and bonds at their current market value, rather
than at cost, which is a departure from generally accepted accounting practices,
but is an approach which we felt made the "profiles" more useful to players.
However, we have re-thought that in recent releases, and now show bonds (but
not stocks) at their adjusted cost, rather than market value, except for bonds
that are in danger of not being paid off. We found that calculating banks' net
worth based on the market value of the bonds, which could fluctuate violently
with major changes in interest rates, was unrealistically causing banks to
frequently go bankrupt, as well as insurance companies, though much less
often for the latter. Adopting the real world valuation rules (for bonds,
at least) for banks and insurance companies has made the performance of those
types of companies more stable while also being more realistic.</p>
            <br/>
            <p>However, as in real world personal financial statements for individuals,
we show a player's stocks and bonds at their current market value on the
player's Financial Profile.</p>
            <br/>
            <p>We think the stock pricing algorithm in this version of Wall $treet
Raider comes as close to real world price behavior as we are likely to get --
it takes into account a huge number of factors, including general market
conditions, economic trends, interest rates, company history and future
prospects, credit worthiness of the company, numerous random factors, and much
more. The latest releases even "remember" recent large purchases or sales of
any stock, which will tend to hold up or depress the price for a while, although
the effects of the buying or selling that moved the stock eventually wears off.
The source code for updating a stock's price takes up about 15 pages when printed
out, and is so complex, even WE don't really understand it any more -- but after
endless tweaking, it generates stock prices that seem to closely mimic the
mostly unpredictable behavior of stock prices in real world markets. In our
humble opinion, at least.... You may disagree.</p>
            <br/>
            <p>Finally, while the tax rules in Wall $treet Raider are generally similar
to U.S. tax laws, we have treated capital losses of corporations as fully
deductible for tax purposes (under U.S. tax laws, corporate capital losses
can only be deducted against capital gains). For individual players, their
income tax rate on capital gains is always lower than their "regular" income
tax rate on dividends, interest, CEO salary, profits on interest rate swaps,
etc. Capital losses on stocks, bonds, options, and commodities don't distinguish
between "long-term" and "short-term" in this simulation, and are only deductible
against capital gains, but can be carried over indefinitely, until the player
can use them (if ever) to offset capital gains.</p>
        </div>
        <br/>

        <div id="chap03_III(G)">
            <h3><strong><em>G. WHAT IS MEANT BY "CONTROL" OF A COMPANY IN W$R AND THIS MANUAL?</em></strong></h3>
            <br/>
            <p>In Wall $treet Raider, if you "control" a company, you get to determine its
policies, such as dividend payout, how fast it expands its capital investments,
whether it floats stock or bonds to raise capital, or borrows from the bank,
whether it invests in other companies, pays you a salary as its CEO, and
much more. Thus "control" is an important concept in Wall $treet Raider, as
in real corporate life.</p>
            <br/>
            <p>To gain control of a company in Wall $treet Raider, you, or you and one or
more companies that you control, must own, in total, at least 20% of the
company you seek to control, and your bloc of shares in it must be larger
than the amount of its stock held by any other player or company. For example,
if you own 100% each of the stock of companies A and B, you control both of
them -- no doubt about it. However, if you also own 10% of Company C, and
your companies A and B each own 5% of Company C, that combined ownership of
20% of C will be enough to give you control. However, if some other company
or player owns 21% of Company C, it, or he or she or it, and not you, will
control Company C.</p>
        </div>
        <br/>

        <div id="chap03_III(H)">
            <h3><strong><em>H. WHAT IS CIRCULAR STOCK OWNERSHIP, AND IS IT PERMITTED?</em></strong></h3>
            <br/>
            <p>An example of circular stock ownership would be where Company A owns
75% of the stock of Company B, which owns 51% of Company C, which owns 90%
of Company A. Visualize that setup as being like a snake that has swallowed
its own tail. This is permitted (briefly) in Wall $treet Raider, so you
may be able to control several companies that way, with interlocking stock
holdings, even if you reduce your direct investment to as little as 1% in
one company, and still retain your "control" of the whole circular chain of
companies. For a while. However, Wall $treet Raider is crafty, and thanks
to a particularly hairy and complex algorithm, it will soon find such a
circular situation and force one of the companies to sell its holdings in
another, to break up the chain, at which time you will lose control. So,
yes, circular ownership is permitted, but not for long.</p>
            <br/>
            <p>Version 8.0 added new algorithms that also look for circular equity
holdings, such as where a subsidiary buys call options on its parent
company, so that if the stock of the sub appreciates, it will tend to
make the stock of the parent also rise, which will make the calls held
by the sub appreciate, increasing the sub's stock price, which increases
the parent's stock value again, and so on. Such circularity is now
prevented, to avoid having endless loops, except for small stock
positions.</p>
        </div>
        <br/>

        <div id="chap03_III(I)">
            <h3><strong><em>I. WHAT ARE "MARGIN CALLS" AND NET WORTH?</em></strong></h3>
            <br/>
            <p>In Wall $treet Raider, as on Wall Street, you can buy stocks "on margin,"
which generally means that if you buy $100 worth of stock, you can borrow
$50 of the purchase price from your broker (or bank). In Wall $treet Raider,
all such loans are from your bank lender. This gives you greater "leverage,"
which is wonderful if your stock goes up, not so wonderful if your stock
goes down. In fact, in this simulation (similar to real Wall Street rules),
if your net worth falls to less than one-third of your bank loan ("margin
debt"), you will get a "margin call" from the lender, which means that you
have to pay down enough of your debt to restore the 3-to-1 ratio of margin
debt to net worth. That's not a big problem, if you have enough cash on
hand to meet the "margin call" (debt repayment). However, if you don't have
enough cash, you'll notice that you have a negative cash (DDs -- your bank
account demand deposit) balance on your balance sheet, shown on the lower
left-hand corner of the main Wall $treet Raider screen. But not for long.
Like your real world broker or banker will do, you will be forced to sell
TBills (first), bonds (second) or stocks or commodities (if you have no
bonds) until you have raised enough cash to eliminate your "overdraft"
(negative cash balance) at the bank.</p>
            <br/>
            <p>Of course, any such forced sale of stocks you own will tend to further
depress the market price of that stock you are selling.... Which may
often trigger another margin call, as your net worth falls to less than
33 1/3% of your margin debt again.... Requiring more stock to be sold....
Get the picture? That's why it is very risky to buy stocks on margin,
using a lot of borrowed money, either in the real world or in this
simulation. You can be wiped out by a temporary dip in the stock, even
if the company is quite solid, since stock prices do tend to fluctuate.</p>
            <br/>
            <p>The program will first sell any T-bills you own, then any bonds you
own, if you have a margin call, in order to raise cash. Then, if you
only have one stock, it will begin selling off that stock, 1% at a time,
until enough cash is raised to eliminate your negative cash balance. Or,
if you still have commodity futures or physical commodities, or options,
you may first be forced to sell those, or buy back shorted stocks,
options or futures.</p>
            <br/>
            <p>When you received a margin call in early versions of W$R, the
program would randomly select a stock to sell, if you owned more than
one stock directly. In the more recent versions, if you own more than
one stock and you receive a margin call, and will be forced to sell
stock to raise cash, you are given a choice of selecting which stock to
sell, or else you can let the program decide on which stock or stocks
will be sold, randomly. This courtesy is extended only if the margin
call comes when it is your turn -- otherwise, if it is another player's
turn at the time, the program will sell your stocks for you, without
bothering to ask which ones are to be sold. Tough luck.</p>
            <br/>
            <p>Note that in Wall $treet Raider, you can usually only borrow an
amount equal to one times your "adjusted net worth," and have to only
maintain an "adjusted net worth" equal to one-third of the debt. So
if you start a game with $100 million of cash, and use it to buy $200
million of stock, by borrowing $100 million from the bank, you will
get a margin call if the stock's value falls by more than one-third,
so that your stock is worth less than $133.3 million (in which case
you would still have debt of $100 million, but net worth of $33.3
million or less).</p>
            <br/>
            <p><strong>"Adjusted net worth,"</strong> which is what the simulation uses when
computing lines of credit, credit ratings, and whether a margin
call is required, is the same as net worth, except when you own
put or call options. In that case, the options are assumed to have
no value if they are "out-of-the-money," for purposes of calculating
your "adjusted net worth." If they are "in-the-money," only their
intrinsic value (the difference between the stock's price and the
strike price) is counted as part of your adjusted net worth. Thus,
for a $30 (strike price) call option that has a market value of $9
when the stock is at $35, only $5 (the intrinsic value) is counted
as part of your adjusted net worth -- the $4 of time value is not
counted unless or until you actually turn it into cash by selling
the option. However, if you are short puts or calls (other than
puts covered by a short position in the underlying stock or calls
that are covered by a long position in the stock), the entire
market value of the shorted "naked" options is counted as a
liability, decreasing your net worth or adjusted net worth.</p>
            <br/>
            <p>In addition to margin requirements on any bank loans you owe,
Wall Street Raider over the years has added additional, separate
margin requirements, for short sales of "naked" options, for a
separate short sale margin account for any short sales of stocks
that you make, and a separate commodity broker's margin account
you must maintain, if you trade commodity futures or stock index
futures.</p>
            <br/>
            <p>As you might guess, if you are buying stocks or bonds
on margin, doing short sales of stocks and naked options, and
taking futures positions, accounting for all of that is rather
complex, and you may be blind-sided by margin calls from your
banker, your short-sale brokerage account, or your commodities
broker account. In all cases, you are only going to get in
trouble if your net worth or "adjusted net worth" is declining,
however.</p>
            <br/>
            <p>These other margin requirements are discussed below.</p>
            <br/>
            <p>If you have naked puts and naked calls outstanding on the
same stock, only the greater of the put liability or the call
liability is counted for option margin purposes, to determine if
you can sell more puts or calls short, or if you meet the option
maintenance margin position -- to have adjusted net worth of at
least 30% of the options liability so computed. If your adjusted
net worth falls below the 30% maintenance margin for naked
options, you will be forced to buy back some or all of the
shorted options that are not covered calls or covered puts.</p>
            <br/>
            <p>The computation of your options liability for net worth
calculations is fairly simple -- the market value of the
shorted options is your options liability. However, a much
more complex calculation is done when determining your
"naked options" liability for margin requirement purposes,
involving several steps, so that your naked options
liability, used for computing options margin requirements,
may be somewhat less than merely the sum of the value of
all the options you are short:</p>
            <br/>
            <ul style="list-style-type: disc; padding-left: 24px;">
            <li>First the total short liability for puts is
computed for each stock on which you or a company
has sold puts short.</li>
            <br/>
            <li>Next, that amount is reduced to the extent you,
as a player, have a short position in the underlying
stock (corporations can't short stocks in W$R). If
the shorted puts on a given stock are fully "covered"
by a shorted stock position, the shorted put liability
for that stock is reduced to zero.</li>
            <br/>
            <li>Then the total call liability for "naked" calls
you or your company have sold short is determined,
and is then reduced to the extent of any "covered
calls" (where you or the company in question own
the stock that is being hedged by the shorted calls).</li>
            <br/>
            <li>Next, the short calls liability for each
stock that is subject to shorted calls (if any)
is compared to the short puts liability (if any)
on that stock. If you have both naked calls and
naked puts on a given stock, only the higher of
the naked call liability or the naked put liability
is taken into account and added to the total
naked options liability, to arrive at your total
naked options liability for option margin purposes.</li>
            </ul>
            <br/>
            <p>(These are some hairy calculations, but the software does
them all in a few nano-seconds.) The initial margin requirement
to sell a naked option is that your adjusted net worth must
exceed 50% of your naked option liability immediately after
completion of the sale, in the case of a player.</p>
            <br/>
            <p>Different initial and maintenance margin requirements
for options apply to corporations. Corporations may not
sell naked options that would create a naked options
liability, computed as described in the preceding paragraph,
more than 25% of the corporation's adjusted net worth, which
is the initial margin requirement for options sale transactions.</p>
            <br/>
            <p>The maintenance margin for naked options shorted by a
corporation is that the naked options liability must not exceed
50% of the corporation's adjusted net worth. If it does, the
corporation will be forced to buy back some of the naked
options until the liability is 50% or less of adjusted
net worth. In addition, if a corporation's credit rating
falls below "B," such as to "CCC" or lower, it will have
to buy back all naked options -- but not covered calls.
For example, if XYZ Corp. owns 10% of the stock of ABC,
and is short ABC call options on 10% or less of ABC's
stock, the calls are fully "covered calls" and wouldn't
have to be bought back to satisfy options margin rules.</p>
            <br/>
            <p>In Wall $treet Raider, if you have control of the lending bank,
you can initially borrow up to 2 times your adjusted net worth if
playing at Difficulty Level 2, or 3 times net worth if playing at
Difficulty Level 3 or 4, which gives you more rope with which to
hang yourself, essentially. While you might find the additional
borrowing power can be helpful, it is also MUCH riskier than if
you could only borrow up to 1 times net worth. (For example, if
you borrow fully up to 3 times your net worth, then ANY DECLINE
WHATSOEVER in the market price of your investments will immediately
result in a margin call.)</p>
            <br/>
            <p>There is an additional kind of stock margin call -- where
you have sold stock short, and your adjusted net worth falls to
less than 1/3 of the value of the shorted stocks. In that case,
money in the restricted "short margin account" will be used to
buy back enough stock, so that your adjusted net worth once again
exceeds the value of the shorted stocks. Of course, this will
drive up the value of the stocks you are forced to buy back, so
it will be necessary to contribute more cash to the short margin
account. (And, by the way -- your net worth will fall as you
drive up the price of the shorted stocks by buying some of them
back -- another vicious circle, which may trigger more short
maintenance margin calls of this type, or even may force the
other kind of margin calls described in the preceding paragraphs,
which force you to sell stocks or bonds you own.)</p>
            <br/>
            <p>When W$R implemented options trading, we also introduced
yet another kind of margin call and additional margin rules.
First, you should note that if you buy options (puts or
calls) and hold them "long," they may be quite valuable, but
are not counted as part of your net worth for purposes of the
margin requirements discussed above, unless they have some intrinsic
value -- meaning that options you own must be "in-the-money" to be
counted as having any value, and then only the intrinsic value is
counted, not any additional "time value." In other words, such
options are treated as having a reduced value, limited to their
intrinsic value (zero value if they are "out-of-the-money"), until
you actually turn them into cash by selling them. Thus, buying
puts or calls generally reduces your "marginable" net worth until
you sell the options, at which time your <em>adjusted</em> net worth
for margin purposes is increased to some extent by the sales proceeds
you receive.</p>
            <br/>
            <p>When you are buying options, it is assumed that the options will
have no initial "marginable" value. But to the extent the option is
"in-the-money" (<em>i.e.,</em> has intrinsic value, as opposed to
time value), its intrinsic value is counted <em>after</em> you buy
it for maintenance margin purposes (that is, for determining when you
will receive a margin call) and for computing your line of credit or
credit rating. Thus, you must generally be able to buy options for
cash, or by borrowing against the value of other assets you own.
However, when you view your portfolio after the purchase, it will
include the full value of any options you own, showing your "real"
net worth, and at the end of the game, any options you own will
count as part of your net worth in determining who won the game.</p>
            <br/>
            <p>The reason options are not "marginable" in the real world or in
this simulation is that they are very volatile assets, which can
become worthless in a heartbeat, based on a fairly small fluctuation
in the underlying stock. Thus, banks or other lenders, such as
stockbrokers, don't like to lend people money based on such ephemeral
"security." (But in this simulation, lenders do give you credit for
the intrinsic value (if any) of options you have purchased, for purposes
of computing your available line of credit and your credit rating,
and for deciding when you will receive a "margin call." In the real
world, your stockbrokers will treat any options you own as having
ZERO value for margin purposes.)</p>
            <br/>
            <p>If you own long option positions, and receive a margin call
that puts you in a cash deficit with no line of credit to borrow
against, your banker (the software program, in this case) will
immediately force you to sell off some or all of the options, if
the only assets you have left to sell are stocks and options.
It won't ask your permission -- it will just sell the options,
immediately. Selling off options will increase your adjusted net
worth, which will tend to prevent further margin calls by your
bank lender and options margin calls by your options broker.</p>
            <br/>
            <p>With the addition of futures trading on commodities and stock
index futures, you can now have a commodities margin account as
well, which involves MASSIVE and dangerous leverage. To buy or
short a futures contract, you only have to put up cash equal
to a 1% commission and deposit 5% of the "notional value" of the
contract with the commodities broker. For example, the notional
value of a futures contract on 1 million barrels of oil at $70
a barrel is 70 million dollars, so you would need to deposit
5% of that initially, or $3.5 million, plus the $0.7 million
broker's commission on the trade.</p>
            <br/>
            <p>The value of your futures contract is constantly "marked to
market," and if you begin to show a loss, you must deposit
more cash so that you cover the accrued loss in value and still
maintain the 5% margin requirement. On the other hand, if the
commodity moves in the direction you were betting (and hoping),
the accrued "profit" is added to your deposit, and immediately
is transferred to your bank account. Thus, as the value of a
futures contract fluctuates, money is constantly being added
to or taken from your bank account, to maintain the 5% of
value margin requirement with respect to your futures contract
positions.</p>
        </div>
        <br/>

        <div id="chap03_III(J)">
            <h3><strong><em>J. WHAT IS A "LINE OF CREDIT"?</em></strong></h3>
            <br/>
            <p>The amount you see as a player's or company's "line of credit"
in financial "profiles" is actually the player's or company's
<u>unused</u> line of credit from the lending bank -- that is, the
amount which the player or company in question can still borrow
(if any) from the bank at that moment. For more details,
${helpLink('chap04_IV(P)', 'click here')}.</p>
        </div>
        <br/>

        <div id="chap03_III(K)">
            <h3><strong><em>K. WHAT IS "CHEAT MODE" IN WALL $TREET RAIDER?</em></strong></h3>
            <br/>
            <p>As you may have noted, one of the menu items on the "SETTINGS" menu
of the main Wall $treet Raider screen is either: "Cheat Mode: ON" or
"Cheat Mode: OFF". The default, at the start of any new game, is "ON."
Click on this item to turn Cheat Mode on or off.</p>
            <br/>
            <p>If Cheat Mode is turned "ON," it means that, if you control one or
more companies, you may occasionally be presented with a memo from
your staff, asking you to decide on whether or not the company should
engage in certain less-than-honorable or downright illegal activities,
which can sometimes result in very quick profits. All you need to do
is make a "Yes or No" decision in such Cheat Mode scenarios. Sometimes,
if you engage in such activities, you will profit handsomely; other
times, your unethical actions may be discovered or have other unhappy
consequences. Sometime, the choices will be between taking an honorable
(and legal) stance, which can be very costly, or simply avoiding such
costs by doing the sleazy thing, so the choices are not always good
ones.</p>
            <br/>
            <p>If you would prefer not to be tempted to take such short cuts,
you can turn Cheat Mode "OFF," and try to get rich honestly, and by
shrewd investing, rather than by engaging in abhorrent or corrupt
activities. Being somewhat of a student of human nature, we know
most players will choose to "do the right thing." (Heh!)</p>
            <br/>
            <p>Note that having Cheat Mode turned "ON" will not disqualify you
as potential winner of the game. The only cheat that <u>will</u>
disqualify your final score is if you use the CHEAT MENU option to
add cash (up to $1 trillion U.S.) to your bank account.</p>
        </div>
        <br/>

        <div id="chap03_III(L)">
            <h3><strong><em>L. HOW DOES TIME PROGRESS IN THIS SIMULATION?</em></strong></h3>
            <br/>
            <p>Generally, time moves forward as earnings are calculated for
all the existing companies, one at a time. A calendar quarter
ends when all of the existing 1,000 to 1,590 companies have computed
their earnings for that quarter. When the stock ticker is moving,
time progresses fairly rapidly. However, even when you turn off
the stock ticker, you will note that the "news ticker" occasionally
moves, as you move among the various research menus or do transactions.
Each time you close a Menu, several companies earnings are computed,
and if "news ticker" items are generated, the news ticker will move one
tick for each such item. The same is true each time you complete (or
cancel) a transaction, when the stock ticker is turned off.</p>
            <br/>
            <p>Also, each time the "Computer" player takes a turn, 50 companies'
earnings will quickly be computed before your next turn can begin,
even though the stock ticker automatically halts when any player's
turn ends.</p>
        </div>
        <br/>

        <div id="chap03_III(M)">
            <h3><strong><em>M. IS THERE A "BACK DOOR" TO WALL $TREET RAIDER?</em></strong></h3>
            <br/>
            <p>Yes. If you are finding it hard to build up enough net worth to take
over large companies, Wall $treet Raider has long had an unpublicized "back
door" you could use to add money to your bank account. You merely have to
double-click on the Wall $treet Raider logo image on the main screen, and
a dialog box will pop up, asking you how much money you want to have added
to your account (once -- up to $1 trillion). (Or you can enter a negative
amount, if you want to bankrupt yourself, just to see how that feels....)</p>
            <br/>
            <p>Note that this "back door" only works if "Cheat Mode" is turned on.
Also, if you cheat in this manner, your ending score will be disregarded
as a possible "High Score." As you may have noted, you can click on the
"GAME OPTIONS" menu and select the "High Score" item at any time, to see
what the highest (legal) game score is for your copy of Wall $treet Raider.
Only a "score" -- ending net worth -- of over $100 million U.S. will be
recorded by the program as a "high score" or record net worth, and then
only if the game length was no more than 35 years. (An experimental,
999-year version of Wall $treet Raider is available, free of charge, to
any registered user, upon request to Ronin Software in case you were
wondering how you can play a game of longer than 35 years.)</p>
            <br/>
            <p>A "CHEAT MENU" pops up when you double-click on the W$R logo (or in
the newest versions, the Cheat Menu is also accessible from a CHEAT MENU button
on the main screen). The CHEAT MENU that will pop up has 3 items, the first one
being the "add cash" option, similar to prior releases. Using the "add cash"
option to add money to your bank account (up to $1 trillion U.S. or the
equivalent) will disqualify you as possible winner of the current game and your
final "score" will not qualify as an all-time record score.</p>
            <br/>
            <p>Three other cheats, two of which involve inside information, are now available on this menu
-- receiving advance notice of upcoming mergers or information on a surprising upcoming major
change in a company's earnings -- either for the better or for the worse. Buying (or shorting)
the stock after receiving the "leaked" insider information is usually quite profitable. In
addition we have also added another "cheat" that allows you to turn off the simulation's
civil antitrust lawsuits or government antitrust restrictions and criminal fines, or both
the civil lawsuits and government enforcement, to thus create a "no-holds-barred" competitive
environment, not unlike the "robber baron" days of the late 19th century.</p>
            <br/>
            <p>Your "record high score" possibilities will not be disqualified if you use either of the two
insider trading cheats and you will not be disqualified as the possible winner of the current
game due to using such inside information -- but you will risk massive fines for trading on
illegal inside "information." (The more often you trade on such inside information, the greater
the odds that you will be caught and fined heavily by the authorities, of course.)</p>
            <br/>
            <p>Turning off the antitrust lawsuits and restrictions WILL disqualify your game as a possible
record high score, but will not disqualify you as the possible winner of the current game,
since the relaxed (repealed) antitrust rules can be used for the benefit of the other players,
as well as for your companies.</p>
        </div>
        <br/>

        <div id="chap03_III(N)">
            <h3><strong><em>N. HOW DO I EARN EXECUTIVE COMPENSATION (SALARY, BONUSES, AND STOCK OPTIONS) IN WALL $TREET RAIDER?</em></strong></h3>
            <br/>
            <p>To earn compensation income, you need to obtain control of a company,
which means at least 20% control, and you can then have the company elect
you as its Chief Executive Officer (CEO) and begin paying you salary and
bonuses and possibly granting you executive stock options, by clicking on
the ${helpLink('chap08_VIII(B)(1)', '"Elect Me As CEO"')} button on the
Management Menu.</p>
            <br/>
            <p>Once you become the CEO of a company, you will receive an
annual salary, based on a formula that is based in part on how
large the company is (but not counting non-operating assets, such
as cash, bonds, or stock investments of the company). Salary
payments are paid to you in quarterly increments. The minimum
annual salary is $200,000 U.S. (0.2 million).</p>
            <br/>
            <p>You may also receive a year-end bonus at the end of each year.
The formerly simple rules for executive bonuses have been made
more complicated and bonuses are now more difficult to earn,
generally, but if you can generate more than 15% earnings growth
each year for several years, you may now earn bonuses of 3, 6 or
even 10 times your annual base salary, instead of the old maximum
bonus limit of 3 times salary in earlier versions of the game.</p>
            <br/>
            <p>Under the new compensation formula, if the company's operating
earnings for the current year are negative, or are no greater than
115% of the earnings in the previous year, you receive no bonus,
(unless you control 51% of the company). Also, the program now
keeps track of when you were hired as CEO, and you only receive
bonuses (generally) if you were hired before the current year, or
before any year that is taken into account in computing your bonus,
where you have managed to put together a string of annual earnings
increases of more than 15% each year.</p>
            <br/>
            <p>For example, if a company's earnings increased each year in
the years 2023, 2024, and 2025 by over 15% a year over the prior
year, you could earn a maximum bonus of 5 times base salary in
2025. However, to get credit for the increased earnings in those
3 years, you would need to have become the company's CEO in 2022
or earlier (and have remained as its CEO the whole time). In short,
you can't pick out a company that has a great earnings growth
record, take control, elect yourself as CEO, and begin receiving
huge bonuses based on what the company has already done. For the
company in the above example, you would receive no bonus in 2025
if you became its CEO in that year (except for a 100% bonus if
you own or control 51% of the company).</p>
            <br/>
            <p>Thus, if you become CEO of a company in Year 1, and increase
its earnings by over 15% (and show a profit) in Year 2, you
will receive a bonus of 150% of base salary in Year 2. If you
increase its earnings again by over 15% in Year 3, your bonus
for that year will be 3 times salary, and if you increase its
earnings by over 15% again in Year 4, your bonus will be 5
times your salary in Year 4.</p>
            <br/>
            <p>However, if you control 51% of the stock of the company, your
board of directors will be more generous (since you have absolute
control) and your bonuses will be twice the amounts noted above:
3, 6, or 10 times salary. In addition, where you control 51% of
the company's stock, you will always receive a bonus of at least
100% of your base salary, no matter how badly the company performs
under your mismanagement and regardless of when you became its CEO.</p>
            <br/>
            <p>If you are the CEO of a publicly-traded company, you may also
receive a grant of executive stock options on that company's stock
at the start of each quarter, but only if the company's stock is
publicly traded. The amount of the options you are granted will
depend on your ability to increase the company's earnings.</p>
            <br/>
            <p>For example, if you are the CEO of XYZ Company and it
had an operating loss in its most recent quarterly earnings
report, you will not receive any stock options. Even if XYZ
earns a profit, if its earnings are down from the same quarter
in the previous year, you will also not be granted any stock
options following that quarter's report. However, if XYZ's
per-share profits show an increase compared to the last year,
you will be granted options on at least 1% of the stock of
XYZ. If you are able to increase XYZ's earnings by 15% or
more for the quarter, you will instead be granted options on
2% of XYZ's stock, or 3% if you also happen to control more
than 50% of XYZ's stock, through direct or indirect holdings.</p>
            <br/>
            <p>Thus, in short, as CEO you have to perform, by increasing
a company's earnings, in order to be granted stock options.
If you are able to keep a company's earnings growing steadily,
you will not only receive more options (and bigger cash
bonuses), but the stock should rise, making your options
worth more and more.</p>
            <br/>
            <p>The granting of the options is a non-taxable event,
with the strike price on each grant set at the current
market price. The cost of such options is not an expense
for the company at the date of grant and you are not taxed
on receipt of the options. The options are "restricted," in
that you may not (voluntarily) sell them until one year later.
Then, if you do sell them, they will be sold back to the company
at market value (with no commissions charged) and the amount you
receive will be taxable, but at favorable capital gains tax rates.
The amount the company pays you to cancel the options is an
expense to the company at that time. If you hold the options
until they expire, and either exercise them or receive cash
settlement at expiration, any bargain element is an expense
item for the company, which either buys back the options from
you at their intrinsic value (excess of stock price over option
exercise price) or, if you are exercising the option, the
company issues new stock to you at the exercise price and buys
stock on the open market in an equal amount at the market price,
so that there is no dilution of the company's stock.</p>
            <br/>
            <p>If you allow the option to be settled (bought from you) at
expiration, the amount you receive is income (capital gain). If
you instead allow the calls to be exercised, you will not incur
any taxable income, but your cost basis for the stock you receive
will be the exercise price. If options expire worthless, there
is no expense for the company and no income taxable to you, the
executive.</p>
            <br/>
            <p>A company will save money (improving its earnings) if it does not pay
a CEO salary or bonuses, or grant stock options. Thus, you may sometimes
choose not to receive CEO compensation, if you prefer not to clobber
your company's earnings. If you are already the CEO of a company and
wish to resign (without becoming CEO of a different company), click on
the ${helpLink('chap08_VIII(B)(2)', '"Resign as CEO"')} button on the
Management Menu. If you are CEO of Company A and choose to become CEO
of Company B, you will automatically resign as CEO of Company A. You
can only be CEO of one company at a time in Wall Street Raider.</p>
        </div>
        <br/>

        <div id="chap03_III(O)">
            <h3><strong><em>O. WHAT IS THE "GOODWILL" ITEM ON MY COMPANY'S BALANCE SHEET?</em></strong></h3>
            <br/>
            <p>In Wall $treet Raider, when a company acquires profitable capital
assets from another company, it may have part of the purchase price
(the premium paid because the assets were highly profitable) allocated
to an account called "goodwill." As in the real world, this is merely
an accounting convention. For example, if a company acquires another
company, such as one in a service business that has almost no assets
but its good name and highly skilled employees who are able to generate
good profits, and the buyer pays many millions for the company, it
obviously cannot allocate all of the purchase price to the few
tangible assets of the acquired company, which may be nothing more
than a few pieces of office furniture and a supply of paper clips.
Most of the purchase price would, therefore, instead be allocated
to one or more intangible assets, such as "goodwill."</p>
            <br/>
            <p>For details on how "goodwill" accounting works in this simulation,
${helpLink('glossary_GOODWILL', 'click here')}.</p>
        </div>
        <br/>

        <div id="chap03_III(P)">
            <h3><strong><em>P. WHAT IS A "SHORT SALE" OF STOCK?</em></strong></h3>
            <br/>
            <p>In Wall $treet Raider, you can sell a stock "short" when
you expect the stock to go down, as well as buy stocks you
expect to rise in price. A short sale transaction consists
of borrowing stock that you do not own, and selling it
now, with the expectation of buying it back (cheaper, for
a profit) in the future, and returning the borrowed shares
to their owner. In W$R, only players (not corporations) can
sell stocks short. The "computer player" is not allowed to
sell short. However, the computer player may try to "short
squeeze" you if you sell stocks short, and put yourself in
a vulnerable position.</p>
            <br/>
            <p>Short selling, by its nature, is very risky, since you can
lose nearly infinite amounts if a stock you sold short goes up
greatly in value -- unlike buying a stock, where you can only
lose 100% of your investment. That is why, in the bad old days
on Wall Street, there was a famous saying about short selling:</p>
            <br/>
            <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; font-style: italic;">
            <p><strong>"He who sells what isn't his'n, must buy it back, or go to prison."</strong></p>
            </blockquote>
            <br/>
            <p>In W$R, the proceeds of the sale, when you sell stock short,
do not go into your regular cash account. Instead, the money
must be kept on deposit in a "short margin account." You must
maintain an amount on deposit in the short margin account at
all times that is equal to the value of all the stock you have
sold short (since you will have to buy it back at some time).
Thus, any time the value of the stocks you have sold short goes
up, cash must be added to the short margin account, from your
regular cash balance. Or, if (as you hoped) the stock or stocks
you have sold short decline in value, you will have excess funds
in your short margin account, which are immediately distributed
to you.</p>
            <br/>
            <p>Accordingly, when you have sold any stocks short, money
will be transferred back and forth between your cash account
(bank account) and the short margin account, as the stocks you
have shorted fluctuate in value, and you will notice that your
cash balance fluctuates up and down every few seconds, when the
stock ticker is running. This is because the software "marks
to market" your short positions every few seconds -- that is,
it compares the value of the negative (short) positions with
the amount on deposit in the short margin account, and transfers
cash back and forth to keep the short margin account balance
equal to the (negative) value of the shorted stocks, a liability.</p>
            <br/>
            <p>The amount you have on deposit in the short margin account
is one of your assets, but is restricted. You don't earn any
interest on it, and you can only use the money in the short
margin account to buy back one or more of the stocks in which
you have a short position. This is one way, in the real world,
that brokers make money: they lend you shares of stock that
belong to another customer, and the proceeds of the short sale
that are kept in the short sale margin account can be invested
by the broker in money market instruments like T-bills or
commercial paper, so the broker earns interest on the money
which you have to keep on deposit with them, until you close
out the short sale by buying back the stock (which the broker
then returns to the account of their other customer they let
you borrow it from).</p>
            <br/>
            <p>If your short positions are all closed out (such as where
your only shorted stock becomes worthless in bankruptcy), any
funds remaining in your short account are distributed to you,
since you won't have to buy back stock that has become worthless.</p>
            <br/>
            <p>Note that if you are short a stock when it pays a dividend,
you have to pay an amount equal to the dividend on the shorted
shares. (Payable, in theory, to the person who loaned you
the borrowed shares, since the dividend paid by the company
goes to the person who owns the shares now, to whom you sold
them.) In W$R, such "short dividends" you have to pay are not
deductible, except as capital losses. (Which is only fair,
since, for example, a large extraordinary dividend of $40 a
share that reduces a stock's value from $50 to about $10 would
give you an instant $40 a share capital gain if you covered
your short position right away after incurring the cost of
paying the "short dividend" on such a distribution.)</p>
            <br/>
            <p>There are limits on how much stock you can sell short:</p>
            <br/>
            <ul style="list-style-type: disc; padding-left: 24px;">
            <li>You cannot "sell short against the box" (sell a stock
short in which you retain a "long" position in the stock),
a tax avoidance gimmick sometimes used in the real world,
since a gain on "long" stock isn't recognized when you
lock it in by selling an offsetting and equal amount of
the stock short);</li>
            <br/>
            <li>You cannot sell short more than 20% of the total
stock of any one company;</li>
            <br/>
            <li>Stock of a particular company can only be sold short
if there are enough "public" shares of the stock that
can be borrowed, and the maximum amount that can be borrowed
(by all players, total) is 50% of the publicly-traded
shares. This means that if the amount of "public" stock
is reduced, such as by purchases by other players or
companies, by mergers, or LBO buybacks, the total stock
shorted may exceed the 50% of publicly-traded stock
limit (or the 20% of the company individual limit),
in which case the players who are short the stock will
be forced to buy back some of the shorted stock (or will
have to buy back all of the short position if all of the
public stock is bought up or acquired otherwise, such as
in a merger).</li>
            <br/>
            <li>You cannot sell short a stock of a company that you
control. Doing so would be a severe conflict of interest
for you, as an "insider," betting against your own
company's stock, so it is not permitted. Also, if you
or a company you control take control of a company whose
stock you have sold short, you will be forced to cover
your short position. If you try to take control of
another company that controls the company you have
shorted, you will sometimes be warned before you buy that
you will be forced to cover the short position -- but
in some cases, where control of the shorted company is
through a long chain of companies and you buy control
of a company near the top of the chain, you may not be
warned, if there is a complex ownership structure.</li>
            </ul>
            <br/>
            <p>There are also margin limits that may prevent you from
selling stock short, or may force you to immediately cover
(buy back) existing shorted stock positions if you cease
to meet the "maintenance margin" requirements for your
short sales positions:</p>
            <br/>
            <ul style="list-style-type: disc; padding-left: 24px;">
            <li>When making a short sale, you must have a net worth equal
to at least 50% of the value of the short margin account
when the sale is completed; otherwise, the short sale is
not permitted; and</li>
            <br/>
            <li>You must maintain (maintenance margin) a net worth equal
to at least 1/3 (33 1/3%) of the value of your shorted stock.
If your net worth falls below 1/3 of the value of your short
account, you will be forced to buy back enough shorted stock
so that your net worth once again exceeds 1/3 of the value
of the shorted stocks. (Naturally, your forced buying will
tend to drive the stock price up further, reducing your
net worth, which may trigger more forced covering.)</li>
            <br/>
            <li>You will also be forced to cover a short position
(eventually) if you have a short position in a stock
and later acquire control of the company, through another
company you control. Within one month or less (of game time)
you will be automatically forced to cover the short position
in the controlled company.</li>
            </ul>
        </div>
        <br/>

        <div id="chap03_III(Q)">
            <h3><strong><em>Q. HOW CAN I BECOME THE MANAGER OF THE INVESTMENTS OF AN ETF?</em></strong></h3>
            <br/>
            <p>In W$R, only an insurance company or securities broker can serve as
the manager and investment advisor of an ETF (Exchange-Traded Fund). At
the start of a new game, management contracts for all 15 ETFs are randomly
assigned to 15 such companies, which will receive quarterly management
fees based on the total assets of the ETF, at annual rates ranging from
0.2% to 1.0% of total assets. For superior investment performance, the
ETF may also pay its manager a (potentially very large) performance
bonus after each 2-year measurement period that ends in odd years for
some ETFs or in even-numbered years for others.</p>
            <br/>
            <p>If you acquire control of an insurance company or securities broker
that manages one or more ETFs, you will be able to direct the ETF to do a
number of different transactions, including buying or selling stocks or
options, doing public offerings of stock, issuance of bonds, buying back
or calling part or all of an existing bond issue, and borrowing cash or
making bank loan repayments.</p>
            <br/>
            <p>In order to obtain the rights to manage/advise a particular ETF, you
can either acquire control of the company that is its advisor, or, if
you control an insurer or securities broker that does not already manage
any ETFs, you can have your company purchase the rights to manage an
ETF from its current advisor, for 10 times the annual base fee the
current advisor is being paid by the ETF (5 times the annual base fee,
in the case of a bond fund), unless the current advisor is managed by
another player (human or computer player), in which case it is not
available for sale.</p>
            <br/>
            <p>To make such a purchase for your controlled insurance company
or securities broker, go to the Management Menu and click on the
"Become ETF Advisor" button to initiate the transaction. (That button
will only appear if the "Active Entity" or "Transacting Entity" is an
insurance company or securities broker that you control and if it does
not already manage any ETFs.)</p>
            <br/>
            <p>Version 9.0 added 5 new ETFs, bond funds and index funds, to the
previously existing 15 ETFs. These 5 new ETFs are subject to some
different rules that apply even if one of your controlled companies
manages a bond fund or index fund. For example, no performance bonuses
are paid to managers of index funds or bond funds, and fees for both
those types of ETFs are limited to a flat 0.2% of net assets, annually.
These funds operate automatically according to certain investment
algorithms, so even if your company manages a bond or index fund, you
cannot have the fund trade stocks, bonds, or options. (Bond funds only
hold certain types of bonds, and index funds only hold or short
specified amounts of stock index futures.) If you are managing a bond
fund or index fund, the only transactions you can have it engage in
are to issue stock or issue bonds, buy back bonds the fund has
previously issued, borrow or repay bank loans, or distribute an
"extraordinary dividend." (And you are very unlikely to want to have
a fund you manage pay an "extraordinary dividend," since that will
reduce the amount of assets you are managing, and thus reduce the
management fees you (your brokerage or insurance company, actually)
earn.</p>
        </div>
        <br/>

        <p><strong>Ready to proceed?</strong></p>
        <br/>
        <p>Now you know all the basic ground rules you need to know to play
WALL $TREET RAIDER, and you are ready to begin. Depending upon how
much you already know about economics and corporate finance, there
may be many more fine points for you to learn before you become an
accomplished player. To get started, however, you do not have to
know anything about corporate liquidations, short selling, or junk
bond financing. That will come with experience, as you try different
techniques and notice the results. "Learn through pain -- the best
teacher," is our motto. :-)</p>
        <br/>
        <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
        <p><strong>NOTE: THE REMAINDER OF THIS MANUAL IS FOR REFERENCE
ONLY -- YOU HAVE NOW READ ALL YOU NEED TO IN ORDER TO HAVE A
BASIC WORKING KNOWLEDGE OF WALL $TREET RAIDER. THE REST
OF THE MANUAL IS PRIMARILY FOR THE USE OF THOSE PLAYERS
WHO WISH TO UTILIZE MORE SOPHISTICATED TECHNIQUES AND WANT
SOME IDEAS FOR IMPROVING THEIR FINANCIAL STRATEGIES IN
WALL $TREET RAIDER.</strong></p>
        </blockquote>
    </div>`;
}
