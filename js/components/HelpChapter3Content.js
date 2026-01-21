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
            <p><em>[Additional detailed sections about realism in trading limits, accounting methods, tax rules, and stock pricing algorithms...]</em></p>
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
            <p><em>[Additional detailed sections about margin requirements, adjusted net worth, options margin, commodities margin, etc...]</em></p>
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
            <p><em>[Additional sections about CHEAT MENU options, insider trading cheats, and antitrust options...]</em></p>
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
            <p><em>[Detailed sections about salary formula, bonus calculations, and stock option grants...]</em></p>
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
            <p><em>[Detailed sections about short margin accounts, marking to market, limits, and margin requirements...]</em></p>
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
            <p><em>[Additional sections about acquiring ETF management rights, fees, and restrictions...]</em></p>
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
