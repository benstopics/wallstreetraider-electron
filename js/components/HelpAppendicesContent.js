import { html } from '../lib/preact.standalone.module.js';

export default function HelpAppendicesContent({ helpLink }) {
    return html`
<h2>APPENDIX</h2><br/>

<div id="appendix_(B)">
<h3>APPENDIX B: COMPANY NAMES AND STOCK SYMBOLS</h3><br/>

<p>When prompted to enter a company's stock symbol in Wall
${'$'}treet Raider, you may enter either the ticker symbol
("IBM", "GE", etc.) or the company ID #, which can range
from #11 to #1600. The program will accept either. However,
unlike the DOS version of Raider, company ID numbers are never
shown in this Windows version, except in the Customizer
Utility add-on program (and sometimes the company ID number
in the Customizer Utility may be the same as for the same
company of the same name in the main program, since newly
formed companies' names during a game are picked from the
list of available company names somewhat at random).</p><br/>

<p>Please note that the stock symbols used in this
simulation are not necessarily the same as the stock
symbols for the real companies. For example, some companies
traded in the over-the-counter or Nasdaq markets in the U.S.
have 5-letter symbols, while this simulation only uses stock
symbols consisting of 1 to 4 letters. In many cases we have
"made up" stock symbols that we feel will be easier to remember
than the real stock symbols, such as "DURB" for Durban Deep
Mining, rather than its real Nasdaq symbol of "DROOY."</p><br/>

<p>Wall ${'$'}treet Raider is our hobby (or addiction, our more
honest friends would say), and it is almost constantly
under revision, as we see things in the financial news
that we find interesting, and which we can devise a way
to recreate in the program in some fashion that will be
realistic and add to the realism and "texture" of the
simulation.</p><br/>

<p>Thus, for example, any time we see that a name change
has been made by a major "real world" corporation that
appears in this simulation, or we see that one such
company has been gobbled up by another, we try to keep
the Wall ${'$'}treet Raider database of companies up to date
by changing the names or ownership of the company in
question. For example, when Hewlett Packard acquired
Compaq Computer, we changed the stock ticker symbol for the
parent company to "HPQ" and changed the stock ownership
of Compaq so it became a 100% subsidiary of Hewlett
Packard, as in real life. Or, when American Home
Products changed its name to Wyeth Corporation a while
back, we updated Wall ${'$'}treet Raider immediately to
reflect the new corporate name.</p><br/>

<p>We welcome your input, any time you may notice that
some company in the simulation has gone through a name
change or been merged out of existence in the real world.
Please let us know, and we will update the database. We
are willing to tolerate a certain amount of nit-picking....
However, we will not always eliminate a company from the
simulation just because it has merged into another. For
example, we didn't do away with Time-Warner when it was
acquired by AOL a few years ago, because the two companies
continue to exist, and one or the other may (soon) be sold
off or spun off by the other -- sort of like the way it can
work in this simulation!</p><br/>
</div><br/>

<hr />

<div id="appendix_(C)">
<h3>APPENDIX C: HOW CREDIT RATINGS AND LOAN RATES ARE DETERMINED</h3><br/>

<p>In Wall ${'$'}treet Raider, except for banks, a player or company's
credit rating and the rate of interest paid on bank loans are
both determined by the player or company's ratio of debt to net
worth. A player or company whose debt is less than 5% of net
worth may have the highest credit rating ("AAA") and, if so, pays
interest at the "Prime Rate." Those with lower credit ratings
generally pay rates that are progressively higher than whatever
the current Prime Rate is. The following table shows the
relationship between debt-to-equity (or debt-to-net worth)
ratios of the borrowers, credit ratings, and rates of interest
paid, for players and for all corporations except banks.</p><br/>

<blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
<pre>
<hr />
DEBT-TO-EQUITY RATIO    CREDIT RATING       INTEREST RATE PAID
--------------------    -------------       ------------------
  Under .05                  AAA *          Prime Rate
  .05 to .20                  AA            Prime + 1/2%
  .20 to .50                   A            Prime + 1%
  .50 to 1.0                 BBB            Prime + 1 1/2% + ADJ **
  1.0 to 1.5                  BB            Prime + 2% + ADJ **
  1.5 to 2.0                   B            Prime + 2 1/2% + ADJ **
  2.0 to 3.0                 CCC            Prime + 3% + ADJ **
  3.0 to 5.0                  CC            Prime + 3 1/2% + ADJ **
  Over 5.0                     C            Prime + 4% + ADJ **
  Deficit (Corps.)             D            Prime Rate + 5%

Notes:
------
* In addition to having zero or very little debt, in order
to earn an "AAA" rating, a company must have had net income
in each of the last 4 years, and must not have a loss for
the current year-to-date.

** + ADJ means an additional adjustment factor is added to the
rates shown. The adjustment is based on a combination of factors,
including the growth rate of the economy, and the Difficulty Level
selected for the current game. In general, the worse the condition
of the economy, based on GDP growth, and the higher the Difficulty
Level, the larger the adjustment factor, which means the "spread"
over Prime Rate is larger. In the most extreme case, the "spread"
over Prime Rate for a "BBB" borrower can be as much as 2.5% over
Prime, or for a "C"-rated borrower can be as much as 9.5% above
Prime, for example. The ADJ factor is smaller if the economy is
growing rapidly, and if the game is played at a lower Difficulty
Level, and can even be a zero adjustment in some cases, but only
for a "BBB"-rated (or better) borrower under ideal conditions.
<hr />
</pre>
</blockquote><br/>

<p>Note that a company with a "D" credit rating not only has a negative
net worth, but is also in default on its bonds, if it has any bonds
outstanding and lacks the cash to pay interest. Instead of it paying
interest on its bonds in cash, the interest will merely "accrue" and
be added to the total amount of bond principal it owes. Only a
bond issuer that is not a bank or insurance company, owes no
senior (bank) debt, and isn't in too dire financial condition will
pay bond interest in cash if its credit rating is "D," however. If
it fails on any of those counts, it will default on cash interest
payments, even if it has enough cash to make the payments.</p><br/>

<p>So, if you own ${'$'}100 million of the 8% bonds of a company that is in
default on its bonds, you may notice that, after one quarter of default,
you will then own ${'$'}102 million of the bonds (since the issuer would be
paying 2% per quarter, if it were able to pay cash interest), but you
won't have received any cash interest. (And the bondholder does not pay
income tax on the accrued interest, except to the extent the larger
principal amount increases the amount received if the bonds are sold
or eventually paid off.)</p><br/>

<p>In Wall ${'$'}treet Raider, credit ratings for banks are used
mainly to determine the interest rate on bonds a bank may issue,
and bank credit ratings are not determined by the above schedule.
Instead, the credit rating for a bank is based on a number of
factors relating to the amount of its capital (net worth) and
the size of its bad debt reserves, combined, as a percentage
of its total liabilities. Thus, a bank may actually have a
deficit in net worth, but might still not have a "D" credit
rating, if it has ample bad debt reserves.</p><br/>

<p>In this simulation, all banks with good credit ratings
pay the same rates on CDs (Certificates of Deposit), and
banks with "AAA" credit ratings pay interest on any interbank
borrowings at the "${helpLink('glossary_SOFR', 'SOFR')}" rate.
Banks with less then "AAA" credit ratings have to pay somewhat
higher rates on interbank loans than the SOFR rate, up to as
much as 5.7% above the SOFR rates for some "D" rated banks.
Banks with A to AAA credit ratings pay the CD Rate on CDs,
while banks with lower credit ratings pay higher rates.</p><br/>

<p>Click on the "${helpLink('chap10_X(E)(6)', 'Interest Rates')}"
command button on the "GENERAL" research Menu to see the
current interest rates paid on CDs, the SOFR rate, the Prime
Rate, the T-Bill Rate, and other key interest rates. (All of
which fluctuate constantly, as in the real world.)</p><br/>
</div><br/>

<hr />

<div id="appendix_(D)">
<h3>APPENDIX D: INDUSTRY INFORMATION</h3><br/>

<div id="appendix_(D)(1)">
<h4>(1) List of industries, level of volatility (1 is least volatile, 10 is most volatile), and typical demand growth rates for each industry group.</h4><br/>

<blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
<pre>
<hr />
    INDUSTRY                VOLATILITY     TYPICAL DEMAND
                             (1 TO 10)       GROWTH RATE
<hr />
BANKING                         N/A         NOT APPLICABLE
INSURANCE                       N/A         NOT APPLICABLE
AUTO -- NORTH AMERICA            4               4%
BIOTECHNOLOGY                    9              15%
HOUSING DEVELOPMENT              8               5%
BUILDING MATERIALS               7               5%
INTEGRATED OIL CO'S              6               5%
OIL SERVICES & DRILLING          8               6%
BASE METALS & MINING             6               3%
ELECTRONICS                      6               9%
N. AMERICAN RAILROADS            3               2%
STEEL                            4               2%
CAPITAL GOODS                    8               6%
DEFENSE & AEROSPACE              3               7%
AGRIBUSINESS                     2               5%
AIR TRANSPORTATION               7               6%
BREWING & DISTILLING             1               3%
TIRE AND RUBBER                  5               4%
TEXTILES/APPAREL                 3               2%
CHEMICALS/COMMODITY              6               5%
PHARMACEUTICALS                  3               9%
MEDICAL EQUIPMENT/SUPPLIES       2              10%
SHIPPING                         8               3%
COMPUTER                         7               8%
TRUCKING                         3               5%
SOFTWARE                         6              13%
PUBLISHING                       3               7%
PACKAGED FOODS                   1               4%
ENTERTAINMENT/BROADCAST          3               8%
GLOBAL TELECOMMUNICATIONS        7               8%
TOBACCO PRODUCTS                 2               1%
HOUSEHOLD/PERS. PRODUCTS         2               6%
PAPER PRODUCTS                   5               5%
BEVERAGE                         2               7%
SEMICONDUCTOR                    9              11%
ADVERTISING                      6               7%
SECURITIES BROKERAGE            10               8%
OFFICE EQUIPMENT                 7               7%
INTERNET SERV./CONTENT          10              16%
COMPUTER PERIPHERALS             8              10%
RETAIL -- SPECIALTY              4               6%
RETAIL -- BROAD LINE             5               4%
RETAIL -- DRUGSTORES             3               7%
RETAIL -- BOOKSTORES             4               3%
RETAIL -- SPORTING GOODS         4               6%
RETAIL -- SUPERMARKETS           2               4%
RETAIL -- APPAREL                3               3%
RETAIL -- DISCOUNTERS            4               8%
ELECTRICAL EQUIPMENT             6               6%
PRECIOUS METALS                  9               2%
CHEMICALS -- SPECIALTY           5               7%
AIR FREIGHT -- COURIERS          4               8%
TRANSPORTATION EQUIPMENT         6               5%
HEAVY MACHINERY                  7               4%
AUTO PARTS                       1               5%
HEALTH CARE PROVIDERS            3               8%
RESTAURANTS                      4               5%
RECREATIONAL PRODUCTS            6               7%
HOTELS/CASINOS                   6               6%
FURNISHINGS/APPLIANCES           5               3%
NETWORK & TELECOM EQUIP.         9              18%
SECURITY SERVICES                2               8%
ENGINEERING/CONSTRUCTION         6               7%
POLLUTION CONTROL                8              12%
CABLE/SATELLITE T.V. -- U.S.     4               6%
FOOTWEAR                         3               3%
AUTO -- EUROPE                   5               3%
AUTO -- ASIA                     6               5%
U.S. ELECTRIC/GAS UTIL.          2               4%
HOLDING COMPANY                 N/A       NOT APPLICABLE
EXCHANGE-TRADED FUNDS (ETF'S)   N/A       NOT APPLICABLE
<hr />
</pre>
</blockquote><br/>
</div><br/>

<div id="appendix_(D)(2)">
<h4>(2) Factors affecting demand growth in each non-financial industry (industries other than banking, insurance and holding/trading companies):</h4><br/>

<blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
<pre>
<hr />
INDUSTRY                FACTORS AFFECTING DEMAND GROWTH
<hr />

AUTOS -- NORTH AMERICA, Mainly affected by GDP growth;
EUROPE, AND ASIA        adversely affected by high oil
                        prices.

BIOTECHNOLOGY           GDP growth affects somewhat; growth is
                        usually very rapid and fairly steady,
                        but eventually tapers off in later years.

HOUSING DEVELOPMENT     Affected primarily by number of
                        housing starts, which are affected
                        by interest rates (adversely) and
                        size of GDP. Extremely cyclical.
                        Industry has considerable exposure to
                        asbestos litigation liability.

BUILDING MATERIALS      Affected by level of housing starts,
                        plus increase in capacity in Housing
                        Development Industry. Very cyclical.
                        Industry has considerable exposure to
                        asbestos litigation liability.

INTEGRATED OIL CO'S     Affected by level of oil prices (high
                        price is favorable) and GDP growth.

OIL SERVICES/DRILLING   Affected by expansion or contraction
                        of capacity (drilling rigs, etc.) in
                        the Integrated Oil Co.'s Industry.
                        Tends to be very cyclical, and growth
                        or contraction often lags behind trend
                        in Integrated Oil Co.'s Industry.

BASE METALS AND MINING  Affected greatly by rate of growth of
                        GDP. Very cyclical.

ELECTRONICS             Affected considerably by changes in
                        the rate of GDP growth; rapid but
                        cyclical growth pattern, eventually
                        slowing down.

N. AMERICAN RAILROADS   Affected by changes in rate of GDP
                        growth. Fairly cyclical, slow-growing.

STEEL                   Heavily dependent on expansion or
                        contraction in the Auto Industry, and
                        significantly affected by GDP changes.

CAPITAL GOODS           Very sensitive to changes in GDP growth
                        rate. Extremely cyclical.

DEFENSE & AEROSPACE     Somewhat dependent upon expansion or
                        contraction of capacity in the Air
                        Transportation Industry (airplanes,
                        etc.), but often immune to general
                        economic conditions in times of war,
                        due to defense spending component.

AGRIBUSINESS            Affected adversely by high oil prices and
                        vice versa. Slow growing at first, but
                        growth rate tends to increase later.

AIR TRANSPORTATION      Affected considerably by changes in the
                        size of GDP; affected adversely by high
                        oil prices and vice versa. Very cyclical.

BREWING/DISTILLING      Largely unaffected by GDP growth or
                        other economic factors. Slow, but very
                        steady, predictable growth.

TIRE AND RUBBER         Follows GDP growth trends fairly closely,
                        affected adversely by high oil prices.

TEXTILES                Mature, very slow-growing industry, but
                        still considerably affected by rate of
                        GDP growth.

CHEMICALS -- COMMODITY  Affected mainly by GDP growth trends;
                        somewhat cyclical growth pattern.

PHARMACEUTICALS         Rapid, fairly steady growth. Not
                        affected by economic trends.

MED. EQUIP/SUPPLIES     Rapid, fairly steady growth. Usually
                        not affected by GDP growth rate.

SHIPPING                Affected by changes in GDP growth rate;
                        affected somewhat adversely by high
                        oil prices; very cyclical growth.

COMPUTERS               Rapid, but uneven growth. Affected
                        significantly by GDP growth trends.
                        Rate of growth eventually slows with
                        maturity.

TRUCKING                Affected primarily by growth rate
                        of the economy, but severely affected
                        by high oil prices.

SOFTWARE                Rapid, fairly steady growth, for a
                        number of years, then tapering off.
                        Somewhat affected by GDP growth.

PUBLISHING              Relatively steady, fairly fast
                        growth, only slightly affected by
                        GDP growth rates.

PACKAGED FOODS          Very steady, predictable growth,
                        faster than GDP, but not affected
                        by GDP growth rates.

ENTERTAINMENT/BROADCAST Fairly rapid growth, reasonably
                        steady. Only slightly affected by
                        rate of GDP growth.

GLOBAL TELECOM.         Rapid, but very volatile and
                        cyclical growth, somewhat affected
                        by trends in GDP growth.

TOBACCO                 Almost no growth; a mature industry,
                        but dominated by a few big companies,
                        with little competition, so tends
                        to be a profitable "cash cow." But
                        susceptible to cancer lawsuit exposure.

HOUSEHOLD PRODUCTS      Fairly high rate of growth, very
                        steady and predictable, almost entirely
                        independent of the overall economy.

PAPER & FOREST PRODUCTS Modest growth rate, very cyclical
                        and very dependent on the overall
                        economy; Tends towards boom or bust.

BEVERAGE                Fairly good rate of growth, very
                        safe and steady; dominated by Coke
                        and Pepsi, with little price
                        competition, resulting in normally
                        high profitability. Almost immune
                        to economic conditions.

SEMICONDUCTOR           Very high (but extremely volatile)
                        growth industry, populated by
                        many exceptionally competitive,
                        cannibalistic companies. Greatly
                        affected by GDP growth rate changes,
                        but growth rate gradually slows down.

SECURITIES BROKERAGE    Fairly high but erratic growth rate,
                        does well in low-interest rate
                        environment, very poorly when rates
                        are high; also is extremely sensitive
                        to GDP growth rate changes.

OFFICE EQUIPMENT        Rapid but volatile growth, very much
                        affected by growth rate of GDP.

INTERNET SERV./CONTENT  Very rapid growth rate, but with the
                        greatest volatility of any industry;
                        frequent boom or bust cycles, of
                        extreme profitability or of excess
                        capacity; seriously affected by changes
                        in the economic growth rate (GDP);
                        growth eventually tapers off after a
                        number of years, but does exceptionally
                        well during a pandemic shutdown of the
                        economy.

COMPUTER PERIPHERALS    Rapid growth industry, but is quite
                        cyclical, and influenced by GDP growth
                        rates.

RETAIL INDUSTRIES       Mostly growing at or near GDP growth
(VARIOUS SECTORS)       rate, except Retail -- Specialty,
                        Retail -- Sporting Goods, Retail --
                        Drugstores, and Retail -- Discounters,
                        which typically grow considerably faster
                        than GDP. Retail -- Supermarkets group
                        is characterized by slow but very steady
                        growth.

ELECTRICAL EQUIPMENT    Somewhat higher than average growth rate
                        and volatility, affected considerably by
                        GDP growth rate.

PRECIOUS METALS         Very slow long-term growth, but extremely
                        volatile and contra-cyclical; that is,
                        tends to do very well in very weak economy,
                        and to do poorly when economy is strong.
                        Also tends to rise with high oil prices
                        and inflation, and vice versa.

CHEMICALS -- SPECIALTY  Fairly rapid growth, average volatility,
                        only moderately affected by GDP growth
                        trends.

AIR FREIGHT / COURIERS  Fairly rapid growth rate, relatively steady,
                        but strongly affected by growth in GDP.

TRANSPORTATION          Above-average growth rate, tends to closely
EQUIPMENT               follow GDP growth rate, but somewhat faster
                        growth than GDP; negatively affected by high
                        oil prices, and does better when oil prices
                        are low.

HEAVY MACHINERY         Average growth rate, about same as GDP, but
                        considerably more cyclical.

AUTO PARTS              Average to slightly above average growth,
                        but extremely steady, barely affected by
                        GDP growth rate trends, often does well
                        even when sales of new autos are weak.

HEALTH CARE PROVIDERS   Well above average growth rate, generally
                        quite consistent, and not affected very much
                        by the general economy.

RESTAURANTS             Average to slightly above average growth,
                        fairly steady and only mildly affected by
                        general economic trends, except at the
                        extremes of depression or very rapid GDP
                        growth.

RECREATIONAL EQUIPMENT  Above average growth rate, somewhat cyclical
                        and considerably affected by GDP growth.

HOTELS/CASINOS          Above average growth rate, somewhat volatile
                        and strongly affected by GDP growth rates.

FURNISHINGS/APPLIANCES  Average or below average growth, roughly in
                        line with economic growth, and with average
                        volatility; affected adversely by high
                        interest rates.

NETWORK & TELECOM       Fastest growing sector, and one of the most
EQUIPMENT               volatile and unpredictable, but eventually
                        experiences a slowing of growth rate. Has
                        frequent boom or bust cycles, but is only
                        moderately affected by GDP growth trends.

SECURITY SERVICES       Well above average growth rate, and very
                        steady. Actually does somewhat better when
                        economy is weakest and most chaotic.

ENGINEERING/CONSTRUCT.  Above average growth rate, with slightly
                        above average cyclicality, very much tied
                        to GDP growth, but considerably faster.

POLLUTION CONTROL       Rapid growth, and quite steady, only very
                        slightly affected by economic conditions.

CABLE/SATELLITE T.V.    Above average growth, with average volatility,
                        and only mildly affected by GDP growth rate.

FOOTWEAR                Slow growing, but fairly steady, and only
                        slightly affected by the general economy.

U.S. ELECTRIC/GAS UTIL. Average rate of growth, but very steady
                        and consistent; but adversely affected by
                        high interest rates.

HOLDING/TRADING COS.    No typical growth rate. Holding/trading
                        companies simply hold stocks of other
                        companies.
<hr />
</pre>
</blockquote><br/>
</div><br/>
</div><br/>

<hr />

<div id="appendix_(E)">
<h3>APPENDIX E: STRATEGY AND TACTICS</h3><br/>

<div id="appendix_(E)(1)">
<h4>(1) STRATEGIC GOALS</h4><br/>

<p>For a more detailed look at strategies to employ in Wall
${'$'}treet Raider, see the section on BASIC STRATEGIES in
${helpLink('chap04_IV(A)', 'CHAPTER 4')}.</p><br/>

<p>In general, your strategic goals in Wall ${'$'}treet Raider
should include the following:</p><br/>

<p><u>Take the high ground.</u> Seek to obtain control of
the strongest company in an industry, in terms of large
market share, solid credit rating, and high rate of return
on its business assets as compared to other companies in
its industry. Try to obtain control without paying a stock
price significantly higher than the company's net worth per
share, which will tend to limit your downside risk.</p><br/>

<p><u>Monopolize.</u> Attempt to reduce competition in
your company's industry, by taking control of other large,
fast-growing or highly profitable competitors. Then use
the "${helpLink('chap08_VIII(B)(6)', 'Set Growth Rate %')}" command
button in the "Management Transactions" Menu to reduce their
capacity growth rates. But beware of possible antitrust suits
that might be brought against your companies by opponents if you
control too much of an industry's capacity. Price-fixing,
like other forms of fraud, is always an inherently dicey
proposition.</p><br/>

<p><u>Get a bank.</u> Attempt to gain control of a key bank,
one that either lends to you or your main company, or to
other players (or their main companies). You may be able
to leverage your control of one bank into control of several
banks, which can put you in a very strong position by freezing
your opponents' lines of credit. Often you can get control
of a bank by taking control of a company that already
controls it, or by getting control of an insurer, since
insurance companies will usually have ample funds and
borrowing power with which to mount a bank takeover.</p><br/>

<p><u>Turn around slow growers.</u> As investments, look
for slow-growing companies in fast-growing or highly profitable
industries to take over. Once you have control, up the
company's growth rate (if it is earning a good return on
its investment in business assets). After a while, its
P/E ratio (and stock price) should go up unless earnings
decline, as the market tends to recognize the company's
faster growth rate.</p><br/>

<p><u>Stay liquid.</u> Always try to keep a substantial amount
of cash (or better yet, cash equivalents, such as T-bills) on
hand, for your companies and for yourself, even if you have to
borrow a bit more, unless you have absolute (51%) control of
the lender, since you never know when another player might take
over the bank you thought you had a large line of credit from,
leaving you stuck without either cash or credit.</p><br/>

<p><u>Don't Use Too Much Leverage.</u> Don't take on too much
debt, either for your own account or for companies you control.
Try to maintain a good credit rating, at least "BBB" or preferably
"A" or better, most of the time, which will generally keep you
out of trouble when sudden, unexpected market changes occur or
unanticipated disasters strike out of nowhere. If you (or your
companies) are in deeply in debt, you not only pay higher interest
rates, but are likely to be forced into bankruptcy or a crippling
forced sale of assets at the worst possible time, if anything you
didn't foresee goes wrong. Keep your debts to a minimum, and you
can withstand most anything that happens, and survive to play
another day. Take on too much debt, and you can quickly be
bankrupted, or reduced to a pauper.</p><br/>

<p><u>Build Equity Pyramids.</u> If you absolutely must get your
hands on some large company or industry, and don't have the money
to do it, don't just ignore our advice in the preceding paragraph,
by floating bonds or otherwise borrowing every penny you can
borrow. There are ways to "pyramid" your small holdings into
a chain of companies, requiring the use of little or no debt,
where the company at the bottom is huge. The idea, in short,
is to create a chain of companies, each 20%-owned by the company
above them in the chain, or pyramid. (Of course, your percentage
interest in the company at the bottom of the pyramid will be
diluted to almost nothing, but you WILL control it, and may be
able to use it to do some damage to your opponents in the game.)</p><br/>

<p>The "equity" pyramid scheme is simple. For example, put all
your money in a "startup" holding company, a billion dollars, for
example (1,000 million). Call the startup "Company #1." Have it do
several "private offerings" of stock, until your stock percentage
in it is down to about 20%, so now it will have about 5 billion
in assets. Then let it borrow a bit from its bank, say 2 billion.
Next, have it buy up 100% of a small, existing holding company
(Company #2), or other company with very few assets (one with tax
loss carryovers would be ideal). Then have Company #1 contribute
all its cash, say 7 billion, to Company #2. Then have Company
#2 do a public offering and a series of private offerings, until
Company #1 owns only about 20% of Company #2, by which time #2
may have about 35 billion in cash, and no debt. Then have it
borrow, say, 15 billion, and buy up another small holding company,
Company #3.</p><br/>

<p>Can you see where this is going? It may take a while, since
you won't always be able to float stock offerings as often as you
like, but you can eventually create a chain of companies with a
huge amount of assets. Of course, your stock in Company #1 will
still only be worth about 1 billion, which you started with, plus
or minus any market price gains, but you will <em>control</em> a
huge amount of assets, especially in Company #3, which can be
used to buy up banks, call loans owed by opposing players, file
harassing lawsuits against small companies owned by opposing
players, and so on.... And of course, if you control a huge
company, you can become its CEO and receive a huge salary,
plus possible bonuses and executive stock options!</p><br/>

<p><u>Minimize Taxes.</u> With tax rates often approaching 50%, or sometimes
even more, in Wall ${'$'}treet Raider, cutting or eliminating taxes can provide a major
boost to your ability to grow your net worth and your corporate empire. This can be
done rather easily by having a profitable (i.e., heavily taxed!) company you control
(other than a Holding/Trading Company) acquire all the stock of a small company
in the same industry that has big tax loss carryovers. This can often be done for
a relatively small price, as the "loss company" is often somewhat of a sick puppy,
if it has been incurring big losses. Then do a nontaxable liquidation of the loss
company into your profitable one, so it can shelter its income with the tax loss
carryovers of the acquired "loss company."</p><br/>

<p>But what if you can't find a "loss company" in your company's industry?
Or what if your company is a Holding/Trading Company? There are still some
clever ways to shelter its income. For example, if you own at least 80% of
RichCo, you can individually buy up 100% of LossCo (which can be a company
in any industry). Then, do a capital contribution to LossCo, of your 80%
(or more) holdings of RichCo. That will make RichCo an 80% subsidiary
of LossCo, which means the two companies will pay taxes on a "consolidated
return" basis, so that RichCo's taxable income will be sheltered by LossCo's
tax loss carryovers, since after adding up LossCo's current taxable income
(zilch, for instance) and RichCo's current taxable income that "flows" up to
its parent, LossCo, the latter will report all the combined taxable income
of the two companies, but will be able to offset the income with its tax
loss carryovers. (Note - this won't work if RichCo is the parent and LossCo
is the sub, since the taxable income of RichCo doesn't flow "downstream" to
its sub(s). In IRS tax parlance, the sub's losses in that case are from a
"Separate Return Limitation Year," or SRLY, and losses from a SRLY can only
be used to offset the SUB's current taxable income, or that of its 80% subs.)</p><br/>

<p>Another key point to remember, for bonds you, the player, own
directly. If you have a big gain on bonds you have bought, when
interest rates decline after you bought the bonds, you can either
(a) continue to collect the high interest rate until the bonds are
paid off by the company (all taxable at "ordinary" income tax rates,
or (b) you can sell the bonds now for a capital gain. As you will note,
tax rates on capital gains are generally about half as high as the
tax rate on "ordinary" income in W${'$'}R. Thus, it will often make sense
to sell the bonds for a capital gain instead of collecting the high
rate of interest until the bonds mature, at which time you will have
neither gain or loss, due to the accrual of bond discount or bond
premium each year you hold the bonds, until your tax basis exactly
equals par (100) at maturity. Taking the capital gain makes even
more sense if you have large capital losses that would completely
offset the capital gain, in which case your tax rate on the gain
will be zero!</p><br/>

<p><u>Minimize Trading Costs.</u> In Wall ${'$'}treet Raider, buying
or selling large blocks of stock can drive the price way up
(if you are buying) or way down (if selling). Thus, for example,
if you own 20% of a ${'$'}100 stock and you sell it all at once, you
may only net about ${'$'}90 a share, due to the effect on the market
price. One way to avoid this is to instead sell deep in-the-money
call options (or buy deep in-the-money put options) on the stock,
expiring in the next month. For instance, if you own 20% of a
${'$'}100 stock, sell call options on all 20% of the stock at a ${'$'}75
exercise price, expiring in the next month. Such an option will
usually trade right at or near its intrinsic value (about ${'$'}25),
so you are virtually assured of getting ${'$'}100 (less commissions)
per share, in total, when the stock is called away at ${'$'}75 next
month. Your only risk is that the company incurs some calamity
and the stock price falls below ${'$'}75 before the expiration of
the option a month (or less) later.</p><br/>

<p>Even that risk could be avoided by instead buying put options
at an exercise price of ${'$'}125, which would cost you about ${'$'}25 per
share, but which would assure you of getting ${'$'}125 when you "put"
the stock a month later at that price, so you would get a net
amount of ${'$'}100 (${'$'}125 per share minus the ${'$'}25 you paid for the
puts).</p><br/>

<p>The same type of option strategy can be used to buy stock
without running the price way up, except that you would buy deep
in-the-money call options or sell (short) deep in-the-money puts.</p><br/>
</div><br/>

<div id="appendix_(E)(2)">
<h4>(2) SNEAKY TACTICS</h4><br/>

<p>There are all kinds of possibilities for doing sneaky,
tricky, villainous things in Wall ${'$'}treet Raider, as on the
real Wall Street. A few of the better ones include the
following:</p><br/>

<p><u>Dump a competitor's stock.</u> If an opponent engages
in a takeover battle with you and winds up taking control
of a company you have stock in, take a look at the stock's
price when it becomes your turn. If you believe it is
somewhat overpriced, dump your shares on the market--you'll
drive down the value of your opponent's holdings dramatically,
perhaps even inducing a margin call. It's a great way to
inflict pain, for the truly ruthless.</p><br/>

<p><u>Unloading stock.</u> If you own a chain of companies,
use companies at the bottom of the chain (in which your
ultimate percentage of ownership is much diluted) as
dumping grounds for stocks you wish to sell. You can have
such a subsidiary company buy stock from you without your
depressing the market price, as would happen if you had to
dump your shares on the open market.</p><br/>

<p><u>Manipulate the stock price.</u> Or, use such bottom-level
subsidiaries to buy stock of your parent company, in order
to run up the price to discourage hostile takeovers, or before
the parent company uses its stock to do a merger, or makes a
"${helpLink('chap07_VII(B)(3)', 'Public Stock Offering')}." Or
before you get ready to sell the garbage, at an inflated price.</p><br/>

<p><u>Hostile takeovers.</u> If you control a company that
is grossly overpriced, in your opinion, in light of changing
economic or industry conditions, do everything you can
(see ideas above) to pump its stock price up a bit more,
then do a merger of it into your opponent's main company
if possible, so your opponent will be stuck with owning a
piece of this soon-to-be loser. (This is a particularly
dirty trick if your company is saddled with Superfund
environmental cleanup or asbestos liability.) Then dump
your shares on the market, before your hapless opponent
has a chance to sell his or hers. That way, you will (or
so you hope) have gotten out of the turkey near the top
and will have left it, sitting like a brick, in your
competitor's lap.</p><br/>

<p><u>Use unfair tactics.</u> Wall ${'$'}treet Raider allows you to
do some mean, rotten things to your opponents, not to mention
taking advantage of the various ethical choices that will be
presented to you from time to time, if you control one or more
corporations, and if "${helpLink('chap05_V(B)(3)(c)', 'Cheat Mode')}"
is turned on (it can be turned on or off in the
"${helpLink('chap05_V(B)(3)', 'SETTINGS MENU')}").</p><br/>

<p>You can use various functions in the "${helpLink('chap09', `OTHER
TRANSACTIONS`)}" Menu to stomp on an opponent who is temporarily
down, to make sure he or she doesn't survive. On Wall Street, these
kinds of churlish tactics are known as "shooting the wounded."</p><br/>

<p>Other unkindly tactics include getting control of the other player's
lending bank and using the "${helpLink(`chap09_IX(B)(4)`, `Call in Bank
Loan`)}" command button to call in part of his or her loan at a
time when doing so will force a distress sale of stocks or bonds; or
using a large, wealthy corporation that can afford to pay a lot of
legal fees (to file a nuisance lawsuit), utilizing the
"${helpLink('chap09_IX(B)(1)', 'Harassing Lawsuit.')}" command button,
in order to financially cripple or even bankrupt a small company owned
by your opponent; or, even less charitably, start a rumor campaign
about a company controlled by your opponent, to drive down its stock
price and sometimes hurt its business profitability as well.</p><br/>

<p>However, be careful when using the "${helpLink(`chap09_IX(B)(2)`, `Spread
Rumors`)}" command button, since two can play the false rumor game,
and your opponent is likely to respond in kind. Similarly, if you
file a harassing lawsuit, there is always a chance of getting
countersued successfully for instigating a "frivolous" lawsuit,
so there are numerous risks in using such dirty tactics.</p><br/>

<p>Of course, if your nasty tactics succeed in bankrupting
your opponent before he or she gets a chance to retaliate,
then there's no problem, is there? It's a dog-eat-dog
financial world, and the winners write the history books....</p><br/>

<p>Hey! No one ever said you had to be nice to succeed on
Wall Street, did they....? After all, there is no code of
honor among the Money Runners. The same set of jungle rules
apply in Wall ${'$'}treet Raider -- "Let the devil take the
hindmost...."</p><br/>

<p>Take no prisoners...!</p><br/>
</div><br/>
</div><br/>
`;
}
