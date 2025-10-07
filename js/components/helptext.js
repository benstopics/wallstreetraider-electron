import { html } from '../lib/preact.standalone.module.js';

function openLink(url) {
    window.open(url, '_blank');
}

export const HELP_TEXT = [
    {
        section: ['Introduction'],
        content: html`<div>
            <p>Welcome to the Wall Street Wars!  WALL $TREET RAIDER (W$R)
is a sophisticated real-time simulation of the no-holds-barred
corporate gamesmanship. This simulation allows a player to invest
in and manage over a thousand companies in dozens of different
industries, or invest in any of the exchange-traded investment 
funds (ETFs), in a competitive, smart financial environment. 
There are almost no limits imposed upon your financial creativity, 
other than the hard realities of the economy and the marketplace.</p>
<br/>
<p>To operate Wall $treet Raider, your personal computer doesn't need any special 
adaptations or equipment, such as joysticks. Wall $treet Raider does an enormous number of 
computations every second, to constantly change and update the game's database, so it takes
full advantage of state-of-the-art processors.</p>
<br/>
<p>The environment in which Wall $treet Raider is played 
consists of an economic model within which almost everything is 
interrelated. GDP growth rates, oil and other commodity prices, 
interest rates, bond market prices, housing starts, and other 
economic variables all interact with each other and affect 
stock prices and the growth of demand in each industry. 
Insurance companies, holding/trading companies, and exchange-traded 
funds, are mainly affected by their investments in stocks 
and bonds of other companies. Banks are mainly affected by the loans 
they make and interest rates and indirectly affected by the economy.</p>
<br/>
<p>Each of the over 1000 corporations that are active at any point in time
 each operate in a relatively intelligent fashion. They react to changes in the
 economy and industrial conditions in an extremely competitive, Darwinian fashion,
 sometimes slowly, sometimes instantly. There are a number of factors that affect
 the number of active companies at any point in time. New corporations are
 birthed through startup ventures, generally entering high profit margin industries.
 Other companies are either going
bankrupt and going completely out of business, or are being
acquired by another company and liquidated into that parent
company.</p>
<br/>
<p>However, once you take control of a corporation, the management
of the company is turned over to you. From then on,
unless you lose voting control of the company, it will be
up to you to make decisions about growth, financing, R&D spending,
dividends, whether to restructure the company, and much more.
You can enable autopilot globally or for individual companies you control, under which they
will generally be managed by the game, like other companies
that you don't control. The only company which you cannot enable
autopilot for is the one you are currently the President and CEO
of, as you are fully responsible for managing it. You will probably not need
to use autopilot until you feel that you control too many companies to
effectively manage individually.</p>
<br/>
<p>As you play the game, the stock ticker runs
across the screen, news heads and alerts change, letting you know
that the underlying financial and 
economic database is undergoing constant change. Earnings, dividends,
taxes, and loan payments are being computed for each company,
along with stock and bond prices for those companies. All of this
happens while you plot and scheme mergers, stock buybacks, and takeovers of companies,
or try to wear down the opposition with antitrust lawsuits, or try to figure out what to do 
about your own company's sagging earnings. Or maybe just 
let the ticker run and wait to see what happens, at times,
waiting for the right time to take advantage of some trend 
or development that you observe.</p>
<br/>
<p>If you're ready to plunge into your first game, you will find that
the simulation is easy to play at the most basic level. Buying and selling stocks and
bonds is quite simple to do. However, you will 
also find out that to play it well, you will need to hone your 
investing instincts and expand your knowledge of the stock and 
bond markets, economics, and corporate finance. This game is a
bit like playing chess; anyone can learn to play it in a few
minutes, but not everyone can play it well. Only those who are
real students of the game will excel!</p>
<br/>
<p>The best way to learn about all of the above is through 
trial and error. This will not only help you understand the game mechanics,
but also potentially develop your intuition for investing in real life,
as it uses similar principles. A lot of addicts to this game who began playing as
teenagers have told us they owe their careers on Wall
Street (or as traders on stock exchanges in Shanghai or Singapore,
or as hedge fund or mutual fund managers) to what they learned
playing this simulation over the years.</p>
 <br/>
<p>To learn more quickly, this library will give you a very
detailed look at every part of the simulation. It will explain how every
feature in it works in terms of the underlying economic, accounting, legal, and financial 
models that Wall $treet Raider attempts to simulate, and where such 
underlying concepts tend to track (or differ from) the real financial 
world.</p>
<br/>
<p>Our hope is that, after playing with this simulation for 
a year or two and seeing what generally works and what doesn't, you will be much
more skeptical and better prepared to analyze 
corporate financial information when you make <i>real</i> investments 
in stocks or corporate bonds.  If you had played Wall $treet Raider 
for years, it is doubtful that you would have been suckered into 
paying 50 times sales for companies with zero earnings during the 
Dot-com bubble. Maybe you would not have been affected by the ensuing collapse of the stock prices of such 
absurdly overpriced companies as so many naive investors did.  
The ones who escaped the madness and the crash that followed were those
who didn't think it was "cool" to buy stocks of "hot" 
companies whose capitalization at one point approached the entire
GDP of the nation of Canada. These included AOL and Cisco to name a few.</p>
<br/>
<p>In our opinion, it is much better to lose a few billion 
a few dozen times playing Wall $treet Raider than to be sold a 
bunch of grossly overpriced stocks of "trendy" companies by 
fast-talking financial hucksters and lose half your life savings in real life.
Playing the investment game with real money in real markets without a good understanding
of what it's "all about" is the road to instant poverty.</p>
<br/>
<p>We earnestly hope the small sum you spent on Wall $treet
Raider will be the best investment you've ever made, so far.
To see how various players of this simulation say they have 
benefited in their careers from what they learned after years 
of playing W$R, <a onClick=${() => openLink('http://www.roninsoft.com/comments.htm')}>click here.</A></p>
<br/>
<p>Enjoy. And take no prisoners!</p>
        </div>`
    },
    {
        section: ['Getting Started'],
        content: html`<div>
            <p>If you are not familiar with corporate finance and investment concepts, you 
may find the terminology and tools in Wall $treet Raider to be somewhat 
bewildering. If so, you will find this strategy manual a very useful 
primer on when and how to use various features, since 
it explains how these financial operations work, both in the real 
world and in this simulation, which we have tried to 
make as realistic as possible. There is also a glossary in this 
manual, for which its sections also appear throughout the user interface.</p>
<br/>
<p>Just follow the simple instructions herein, and, if you are
using Wall $treet Raider for the first time, you will be playing 
your first game in just a couple of minutes. If you've already 
started playing, you may still find the information in the 
following paragraphs in this chapter below to be useful, as it 
will tell you what how each configuration choice affects the game.</p>
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
currently selected "<a href="#chap03_III(A)">Active Entity</a>"
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

<A NAME="chap02_II(2)"></a>
<p><u>STEP TWO--YOUR OPTIONS BEFORE/AFTER STARTING A NEW GAME.</u>  Some 
of the items on the "File," "Game Options," and "Settings" menus 
can only be used before loading game data into memory; some can only be 
used after loading; and others can be used at any time. (The "Help" 
menu items can be clicked on and used at any time, before or after 
starting play.)</p><br/>

<p>The following is a brief summary of which of the menu items
can be used at which times.</p><br/>

<p>FILE MENU ITEMS.  If you click on the "FILE" menu item, a 
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
expensive are your choices) after a game is started, don't worry:  the 
program will assign you an "average" law firm to represent you in antitrust 
cases or other lawsuits that may arise during the game, as the default law
firm (which you can change at any time). Also, if you don't turn "Cheat Mode" 
off, its default status is "On."</p><br/>

<p>After a game is started, you may select any of the items on the
"GAME OPTIONS" or "SETTINGS" menus, including the "Currency" item. However, 
if you want to change the selected currency from, say, U.S. dollars to Swiss 
francs, you will need to make the currency selection BEFORE starting a new 
game. Otherwise, the currency selection will not go into effect until the next
<U>new</U> game you start.  (The currency selected in a saved game cannot
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
time they are visible, before or after game data is loaded.  The "Wall Street 
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