import { html } from '../lib/preact.standalone.module.js';

export default function HelpChapter2Content({ helpLink }) {
    return html`<div>
        <p>No one likes to buy or download a computer program and face
hours of poring over complex user manuals to get it properly
installed so it can be used. You won't have that problem with
Wall $treet Raider, even if you are a relative computer novice,
as it will only take you a few seconds to start up a game,
once you have launched Wall $treet Raider.</p>
<br/>
<p>However, if you are not a "stock market junkie" or a person who
is familiar with corporate finance and investment concepts, you
may find all the financial terminology and the complex tools and
transactions Wall $treet Raider lets you engage in to be somewhat
bewildering. If so, you will find this strategy manual a very useful
"primer" on when and how to use various features in Wall $treet
Raider, such as mergers, liquidations, and other transactions, since
it explains how these financial operations work, both in the "real
world" and in this software simulation, which we have tried to
make as realistic as possible. There is also a glossary in this
manual, as well as in the "HELP" function if you click on "HELP"
from the main menu screen.</p>
<br/>
<p>Since you are probably reading this text on your computer, it
is very likely that you have already installed Wall $treet Raider,
and you have clicked on the "Game Options Menu" link to "View W$R
Manual," which loaded the Table of Contents for this Wall $treet
Raider strategy manual ("Wall $treet Raider -- The Book"), which
then led you to this page.</p>
<br/>
<p>Just follow the simple instructions below, and, if you are
using Wall $treet Raider for the first time, you will be playing
your first game in just a couple of minutes. If you've already
started playing, you may still find the information in the
following paragraphs in this chapter below to be useful, as it
will tell you which configuration choices for Wall $treet Raider
can (or must be) selected before or after starting a game.</p>
<br/>
<div id="chap02_II(1)">
<h3><u>STEP ONE--YOU'VE LAUNCHED WALL $TREET RAIDER -- NOW WHAT?</u></h3>
<br/>
<p>You will notice, when you first launch the Wall $treet Raider
program, that all of the buttons on the screen are grayed out.
Thus, you cannot use any of those command buttons until you have
either loaded a new game into memory, or loaded in a saved game
that you had saved to disk earlier.</p>
<br/>
<p>As soon as you finish loading a new or saved game, the
buttons on the main screen will all be turned on, except
the "Select Last" button, which will turn on once you have
selected a corporation to invest in or do some research on.
Some buttons on certain "pop-up" menus that only apply to
corporations will be missing at times during a game, if the
currently selected "${helpLink('chap03_III(A)', 'Active Entity')}"
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
obtained.)</p>
<br/>
<p>At this point, before starting a game, the only parts of the
program that will function are certain functions in the "File,"
"Game Options," "Settings," and "Help" menus in the upper left hand
part of the main Wall $treet Raider screen. See STEP TWO below,
for a discussion of which of those options you may select <u>before</u> a
game is loaded, or only <u>after</u> loading, or, in some cases,
before <u>OR</u> after.</p>
</div>
<br/>
<div id="chap02_II(2)">
<h3><u>STEP TWO--YOUR OPTIONS BEFORE/AFTER STARTING A NEW GAME.</u></h3>
<br/>
<p>Some of the items on the "File," "Game Options," and "Settings" menus
can only be used before loading game data into memory; some can only be
used after loading; and others can be used at any time. (The "Help"
menu items can be clicked on and used at any time, before or after
starting play.)</p>
<br/>
<p>The following is a brief summary of which of the menu items
can be used at which times.</p>
<br/>
<p><strong>FILE MENU ITEMS.</strong> If you click on the "FILE" menu item, a
dropdown menu will show you the following choices:</p>
<br/>
<ul>
  <li>New Game</li>
  <li>Open Saved Game</li>
  <li>Save Game</li>
  <li>Save Game As</li>
  <li>Exit -- Alt+F4</li>
</ul>
<br/>
<p>To start a new game, click on "New Game"; to load a previously saved
game, click on "Open Saved Game".</p>
<br/>
<p>The "Save Game" and "Save Game As" items will not function
until a set of new game data has been loaded into memory and started, or a
saved game file has been loaded. Once game data has been loaded, the "Open
Saved Game" item will be grayed out and no longer functional, while the "New
Game" item will be changed to read "Restart W$R."</p>
<br/>
<p>The "Exit" item can be used to exit the program at any time, before or
after loading a game into memory.</p>
<br/>
<p><strong>GAME OPTIONS MENU ITEMS.</strong> If you click on the "GAME OPTIONS" menu item,
a dropdown menu will show you the following choices:</p>
<br/>
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
<br/>
<p>If you have not purchased the "Full Package" that includes the
W$R Manual files, the second last item will not be shown and it will
instead read "Order W$R Manual" and will link to the ordering page
for the "Add-on Package" on the Ronin Software website.</p>
<br/>
<p><strong>SETTINGS MENU ITEMS.</strong> If you click on the "SETTINGS" menu item,
a dropdown menu will show you the following choices (with the default
settings, except for Currency selection, Select Law Firm, or Clear
Chart History for Active Entity):</p>
<br/>
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
<br/>
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
off, its default status is "On."</p>
<br/>
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
last game played.</p>
<br/>
<p><strong>HELP MENU ITEMS.</strong> If you click on the "HELP" menu item, a dropdown
menu will show you the following choices:</p>
<br/>
<ul>
  <li>Wall Street Raider HELP - F1</li>
  <li>Registration Info</li>
  <li>About</li>
</ul>
<br/>
<p>You can view any of the above "HELP" menu items by clicking on them any
time they are visible, before or after game data is loaded. The "Wall Street
Raider HELP" item takes you to the Wall $treet Raider "help" system contents
list. Now that you have "Wall $treet Raider -- The Book" installed, you probably
will not have much use for the "HELP" system, since this strategy manual provides
much more detailed information on most subjects, and covers many areas that
are not mentioned in the "HELP" files. However, "HELP" is still handy as a
quick reference, such as for what a certain button does. The "HELP" program, when
it is opened, also includes a "GLOSSARY" button that will bring up an extensive
glossary of terms used on Wall Street and in investing generally.</p>
<br/>
<p>The "Registration Info" and "About" items simply list Wall
$treet Raider copyright and version information for the version or release
of Wall $treet Raider you are using and display your registration number,
for your future reference in case you need customer support or want to
upgrade to a newer version at a reduced price. The first time you run the
program after installing it, you are asked to enter and save your registration
number (order number) that you received by email from our online commerce
vendor.</p>
</div>
<br/>
<div id="chap02_II(3)">
<h3><u>STEP THREE--START A NEW GAME OF WALL $TREET RAIDER.</u></h3>
<br/>
<p>To start a new game of Wall $treet Raider, click on the "FILE" menu and
select the "New Game" item from the dropdown menu that will appear. When
you do so, you will then be asked if you want "computer" to be one of
the 2 to 5 players. Answer "Yes" if you want to play against one or more
computer players, or "No" if you do not, or else click on "Cancel" to return
to the main menu screen. If you answered "Yes" or "No" to the question, you
will next be prompted to enter the number of players for the upcoming game,
which must be 2, 3, 4 or 5 players.</p>
<br/>
<p>Next, if you indicated you wanted to play against a computer player
or players, you will be asked how many of the total number of players will
be human players.</p>
<br/>
<p>After you have entered the number and type of players, a game "Startup Choices"
input screen will appear, on which you can either accept the defaults by
clicking on "OK" (the program "remembers" what you entered from the last
new game you started, if any), or you can enter different names for the
players if you like. Also, you can enter a dollar amount that you want
each player to have at the start of the game (U.S. dollars -- which
will be converted to its equivalent in the other currency if you chose
another currency, once the game starts). You can enter any number from
100 to 1,000, which will be the number (in millions) of U.S. dollars or the
equivalent that you will start the game with. Also, on this input screen
you can enter the length (in years) that the game will last, from 1 year
to 35 years, and can select a difficulty level of 1 (easiest), 2 (medium
difficulty) or 3 (more difficult, where computer player is more aggressive),
or 4 (same as Level 3, but the game may "enact" various types of taxes on
capital at times during the game, such as an "Oil Windfall Profits Tax").</p>
<br/>
<p>Once you have set all the game parameters the way you want them,
click on the "OK" button, then click on "OK" again on the small
message box that comes up, which says "Ready to start new game # ...."
(assigning a game number to this game). The program will then take
a few seconds to create and randomize a starting database for the new
game. When it has finished, the program will announce which player gets
to play first (randomly selected), and the game will get under way when
you click on "OK" on the small message box or boxes that will appear.
At that point, the stock ticker will begin moving, and the game has
begun!</p>
<br/>
<blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
<p><strong><u>NOTE:</u></strong> IN WALL $TREET RAIDER, "TIME" PASSES MAINLY WHEN THE STOCK TICKER
IS MOVING. WHEN THE TICKER IS MOVING, THE PROGRAM IS CALCULATING QUARTERLY
EARNINGS FOR EACH OF THE NEARLY 1,600 COMPANIES IN THE SIMULATION THAT ARE
CURRENTLY ACTIVE (USUALLY ABOUT 1,000 TO 1300), AND DOING THOUSANDS OF OTHER
CALCULATIONS EVERY SECOND, CONSTANTLY MASSAGING AND UPDATING THE DATA BASE.</p>
</blockquote>
</div>
<br/>
<div id="chap02_II(4)">
<h3><u>STEP FOUR--RESUME A PREVIOUSLY SAVED GAME.</u></h3>
<br/>
<p>If you have not yet loaded a set of game data into memory, you have
the choice of either starting a new game (using the "File/New Game"
menu item), or continuing with a game you have previously saved to
disk. If you have previously saved a game, you can load the saved
game into memory merely by clicking on the "File/Open Saved Game"
menu item.</p>
<br/>
<p>When you click on "File/Open Saved Game," you will be asked if you
want to continue with the last game you were playing (and the game
number, from 1 to 50, will be displayed, such as "#7"). If you select
"Yes," that game will be loaded into memory, and the game will resume
at the point where you were when you saved it. If you select the "No"
button, a new dialog box will appear, asking you to enter the number
of the game you saved, which can be a number from 1 to 50. Or, if
you click on the "Cancel" button, you will be returned to the main
menu screen, and you can start a new game, instead, if you wish.</p>
<br/>
<p>If you have entered the game number of a game that has been saved
to disk, the game data file will then be loaded into memory, or you will
see an error message if there is no such file to be found, and you will
be asked to enter another game file number. If the saved game data file
is found and loaded, say for game #7, a message will briefly appear,
as follows:</p>
<br/>
<p style="text-align: center;">"Saved game # 7 loaded successfully."</p>
<br/>
<p>The stock ticker will begin moving and your saved
game is up and running again at this point. Loading a saved game
will usually only take about 1 or 2 seconds, depending on how fast
your hard disk drive is. It can take considerably longer if you
are using an old, slow computer, more than about 5 or 6 years old.
(However, depending on the anti-virus software you are using, it
may take up to about a minute to load the file.)</p>
</div>
<br/>
<div id="chap02_II(5)">
<h3><u>STEP FIVE--SAVING A GAME ON DISK.</u></h3>
<br/>
<p>After you have started a game, you will find that it can take a
number of hours to complete a full game, depending on the number
of years you selected for the game length (up to 35 maximum), and
the speed at which the stock and news headlines tickers are moving.
Obviously, there will be times when you want to save the game at
some point, and return to it later. (Of course, if you are the only
human player, and you go bankrupt, the game will end at that point,
after making a few humiliating comments about your competence as an
investor.)</p>
<br/>
<p>Saving a game of Wall $treet Raider is quite simple. At any
point during the game, just click on "FILE/SAVE GAME" to save
the current game under whatever number it has been assigned, such
as game #7. Also, if you have saved the same game previously as
#7, and think you might want to go back and replay it from where
you saved it earlier, you can save the game at whatever stage you
have reached at present, by using "FILE/SAVE GAME AS" and entering
a new game number, such as 8.</p>
<br/>
<blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
<p><strong>EXAMPLE:</strong> Assume you start Game #7 in 2022, and it is
to last for 35 years, until 2057. After an hour of play, you
might then save it as Game #7 during Year 2023. Later, when you
resume, you might play until the Year 2026, and decide to save
the game as Game #8 at that point. Thus, the next time you
launch Wall $treet Raider, you could either choose to start play
again in 2023 (selecting Game #7), or could resume it in 2026 by
selecting Game #8 to load into memory.</p>
</blockquote>
<br/>
<p>Saving a game will usually take about 5 seconds, which is
how long it takes on our old Windows 7 laptop.</p>
</div>
<br/>
<div id="chap02_II(6)">
<h3><u>STEP SIX--COMPLETING A GAME.</u></h3>
<br/>
<p>Once a game has ended,
at the beginning of the year that is shown as the ending year,
the program will announce that the game is over and will name
the winner. Most buttons will be grayed out and will no longer
work, once the game has ended. However, if you wish to savor
your victory (or wallow in your defeat), you may still pull
up various items of information on companies and industries,
such as stock and commodity charts, companies' final earnings
reports or players' or companies' Financial Profiles.</p>
<br/>
<p>If you wish to see the detailed information for a particular player (if not
bankrupt) enter the number "1" in the "Stock Symbol" entry box on the
main screen, instead of a stock symbol, to see information for Player #1
(as listed on the "Who's Ahead?" screen), or enter "2" to see information
for Player #2, and so forth. (Entering numbers of 10 or less in the Stock
Symbol entry box during a game will just generate an error message, since
you are not allowed to directly see the details of an opposing player's
financial situation during a game; that is "private" information.)</p>
<br/>
<p>Click on File/Exit to exit the program, when you are finished.</p>
<br/>
<p>Note that in some cases, a game may end prematurely, if
all of the human players have been bankrupted. In that case
their financial records will be expunged, to save all players
from further humiliation and no further access to the game data
records for that game will be available, unless you reload the
last saved game file for that game, if any, and continue playing
from that point....</p>
</div>
    </div>`;
}
