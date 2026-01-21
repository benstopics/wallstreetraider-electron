import { html } from '../lib/preact.standalone.module.js';

export default function HelpChapter5Content({ helpLink }) {
    return html`<div>
        <h2><u>THE MAIN MENU ("TRADING DESK")</u></h2>
        <br/>

        <div id="chap05_V(A)">
            <h3><strong><em>A. IN GENERAL</em></strong></h3>
            <br/>
            <p>Once you have entered players' names, decided on the length of
the game and players' turns and other preliminaries, you will find
that most of the time you spend playing Wall $treet Raider will be
spent on the "main menu" (the screen titled as "Trading Desk")
portion of the program, except when you are in the various research
or transactions pop-up Menus that you will use to do your
investment research, or to buy or sell stocks, bonds, or business
assets or to engage in other types of transactions.</p>
            <br/>
            <p>This chapter describes the workings of the various main menu
or "Trading Desk" features, other than the transaction command
buttons and research buttons. The features discussed in this
chapter are mainly pull-down menus used to start, end or save
games, or configure the game in various ways, plus the various
informational items displayed on the main screen, and certain
miscellaneous buttons, other than those that are in the "Research,"
"Transactions," or "Other" button groupings.</p>
            <br/>
            <p>Research functions, such as viewing financial statements,
earnings reports, research reports, and industry and economic
data and forecasts, are mostly accessed by clicking on the buttons
in the "Research Tools" grouping or the "Quick Search Functions"
grouping on the main screen. The "Select Player" and "Select
Corp." buttons are used to select the player or corporate
${helpLink('chap03_III(A)', 'Active Entity')} whose information
is to be viewed with certain of the research command button features, as well as for doing
transactions. The other two Research buttons bring up pop-up
Menus, either for doing research on a specific entity
(player or company), or general industry and economic research.
For instructions on using the program's research features in
the "Entity Info" and "General" (research) Menus, see
${helpLink('chap10', 'Chapter X')}.</p>
            <br/>
            <p>Transactions, such as buying and selling, are all done in the
various Transactions Menus, which are accessed by clicking on
any of the six "Transactions" buttons, which appear together in a
group on the main "Trading Desk" menu. The "Buy Stock" and
"Sell Stock" buttons also appear in the Menu that is brought
up by the "Buy/Sell" button, unless the current ${helpLink('chap03_III(A)', 'Active Entity')}
is a player, rather than a corporation controlled by the player.
These two frequently used buttons are placed on the main screen
in order to make it possible to access the buy- and sell-stock
functions with a single keystroke.</p>
            <br/>
            <p>For instructions on using commands in the various Transactions
Menus, see:</p>
            <ul style="margin-left: 24px;">
                <li>${helpLink('chap06', 'Chapter VI (Buy/Sell)')}</li>
                <li>${helpLink('chap07', 'Chapter VII (Financing)')}</li>
                <li>${helpLink('chap08', 'Chapter VIII (Management)')}</li>
                <li>${helpLink('chap09', 'Chapter IX (Other Transactions)')}</li>
            </ul>
            <br/>
            <p>Three more buttons, the "End Turn," "Stock Chart," and "Misc"
buttons, are located together in the "Other" section, on the far
right side of the main screen. The "End Turn" button ends the
current player's turn prematurely, and the "Stock Chart" button
displays a stock price chart for the mostly recently selected
(corporate) ${helpLink('chap03_III(A)', 'Active Entity')}, while
the "Misc" button brings up a Menu of additional transactions
or functions you can do, but which do not count against the 5
transactions (10 in the "alternative version" of W$R) that you are
allowed on each turn. The "End Turn," "Stock Chart," and "Misc"
buttons and the functions available on the pop-up menu that
appears when you click on the "Misc" button, are all discussed
in ${helpLink('chap11', 'Chapter XI (Other Menu Functions)')}.</p>
            <br/>
            <p>Note that the stock ticker runs across the bottom of the
screen while you are looking at the Main Menu, and that various
news headlines (including some earnings reports) are constantly
scrolling through a text box in the middle of the main screen,
if the stock ticker is moving (and occasionally will move even
when the stock ticker is halted).</p>
            <br/>
            <p>Also displayed, just above the news headlines ticker, are
information items that include the name of the player whose
turn it is at present, the current game date, and the number
of transactions that can be done before the player's turn
ends (which is reduced by one at the mid-point and again at
the end of each calendar quarter). Now let's look at each
of the various Main Menu features, other than the "Research
Tools," "Transactions," and "Other" groups of command buttons.</p>
        </div>
        <br/>

        <div id="chap05_V(B)">
            <h3><strong><em>B. "TRADING DESK" PULLDOWN MENU ITEMS</em></strong></h3>
            <br/>
            <p>The main screen or "Trading Desk" of Wall $treet Raider contains four
pulldown menus -- the "File" menu, the "Game Options" menu, the "Settings" menu,
and the "Help" menu. Any of the 4 menus can be accessed by clicking on the menu
name (File, Game Options, Settings, or Help), or, by using the keyboard, by
pressing the "Alt" key and then pressing the underlined first letter of the
menu name (F, G, S, or H).</p>
            <br/>

            <div id="chap05_V(B)(1)">
                <h4><u>(1) "FILE" MENU</u></h4>
                <br/>
                <p>The File Menu is located in the upper left corner
of the main Wall $treet Raider screen. It has the following menu items which
you may select by clicking on them:</p>
                <br/>
                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
                    <p id="chap05_V(B)(1)(a)"><strong><em>New Game</em></strong> or <strong><em>Restart.</em></strong> Click on the
"New Game" menu item (or press "N" key while viewing this pulldown menu)
to start a new game. This item will instead appear as "Restart" after a
new or saved game data set has been loaded into memory. Clicking on the
"Restart" item (or pressing the "R" key while viewing this pulldown menu)
will cause the current or just-finished game data to be dumped from
memory, and a new copy of W$R to be loaded into memory, so you can then
either start another new game, or load and resume playing a saved game.</p>
                    <br/>
                    <p id="chap05_V(B)(1)(b)"><strong><em>Open Saved Game.</em></strong> Click on this menu item (or press "O"
key while viewing this pulldown menu) to continue a saved game. When you do so,
the program will ask if you want to continue a game number such as "Game #1" --
which will be the last game file you saved to disk. If you answer "No," you
can then enter the number of the game you wish to load, which can be any
number from 1 to 50 that has been assigned to a game you were playing previously.
This item will be grayed out (and unavailable) after a new or saved game data
set has been loaded into memory.</p>
                    <br/>
                    <p id="chap05_V(B)(1)(c)"><strong><em>Save Game.</em></strong> Click on this menu item (or press "S" key
while viewing this pulldown menu) to save the current game to disk, as the
game number that has been selected by you or assigned by the program, in the
case of a new game. This item will be grayed out (and unavailable) until a
new or saved game data set has been loaded into memory, or once a game has
ended. DO NOT ATTEMPT TO SAVE A GAME WHILE YOU ARE IN THE MIDST OF DOING
A TRANSACTION, AS THE SAVED DATA MAY REFLECT ONLY PART OF THE UNCOMPLETED
TRANSACTION.</p>
                    <br/>
                    <p id="chap05_V(B)(1)(d)"><strong><em>Save Game As.</em></strong> Click on this menu item (or press "A"
key while viewing this pulldown menu) to save the current game to disk, as
the game number you will select (which must be from 1 to 50). This item
will be grayed out (and unavailable) until a new or saved game data set
has been loaded into memory.</p>
                    <br/>
                    <p id="chap05_V(B)(1)(e)"><strong><em>Exit -- Alt + F4.</em></strong> Click on this menu item (or press "x"
key while viewing this pulldown menu) to exit the Wall $treet Raider program.
You can also exit without using this menu item, by pressing the "Alt" key and the
"F4" function key at the same time, at any time while you are viewing the main
Wall $treet Raider screen. Note that the game you are playing at present will
not automatically be saved when you exit the program. You will need to select
the "Save" or "Save Game As" menu item to save the game to disk, before you
exit the program, if you wish to continue playing the current game at a later
time, at the point where you left off.</p>
                </blockquote>
            </div>
            <br/>

            <div id="chap05_V(B)(2)">
                <h4><u>(2) "GAME OPTIONS" MENU</u></h4>
                <br/>
                <p>The Game Options Menu is located between
the File Menu and the Settings Menu in the upper left corner of the main Wall
$treet Raider screen. It has the following menu items which you may select
by clicking on them, or by pressing the underlined letter in the name of any
menu item:</p>
                <br/>
                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
                    <p id="chap05_V(B)(2)(a)"><strong><em>High Score.</em></strong> Click on this item to see the highest
recorded score (converted to U.S. dollars, for comparability) of any Wall
$treet Raider player on your computer. Only an ending net worth of $100
million or more will be recorded as a high score, since that is the
minimum amount with which you can start a game of Wall $treet Raider.</p>
                    <br/>
                    <p id="chap05_V(B)(2)(b)"><strong><em>Updates</em></strong> or <strong><em>Upgrades Items.</em></strong> Click on the
"Updates" item, if you are connected to the Internet, and it will load the
Internet Explorer browser and take you to the "Updates" page at
www.roninsoft.com/updates.htm, where you can view a summary of recent update changes to the program,
and, if you wish, order the latest version of Wall $treet Raider or
download the latest "shareware" (free) version of the program.</p>
                    <br/>
                    <p>Click on the "Upgrades" item (not shown in the shareware version)
and, if you are connected to the Internet, and it will load the web
browser software and take you to an unpublished (hidden) webpage at
the www.roninsoft.com website, where you can order an upgrade to the
most recent "Full Package" release of the program at a greatly reduced
price, since you are already a registered owner (purchaser) of the
software.</p>
                    <br/>
                    <p id="chap05_V(B)(2)(c)"><strong><em>W$R Forum.</em></strong> Click on this item to access the
www.roninsoft.com/forum.htm web page on the Internet, which will re-direct you to any currently
available Wall $treet Raider fan sites or blogs operated by devotees
of the game. There, you can exchange ideas and game strategies with
other players of Wall $treet Raider and post your comments on any
subject related to the game.</p>
                    <br/>
                    <p id="chap05_V(B)(2)(d)"><strong><em>Order W$R Manual (or View W$R Manual).</em></strong>
This item will vary: In the shareware version of Wall $treet Raider, it
will display as "Register Online," and clicking on it will launch your
web browser and take you to the Ronin Software web site to order the
registered version. In the registered version, this item will display as
"Order W$R Manual" if the manual is not present, and clicking on it will
also launch your browser and take you to the Ronin Software web site.</p>
                    <br/>
                    <p id="chap05_V(B)(2)(e)"><strong><em>Customizer Utility.</em></strong> If this item is not grayed out,
click on this item to go to the "Customizer" utility program, which allows
you to (permanently) change the name, stock symbol, and nation where
incorporated, for any of the 1590 companies in Wall $treet Raider.</p>
                    <br/>
                    <p id="chap05_V(B)(2)(f)"><strong><em>Online Tutorial.</em></strong> Wall Street Raider now offers a very detailed,
step-by-step online tutorial, designed for new users, on the Ronin Software web site. Click
on this item to go directly to the tutorial. (Requires that you have an Internet connection.)</p>
                    <br/>
                    <p id="chap05_V(B)(2)(g)"><strong><em>Speculator Stock Trading Game.</em></strong> Click on this link to download a
free copy of "Speculator: The Stock Trading Simulation," Wall Street Raider's sister program.
Speculator uses the same "engine" as Wall Street Raider (up to 1590 companies in 70
industry groups plus ETFs), but is not a game of billionaires. Instead, you start out
with only $100,000 U.S. (or equivalent in whatever currency you select), as a small,
middle-class investor and investment "newbie."</p>
                </blockquote>
            </div>
            <br/>

            <div id="chap05_V(B)(3)">
                <h4><u>(3) "SETTINGS" MENU</u></h4>
                <br/>
                <p>The Settings Menu is located between the
Game Options Menu and the Help Menu in the upper left corner of the main Wall
$treet Raider screen. It has the following menu items which you may select
by clicking on them, or by pressing the underlined letter in the name of any
menu item:</p>
                <br/>
                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
                    <p id="chap05_V(B)(3)(a)"><strong><em>Ticker Speed.</em></strong> Click on the Ticker Speed menu item
(or press "S" key while viewing this pulldown menu) to change the speed at
which the stock ticker and news ticker move across the screen when the
ticker is running. You can select a speed setting of anywhere from 1 to 100,
where 1 is the slowest speed and 100 is the fastest. The faster the ticker
moves, the faster "time" passes in Wall $treet Raider. We suggest you
experiment with various speed settings until you find a speed that is
comfortable for you, on your computer. The default setting is 50.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(b)"><strong><em>Currency.</em></strong> Click on this menu item (or press "y" key while
viewing this pulldown menu) to select the currency (U.S. dollars, Euros,
or any of 21 other national currencies) in which financial amounts in Wall
$treet Raider will be displayed. Except for per-share amounts, most money
amounts or numbers of shares of stock will be displayed in millions of
dollars, pounds, Euros, etc. However, for some currencies, the Japanese
Yen, Korean Won, Indian Rupee, and Icelandic Kronur, amounts will be shown
in billions.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(c)"><strong><em>Cheat Mode Is: ON (or OFF).</em></strong> Click on this item
(or press the "C" key while viewing this pulldown menu) to
toggle "Cheat Mode" on or off. The default is "on." When Cheat Mode is
turned on, and you control one or more companies, you may be presented
with occasional "ethical choices" that may allow you to make a lot of money,
fast. Dirty money. Of course, there may also be consequences if you choose
to go for the quick buck. For more on Cheat Mode, see ${helpLink('chap03_III(K)', 'the FAQ on Cheat Mode')}.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(d)"><strong><em>Select Law Firm.</em></strong> Click on this item (or press the
"L" key while viewing this pulldown menu) to select the level of
law firm you want to represent any companies you control in antitrust
lawsuits, or other lawsuits. You can choose
either a cheap, average, or expensive law firm. Obviously, hiring the
expensive law firm is more likely to increase your odds of winning a
lawsuit, and relying on the cheapo law firm is likely to decrease your
odds of winning.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(e)"><strong><em>Suppress Popups: ON (or OFF).</em></strong> To suppress
the display of small popup news announcements that otherwise would
occur when the stock ticker is running, toggle this item "ON" by
clicking on it. This can be handy if you control a very large number
of corporations, in which case you might find it annoying to see
news items on one of your companies popping up too frequently.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(f)"><strong><em>Suppress Earnings Reports: ON (or OFF).</em></strong> To suppress
the automatic display of earnings reports when they are released by
companies you control or ETFs managed by companies you control, which
can be a frequent and annoying source of interruptions if you control
a large number of companies, toggle this item "ON".</p>
                    <br/>
                    <p id="chap05_V(B)(3)(g)"><strong><em>Suppress Cash Flow Warnings: ON (or OFF).</em></strong>
The default setting for this item is "OFF," in which case
you will receive warnings when a company is about to incur
a severe cash flow crisis that may force it to liquidate
assets during the next three months of play.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(h)"><strong><em>AutoSave Is: ON (or OFF).</em></strong> To automatically
save an updated data set for your current game at the end of each
calendar quarter, turn on the AutoSave feature by clicking on that
item on the Settings Menu. This feature can be useful in the event you have a power loss or your
computer crashes.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(i)"><strong><em>Exercise Options? Yes (or No).</em></strong> This is another
toggle switch or setting. If it is turned off, options
you or your controlled companies have bought or sold short will
be settled for cash (sold or bought back) on their expiration
date, if they have any intrinsic value. If turned on, options
that are "in-the-money" will generally be exercised.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(j)"><strong><em>Make Physical Delivery? Yes (or No).</em></strong>
Toggle this item to "Yes" or "No" depending upon whether or not you
want to make delivery (sell) a physical commodity you own, if you have
sold short a futures contract on that commodity, when that futures
contract expires.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(k)"><strong><em>Take Physical Delivery? Yes (or No).</em></strong>
Toggle this item to "Yes" or "No" depending upon whether or
not you want to take delivery of (buy) the physical commodity when
a "long" futures contract you have bought expires.</p>
                    <br/>
                    <p><strong><u>CAUTION:</u></strong> While you can buy and sell futures contracts
on very large amounts of a commodity, with only a 5% margin requirement,
you had better have a large amount of cash or credit if you set the "Take
Physical Delivery" setting as "Yes," since you will need to pay the
full contract price when a futures contract you own is settled at its
expiration date.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(l)"><strong><em>Stock Chart Size: Small (or Large).</em></strong> This is
another toggle switch or setting. Click on this item to toggle this
item back and forth between "Small" (the default setting for
the size of stock charts that are displayed) and "Large". The
small stock charts will appear at the upper left corner of the
screen, while the large charts will cover practically the entire
screen.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(m)"><strong><em>Clear Chart History for Active Entity.</em></strong>
Click on this item, and you will be asked if you want to clear
(erase) the 5-year price history of the stock of the current
"Active Entity," if it is a corporation. If the Active Entity
is you, the Player, this feature will instead let you clear
your net worth history that is used in your net worth chart.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(n)"><strong><em>AutoAdd To StreamList Is: ON (or OFF).</em></strong>
Click on it to toggle this item
back and forth, depending on whether or not you want a stock to
be automatically added to the Streaming Stock Quotes List each
time a new ${helpLink('chap03_III(A)', 'Active Entity')} (company)
is selected.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(o)"><strong><em>AutoPilot (Global Setting) is: ON (or OFF).</em></strong> This
is another toggle switch or setting. When it is toggled "ON," all companies you control will
operate independently, as though they were not under your control,
except for the one company of which you have been elected
President/CEO and which you still control. The default setting for
AutoPilot is "OFF."</p>
                    <br/>
                    <p id="chap05_V(B)(3)(p)"><strong><em>Sweep Cash to Reduce Loan? is: Yes (or No).</em></strong> Click on this
item to toggle this
item back and forth, depending on whether or not you want any cash in your
bank account to immediately be "swept"
(applied) to your bank loan, reducing the amount of the loan and thus saving
you interest expense on the loan.</p>
                    <br/>
                    <p id="chap05_V(B)(3)(q)"><strong><em>Max Growth Rate (Global) Throttle.</em></strong> Click on
this item in order to set a
maximum business asset growth rate percentage (which can be
a negative value) for all of the industrial companies that
you control, if they are on AutoPilot. This function is like
a throttle that lets you limit the rate of growth of all such
companies that you control.</p>
                </blockquote>
            </div>
            <br/>

            <div id="chap05_V(B)(4)">
                <h4><u>(4) "HELP" MENU</u></h4>
                <br/>
                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
                    <p id="chap05_V(B)(4)(a)"><strong><em>Wall $treet Raider HELP - F1.</em></strong> Click on the Contents
help menu item (or press "H" key while viewing this pulldown menu, or press "F1"
key at any time) to load the Wall $treet Raider "help" files table of contents.</p>
                    <br/>
                    <p id="chap05_V(B)(4)(b)"><strong><em>Registration Info.</em></strong> Click on this item to
see your registration number, if you entered it when you initially
installed your registered version of Wall $treet Raider.</p>
                    <br/>
                    <p id="chap05_V(B)(4)(c)"><strong><em>About.</em></strong> Click on the About help menu item
to view Wall $treet Raider copyright information, and to see what version number
of the program you are running.</p>
                </blockquote>
            </div>
        </div>
        <br/>

        <div id="chap05_V(C)">
            <h3><strong><em>C. "TRADING DESK" INFORMATION DISPLAYS (MAIN MENU SCREEN)</em></strong></h3>
            <br/>

            <div id="chap05_V(C)(1)">
                <h4><u>(1) "ACTIVE ENTITY SELECTED" ITEMS</u></h4>
                <br/>
                <p>The box in the upper left corner
of the main screen, with the heading "Active Entity Selected," shows several
items of information about the current ${helpLink('chap03_III(A)', 'Active Entity')},
which can be either the current player whose turn it is, or any corporation you
have selected for viewing or (if you control the corporation) for action. The
items displayed in this box all relate to that entity, except the "GO" button,
which is used to select a company as Active Entity if you have entered its stock
symbol into the "Stock Symbol" text entry box.</p>
                <br/>
                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
                    <p><strong><em>"Entity Name."</em></strong> The name of the ${helpLink('chap03_III(A)', 'Active Entity')} --
player name or corporation name -- is shown just under the "Active Entity Selected"
label.</p>
                    <br/>
                    <p><strong><em>"Stock Symbol."</em></strong> The "Stock Symbol" text box shows the
stock symbol of the currently selected ${helpLink('chap03_III(A)', 'Active Entity')}, if it is a corporation.
If it is the player, the box will display "N/A" -- meaning "not applicable."
This box can also be used to directly enter a stock symbol to select a
particular company as ${helpLink('chap03_III(A)', 'Active Entity')}, if you know the stock symbol.</p>
                    <br/>
                    <p><strong><em>"Stock Price."</em></strong> This box shows the stock price of the
currently selected Active Entity if it is a corporation. The price is
automatically updated when the stock ticker is running, any time the price
of the company's stock changes.</p>
                    <br/>
                    <p><strong><em>"Controlled By" Item.</em></strong> This item shows the stock
symbol of the company that controls the currently selected ${helpLink('chap03_III(A)', 'Active Entity')},
if the Active Entity is a corporation. Click on it to select that company
as the new ${helpLink('chap03_III(A)', 'Active Entity')}.</p>
                    <br/>
                    <p><strong><em>"Acting Now."</em></strong> The "Acting Now" item shows
the name or stock symbol of your controlled company that is currently
doing transactions (which may or may not be the Active Entity); or, it
will show "Me" if you are the entity that will do a transaction.</p>
                </blockquote>
            </div>
            <br/>

            <div id="chap05_V(C)(2)">
                <h4><u>(2) "INDUSTRY GROUP SELECTED" ITEM</u></h4>
                <br/>
                <p>This item shows the currently
"selected industry" for purposes of viewing industry statistics. Thus, when
you click on the "${helpLink('chap10_X(E)(3)', 'Industry Projection')}" or
"${helpLink('chap10_X(E)(4)', 'Industry Summary')}" buttons on the "GENERAL"
research Menu, you will see industry financial statistics for the selected
industry.</p>
                <br/>
                <p>Each time you select a company as the ${helpLink('chap03_III(A)', 'Active Entity')},
however, the "selected industry" will automatically change to that of the industry
in which that particular company operates. However, you can also change the
industry without having to change the Active Entity, by clicking on the drop-down
listbox where the industry name is shown.</p>
            </div>
            <br/>

            <div id="chap05_V(C)(3)">
                <h4><u>(3) "MY BALANCE SHEET" ITEMS</u></h4>
                <br/>
                <p>The middle left portion of the main
screen of Wall $treet Raider displays "My Balance Sheet," with five financial
items listed below for the currently active player. This information is updated
constantly, so that any fluctuations in the prices of stocks or bonds you own
directly will instantly show up on your "balance sheet."</p>
                <br/>
                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
                    <p><strong><em>Cash (Demand Deposits or "DDs").</em></strong> This item shows the current
player's cash balance (actually non-interest-bearing bank demand deposits, or
DDs, which pay no interest to the depositor.</p>
                    <br/>
                    <p>However, this cash is generally quite safe, except in the rare case
where your bank collapses and the government requires a "bail-in" of large
depositors, so that you lose part or all of whatever you had on deposit
with that bank. Thus, if your bank looks shaky, you
may want to go to the "Other Transactions" Menu and change banks, for both
loans and deposits, before your bank goes bust.</p>
                    <br/>
                    <p><strong><em>Other Assets.</em></strong> This item shows the current market
value of all the player's other assets, such as T-bills, stocks, bonds,
and options, plus any advances (demand loans) made to corporations by
the player. Of course, if you try to sell a large block of stock or
corporate bonds, you will depress the price of the security, so you
will have to sell it for somewhat less than the market value.</p>
                    <br/>
                    <p><strong><em>Total Assets.</em></strong> This is the total of your assets,
including cash (bank demand deposits) and all "Other Assets."</p>
                    <br/>
                    <p><strong><em>Less Debt.</em></strong> This item shows the amount of your
debt owed to the lending bank, and is shown as a negative number, if
you owe anything to the bank.</p>
                    <br/>
                    <p><strong><em>Net Worth.</em></strong> This item is your bottom line net
worth. It is the sum of your cash and all your stock and bond
investments, less any loans you owe to the bank. Click on this
item to see a historical chart of your net worth for the past five
years of game play.</p>
                    <br/>
                    <p>Note that if, at any time, your net worth is less than 1/3 of what you
owe the bank, you will soon receive a ${helpLink('chap03_III(I)', 'margin call')} from the bank, forcing you to pay down the loan to where it is
no more than 3 times your net worth.</p>
                    <br/>
                    <p>If your "net worth" falls below zero, you will generally go
bankrupt, and be forced out of the game.</p>
                </blockquote>
            </div>
            <br/>

            <div id="chap05_V(C)(4)">
                <h4><u>(4) GAME STATUS INFO ITEMS</u></h4>
                <br/>
                <p>The main screen of Wall $treet Raider
has several items that let you know which player's turn it is at present,
where you are in the game, in terms of the year and month, when the game
ends, and how many more transactions you have left for your turn.</p>
                <br/>
                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
                    <p><strong><em>Date Label.</em></strong> This label tells you what calendar
month and day it is (in the game), and the current "year" of the
game, such as "April 4, 2029." It also shows the date on which
the game will end.</p>
                    <br/>
                    <p><strong><em>"Next Earnings:" Label.</em></strong> This shows the month, day and
year in which the next earnings report will be released for the current
${helpLink('chap03_III(A)', 'Active Entity')} (if it is a corporation).</p>
                    <br/>
                    <p><strong><em>"Player:" Label.</em></strong> This label displays the
name of the player whose turn it is, at present.</p>
                    <br/>
                    <p><strong><em>"Transactions Remaining:" Label.</em></strong> This label shows
how many transactions, at most, the current player can do, before ending
his or her turn. The length of your turn can
never exceed 3 calendar quarters, even if you engage in no transactions.</p>
                </blockquote>
            </div>
            <br/>

            <div id="chap05_V(C)(5)">
                <h4><u>(5) ECONOMIC DATA DISPLAY ITEMS</u></h4>
                <br/>
                <p>The main Wall $treet
Raider screen has several display boxes that are updated each time
any of certain key economic indicators change. Click on any of the
numbers that appear in these displays to see a chart for that item,
such as the stock index, Prime Rate, or any of the commodities.</p>
                <br/>
                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
                    <p><strong><em>"Stock Index" Item.</em></strong> This item shows the stock
market "Global 1500" index, which changes every second when the stock
ticker is running. It is an index of the stock prices of all the existing companies
in the simulation. The stock index always begins each game at 5000.</p>
                    <br/>
                    <p><strong><em>"Prime Rate" Item.</em></strong> This item displays the
current "prime rate" of interest charged by banks to their best
("AAA") customers. It moves up or down in .25 point increments.</p>
                    <br/>
                    <p><strong><em>"GDP Growth" Item.</em></strong> This is the current growth rate
in the Gross Domestic Product. A typical growth rate is about 2.5%.</p>
                    <br/>
                    <p><strong><em>"Spot Crude" Item.</em></strong> This is the "spot price"
(current market price) for crude oil, on world markets, and is always
shown in U.S. dollars in Wall $treet Raider. In this simulation, $100 (U.S.) is an average or typical oil price.</p>
                    <br/>
                    <p><strong><em>"Spot Gold" Item.</em></strong> In Wall Street Raider, the spot price
of gold is always shown in U.S. dollars, and a typical or "normal" price
for gold is around $1,200 per Troy ounce.</p>
                    <br/>
                    <p><strong><em>"Spot Silver" Item.</em></strong> The spot price of silver is also
always shown in U.S. dollars. A typical or "normal" price for silver
is about $20 per Troy ounce.</p>
                    <br/>
                    <p><strong><em>"Spot Wheat" Item.</em></strong> The spot price of wheat is always
shown in U.S. dollars, with a typical or "normal" price for wheat
being around $5 per bushel.</p>
                    <br/>
                    <p><strong><em>"Spot Corn" Item.</em></strong> The spot price of corn is always
shown in U.S. dollars. A typical or "normal" price
for corn is $5 per bushel.</p>
                    <br/>
                    <p><strong><em>"Long Bond" Item.</em></strong> This item shows the latest bond
yield to maturity of the long-term government bond. This interest
rate is usually lower than the Prime Rate, but higher than the
yield to maturity (interest rate) on the short-term government bond.</p>
                    <br/>
                    <p><strong><em>"Short Bond" Item.</em></strong> This item shows the latest bond
yield to maturity of the short-term government bond. This interest
rate is usually lower than the Prime Rate and lower than the yield
to maturity on the long-term government bond.</p>
                </blockquote>
            </div>
            <br/>

            <div id="chap05_V(C)(6)">
                <h4><u>(6) STOCK AND NEWS TICKERS</u></h4>
                <br/>
                <p>The main screen of Wall $treet Raider
has both a moving stock ticker and a scrolling "news ticker." The stock
ticker shows prices of a random sampling of companies in the simulation,
and the price change on the latest trade in that stock. The news ticker
displays a scrolling list of several of the most recent news headlines,
referring to recent events in the current game.</p>
                <br/>
                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                    <p><strong>IMPORTANT NOTE:</strong> In Wall $treet Raider, for the most part, time
only passes, and the game only progresses, when the stock and news
ticker on the main menu screen are running. You can toggle the ticker
on or off by clicking on the "${helpLink('chap05_V(D)(2)', 'Ticker On/Off')}"
button.</p>
                </blockquote>
            </div>
            <br/>

            <div id="chap05_V(C)(7)">
                <h4><u>(7) SEARCH FUNCTION BUTTONS</u></h4>
                <br/>
                <p>The main Wall $treet Raider
screen has a section, containing nine buttons, labeled "Search
Functions." The functions of these buttons are described in
${helpLink('chap10_X(H)', 'Chapter 10, Section H')}.</p>
            </div>
            <br/>

            <div id="chap05_V(C)(8)">
                <h4><u>(8) STREAMING STOCK QUOTES LIST</u></h4>
                <br/>
                <p>The main Wall $treet
Raider screen has a section, labeled "Streaming Stock Quotes List."
That large section on the right-hand side of the main screen
is empty at the start of a game. However, at any time, you can
add up to 15 stocks to this list, which will display the current
stock prices for each of the stocks on the list.</p>
                <br/>
                <p>To add a stock to the list, you must first select that stock
as the ${helpLink('chap03_III(A)', 'Active Entity')}. If you have turned on the "AutoAdd To
StreamList" setting in the "Settings" pulldown menu, the stock
will automatically be added to the list.</p>
                <br/>
                <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
                    <p><strong><em>"Add/Delete" (colored button).</em></strong> Clicking on
this button will add the stock of the currently selected
${helpLink('chap03_III(A)', 'Active Entity')}
to the streaming quotes list, or will delete that company
from the list if it is already on the streaming quotes list.</p>
                    <br/>
                    <p><strong><em>"Select" (colored button).</em></strong> Clicking on this
button will bring up a
"pick-list" of all the companies on the streaming quotes list.
Double click on any stock on the pick list to make it the
${helpLink('chap03_III(A)', 'Active Entity')}.</p>
                    <br/>
                    <p><strong><em>"Fill" (colored button).</em></strong> Clicking on this
button fills in any empty
slots on the list with stocks you own, or in which you
have a short sale position.</p>
                    <br/>
                    <p><strong><em>"Clear" (colored button).</em></strong> Clicking on this
button will clear the
current list of stocks, in the event you want to start over
with your list.</p>
                </blockquote>
            </div>
        </div>
        <br/>

        <div id="chap05_V(D)">
            <h3><strong><em>D. "TRADING DESK" NON-MENU BUTTON FUNCTIONS (MAIN MENU SCREEN)</em></strong></h3>
            <br/>

            <div id="chap05_V(D)(1)">
                <h4><u>(1) "GO" BUTTON</u></h4>
                <br/>
                <p>This button works in conjunction
with the text input box it is located next to, in the
"Active Entity Selected" group of items on the main screen.
To select a company as the ${helpLink('chap03_III(A)', 'Active Entity')},
you can simply type in its stock symbol (if known) in the text
input box, and then either press the [ENTER] key, or click
on the small "Go" button next to the text input box.</p>
            </div>
            <br/>

            <div id="chap05_V(D)(2)">
                <h4><u>(2) "TICKER ON/OFF" (or "START TICKER") BUTTON</u></h4>
                <br/>
                <p>This is a
toggle button. Click on it to make the stock and news headline tickers
run (if not running), or to stop the tickers if they are moving.</p>
                <br/>
                <p>Note that "time" progresses as the stock ticker and the news
ticker run. However, time will progress (somewhat) even if you have
turned off the stock ticker. Each time you close a Menu or
complete (or cancel) a transaction, the program will compute earnings
for a few companies.</p>
            </div>
            <br/>

            <div id="chap05_V(D)(3)">
                <h4><u>(3) WALL $TREET RAIDER LOGO IMAGE</u></h4>
                <br/>
                <p>The Wall $treet
Raider logo image that stretches across the top part of the client area
of the main menu screen is actually a type of hidden "button." However,
this button responds only to a double-click, and only if a game has
been loaded into memory and started, and if "Cheat Mode" is turned
"ON" in the "Settings" pull-down menu. It is the ultimate "cheat"
button, since double-clicking on it allows you to increment your
(the player's) cash balance by up to $1 trillion, or decrease it to
zero, by entering a positive or negative amount into a small dialog
box that will pop up.</p>
                <br/>
                <p>If you added to your
cash balance, that game's results would be disqualified
and thus will not be counted as a "best score,"
since you have elected to cheat so blatantly.</p>
                <br/>
                <p>This feature can be quite helpful if you are new to playing
Wall $treet Raider, and are finding it difficult to build your
net worth to a size where you can take over some large
companies and do great things. By adding up to $1 trillion
(once) to your bank account, you can get the money you need to
experiment with running large corporate empires, sort of like
"training wheels" on a bicycle.</p>
            </div>
        </div>
    </div>`;
}
