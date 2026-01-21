import { html } from '../lib/preact.standalone.module.js';

function openLink(url) {
    window.open(url, '_blank');
}

export default function HelpChapter1Content({ helpLink }) {
    return html`<div>
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
    </div>`;
}
