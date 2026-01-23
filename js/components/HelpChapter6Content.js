import { html } from '../lib/preact.standalone.module.js';

export default function HelpChapter6Content({ helpLink }) {
    return html`<div>
        <h2 align="center"><strong>CHAPTER VI.</strong></h2>

        <div id="chap06_VI(A)">
            <h3><strong>A. IN GENERAL.</strong></h3>
            <br/>

            <p>Except for borrowing money or making loan repayments, all other
transactions in Wall $treet Raider, such as buying or selling stock,
bonds, or other assets, are done by clicking on one of the six
buttons on the "Transactions" grouping of buttons on the main menu
screen. Each such transaction selected from the "Transactions"
grouping that is completed counts as one of the 5 transactions allowed
on a player's turn. Other actions, such as borrowing money or repaying
loans, or doing stock splits or corporate name changes, can be done by
clicking on the "MISC" button on the main screen and selecting an item
such as "Borrow Money" or "Repay Loan" from the pop-up Menu that
will appear, but none of those actions count against you as one of
your 5 allowed transactions per turn.</p>
            <br/>

            <p>To initiate a transaction, click one of the six "Transactions"
buttons:  Buy Stock, Sell Stock, Buy/Sell, Financing, Management, or
Other Trans., on the main menu screen, and, except when clicking on
the Buy Stock or Sell Stock buttons, one of four different Menus
will pop up, each listing anywhere from h possible transactions,
with a button for each. Then click on the appropriate button to begin
the type of transaction you wish to do.</p>
            <br/>

            <p>Note that, while viewing each Transactions pop-up Menu, the Menu
screen will have a text-box on the left, describing the allowable functions,
and sometimes will include suggestions or other useful information, such as
the current buying power (cash plus line of credit) of the currently selected
${helpLink('chap03_III(A)', 'ActiveEntity')} (if you control it).  The various
buttons for the different types of transactions will appear in a vertical row
on the right side of the pop-up Menu.</p>
            <br/>

            <p>At the bottom of that dialog screen will be 3 additional buttons: A "Close"
button to close the Menu and exit back to the main W$R screen; a "Player"
button (click it to instantly change the Active Entity to you, the player,
if you, personally, are the entity that will do the transaction); and a "My
Corps." button, which will let you select from a list a corporate entity you
control as the new ${helpLink('chap03_III(A)', 'Active Entity')}, which will do
the transaction(s) you are planning to execute.</p>
            <br/>

            <p>Any time you begin to do any kind of "buy" transaction, whether it is
buying stocks, bonds, or corporate assets, and need to borrow, the program
will display a small YES/NO/CANCEL dialog box, it will explain how much you
need to borrow, and how the borrowing and completion of the transaction
will affect the buying entity's debt-to-equity ratio and credit rating,
unless the effect is very minimal. It will ask you if you wish to go
ahead with the transaction, or cancel it. Click on "YES" to borrow the
money and proceed with the transaction, or click on the "NO" or "CANCEL"
buttons to cancel it.</p>
            <br/>

            <p>Similarly, when you begin to do any kind of "sell" transaction, such
as selling stock, bonds or corporate assets, if the selling entity
will have a large enough gain to result in taxable income and additional
tax during the current quarter, except for very minor amounts, the
program will disclose to you the potential tax liability if you proceed
with the sale, and give you a chance to cancel. (If you or your company
has large tax losses that would shelter the gain from tax, you will not
receive such a warning. In that case, completing the sale will merely
reduce your tax losses, rather than result in any immediate tax.)</p>
            <br/>

            <p>This Chapter VI describes the various "BUY / SELL" transactions that
you can do if you select the "BUY / SELL" button, or the "BUY STOCK" or
"SELL STOCK" buttons that have been added to the main screen in recent
versions of the program (and which are identical in function to the buttons
of the same names that also appear on the BUY / SELL Menu and which are
discussed in the following paragraphs).</p>
        </div>
        <br/>

        <div id="chap06_VI(B)">
            <h3><strong>B. "BUY/SELL" BUTTON AND MENU.</strong></h3>
            <br/>

            <p>This group of command buttons allows you, or a company you control,
to engage in various types of asset acquisitions and sales, including
buying or selling stocks, bonds, options, bank loans (for a bank), or
business assets, as well as doing stock-for-stock mergers, leveraged
buy-outs (LBO's) or "greenmail" buy-backs.</p>
            <br/>

            <p><strong>MANAGING AN ETF:</strong> In Version 8.70 and higher, you are also
allowed to do certain transactions on this menu for an Exchange-Traded
Fund (ETF), if you control the insurance company or securities broker
that is the investment manager for the ETF, if -- AND ONLY IF -- the
ETF is the current "Active Entity" or was the last Active Entity that
was selected before the current Active Entity. In such case, you may
then use any of the four options trading buttons on this menu to buy
or sell put or call options on behalf of the ETF and, if the Buy Stock
or Sell Stock buttons are visible on the menu, you can have the ETF
buy or sell stocks. (If either or both of those buttons are not visible
on the menu, you can use the Buy Stock or Sell Stock buttons on the
main W$R screen, to trade stocks for the ETF that one of your
companies manages.)</p>
            <br/>

            <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0;">
                <div id="chap06_VI(B)(1)">
                    <h4>(1) <u>BUY STOCK (or COVER SHORT POSITION).</u></h4>
                    <br/>

                    <p>This button will
be labeled "Buy Stock" if the selected ${helpLink('chap03_III(A)', 'Transacting Entity')}
that is to do the transaction is a corporation. If you, the player, are
the ${helpLink('chap03_III(A)', 'Active Entity')} or Transacting Entity
doing the transaction, the button will be labeled "Buy Stock" if you
have no short sale positions in any stock; or, it will be a "Cover
Short Position" button if you have any short sale positions in any
stock.</p>
                    <br/>

                    <p>First, let's consider the "Buy Stock" button on this Menu (which
works the same as the "Buy Stock" button that also appears on the main
Wall $treet Raider screen).  Click on the "Buy Stock" command button to
acquire shares of stock from "the Public" on the open market, to buy stock
held by a company you control, or to have a company you control buy stock
from you or from another controlled company, or to buy stock from a company
that you do not control. All purchases are made, not as a specific number
of shares, but as a percentage of the total stock of the target company,
from 1% to 100%.</p>
                    <br/>

                    <p>You can accumulate up to a maximum of 5% of a company's stock by
buying its stock from the public on the open market, and the more you
buy, the more you will drive up the price of the target company's stock
-- temporarily, at least.  Buying stock directly from an entity you
control is a private transaction, and does not affect the stock price
or cost you any brokerage commissions. If you wish to accumulate over
5% of the stock of any company on the public market, however, you
are required by the government to make a "tender offer" for all the
shares you are buying, at a price that is usually well above the
market price. (This is similar to U.S. SEC rules that generally
apply if you acquire over FIVE percent of the equity interests
(such as stock) of a publicly-traded company, but the real-world
SEC doesn't require you to offer a premium over the market price,
although that is typically done to encourage stockholders to sell
their shares to you.)</p>
                    <br/>

                    <p>The tender offer is done automatically when the stock you are
buying will increase your ownership of the target company (through
all companies that you control) to more than 5%.</p>
                    <br/>

                    <p>When you select the "Buy Stock" command, you will be asked to
identify the stock you wish to buy in the transaction, by entering
the company's stock symbol, or by clicking on the "Look Up" button
for a list of all existing companies, and selecting the one you
wish to buy by clicking on its name on the drop-list.</p>
                    <br/>

                    <p>If any entity under your control already owns some of the stock,
you will be asked if you want to buy the stock from your controlled
entity (you, or a company you control), at market price (with no
brokerage commission).</p>
                    <br/>

                    <blockquote style="border-left: 4px solid #999; padding-left: 16px; margin: 16px 0;">
                        <hr/>
                        <p><u>NOTE:</u> This type of off-market purchase of stock, from an
entity you control, if it would result in a tax loss to the
seller, will cause the loss to be disallowed to the selling
entity, but the seller's higher-than-purchase-price cost or
"tax basis" will carry over to the related buyer, giving the
buyer a tax basis higher than the amount actually paid. So, if
the buyer then dumps the stock on the open market, <em>it</em>
will recognize the loss. This rule prevents you from recognizing
a loss on a stock, when you have, in effect, "sold it to yourself"
(to a related entity) -- thus plugging a potential tax loophole...
but opening others for the clever and creative player....</p>
                        <br/>

                        <p>(For example: Buy stock of Company X from one of your controlled
companies, Company Y, on which Y would have a very large tax loss
if it sold the X stock. Since the loss is disallowed for the
selling company (Company Y), the "built-in loss" (high tax basis)
on the Company X stock is transferred to you. You can then
sell the stock and take a large capital loss, which you might
need to offset your capital gains.)</p>
                        <hr/>
                    </blockquote>
                    <br/>

                    <p>You will also be able to buy stock that is held by companies you do not
control, unless such a stockholder company is controlled by another (human)
player or is directly owned by another player (human or computer). If such
a purchase from a company you don't control is permissible, you will have
to make a formal offer to the potential selling company's management and
stockholders, typically at 10% to 40% above the current stock price of the
stock it holds, if you realistically expect the holder to sell any of its
stock to you. You will incur legal fees, whether your offer is accepted or
rejected. Note that if the seller is willing to accept a price that is a
24% premium over the market price, and you bid less, your offer will be
rejected and if you come back with a slightly higher offer, the seller
will by then have jacked up what it will accept to, perhaps, a 30%
or even a 35% premium. So trying to buy a stock from another company is
something of a cat-and-mouse game. (Be aware that, all things being equal, a
large shareholder of the target company will want a higher price per share
than a small holder that owns only a few percent of the target company's
stock. Also, an ETF is likely to accept an offer at a lower premium over
the market price than other potential sellers.)</p>
                    <br/>

                    <p>Next, you will be asked what percent of the company's stock
you want to buy from the Public or the seller.</p>
                    <br/>

                    <p>If the buyer (you or your company) has enough cash,
the transaction will then be completed.  Or, if you need
to borrow against a bank line of credit to complete the
transaction, you will first be asked if you want to borrow
to do the transaction. If you click on the "Yes" button,
the necessary amount will be borrowed, and added to your
bank loan  balance, and the transaction will be executed.
Once the purchase is completed successfully, a confirmation
message will be displayed on screen, telling you that the
transaction was completed.</p>
                    <br/>

                    <p>If you are short of cash and credit needed to buy as much
stock as you want to, try selling off some bonds or other
stocks to raise the needed funds, or else try buying a smaller
amount of stock. If the entity doing the transaction is a
corporation, you may even be able to have it raise money
by selling bonds, using the "${helpLink('chap07_VII(B)(5)', 'Issue Bonds')}" command button on the "Financing Transactions"
Menu.</p>
                    <br/>

                    <p>Other ways for a corporation to raise cash would be to:</p>
                    <ul style="margin-left: 24px;">
                        <li>Sell off some of its capital assets, unless it is a
bank, insurance company, or holding/trading company
("Sell Corporate Assets" button on this "Buy/Sell" Menu);</li>
                        <br/>

                        <li>Issue new stock, either in a public offering or a
private offering, or issue bonds ("Financing Transactions"
Menu); or</li>
                        <br/>

                        <li>Have you, the player, advance (loan) money directly
to the corporation ("Advance to Corp" button on the
"Misc" Menu).</li>
                    </ul>
                    <br/>

                    <p>As noted above, if the ${helpLink('chap03_III(A)', 'Transacting Entity')}
is you, the player, this first button on the Buy/Sell Menu will
be labeled "Cover Short Position," rather than "Buy Stock,"
if you have any outstanding short sale position in any stock.
This button works much like the "Buy Stock" feature, except
that you can only buy (cover) stocks in which you have a
short sale position. Each 1% you buy will drive up the
cost of the stock 1/2 of 1%, so if you buy back all of a
20% short position at once, you will drive up the price
by 10% for the last 1% purchased, and your average cost
will be 5% higher (plus commissions) than the market price
was before your transaction was entered.</p>
                    <br/>

                    <p>When you click on the "Cover Short Position" button,
the program will display a list of each company in which
you have a short position, and details, such as tax basis,
percent shorted, and value (all shown as negative amounts).
Simply click on a position to select it, and then enter
the percent you want to buy back on the open market. You
can buy back shorted stocks even if you have no cash or
line of credit, since the funds for the buyback will first
come out of the short margin account.</p>
                    <br/>

                    <p>When you cover a short position, you will recognize
a capital gain or loss for income tax purposes. For example,
if you sold stock short for $300M (your tax basis will be
shown as -300M) and you pay $100M to cover the short position,
you will recognize a gain of $200M, which is a capital gain.
In Wall $treet Raider, all capital gains are given preferential
tax treatment, for individual players -- a lower tax rate than
on "ordinary" income. In the real world, at least under U.S. tax
laws, such a gain on covering a short position is considered a
short-term capital gain, which is not taxed at a lower rate,
unlike long-term capital gains. But we give you a tax break, in
Wall $treet Raider....)</p>
                </div>
                <br/>

                <div id="chap06_VI(B)(2)">
                    <h4>(2) <u>SELL STOCK (or SELL STOCK SHORT).</u></h4>
                    <br/>

                    <p>This button
will be labeled "Sell Stock" if the selected
${helpLink('chap03_III(A)', 'Transacting Entity')} that is to
do the transaction is a corporation, or will be a "Sell
Stock Short" button, if you, the player, are the
${helpLink('chap03_III(A)', 'Active Entity')}
doing the transaction.</p>
                    <br/>

                    <p>First, let's consider the "Sell Stock" button on this Menu
(which works the same as the "Sell Stock" button that also appears
on the main Wall $treet Raider screen.  Click on the "Sell Stock"
button to sell shares of stock owned by you or by a company
you control. As soon as you click on it, a screen will pop up
with a list of your stock portfolio, showing the value and
tax basis for each holding, and you simply need to click or
double-click on the name of the stock you wish to sell, to select
it, after which you will be asked what percent you want to sell.</p>
                    <br/>

                    <p>Simply press the [ENTER] key or click on the "OK" button
if you wish to accept the default percentage -- which is
to sell all of your stock in that corporation.  Or, to sell
less than your entire holding, enter a smaller percentage
amount to sell.  For example, if you own 20% of XYZ and
only want to sell half of your holdings, you would enter
"10" percent (not "50" percent).</p>
                    <br/>

                    <p>Stock is not always immediately saleable, if you are
playing at Difficulty Level 2 or 3, and if you own 100%
of a company, such as a new startup company that has not
yet "gone public" with its stock.  To be able to sell
your stock in such a 100%-owned subsidiary, you will need
to first select that company as the ${helpLink('chap03_III(A)', 'Active Entity')} and
have it do a public offering of stock (which will not be
possible for a brand new startup company with no history
of earnings), or else do a private offering of its stock
to venture capitalists, if possible.</p>
                    <br/>

                    <p>Once some of its stock has been sold to "the public" or
to other private investors, then you, as a stockholder, will
be able to sell your stock in the company on either the public
market or to unrelated private investors. Otherwise, if you
try to sell your stock in a new entity when you own 100% of it,
you may be able to do so, but only to a "vulture capitalist"
who will offer to buy it from you at a deeply discounted
price.</p>
                    <br/>

                    <p>Any sale of stock you make will tend to depress the
price of that stock (temporarily), and the more stock
you are selling, the lower the price will go, and the
less per share you will net on the sale.  Thus, if you
own a large percentage of a company, and are not in a
great hurry to sell it all at once, it will often be
better to sell a few percent, let the ticker run for
as while, and when the stock's price has recovered a
bit after your selling, sell some more, repeating that
pattern several times until you have sold as much as you
want to sell.</p>
                    <br/>

                    <blockquote style="border-left: 4px solid #999; padding-left: 16px; margin: 16px 0;">
                        <hr/>
                        <p>Better yet, if the stock is publicly traded and is trading at, for
example, $50 a share, you might sell call options on it, exercisable
at $40 a share in the near future, like the next month. This way, if
you have the "Exercise Options?" setting set as "Yes," the stock will
be called away from you when the term of the option expires, unless
the stock price has fallen below $40, and you will have gotten very
nearly $50 a share, after commissions on the options and exercise.
You could also buy in-the-money put options, to sell the stock at $60,
which might not cost you much more than $10 a share plus commissions.
You could even use the "Exercise Put Option" feature on the Other
Transactions Menu after buying such puts, to immediately exercise the
puts and thus sell some of the stock that way.</p>
                        <hr/>
                    </blockquote>
                    <br/>

                    <p>When the second button on the Buy/Sell Menu reads
"Sell Stock Short," you can only sell stocks you do NOT
currently own. This is done by borrowing the stock from
"the Public" and then selling it. The proceeds of the
short sale are not immediately usable by you, but must
be deposited in a "short margin account." You must keep
an amount of cash in that restricted account equal to
the total value of all the stocks you are short.</p>
                    <br/>

                    <p>The goal of selling stocks "short" is to profit from
a decline in a stock's price, rather than a rise in the
stock.</p>
                    <br/>

                    <p>There a number of restrictions on when you can sell
a stock short and how much. For example, you cannot
sell a stock short "against the box" when you already
own the stock and you cannot sell a stock short when
you control that company (through another company
that owns its stock). You also may not sell more of
a company's stock short than 20% or more than half
of the percent that is publicly traded, whichever
is less. Also, no more than 50% of a company's total
publicly traded shares can be borrowed and sold short
by ALL players, in the aggregate.</p>
                    <br/>

                    <p>For more on short sales and margin requirements, and
limits on when and how much of a stock you may sell short,
see the ${helpLink('chap03_III(P)', 'FAQ on Short Sales')}
in Chapter 3.</p>
                </div>
                <br/>

                <div id="chap06_VI(B)(3)">
                    <h4>(3) <u>BUY CORPORATE BONDS.</u></h4>
                    <br/>

                    <p>Click on this button to
buy corporate bonds (often called "junk bonds," since in
many cases they are of poor credit quality, and will never
be paid off).</p>
                    <br/>

                    <blockquote style="border-left: 4px solid #999; padding-left: 16px; margin: 16px 0;">
                        <hr/>
                        <p><strong><u>NOTE:</u></strong>  In this simulation, all bond trades or
transactions are done in units or multiples of 1 million
face value, of the applicable currency (dollars, pounds,
Euros, etc.), or units or multiples of 1 billion, for certain
currencies (Yen, Korean Won, Indian Rupees, or Icelandic
Kronur). Thus, if you buy 100 million face value of the bonds
of XYZ Corporation, at a price of 95, you would pay about 95
million on the purchase (plus commissions, and at somewhat
above market price, due to a slight upward effect on the
price of the bonds caused by your purchase).</p>
                        <hr/>
                    </blockquote>
                    <br/>

                    <p>In Wall $treet Raider, only individual players and
companies in the banking and insurance industries may buy
or sell corporate bonds, so this command button will not
be visible and cannot be used if the currently selected
${helpLink('chap03_III(A)', 'Transacting Entity')} (controlled
by you) is any type of corporation other than a bank or an
insurance company. (However, two of the ETF bond funds do
buy and sell corporate bonds, but all such trading is
automatic, even if the ETF's investment manager is an
insurance company or stock brokerage company that you
control.)</p>
                    <br/>

                    <p>When you click on the "Buy Corporate Bonds" button, the
program will ask you which corporate bonds you want to buy,
and you will be asked to enter the stock symbol of the company
whose bonds you wish to acquire (or use the "Look Up" button
to select the company from a list of all companies that have bonds
issued at the moment in the current game of Wall $treet Raider).
Once you select the company whose bonds you want to acquire, you
will be told what amount (face value), if any, of the company's
bonds are publicly traded, and how many million you can afford
to purchase, with the buying entity's available cash and line of
credit.</p>
                    <br/>

                    <p>Enter the amount you want to buy and press the [ENTER] key or
click on OK to proceed with the purchase.  If you need to borrow
money from the bank to complete the purchase, you will first be
asked if you want to borrow, and the transaction will be completed
only if you click on "Yes."</p>
                    <br/>

                    <p>Once your purchase of corporate bonds is successfully
completed, a small confirmation notice will pop up on the screen.</p>
                    <br/>

                    <p>Note that, when either buying or selling corporate bonds,
if the amount of such bonds that are publicly traded is
relatively small, you may be given the following warning:
"Caution:  This bond issue is very thinly traded."  This
means that if you buy a significant percentage of the
amount available, or sell a significant percentage of
such bonds you own, you will have a major effect on the
price of the bonds, meaning that you will run up the
price quite a bit if buying, or down if selling, either
of which will cost you money, so you may want to buy or
sell only a small amount at any one time if the bonds are
thinly traded.  Otherwise, you will not see such a warning
if, for instance, you are buying only 100 million of Citibank
bonds, when there are 50,000 million publicly traded -- in
that case, your purchase or sale of 100 million of those
bonds would hardly have any effect on their market price.</p>
                    <br/>

                    <p>To do research on possible corporate bond investments, use
the ${helpLink('chap10_X(E)(12)', 'Database Search')} research
tool, by clicking the "DataBase Search" button on the General
Research Menu.</p>
                </div>
                <br/>

                <div id="chap06_VI(B)(4)">
                    <h4>(4) <u>SELL CORPORATE BONDS.</u></h4>
                    <br/>

                    <p>Click on this button to
sell corporate bonds (often called "junk bonds," since in
many cases they are of poor credit quality, and will never
be paid off).</p>
                    <br/>

                    <blockquote style="border-left: 4px solid #999; padding-left: 16px; margin: 16px 0;">
                        <hr/>
                        <p><strong><u>NOTE:</u></strong>  In this simulation, all bond trades or
transactions are done in units or multiples of 1 million face
value, of the applicable currency (dollars, pounds, Euros,
etc.), or units or multiples of 1 billion, for certain
currencies (Yen, Korean Won, Indian Rupees, or Icelandic
Kronur). Thus, if you sell 100 million face value of the bonds
of XYZ Corporation, at a price of 95, you would receive about
95 million from the sale (less commissions, and at somewhat
below market price, due to a slight depressing effect on the
price of the bonds caused by the sale).</p>
                        <hr/>
                    </blockquote>
                    <br/>

                    <p>In Wall $treet Raider, only individual players and
companies in the banking and insurance industries may buy
or sell corporate bonds, so this command button will not
be visible and cannot be used if the currently selected
${helpLink('chap03_III(A)', 'Transacting Entity')} (controlled
by you) is any type of corporation other than a bank or an
insurance company. (Bond fund ETFs in Wall $treet Raider
buy and sell bonds, but that all occurs automatically and
is not subject to control by players.)</p>
                    <br/>

                    <p>When you click on the "Sell Corporate Bonds" button,
you (the selling entity) you will be shown a list of all
the corporate bonds you own, showing for each holding the
amount (face value) of the bonds owned, and the current
market value and adjusted tax basis of each. Just click or
double-click on the bonds you wish to sell and you will be
asked to enter the amount (face value) you wish to sell.</p>
                    <br/>

                    <p>Once a sale of corporate bonds is successfully completed,
a small confirmation notice will pop up on the screen.</p>
                    <br/>

                    <p>Note that, when either buying or selling corporate bonds,
if the amount of such bonds that are publicly traded is
relatively small, you may be given the following warning:
"Caution:  This bond issue is very thinly traded."  This
means that if you buy a significant percentage of the
amount available, or sell a significant percentage of
such bonds you own, you will have a major effect on the
price of the bonds, meaning that you will run up the
price quite a bit if buying, or down if selling, either
of which will cost you money, so you may want to buy or
sell only a small amount at any one time if the bonds are
thinly traded.  Otherwise, you will not see such a warning
if, for instance, you own only 100 million of Citibank bonds,
when there are 50,000 million publicly traded -- in that
case, your sale of 100 million of those bonds would hardly
have any effect on their market price.</p>
                </div>
                <br/>

                <div id="chap06_VI(B)(5)">
                    <h4>(5) <u>TRADE GOVERNMENT BONDS.</u></h4>
                    <br/>

                    <p>As in the case of corporate
bonds, only players, banks and insurance companies can invest in
government or "Treasury" bonds in Wall $treet Raider. Thus, this
button will appear on the BUY / SELL Menu when the currently selected
${helpLink('chap03_III(A)', 'Transacting Entity')} is you (the player)
or a bank or insurance company that you control.</p>
                    <br/>

                    <p>Managers of industrial corporations are generally not paid fabulous
salaries to use their company's money to dabble in bond market
investments, and since Wall $treet Raider seeks to emulate real-world
conditions as closely as possible, bond investments are not permitted
in this simulation by companies other than financial institutions
(banks and insurance companies). However, this simulation does have
a bond fund ETF that buys and sells government bonds, but all such
trades occur automatically and are not subject to control by players.</p>
                    <br/>

                    <p>Assuming the entity you have selected for the moment to buy or
sell government bonds is either you, the player, or a bank or
insurer you control, clicking on the "Trade Government Bonds" command
button will bring up a small dialog screen (submenu), listing 4 possible
choices for trading government bonds:</p>
                    <br/>

                    <p align="center"><img src="treasury.jpg" alt="treasury.jpg (16154 bytes)" width="383" height="230" /></p>
                    <br/>

                    <ul style="margin-left: 24px;">
                        <li>Buy the "Long" government bond (the one that matures in
10 to 20 years);</li>
                        <br/>

                        <li>Sell the "Long" government bond;</li>
                        <br/>

                        <li>Buy the "Short" government bond (the one that matures in
10 years or less); or</li>
                        <br/>

                        <li>Sell the "Short" government bond.</li>
                    </ul>
                    <br/>

                    <p>Use the mouse pointer to click on the type of transaction
you wish to do, of the ones listed on the submenu, and then
click on the "GO" button.</p>
                    <br/>

                    <p>If you clicked on either of the "Buy" items, to buy
government treasury bonds, after you hit "GO," you will then be
shown the price of the Long or Short bonds you are about to buy,
and told how many (maximum) you can buy, in millions or billions
(depending on the currency you selected, dollars, yen, etc.) of
face value.  The amount shown is the amount you may buy "without
difficulty." This means you can buy that amount without having
any effect on the huge and liquid government bond market. While
you may decide to buy a larger amount, you will tend to drive up
the price of government bonds, if you are buying over 0.5% of the
total "float" of such bond issue, and will be told how much of a
higher price you must pay, if you wish to do the larger transaction.</p>
                    <br/>

                    <p>(You may have wondered, when you viewed the "Economic Statistics"
by clicking on that item on the General Research menu, why the total
National Debt is shown, as well as, in a footnote, a disclosure showing how
much of the debt is held by players and companies. Now you know why,
after reading the preceding paragraph.) (In the rare case where total
bond holdings exceed the National Debt, this footnote will not appear,
though that is unlikely in a 35-year game.)</p>
                    <br/>

                    <p>Enter a smaller amount if you do not wish to buy the default
(maximum that can be bought "without difficulty") amount of the
bonds. If you need to borrow money from the bank to make the
purchase, you will be asked if you wish to borrow, before the
transaction is executed. Click on "Yes" to proceed with the
purchase, or "No" to cancel, if you do not wish to buy "on
margin" (<em>i.e.,</em> with borrowed money).</p>
                    <br/>

                    <p>If you clicked on either of the "Sell" items, to sell
government bonds the ${helpLink('chap03_III(A)', 'Transacting Entity')}
owns, you will be shown the current market price of the bonds and
the amount (face value) that you or your bank or insurance company
owns, and can sell "without difficulty."  Enter the amount you wish
to sell, or simply hit [ENTER] or press the "OK" button to sell the
"safe" default amount, at the current market price, less commissions.</p>
                    <br/>

                    <p>If your buy or sell transaction in government bonds is completed
successfully, a small confirmation message will pop up on the
screen, showing the net proceeds of the sale, or the total cost
of the purchase.  Government bonds are very "liquid," so your sales
or purchases will have no noticeable effect on the market price in
Wall $treet Raider unless you are doing a huge transaction, such as
buying or selling $50 billion or $100 billion face value of such
bonds; thus your only cost of trading in and out of such bonds will
usually be a small brokerage commission or spread.</p>
                </div>
                <br/>

                <div id="chap06_VI(B)(6)">
                    <h4>(6) <u>MERGER.</u></h4>
                    <br/>

                    <p>To do a "Merger" in this Wall $treet Raider
simulation, click on the "Merger" command button and follow the
on-screen instructions. You will be asked to enter the stock
symbol of the "target" company you wish your company to merge
with (or can use the "Look Up" button that will appear, to
scan through the list of all the companies currently in
existence, until you find your "target").  Note that, when a
company seeks to merge with a target company, the exchange
ratio of stock-for-stock in the merger is based on the value
of the acquiring company versus the value (plus a premium)
of all the stock of the target company. You are able to set
the premium percentage over market price that you will offer
to the shareholders of the target company.</p>
                    <br/>

                    <p>Thus, in effect, if you offer a 25% premium, the acquiring
company is offering to "pay" a price that is 25% over market
price to acquire the stock of the target company (but is "paying"
for it with its own stock, by issuing new shares of stock,
rather than paying cash).  Needless to say, the higher the
premium you offer, the more likely it is that the shareholders
of the target company will vote to approve the merger of their
company into yours.</p>
                    <br/>

                    <p>In most cases, you can offer anywhere from 5% (good luck!)
to 100% over market price. However, where you already control
the target company as well as the acquiring company, there is
a potential conflict of interest, so your underwriters will do
a "fairness" (valuation) study, and give you a narrow price
range, such as a 10% to 15% premium over market value, within
which you must choose the amount you wish for the acquiring
company to offer as an acquisition premium.</p>
                    <br/>

                    <p>As a rule, your ("acquiring") company will end up owning all
the stock of the other company after the merger, if the merger
is approved.  However, if the "target" company already owns
stock of your ("acquiring") company, you will be asked if you
want the "target" company to end up as the company "on top" that
will own all the stock of your company after the merger. There
is usually very little practical difference as to which company
is the "parent" and which is the "subsidiary" after the merger,
as your ownership in the combined companies will be the same in
either case. However, you will generally want the company with
the lower credit rating or with tax loss carryovers to end up
as the parent company, since holding all of the stock of the
other will usually improve its weak credit rating, or its tax
loss carryovers will be able to shelter the future income of
its subsidiary.</p>
                    <br/>

                    <p>Mergers are rather complex transactions, even in this
simulation, but fortunately, all of this complexity is handled
for you by the program. You need only decide if you want to
do a merger, decide how much of a premium over market price
you wish to offer the target company shareholders, and then
run the gauntlet of getting shareholder approval and avoiding
intervention by various government agencies.</p>
                    <br/>

                    <p>Most stockholders of a target company, except those you
control, will generally vote against a merger, except the
"Public" shareholders, who are assumed to be none-too-bright,
and who usually will vote heavily in favor of your proposed
merger, if you are offering them a decent premium (such as
20% or 25% over market price) for their stock. Corporations
(not controlled by any player) that hold stock of the target
company will vote against the merger if the premium you are
offering is 25% or less, but some or all such companies may
vote for the merger if you offer more than a 25% premium
over market price. Other players or corporations they control that
own stock in the target company will vote against your merger offer.</p>
                    <br/>

                    <p>There are also a flock of government agencies that will
consider your merger, and one of them will occasionally
find a good legal reason to block it.  It is the job of
these gremlins to be arbitrary and unreasonable. Mergers
between two banks are very frequently blocked by the
government, and are only rarely permitted.</p>
                    <br/>

                    <p>Even the public shareholders will generally vote against
a merger, if it is an attempt at a hostile takeover, where
a "minnow" is trying to merge with and swallow a "whale,"
or if your acquiring company has a "D" credit rating, and is
trying to merge with a healthy company before your company
goes down the tubes (bankrupt). In those cases, your attempted
merger will generally be voted down by the stockholders of the
target company, unless, of course, you have bought up 51% of
the stock of the target company in advance, in which case there
will be no problem getting shareholder approval.  But note that
if the company you are trying to <em>acquire</em> has a "D"
credit rating, your own company's minority stockholders may
seek to block the merger, to prevent you from merging their
healthy company with one that is financially crippled.</p>
                    <br/>

                    <p>One further factor in your success in winning shareholder
approval is the country of incorporation of the target
company. Public stockholders of U.S. or U.K. companies are
most likely to vote for a merger, at a given price offer.
Shareholders of a Japanese or Korean company, or of most
companies based in Third World countries, are least likely
to agree to the acquisition of their company (but are less
likely to oppose the merger if the acquiring company is
also based in their country).</p>
                    <br/>

                    <p>The "Merger" feature is very useful, since it allows
you to use one company to take over another by issuing new
stock, rather than cash.  As such, the parent company
after the merger (which, as noted above, may be either
the company doing the acquisition or the acquired company)
will be financially stronger, since it will have obtained
100% of the stock of the other company, without spending
any money.</p>
                    <br/>

                    <p>There must be a catch, right?  Of course. The shareholders
of both companies will have their percentage of ownership
reduced. The stockholders of the subsidiary will have turned
in all of their stock in it in return for a smaller percentage
of the stock of the parent company, and the parent company
stockholders will have surrendered part of their stock, which
means that both groups of stockholders will have a smaller
piece of a larger pie (but still worth about the same or
more than the stock they traded in). But if one stockholder
happens to own, for example, 20% of the stock of BOTH companies
before the merger, he or she will end up owning 20% of the
parent company (only) after the merger, but it will be worth
about as much as his or her stock in the two companies
(in total) was worth before the merger took place.</p>
                    <br/>

                    <p>There are several situations in which mergers can be very
useful:</p>
                    <br/>

                    <ul style="margin-left: 24px;">
                        <li><strong><u><em>Stock as a substitute for cash.</em></u></strong> You wish
for a company you control, which has a high stock price in relation
to earnings or its net worth, but has little cash, to take over
some other juicy little company that you would like very much to
tuck into the corporate fold, but, sad to say, your company is
growing so fast that it has run out of cash and credit to make
such a purchase. A stock-for-stock merger may be the perfect
solution, although it will dilute your percentage of ownership
somewhat.</li>
                        <br/>

                        <li><strong><u><em>A way of diversifying when a stock seems overvalued.</em></u></strong>
When your company's stock price reaches a price that you think
is excessively high, and is likely to start descending like
a <em>kamikaze</em> because its earnings are falling apart, you
may want to sell out, but perhaps you own so much of the stock
that you would kill the stock price if you tried to dump it.
That is a perfect time to use the over-priced stock to have
your company go out and do some mergers with companies whose
stocks seem undervalued. Or, you may decide to merge your
small company in which you own, say 51%, with a giant bank
or oil company, so that you wind up with only 3 or 4% of the
parent company after the merger.  Selling off that 3 or 4
percent would only slightly affect the stock price, so you
could sell out after the merger without taking a "haircut"
on the sale.  However, note that shareholders of a very
large target company are less likely to vote for a merger
if the company proposing to take over the "whale" is but a
"minnow."</li>
                    </ul>
                    <br/>

                    <blockquote style="border-left: 4px solid #999; padding-left: 16px; margin: 16px 0;">
                        <hr/>
                        <p><strong><u>NOTE:</u></strong> IN WALL $TREET RAIDER, ANY COMPANY CAN DO A
STOCK-FOR-STOCK MERGER WITH ANY OTHER COMPANY. OR CAN AT
LEAST ATTEMPT A MERGER (BUT MERGERS ARE OFTEN BLOCKED FOR
VARIOUS REASONS).</p>
                        <hr/>
                    </blockquote>
                    <br/>

                    <ul style="margin-left: 24px;">
                        <li><strong><u><em>Improve credit rating and borrowing power.</em></u></strong>
If you own controlling interests in two companies (say 25%
of each), consider merging them.  You will still own 25% of
the parent corporation after the merger, and it will own
100% of the other. You will have just as much control as
before, and the parent will be much stronger financially,
and probably able to borrow more, since it will now own
all the stock of the subsidiary.  You may even want to
liquidate the subsidiary into the parent, if you can--but
see the description of liquidations under the summary of
the "${helpLink('chap07_VII(B)(8)', 'Tax-Free Liquidation')}"
command button, in Chapter VII, on
"${helpLink('chap07', 'FINANCING TRANSACTIONS')}".</li>
                    </ul>
                    <br/>

                    <p>The time when you should be least willing to do a merger
transaction is when you own a company whose stock is very
depressed--for example, selling at only 60 or 70% of its
net worth per share.  While a merger may be the only way
to keep the company afloat in some cases, its low stock
price means that you will greatly "dilute" your ownership
if you merge it with some other corporation you don't
control.  In fact, you will probably wind up with so
little stock as a result of your company's low price
that you may even fall below the 20% needed to maintain
control.  Note that when the stock of one of your
companies gets very depressed, it becomes a tempting
target for an opposing player or some other predatory
corporation to take over in a cash buyout or merger
(unless you have 51% control). Losing control of the
company may mean that you also will be unemployed, if
you were drawing a salary and receiving stock options
as the president and CEO of the corporation.</p>
                    <br/>

                    <p>When two companies are merged in Wall $treet Raider, the "target"
company's price, as noted above, is always valued above its market
price in determining the exchange ratio, the "acquiring" company's
stock at market price. Thus, if the offering price is 25% above
market price, and if the market value of the target company's
stock is $24 billion, it would have an exchange value in the
merger of 1.25 times that amount, or $30 billion.  If the
exchange value of one company is $70 billion per share and the
other is $30 billion in a merger, the parent company's stock
will be worth about $100 billion after the transaction. If you
owned 100% of the $24 billion target company before the merger,
you would end up with 30% of the $100 billion parent company
stock afterwards (assuming you didn't own any stock of the
other company before). You may occasionally receive such a
windfall in Wall $treet Raider when, out of the blue, some
company offers to take over a company in which you own stock
in a merger deal, usually at a 25% to 50% premium over market
value.</p>
                    <br/>

                    <p>In the real world, the term "merger" usually means that
two companies have all their assets, liabilities, etc.
combined together in a single corporation, although the
term is also used sometimes in a non-technical sense to
include swapping stock where one company ends up as a
subsidiary corporation, owned by the other corporation,
which is usually referred to as a "type B" merger under
U.S. tax laws. In Wall $treet Raider, "mergers" are all
of the latter variety.</p>
                    <br/>

                    <p>In Wall $treet Raider, however, you may sometimes take a second
step and "liquidate" the subsidiary company into the parent company. (See
the section on the "${helpLink('chap07_VII(B)(8)', 'Tax-Free Liquidation')}"
command button, in Chapter VII on "${helpLink('chap07', 'FINANCING TRANSACTIONS')}".)  In that case you would have done a merger in
the more commonly-used sense of the word, where all assets and
liabilities of two companies are combined into one company, and
one corporation (the acquired subsidiary) goes out of existence.</p>
                    <br/>

                    <p>Doing mergers can be expensive, in terms of underwriting fees,
tax, legal, accounting and other costs.  In Wall $treet Raider, the
company proposing the merger pays those costs.  Before you proceed
with a merger, the program will estimate what the merger costs will
be and inform you, asking you if you wish to proceed with the
transaction.</p>
                    <br/>

                    <p>You will only incur the full amount of those fees if the
merger is successfully completed; otherwise, your company pays
only a percentage of the total fees. The percentage of the
total fee amount will depend on how far along you have gotten
into the process, in cases where the merger is aborted or
called off for any reason, as follows:</p>
                    <br/>

                    <ul style="margin-left: 24px;">
                        <li>No fees are incurred if you are unable to proceed with the
merger due only to the fact that one of the companies (acquirer
or target) already owns 100% of the other.</li>
                        <br/>

                        <li>Only 20% of the full merger costs are incurred if two banks
are denied permission to merge by bank regulators (which is
usually the case);</li>
                        <br/>

                        <li>Only 40% of the full merger costs are incurred if shareholders
of the target company vote down the merger proposal;</li>
                        <br/>

                        <li>Only 60% of the full merger costs are incurred if a
favorable shareholder vote is obtained, but the merger is
then blocked on antitrust grounds;</li>
                        <br/>

                        <li>Only 70% of full merger costs are incurred if other government
agencies intervene at a late stage to block the merger; and</li>
                        <br/>

                        <li>Only 80% of full merger costs are incurred if divestment of a
subsidiary is required as a condition to complete the merger, but
you refuse to agree to that condition.</li>
                    </ul>
                    <br/>

                    <p>Any option positions (long or short) that a player has in a
company that is involved in a merger transaction will automatically
be closed (canceled) if the option is "out-of-the-money." If the
options are "in-the-money," they will be settled at their intrinsic
value (the difference between the exercise price and the market
price of the underlying stock) at the instant before the merger
exchange of stock occurs. Any option positions of corporations
on the target company will immediately be settled at their market
value and options on the stock of the acquiring company will be
adjusted to reflect the terms of the merger.</p>
                    <br/>

                    <p>A feature has been added to the merger routine, as suggested
by a W$R user, where you have a company you control acquire a
company you don't control by means of merger, when both are in
the same industry. If the two companies are of somewhat comparable
size and the acquired company has significantly better management
than the acquirer, you may be asked, immediately after executing
the merger, to decide if you want to have the management of the
acquired company take over management of both companies (meaning
an upgrade in the management efficiency of the parent company).
This will not apply in the case of reverse mergers (when the
target company becomes the parent company) or in the case of
holding/trading companies.</p>
                    <br/>

                    <p>Note that the "Merger" button does not appear on the "BUY / SELL"
transactions menu if the currently selected Transacting Entity is
you, the player, since mergers are only applicable to corporations,
not to individuals.</p>
                </div>
                <br/>

                <div id="chap06_VI(B)(7)">
                    <h4>(7) <u>GREENMAIL.</u></h4>
                    <br/>

                    <p>The "Greenmail" command button
allows you to do stock buy-backs from corporate shareholders
of a company you control, if you don't also control the selling
shareholder corporation. The greenmail transaction is one in which
your company is able to buy back its own stock from an unrelated
company, in order to get rid of a minor or unwanted shareholder.</p>
                    <br/>

                    <p>When you click on the "Greenmail" button, the company (which you must
control) that is currently the ${helpLink('chap03_III(A)', 'Transacting Entity')}
will be presented with the choice of doing the buyback from any of
a list of shareholders, if there are any corporations that own
its stock, which are not controlled by you or any other player.
If there are such shareholders, you will be able, if your
company has adequate funds and a good credit rating, to buy
back some or all of the stock of one of the corporations that
own some of your company's stock, in a "greenmail" transaction.
You cannot force a greenmail buyback, however, if the shareholder
corporation is controlled by you, or by another player, and you
cannot do a greenmail buyback of stock owned directly by another
player.</p>
                    <br/>

                    <p>If, on the other hand, there are no corporate shareholders
(other than corporations controlled by you or other players),
you will be informed that no greenmail buyback is possible,
since there are no privately held shares you can buy back. In
that case, if there are publicly-owned shares of the corporation,
you may instead want to do an LBO (see ${helpLink('chap06_VI(B)(8)', 'below')}).</p>
                    <br/>

                    <p>The "Greenmail" transaction is particularly useful when
you feel that your company's stock is greatly undervalued
and it is selling at a large discount from its net worth per
share. In such a case, the company's best investment may be
to shrink its capitalization by buying back part of its own
stock from a corporate stockholder, even at a premium price
of more than 20% above market price. In the current W$R version,
you must make an offer, specifying how large a premium over
market price you are willing to pay, generally in the 10% to
40% range, if you realistically expect your offer to be accepted.</p>
                    <br/>

                    <p>This also can have the salutary effect of increasing the value
of the stock of the remaining shareholders, since the stock will
sometimes rise in value due to the buy-in, if it was selling at
a very large discount from net worth per share.  In addition,
the remaining owners will have their stock ownership increased.</p>
                    <br/>

                    <blockquote style="border-left: 4px solid #999; padding-left: 16px; margin: 16px 0;">
                        <hr/>
                        <p><strong>EXAMPLE:</strong>  If you own 40% of a company, and it "buys in"
20% of its stock, you will own 40/80 or 50% of the stock
remaining after the buy-in.</p>
                        <hr/>
                    </blockquote>
                    <br/>

                    <blockquote style="border-left: 4px solid #999; padding-left: 16px; margin: 16px 0;">
                        <hr/>
                        <p><strong>IMPORTANT LEGAL RESTRICTION:</strong>  Your corporation will not
be allowed to pay out so much for its stock that it reduces
its net worth to a level that places its survival in serious
jeopardy. Also, if the company is a bank or insurance company,
it will often be prevented by banking or insurance regulators from
doing any such buybacks. These rules give lenders to a corporation
some measure of protection from ruthless corporate raiders (like
you), who might have overly larcenous tendencies.</p>
                        <hr/>
                    </blockquote>
                    <br/>

                    <p>You can use a "greenmail" or "LBO" transaction as one in
a series of steps if you wish to do a true "leveraged buy out"
of a company. The first step would be to buy a controlling
interest in the target company, such as 50%. If its stock
is sufficiently undervalued and it has good enough credit
(or issues junk bonds), it may then be able to buy back the
remaining 50% of its shares, leaving you with 100% ownership.</p>
                    <br/>

                    <p>In some cases, it may even have enough cash and net worth
left to pay out an "extraordinary dividend" to you after the
buy-in, so that you would even get some of your investment
back immediately--but you will probably wind up with stock
in a company that is leveraged to the hilt, and not far away
from Chapter 11 bankruptcy proceedings--one of the frequently
encountered risks of doing a leveraged buyout in Wall $treet
Raider, as in the real world.</p>
                    <br/>

                    <p>The "Greenmail" buyback is one way to get rid of a
minority (non-controlling) shareholder, and at the same
time increase your percentage of ownership of the company.
A greenmail buyback is identical to an LBO, except that
you are buying the stock back from a specific corporation,
rather than from "the public."  For example, if you own
25% of XYZ Corporation, and ABC Company owns 24%, and you
are in danger of getting a "${helpLink('chap03_III(I)', 'margin call')}" that might force you to sell 1% or more of your
XYZ stock, that could cause ABC Company to either take
control of XYZ, or deadlock your ownership (if you and ABC
each owned 24%). Thus, you might want to have XYZ do a greenmail
buyback of 8% or 10% of ABC's holdings of XYZ, reducing its
ownership to less than 20%, and preserving your control. In
this example, if XYZ bought back 8% of its stock from ABC
in a greenmail buyback, your ownership percent would increase
to 27% and ABC's would decrease to 17% after the transaction.</p>
                    <br/>

                    <p>The "Greenmail" button is not displayed if you, the player,
are the currently selected ${helpLink('chap03_III(A)', 'Transacting Entity')},
since stock buybacks are only applicable to corporations.</p>
                </div>
                <br/>

                <div id="chap06_VI(B)(8)">
                    <h4>(8) <u>LBO (LEVERAGED BUYOUT).</u></h4>
                    <br/>

                    <p>The "LBO (Leveraged BuyOut)"
command button, which allows you to do stock "Leveraged Buy-Outs,"
is one of the handier functions available in the Buy/Sell group of
transactions.</p>
                    <br/>

                    <p>When you click on this button (when a company which you
control is the Transacting Entity), you will be asked
what percentage of the company's stock held by "the public"
you wish to have the company buy back.</p>
                    <br/>

                    <p>If there are no publicly held shares outstanding, you will
be informed that no LBO stock buyback is possible. In that
case, you may instead want to attempt to do a "Greenmail"
buyback of the stock of one of the company's corporate
shareholders (that you don't control), if any, as described
${helpLink('chap06_VI(B)(7)', 'above')}.</p>
                    <br/>

                    <p>The "LBO" transaction is particularly useful when you feel
that your company's stock is greatly undervalued and it is
selling at a large discount from its net worth per share. In
such a case, the company's best investment may be to shrink
its capitalization by buying back part of its own stock from
the public, generally at a premium price of 25% above market
price, or sometimes at a lesser percentage premium for small
LBO buybacks.</p>
                    <br/>

                    <p>This also can have the salutary effect of increasing the value
of the stock of the remaining shareholders, since the stock will
sometimes rise in value due to the buy-in, if it was selling at
a very large discount from net worth per share.  In addition,
the remaining owners will have their stock ownership increased.</p>
                    <br/>

                    <blockquote style="border-left: 4px solid #999; padding-left: 16px; margin: 16px 0;">
                        <hr/>
                        <p><strong>EXAMPLE:</strong>  If you own 40% of a company, and it "buys  in"
20% of its stock, you will own 40/80 or 50% of the stock
remaining after the buy-in.</p>
                        <hr/>
                    </blockquote>
                    <br/>

                    <blockquote style="border-left: 4px solid #999; padding-left: 16px; margin: 16px 0;">
                        <hr/>
                        <p><strong>IMPORTANT LEGAL RESTRICTION:</strong>  Your corporation will not
be allowed to pay out so much for its stock that it reduces
its net worth to a level that places its survival in serious
jeopardy.  Also, if the company is a bank or insurance company,
it will often be prevented by banking or insurance regulators from
doing any such buybacks. These rules give lenders to a corporation
some measure of protection from ruthless corporate raiders (like
you), who might have overly larcenous tendencies.</p>
                        <hr/>
                    </blockquote>
                    <br/>

                    <p>You can use a "greenmail" or "LBO" transaction as one in
a series of steps if you wish to do a true "Leveraged Buy Out"
of a company. The first step would be to buy a controlling
interest in the target company, such as 50%.  If its stock
is sufficiently undervalued and it has good enough credit
(or issues junk bonds), it may then be able to buy back the
remaining 50% of its shares, leaving you with 100% ownership.</p>
                    <br/>

                    <p>In some cases, it may even have enough cash and net worth
left to pay out an "extraordinary dividend" to you after the
buy-in, so that you would even get some of your investment
back immediately--but you will probably wind up with stock in
a company that is leveraged to the hilt, and not far away from
Chapter 11 bankruptcy proceedings--one of the frequently
encountered risks of doing a leveraged buyout in Wall $treet
Raider, as in the real world.</p>
                    <br/>

                    <p>The "LBO" buyback is one way of increasing your voting
control of a company, to make it impossible or more difficult
for an opposing player or some large company to take away
your control of the company. For example, if you own 45% of
the stock of XYZ Corporation, and are afraid of losing control,
but don't have the cash or line of credit to buy more of its
stock, you may be able to have XYZ do an LBO, buying back
enough of its stock from the public to increase your percentage
of ownership to 51% or more, which will guarantee you can
maintain control of the company. In this case, XYZ would need
to buy back 11% of its stock, so your ownership (45/89ths of
the remaining stock would be 51%, or 50.56%, rounded off to 51%).</p>
                    <br/>

                    <p>The "LBO (Leveraged BuyOut)" button is not displayed if you,
the player, are the currently selected ${helpLink('chap03_III(A)', 'Active Entity')},
since stock buybacks are only applicable to corporations.</p>
                </div>
                <br/>

                <div id="chap06_VI(B)(9)">
                    <h4>(9) <u>BUY CORPORATE ASSETS.</u></h4>
                    <br/>

                    <p>The "Buy Corporate Assets"
command button is used to acquire business assets for a
corporation, such as by buying plant and equipment.  If you
control a company and want it to expand its investment in
business assets, either because such an investment is
currently quite profitable or because you want it to quickly
increase its market share to squeeze out the competition, use
this command to have it acquire assets. It can either purchase
more assets of the kind utilized in its current industry or,
if it is a "holding / trading company," it can select any one
of 67 industries which it wishes to enter into, by buying
new or existing assets from a company in that industry.</p>
                    <br/>

                    <p>To acquire business assets, click on the "Buy Corporate Assets"
button. If your company is a holding/trading company, you will be
asked first to select the industry you wish it to enter, and then,
if buying "used" assets, to enter the stock symbol to identify the
company you wish to buy the assets from, which can be in any industry
except banking, insurance, or another holding/trading company.  If
your company already has business assets, and you choose to have your
company buy more assets, you also have the choice of buying "new"
assets, or buying "used" assets from another company in the industry.</p>
                    <br/>

                    <p>If you buy new assets, you will increase the total capacity or
"supply" of assets in the industry, thus tending to depress the
profitability of all companies in that industry, including your own.
Note that if you try to buy a very large amount of assets in a
small industry, that would almost immediately bankrupt most of the
companies in the industry, your board of directors may step in
and limit the amount of new assets you can buy, as part of their
fiduciary duty as directors of the corporation -- even though they
were elected by you as the controlling shareholder.</p>
                    <br/>

                    <p>If you decide to buy "used" assets from another company in the
industry, the program will display a list of all the companies in
the industry and the amount of business assets each owns. The list
will also show who, if anyone, controls each such company. If you
control another company, your company that is buying can, if you
choose, buy assets from your other controlled company for no gain
or loss to the seller and without the usual 10% sales commission.
But if you try to buy from a company you do not control, the
company you choose to buy from may refuse to sell, for various
reasons.</p>
                    <br/>

                    <p>If you buy "used" assets from another company in the industry,
one that you do not control, you might buy the assets from a very
profitable, well-run company, or from a mismanaged, unprofitable
company.  In either case, the rate of return that you will earn
on the acquired assets will be "inherited" from the selling company,
and will be blended with the rate of return your company was earning
on its existing assets, which will either raise or lower your company's
overall profitability. If you buy assets from a highly profitable
company, you will generally have to pay more than "book," and the excess
("goodwill") will be set up as an account on your company's balance sheet.
Any "goodwill" will be written off (amortized) as an operating expense
over a period of years, generally at 20% of the remaining balance each
year (or 5.4% per quarter), though certain conditions, such as incurring
operating losses on the purchased assets, restructurings, or going
through bankruptcy, can cause much or all of the remaining goodwill
account to be written off at once, as an "extraordinary" expense item.</p>
                    <br/>

                    <p>If you want to avoid such goodwill amortization charges, which can
be a drag on your company's earnings for the next several years, you
may find it better to buy the assets from a relatively mediocre company
in the industry, rather than the most profitable and well-run company,
if you have a choice.  (Not all companies will be willing to sell
assets to your company, you will find, and especially not the most
profitable ones.)</p>
                    <br/>

                    <p>Note that if you buy assets from a highly UNprofitable company, you
may be able to buy them at a discount from "book" value, in many cases.
In that case, the difference is "negative goodwill," which will eliminate
some or all of any existing "goodwill" account of the buying company.
If there is still a net negative goodwill amount after such offsetting,
the entire balance is "written up" immediately, as an item of
"extraordinary income" for the buying company. This has little effect,
except on actual (cash) tax payments, since the income item is taxable
income, but does not directly affect the buyer's operating income.</p>
                    <br/>

                    <p>For more on how Wall $treet Raider accounts for "goodwill,"
${helpLink('chap03_III(O)', 'click here')}.</p>
                    <br/>

                    <p>Any gain or loss on the sale of assets by the selling company
(reduced by a 10% sales commission) is treated as an "extraordinary"
item of income or loss.</p>
                    <br/>

                    <p>When buying assets from another company in a particular industry,
if the asset purchase would give you a monopolistic control position
in the industry (generally, over 55% of industry assets), the
government will generally limit the amount of assets your company
can buy, or may prohibit such a purchase altogether, so your company
may have no choice in that case other than to try to buy "new"
assets, instead, if it wishes to expand.</p>
                    <br/>

                    <p>Notice that if you buy assets from another company in the
industry, the industry's overall supply/demand situation is
unchanged -- all that changes is that the market share percentages
for your company and the other (selling) company, in opposite
directions, as a result of one buying assets (and thus future
sales) from the other. In Wall $treet Raider, for the sake of
simplicity, it is assumed in all industries that $1 "book value"
of capital assets (business assets) will generate $1 of gross
sales per year, on which sales the profit margin can range from
roughly -35% to +65%.</p>
                    <br/>

                    <p>The "Buy Corporate Assets" function can be used to have a company
change its industry.  First, have the company in question sell
off or scrap all of its existing business assets, so that it becomes
re-classified as a "holding/trading company." Then, if you want
it to enter some other (profitable) industry, have it buy assets
from some company in that industry (if a company can be found that
is willing to sell some of its assets), again using the "Corp.
Assets" command button.  Note, however, that the change in industry
can cause your company to lose the benefit of any tax loss
carryovers it had, as well as tax credit carryovers, which can be
costly if it had large carryovers of either type.</p>
                    <br/>

                    <p>The "Buy Corporate Assets" transaction can only be used by a
company you control, as the ${helpLink('chap03_III(A)', 'Transacting Entity')}.
Individual players, banks, or insurance companies cannot buy or sell
corporate business assets (plant, equipment, and such) in Wall $treet Raider,
so this button does not appear on the "BUY / SELL" Menu, when the
Transacting Entity is you (the player), or a bank or insurance company
that you control.</p>
                    <br/>

                    <p>Remember, before buying corporate business assets, to take a
look at the "For Sale Items" button on the "OTHER TRANS" menu,
to see if any company in the same industry as your company that
is buying has listed some of its assets for sale, at a 5% discount.
However, these may be "bad" assets that a company in financial
trouble is trying to sell, so: <em>Caveat emptor!</em></p>
                </div>
                <br/>

                <div id="chap06_VI(B)(10)">
                    <h4>(10) <u>SELL CORPORATE ASSETS.</u></h4>
                    <br/>

                    <p>The "Sell Corporate Assets"
command button is used to sell off business assets of a corporation,
such as plant and equipment. If you control a company and want it
to sell off some or all of its assets, it may do so at a price that
may range from around 60% up to 150% of cost, depending upon the
profitability level of the industry. There is also a 10% sales
commission that must be paid on all such sales, further reducing
the net proceeds the company will receive from such a sale.</p>
                    <br/>

                    <p>Selling assets at less than cost will, of course, create
a loss, for profit and loss (and tax) purposes. However, the
loss may be worth taking to stop the bleeding, if the company
is losing lots of money on its business assets and there is no
immediate prospect of improvement in its situation.</p>
                    <br/>

                    <p>To sell off business assets, click on the "Sell Corporate Assets"
button. First, if you control any other companies in the seller's
industry or any holding/trading companies, which could also be
buyers, you will be asked if you want to sell the assets to one of
those controlled companies. If you answer "YES," the program will
then list all such holding/trading companies you control and/or
any other companies in the seller's industry that you control, and
you can pick a company from that list to sell to, and then you will
be asked how much of your company's assets it wishes to sell. Any
such sale to another company you control will be at cost (no gain
or loss recognized) and with no sales commission.</p>
                    <br/>

                    <p>On the other hand, if you don't control any companies that could
be potential buyers of the assets, or if you don but answer "NO"
when asked if you want to sell to a company you control, you will
be asked how much of the assets your selling company wishes to
sell and will be shown the total amount it owns, in the event you
wish to have it sell all of its business assets.</p>
                    <br/>

                    <p>Once you enter the amount you want to sell, your asset broker
will then seek to find a company (that you don't control) in the
same industry (or sometimes a holding / trading company that wants
to enter the industry) that can buy the amount of assets you are
trying to sell. If no buyer can be found, you will be told what
the highest bid is, and you can then try to sell that amount of
assets, or less, at market value, or you can sell the assets for
scrap -- always at a much bigger percentage loss. (But "scrapping"
will reduce the amount of "supply" in the industry, which will help
everyone's profitability somewhat, in your company's industry), by
improving the supply/demand ratio.</p>
                    <br/>

                    <p>Note that when selling assets to a company you do not control,
there is a large sales commission equal to 10% of the sales price,
which is paid by your selling company.</p>
                    <br/>

                    <p>While you will incur a larger loss if you have to scrap any
business assets, the scrapped assets are assumed to be the most
antiquated, least profitable parts of your business, so you will
tend to improve the relative profitability of your remaining,
newer assets.</p>
                    <br/>

                    <p>This "Sell Corporate Assets" function can be used to have a
company change its industry.  First, have the company in question
sell off or scrap all of its existing business assets, so that it
becomes re-classified as a "holding/trading company."  Then, if you
want it to enter some other (profitable) industry, have it buy assets
from some company in that industry (if a company can be found that
is willing to sell some of its assets), using the "Buy Corporate
Assets" command button.</p>
                    <br/>

                    <p>The "Sell Corporate Assets" transaction button can only be used by a
company you control, as the ${helpLink('chap03_III(A)', 'Transacting Entity')}.
Individual players, banks, insurance companies, or holding/trading companies
cannot buy or sell corporate business assets (plant, equipment, and
such) in Wall $treet Raider. Thus, this button will not appear on
the "BUY / SELL" Menu if the Transacting Entity is you (the player),
or a bank, insurance, or holding/trading company.</p>
                    <br/>

                    <p>Be aware, if your company wishes to sell assets, that it can
list a specified amount of assets for sale, at 5% below cost, by
using the "Offer To Sell Assets" button on the MISC MENU, though
there is no guarantee that any company will actually accept the
offer and purchase the assets from you at the discounted price.
But such a sale can be made without paying the 10% sales commission
you would otherwise pay by using the "Sell Corporate Assets" button,
so it may be worth a try.</p>
                </div>
                <br/>

                <div id="chap06_VI(B)(11)">
                    <h4>(11) <u>BUY OR SELL BANK LOANS.</u></h4>
                    <br/>

                    <p>The "Buy or Sell Bank
Loans" button appeared in this BUY / SELL Menu in earlier
versions of W$R, but now appears instead in the "OTHER TRANS."
Menu, when the ${helpLink('chap03_III(A)', 'Active Entity')} or
${helpLink('chap03_III(A)', 'Transacting Entity')} is a bank which
you control. For a description of this function, see
${helpLink('chap09_IX(B)(6)', 'Chapter 9')}.</p>
                </div>
                <br/>

                <div id="chap06_VI(B)(12)">
                    <h4>(12) <u>BUY CALL OPTIONS.</u></h4>
                    <br/>

                    <p>Click on this button to buy
call options, which are options to buy a stock at a fixed price.
You should buy call options when you think the underlying stock
is going to go up in value. For example, if XYZ stock is trading
at $59 a share, you might pay $9 (per share covered) to buy call
options on the stock at $60 at any time in the next 12 months,
if you think the stock may rise sharply. If it does rise to $75,
for example, at the time the option expires, you would receive
the difference between $75 and $60 (the "strike price" or
"exercise price"), which would be $15 per share, resulting in
a $6 per share profit. But if the XYZ stock only went up to $65
at the end of the year, your options would "settle" for only $5,
so you would lose $4 a share. Or, if the stock price were $60
or lower (below the "strike price" and thus "out-of-the-money"),
the options would expire worthless, and you would lose your
entire investment of $9 per share.</p>
                    <br/>

                    <p>Of course, you could sell the options at any time before they
expire, at a gain or a loss, if you decide that the XYZ stock
isn't going to do so well, after all, or has gone up as far as
you think it can go.</p>
                    <br/>

                    <p>In Wall $treet Raider, players and all companies can trade
call options, with certain limitations. Banks and insurance companies
cannot buy calls or sell calls except ${helpLink('glossary_COVERED_CALLS', '"covered calls"')}
to buy back calls they have shorted as a hedge against stocks they
own. It is possible to buy or sell newly created options on any
publicly traded company, unless its stock trades for less than 5
(dollars or other currency unit) or more than 1,000 per share.</p>
                    <br/>

                    <p>Buying options is risky, but can have huge rewards, because
of the leverage they give you. Buying options can also be done to
reduce your risk, however, such as where you have sold a stock
short, but want to hedge yourself against the possibility that
the stock might instead go up. The call options you buy would
offer you protection from losses on your short position in the
stock, if the stock went up, instead of down.</p>
                    <br/>

                    <p>You can also sell calls short, as discussed in the following
segment on selling call options. Note that if you have sold
XYZ call options short, and you click on the "Buy Call Options"
button and enter XYZ as the stock you want to buy options on,
you will first be asked if you want to buy back (cover) the
XYZ options you sold short. If you answer no, then you will
be buying newly created call option contracts on XYZ.</p>
                    <br/>

                    <p>When trading put or call options in Wall $treet Raider, you
cannot buy or sell (or own) options on a stock that is not
publicly traded. Also, if, for example, only 1% of a stock
is owned by "the Public," any new option positions you create
by buying new options or selling options short will be limited
to the percent of the stock that is publicly-traded (1% in
this example). However, you may do multiple option transactions,
even in such a thinly-traded stock.</p>
                    <br/>

                    <p>Note also that a new option contract cannot be created on more
than 10% of a company's total number of shares of stock in Wall
$treet Raider. However, you may be able to do multiple transactions
of 10% (or less) each. Recent versions of Wall $treet Raider have
introduced limits on the number of call options you may buy. You
and all other players and companies combined cannot own call options
on more than a total of 40% of the stock of any one company. (Thus,
if you and other players and companies, in total, already own calls
on 40% of the stock of XYZ Corporation, you would not be able to buy
any calls on XYZ Corporation, unless you were buying back shorted
call positions.)</p>
                    <br/>

                    <p>Long option positions cannot be bought on margin, as they
are not fully counted as part of your net worth for margin
calculation purposes, even though they may be worth a great deal.
Thus, to buy calls (or put options), you must generally pay cash,
or borrow against the value of other assets.</p>
                    <br/>

                    <p><strong><u>NOTE:</u></strong> Options can now be exercised before their
expiration date in Wall $treet Raider. Also, if you have chosen
to exercise options you own or have shorted, the options will
usually be exercised automatically on the expiration date, if
they are "in-the-money." A call option is "in-the-money" if
the stock price is higher than the option's exercise price.
However, there are a number of situations where options that
are in-the-money will not be exercised, but will instead be
settled at their intrinsic value ($4, for example, if the
exercise price is $60 and the stock price is at $64 when
the call option expires). No exercise will occur, even if
an option is in-the-money if:</p>

                    <ul style="margin-left: 24px;">
                        <li>The player does not have enough money and buying power
to exercise a long call option position (or where he/she
is short put options), to acquire the stock;</li>
                        <br/>

                        <li>The player would acquire enough stock to give him/her
control of the company, if not already in control, if
gaining such control would otherwise be prohibited under
the antitrust laws;</li>
                        <br/>

                        <li>The player would be acquiring all of the remaining
publicly-traded stock of the company; or</li>
                        <br/>

                        <li>The player would be selling stock, and does not own
that much of the stock, so that exercise of the option
would create a short position in the stock for the
player.</li>
                    </ul>
                    <br/>

                    <p>Also, you can set the toggle switch item,
"Exercise Options?" on the "Settings" pull-down
menu to "NO" if you want all your option positions
to be settled at their cash value, rather than being
exercised for or against you.</p>
                    <br/>

                    <p>To profit from buying or shorting an option, you
can either sell it (if long) or buy it back (if it
was sold short) before it expires, or you can just
wait until it expires, at which time you will
either receive the amount by which the option is
"in-the-money," if you own the option, or you must
PAY the amount by which it is in-the-money, if you
are short the option. Or, as discussed above, an
option may be exercised, in which case you will be
buying the underlying stock at the exercise price
if you own (are long) the call options, or you will
be selling the stock at the exercise price if you
are short the call options and long the underlying
stock.</p>
                    <br/>

                    <p>Ordinarily, the holder of the option will have a
capital gain if the option is in-the-money and is
settled for cash at expiration, and the short seller
will have a loss -- or vice-versa if the option is
just barely in-the-money (by fewer points than was
paid for the option). For example, if you paid
$6 for an option that is only $2 in-the-money when
it settles at expiration, you will only receive $2
and will thus have a $4 capital loss when the option
is settled. A seller who had sold the options short
for $6 would have a $4 gain if they settled for
only $2.</p>
                    <br/>

                    <p>If an option is exercised, no gain or loss is
recognized on the option itself, or if you are
acquiring stock by the exercise of the option. If
you are purchasing stock via an option exercise,
the "tax basis" of that stock is the price you pay
for it under the option contract, plus whatever you
paid to buy the option (if exercising a call -- but
if you acquire stock due to the exercise of a put
option you sold short, your tax basis for the stock
you acquire is the exercise price LESS the amount
you received from selling the puts short). If you
are selling stock due to exercise of an option,
you will recognize a gain or loss for tax purposes.
Your sales price will be the exercise price plus
(if you sold call options short) or minus (if you
bought put options) the price you paid or received
for the options.</p>
                    <br/>

                    <p>If an option is "out-of-the-money" (the stock price
is below the strike price in the case of a call option,
or above the strike price in the case of a put option),
then no cash changes hands when the option expires --
the buyer of the option has a tax loss equal to the
entire amount paid for the option in that case, or the
short seller of the option recognizes a profit of the
same amount.</p>
                    <br/>

                    <p>TAX TREATMENT OF OPTIONS. In Wall $treet Raider,
all gains or losses on options are treated as capital
gains or losses, for players. (This is not always the
case in the real world, but laws vary from country to
country, and we've merely chosen the simplest approach
for this simulation.) For corporations, the gain or
loss is taxable or deductible as ordinary income or
loss (but reported as "extraordinary income or loss"
for financial reporting purposes).</p>
                </div>
                <br/>

                <div id="chap06_VI(B)(13)">
                    <h4>(13) <u>SELL CALL OPTIONS.</u></h4>
                    <br/>

                    <p>Click on this button if you
wish to sell call options you currently own ("long positions"),
or to sell call options short, creating a new options contract.
A call option is an option to buy a certain stock at a certain
fixed price over some length of time (from less than a month
to as much as 24 months in Wall $treet Raider). If you sell
a call option short, you are giving (selling, actually, for
a price, the "premium") the other party to the contract the
right to buy the stock from you at the fixed price. Thus,
like being short a stock, if you sell a call option short,
and do not own the underlying stock, you have potentially
unlimited upside liability, and can lose huge amounts if
the stock goes up a great deal before the option expires.
On the other hand, if the stock goes down below the exercise
price ("strike price") of the option, the option will expire
worthless, and the entire amount you received when you sold
the call short will be your profit to keep, free and clear.</p>
                    <br/>

                    <p>Generally, you will want to sell calls short if you think the
underlying stock is going to go down (or at least not go up
much). You can also sell call options against a stock you
own, when you aren't ready to sell the stock, but feel it
may not do much for a while, and you would like to earn some
income on the stock. Doing so will offer you some downside
protection if the stock goes down, but will limit your
upside, if the stock does well. This is known as selling
${helpLink('glossary_COVERED_CALLS', '"covered calls"')}.</p>
                    <br/>

                    <p>In Wall $treet Raider, the amount of options you can sell
short is limited. You are not allowed to sell an options
contract if doing so would create a total "short liability"
(for shorted options) more than twice your net worth, under
the W$R margin rules (in the case of players). Later, if your
net worth falls below 30% of the value of your short option
positions, you will be forced to liquidate some of your short
option positions, to meet maintenance margin requirements.
Similarly, corporations may not sell options short unless they
have at least a BBB credit rating, or if the sale of the option
(other than a ${helpLink('glossary_COVERED_CALLS', '"covered call"')})
would create a short "naked" options liability in excess of
25% of their net worth. After a corporation has sold options
short, if the short options liability should exceed 50% of the
corporation's net worth, it must buy back some or all of
the shorted options.</p>
                    <br/>

                    <p>Any long positions in options are treated as having
zero value, except to the extent the option is "in the
money," and thus, while they do increase your net worth,
they are not entirely counted as part of your net worth
for "margin" or credit purposes, since they are such
volatile assets. Thus, if your net worth (as adjusted
for margin calculation purposes) falls below 30% of the
value of your short option positions, any but covered
call or covered put option positions will be forcibly
bought back, or long options sold, until you are back
in compliance with the 30% requirement. Needless to say,
it is not pleasant to be forced to buy back options when
you are already short of cash, as that may create a
negative cash balance and force you to sell other
assets to cover the overdraft. Selling "naked" options
is not for the faint of heart....</p>
                    <br/>

                    <p>Corporations are also subject to (different) margin
rules for options in Wall $treet Raider. They are not
allowed to sell "naked" calls (short), unless they have
a credit rating of BBB or better or if doing so would
create a short liability (value of the shorted options)
that exceeds 25% of the corporation's net worth -- but
they may sell ${helpLink('glossary_COVERED_CALLS', '"covered calls"')}
short, as they do not have to worry about short margin calls in
that case, since any ${helpLink('glossary_COVERED_CALLS', '"covered"')}
calls they sell short are fully offset and hedged by owning the
underlying stock. Banks and insurance companies may not sell
"naked" calls or sell puts short at all.</p>
                    <br/>

                    <p>Similarly, a player (or a company controlled by a player)
cannot sell "naked" call options on a stock of a company he
or she controls, where the player or company does not own
the stock. You can hedge your stock position in a controlled
company by selling calls against it (and/or buying puts on
it), but the total percentage of stock covered by the shorted
calls and long puts cannot exceed the percent of the stock
you DIRECTLY own (or your company directly owns, if a controlled
company is the call seller or put buyer). Thus, if you own 25%
of the stock of a company you control, you can sell covered
calls against it, on 25% of the company's stock, or buy
puts on 25% of the company's stock (or some combination of
the two -- short calls and long put positions). But you
cannot hedge more than 25% of the stock if you only own 25%.
Doing so would be to bet against your own company's stock,
a severe conflict of interest, so it is not permitted.</p>
                    <br/>

                    <p>In addition, if one controlled company of yours, Company
A, tries to buy puts or sell calls on the stock of another
controlled company of yours, it cannot do so unless it
directly owns enough of the stock of Company A to cover
the option hedge.</p>
                    <br/>

                    <p>Note, also, that in Versions 8.0, all the players and
companies in the simulation cannot be short call options on
more than a total of 100% of the stock of any one company
at any point in time.</p>
                    <br/>

                    <p>Executive stock options are granted each quarter to a
player who is CEO of a company, expiring two years after the
date of grant, which is around the middle of the first month
of a quarter. The options are granted to players who control
a publicly-traded corporation. These valuable call options
are "restricted options" and can't (voluntarily) be sold
during the first 12 months after the date they were granted.</p>
                    <br/>

                    <p>In creating new option positions in Wall $treet Raider,
whether long or short, you are limited to options on
10% of the stock of the company in question for any
new option contract (or less, if the company has less
than 10% of its stock owned by "the Public"). Where
you are selling options in which you have a "long"
position, however, you may sell the entire position
at one time, if you wish, even if it is on more than
10% of the company's stock or more than the percentage
of the stock that is publicly traded.</p>
                    <br/>

                    <p>It is possible to buy or sell newly created options on
any publicly traded company, unless its stock trades for
less than 5 or more than 1,000 a share.</p>
                    <br/>

                    <p>We have added a new limitation on options purchases or
sales -- any time you create a new option contract by buying
(long) or selling short an option, there must be another
party (a corporation in Wall $treet Raider) that can take
the other side of the transaction. Thus, it is possible,
if a new option contract you are creating would have a
very large value, that it might not be possible for the
Options Exchange to find a counterparty, and thus you might
not be able to do the transaction in such an instance.</p>
                    <br/>

                    <p><strong><u>NOTE:</u></strong> Options can now be exercised before
their expiration date in Wall $treet Raider. Also, if you
have chosen to exercise options you own or have shorted, the
options will usually be exercised automatically on the expiration
date, if they are "in-the-money." A call option is "in-the-money"
if the stock price is higher than the option's exercise price.
However, there are a number of situations where options that
are in-the-money will not be exercised, but will instead be
settled at their intrinsic value ($4, for example, if the
exercise price is $60 and the stock price is at $64 when
the call option expires). No exercise will occur, even if
an option is in-the-money if:</p>

                    <ul style="margin-left: 24px;">
                        <li>The player (or corporation) does not have enough money
and buying power to exercise a long call option position
(or where he/she is short put options), to acquire the stock;</li>
                        <br/>

                        <li>The player (or his or her corporation) would acquire
enough stock to give the player control of the company,
if not already in control, if gaining such control would
otherwise be prohibited under the antitrust laws;</li>
                        <br/>

                        <li>The player (or corporation) would be acquiring all of
the remaining publicly-traded stock of the company; or</li>
                        <br/>

                        <li>The player or corporation would be selling stock, and
does not own that much of the stock, so that exercise of
the option would create a short position in the stock for
the player or corporation that shorted the call options.</li>
                    </ul>
                    <br/>

                    <p>Also, you can set the toggle switch item, "Exercise
Options?" on the "Settings" pull-down menu to "NO" if you
want all your option positions to be settled at their
cash value at expiration, rather than being exercised for
or against you.</p>
                    <br/>

                    <p>To profit from buying or shorting an option,
you can either sell it (if long) or buy it back
(if it was sold short) before it expires, or you can
simply wait until it expires, at which time you will
either receive the amount by which the option is
"in-the-money," if you own the option, or you must
PAY the amount by which it is in-the-money, if you
are short the option. Or, as discussed above, an
option may be exercised, in which case you will be
buying the underlying stock at the exercise price
if you own (are long) the call options, or you will
be selling the stock at the exercise price if you
are short the call options and long the underlying
stock.</p>
                    <br/>

                    <p>Ordinarily, the holder of the option will have a
capital gain if the option is in-the-money and is
settled for cash at expiration, and the short seller
will have a loss -- or vice-versa if the option is
just barely in-the-money (by fewer points than was
paid for the option). For example, if you paid
$6 for an option that is only $2 in-the-money when
it settles at expiration, you will only receive $2
and will thus have a $4 capital loss when the
option is settled. A seller who had sold the options
short for $6 would have a $4 gain if they settled
for only $2.</p>
                    <br/>

                    <p>If an option is exercised, no gain or loss is
recognized on the option itself, or if you are
acquiring stock by the exercise of the option. If
you are purchasing stock via an option exercise,
the "tax basis" of that stock is the price you pay
for it under the option contract, plus whatever you
paid to buy the option (if exercising a call -- but
if you acquire stock due to the exercise of a put
option you sold short, your tax basis for the stock
you acquire is the exercise price LESS the amount
you received from selling the puts short). If you
are selling stock due to exercise of an option,
you will recognize a gain or loss for tax purposes.
Your sales price will be the exercise price plus
(if you sold call options short) or minus (if you
bought put options) the price you paid or received
for the options.</p>
                    <br/>

                    <p>If an option is "out-of-the-money" (the stock price
is below the strike price in the case of a call option,
or above the strike price in the case of a put option),
then no cash changes hands when the option expires --
the buyer of the option has a tax loss equal to the
entire amount paid for the option in that case, or the
short seller of the option recognizes a profit of the
same amount.</p>
                    <br/>

                    <p>TAX TREATMENT OF OPTIONS. In Wall $treet Raider,
all gains or losses on options are treated as capital
gains or losses. (This is not always the case in the
real world, but laws vary from country to country,
and we've merely chosen the simplest approach for
this simulation.) For corporations, the gain or loss
is taxable or deductible as ordinary income or loss
(but reported as "extraordinary income or loss" for
financial reporting purposes).</p>
                </div>

                <div id="chap06_VI(B)(14)">
                    <p>(14) <u>BUY PUT OPTIONS.</u> Click on this button to
buy "put" options on a stock, or to buy back put options
that you have previously sold short. A put option allows
the person who buys the option to "put" the stock to the
other party to the contract at a fixed price over an
agreed period of time (up to 24 months in Wall $treet
Raider). Thus, puts can be thought of as a form of
"portfolio insurance" for stocks you own.</p>
                    <br/>

                    <p>For example, if you own a stock that trades at $61 a
share, which you feel may have a lot of downside risk,
but don't want to sell it because you feel it also has
good upside potential, you might pay $6 or so to buy
a put option at $60 a share, giving you the right to
"put" the stock (sell it) at $60 any time in the next
year, limiting your losses if the stock goes below
$54 a share. (The $60 price you could put the stock
at, less the $6 you had to pay for the option.)</p>
                    <br/>

                    <p>Where you don't own the underlying stock, puts are a
way to speculate on a stock by profiting if it declines.
Buying a put is much like selling the stock short, but
without the unlimited exposure of selling stock short,
if you are wrong and the stock goes up instead of down.
If you buy a put on a stock, and the stock goes up, you
will only lose what you paid for the put option, unlike
being short the stock, where your losses could be huge
and virtually unlimited.</p>
                    <br/>

                    <p>You can also sell puts short, as discussed in the following
segment on selling put options. Note that if you have sold
XYZ Corp. put options short, and you click on the "Buy Put
Options" button and enter XYZ as the stock you want to buy
put options on, you will first be asked if you want to buy
back (cover) the XYZ put options you sold short. If you
answer "No," then you will be buying a newly created put
option contract on XYZ.</p>
                    <br/>

                    <p>All corporations can buy put options, except that banks
and insurance companies may only do so to the extent they
are hedging positions in the underlying stock which they own.</p>
                    <br/>

                    <p>When trading put or call options in Wall $treet Raider, you
cannot buy or sell (or own) options on a stock that is not
publicly traded. Also, if, for example, only 1% of a stock
is owned by "the Public," any new option positions you create
by buying new options or selling options short will be limited
to the percent of the stock that is publicly-traded (1% in
this example). However, you may do multiple option transactions,
even in such a thinly-traded stock.</p>
                    <br/>

                    <p>Note also that a new option contract cannot be created on
more than 10% of a company's total number of shares of stock in
Wall $treet Raider. It is possible to buy or sell newly created
puts on any publicly traded company, unless its stock trades for
less than 5 or more than 1,000 a share.</p>
                    <br/>

                    <p>However, you cannot buy put options on a stock
of a company you control, where you do not own the
stock directly. You can hedge your stock position in
a controlled company by buying puts against it (and/or
selling calls on it), but the total percentage of stock
covered by the shorted calls and long puts cannot exceed
the percent of the stock you DIRECTLY own. Thus, if you
own 25% of the stock of a company you control, you can
sell ${helpLink('glossary_COVERED_CALLS', 'covered calls')}
against it, on 25% of the company's stock, or buy puts on
25% of the company's stock (or some combination of the two
-- short calls and long put positions). But you cannot
hedge more than 25% of the stock if you only own 25%.
Doing so would be to bet against your own company's
stock, a severe conflict of interest, so it is not
permitted. The same rule applies to put purchases by
a company you control, if it is buying puts on another
company you also control.</p>
                    <br/>

                    <p>Long option positions cannot be bought on margin, as they
are not fully counted as part of your net worth for margin
calculation purposes (they are counted only to the extent they
are "in-the-money"), even though they may be worth a great
deal. Thus, to buy puts (or call options), you must generally
pay cash, or borrow against the value of other assets.</p>
                    <br/>

                    <p><strong><u>NOTE:</u></strong> Options can now be exercised before their
expiration date in Wall $treet Raider. Also, if you have chosen
to exercise options you own or have shorted, the options will
usually be exercised automatically on the expiration date, if
they are "in-the-money." A call option is "in-the-money" if
the stock price is higher than the option's exercise price.
However, there are a number of situations where options that are
in-the-money will not be exercised, but will instead be settled
at their intrinsic value ($6, for example, if the exercise
price is $60 and the stock price is at $54 when the put option
expires). No exercise will occur, even if an option is in-the-money
if:</p>
                    <ul style="margin-left: 24px;">
                        <li>The player does not have enough money and buying power
to exercise a long call option position (or where he/she
is short put options), to acquire the stock;</li>
                        <br/>

                        <li>The player would acquire enough stock to give him/her
control of the company, if not already in control, if
gaining such control would otherwise be prohibited under
the antitrust laws;</li>
                        <br/>

                        <li>The player would be acquiring all of the remaining
publicly-traded stock of the company; or</li>
                        <br/>

                        <li>The player would be selling stock, and does not own
that much of the stock, so that exercise of the option
would create a short position in the stock for the
player.</li>
                    </ul>
                    <br/>

                    <p>Also, you can set the toggle switch item,
"Exercise Options?" on the "Settings" pull-down
menu to "NO" if you want all your option positions
to be settled at their cash value at expiration,
rather than being exercised for or against you.</p>
                    <br/>

                    <p>To profit from buying or shorting an option, you
can either sell it (if long) or buy it back (if it
was sold short) before it expires, or you can simply
wait until it expires, at which time you will
either receive the amount by which the option is
"in-the-money," if you own the option, or you must
PAY the amount by which it is in-the-money, if you
are short the option. Or, as discussed above, an
option may be exercised, in which case you will be
buying the underlying stock at the exercise price
if you own (are long) the call options, or you will
be selling the stock at the exercise price if you
are short the call options and long the underlying
stock.</p>
                    <br/>

                    <p>Ordinarily, the holder of the option will have a
capital gain if the option is in-the-money and is
settled for cash at expiration, and the short seller
will have a loss -- or vice versa if the option is
just barely in-the-money (by fewer points than was
paid for the option). For example, if you paid
$6 for an option that is only $2 in-the-money when
it settles at expiration, you will only receive $2
and will thus have a $4 capital loss when the
option is settled. A seller who had sold the options
short for $6 would have a $4 gain if it settled for
only $2.</p>
                    <br/>

                    <p>If an option is exercised, no gain or loss is
recognized on the option itself, or if you are
acquiring stock by the exercise of the option. If
you are purchasing stock via an option exercise,
the "tax basis" of that stock is the price you pay
for it under the option contract, plus whatever you
paid to buy the option (if exercising a call -- but
if you acquire stock due to the exercise of a put
option you sold short, your tax basis for the stock
you acquire is the exercise price LESS the amount
you received from selling the puts short). If you
are selling stock due to exercise of an option,
you will recognize a gain or loss for tax purposes.
Your sales price will be the exercise price plus
(if you sold call options short) or minus (if you
bought put options) the price you paid or received
for the options.</p>
                    <br/>

                    <p>If an option is "out-of-the-money" (the stock price
is below the strike price in the case of a call option,
or above the strike price in the case of a put option),
then no cash changes hands when the option expires --
the buyer of the option has a tax loss equal to the
entire amount paid for the option in that case, or the
short seller of the option recognizes a profit of the
same amount (ignoring the commissions paid by both
parties when the positions were established).</p>
                    <br/>

                    <p>In Versions 8.0 and later, all the players and
companies in the simulation cannot own put options on
more than a total of 100% of the stock of any one company.</p>
                    <br/>

                    <p>TAX TREATMENT OF OPTIONS. In Wall $treet Raider, all
gains or losses on options are treated as capital
gains or losses. (This is not always the case in the
real world, but laws vary from country to country,
and we've merely chosen the simplest approach for
this simulation.) For corporations, the gain or
loss is taxable or deductible as ordinary income or
loss (but reported as "extraordinary income or loss"
for financial reporting purposes.</p>
                </div>

                <div id="chap06_VI(B)(15)">
                    <p>(15) <u>SELL PUT OPTIONS.</u> Click on this button to
sell put options you own, or to sell short newly created
put option contracts. A put option allows the person who
buys the option to "put" the stock to the other party to the
contract at a fixed price over an agreed period of time (up
to 24 months in Wall $treet Raider). Puts are like a form of
"portfolio insurance" against a decline in the price of a
stock, where the buyer of the put wants to protect against
a large drop in the price of the stock.</p>
                    <br/>

                    <p>If you sell a put short, you are acting somewhat like an
insurance company, since you will have to absorb the loss
if the stock goes down. For example, if a stock is trading
for $61, and you sell a put on it at an exercise price of
$60, receiving $6 for the put, you will profit if the stock
is anywhere above $54 when the option expires. But if
the stock falls to, say, $35, you will have to pay the
difference between $60 and $35 ($25 a share) when the
contract settles, which would cause you a net loss of $19
a share, since you only received the $6 premium when you
sold the put short. (Or you could allow the put to be
exercised, "putting" the stock to you at $60, when it
is only worth $35, and you could hold onto the stock,
hoping that it would go back up someday.)</p>
                    <br/>

                    <p>Generally, you only want to sell puts short if you
expect the stock is going to go up, or at least not go
down much below the "strike price" (the agreed exercise
price of the option). If the stock is anywhere above the
strike price on expiration date, the put option becomes
worthless and you will pocket the entire premium you
received when you sold the put short, all as profit.</p>
                    <br/>

                    <p>In Wall $treet Raider, the amount of options you
can sell short is limited by options margin rules. You
are not allowed to sell an options contract if doing so
would create a total "short liability" (for shorted
options) more than twice your net worth, under the W$R
margin rules.</p>
                    <br/>

                    <p>Later, if your net worth falls below 30% of the value
of your short option positions, you will be forced to
liquidate some of your option positions, by buying back
short positions, to meet maintenance margin requirements.</p>
                    <br/>

                    <p>Similarly, corporations may not sell options short unless
they have at least a BBB credit rating, or if the sale of the
option (other than a ${helpLink('glossary_COVERED_CALLS', '"covered call"')})
would create a short options liability in excess of 25% of their
adjusted net worth. After a corporation has sold options
short, if the uncovered ("naked") short options liability
should exceed 50% of the corporation's net worth, it must
buy back some of the shorted options.</p>
                    <br/>

                    <p>Any long positions in options are treated as having
zero value, except to the extent the option is "in
the money," and thus, while they do increase your net
worth, they are not entirely counted as part of your
net worth for "margin" purposes, since they are such
volatile assets. Thus, if your net worth (as adjusted
for margin calculation purposes) falls below 30% of the
value of your short (naked, uncovered) option positions,
any short option positions will be sold without your
permission until you are back in compliance with the
30% requirement. (Or until you run out of money and
other assets to buy back options, and go broke.)
Needless to say, it can be exceedingly painful to be
forced to buy back options when you are already short
of cash, as that may create a negative cash balance
and force you to sell other assets to cover the
overdraft.</p>
                    <br/>

                    <p>Selling "naked" options is not for the faint of heart....</p>
                    <br/>

                    <p>In creating new option positions in Wall $treet Raider,
whether long or short, you are limited to options on
10% of the stock of the company in question for any
new option contract (or less, if less than 10% of the
company's stock is owned by "the Public"). Where you
are selling options in which you have a "long" position,
however, you may sell the entire position at one time,
if you wish, even if it is on more than 10% of the
company's stock or more than the percentage of the
stock that is publicly traded. You can buy or sell
newly created options on any publicly traded company,
unless its stock trades for less than 5 or more than
1,000 a share.</p>
                    <br/>

                    <p><strong><u>NOTE:</u></strong> Options can now be exercised before their
expiration date in Wall $treet Raider. Also, if you have chosen
to exercise options you own or have shorted, the options will
usually be exercised automatically on the expiration date, if
they are "in-the-money." A call option is "in-the-money" if
the stock price is higher than the option's exercise price; a
put is "in-the-money" if the stock price is lower than the
option's exercise price.</p>
                    <br/>

                    <p>However, there are a number of situations where options
that are in-the-money will not be exercised, but will instead
be settled at their intrinsic value ($4, for example, if the
exercise price is $60 and the stock price is at $64 when
the call option expires). No exercise will occur, even if
an option is in-the-money if:</p>
                    <ul style="margin-left: 24px;">
                        <li>The player does not have enough money and buying power
to exercise a long call option position (or where he/she
is short put options), to acquire the stock;</li>
                        <br/>

                        <li>The player would acquire enough stock to give him/her
control of the company, if not already in control, if
gaining such control would otherwise be prohibited under
the antitrust laws;</li>
                        <br/>

                        <li>The player would be acquiring all of the remaining
publicly-traded stock of the company; or</li>
                        <br/>

                        <li>The player would be selling stock, and does not own
that much of the stock, so that exercise of the option
would create a short position in the stock for the
player.</li>
                    </ul>
                    <br/>

                    <p>Also, you can set the toggle switch item, "Exercise
Options?" on the "Settings" pull-down menu to "NO" if
you want all your option positions to be settled at
their cash value at expiration, rather than being
exercised for or against you.</p>
                    <br/>

                    <p>To profit from buying or shorting an option,
you can either sell it (if long) or buy it back
(if it was sold short) before it expires, or you can
simply wait until it expires, at which time you will
either receive the amount by which the option is
"in-the-money," if you own the option, or you must
PAY the amount by which it is in-the-money, if you
are short the option. Or, as discussed above, an
option may be exercised, in which case you will be
buying the underlying stock at the exercise price
if you own (are long) the call options, or you will
be selling the stock at the exercise price if you
are short the call options and long the underlying
stock.</p>
                    <br/>

                    <p>Ordinarily, the holder of the option will have a
capital gain if the option is in-the-money and is
settled for cash at expiration, and the short seller
will have a loss -- or vice-versa if the option is
just barely in-the-money (by fewer points than was
paid for the option). For example, if you paid
$6 for an option that is only $2 in-the-money when
it settles at expiration, you will only receive $2
and will thus have a $4 capital loss when the
option is settled. A seller who had sold the options
short for $6 would have a $4 gain if they settled
for only $2.</p>
                    <br/>

                    <p>If an option is exercised, no gain or loss is
recognized on the option itself, or if you are
acquiring stock by the exercise of the option. If
you are purchasing stock via an option exercise,
the "tax basis" of that stock is the price you pay
for it under the option contract, plus whatever you
paid to buy the option (if exercising a call -- but
if you acquire stock due to the exercise of a put
option you sold short, your tax basis for the stock
you acquire is the exercise price LESS the amount
you received from selling the puts short). If you
are selling stock due to exercise of an option,
you will recognize a gain or loss for tax purposes.
Your sales price will be the exercise price plus
(if you sold call options short) or minus (if you
bought put options) the price you paid or received
for the options.</p>
                    <br/>

                    <p>If an option is "out-of-the-money" (the stock price
is below the strike price in the case of a call option,
or above the strike price in the case of a put option),
then no cash changes hands when the option expires --
the buyer of the option has a tax loss equal to the
entire amount paid for the option in that case, or the
short seller of the option recognizes a profit of the
same amount (ignoring the commissions paid by both
parties when the positions were established).</p>
                    <br/>

                    <p>In Versions 8.0 or later, all the players and
companies in the simulation cannot be short put options
on more than a total of 100% of the stock of any one
company.</p>
                    <br/>

                    <p>TAX TREATMENT OF OPTIONS. In Wall $treet Raider,
all gains or losses on options are treated as capital
gains or losses. (This is not always the case in the
real world, but laws vary from country to country,
and we've merely chosen the simplest approach for
this simulation.) For corporations, the gain or
loss is taxable or deductible as ordinary income or
loss (but reported as "extraordinary income or loss"
for financial reporting purposes).</p>
                </div>

                <div id="chap06_VI(B)(16)">
                    <p>(16) <u>TRADE FUTURES.</u> Click on this button to
buy or sell commodity or stock index futures contracts,
thus allowing you to speculate in five different commodities:
oil, gold, silver, wheat, and corn, for players and all
companies except banks and insurers. Recent versions added
trading in stock index futures by players and by all
companies except banks. (Subsequent releases of W$R added
the ability to buy and store physical commodities, for
players and companies other than banks and insurance
companies. Use the ${helpLink('chap06_VI(B)(17)', 'TRADE COMMODITIES')} button to buy or sell physical commodities,
rather than the futures contracts.)</p>
                    <br/>

                    <p>This button will allow you to trade futures contracts on the
five commodities or the Stock Index. When clicked, it brings
up a small "Futures Trading Desk" dialog window (submenu),
on which you can either select a commodity to do trades in,
or else click on a "POSITIONS" button to view a list of all
of your existing futures positions, and you can then simply
click on one of the position line items to select it for
closing, either partly or in full -- selling it if long, buying
it back if short. (Note that if the trading entity is you, the
player, and you are currently in "physical commodity" trading
mode, clicking on the "POSITIONS" button will display a list
of your physical commodity holdings, rather than your futures
contract positions.)</p>
                    <br/>

                    <p>A "TRADE" button will appear on any commodity or stock index
chart, with some exceptions, such as for banks, which aren't
allowed to do futures trading. Clicking on the "TRADE" button
will take you to a screen for buying or selling the commodity
whose chart you were viewing (or stock index futures, in the
case of the Global Stock Index chart).</p>
                    <br/>

                    <p>A 1% commission is charged on the total value of each futures contract when you initiate
or close it, except when the contract terminates at its expiration date, and is settled
either by a cash settlement or where the entity long or short the futures contact will
either take or make delivery of the commodity. The only case where no commission is charged
for contracts closed before expiration is for companies that hedge by buying or shorting a
certain commodity, such as an oil company that sells its production forward, or an airline
that buys oil futures, or Packaged Foods company that buys wheat or corn futures. Those
companies regularly close out part of their hedge positions every one or two calendar
quarters, if not controlled by a human player, which is deemed to simply be selling part
of their production or acquiring fuel or grain they use, for example.</p>
                    <br/>

                    <p>In the current version of Wall $treet Raider, players or companies can obtain physical
delivery of a commodity at expiration when they are long a futures contract, or can make
delivery (sale at the futures contract price) when, for example, you or a company are
short on a futures contract to sell 1 million barrels of oil, and you or the company own
some of the physical oil commodity.</p>
                </div>

                <div id="chap06_VI(B)(17)">
                    <p>(17) <u>TRADE COMMODITIES.</u> Click on this button to buy
or sell (but not sell short) any of the five physical commodities
(but not the Stock Index), which you can then store and hold
indefinitely, unlike futures. However, you will be required to
pay monthly storage fees and insurance costs for the stored
physical commodities, the terms of which will be explained to
you before you make any such purchase. You will also be warned,
when buying physical grain (wheat or corn), that some shrinkage
and spoilage will occur, the longer you store the grain -- Such
as being eaten by rats, insects, etc.</p>
                    <br/>

                    <p>In order to buy or sell a physical commodity, first select the
commodity, for example, gold, from the submenu, and then either click
on the "BUY" button to buy physical gold or on the "SELL" button
if you already own physical gold and wish to sell it. Note that
the "COVER SHORT" and "SELL SHORT" buttons will gray out (become
disabled) when you are in Physical Commodity Trading Mode.
(Use the ${helpLink('chap06_VI(B)(16)', 'TRADE FUTURES')} button
to trade commodity futures contracts, rather than physical
commodities.)</p>
                    <br/>

                    <p>You may also trade a physical commodity by simply clicking
on the "TRADE" button on, for example, a gold price chart.
Then, on the Commodity Trading Desk that pops up, if the toggle
button reads " --> PHYSICAL," you are in Futures Trading Mode,
so just click on the toggle button to switch to Physical Commodity
Trading Mode. (The toggle button will then read " --> FUTURES ."
Once you are in Physical Commodity Trading Mode, select a commodity
to buy or, if you own it already, to sell.</p>
                    <br/>

                    <p>To switch back to futures trading mode, click on the same toggle
button when it reads " --> FUTURES. " Note that the " --> PHYSICAL "
or " --> FUTURES" toggle button only is enabled when you, the
player, or a corporation other than an insurance company is the
entity that is trading. Otherwise, when an insurance company is
trading futures, that button will simply display a blank line
(" -------- ") and is non-functional, since an insurer is not allowed
to trade physical commodities or any futures other than stock index
futures. The TRADE COMMODITIES and TRADE FUTURES buttons do not
appear at all on the "BUY / SELL" menu, if a bank is the entity
doing transactions, since banks are not allowed to trade futures
or physical commodities with depositors' money in Wall $treet
Raider.</p>
                    <br/>

                    <p>A 1% commission is charged on the total value of the
physical commodity that is purchased or sold.</p>
                    <br/>

                    <p>Buying physical commodities, where you must pay cash to buy
the commodity, is a conservative way of trading in commodities.
In contrast, trading commodities futures, with enormous leverage,
is very treacherous and dangerous.</p>
                </div>

                <div id="chap06_VI(B)(18)">
                    <p>(18) <u>TRADE CRYPTOCURRENCIES.</u> Click on this button to
trade ${helpLink('glossary_crypto', 'cryptocurrencies')}, Bitcoin
or Ethereum, or to trade futures on either. Clicking on this
menu item on the BUY / SELL menu will bring up a new screen,
the CRYPTO CURRENCY TRADING PLATFORM, which allows you to do
trades, view price charts, and see the current (${helpLink('glossary_spot', '"spot"')})
price for Bitcoin or Ethereum. A "LIST" button is also provided
that allows you to view a list of either:</p>
                    <ul style="margin-left: 24px;">
                        <li>all of the futures positions for the currently selected
${helpLink('chap03_III(A)', 'Transacting Entity')}, including any
cryptocurrency futures positions; or</li>
                        <br/>

                        <li>all physical commodity holdings and holdings of Bitcoin and
Ethereum, if any, of the ${helpLink('chap03_III(A)', 'Transacting Entity')}.</li>
                        <br/>
                    </ul>
                    <br/>

                    <p>Note that while cryptocurrencies you own are an intangible asset,
unlike physical commodities, they are traded and treated like
physical commodities in this simulation and futures can also be
traded on them. Thus, for example, if you own (are long) futures
on Bitcoin, and you have turned on the "Take Physical Delivery"
setting in the "Settings Menu," when the futures contract expires
you or your company will purchase the amount of Bitcoin covered by
the futures contract, to hold like a physical asset, in a non-taxable
transaction, rather than settling the futures contract for a gain
or a loss.</p>
                    <br/>

                    <p>All gains or losses on cryptos (or crypto futures) in Wall Street
Raider are treated as capital gains or losses for individual players
or as "extraordinary" gains or losses for corporations. This differs
from the treatment of commodities (oil, gold, silver, wheat, and
corn) in Wall Street Raider, for which trades can sometimes result
in hedging income or loss that is treated as part of the operating
earnings of a company, if the commodity is one that the company
typically produces or purchases in large quantities for its
business (such as oil purchased by airlines) for hedging purposes.</p>
                    <br/>

                    <p>Because trading or holding cryptocurrencies is highly speculative
and risky, banks and insurance companies are not permitted to hold
cryptocurrencies or trade futures on them in Wall Street Raider; thus,
the "Trade Cryptocurrencies" button does not appear on the BUY / SELL
transactions menu if the current ${helpLink('chap03_III(A)', 'Transacting Entity')}
is a bank or insurance company. ETFs are also not allowed to trade
cryptocurrencies (or cryptocurrency futures) in this simulation.</p>
                </div>

                <div id="chap06_VI(B)(19)">
                    <p>(19) <u>ADVANCED OPTION TRADING.</u> Click on this button to
access the Advanced Options Trading Station, a screen similar to
what a number of online brokerages provide. The trading station
allows you to execute up to 8 different options contracts at a
time, making it much easier to execute complex options trading
strategies, such as straddles, strangles, vertical and calendar
spreads, Butterfly spreads, Iron Condors and other sophisticated
combinations of options, as discussed in detail in Chapter 4 on
${helpLink('chap04_IV(A)(11)', 'Options Trading')}. See that section
if that sort of complex options trading interests you.</p>
                    <br/>

                    <p>There are some limits on which entities can utilize the
Advanced Options Trading Station feature: You, the player,
and any industrial corporation or holding/trading company
that you control may utilize it. However, banks or insurance
companies may not use it, due to various restrictions on
their use of options, which limit them to hedging stock
positions. Also, if you manage an ETF, it can still do
individual option trades, but cannot utilize the trading
station, since ETFs can only have one put option and one
call option on a particular stock at a given time. (W$R Rule)
Thus, use of the trading station would not be feasible for
banks, insurance companies, or ETFs, so the program does not
let those types of entities access the trading station for
options trades.</p>
                    <br/>

                    <p>In addition, the trading station cannot be used to create
complex option transactions on stock of a company that
you control, since W$R contains fiduciary rules that
prohibit you from betting against the stock of a company
you control, by selling the stock short or doing the
rough equivalent of selling it short by use of "naked"
call options or buying put options on the stock.</p>
                    <br/>

                    <p>The main reason you may want to use the trading station
is that it allows you to set up and execute up to 8 option
contracts simultaneously, which is important when utilizing
complex strategies like an Iron Butterfly Spread. While you
could use the 4 options transaction buttons on the Buy/Sell
Menu to set up such a spread, one trade at a time, that can
be problematic if the market price of the underlying stock
moves away from you before you can implement the full set of
positions.</p>
                    <br/>

                    <p>Of course, you can still do single options trades, using
the Buy Call Options, Sell Call Options, Buy Put Options,
and Sell Put Options buttons on the Buy / Sell Menu, as with
older versions of Wall Street Raider, but when doing complex
spreads, strangles, etc., it will be much quicker and easier
to use the trading station screen. The rest of this section
discusses how to use the various features of the Advanced
Options Trading Station.</p>
                    <br/>

                    <p>The first step, if you wish to use the trading station,
is to select, as the "Active Entity," the stock on which
you or an industrial company or holding/trading wish to
buy and/or sell options. The Active Entity you select must
be a company that you do NOT control, for the reasons
described above. Then click on the Advanced Option Trading
button on the Buy/Sell Menu to bring up the trading station
screen.</p>
                    <br/>

                    <p>When using the Advanced Options Trading Station screen,
there are 8 buttons on the bottom part of the screen.
Their functions are mostly very obvious, but here is
a brief description of what each button does:</p>
                    <br/>

                    <ul style="margin-left: 24px;">
                        <li>CLEAR ALL - Click this button to clear any entries
you have made above if, for example, you want to start
over and enter a different set of option positions to
be executed.</li>
                        <br/>

                        <li>HELP-F1 - Clicking the HELP-F1 button or the F1
function key on your keyboard will display the part
of the W$R Help File that provides detailed explanations
of each of the main types of complex options strategies
used by professional options traders.</li>
                        <br/>

                        <li>SHOW SIZE LIMITS - Click on this button to see if
you will exceed the limits for total long puts, total
short puts, total long calls, or total short calls owned
or shorted by all players and companies on the stock
whose options you are about to trade. The simulation
limits the amount of options in each of those 4 classes,
to options covering a certain percentage of the stock
of the company whose options you are trading. The
percentage is 100% each, for long puts, short puts,
and short calls, but is 40% for long calls. When you
click on this button, it will show how much of each
of those separate limits is remaining and that you may
use. For example, if players (you and any other players)
or various companies (regardless of who controls them)
have, in total, short put option positions on 85% of
XYZ company, you and all other entities may only create
another 15% of short put positions on XYZ, as long as
the other 85% positions remain in effect.</li>
                        <br/>

                        <li>AUTO-TRADE - Click on this button to bring up a
screen that lets you choose from a list of different
complex options strategies (straddles, strangles, vertical
call spreads, Iron Butterfly spreads, etc.). Once you
select the strategy you want to employ, you will be asked
to enter the date (Month/Year) when you want all of the
options to expire and the quantity of options for each
contract (covering 1% to 10% of the issued shares of the
underlying stock). Then simply click the "GO" button
and your complex options strategy will be posted to the
Advanced Options Trading Station screen, for you to
either execute with the "SUBMIT" button, or if you like,
first make any desired modifications before executing the
trades.</li>
                        <br/>

                        <li>CALC - Use this button to display the buying
or selling prices of each of the options you wish to
buy or sell and it will also calculate the cash outlay
or cash you will receive (net) if you execute the
option transactions whose details you have entered.
The SUBMIT button will do the same as the CALC PRICES
button, except that after it calculates the cost or
net cash to be received, the SUBMIT button will ask
if you are ready to submit the orders for execution.</li>
                        <br/>

                        <li>SUBMIT - Click on this button to submit all your
planned trades to be executed, all at the same time.
You will first be shown how much net cash you will
receive, or how much net cash you will have to pay
to establish the positions, before you choose "YES"
when asked if you are ready to execute the trades.</li>
                        <br/>

                        <li>LIST OPTIONS - Click on this button to display
a list of all options, on all stocks, that you (or
the Transacting Entity that is doing the trades, if
not you personally) either own or have sold short,
and which are still open.</li>
                        <br/>

                        <li>CLOSE ALL XYZ OPTIONS -- If the current Active
Entity is XYZ Corp., clicking on this button will cause
all your options positions on XYZ (puts and calls, long
and short positions) to be immediately settled, so that
you will no longer have any options positions on the
stock of XYZ Corp. (or whatever company whose stock you
have selected as the Active Entity, on which to do the
complex option trades).</li>
                        <br/>

                        <p>However, this function will not close all options on
XYZ if, for example, you have more than one controlled
entity, such as yourself and ABC Corp., that have
option positions on XYZ. Thus, if you are the Transacting
Entity and you click on this button, doing so will close
all of your XYZ options (except any unvested Executive
Stock Options you may have on XYZ) but will not affect
the XYZ options held by ABC Corp.</p>
                        <br/>

                        <li>CLOSE - Click on the CLOSE button to close the
Advanced Options Trading Stations window and exit
back to the Buy/Sell Menu.</li>
                        <br/>
                    </ul>
                    <br/>

                    <p>You will need to enter 4 items of information for each
option contract you wish to create, as follows:</p>
                    <br/>

                    <ul style="margin-left: 24px;">
                        <li>Enter the letter B or S in the first column, which
will indicate whether you are Buying or Selling short.</li>
                        <br/>

                        <li>Then enter a strike price, at which the option will
be exercisable, in the range of prices specified at
the top of the second column. The price you enter must
be a whole number -- no decimals.</li>
                        <br/>

                        <li>Next, enter the expiration month, in the range specified
at the top of the third column, in the format such as 11/2038
or 03/2029 (or 3/2029)</li>
                        <br/>

                        <li>Finally, enter the number of options (each representing
1% of the shares of the stock of the company whose stock you
are trading) in the fourth column, in the range of 1% to
10% for each option contract you will be creating.</li>
                        <br/>
                    </ul>
                    <br/>

                    <p>Once you have made all the entries for the various puts
or calls (or both) that you wish to have executed, it is
best to first click on the CALC PRICES button, to see
how much cash (net) you will need to expend to purchase
and/or sell all the options you are creating, or, in
some cases, where you are mainly selling options, the
net amount of cash you will generate (receive) from the
multiple transactions. If you do not have sufficient cash,
you will be asked if you want to borrow, assuming you
have enough borrowing power for the trade. Also, if you
have entered an invalid amount or expiration date, you
will be shown where the error occurred so you can correct
it.</p>
                    <br/>

                    <p><strong><u>CAUTION:</u></strong> Because of the complexity of
the option margin rules, be careful of doing very large
value transactions, as the program will not compute the
additional margin requirements before executing the trades.
As long as you have sufficient cash and/or borrowing power,
the trades will all be executed when you click on the SUBMIT
button. As a result, if you are buying a lot (in terms of
cost) of options that have no marginable value, you might
almost immediately receive margin calls, once the positions
are in place, which may force you to sell off some of the
options. Thus, do not try to do complex trades where the
total option values are significant in relation to your
net worth, especially if all or most of the positions are
"long" (purchases) rather than short sales.</p>
                    <br/>

                    <p>(By "no marginable value" we mean that while options you
own are part of your net worth, your stock broker in this
simulation -- as in real life -- computes your net worth
WITHOUT the value of options you own, except to the extent,
if any, the options are in-the-money (have intrinsic value),
in determining whether your (adjusted) net worth is adequate
to prevent you from receiving a margin call. If you do
receive a margin call, it will require you to reduce your
margin loan, either from your existing cash or by selling
some of your options or stocks to raise the cash needed
to meet the margin call.)</p>
                </div>
            </blockquote>
        </div>
        <br/>

        <div id="chap06_VI(C)">
            <h3><strong>C. BUY STOCK BUTTON.</strong></h3>
            <br/>

            <p>This button, used to buy
stock for the currently selected Active Entity (if you control
that entity) or ${helpLink('chap03_III(A)', 'Transacting Entity')}
(if you do not control the current Active Entity), is the same
as the "Buy Stock" button discussed above, which (usually)
appears on the ${helpLink('chap06_VI(B)(1)', 'BUY / SELL Menu')}.</p>
            <br/>

            <p><strong>MANAGING AN ETF:</strong> If the current "Active Entity" is an
Exchange-Traded Fund (ETF) and you control the insurance
company or securities broker that is the advisor to the
ETF, you can manage the investments of the ETF. Thus, you
can direct the ETF to buy stock up to 10% of publicly-traded
companies.</p>
        </div>
        <br/>

        <div id="chap06_VI(D)">
            <h3><strong>D. SELL STOCK BUTTON.</strong></h3>
            <br/>

            <p>This button, used
to sell stock for the currently selected Active Entity (if
you control that entity), is the same as the "Sell Stock"
button discussed above, which (usually) appears on the
${helpLink('chap06_VI(B)(2)', 'BUY / SELL Menu')}.</p>
            <br/>

            <p><strong>MANAGING AN ETF:</strong> If the current "Active Entity" is an
Exchange-Traded Fund (ETF) and you control the insurance
company or securities broker that is the advisor to the
ETF, you can manage the investments of the ETF. Thus, you
can direct the ETF to sell any stock it owns.</p>
        </div>
        <br/>

        <div id="chap07">
            <hr/>
            <h2 align="center"><strong>FINANCING TRANSACTIONS MENU</strong></h2>
            <hr/>
        </div>
    </div>`;
}
