import { html } from '../lib/preact.standalone.module.js';

export default function HelpGlossaryContent({ helpLink }) {
    return html`<div>
        <h2 align="center"><strong>GLOSSARY OF TERMS USED IN WALL ${'$'}TREET RAIDER</strong></h2>
        <br/>

        <p align="center"><strong>By Michael D. Jenkins, CPA & Attorney</strong></p>
        <br/>

        <p align="center"><strong>ALPHABETIZED GLOSSARY:</strong></p>
        <br/>

        <p><strong>300% RULE</strong>--A rule in Wall Street Raider, based on the U.S.
Investment Company Act of 1940, which required that certain investment
companies (ETFs in Wall Street Raider) must maintain a 300% ratio of
net asset value to total indebtedness (loans owed and bonds issued).
If the fund's assets decline in value so that net asset value is less
than three times total indebtedness, the fund must pay off some of
the debt and, if necessary, sell off some of its assets.</p>
        <br/>

        <p><strong>ACCOUNTANT</strong>--A shy, retiring, denizen of large downtown office
buildings, the species <em>Beancounteris self-effacius</em> is often deceptively
obsequious in appearance and eager to please, yet potentially dangerous
to the financial health of those who must deal with members of this odd
clan. This mainly nocturnal, balding creature frequently is known for
its uncanny creativity in arranging and presenting financial numbers in
novel and complex ways that totally conceal and obscure the underlying
reality from civilians. Its victims, who are often confused and lulled
into a false sense of security by the bland assurances of these seemingly
mild-mannered and trustworthy creatures of the night, will awaken one
morning to find themselves suddenly impoverished, while the beancounter
has migrated to its usual nesting place, Brazil. See also,
"${helpLink('glossary_CPA', 'Assassins, Certified Public')}."</p>
        <br/>

        <div id="glossary_ADVANCES">
        <p><strong>ADVANCES</strong>--Funds advanced (loaned) by a player to a corporation
he or she controls. In Wall ${'$'}treet Raider, such advances are "demand loans,"
on which the borrowing corporation pays interest at the same rate as the
banks' Prime Rate, and which must be repaid whenever demanded by the
lending player. However, advances are a low-ranking, or subordinated debt,
so that if a repayment would endanger the credit worthiness of loans to
the corporation from banks or bondholders, repayment may not be allowed.
In general, any time the corporation has a credit rating of BB, BBB, A,
AA, or AAA, the player has the right to recall (call in) the advance,
in part or in full, in Wall ${'$'}treet Raider. Note that in bankruptcy,
bank lenders and bondholders will be paid off first, or will realize
a higher percentage payoff of their claims, than players' advances to
the corporation. If a player is receiving margin calls, he or she will
automatically be forced to call in advances (from creditworthy corporate
borrowers), and if you (the player) have sold off all other assets and
are still getting margin calls, the program will cause you to "forgive"
part of your advances to companies from which you cannot recall your
advances, in an attempt to improve those companies' credit ratings to
a point where you CAN receive repayment of the rest of the advance,
in order to meet your margin calls. Often, this will result in your
forgiving 100% of such advances.</p>
        <br/>
        </div>
        <br/>

        <p><strong>AFFILIATE</strong>--In Wall Street Raider, a company is an "affiliate"
of another company if both companies are under control of the same player
or company. A company that DIRECTLY owns 20% or more of another company
will include that percentage of the subsidiary's income or loss in its net
income, and will do so even if the company whose stock it owns is not an
"affiliate," such as when ABC owns 22% of XYZ, but an unrelated company
or opposing player owns 23% of XYZ, and controls XYZ. Nevertheless, ABC
will include 22% of XYZ's income or loss in its reported income, even
though it does not control XYZ.</p>
        <br/>

        <p><strong>ANTITRUST LAWS</strong>--Laws designed to prevent unfair
business practices, including monopolies or other activities
intended to reduce competition. In Wall ${'$'}treet Raider, as
in the real world, your company may be sued by competitors
for antitrust damages or by the public for price-fixing, and
may also be restrained by various government enforcement
agencies from taking over competing companies in an
industry that your company or companies already dominate.
In both the real world and Wall ${'$'}treet Raider, the main effect
of such laws is usually to punish companies that are too
successful and well-run and extract money from them -- usually in
the form of extortion (political campaign contributions or damage
awards).</p>
        <br/>

        <p><strong>ASBESTOS LITIGATION</strong>--The corporate equivalent of
having cancer -- financial cancer. If you live in the U.S., and
invest in stocks, you are probably aware of major companies that
have been bankrupted by endless class-action lawsuits brought by trial
lawyers over asbestos exposure, ever since it became clear that
asbestos was hazardous to one's health to work with or around;
companies such as Johns-Manville and Dresser Industries (a Halliburton
subsidiary) are some of the major casualties in recent years. Just
a hint of "asbestos liability exposure" for a particular company in
the news can also be hazardous to your financial health, if you own
stock in such a company. Once on the hook, the lawyers begin running
advertisements, recruiting victims for whom they can sue the
company for damages, a process that, once started, eventually leads
to financial dismemberment or death of the company. Wall ${'$'}treet
Raider simulates that experience, so if a company you own stock in
develops "asbestos exposure" in W${'$'}R, it is usually a good idea to
sell it, immediately, while you still can, before it is bled dry
by the financial vampires.</p>
        <br/>

        <div id="glossary_BACKWARDATION">
        <p><strong>BACKWARDATION</strong>--A term used in commodity futures
trading to describe the very unusual situation where the
prices of futures contracts for a commodity are less than the
current "${helpLink('glossary_SPOT', 'spot')}" price. The more
normal condition, where futures prices are higher than the spot
price, is referred to as "${helpLink('glossary_CONTANGO', 'contango')}."
Backwardation only occurs, generally, when interest rates are
very low, or when the price of a commodity is expected to
decline in future months, such as when there is a temporary
shortage of the commodity. Backwardation almost never occurs
in such non-perishable commodities as gold and silver.</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_BAD">
        <p><strong>BAD DEBT RESERVE</strong>--For banks, an accounting entry on
their books, designed to be a "reserve" for anticipated future
bad debt losses. The reserve is evaluated each quarter and
if it is too low, an amount is added to the reserve and
charged as an expense against operating income of the bank.
Actual bad debts, when incurred, are thus applied against
(reduce) the reserve, rather than being charged directly
against income. As a result, bad debt expenses tend to be
spread out more evenly, over a period of years, rather than
all bunched in the year when the debt is recognized as having
gone bad. This generally allows a banker to sleep better at
night when a big loan goes bad. Playing games with the reserves
is also a favorite hobby of bank management, a wonderful
and effective tool for manipulating reported earnings, and
therefore the bank's stock price, and therefore the bonuses
paid to management.</p>
        <br/>
        </div>
        <br/>

        <p><strong>BALANCE SHEET</strong>--A financial statement that shows a
company's (or player's) assets, liabilities, and net worth,
with net worth being what is left after subtracting total
liabilities from total assets. In Wall Street Raider, the
"Financial Profile" consists partly of a balance sheet, in
addition to other relevant financial information about a
player or company.</p>
        <br/>

        <p><strong>BANKRUPTCY</strong>--In simple terms, going broke; either
because the debtor (a person or a corporation) can't pay
debts as they come due, or in some cases because the value of
remaining assets is far below the amount owed, even though
the debtor may still have considerable amounts of cash.</p>
        <br/>

        <p>In Wall ${'$'}treet Raider, a player is ejected from the game
in utter disgrace if he or she goes bankrupt. If a corporation
goes completely bankrupt, all of its assets are used to pay
off as much of its debt as possible, and the lenders (bank
and any bondholders) take bad debt losses on the rest; all
stock of shareholders usually becomes worthless and is canceled.
In a "Chapter 11" bankruptcy, the company continues in business,
while its capital structure is "reorganized." In some cases,
that will mean the bank lender winds up owning all or part
of the stock of what is left of the company, in exchange for
writing off its loans to the bankrupted company. The stockholders
and junk bond holders are usually left with only the sleeves of the
vest. See "${helpLink('glossary_CHAPTER11', 'CHAPTER 11 BANKRUPTCY')}"
below.</p>
        <br/>

        <p><strong>BEAR MARKET</strong>--A grim, pitiless stock market, where
all your stocks are plunging to new depths every day, and
where everyone else is losing gobs of money, too. This is
different from a BULL MARKET, where all your stocks are
plunging to new depths every day, while everyone else, from
your barber to the cabbie to the shoeshine boy, is bragging
about getting filthy rich in the stock market.</p>
        <br/>

        <p><strong>BOND AMORTIZATION</strong>--When a player or company buys a
bond at less than its face value (100), say at 95, the buyer
must amortize that 5% discount over the remaining life of the
bond before it matures, and include that non-cash item in
taxable income in each accounting period, while also adding
it to the cost of the bonds. That is called bond discount
amortization. For example, if you buy XYZ bonds at 95, and
hold them long enough to include 1.50 (1.5% of face value)
in income as bond discount, your adjusted cost would increase
to 96.50, so if you sold the bond for 97, your gain would only
be 0.5 (97.00 - 96.50). But if you held the bond until it
matured at 100, all 5.00 of the discount would have been
reported in income and added to cost by that time, so you
would have no gain or loss when the bond pays off.</p>
        <br/>

        <p>Bond premium amortization is the mirror image of bond
discount amortization, except that there is no bond premium
amortization allowed or required if purchasing a convertible
bond (one that is convertible into stock of the issuing company)
at a premium. Thus, if you buy a non-convertible bond for 103,
you would amortize 3.00 (3% of face value) over the remaining
term of the bond, meaning that in each year (or in W${'$'}R, each
calendar quarter), you would write off a fraction of the
remaining premium, as a non-cash tax deduction. The amount
of premium written off will reduce your adjusted cost of
the bond.</p>
        <br/>

        <p>In either case, whether you are amortizing discount or
premium on a bond you purchased, the effect should be that
all the discount or premium is finally written off just
before the bonds are paid off, so that there is no gain
or loss on the payoff. On the other hand, if you buy a
convertible bond at a premium, say 115, the premium does
not get amortized, so if the bond is paid off at par (100)
when it matures, you would have a loss of 15 (115 - 100).</p>
        <br/>

        <p>The bond discount and bond premium amortization rules
apply equally to individual players and companies in this
simulation.</p>
        <br/>

        <p><strong>BOOK VALUE</strong>--Net worth. In the real world, "book"
value usually refers to the COST of a company's assets, as
carried on its books, less the amount of its debts. (Cost
doesn't necessarily bear any relationship to what the assets
are currently worth.) In Wall Street Raider, most marketable
assets (stocks and commodities) are reflected at current market
value, so "book value" or "net book value" in Wall Street Raider
more nearly reflects a company's net worth and creditworthiness.
Bonds are reflected in a bank or insurance company's book value
at their adjusted cost ("tax basis"), which is original cost,
plus or minus the amortization of discount or premium. However,
if bonds are in default ("D" credit rating), they are valued at
their current market value, if less than adjusted cost.</p>
        <br/>

        <p>A company's stock may trade at much more or somewhat less
than its "book value," depending on whether its business is highly
profitable or not and other factors.</p>
        <br/>

        <p><strong>BUBBLE</strong>--The name given to a rip-roaring bull market
in retrospect, after the souffle has collapsed and everyone but
the insiders who got out early has been left with nothing more
than a stock portfolio that looks like Dresden after the fire
bombing. A "bubble" is invariably followed by years of plunging
stock prices, soaring unemployment, angry recriminations, and
endless government hearings and investigations, usually by the
same foxes who were supposed to be guarding the hen house while
the bubble grew to grotesque proportions.</p>
        <br/>

        <p><strong>BUSINESS ASSETS</strong>--In Wall ${'$'}treet Raider, the operating
assets (sometimes referred to as "capital assets") of a business;
a catchall term to describe plant and equipment, trucks, planes,
ships or whatever kind of operating assets a company invests money
in to increase the size of its business and its sales -- other
than "working capital," such as inventory and accounts receivable.
In Wall ${'$'}treet Raider, ${'$'}1 of business assets is assumed to generate
${'$'}1 per year of sales. ("Non-business assets" in Wall ${'$'}treet Raider
would include working capital, cash, T-bills, bonds, stocks of other
companies, derivatives contracts such as options or futures or, in
the case of a bank, its loan portfolio. These are all "intangible"
assets, except to the extent "working capital" is assumed to include
inventory items.)</p>
        <br/>

        <p><strong>BUYBACK</strong>--A transaction, such as an LBO ("leveraged
buy-out") or a "Greenmail" buyback, in which a corporation
buys (and cancels) its own stock from certain shareholders,
which will tend to increase the per share value of the
remaining shareholders' stock, if the company's stock is
bought back at a discount to net worth per share.</p>
        <br/>

        <div id="glossary_CD">
        <p><strong>CDs OR CERTIFICATES OF DEPOSIT</strong>--Interest-earning
deposits in a bank. In Wall ${'$'}treet Raider, Version 8.50 or
later, players and companies no longer invest in CDs. Instead,
their "cash" (bank accounts) consists of bank demand deposits
that do no pay interest to the depositor. Players and companies
can invest some or all of their cash in a "cash equivalent" --
Treasury bills, which earn some interest, usually at a lower
rate than bonds or other long-term or less safe investments.
The "CD Rate" is the rate of interest banks must pay on CD
deposits of "the Public." Most "Public" deposits in the banks,
usually about 90%, are in CDs, on which the banks must pay
interest, however. Banks with less than an "A" credit rating
must pay a somewhat higher interest rate than the CD Rate on
CD deposits.</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_CALL_OPT">
        <p><strong>CALL OPTION</strong>--An option to buy a stock at a specified
price over an agreed period of time. The person who buys a
call option is betting that the underlying stock is going
to go up. The person who sells, or sells short, a call option
is betting that the stock will either go down, go nowhere, or
only will go up slightly.</p>
        <br/>
        </div>
        <br/>

        <p><strong>CAPACITY GROWTH</strong>--Growth in "business assets" such as
plant and equipment. In Wall ${'$'}treet Raider, as in the real world,
an industry's profitability will tend to suffer if industry-wide
capacity (supply) grows faster than demand for that industry's
product for very long (or will tend to improve if demand grows
faster than supply).</p>
        <br/>

        <p><strong>CAPITAL ASSETS</strong>--In W${'$'}R, the same as "business
assets." It is assumed in W${'$'}R that each dollar of investment
in business/capital assets generates a dollar of sales. Thus,
100 million of business assets that generates 100 million
of sales might have a "return on capital" of 12 million,
or 12%. This is essentially the same as the profit margin
on sales, since Wall ${'$'}treet Raider assumes sales=capital
assets. It does not take into account any non-operating
expenses (or CEO salaries), such as interest, taxes, gains
or losses on disposition of assets, or other types of income
such as interest or dividends. "${helpLink('glossary_ROC', 'RETURN ON CAPITAL ASSETS')}" in Wall ${'$'}treet Raider bears very little
relation to "return on equity." See the definition of
${helpLink('glossary_ROE', 'RETURN ON EQUITY')} for more
details.</p>
        <br/>

        <p><strong>CAPITAL CONTRIBUTION</strong>--Money or assets injected into,
or "contributed" to a subsidiary corporation by its controlling
shareholder. In Wall ${'$'}treet Raider, the controlling
shareholder must own 100% of the subsidiary's stock before
he/she/it is allowed to make a contribution of capital to the
subsidiary. A capital contribution is used to move money,
stock, bonds, or business assets owned by a player or by a
parent corporation to a subsidiary when the subsidiary needs
the capital for some reason, such as when the subsidiary has
a tax loss carryover that will shelter any income it may earn
from investing the funds or assets, or when the subsidiary is
in a highly profitable industry and needs to expand rapidly.</p>
        <br/>

        <div id="glossary_CHAPTER11">
        <p><strong>CHAPTER 11 BANKRUPTCY</strong>--Also sometimes referred
to as "operating bankruptcy," where the debtor continues
in operation, rather than being dismantled. A less severe
form of corporate bankruptcy, Chapter 11 Bankruptcy (or
reorganization) is sort of a "halfway house" where the
wayward corporation gets some relief from its debts, in
the hope that it may change its ways and somehow survive
(which is usually wishful thinking). In Wall ${'$'}treet Raider,
this means that the stockholders and junk bond holders have
to write off part or all of their stock or what the company
owes them, and the bank also writes off a (smaller)
percentage of what the bankrupt company owed the bank.</p>
        <br/>

        <p>In Wall ${'$'}treet Raider, as in the real world, the shareholders
are usually completely wiped out in a bankruptcy reorganization,
and the bondholders and players who have made ${helpLink('glossary_ADVANCES', 'advances')}
(demand loans) to the bankrupt company take a much larger hit
than the banks. The bank loans are "senior" to the bond indebtedness
owed to the bondholders. (In practical terms, this means that bank
presidents don't want to give up riding to work in chauffeured
limousines, so widows, orphans, and other small investors need to
lose their life savings they invested in the bankrupt company's
bonds, and give up eating regularly, rather than have the banksters
suffer a big loss along with them.)</p>
        <br/>
        </div>
        <br/>

        <p><strong>COLLECTIVE BARGAINING</strong>--As practiced between governments
and government employee unions, collusive bargaining.</p>
        <br/>

        <p><strong>CONSOLIDATED TAX RETURNS</strong>--In Wall ${'$'}treet Raider, as
in the real world, a company that owns 80% or more of another
company will generally file "consolidated" tax returns with the
subsidiary company, where the taxable income of the two is
combined, and a single tax is paid for both. If one company has
taxable income, and the other a loss, corporate law usually
provides (and Wall ${'$'}treet Raider requires) that the company that
has taxable income must compensate the "loss company" for the
taxes saved by utilizing some or all of the "loss company's"
tax losses. This is all done automatically in Wall ${'$'}treet
Raider. In the real world, doing consolidated tax return
reporting is a very complicated and tedious process which
keeps large herds of accountants employed at high wages. Wall
Street Raider generally follows the U.S. tax rules for
consolidated tax returns.</p>
        <br/>

        <p>In the real world, however, consolidated tax returns can't
always be filed, such as in situations where the parent company is
a U.S. corporation and the subsidiary is incorporated in another
country, but Wall ${'$'}treet Raider does not impose that limitation.
All 80%-owned (or greater) subsidiaries pay tax on a "consolidated
return" basis, together with their parent corporation, in Wall
${'$'}treet Raider.</p>
        <br/>

        <div id="glossary_CONTANGO">
        <p><strong>CONTANGO</strong>--In commodity futures trading, contango is
the usual situation where futures prices for a commodity are
somewhat higher than the "${helpLink('glossary_SPOT', 'spot')}"
price, a condition which tends to reflect the time value of
money. The much less usual situation, where futures prices
are actually lower than the spot price, is referred to as
"${helpLink('glossary_BACKWARDATION', 'backwardation')}."</p>
        <br/>
        </div>
        <br/>

        <p><strong>CONTROLLED CORPORATION</strong>--In Wall ${'$'}treet Raider, a
corporation that is at least 20% owned by a player (and by
companies he or she controls), or by a single corporation, is
considered to be under the control of its largest shareholder
(and of whomever might also control that shareholder company,
if anyone). Thus, if you own 51% of company ABC, you control it.
If you also own 10% of company XYZ, and ABC owns another 10%,
you may also control company XYZ, unless some other player or
corporation owns 20% or more of XYZ.</p>
        <br/>

        <p><strong>CONVERTIBLE BONDS</strong>--These are bonds issued by a
corporation that are convertible into stock of the corporation.
In Wall Street Raider and the real world, conversion only occurs
when the company's stock is trading at or above the "conversion
price" set in the bond indenture. For example, if the conversion
price per ${'$'}1,000 face value bond is set at ${'$'}40 per share, the
bonds will be converted to stock when they mature or are called
early, only if the stock is trading above ${'$'}40 at the time. If the
conversion price is ${'$'}40, it means that each bond is convertible
into 25 shares of common stock (${'$'}40 x 25 = ${'$'}1,000). Thus, if the
stock is at ${'$'}50 when the bonds mature, the bondholder would receive
25 shares of stock, worth ${'$'}1,250, instead of being paid ${'$'}1,000
cash. On the other hand, if the stock is at ${'$'}30, 25 shares would
only be worth ${'$'}750, so the company would have to pay the bondholder
the ${'$'}1,000 face value of each bond (in cash) when the bonds mature.</p>
        <br/>

        <div id="glossary_COVERED_CALLS">
        <p><strong>COVERED CALL OPTIONS</strong>--Options that are sold short, but
where the seller owns the underlying stock. This is generally
a conservative investment technique, since it decreases your
risk in owning a stock, because you receive a significant sum
(the "option premium") from selling the option. Although you
have a short position in the options, which could otherwise
be risky if the stock went up sharply, you are "covered"
against that risk, since you own the stock and can simply
let the option be exercised, calling away your stock, if
you choose not to buy back the option. A "covered call" is
the opposite of a "naked call" -- a call that is sold short
when you do not own the underlying stock, which is a
high-risk maneuver. In Wall ${'$'}treet Raider, any corporation,
including banks or insurers, may sell covered call options.</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_CPA">
        <p><strong>CPA</strong>--Certified Public Assassin, also known as a
Certified Public Accountant or Bean Counter. A CPA firm is a
supposedly independent outside auditor, paid handsomely by the
company that it audits, to "certify" that it has reviewed a
company's financial statements, and has blessed the numbers
that the company's financial officers have made up, no matter
how absurd and outlandish those numbers may be, and no matter
how close to its financial deathbed the company issuing the
rosy financial statements may be. CPA's are not known to bite
the hand that feeds them.</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_crypto">
        <p><strong>CRYPTOCURRENCY</strong>--These are private "currencies" such as
Bitcoin and Ethereum, which use a complex blockchain ledger
technology to maintain records of every transaction done by anyone
in such currencies. Such technology enables very low cost and
safe transactions, often with anonymity that has made Bitcoin a
favorite payment medium for criminals in general, and especially
for creators of "ransomware" (malware that infects computers and
encrypts all the victim's computer files until the victim pays a
ransom in Bitcoin to the criminal to decrypt the files and make
them usable again).</p>
        <br/>

        <p>At its core, a cryptocurrency is typically decentralized
digital money designed to be used over the internet. Bitcoin,
which launched in 2008, was the first cryptocurrency, and it
remains by far the biggest, most influential, and best-known.
In the years since, Bitcoin and other cryptocurrencies like
Ethereum have grown as digital alternatives to money issued by
governments. The value of Bitcoin, in particular, has increased
exponentially, because only 21 million Bitcoin units will ever
be created, thus for small users or traders, it has become
necessary to buy or sell increasingly small fractional slivers
of a Bitcoin, since the price has continued to rise for years
as more money piled in, to acquire a limited supply of the
digital currency.</p>
        <br/>

        <p>While fortunes have been made by those who bought
Bitcoin or other cryptocurrencies at an early date, many
skeptics have compared the run-up in prices to the Dutch
tulip bulb bubble (or mania) in the 1600's, or to a chain
letter or Ponzi Scheme, in which the early "investors" do
well if they sell in time, leaving late investors holding
the bag. Because of the ethereal quality of these intangible
assets, their prices tend to fluctuate wildly. Wall Street
Raider has added cryptocurrencies (Bitcoin and Ethereum) as
another asset class in which users can speculate, as well
as adding futures trading on both, with "Wild West" price
behavior that roughly simulates that of those cryptocurrencies
in the real world.</p>
        <br/>
        </div>
        <br/>

        <p><strong>CYCLICAL</strong>--As applied to an industry, an up-and-down
or boom-and-bust cycle that is typical of the industry, where
demand grows very rapidly for a while, and then stops or
shrinks for a while. In other words, an industry that is not
characterized by steady or predictable growth.</p>
        <br/>

        <p><strong>DEBT-TO-EQUITY RATIO</strong>--A decimal amount that shows
the ratio of a company's total debts to its net worth. For
example, if a company has ${'$'}1,400 million of assets, less
${'$'}400 million of debts, its net worth ("equity") would be the
difference, or ${'$'}1,000 million. Thus, its debt-to-equity ratio
would be .40, or 40%, the ratio of its ${'$'}400 million of debt
to its ${'$'}1,000 million of equity. In general, the higher
the ratio, the more "leveraged" and risky the company is
likely to be, with such a capital structure. A very high
debt-to-equity ratio, such as 5-to-1, would indicate that
the company is VERY highly leveraged, and that only a modest
period of losses could wipe out its thin amount of "equity"
and perhaps push it into bankruptcy. In W${'$'}R, companies
can (generally) borrow up to 1 times (100% of) their net
worth, under a bank line of credit, though a line of credit
may be frozen if the company's bank loan exceeds 25% of
the lending bank's total loan portfolio.</p>
        <br/>

        <p>However, in Wall Street Raider, any options owned by the
borrower are not counted as part of a borrower's net worth,
except to the extent such options are "in-the-money." For
example, a ${'$'}30 call option might have a market value of ${'$'}9
when the stock is trading for ${'$'}35 a share, but only its ${'$'}5 of
"intrinsic value" (${'$'}35 - ${'$'}30) would be counted when computing
its debt-to-equity ratio for bank lending and credit rating
purposes in Wall Street Raider.</p>
        <br/>

        <p><strong>DEMAND DEPOSITS</strong>--Non-interest-bearing deposits in a bank,
which the bank can lend out at interest or invest. In Wall ${'$'}treet
Raider, banks' demand deposits usually grow at a rate of about 3
to 5% per year, but are affected by various factors, such as the
financial health of the bank. The "cash" of any player or
company in Wall Street Raider is deemed to be a demand deposit
at the bank from which that player or company borrows. See
"${helpLink('glossary_CD', 'CDs OR CERTIFICATES OF DEPOSIT')}"
above.</p>
        <br/>

        <p><strong>DIVIDEND</strong>--A distribution of profits by a corporation to
its shareholders, usually in the form of cash. In Wall ${'$'}treet Raider,
dividends are always in cash, except for distributions which occur in
the nontaxable liquidation of a subsidiary into its parent corporation
or when a company does a "${helpLink('glossary_SPIN_OFF', 'SPIN-OFF')}"
of some or all of the stock of a subsidiary corporation to the parent
company's shareholders.</p>
        <br/>

        <p><strong>DIVIDEND PAYOUT RATIO</strong>--The percentage of a company's
annual reported earnings that is paid out to shareholders
as regular dividends. State or national laws usually prohibit
a company from paying out dividends when net worth is negative,
although an exception is generally made for dividends paid out
of current earnings, where the company is currently profitable
("springing dividends"). In Wall ${'$'}treet Raider, a company is
not allowed to pay out dividends when it has a "D" credit
rating (meaning it has filed for bankruptcy protection).</p>
        <br/>

        <p><strong>DIVIDEND YIELD</strong>--The rate of return on investment in a
stock, based on the dividends it pays, expressed as a percent
of the current value of the stock. For example, if a stock
sells for ${'$'}100 a share and pays an annual dividend at the
rate of ${'$'}6 per share, the dividend yield would be 6% (6/100).</p>
        <br/>

        <p><strong>EBITDA</strong>--An acronym, meaning "earnings before interest,
taxes, depreciation, and amortization," which some investment analysts
like to look to in valuing a stock, rather than simply looking
at net income. EBITDA can provide investors a better view of
short-term operational efficiency than the net income figure,
since it excludes extraneous factors such as the cost of financing
(interest expense), which will largely depend on how much has
been borrowed, rather than operational efficiency. Similarly,
taxes may depend on factors such as the geographic locations
where the business is conducted, and non-cash expenses such as
depreciation or amortization are simply accounting adjustments
that reflect previous historical transactions that are being
written off, rather than current operating expenses.</p>
        <br/>

        <p>EBITDA is most often useful in determining the ratio of EBITDA
earnings to interest expense, as a way of evaluating how capable
the company is likely to be in meeting its debt obligations.</p>
        <br/>

        <p>The main weakness of the EBITDA number as an analytical tool is
that it does not take into account capital spending requirements,
which may be higher for companies in some industries, in order
for them to remain competitive, and thus may not give a true
picture of cash flow requirements.</p>
        <br/>

        <p>In Wall Street Raider, EBITDA can't be precisely calculated,
since Wall Street Raider does not break out depreciation expense
separately, due to the massive amount of accounting that would
be required for every capital expenditure. As a shortcut, in Wall
Street Raider the capital spending rate is a just considered to
be the net amount of the increase or decrease in capital assets;
that is, gross capital spending less depreciation. Shrinkage in
the asset base in the simulation generates cash, like a business
that is not making capital investments, and letting its capital
assets gradually become obsolescent.</p>
        <br/>

        <p><strong>EPS</strong>--An abbreviation for "earnings per share." If a
company in Wall ${'$'}treet Raider has 100 million shares of stock
outstanding, and it earns ${'$'}4.00 per share, that means it earned
a total of ${'$'}400 million. A company's EPS is usually a major
determinant of its stock price, in the real world as well as in
Wall ${'$'}treet Raider.</p>
        <br/>

        <p><strong>EQUITY METHOD OF ACCOUNTING</strong>--A recognized method
for corporations to account for their investment in subsidiary
corporations, usually subsidiaries in which they own at least
20% of the stock, but not enough stock to "consolidate" the
subsidiary's finances with the parent company's in full.
However, the parent is allowed to include its percentage share
of the subsidiary's earnings (or losses) in the parent's
reported earnings. Wall ${'$'}treet Raider adopts this latter
rule for any company that owns 20% or more of another company
(even if it does not control the other company). Where
earnings or losses from stock holdings in another company
are reported on the equity method, dividends received from
the other company are not treated as income to the recipient
in earnings reports, although the parent company receiving the
dividends must include 35% (as under U.S. tax law) of the
dividends received in its taxable income and pay tax on that
amount.</p>
        <br/>

        <p><strong>ETF (EXCHANGE-TRADED FUND)</strong>--An investment company
that invests in a diversified portfolio of stocks or, in some
cases, other assets, such as options or commodities. In Wall
${'$'}treet Raider, there are 15 "sector" ETF's, each of which invests
in certain industry sectors, such as technology, energy, retail,
consumer goods companies, natural resources, transport, etc.
Future releases after v. 8.72 will include 5 more ETFs (3 bond
funds and two triple-leveraged stock index funds).</p>
        <br/>

        <div id="glossary_XCESS">
        <p><strong>EXCESS LOSS ACCOUNT</strong>--A negative "tax basis" for the
stock one company owns in an 80% (or greater) owned subsidiary
corporation. This situation can arise, in rare situations only,
due to adjustments from consolidated tax return filing by a
parent company and its 80% (or greater) owned subsidiary. If
the parent company sells some of a stock that has an excess
loss account (negative tax basis), but still owns at least 80%,
its gain on the sale will be the sale price plus a proportionate
part of the excess loss account. For example, if the excess loss
account or negative tax basis is -90 million, and the parent owns
90% of the sub's stock and sells 10% for 300 million, the taxable
gain will be 300 million plus 1/9 of 90 million, or 10 million,
a total gain of 310 million.</p>
        <br/>

        <p>After the sale, the excess loss account for the remaining 80%
of the stock of the sub would be -80 million. However, if the
parent company's stock ownership in the sub is ever reduced to
below 80%, any excess loss account must be fully "recaptured" as
taxable income, in almost every case, including a sale of the
stock, worthlessness of the sub's stock due to bankruptcy, or
reduction of the parent's ownership due to a stock offering,
merger transaction or (otherwise tax-free) spin-off of the
sub's stock. The one exception, when the excess loss account
does not become taxable, is when the sub is a 100%-owned
sub and is liquidated in a nontaxable liquidation. In that
case, the excess loss account will never have to be
recaptured, a nice "tax loophole" in both Wall ${'$'}treet
Raider and the real world (under U.S. tax laws).</p>
        <br/>
        </div>
        <br/>

        <p><strong>FDIC</strong>--Abbreviation for "Federal Deposit Insurance
Corporation," the U.S. federal agency that insures bank
deposits, in case a bank goes broke. In Wall ${'$'}treet Raider,
the FDIC may force a bank to cut or eliminate dividend payments
if in financial trouble. Or, as in the real world, if a bank
gets in too deep a financial pit, the FDIC may pull the plug
by taking over the bank, canceling the stock held by former
stockholders and reviving the bank, under new ownership, often
after an injection of new capital to restore the bank to solvency.
While small depositors usually don't lose any of their deposits,
large depositors often lose some percentage of their deposits
at the bank that are in excess of the amount the FDIC insures.</p>
        <br/>

        <p>In the real world, the FDIC is usually poorly funded, and will
run out of money very quickly if a significant number of banks
ever fail, in which case, the most likely outcome will be the "Cyprus
Solution," in which the depositors, other than very small
depositors, all take a "haircut" by having a significant percentage
of their deposits "bailed in" (confiscated) in lieu of a "bail out"
by the FDIC. The Euro Zone apparently has similar "bail in" plans
for future financial crises and bank failures in Europe.</p>
        <br/>

        <p><strong>FTC</strong>--Abbreviation for the U.S. "Federal Trade Commission,"
the federal agency that acts as a watchdog (more often as a
sleeping lapdog) to prevent consumer fraud and other unfair
trade practices. It also may occasionally wake up long enough to
block mergers and takeover attempts that it feels could tend to
reduce competition in the marketplace, or just to create the
appearance that it is actually doing something, rather than just
sleeping on the job. In Wall ${'$'}treet Raider, various U.S. or
foreign government agencies may also intervene to block planned
mergers, liquidations, or LBO/Greenmail transactions.</p>
        <br/>

        <p><strong>FEDERAL FUNDS</strong>--Funds banks borrow from each other to
meet certain Federal Reserve (or other Central Bank) requirements,
usually on a very temporary basis. In Wall ${'$'}treet Raider, this
term refers to money that banks borrow from each other or elsewhere
when they run short of funds and have no more bonds to sell off.
"Federal Funds" or "interbank borrowings" are quickly paid off in
Wall ${'$'}treet Raider when a borrowing bank obtains the money to do so.</p>
        <br/>

        <p><strong>FEDERAL RESERVE BANK</strong>--The U.S.'s central bank, whose
job it is to print money -- endlessly -- when the U.S. Treasury
can't borrow enough money to pay its bills. The Federal Reserve
is a government-licensed counterfeiting operation, as well as
America's largest printer of bad paper.</p>
        <br/>

        <p><strong>FRAUD</strong>--The chief industry on Wall Street, Fleet Street,
Bay Street, and other major bourses/gambling dens around the world,
responsible for creating thousands of extremely lucrative jobs, all
of them funded by sucking up the life savings of millions of the
"little people" -- those unfortunate souls who actually work for a
living -- and redistributing the booty to the rich and well-connected.
For performing this necessary service to society (separating the weak
and the stupid from their loot on a mass scale), the most successful
cads, cons, liars, frauds, poltroons and mountebanks are frequently
awarded honorary doctorates at places like Harvard and Oxford.</p>
        <br/>

        <p><strong>GDP</strong>--Abbreviation for "Gross Domestic Product." See
definition of "GROSS DOMESTIC PRODUCT" below. (Formerly GNP,
Gross National Product)</p>
        <br/>

        <div id="glossary_CHUTE">
        <p><strong>GOLDEN PARACHUTE</strong>--Large sums of money and benefits paid
to departing executives of large companies, typically paid to reward
them for running their company into the ground, or for thoroughly
looting it. Managers who pillage their companies for over ${'$'}100
million rarely go to prison; more often, they are given honorary
doctorates at prestigious universities, for being generous enough
to share a small percentage of their ill-gotten loot with some
grant-hungry institution, as "conscience money" or "virtue-signaling
donations."</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_GOODWILL">
        <p><strong>GOODWILL</strong>--In accounting terminology, "goodwill" is
an intangible asset to which part of the purchase price of
a business, or part of a business, may be allocated. In theory,
"goodwill" reflects the superior earning power of the acquired
business assets. For example, if you were to acquire a profitable
service business for ${'$'}100,000, which had no "real" assets other
than a few dollars worth of office supplies and few beat-up
pieces of furniture, most of your purchase price would have to
be allocated to goodwill (assuming the paper clips and a few
old desks aren't worth very much).</p>
        <br/>

        <p>In W${'$'}R, if your company purchases 1,000M of business assets
from another company, and such assets are currently earning
an above-average rate of return on investment (above 10%,
ignoring the seller's market share and spending on R&D or
marketing/advertising), you will have to pay an additional
price, depending on the level of profitability of the acquired
assets. Thus, you might have to pay 1,200M, for 1,000M of
assets, or a premium of 200M.</p>
        <br/>

        <p>That premium is called "goodwill" and will show up on the
buyer's financial statements as an asset, called "Unamortized
Goodwill." Realistically, it is not a "real" asset, except
under accounting theory -- it generates no income, and has to
be written off (expensed), sooner or later. In W${'$'}R, this asset
is expensed (or "amortized") gradually, at 5.4% per quarter
(equal to about 20% annually, on the remaining balance of that
account). Thus, if acquiring 200M of goodwill, the buyer would
amortize (write-off) about 40M in the first year, reducing the
Unamortized Goodwill balance to 160M. In the next year, it
would write off 20% of that, or 32M, and so on.</p>
        <br/>

        <p>The amortization is a non-cash expense, which is tax-deductible,
but it also reduces reported operating income. A more rapid
write-off of the goodwill balance can occur if the business
assets should begin to generate losses, due to a bad economy
or mismanagement, or if the amount of goodwill amounts to more
than 100% of the company's net worth, or becomes more than 75%
of the amount of the company's business assets (such as where
it sells off most of its assets). If the balance is reduced to
below 10M, the remaining balance will be written off in the
next quarter. A company that goes through bankruptcy will have
to write off <em>all</em> of the goodwill that remains on its books,
during the bankruptcy proceeding, under the theory that the
"goodwill" no longer exists, since the company is no longer
operating at a superior level of profitability. (Obviously.)
Thus, lenders will tend to lose more in a bankruptcy where
the borrower had a large amount of goodwill as an asset, as
that "asset" will evaporate into thin air, and cannot be
turned into cash, unlike other assets, when the company falls
on hard times.</p>
        <br/>
        </div>
        <br/>

        <p><strong>GREENMAIL</strong>--A practice made popular in recent years
by certain corporate raiders who take a large position in a
target company's stock. Management of the target company,
fearful of a takeover that would cause them to lose their
jobs, stock options, chauffeured limousines, palatial homes,
ski chalets, Learjets, high-maintenance mistresses, and other
God-given birthrights, quite consistently find it to be in
the company's best interest to buy back the raider's stock
holdings for a price well above current market prices, in
exchange for a promise by the raider to go away and pick
on some other company. The money extracted from the target
company is frequently referred to as "greenmail," perhaps
due to the uncanny resemblance of such a payment to its
only slightly less savory cousin, blackmail.</p>
        <br/>

        <p>In Wall ${'$'}treet Raider, a "greenmail" buyback can be made
of the stock held by a non-controlling corporate shareholder,
but not of stock held by a player, and not of stock held by
a company controlled by the same player whose company is
paying the greenmail. That would be a blatant form of fraud --
not merely immoral, but illegal. <em>Too</em> blatant, even for
Wall Street.</p>
        <br/>

        <p><strong>GROSS DOMESTIC PRODUCT</strong>-- An economic statistic that
represents the estimated value of all goods and services
produced in a country in a year, which is a measure of an
economy's overall size and its level of activity.</p>
        <br/>

        <p><strong>HOLDING/TRADING COMPANY</strong>--A corporation that does not
actively engage in business itself, but instead holds the stocks
of one or more operating subsidiaries. In Wall ${'$'}treet Raider,
any company, other than a bank or insurance company, that no longer
has any "business assets," is classified as a "holding/trading
company." In Wall ${'$'}treet Raider, once a company has become a holding
company, it can enter into any industry you choose for it, other
than banking, insurance, or exchange-traded funds (ETF's), by using
the "Buy Corporate Assets" command button on the Buy/Sell Menu to
acquire business assets from an existing company in that industry
or acquire new business assets. Another way such a company can
acquire business assets and enter an industry is if it is a
100%-owned subsidiary of another company that drops down some of
its business assets to the subsidiary as a capital contribution,
using the "Capital Contribution" button on the Finance Menu to
do so.</p>
        <br/>

        <p>However, if the holding company has
${helpLink('glossary_CARRYOVER', 'tax loss carryovers')}, they will be
lost if it enters a new line of business by acquiring business assets.
In Wall ${'$'}treet Raider, holding/trading companies are allowed to buy
and sell put and call options and trade commodity futures, physical
commodities, and interest rate swaps, as well as investing in stocks
of other companies.</p>
        <br/>

        <p><strong>INDEX FUND</strong>--An investment fund, such as an ETF, designed
to track the movements of a stock index. Some index funds,
such as those in this simulation, are leveraged by buying or
shorting large amounts of index futures, in order to multiply
the effects of movements of the actual index by some
multiple, usually 2 or 3 times the movement of the underlying
index. In this simulation, as in the real investment world,
leveraged index funds are useful as high-powered short-term
trading vehicles, but are generally abysmal as long-term
investments, due to their incessant trading of futures,
resulting in commissions and other trading costs that rapidly
deplete the assets of such funds, in normal circumstances.</p>
        <br/>

        <div id="glossary_IN_FORCE">
        <p><strong>INSURANCE IN FORCE</strong>--A technical term used in the insurance
industry to describe the amount of insurance a company has
written, and which is still in force. In Wall ${'$'}treet Raider,
it is used more loosely, and is deemed to be proportional to
the insurance company's "policy reserves." See definition of
"${helpLink('glossary_POLICY', 'POLICY RESERVES')}" below.</p>
        <br/>
        </div>
        <br/>

        <p><strong>INTEREST RATE SWAP</strong> -- A derivative instrument which is a
contract or agreement between two parties. In an interest rate swap, one party
agrees to receive interest payments at a fixed rate, based on some published
interest rate like the banks' Prime Rate (usually set at or near the current rate
at the time the swap is agreed to), while in exchange paying the other party
whatever that published rate rises to or falls to as it fluctuates in the future,
over an agreed time period. The interest is computed on a specified "notional"
principal amount, such as ${'$'}100 billion. The net difference between the fixed rate
and the varying rate at certain dates in the future is paid from one party to the
other. In Wall ${'$'}treet Raider, swaps can begin as early as the next calendar quarter
and can remain in effect for up to 5 years. Interest calculations and payments
to the "winning" party are made at the end of each quarter during the term
of the agreement.</p>
        <br/>

        <p>Either party to an interest rate swap can cancel the contract early by
paying a cancellation fee (computed by the Wall Street Raider software) to
the other party.</p>
        <br/>

        <p><strong>INTRINSIC VALUE OF OPTIONS</strong>--This refers to the
value of a put or call option other than its "time value,"
such as at the date the option is expiring. A call option's
intrinsic value is the excess of the underlying stock's
price over the exercise ("strike") price of the option.
For example, if the stock price is ${'$'}60 and the strike
price is ${'$'}50, the intrinsic value of the call option is
${'$'}10. However, if the stock price is ${'$'}50 or less, the
intrinsic value is zero.</p>
        <br/>

        <p>For a put option, the intrinsic value is the strike price
minus the stock price. Thus, if the strike price of a put
is ${'$'}50 and the stock is down to ${'$'}40, the put has an intrinsic
value of ${'$'}10, or has no intrinsic value if the stock price
is ${'$'}50 or higher.</p>
        <br/>

        <p>When an option has time remaining before it expires, it
will also have "time value," in addition to any intrinsic
value. For example, a ${'$'}50 call might have zero intrinsic
value if the stock is at ${'$'}49, but might trade at ${'$'}5 if
the option does not expire for several months, all ${'$'}5
of which would be "time value." Or, if the stock is at
${'$'}52, the intrinsic value would be ${'$'}2, but the option
might trade at ${'$'}6, having a time value of ${'$'}4 in addition
to its intrinsic value. See also the definition of
"TIME VALUE OF OPTIONS" below.</p>
        <br/>

        <p><strong>INVESTMENT ANALYST</strong>--On Wall Street, a highly-paid, highly
skilled specialist, one whose job it is to analyze the investment
outlook for companies and to get caught napping when a company
surprises everyone by filing for bankruptcy, shortly after the
investment analyst has issued a "strong buy" on the company's
stock, and attested to the company being "sound as the dollar."
Synonyms: "Eternal optimist; soothsayer; scoundrel; huckster;
dreamer; charlatan." To the child and the investment analyst,
all things are possible.</p>
        <br/>

        <p><strong>JUNK BONDS</strong>--In Street language, high-yielding,
high-risk bonds issued by companies of dubious credit worthiness,
often for the purpose of taking over another company or for a
"leveraged buy out" in which the company buys back most of its
own stock, allowing holders of a few shares (usually management)
to become the only remaining shareholders.</p>
        <br/>

        <p>In Wall ${'$'}treet Raider, junk bonds are any bonds issued by a
highly-leveraged, risky corporation; they pay interest at a rate
that depends on their credit rating. As in the real world, companies
in Wall ${'$'}treet Raider that issue a lot of junk bonds face a high
risk of bankruptcy if their business hits a few rough spots. Not
all corporate bonds are considered junk -- if a company's credit
rating is BBB, A, AA, or AAA, the corporate bonds are not "junk,"
but are considered to be "investment grade" bonds. (At least
until they are later downgraded to "junk," after the skeletons
come out of the closet.)</p>
        <br/>

        <p>Any bonds rated BB or lower (B, CCC, CC, C, or D) are very
risky, however, and are thus quite properly called "junk bonds."
To Wall Street insiders, "junk bonds" are those that are issued
with neither the hope nor the intention of ever paying back the
principal amount thereof to the investors/suckers who are
foolish enough to buy the stuff.</p>
        <br/>

        <p>To certain churlish types, like your esteemed author, who
have repeatedly been badly burned by making massively stupid
investments in these unsavory securities, junk bonds are known
as "certificates of confiscation."</p>
        <br/>

        <p><strong>LAWYER</strong>--The larval form of a politician.</p>
        <br/>

        <p><strong>LBO OR LEVERAGED BUY OUT</strong>--A transaction in which one
or a few people buy a small part of the stock of a company
and then have the company borrow enough money to buy out
all of the other shareholders, so that the buyers obtain
most or all of the stock of the company with little or no
investment on their part. In some cases, they may even
extract dividends from the company afterwards, in order to
quickly recoup part or all of their investment (or more).
In Wall ${'$'}treet Raider, a player (or a company controlled by
the player) can sometimes do an LBO by buying minimal control
of a target company (say 20%), and then having the company
borrow or issue junk bonds to finance a buyback of the other
80% of its stock (using the "LBO" or "GreenMail" commands button
in the "Buy / Sell" transactions menu), leaving the acquiring
player or company with 100% ownership of a highly leveraged
corporation.</p>
        <br/>

        <p>An LBO can be a great strategy if the company does
well. If things don't work out, though, all the added debt
(leverage) can result in a financial meltdown for the LBO'd
company -- which happens more often than not when a company
is that massively leveraged with debt.</p>
        <br/>

        <div id="glossary_SOFR">
        <p><strong>SOFR RATE</strong>--The name given to a benchmark interest
rate, usually quite low, which is the rate banks charge each
other for overnight loans. SOFR is an acronym, which stands for
"Secured Overnight Financing Rate." In the real world, various
interest rates on loan instruments are based on the SOFR rate.
In Wall ${'$'}treet Raider, it is used only as the rate at which
banks pay interest on interbank loans, and is loosely related
to the Prime Rate and the rate paid on CDs. Banks with
less-than-Sterling credit ratings in Wall ${'$'}treet Raider may pay
somewhat more than the SOFR rate on their interbank borrowings.
(In 2023 or later versions of Wall ${'$'}treet Raider, the SOFR rate
has replaced the LIBOR ("London Interbank Offered Rate") rate,
which is no longer in use in the real world.</p>
        <br/>

        <p>As news back in 2012 disclosed, the LIBOR rate was rigged
for years by crooks at 20 or more of the world's largest banks,
manipulated to increase their profitability on various debt
instruments. Accordingly, in the real world, the LIBOR rate was
scheduled to be phased out at the end of 2021, possibly to be
replaced by the Secured Overnight Financing (SOFR) Rate and
Overnight Index Swap (OIS) Rate, or possibly by other alternative
standard reference rates to be used in loan instruments and interest
rate swap transactions. (In fact, LIBOR has finally been officially
phased out after June 30, 2023 in the real world and generally
replaced by SOFR. We did the same in Wall ${'$'}treet Raider in 2023.)</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_LIMIT_ORDER">
        <p><strong>LIMIT ORDER</strong>--An order a customer places with a broker
to buy or sell a security, in which the customer specifies
the price he or she is willing to accept. A limit order
does not always get executed, if the stock price moves
away from you. It stands in contrast to a "market order,"
in which you indicate you will take whatever price the
stock specialist is willing to give you, like a common
beggar. In short, a limit order is often a safer way of
trading stocks or other securities, while regularly
doing market orders is a good way to become a homeless
beggar. See ${helpLink('glossary_MARKET_ORDER', '"MARKET ORDER"')}
below.</p>
        <br/>
        </div>
        <br/>

        <p><strong>LINE OF CREDIT</strong>--An amount a lender, such as a bank,
agrees in advance to lend to a customer, if the customer
wishes to borrow it. In Wall ${'$'}treet Raider, each player and
company normally has a line of credit allowing him or it to
borrow up to a maximum of 1 times net worth. To have a line
of credit, you must demonstrate to your financial institution
that, basically, you don't need to borrow. Bankers are, in
short, the type of people, as Alan Abelson once put it, who
will only lend you an umbrella on a sunny day.</p>
        <br/>

        <p>In Wall ${'$'}treet Raider, a company or player can usually borrow
on a line of credit until its debt is equal to 100% of net
worth. Thus, if you have ${'$'}500 million cash and no debt, you
can borrow up to ${'$'}500 million on your line of credit. If playing
at Difficulty Level 2 or 3, a player may be able to borrow up
to 2 or 3 times his or her net worth, if he or she obtains control
of the lending bank. Thus, at Difficulty Level 2 or 3, a player
can actually have a larger line of credit, which might seem like
an advantage of playing at a higher difficulty level than "1,"
but it actually increases your risk of bankruptcy greatly, if
you succumb to the temptation of borrowing up to 2 or 3 times
your net worth, because even a slight decline in your stock
holdings will be magnified if you are using that much leverage.
Taking on that much leverage is roughly the equivalent of being
given enough rope to hang yourself, or giving whiskey and car
keys to a teenager.</p>
        <br/>

        <p>However, your sharp-eyed banker may not always give you full
credit for put or call options owned by you (or by a company),
when considering a loan to you or a company or determining
credit ratings. If you own put or call options, only the net
intrinsic value of the options will be counted (the amount by
which the options are "in-the-money"). Thus options that have
value but that are "out-of-the-money" (such as a call option
at ${'$'}35 on a stock that is selling at ${'$'}32) will have zero
intrinsic value, and thus the market value of such long option
positions will not be counted in determining your net worth,
when calculating how much you may borrow on your line of credit
or when calculating your credit rating (and thus the interest
rate you must pay). Similarly, if you own a call option with
a strike price of ${'$'}43, and the stock is at ${'$'}45, its intrinsic
value is only ${'$'}2, even though the market value of the call may
be ${'$'}6 at the moment, if it has several months of time value
before it expires.</p>
        <br/>

        <p>Note, also, that your borrowing may be subject to a ${'$'}10
billion (U.S. or equivalent) dollar limit for any player or
company, or 25% of the lending bank's total loan portfolio,
if that is greater. Your line of credit will be temporarily
frozen if it goes above the greater of those two amounts.
(In which case you may want to try to switch your banking
relationship to a larger bank that can give you a larger
line of credit.)</p>
        <br/>

        <p>Also, if an opposing player can gain control of the bank
you (or companies you control) borrow from, the other player
may choose to "freeze" your line of credit, or even call in
large portions of your bank loan.</p>
        <br/>

        <p>See ${helpLink('chap04_IV(D)(1)', 'Section IV.D')} for details
regarding potentially expanded lines of credit for corporations
in Version 6.60 and later.</p>
        <br/>

        <p><strong>LIQUIDATION</strong>--A corporate transaction in which a
parent corporation, in effect, merges a wholly-owned subsidiary
corporation into itself, so that all of the assets, debts, etc.
of the subsidiary become property or debts of the parent, and
the subsidiary corporation ceases to have any further activity,
and ceases to exist. In Wall ${'$'}treet Raider, as in the real
world, such liquidations of wholly-owned subsidiaries are
usually non-taxable events. However, it is also possible to
do taxable liquidations, where the corporation turns all of
its assets into cash, pays off its debts and any taxes it
owes, and distributes the cash to shareholders before it
ceases to exist, with the shareholders recording a gain or
loss, as though they had sold their stock for the cash they
receive in the liquidation.</p>
        <br/>

        <p><strong>LITIGATOR</strong>--An often despised subspecies of the much-feared reptilian
species <em>Lex disputatis</em>; half literate, half alligator; known for its aggressive,
ferocious, pit bull-like characteristics, and its penchant for going for the
opponent's jugular and the client's pocketbook, often simultaneously. Like
others of its species, heavy infestations of <em>Lex disputatis intimidatum</em> are
found in California, New York, or wherever there are large concentrations of
filthy lucre, on which it thrives.</p>
        <br/>

        <p>The litigator subspecies is easily recognized by its sharp tongue and
elbows, quick reflexes, its habit of toting large briefcases (often filled
only with peanut butter sandwiches), and its highly developed aptitude for
lying to and hypnotizing judges and juries. As it multiplies at an
exponential rate under favorable breeding conditions, it is widely
considered a pest throughout its range, and large infestations are often
mistaken for clouds of devouring locusts.</p>
        <br/>

        <p><strong>LOAN PORTFOLIO</strong>--The loans made by a bank, on which
it hopes to earn interest. The value of a bank's loan
portfolio is offset by a reserve for potential bad debts.
See definition of "${helpLink('glossary_BAD', 'BAD DEBT RESERVE')}"
above. In Wall ${'$'}treet Raider, banks invest some of their funds
in consumer and mortgage loans, as well as making business
loans to players and corporations. Consumer loans and "subprime"
mortgage loans are made at high interest rates, but the banks
have frequent large charge offs for bad such loans, particularly
during recessions. "Prime" mortgage loans, on the other hand,
earn much lower rates, but have far fewer bad debt charge-offs.</p>
        <br/>

        <p>Corporate loans and loans to players earn interest rates
based on the banks' Prime Rate, which is the lowest rate
charged, to AAA credit-rated borrowers. Other borrowers pay
higher rates that depend on their credit rating, if not AAA.
The worse their credit rating, the higher the interest rate
they pay.</p>
        <br/>

        <p><strong>LOBBYIST</strong>--In America, a political courtesan; one who
greases the wheels of the political system; a legal bribe-giver.
Lobbyists are recognizable by their Gucci shoes, Louis Vuitton
briefcases, Beltway addresses, Aspen chalets and unlimited expense
accounts, or, more recently, by their neatly pressed Chinese People's
Liberation Army Generals' uniforms. Noted for their self-proclaimed
public spiritedness and altruism, lobbyists aver that they provide
foreign travel junkets, first-rate hookers, and suitcases full of
cash to high-ranking government and political party officials solely
out a sense of civic duty, all with no expectation whatsoever of
receiving any <em>quid pro quo.</em></p>
        <br/>

        <div id="glossary_MARKET_ORDER">
        <p><strong>MARKET ORDER</strong>--An order a customer places with a
broker to buy or sell a security "at the market" -- an often
suicidal financial strategy or an invitation to be financially
raped. See ${helpLink('glossary_SPECIALIST', '"STOCK SPECIALIST"')}
below and ${helpLink('glossary_LIMIT_ORDER', '"LIMIT ORDER"')} above.</p>
        <br/>

        <p>However, it is usually safe (in the real world) to place a
market order on a heavily traded stock, where the bid/ask spread
is often only a penny or two per share, as long as you are only
buying or selling a few hundred shares.</p>
        <br/>
        </div>
        <br/>

        <p><strong>MARKET SHARE</strong>--A company's percentage share of total
sales in a particular industry. In Wall ${'$'}treet Raider, this
is the same as the company's share of "business assets" in
that industry. In general, the larger a company's market share
percentage, the more profitable the company tends to be,
compared to other companies in the industry. Thus, it is a
good strategy to merge two or more companies you own (and
liquidate one into the other), if they are in the same
industry, so that they become one large company, with a
larger market share than either had alone, which will usually
improve profitability, due to economies of scale. During the
great "dot-com bubble" at the end of the 20th century, it became
the conventional wisdom that "market share" was more important
than profitability, leading many companies to expand wildly,
floating huge amounts of stock and junk bonds to finance their
rapid expansion. (Most of them are now bankrupt, or "penny stocks,"
at best.) Over-expansion works the same way in Wall ${'$'}treet Raider.</p>
        <br/>

        <p><strong>MERGER</strong>--In the real corporate financial world, the
term usually refers to a transaction where the assets and
liabilities of two companies are legally brought together
in a single "surviving" corporation. It also is often
used to describe stock-for-stock swaps between a company
and the shareholders of a target company, where the target
company ends up as a wholly-owned subsidiary of the acquiring
company. A "merger" in Wall ${'$'}treet Raider (using the
"${helpLink('chap06_VI(B)(6)', 'Merger')}" command button
in the "Buy / Sell" transactions menu) is of the latter variety.</p>
        <br/>

        <p>The "${helpLink('chap07_VII(B)(8)', 'Tax-Free Liquidation')}"
command button can often be used in Wall ${'$'}treet Raider to effect
what is essentially a merger of the type described in the first
sentence of this definition, but only after one corporation
acquires 100% of the stock of the corporation to be liquidated,
either by purchase or merger.</p>
        <br/>

        <div id="glossary_NOTIONAL">
        <p><strong>NOTIONAL VALUE</strong>--The face value or agreed total contract
value for a derivative contract, such as a commodity futures contract.
For example, a contract to buy 10,000 barrels of oil at ${'$'}51 per
barrel at an agreed future date would have a notional value of
${'$'}510,000. In the interim, before the delivery date, the contract
would usually trade at a market price above or below its notional
value and at settlement (before or on the expiration date) in W${'$'}R
the difference between market value and notional value is a gain
or loss to the contracting player or company, when the contract is
closed out on the commodities exchange.</p>
        <br/>

        <p>In the case of an interest rate swap contract, the notional
value is the amount of principal on which interest is calculated
at the agreed fixed rate and the actual current rate, with the
difference in the interest calculated both ways being paid by
one party to the other.</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_PE">
        <p><strong>P/E RATIO</strong>--Wall Street jargon for "price/earnings
ratio," or the multiple of earnings per share that a stock
sells for. For example, a ${'$'}100 stock of a company earning
${'$'}5 per share would be said to have a P/E ratio (or earnings
multiple) of 20; that is, the stock sells for 20 times its
earnings per share. Stocks of rapidly growing companies
often sell at high P/E ratios, because the stock market is
"anticipating" much higher earnings in the future. Stocks
of all companies tend to sell at lower P/E ratios when
interest rates are at high levels (and vice versa). During
major bull markets ("bubbles"), investors are always told
by the experts that earnings, and therefore P/E ratios (even
if ridiculously high), are no longer important and thus can
be ignored.</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_POLICY">
        <p><strong>POLICY RESERVES</strong>--Accounting reserves insurance
companies are required to set up on their books when they
sell an insurance policy. Policy reserves are, in effect,
estimates of how much money the insurer needs to set aside
to pay future insurance claims. They might also be considered
as a kind of "loan" (without interest) from the insurance
company's customers. Most insurance companies make most or
all of their profits from investing these reserves for the
period between the time they collect a premium and when they
eventually have to pay a claim. For example, in a given
year, an insurer might take in ${'$'}100 in premiums and pay out
${'$'}103 in claims and expenses, so that it would have an
underwriting loss of ${'$'}3, but might earn ${'$'}10 interest on
the "float" during the year, resulting in an overall profit
for that year. In Wall ${'$'}treet Raider, an insurer's policy
reserves are assumed to grow at the same rate as its
"${helpLink('glossary_IN_FORCE', 'insurance in force')},"
defined above.</p>
        <br/>
        </div>
        <br/>

        <p><strong>PORTFOLIO MANAGER</strong>--An investment expert whose job it
is, for a modest fee, to manage your investment portfolio until
there is nothing left.</p>
        <br/>

        <p><strong>PRODUCTIVITY EXPENDITURES</strong>--In Wall ${'$'}treet Raider,
money a company spends each year on either R & D (Research &
Development), or on marketing/advertising, to try to improve
its profitability. The higher the percentage of sales or revenues
a company spends, the better its chances of improving long-term
profitability, but the high costs or R & D or marketing/advertising
will penalize the company's earnings in the short-term. It is a
form of short-term pain, for (hoped-for) long-term gain.</p>
        <br/>

        <p><strong>PUBLIC OFFERING</strong>--An issuance of securities for sale
to the public, usually (but not always) by the issuing company.
In Wall ${'$'}treet Raider, a Public Offering is a sale of new stock
by a corporation to the Public for cash, to raise new capital
for the corporation. (By contrast, a "private offering" is a
sale of stock to only one or a few investors--see "${helpLink('glossary_WK', 'White Knight')}," described in this Glossary, regarding a private stock
offering in Wall ${'$'}treet Raider.)</p>
        <br/>

        <p><strong>PUBLIC RELATIONS</strong>--An organized method of mass communication,
calculated to circumvent critical thinking and induce a state of
prolonged stupor; also, in politics, a term used to describe
relatives who feed at the public trough.</p>
        <br/>

        <div id="glossary_PUT_OPT">
        <p><strong>PUT OPTION</strong>--An option to sell a stock at a specified
price over an agreed period of time. The person who buys a put
option is betting that the underlying stock is going to go
down. A lot. The person who sells, or sells short, a put option
is betting that the stock will either go up, go nowhere, or
only will go down slightly. In Wall ${'$'}treet Raider, corporations
may trade put options, but banks and insurance companies may
only use puts to hedge stocks they own.</p>
        <br/>
        </div>
        <br/>

        <p><strong>QUANTITATIVE EASING</strong>--A very "loose" monetary policy,
one employed by central banks in order to prop up the prices
of investment assets such as stocks and bonds, by forcing
interest rates down to very low levels. In recent years,
"Q.E." has been a favorite tool of the Federal Reserve, the
European Central Bank, and the Bank of Japan, supposedly
used for the purpose of stimulating their respective economies,
but with no notable results other than economic stagnation
and growing unemployment, and creation of temporary "bubbles"
in various sectors of the financial markets.</p>
        <br/>

        <p>The actual purpose of Q.E. is to allow governments to borrow money
at artificially low, zero, or even less than zero interest rates, to
facilitate their massive spending programs, <em>i.e.,</em> vote-buying.
"Quantitative easing" is a more palatable term for money printing,
since the the practice of money printing by central banks has a
rather unsavory history and has consistently had less than salubrious
consequences, as in the German Weimar Republic's runaway inflation
in the 1920s (some say it led to the rise of Hitler). More recently,
unrestrained money printing resulted in insane levels of inflation
in Zimbabwe, where a loaf of bread eventually cost trillions of
Zimbabwe Dollars, courtesy of "quantitative easing" by that African
nation's Marxist government. But, in theory, it's a good thing --
in the short run, at least.</p>
        <br/>

        <p><strong>R & D (RESEARCH AND DEVELOPMENT)</strong>--R & D expenditures
are funds spent to create new products or production processes
or to improve existing ones. Since R & D expenses usually
penalize current earnings, even though they may greatly
increase long run profits, managements are often tempted
to cut out R & D spending in the short term to make earnings
look better. In Wall ${'$'}treet Raider, companies in certain
industries are faced with this same choice between short-term
vs. long-term profitability, in deciding how much money to
spend on R & D. Besides lowering current earnings, a company
runs the risk that money spent on R & D projects will not even
pay off in the long run or may not pay off soon enough to
avert bankruptcy.</p>
        <br/>

        <p><strong>RESTRUCTURING</strong>--Selling the family jewels; throwing
out the baby with the bath water. Also, in financial parlance,
"downsizing" a company by selling off assets, jettisoning
employees by the thousands, looting the company pension plan,
and using other time-honored scorched-earth tactics to improve
the bottom-line profitability of the company, if it ultimately
survives the bloodletting. As Conan the Barbarian once said,
"Zat vich doesn't kill you makes you shtronger..."</p>
        <br/>

        <p>(Or was that Conan the Contrarian???)</p>
        <br/>

        <div id="glossary_ROC">
        <p><strong>RETURN ON CAPITAL ASSETS</strong>--In Wall ${'$'}treet Raider,
this terminology has a very specific meaning -- the amount
of profit generated each year by a given amount of "business
assets" (which we sometimes refer to as "capital assets"
in the simulation). Accordingly, if a company has ${'$'}100 million
of business/capital assets earning a 12% return on capital,
that means it is earning ${'$'}12 million for the year. Since
earnings are computed quarterly and vary from quarter to
quarter, a ${'$'}3 million profit in one quarter would be reported
as an annualized 12% "return on capital assets."</p>
        <br/>

        <p>Note that this profit figure does not take into account
other types of income, such as interest, dividends, or gains
on various transactions, or expenses such as interest or taxes.
Thus, a company may have a 12% return on capital, but if
it is paying a 17% interest rate on a bank loan and is highly
leveraged, it may actually have a net loss. However, even if
it does have a net profit, even that will be further reduced
by income taxes, so its "RETURN ON EQUITY" will bear little
resemblance to the "return on capital."</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_ROE">
        <p><strong>RETURN ON EQUITY</strong>--A way of calculating a company's
level of profitability; a percentage figure determined by
dividing its net income by its net worth. Returns on equity
are typically in the 10 to 15% range for many global corporations.
Returns of over 20% are considered to be unusually good, and
tend to attract (unwanted) new competitors, much as honey
tends to attract flies. In Wall ${'$'}treet Raider, returns on
equity tend to be very much in the same range as in the
real world, and a highly profitable industry will tend to
attract new entrants.</p>
        <br/>

        <p>In Wall ${'$'}treet Raider, when "return on equity" is shown
for any company, it is the last full year's earnings divided
by its net worth at the end of that year.</p>
        <br/>
        </div>
        <br/>

        <p><strong>SEC</strong>--Abbreviation for "Securities and Exchange
Commission," the federal agency charged with acting as a
watchdog over investment markets in the USA, which usually
behaves more like a lap dog. Its main job seems to be to get
caught napping each time a major investment fraud is perpetrated
against millions of investors. All publicly-traded companies
are required to regularly file financial reports with the
SEC, which from time to time takes legal action to prevent
the boiler-room types from fleecing the public investors
too flagrantly. However, in most cases its role is to come
in after the disaster has occurred and shoot the wounded.</p>
        <br/>

        <p>In Wall ${'$'}treet Raider, the SEC is merely another annoying
American government agency that may intervene at inopportune
times to block those too-clever transactions you thought you
could get away with.</p>
        <br/>

        <p><strong>SHORT SALE</strong>-- Selling a stock (or other investment vehicle)
that you do not own, by borrowing the stock from a person who owns
it and selling it now, with the hopes of buying the stock back
later at a lower price, returning the shares to the owner, and
making a profit on the decline in the price of the stock. Of
course, if the stock goes up, and you have to buy it back, you
will lose money on the transaction. As the old saying on Wall
Street goes, "He who sells what isn't his'n, must buy it back, or
go to prison."</p>
        <br/>

        <div id="glossary_SPIN_OFF">
        <p><strong>SPIN-OFF</strong>--A transaction, usually done tax-free,
where a parent corporation distributes the stock of a subsidiary
to the parent corporation's shareholders. See the description
of the ${helpLink('chap07_VII(B)(10)', 'Spin-off Subsidiary')} command
button on the ${helpLink('chap07', 'FINANCING')} Menu, which is
used to do a spin-off, tax-free or otherwise. A spin-off is usually
done when the subsidiary is generating large losses that, when
combined with the parent's results, are making the reported
earnings of the parent look bad, so the parent spins off the
stock to its shareholders and lets THEM worry about it. It is
one of the many ways corporate managers manipulate earnings
to make them look better (and hide their own incompetence, by
burying the bodies where no one can find them).</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_SPOT">
        <p><strong>SPOT PRICE</strong>--In commodity futures trading, the spot price
is the price of the commodity for immediate delivery, as opposed
to the futures prices for future delivery. In W${'$'}R, the spot prices
of commodities are the prices displayed on the main screen. For
cryptocurrencies, the current spot price is shown on the General
Research Menu or on the screen that pops up when you click on the
${helpLink('chap06_VI(B)(18)', 'Trade Cryptocurrencies')} button on
the BUY / SELL menu.</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_SPECIALIST">
        <p><strong>STOCK SPECIALIST</strong>--One of the clan of wolves with yellow
eyes and sharp fangs who works tirelessly on the floor of the
stock exchange, betting against the sheep who wish to buy or sell
stocks, who must trade against these cunning beasts. Members of
the public who buy stock from or sell stock to such traders are
like players in a poker game, where the stock specialist is the
dealer and gets to see your hand before he bets. These remorseless,
feral creatures harvest much of their profits from unsuspecting,
naive investors who are foolish enough to place
"${helpLink('glossary_MARKET_ORDER', 'market orders')}" with their
stockbrokers.</p>
        <br/>
        </div>
        <br/>

        <p><strong>STOCKBROKER</strong>--A professional person who dials for dollars,
dispensing free (nevertheless grossly overpriced) investment advice
to all who will listen, from an inexhaustible list of bad, worse, or
terrible investments, usually recommending that one buy a stock that
he or she, personally, is selling short; typically, a person who was
selling shoes or aluminum siding before the latest market frenzy, and
who will leave you dealing with pawnbrokers, not stockbrokers, once
your life savings have been reduced to pocket change.</p>
        <br/>

        <p><strong>STRADDLE OPTION</strong>--A combination of a ${helpLink('glossary_CALL_OPT', 'call option')} (to buy a stock at a specified price) and a
${helpLink('glossary_PUT_OPT', 'put option')} (to sell the stock at that same
specified price). The person who buys a straddle option is betting
that the underlying stock is going to fluctuate greatly from the
current stock price, by the time the put and the call expire, and
that either the put or the call option will be worth more at that
time than was paid for the two options. The person who sells, or
sells short, a straddle option is betting that the stock will NOT
fluctuate greatly by the time the put and call expire.</p>
        <br/>

        <p>The call side of the transaction will be worthless when the
expiration date arrives, while the put side will have some value,
if the stock price is below the "strike price" (exercise price)
of the options at that time; and vice versa if the stock is above
the strike price at expiration. (Of course, neither side would
have value if the stock price is at exactly the strike price, but
that almost never happens.) The only question for the buyer and
the seller of a straddle is: How MUCH value will one side of the
straddle have at expiration? More than the price paid for the
options? Or less?</p>
        <br/>

        <p><strong>STRIKE PRICE (OR STRIKING PRICE)</strong>--The price at which a
put option or call option is exercisable. Sometimes also
called the "exercise price." This is the price you pay for a stock if
you exercise a call option, or the price you receive if you
exercise a put option.</p>
        <br/>

        <p><strong>TAKEOVER</strong>--The act of taking "control" of a corporation,
by acquiring enough of its voting stock to elect a majority of the
board of directors, thus allowing the person doing the takeover to
direct the actions of the corporation. In Wall ${'$'}treet Raider, a
takeover may be effected through a cash tender offer for stock held
by the Public, using the "${helpLink('chap06_VI(B)(1)', 'Buy Stock')}"
command button in the "Buy / Sell" transactions menu, or by a
stock-for-stock merger, using the "${helpLink('chap06_VI(B)(6)', 'Merger')}"
command button. (On Wall Street, a takeover is that step which
often immediately precedes the looting of a once-healthy
corporation.)</p>
        <br/>

        <p>In Wall ${'$'}treet Raider, the player or company doing a takeover
must always obtain a minimum of 20% of the target company's stock
in order to gain control. Also, in Wall ${'$'}treet Raider, you can
buy up to 5% of a company's stock on the open market, which will
tend to run up the price of the stock somewhat. However, if you
are acquiring (in total, counting existing holdings) more than
5% of a company's stock, you have to do so by a tender offer to
the public at well above the current market price. (The "Buy Stock"
command automatically computes the correct purchase price either
way, depending on whether you are making open market purchases of
5% or less, or "tendering" to acquire more than a 5% interest in a
company.) If the stock you or your company want to buy is already
owned by another company, you can make a formal offer to buy the
stock, which will sometimes be accepted, other times refused if
the price you offer is not high enough.</p>
        <br/>

        <p><strong>TAX AUDIT</strong>--A financial proctoscopic exam, performed by
malevolent and sadistic civil servants in a medieval setting,
without benefit of anesthesia.</p>
        <br/>

        <p><strong>TAX BASIS</strong>--The cost, or price paid for an asset, used to
determine whether there is a gain or loss when it is sold or exchanged,
or becomes worthless. In Wall ${'$'}treet Raider, the program keeps track
of the tax basis of all stocks and bonds owned by players or corporations,
in order to determine gain or loss when the stock or bond is sold or
becomes worthless. Note that in Wall ${'$'}treet Raider, any amount paid in
excess of par (over face value) for a bond is amortized as a non-cash
expense each quarter over the remaining life of the bond, and gradually
reduces the tax basis of the bond, until it is equal to face value (par)
at the time the bond matures (unless it is a convertible bond).</p>
        <br/>

        <p>Or, if you pay less than par for a bond, the discount on the
purchase is amortized as a non-cash taxable income item each
calendar quarter, over the remaining life of the bond, gradually
increasing your tax basis for the bond until it is equal to face
value (par) at the time the bond matures. A player or company can
see the tax basis of all stocks and bonds he, she, or it owns, by
clicking on the "Tax Basis Info" button on the "ENTITY INFO" Menu,
when the player or a particular company is the currently selected
${helpLink('chap03_III(A)', 'Active Entity')}.</p>
        <br/>

        <div id="glossary_CARRYOVER">
        <p><strong>TAX LOSS CARRYOVER</strong>--If a corporation has more losses
than income during a year, it will usually pay no taxes, and
the net loss becomes a "tax loss carryover" that can be used
to offset taxable income in another year. In the real world,
until 2018 (in the U.S., at least), a corporation could carry
back a tax loss to either of the two preceding years, or carry
it forward to any of the 20 following years, until it is "used
up." In Wall ${'$'}treet Raider, a corporation is only allowed to
carry a tax loss forward, not backward in time. While in the
real world, tax loss carryovers expired after 20 years, in Wall
${'$'}treet Raider, the losses don't expire, but prior to Version
8.10, the unused loss from prior years was reduced by 10% at
the end of each year. However, the U.S. tax law, on which
W${'$'}R is loosely based, changed in 2018 to only allow losses
to be carried forward, but indefinitely, with no expiration.
Accordingly, we changed the W${'$'}R tax rule on carryovers to
conform to the new U.S. tax law.</p>
        <br/>

        <p>You can find out if a company has a tax loss carryover by
using the "${helpLink('chap10_X(D)(3)', 'Financial Profile')}"
command.</p>
        <br/>
        </div>
        <br/>

        <p><strong>TENDER OFFER</strong>--An offer by a person or company to
acquire part or all of the stock of a company, usually made
at an attractive price (considerably above the current market
price of the stock). A "tender offer" is usually made as
part of a takeover attempt (see "TAKEOVER" above), and the
offer is usually only effective if a certain minimum number
of shares are "tendered" for sale. In Wall ${'$'}treet Raider,
a "Tender Offer" is made at a price well above the existing
stock price, and the offer is only effective if the buyer is
able to acquire the percentage of stock specified. A "tender
offer" is required if you will own or control over 5% of the
target company's stock after the purchase.</p>
        <br/>

        <p>When making a tender offer to the Public in Wall Street Raider,
the program computes the tender price. However, if you make a
tender offer to buy stock from a company that you do not control,
you must decide on how much of a premium over the current market
price you wish to offer, such as 25%. The owner of the stock may
accept or reject your offer.</p>
        <br/>

        <p><strong>TICKER TAPE</strong>--In a broker's office, the moving
electronic display of stock prices which shows the price
of each trade of a stock (and the number of shares or "lots"
traded) that occurs on a stock exchange. Stock prices are
usually quoted in dollars per share and decimal amounts.
(In times past, the quotes were printed mechanically on a
narrow paper tape by a "ticker tape" machine--hence the
name.)</p>
        <br/>

        <p>In Wall ${'$'}treet Raider, the electronic "ticker tape"
moves across the bottom part of the screen, reporting a
random sampling of one of every 50 to 100 stock trades that
occurs in the 1500 + stocks that make up the Wall ${'$'}treet
Raider investment universe. Volume is not shown.</p>
        <br/>

        <p><strong>TIME VALUE OF OPTIONS</strong>--The part of the price of a
put or call option over and above the option's "intrinsic value."
For example, if you buy an option exercisable at ${'$'}30 a share
on XYZ Corporation, when the stock is trading at ${'$'}32, the
intrinsic value of the option (also called the amount it is
"in the money") is ${'$'}2 a share. If you paid ${'$'}5 a share for
the option, ${'$'}2 of the price is for the intrinsic value, and
the other ${'$'}3 is the time value. If the stock is still at ${'$'}32
when the call expires, the option will only be worth its
intrinsic value of ${'$'}2, and the ${'$'}3 of time value will have
completely wasted away. See the definition of INTRINSIC VALUE
OF OPTIONS above.</p>
        <br/>

        <p>If, on the other hand, you bought a call option that was
"out of the money," for example, a call exercisable at ${'$'}30
a share when the stock was ${'$'}29, the entire amount you paid
for the option (say ${'$'}3.50) would be time value, since the
option has no intrinsic value when the stock trades below
the strike price (exercise price). Thus, the entire price
of the option will wither away to zero by the expiration
date unless the stock rises to a price above ${'$'}30 by that
date.</p>
        <br/>

        <p><strong>UNDERWRITING RATIO</strong>--For an insurance company, the
ratio of underwriting losses to net premium income. For
example, if an insurer receives ${'$'}1,000 million in insurance
premium income but pays out ${'$'}1,030 million to policyholders,
its underwriting (loss) ratio would be 103%. It would need
to make enough profit on the invested premiums (interest,
dividends, capital gains) to cover that underwriting loss
and overhead expenses, in order to show an overall profit.
If it only had to pay out ${'$'}980 million in claims, then it
would have a 98% underwriting ratio, meaning that it is
actually making a profit on the insurance business. Most
of an insurance company's profits, however, come from
successfully investing the "float" -- which is the money
it takes in today as premiums, which can be invested
until such time as it has to pay a claim to the
policyholder.</p>
        <br/>

        <p><strong>WALL STREET</strong>--A giant spider web, whose denizens
endlessly seek to lure hapless investors to their doom; a vast
coven of money-runners located in tall buildings in downtown
Manhattan, but with tentacles in Washington, D.C. and in
every other place where money and power are to be found.
The penultimate Wall Street firm, Goldman, Sachs, has been
described in <em>Rolling Stone</em> as "... a great vampire
squid wrapped around the face of humanity, relentlessly
jamming its blood funnel into anything that smells like
money."</p>
        <br/>

        <div id="glossary_WK">
        <p><strong>WHITE KNIGHT</strong>--A friendly or neutral company (often
quite large) that purchases a substantial percentage of the
stock of a company at the request of that company's management,
in order to keep the shares out of the hands of a potential
corporate raider who might attempt an unfriendly takeover of
the company. In Wall ${'$'}treet Raider, the
"${helpLink('chap07_VII(B)(4)', 'Private Stock Offering')}"
command button (on the "Financing Transactions" Menu) can
be used to implement the "White Knight Defense," enabling a
company to raise money by selling a substantial block of new
stock to a "neutral" company. The funds raised can then be
used to "buy in" ("${helpLink('chap06_VI(B)(8)', 'LBO')}"
command button) publicly-owned shares, if desired, in order to
make it even more difficult or impossible for an opponent to
buy up enough stock of the company to take control away from you.
In the real financial world, having a White Knight is an important
form of job security for overpaid and poorly performing corporate
executives.</p>
        <br/>
        </div>
        <br/>

        <div id="glossary_WC">
        <p><strong>WORKING CAPITAL</strong>--Money that a company has tied
up in non-productive assets such as inventory or accounts
receivable, as a necessary part of its business. In Wall
${'$'}treet Raider, the more "business assets" a company has,
the larger the amount of cash it must invest in "working
capital," which, unlike cash that can be invested in T-bills
or elsewhere, does not generate any investment income.
If "business assets" are reduced, part of the working capital
will be freed-up and turned back into freely spendable cash.
The more efficient and well-managed the company, in general,
the smaller the percentage of business assets (as little as
5%) that must be committed to working capital; or for the
worst-managed companies, as much as 20% of business assets
must be tied up in working capital. The average is about 12%.</p>
        <br/>
        </div>
        <br/>

        <p><strong>YIELD</strong>--The percentage rate of return on an investment,
such as the interest yield on a bond or certificate of deposit,
or the dividend yield on a stock. Yield is a percentage
calculated by dividing the annual income from the investment
by the value or cost of the investment. For example, a ${'$'}100
stock that pays ${'$'}6.00 per share in annual dividends would be
said to have a "dividend yield" of 6% (${'$'}6 dividend / ${'$'}100 stock
price).</p>
        <br/>

        <p><strong>YIELD TO MATURITY</strong>--On a bond investment, the percentage
rate of return on the investment, if the bond is held until it
is paid off at its maturity date. While the "current yield" is
merely the annual interest payment divided by the price of the
bond, the Yield to Maturity involves a number of complex present
value calculations, which take into account the fact that the
price of the bond at present is either higher or lower than
the face amount that will be paid at maturity. Thus, a 7%
bond trading at face value (100) has a current yield of 7%,
and also a Yield to Maturity of 7%. But if it matures in one
year, and trades at 97, you will earn another 3%, approximately,
when it pays off at 100, so the current yield on such a bond
would be 7.22% (7 divided by 97) and the effective "Yield to
Maturity" would be 10.23%, assuming semiannual interest
payments.</p>
        <br/>

        <p>Bonds usually pay interest twice a year, although some pay
on a quarterly or monthly basis. In Wall ${'$'}treet Raider, bonds
pay interest quarterly (four times a year), so an 8% bond pays
2% each calendar quarter, for example, in Wall ${'$'}treet Raider.
The "yield to maturity" (YTM) figure shown for bond issues in
Wall ${'$'}treet Raider is computed using standard present value
equations, but based on quarterly payments, rather than
semiannual.</p>
        <br/>

    </div>`;
}
