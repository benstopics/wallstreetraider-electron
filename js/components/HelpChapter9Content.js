import { html } from '../lib/preact.standalone.module.js';

export default function HelpChapter9Content({ helpLink }) {
    return html`<div>
        <h2 align="center"><strong>CHAPTER IX.</strong></h2>
        <br/>

        <div id="chap09_IX(A)">
            <h3><strong>A. IN GENERAL.</strong></h3>
            <br/>

            <p>Except for borrowing money or making loan repayments, all other transactions in Wall ${'$'}treet Raider, such as buying or selling stock, bonds, or other assets, are done by clicking on one of the six buttons on the "Transactions" grouping of buttons on the main menu screen. Each such transaction selected from the "Transactions" grouping that is completed counts as one of the 5 transactions allowed on a player's turn. Other actions, such as borrowing money or repaying loans, or doing stock splits or corporate name changes, can be done by clicking on the "MISC" button on the main screen and selecting an item such as "Borrow Money" or "Repay Loan" from the pop-up Menu that will appear, but none of those actions count against you as one of your 5 allowed transactions per turn.</p>
            <br/>

            <p>To initiate a transaction, click one of the six "Transactions" buttons: Buy Stock, Sell Stock, Buy/Sell, Financing, Management, or Other Trans., on the main menu screen, and, except when clicking on the Buy Stock or Sell Stock buttons, one of four different Menus will pop up, each listing anywhere from 2 to 13 possible transactions, with a button for each. Then click on the appropriate button to begin the type of transaction you wish to do.</p>
            <br/>

            <p>Note that, while viewing each Transactions pop-up Menu, the Menu screen will have a text-box on the left, describing the allowable functions, and sometimes will include other useful information, such as the current buying power (cash plus line of credit) of the currently selected ${helpLink('chap03_III(A)', 'Transacting Entity')}.</p>
            <br/>

            <p>The various buttons for the different types of transactions will appear in a vertical row on the right side of the pop-up Menu. At the bottom of that dialog screen will be 3 additional buttons: A "Close" button to close the Menu and exit back to the main menu screen; a "Player" button (click it to instantly change the ${helpLink('chap03_III(A)', 'Active Entity')} that is to do the desired transaction to you, the player); and a "My Corps." button, which will let you select a corporate entity you control as the new Active Entity (and ${helpLink('chap03_III(A)', 'Transacting Entity')}), which will perform the transaction(s) you are planning to execute.</p>
            <br/>

            <p>The next segment below describes the various "OTHER TRANS." transactions that you can do if you select the "OTHER TRANS." button.</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)">
            <h3><strong>B. "OTHER TRANS." BUTTON AND MENU.</strong></h3>
            <br/>

            <p>The following transactions, most of which do not fit neatly into any one category, are all called by clicking on the "OTHER TRANS." button on the main screen, which will bring up the "OTHER TRANSACTIONS" pop-up Menu. However, most of the transaction buttons on that Menu might come under the heading of "dirty tricks," other than the "Change Bank" and "Buy or Sell Bank Loans" buttons.</p>
            <br/>

            <p>Each of the "OTHER TRANSACTIONS" Menu command buttons and their functions are described below. Note that several of the buttons listed below will only appear if the ${helpLink('chap03_III(A)', 'Transacting Entity')} is a bank, and some buttons will not appear if the Transacting Entity is a bank you control.</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(1)">
            <h4><strong>1. HARASSING LAWSUIT.</strong></h4>
            <br/>

            <p>If you are feeling particularly mean and aggressive, this "Harassing Lawsuit" command button (which is used to file a nuisance lawsuit) is an ideal way of harassing a competitor's company, by filing a phony lawsuit against them. While both sides in the legal fray will spend about the same amount of money on legal fees and litigation expenses, all of which is utterly wasted, this can be a handy way to crush a small or weak competitor (you choose the amount to be expended, up to ${'$'}500 million U.S.).</p>
            <br/>

            <p>For example, if you control IBM, which may have billions of dollars in the bank, and tens of billions of assets, and another player controls a small but profitable company with only a few hundred million in assets, you could have IBM file a nuisance lawsuit on some flimsy pretext against the other player's company, causing both IBM and the smaller company to spend, say, ${'$'}500 million each in legal fees and expenses.</p>
            <br/>

            <p>While these lawsuit expenses might put a slight nick in IBM's quarterly earnings, it would probably drive your opponent's company into almost immediate bankruptcy, which might also bankrupt your opponent and put him or her out of the game! Not a nice thing to do, but life isn't always fair, and the investment game never is.... Of course, you won't necessarily get away with this rotten conduct -- your company might get hit for substantial damages for filing a malicious, frivolous lawsuit. There are always trade-offs in this simulation, as in the real world, and especially if you have accumulated a lot of bad "kharma," which Wall ${'$'}treet Raider keeps track of when you do slimy (or noble) things....</p>
            <br/>

            <p>One word of advice on filing a phony lawsuit -- use a good law firm (selected on the "${helpLink('chap05_V(B)(3)(d)', 'SETTINGS MENU/Select Law Firm')}" menu item on the main Wall ${'$'}treet Raider menu screen). It will cost you more, but will reduce your chances of being successfully sued for malicious prosecution by your intended victim. In short, if you are going to hire an assassin or intimidator, hire the best!</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(2)">
            <h4><strong>2. SPREAD RUMORS.</strong></h4>
            <br/>

            <p>The "Spread Rumors" command button (which can be used to spread false rumors about an opponent's company) is a form of financial terrorism. This menu item is, shall we say, the last resort of scoundrels. Sounds interesting? We thought so! Use this command if you want to start a "whispering" campaign on Wall Street about a company, preferably a company in which an opposing player has a large investment. The rumors will immediately reduce the target company's stock price, and may even adversely impact its business and profitability, sometimes very severely. Of course, there are sometimes consequences for spreading such scurrilous lies -- including payback by your opponent if you stoop to using such gutter tactics. What goes around, comes around, as the saying goes.... It's the Law of Kharma. And the jungle.</p>
            <br/>

            <p>In fact, using these feature may even trigger a slander or libel lawsuit against you by the victim, if you overuse this nasty tactic, or if you spread rumors even once, if you have built up a lot of "bad kharma" from other nefarious deeds in the current game. Note that you may not use this feature in the last year of the game, which means that if you do resort to this dirty trick, there must be adequate time before the game ends for the offended competitor to sue you for slander, and perhaps win a judgment against you.</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(3)">
            <h4><strong>3. CHANGE BANK.</strong></h4>
            <br/>

            <p>Clicking on this button will allow the currently selected ${helpLink('chap03_III(A)', 'Transacting Entity')} (player or company) to change bank lenders -- but if your current bank is controlled by an opposing player, the change of banks will be allowed only if the borrower has fully paid off any bank loan it may have owed.</p>
            <br/>

            <p>If you (or your company) owe nothing to your current bank lender, you will be able to select any other bank as the new "banking relationship" (bank lender, and bank where you or your company keeps its cash deposits). Thus, even if you or your company owe nothing on a loan at the moment, you may want to change the bank lender to a bank that you control, so when you do borrow, your loan will come from (and give business to) a bank that is under <u>your</u> control. Your company will also move its deposits over to the bank you control, which will give your bank more money to lend out at a profit, since it will not pay any interest on the demand deposits (DD's). Furthermore, if you have solid control of the bank you borrow from, it is thus not as likely to be taken over by an opposing player, who could then use the bank to call in most of your loan, an action which might be a crippling financial blow to you. (See "Call in Bank Loan" button in the next section below.)</p>
            <br/>

            <p>Note that you cannot foist off a bad loan on a bank that is controlled by another player (unless it is a fairly small loan, of under ${'$'}300 million), by changing the borrowing corporation's bank to one that is controlled by another player, sticking his or her bank with the loss when the company goes broke. When you attempt to do so, the other player's bank will refuse to buy your company's loan from the bank that currently holds it.</p>
            <br/>

            <p>If you owe a loan balance, and wish to change banks, you can only do so if the new bank you select has enough cash on hand to buy your loan from your existing bank. The bank can also take into account the additional cash it will receive from the new customer's deposits, which will also be moved to the newly selected bank. (The purchase may be at a price above or below the face value of the loan, depending upon the credit rating of the borrower.)</p>
            <br/>

            <p>Another reason why you might want to change banks is if your current bank is in very shaky financial condition, and likely to go bankrupt, in which case you could lose a large amount of your cash (which is assumed to be deposited in the same bank you borrow from). Thus, you may want to change your banking relationship to one with a bank that has a top-quality credit rating, which is less likely to fail, or else invest your cash in something safer, like short-term government bonds, rather than leaving it in bank deposits.</p>
            <br/>

            <p>Even if you control the new bank to which you wish to move your account, you will not be allowed to do so in all cases. If the size of your deposit is too large, the banking authorities may not allow you to move such a large account (in relation to that bank's total assets) if doing so would be disruptive to the bank's normal business operations, or where the removal of such "hot money" deposits could have a disastrous effect on the bank. Deposits are considered to be too large to transfer if all three of the following conditions are true:</p>
            <br/>

            <ul>
                <li>The cash (deposit amount) is greater than ${'$'}3,000 million (U.S.); and<br/></li>
                <li>The deposit amount is greater than 20% of the "new" bank's total assets; and<br/></li>
                <li>The deposit amount is more than 1.5 times the amount of the loan that will also be transferred to the "new" bank.<br/></li>
            </ul>
            <br/>

            <p><strong><u>NOTE:</u></strong> If the currently selected ${helpLink('chap03_III(A)', 'Transacting Entity')} is a bank, this button will not appear on the menu.</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(4)">
            <h4><strong>4. CALL IN BANK LOAN.</strong></h4>
            <br/>

            <p>The "Call in Bank Loan" command button can be used to create immediate financial discomfort for a competitor, by "calling in" up to half of the loan of another player or company. If you enjoy playing dirty, you will love using this command, although you have to use it in the right circumstances for it to be effective. To use it, you must take control of the bank that is the lender to the particular player or company.</p>
            <br/>

            <p>Then just click on the "Call Bank Loan" button and follow the instructions to either call in part of a player's loan, or that of a company. You can even call in the loan of a company that is not controlled by any player, although calling in any loan may do no good if you do not first "freeze" such a player's or company's line of credit (if any).</p>
            <br/>

            <p>You will be asked, when using this function, if you want to call in 1% to 50% of <u>ALL</u> loans to companies controlled by a particular player, from all banks you control, as part of the same transaction (when you call in part of that player's loan from a bank you control, or call in a loan from any one company that is controlled by an opposing player).</p>
            <br/>

            <p>Note: You cannot call in a loan of a company that maintains a "BBB" or better credit rating.</p>
            <br/>

            <p>When you execute this transaction, your bank will call in a percentage, 1% to 50%, as you specify, of the victim's loan. The targeted player or company will be forced to find some way to raise cash to make the large and unexpected loan principal repayment. As a rule, don't use this tactic unless the opponent (or company) owes considerably more than one times net worth and has very little in the way of cash and bonds.</p>
            <br/>

            <p>Also, be sure to use the "${helpLink('chap09_IX(B)(5)', 'Freeze/Unfreeze Loans')}" command button (see below) to freeze lending to competitors by your bank, before you call in part of a loan -- otherwise, the victim may be able to simply borrow back some of the cash needed to cover the liquidity crisis you are trying to create for that player or company, if you have not cut off his/her/its line of credit by freezing it.</p>
            <br/>

            <p>Note that you cannot call in the loan of a company that has a deficit in net worth, since it is deemed to have filed for bankruptcy protection from creditors. But for a company with a very poor credit rating, such as "C" or "CC," this can be a devastating blow, if the company has little in the way of cash and liquid assets that it can easily sell off.</p>
            <br/>

            <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                <hr />
                <p><strong>LIMITATIONS:</strong> You will not be able to call a loan immediately, in all cases. For instance, once a company's (or player's) credit rating has fallen to "D" (default or "dreadful"), he/she or it is protected from such tactics by the Bankruptcy Court. Similarly, if a company already has an overdrawn bank balance (a cash deficit), and has no readily saleable assets, such as stocks or bonds, you will not be able to call in 50% of its loan immediately, since it has no liquid assets you can seize; you will have to wait until the company liquidates some of its capital assets before you can grab its liquid funds -- this prevents you from making repetitive "calls," one after another, in short succession, where one "call" created a cash deficit for the borrower.</p>
                <br/>
                <p>Also, if a corporation maintains at least a BBB credit rating, you may not call in its loan. A corporate loan may only be called if the borrower's credit rating falls below investment-grade, which is, at a minimum, a BBB credit rating. (However, you can call in a player's loan, no matter how good his or her credit rating is.)</p>
                <hr />
            </blockquote>
            <br/>

            <p>Used in the right situation, where an opponent or his or her company is leveraged to the eyeballs and low on cash, calling in part of a loan can be the <em>coup de grace</em>, leaving the victim with a huge cash deficit that will have to be paid off soon by a forced liquidation of business assets or stocks and bonds. For an opposing player, in particular, it can be enough to trigger the series of margin calls that will expel him or her from the game -- sort of a kick in the pants to the poor devil who is already standing out on the ledge outside a 30th story window, trying to decide whether or not to jump....</p>
            <br/>

            <p>To find out which bank a particular player/opponent borrows from, use the "${helpLink('chap10_X(E)(8)', 'Who\'s Ahead?')}" command button on the "GENERAL" research Menu, which lists each player's debts, assets, and which bank he or she borrows from and has a bank account with. To find out which bank a particular company borrows from, use the "${helpLink('chap10_X(D)(3)', 'Financial Profile')}" command button on the "ENTITY INFO" research Menu. This information appears in the "CREDIT INFO" portion of the corporation's financial profile display.</p>
            <br/>

            <blockquote style="border-left: 4px solid #d9534f; padding-left: 16px; margin: 16px 0; background-color: rgba(217, 83, 79, 0.1);">
                <hr />
                <p><strong>CAUTION:</strong> In the interest of family harmony, we suggest that you never use the "Call in Bank Loan" function against a spouse -- it is simply not worth the years of recriminations and bitterness that are sure to ensue, not to mention possible marriage counseling fees and/or hospital emergency room costs.</p>
                <hr />
            </blockquote>
            <br/>

            <p><strong><u>NOTE:</u></strong> This button only appears on the "OTHER TRANS." Menu if the ${helpLink('chap03_III(A)', 'Transacting Entity')} is a bank or the currently selected ${helpLink('chap03_III(A)', 'Active Entity')} is a bank (which you control).</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(5)">
            <h4><strong>5. FREEZE/UNFREEZE LOANS.</strong></h4>
            <br/>

            <p>The "Freeze/Unfreeze Loans" command button allows you to either "freeze" or "unfreeze" lines of credit to other players or companies who borrow from a bank which you control. Thus, when you "freeze" their credit lines from your bank, the opposing players and companies will have to continue to pay interest and (for companies) amortize the principal of their loans, but will have a ${'$'} 0 (zero) line of credit from your bank, so they won't be able to borrow any more money from your bank, even if they have a AAA credit rating. If you decide your bank could make more money by going ahead and allowing loans to your competitors, and you aren't afraid that the competition will do anything too brilliant with the money they borrow, you may want to "unfreeze" their lines of credit.</p>
            <br/>

            <p>This function is also handy, if you are concerned that one company is borrowing too much from your bank. You can halt any further borrowing by freezing that company's line of credit (even if the company is one you control).</p>
            <br/>

            <p>This command button is essentially an "on / off" toggle switch for freezing or unfreezing lines of credit for players or companies who borrow from your bank. When you click on this button, when a bank you control is the selected ${helpLink('chap03_III(A)', 'Transacting Entity')}, you will be shown a list of players and companies that borrow from your bank (with "FROZ." beside the loan info for any loan that has been frozen). To select a borrower to change the setting from "freeze" to "unfreeze" or vice versa, just double-click on the name of the borrower. An asterisk (*) will appear beside the loan info for a loan to any competing player, or company controlled by another player, that is not currently frozen. This makes it rather easy for you to identify and freeze loans made to opponents' companies.</p>
            <br/>

            <p>When viewing the list of your bank's loans that may be frozen or unfrozen, if you click on the "OK" button or otherwise close that dialog window without selecting a loan for freezing or unfreezing, you will be asked if you wish to freeze/unfreeze <u>all</u> loans to opposing players and to all companies that your bank lends to. However, if you do a universal freeze using this feature, the program will not change the status (frozen or unfrozen) of any company you control. But it you do a universal "unfreeze," all borrowers from your bank will have their lines of credit unfrozen, including companies you control.</p>
            <br/>

            <p>The usual default situation, when you take control of a bank, is that all lines of credit from that bank are "unfrozen." Thus, to freeze your opponents' lines of credit, you now have to take the affirmative step of utilizing the "Freeze/Unfreeze Loans" command button and selecting the entities whose lines of credit you wish to freeze, unless you want to do a "universal" freeze of all loans except to you or your companies. Note, also, that if you lose control of the bank in question, all lines of credit it froze will soon be UNfrozen.</p>
            <br/>

            <p>Your own line of credit, or that of a company you control, may be temporarily frozen, and rapid repayment required, even if you control the lending bank, in some cases. This can occur if the government Bank Examiners find that you (or your company) have borrowed an amount that exceeds 25% of the bank's business loan portfolio, and also exceeds ${'$'}10 billion U.S. In that case, your line of credit (or that of your company, if it is the borrower) will be frozen, and rapid, large principal repayments will be required, until the loan is either reduced to ${'$'}10 billion, or no longer exceeds 25% of the bank's total business loans.</p>
            <br/>

            <p><strong><u>NOTE:</u></strong> This button only appears on the "OTHER TRANS." Menu if the currently selected ${helpLink('chap03_III(A)', 'Transacting Entity')} is a bank (which you control -- not necessarily the current "Active Entity," if the Active Entity is a company you do not control).</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(6)">
            <h4><strong>6. BUY OR SELL BANK LOANS.</strong></h4>
            <br/>

            <p>Clicking on this button will allow the ${helpLink('chap03_III(A)', 'Active Entity')} (if it is a bank that you control) or ${helpLink('chap03_III(A)', 'Transacting Entity')} (if it is a bank) to buy or sell various types of loans, and will bring up the small with 8 options, shown below:</p>
            <br/>

            <p>The main use of this transaction button is to enable your bank to utilize any uninvested cash it may have on hand to buy more loans, on which it can earn interest, or to sell off loans for various reasons, such as to raise cash, or get rid of risky loans. You are given the choice of buying or selling four types of loans:</p>
            <br/>

            <ul>
                <li>Business loans. (Your bank can buy corporate loans, from some other bank, or you can sell either player or corporate loans if another bank can be found as a buyer, to purchase the loan from your bank);<br/></li>
                <li>Consumer loans. (Your bank can buy or sell a specific dollar amount of such loans);<br/></li>
                <li>"Prime" mortgage loans. (Your bank can buy or sell a specific dollar amount of such loans, which are very high quality, but pay relatively low interest); or<br/></li>
                <li>"Subprime" mortgage loans. (Your bank can buy or sell a specific dollar amount of these risky, but high-yield mortage loan securities. Insurance companies can also buy or sell subprime mortgage securities, but must use button commands on the Other Trans. Menu, which only appear when the ${helpLink('chap03_III(A)', 'Transacting Entity')} is an insurance company that you control.)<br/></li>
            </ul>
            <br/>

            <p>If you choose to buy a corporate loan, you can enter the amount (limited to your bank's cash on hand) that you want to spend to buy such a loan, and the program will search the loan portfolios of other banks until it finds (usually) a suitable loan, which will generally be for an amount as close to as possible, but less than, the amount you entered. Thus, if you enter ${'$'}5000 million as the amount you want the bank to spend to buy a business (corporate) loan, a search might find a loan from ABC Bank to XYZ Corporation in the amount of ${'$'}4700 million, and will purchase that loan for your bank from ABC Bank. However, any such purchase will generally be of a loan that is no larger than about 35% of your total loan portfolio.</p>
            <br/>

            <p>The purchase price for such business loans is usually at or near face value, but will occasionally be at a large discount of 35% to 80% below face value for a more risky D-rated loan. the price will be at a slight premium for a loan from a company with a very good credit rating (BBB or better).</p>
            <br/>

            <p>You may also choose to buy a specific corporate loan, from a list of all corporate loans that are being offered for sale (that your bank can afford to buy) by banks other than those controlled by other players. Certain loans will not be listed as available for purchase, such as loans held by certain small banks or banks holding only a few corporate loans. The loans of other players also are not available to be purchased by your bank with this feature, except when you are playing at the highest difficulty levels (Difficulty Level 3 or 4), and then only if no competing player controls the bank that currently holds the player's loan. If you are playing at Difficulty Level 1, your bank will not be allowed to purchase loans owed by companies controlled by other players, even if no competing player controls the bank that holds such loans. However, at Difficulty Levels 2 or higher your bank can buy loans of companies controlled by other players, as long as the selling bank is not controlled by a player. <em><strong>In other words, the higher the Difficulty Level chosen for a game, the more ruthless players who control banks can be in buying up opponents' loans and then freezing or calling in their loans.</strong></em></p>
            <br/>

            <p>If you choose to sell business loans (loans to players or corporations), you will see a list of all such loans currently held by your bank, with a selling price for each, determined in the same way as described above, when selecting a loan to buy. However, when your bank is the seller, the offering price will never be greater than 101% of face value of the loan. Also, it will not always be possible to find a buyer for some loans that are "D-rated," if there is a high likelihood that the borrower will soon have to go through bankruptcy.</p>
            <br/>

            <p><strong><u>NOTE:</u></strong> This button only appears on the "OTHER TRANS." Menu if the currently selected ${helpLink('chap03_III(A)', 'Active Entity')} is a bank (which you control) or, if you do not control the Active Entity, is the ${helpLink('chap03_III(A)', 'Transacting Entity')}.</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(7)">
            <h4><strong>7. EXERCISE CALL OPTION.</strong></h4>
            <br/>

            <p>Clicking on this button will allow you to do an early exercise of a call option you own, or that your controlled company owns, if the option is currently "in-the-money." (That is, the price of the underlying stock is above the strike price.) You may do an early exercise of an option (before its expiration date) even if your current setting for exercising options is "No" (off). However, the various exceptions to exercising call options at the time of expiration also will apply to an early exercise (such as not being able to obtain control of a company by exercising the option, if that would violate antitrust rules, not having enough cash and line of credit to purchase the stock, etc.).</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(8)">
            <h4><strong>8. EXERCISE PUT OPTION.</strong></h4>
            <br/>

            <p>Clicking on this button will allow you to do an early exercise of a put you own or your controlled company (the ${helpLink('chap03_III(A)', 'Transacting Entity')}) owns, if the option is currently "in-the-money." (That is, the price of the underlying stock is below the strike price.) You may do an early exercise of a put option (before its expiration date) even if your current setting for exercising options is "No" (off). However, you can only exercise a put option to the extent you own the underlying stock that you will be selling by exercise of the put.</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(9)">
            <h4><strong>9. DECREASE EARNINGS.</strong></h4>
            <br/>

            <p>Click on this button to add to a "Reserve for Contingencies" account, in order to "smooth out" and manipulate the earnings of a company you control. For example, if you expect your company's earnings in the current quarter to rise 25% over the same quarter in the past year, you may want to "hide" some of those earnings in this reserve account (non-cash), since you realize it may be hard to match that level of earnings in the future, which could cause a big drop in the stock when the earnings growth falters. The weak justification (to the company's auditors) for setting up this reserve is to anticipate all manner of future liabilities, such as litigation, product liability, warranty reserves, potential environmental liability, or deferred tax liabilities.</p>
            <br/>

            <p>Thus, you might bury 5% of the current quarterly earnings (as projected) in the reserve, so that the current quarter only shows an increase of 20% or so over the prior year period, instead of the (actual) 25% increase. At some later date, when earnings are in danger of no longer increasing, you could take some or all of that reserve out of the account (using the "Increase Earnings" command button), in order to create the appearance that earnings are still rising every quarter, so as to keep the stock price aloft. These additions to or withdrawals from the reserve are not cash transactions, but are merely accounting adjustments. (Note: Additions to the reserve have no tax effect, as they are not deductible, except in the case of a bank -- see next paragraph. Similarly, withdrawals from this account are not taxable.)</p>
            <br/>

            <p>If the company which you are control is a bank, it will not maintain a Reserve for Contingencies account. Instead, this adjustment will simply be an addition to the bank's bad debt reserve, which will depress this quarter's (pre-tax) earnings by the amount you are adding to the bad debt reserve, but will have the good effect of reducing future (required) additions to the bad debt reserve. Additions to the bad debt reserve ARE tax-deductible.</p>
            <br/>

            <p>The amount you can add to the Reserve for Contingencies account for any one quarter by using this button is limited to 5% of the company's projected after-tax quarterly profits, or 10% of any projected loss (not counting "extraordinary items" in either case). In the case of a bank, the amount that can be added to its bad debt reserve can be much larger, up to 1% of the value of its loan portfolio. However, a bank's addition to its bad debt reserve is a PRE-tax expense.</p>
            <br/>

            <p>Companies not controlled by a (human) player will also add to or draw from their own contingency reserves under certain conditions. For example, companies that have antitrust lawsuits pending against them will make substantial additions to their contingency reserves, roughly equal to the estimated legal costs of defending such lawsuits, and companies with environmental liabilities, such as "Superfund" clean-up costs or asbestos claims liability, may also set up contingency reserves before those costs are actually incurred, for the estimated near-term costs.</p>
            <br/>

            <p><strong><u>NOTE:</u></strong> Additions to the Reserve for Contingencies, although they are for hypothetical estimated future expenses, nevertheless create a balance sheet liability and thus can lower your company's credit rating and reduce its line of credit. However, a smart investor will realize that this is a "phony" liability and one that can quickly be extinguished, painlessly.</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(10)">
            <h4><strong>10. INCREASE EARNINGS.</strong></h4>
            <br/>

            <p>Click on this button if it appears in order to give an artificial boost to your company's earnings for the current quarter. (It only appears for a company which you control and only if the company has some amount in a "Reserve for Contingencies" on its balance sheet.) Use this button if your company's earnings are faltering, and you want to continue to show improved earnings for the coming quarter. This function allows you to take out part or all of the amount in this account and add it to net income for the company at the end of the current quarter. The amount added increases net income dollar-for-dollar, since the additions to or withdrawals from this reserve account are not taxable transactions. Reducing or zeroing out this liability account may also improve your company's balance sheet and credit rating, as well as increasing its bank line of credit.</p>
            <br/>

            <p>Companies that are not controlled by you will also occasionally build up a Reserve for Contingencies and draw upon it to "smooth out" earnings fluctuations. You may find a company with such a large reserve to be an attractive takeover target, after which you could draw down or eliminate the reserve in order to improve the reported profits and credit rating of the company.</p>
            <br/>

            <p>Once a company's net worth drops below zero, the program will automatically schedule a complete elimination of any balance in the Reserve for Contingencies account, which will flow back into reported income at the end of the quarter for that company, improving its balance sheet and net worth. This will happen automatically, even if the company is controlled by a player.</p>
            <br/>

            <p>This button will never appear where the ${helpLink('chap03_III(A)', 'Transacting Entity')} is a bank, since banks do not have a Reserve for Contingencies account in W${'$'}R -- but they do have a reserve for bad debts that is required to be maintained at certain minimum levels by the national banking regulatory authorities. Making discretionary withdrawals from the bad debt reserve is not allowed.</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(11)">
            <h4><strong>11. INTEREST RATE SWAPS.</strong></h4>
            <br/>

            <p>Click on this button to create, view, or cancel an interest rate "swap" derivative contract. You can draw up terms you desire for one of these derivative contracts, which are "bets" on the direction of interest rates. The screen that pops up when you click on this button has places where you can enter the desired terms and whether you want to be the "long" or the "short" party. There are also buttons at the bottom of this dialog screen that will let you make your offer of terms, view and analyze any existing swaps you are a party to, or list the contracts and select one to terminate by making a termination payment.</p>
            <br/>

            <p>Players or companies with a credit rating of "B" or better and a net worth of at least ${'$'}1 billion U.S. (or the equivalent in another currency) may enter into interest rate swap agreements with a counterparty, if one can be found. The counterparty to the contract will generally be a bank, brokerage firm, or an insurance company. Think of the counterparty as the "bookie," while you or your company are the bettor. (The "sucker," generally.) A counterparty must also have a credit rating of "BBB" or better and a net worth of at least ${'$'}1 billion U.S. (or the equivalent in another currency).</p>
            <br/>

            <p>The "long" party to such a swap agrees to receive a fixed rate of interest from the other party for an agreed period of time, for up five years into the future. Thus, if you are betting on a change in the interest rate on long- or short-term government bonds, you are in effect betting that the price of the bond will be rising, if you are "long" on the swap contract - meaning that you are betting that that interest rate will be declining.</p>
            <br/>

            <p>The "short" party will, in exchange, receive a variable rate of interest of the type chosen, which can be the banks' Prime Rate, or the yield-to-maturity rate on either the long government bond or the short-term government bond.</p>
            <br/>

            <p>The varying rate is computed at the end of each quarter and is compared to the fixed rate that is to be received by the "long" party to the swap. If the fixed rate is higher, the net interest rate differential, as a percentage of the notional principal amount of the contract, is paid to the "long" party. If the varying rate is higher than the fixed rate, the "long" party pays the difference to the "short" party. Interest is calculated on an agreed "notional" principal amount, which you specify when you draw up the proposed contract and put it out to bid.</p>
            <br/>

            <p>As an example, if you are the "long" party, betting an interest rate will fall, and you are receiving the fixed rate of 11% when that rate has fallen to 9% at the end of a quarter, you will receive a payment equal to an annual rate of 2% (1/2 of 1% for that quarter), multiplied times the notional principal amount of the swap agreement.</p>
            <br/>

            <p>No money changes hands when a swap agreement is entered into. Instead, one party pays the other party the interest rate differential at the end of each calendar quarter. Thus, in effect, if the contract is based on the Prime Rate, the "long" party is betting that the Prime Rate will fall, while the "short" party is betting the Prime Rate will rise. Similarly, if the "bet" is on one of the government bond rates, the "long" party is betting that interest rate will fall (usually because the price of the bond is rising) and vice versa in the case of the "short" party.</p>
            <br/>

            <p><u><strong>NOTE:</strong></u> If the "bet" you are making is on the long-term government bond interest rate, and the short-term bond will mature before the contract expires (at which time the long-term bond becomes the new short-term bond, paying the same coupon interest rate), the subject interest rate will become that of the "new" short-term bond once the "old" short-term bond has expired. (At that time, a new 20-year long-term bond comes into existence.) Also, you cannot create an interest rate swap on the short-term bond unless the swap contract expires before the short-term bond matures.</p>
            <br/>

            <blockquote style="border-left: 4px solid #0d5473; padding-left: 16px; margin: 16px 0; background-color: rgba(13, 84, 115, 0.1);">
                <hr />
                <p><strong>PLANNING POINT:</strong></p>
                <p>Note that, all other things being equal, the interest rate on the short-term bond will steadily decrease as it approaches its maturity date, in the last five years before the short-term bond matures.</p>
                <hr />
            </blockquote>
            <br/>

            <p>Since you will be dealing with financial "sharks" (brokers and banks, usually), you will seldom be able to enter into a swap agreement where you actually receive the current Prime Rate as the "fixed rate," if you are the long party (or the current Long Bond or Short Bond Rate, if the swap is based on either of those current rates). For example, if you want to be "long" on a Prime Rate swap when the Prime is 9%, a bank or brokerage house may only offer to pay you 8.5% as the fixed rate, not 9% -- "Take it or leave it."</p>
            <br/>

            <p>Or, if you want to be the "short" party on a Prime Rate swap when the Prime Rate is 9%, you might have to agree to pay a fixed rate of 9.75% if you want a counterparty to take your "bet" that the Prime Rate will increase. However, in some rare cases, a counterparty will accept your offer without making a counter-offer. (Usually because you appear to be making a pretty dumb bet.)</p>
            <br/>

            <p>Note, however, that if your controlled bank, insurer or securities broker initiates a swap transaction, it will get a better offer than you or one of your other companies would be offered from the counterparty bank, broker, or insurer. Your bank, broker, or insurer will still be offered a somewhat unfavorable rate, but your bank, for example, will only take a "haircut" that is ½ as bad as you or one of your industrial companies would have to take to do a swap deal. For example, if you are going "long" on the Prime Rate when it is 10%, the counterparty might only offer to pay you (the player) or one of your industrial companies a fixed rate of 9%. However, in the same situation, if it is your bank seeking to do a swap, the counterparty might offer it a 9.5% fixed rate instead of only 9%.</p>
            <br/>

            <p>To create a contract, you must do the following:</p>
            <br/>

            <ul>
                <li>First, select an interest rate on which it will be based (Prime, Long Bond, or Short Bond Rate);<br/></li>
                <li>Choose whether you want the "long" side of the contract or the "short" side;<br/></li>
                <li>Enter a notional principal amount (which can't be more than 100 times your (or your company's) net worth, or 500,000 million of the currency in which you are playing (500,000 billion, for some currencies), whichever is less;<br/></li>
                <li>The size of contract you may enter into may be further limited it it would increase you net long or net short total of swaps to an amount greater than 500 times your net worth, or if the trading entity is a company, to an amount no greater that 100 times its net worth if playing at Difficulty Level 1 (200 times net worth at Level 2, or 300 times net worth at Levels 3 or 4); and<br/></li>
                <li>Finally, you must select the year and quarter in which the swap will begin and end, starting no sooner than the next quarter and ending no later than 5 years after the next quarter. A swap cannot begin until the next calendar quarter, although it can begin at a later date, up to 5 years in the future.<br/></li>
            </ul>
            <br/>

            <p>Once you have entered your desired terms, click on the "OFFER" button to attempt to find a counterparty. If one is found, it may accept your terms, but will usually make a counter-offer at a fixed rate that is usually lower (if you are "long") or that is higher (if you are the "short" party) than the current rate.</p>
            <br/>

            <p>You can either accept a counter-offer, or reject it, if you feel it is too unfair. (Don't expect any charity, when dealing with the likes of a Goldman Sachs or a J.P. Morgan.)</p>
            <br/>

            <p>There are 3 ways a swap contract, once entered into, can terminate:</p>
            <br/>

            <ol>
                <li>By its terms, when it expires;<br/></li>
                <li>Automatically, if either party goes bankrupt (Chapter 11 or total bankruptcy), or if a corporate party becomes insolvent (negative net worth); or<br/></li>
                <li>When you choose an early termination.<br/></li>
            </ol>
            <br/>

            <p>Note that you can choose to terminate a swap contract, but to do so you must pay the counterparty a termination fee, an amount equal to at least a half-year's interest rate differential at the rates then in effect, if the rate differential is currently unfavorable to you. (If the current rate differential is favorable to you, you probably would not want to terminate the contract!) However, in any case the termination fee will rarely be less than 0.5% of the notional principal amount the contract is based upon (or from 1% to as much as 3% if the contract has more than one year left to run). The longer the remaining term of the contract, the higher the termination fee, and the longer its beginning date is deferred, the higher the termination fee.</p>
            <br/>

            <p>In the real investment world, the terms of the swap agreements that a company has entered into are usually kept secret, with very little disclosure in financial statements. Similarly, in Wall ${'$'}treet Raider, only a short footnote will appear in a company's Financial Profile, disclosing the total "notional amount" of all such swaps contracts a company has entered into, if any, so you will have no clue as to whether the company is "long" or "short" in such contracts, or whether the swaps are likely to be profitable or disastrous for the company. However, you may view all existing swaps contracts by "looking under the hood," using the "Who Owns What?" button on the General Research Menu.</p>
            <br/>

            <p>Occasionally, you may see a news item or a brief sentence in a Research Report on a company, stating that it is generating large profits or losses on interest rate swaps. You can get a rude surprise when an otherwise profitable company in whose stock you have invested suddenly reports that it is incurring huge losses on interest rate swaps, which may go on for years in some cases.</p>
            <br/>

            <p>Paying attention to that kind of information can be very profitable in itself. For example, if a company you control has a highly profitable swap agreement in place, you may want to consider selling short (or buying puts on) the stock of the counterparty, which you will know is likely to incur some very large losses under the swap agreement, for as long as it remains in effect.</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(12)">
            <h4><strong>12. FOR SALE ITEMS.</strong></h4>
            <br/>

            <p>Clicking on this button will display a list of stocks and business assets that are being offered for sale by players or companies. Stocks that are offered may be purchased (without a commission) from the seller at 95% of the current market price at the time you accept the offer. Business assets may be purchased (also without a commission) from the selling company at 95% of the seller's cost, as shown on its balance sheet. Items are generally offered for sale when the seller is having cash flow problems and has no line of credit to borrow on. Click on any item on the list if you wish to accept the offer to sell.</p>
            <br/>

            <p>If you accept an offer, you may choose to either buy all of the stock or assets offered, or only a portion. If, for example, another player is offering 100% of XYZ Corp. for sale, and you choose to buy only 51%, the rest of the offer (for the other 49% of XYZ) will remain in effect until its expiration date.</p>
            <br/>

            <p>Offers to sell corporate business assets may only be accepted by a company in the same industry group or by a holding/trading company. Offers to sell stock can generally be accepted by any player or company that has enough cash and/or credit to make the purchase, except that a company cannot buy back its own stock from a shareholder who offers it for sale, but instead can only do so by making a "greenmail" buyback offer, using the "Greenmail" button on the "BUY / SELL" menu. Some other restrictions on stock purchases may also apply that would apply otherwise in any attempt to buy a stock, such as when there are anti-trust restrictions, or if a bank is not allowed to invest more of its capital in more stock holdings.</p>
            <br/>

            <p>If you wish to cancel an offer of stock or assets that you or a company you control have listed for sale, find the offer on this list and click on it, and you will be asked if you wish to cancel the offer and remove it from the list of items for sale. Otherwise, an offer will remain in effect until it is either accepted in full or expires at the end of a calendar quarter.</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(13)">
            <h4><strong>13. BUY SUBPRIME MORTGAGES.</strong></h4>
            <br/>

            <p>This button appears on the Other Trans. Menu when the ${helpLink('chap03_III(A)', 'Active Entity')} (controlled by you) is an insurance company. Click on this button to buy "subprime" mortgage securities, which pay a very high interest rate, but are backed by very low-quality "subprime" mortgages, when tend to become nearly worthless at times, in a bad economy.</p>
            <br/>
        </div>
        <br/>

        <div id="chap09_IX(B)(14)">
            <h4><strong>14. SELL SUBPRIME MORTGAGES.</strong></h4>
            <br/>

            <p>This button appears on the Other Trans. Menu when the ${helpLink('chap03_III(A)', 'Active Entity')} (controlled by you) is an insurance company. Click on this button to sell "subprime" mortgage securities owned by an insurance company you control.</p>
            <br/>
        </div>
        <br/>
    </div>`;
}
