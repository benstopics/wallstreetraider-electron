import { html } from '../lib/preact.standalone.module.js';

function openLink(url) {
    window.open(url, '_blank');
}

// Placeholder function for internal help links - will be implemented to navigate within help system
function help_link(anchorKey, linkText) {
    // TODO: Implement navigation to help section by key
    return html`<a href="#" onClick=${(e) => { e.preventDefault(); console.log('Navigate to:', anchorKey); }}>${linkText}</a>`;
}

export const HELP_TEXT = [
    {
        section: ['Strategy Manual', 'Chapter I: Introduction'],
        content: html`<div>
            <p>Welcome to the Wall Street Wars! WALL $TREET RAIDER (W$R)
is a sophisticated real-time simulation of the no-holds-barred
corporate gamesmanship that has occupied the headlines so much in
the last few years. This simulation allows 1 to 5 players to invest
in and manage any one or more of up to 1570 companies in 70 different
industry groups, or invest in any of 20 exchange-traded investment
funds ("ETF's"), in a competitive, "smart" financial environment.
There are almost no limits imposed upon your financial creativity,
other than the hard realities of the economy and the marketplace.</p>
<br/>
<p>To operate Wall $treet Raider, your Windows® personal computer
(running Win XP/VISTA/Win7 to Win11) doesn't need any special
adaptations or equipment, such as joysticks. (However, to run the
program on a Mac system, you will need to obtain one of the many
"Windows emulation" programs that allow you to run Windows programs
on your Mac.) Wall $treet Raider does an enormous number of
computations every second, to constantly change and update the
current game's database, so it takes full advantage of the speed
of all relatively new computers, made in the last 10 years or so.</p>
<br/>
<p>The environment in which Wall $treet Raider is played
consists of an economic model within which almost everything is
interrelated. GDP growth rates, oil and other commodity prices,
interest rates, bond market prices, housing starts and other
economic variables all interact with each other and affect
stock prices and the growth of demand in 67 industry groups.
The other four (financial) industry groups, banks, insurance
companies, holding/trading companies, and exchange-traded
funds, are mainly affected by their investments in stocks
and bonds of other companies or, in the case of banks, loans
they make, and are only indirectly affected by the economy,
for the most part, although banks are strongly affected by
interest rates.</p>
<br/>
<p>The corporations (1000 or more of them being "live" at
any one point in time during a game, potentially up to 1570
companies plus the 20 ETFs) each operate in a relatively
"smart" fashion, reacting (sometimes slowly, sometimes
instantly) to changes in economic and industry conditions,
in an extremely competitive, Darwinian fashion. The number
of "live" companies fluctuates, as new corporations are
"born," generally startups that enter industries where profit
margins are high, while other companies are either going
bankrupt and going completely out of business, or are being
acquired by another company and liquidated into that parent
company.</p>
<br/>
<p>Once you take control of a corporation, however, the program
turns the management of the company over to you. From then on,
unless you lose voting control of the company, it will be
up to you to make decisions about growth, financing, how
much to spend on R & D, whether to pay dividends, whether
to restructure the company, etc.</p>
<br/>
<p>However, recent versions of the program have an "autopilot"
setting you can choose, under which the companies you control
will generally be managed by the program, like other companies
that you don't control. One exception, if you are using the
"autopilot" setting, is the company (if any) of which you
are the President and CEO -- you are fully responsible for
managing it. However, you can turn the "autopilot" setting on
or off for any individual company (other than the one of
which you are President and CEO), using the "Turn AutoPilot
ON (OFF)" button on the Management Menu. Use that button to
make an exception to the "global" AutoPilot setting that you
have made on the Settings Menu. You probably will not need
to turn on AutoPilot for any companies you control until you
feel you control too many companies to effectively manage all
of them. At that point, you can put some or all of them on
AutoPilot.</p>
<br/>
<p>Meanwhile, as you play a game, a "live" stock ticker runs
across the screen most of the time, as earnings, dividends,
taxes, and loan payments are computed for each of the 1590
companies each calendar quarter, and stock and bond prices
are recomputed almost every second. Thus, if the ticker on
the main screen is running, the underlying financial and
economic database is undergoing constant change while you
plot and scheme mergers, stock buybacks, and takeovers of
opponents' companies, or try to wear down the opposition
with antitrust lawsuits or try to figure out what to do
about your own company's sagging earnings. Or maybe just
let the ticker run and wait to see what happens, at times,
waiting for the right time to take advantage of some trend
or development you observe.</p>
<br/>
<p>If you're ready to plunge into your first game of Wall $treet
Raider (which you've very likely done already, since you are
reading this strategy manual, which is loaded from a link in
Wall $treet Raider), you will find that it is very easy to play
this simulation at a basic level-- buying and selling stocks and
bonds is quite simple to do (using the Buy Stock or Sell Stock
buttons, or buttons on the "BUY / SELL" menu). However, you will
also find out that to play it well, you will need to hone your
investing instincts and expand your knowledge of the stock and
bond markets, economics, and corporate finance. This game is a
bit like playing chess -- anyone can learn to play it in a few
minutes, but not everyone can play it well -- only those who are
real students of the game!</p>
<br/>
<p>However, you will learn a lot about all of the above, by
trial and error, if you spend much time playing Wall $treet
Raider. A lot of "addicts" to this game who began playing as
teenagers have told us they owe their present careers on Wall
Street or as traders on stock exchanges in Shanghai or Singapore,
or as hedge fund or mutual fund managers, to what they learned
playing this simulation over the years.</p>
<br/>
<p>To learn more quickly, this "strategy manual" for Wall $treet
Raider will give you a very detailed look at every part of the
simulation, in terms of how every feature in it works, and also
in terms of the underlying economic, accounting, legal and financial
models that Wall $treet Raider attempts to simulate, and where such
underlying concepts tend to track, or differ from, the real financial
world.</p>
<br/>
<p>Our hope is that, after playing with this simulation for
a year or two, and seeing what works, and what generally
doesn't, in investing in stocks and bonds, you will be much
better prepared, more skeptical, and more able to analyze
corporate financial information when you make REAL investments
in stocks or corporate bonds. If you had played Wall $treet Raider
for years, it is doubtful that you would have been "suckered" into
paying 50 times sales for companies with zero earnings during the
"Dot.com" bubble and ensuing collapse of the stock prices of such
absurdly overpriced companies, as so many naive investors did.
Those who didn't think it was "cool" to buy stocks of "hot"
companies whose capitalization at one point, for companies like
AOL or Cisco, approached the entire GDP of the nation of Canada,
mostly escaped the madness and the crash that followed.</p>
<br/>
<p>In our opinion, it is much better to lose a few billion
a few dozen times playing Wall $treet Raider, than to lose
half your life savings in the real market after being sold a
bunch of grossly overpriced stocks of "trendy" companies by
fast-talking financial hucksters. Playing the investment game
with real money, in real markets, without a good understanding
of what it's all about, is the road to instant poverty.</p>
<br/>
<p>We earnestly hope the small sum you spent on Wall $treet
Raider will be the best investment you've ever made, so far.
To see how various players of this simulation say they have
benefited in their careers from what they learned after years
of playing W$R, <a onClick=${() => openLink('http://www.roninsoft.com/comments.htm')}>click here.</a></p>
<br/>
<p>Enjoy. And take no prisoners!</p>
        </div>`
    },
    {
        section: ['Getting Started', "Step 1 - Now What?"],
        content: html`<div>
            <p>You will notice, when you first launch the Wall $treet Raider
program, that all of the buttons on the screen are grayed out.
Thus, you cannot use any of those command buttons until you have
either loaded a new game into memory, or loaded in a saved game
that you had saved to disk earlier.</p><br/>

<p>As soon as you finish loading a new or saved game, the
buttons on the main screen will all be turned on, except
the "Select Last" button, which will turn on once you have
selected a corporation to invest in or do some research on.
Some buttons on certain "pop-up" menus that only apply to
corporations will be missing at times during a game, if the
currently selected "${help_link('chap03_III(A)', 'Active Entity')}"
at a particular moment is you, a human player, rather than a
corporation. Or vice versa, for certain buttons that only appear if
you, the player, are the current "Active Entity" or "Transacting Entity."
Various other buttons on such menus also may not be visible at other
times, depending on the type of corporation selected as the "Active Entity"
or "Transacting Entity." (For example, the "CHANGE BANK" button on the
"OTHER TRANS." menu will not be shown if you have selected a bank you
control as the "Active Entity," since that function allows a player or
a non-bank company the player controls to change banking relationship to
a different bank, where cash will be deposited and from whom loans may be
obtained.)</p><br/>

<p>At this point, before starting a game, the only parts of the
program that will function are certain functions in the "File,"
"Game Options," "Settings," and "Help" menus in the upper left hand
part of the main Wall $treet Raider screen. See STEP TWO below,
for a discussion of which of those options you may select <u>before</u> a
game is loaded, or only <u>after</u> loading, or, in some cases,
before <u>OR</u> after.</p><br/>

<p><u>STEP TWO--YOUR OPTIONS BEFORE/AFTER STARTING A NEW GAME.</u> Some
of the items on the "File," "Game Options," and "Settings" menus
can only be used before loading game data into memory; some can only be
used after loading; and others can be used at any time. (The "Help"
menu items can be clicked on and used at any time, before or after
starting play.)</p><br/>

<p>The following is a brief summary of which of the menu items
can be used at which times.</p><br/>

<p>FILE MENU ITEMS. If you click on the "FILE" menu item, a
dropdown menu will show you the following choices:</p><br/>

<dl>
  <dt>File Menu Options:</dt>
  <dd>
    <ul>
      <li>New Game</li>
      <li>Open Saved Game</li>
      <li>Save Game</li>
      <li>Save Game As</li>
      <li>Exit — Alt+F4</li>
    </ul>
  </dd>
</dl>

<p>To start a new game, click on "New Game"; to load a previously saved
game, click on "Open Saved Game".</p><br/>

<p>The "Save Game" and "Save Game As" items will not function
until a set of new game data has been loaded into memory and started, or a
saved game file has been loaded. Once game data has been loaded, the "Open
Saved Game" item will be grayed out and no longer functional, while the "New
Game" item will be changed to read "Restart W$R."</p><br/>

<p>The "Exit" item can be used to exit the program at any time, before or
after loading a game into memory.</p><br/>

<p>GAME OPTIONS MENU ITEMS. If you click on the "GAME OPTIONS" menu item,
a dropdown menu will show you the following choices:</p><br/>

<dl>
  <dd>
    <blockquote>
      <ul>
        <li>High Score</li>
        <li>Customizer Utility</li>
        <li>Updates</li>
        <li>Upgrades</li>
        <li>W$R Forum</li>
        <li>Online Tutorial</li>
        <li>View W$R Manual</li>
        <li>Speculator Stock Trading Game</li>
      </ul>
    </blockquote>
  </dd>
</dl>

<p>If you have not purchased the "Full Package" that includes the
W$R Manual files, the second last item will not be shown and it will
instead read "Order W$R Manual" and will link to the ordering page
for the "Add-on Package" on the Ronin Software website.</p><br/>

<p>SETTINGS MENU ITEMS. If you click on the "SETTINGS" menu item,
a dropdown menu will show you the following choices (with the default
settings, except for Currency selection, Select Law Firm, or Clear
Chart History for Active Entity):</p><br/>

<dl>
  <dd>
    <blockquote>
      <ul>
        <li>Ticker Speed: 50</li>
        <li>Currency (or Reselect Currency)</li>
        <li>Cheat Mode Is: ON</li>
        <li>Select Law Firm</li>
        <li>Suppress Popups: OFF</li>
        <li>Suppress Earn Rept.: OFF</li>
        <li>Suppress Cash Flow Warnings: OFF</li>
        <li>AutoSave: OFF</li>
        <li>Exercise Options? NO</li>
        <li>Make Physical Delivery? NO</li>
        <li>Take Physical Delivery? NO</li>
        <li>Sweep Cash To Reduce Loan? Yes</li>
        <li>Stock Chart Size: Small</li>
        <li>Clear Chart History for Active Entity</li>
        <li>AutoAdd to StreamList Is: OFF</li>
        <li>AutoPilot (Global) Is: OFF</li>
        <li>Max Growth Rate (Global) Throttle: 60%</li>
      </ul>
    </blockquote>
  </dd>
</dl>

<p>Prior to starting a game, you can select any of the "GAME OPTIONS" menu or
"SETTINGS" menu items, except the "Cheat Mode," "Select Law Firm," "Sweep,"
"Clear Chart History," and "Max Growth Rate Throttle" items, which are grayed
out, and the "AutoPilot" item, which can only be selected after a game has
begun, by each player, once the number of players and their names have been
determined, and after a new game data set has been created or a saved game
has been loaded. If you forget to select a law firm (cheap, average, or
expensive are your choices) after a game is started, don't worry: the
program will assign you an "average" law firm to represent you in antitrust
cases or other lawsuits that may arise during the game, as the default law
firm (which you can change at any time). Also, if you don't turn "Cheat Mode"
off, its default status is "On."</p><br/>

<p>After a game is started, you may select any of the items on the
"GAME OPTIONS" or "SETTINGS" menus, including the "Currency" item. However,
if you want to change the selected currency from, say, U.S. dollars to Swiss
francs, you will need to make the currency selection BEFORE starting a new
game. Otherwise, the currency selection will not go into effect until the next
<u>new</u> game you start. (The currency selected in a saved game cannot
be changed for that game.) The default setting for the "Suppress Popups,"
"Suppress Earn Rept.," "Suppress Cash Flow Warnings," "AutoSave," "Exercise
Options?," "Stock Chart Size," "Sweep Cash To Reduce Loan" and "AutoAdd
Streamlist" items in a new game is whatever was last set by a player in the
last game played.</p><br/>

<p>HELP MENU ITEMS. If you click on the "HELP" menu item, a dropdown
menu will show you the following choices:</p><br/>

<div>
    <ul>
        <li>Wall Street Raider HELP - F1</li>
        <li>Registration Info</li>
        <li>About</li>
    </ul>
</div>

<p>You can view any of the above "HELP" menu items by clicking on them any
time they are visible, before or after game data is loaded. The "Wall Street
Raider HELP" item takes you to the Wall $treet Raider "help" system contents
list. Now that you have "Wall $treet Raider -- The Book" installed, you probably
will not have much use for the "HELP" system, since this strategy manual provides
much more detailed information on most subjects, and covers many areas that
are not mentioned in the "HELP" files. However, "HELP" is still handy as a
quick reference, such as for what a certain button does. The "HELP" program, when
it is opened, also includes a "GLOSSARY" button that will bring up an extensive
glossary of terms used on Wall Street and in investing generally.</p><br/>

<p>The "Registration Info" and "About" items simply list Wall
$treet Raider copyright and version information for the version or release
of Wall $treet Raider you are using and display your registration number,
for your future reference in case you need customer support or want to
upgrade to a newer version at a reduced price. The first time you run the
program after installing it, you are asked to enter and save your registration
number (order number) that you received by email from our online commerce
vendor.</p><br/>
        </div>`
    },
]