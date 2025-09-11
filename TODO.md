

### WIP

Main Menu (Splash screen)
    [ ] Save Game (Button)
            Form1_SAVEFILE_Select(0)
    [ ] Check Score/Scoreboard (Button)
            Form1_HISCORE_Select
    [ ] Autosave
            Form1_AUTOSAVE_Select
    [ ] Exercise
            Form1_EXERCISE_Select
    [ ] Sweep
            Form1_SWEEP_Select
    [ ] Make Delivery
            Form1_MAKEDELIVERY_Select
    [ ] Take Delivery
            Form1_TAKEDELIVERY_Select
    [ ] Game Speed (Throttle)
            Form1_THROTTLE_Select
    [ ] Quit
            Form1_EXIT_Select
    [ ] Select Currency
            Form1_CURRENCY_Select
    [ ] Cheat
            Form1_CHEAT_Select
    [ ] Suppress Popups
            Form1_SUPPRESS_Select
    [ ] Suppress Warnings
            Form1_SUPP_WARN_Select
    [ ] Suppress Earnings
            Form1_SUPP_EARN_Select

Dashboard
    [ ] Manage price alerts (for Industrials)
        Create price alert
        Remove price alerts

Reports/Research
    [ ] Look at different industry
    [ ] View current interest rates
    [ ] Who's Ahead
    [ ] Move DB Research tool to Market Report psage
        [ ] Who owns what?
            [ ] List entities with futures positions (long or short)
            [ ] List entities that own physical commodities
            [ ] List entities with interest rate swap derivatives
            [ ] List entities with options positions (long or short)
            [ ] List companies that own stocks in other companies
            [ ] List companies with investment management contracts
        [ ] Economic Data / Market Overview (Panel or Card)
        [ ] Most Cash Report (Button or Link)
        [ ] Largest Market Cap Report (Button or Link)
        [ ] Largest Tax Losses Report (Button or Link)
        [ ] Industry Summary
        [ ] Industry Projections (if not Bank, H/C, or Insurer)
        [ ] Industry growth rates

Cheat Menu (secret console command)

| Action | Permission  | UI Idea |
|--------|-------------|---------|

#### STOCK PROFILE BUTTONS NEXT TO ATTRIBUTES REPORT OR W/E ON SIDEBAR
ELECT_CEO | All companies | `Become CEO` button at the beginning of each company line in *My Corporations* tab if the player is not already a CEO
RESIGN_AS_CEO | Players who are CEOs only | `Resign` button at top of *My Corporations* tab

#### TOP OF COMPANY PROFILE PAGE BUTTONS
SET_ADVISORY_FEE | Any insurer or securities broker that is an ETF advisor | `Set Advisory Fee` button at top of company profile page
ANTITRUST_LAWSUIT | Any company except banks, insurers, and holding companies | `Antitrust Lawsuit` button at top of company profile page
HARRASSING_LAWSUIT | Players or companies | `Harrassing Lawsuit` button at top of the window

#### LINE BUTTONS IN REPORTS
COVER_SHORT_COMMODITY_FUTURES | Any entity with short commodity futures | `Cover` button at end of short commodity futures line in *Commodities* report
COVER_SHORT_CRYPTO_FUTURES | Any entity with short crypto futures | `Cover` button at end of short crypto futures line in *Crypto* report
SELL_SUBSIDIARY_STOCK | Any company that owns stock | `Offer for Sale` button at end of stock line in *Stocks & Bonds* report
EXERCISE_CALL_OPTIONS_EARLY | Any entity with in-the-money call options | `Exercise` button at end of call line in *Options* report
EXERCISE_PUT_OPTIONS_EARLY | Any entity with in-the-money put options | `Exercise` button at end of put line in *Options* report
SELL_CALLS | All entities (banks and insurers must own stock i.e. covered) | `Sell Calls` button at top of *Options* tab and `Sell` button at end of call line in *Options* report
SELL_PUTS | All entities (banks and insurers must own stock i.e. covered) | `Sell Puts` button at top of *Options* tab and `Sell` button at end of put line in *Options* report

#### MISCELLANEOUS BUTTONS
TOGGLE_COMPANY_AUTOPILOT | Any company | `Autopilot` button with red/green dot indicator at top of company profile page


### FINISHED

| Action | Permission  | UI Idea |
|--------|-------------|---------|
SET_DIVIDEND | All companies | `Set Dividend` button at top of the *Cashflow* tab
SET_PRODUCTIVITY | All companies and holding companies | `Set Productivity` button at top of the *Cashflow* tab
SET_GROWTH_RATE | All companies and holding companies | `Set Growth Rate` button at top of the *Cashflow* tab
CHANGE_MANAGERS | All companies | `Change Managers` button at top of *Cashflow* tab
BUY_CORPORATE_ASSETS | Industrials and holding companies only | `Buy Assets` button at top of *Cashflow* tab
SELL_CORPORATE_ASSETS | Companies with assets only | `Sell Assets` button at top of *Cashflow* tab
BUY_CONSUMER_LOANS | Banks only | `Buy Consumer Loans` button at end of Consumer Loans line in *Loans* report
SELL_CONSUMER_LOANS | Banks only | `Sell Consumer Loans` button at end of Consumer Loans line in *Loans* report
BUY_PRIME_MORTGAGES | Banks only | `Buy Prime Mortgages` button at end of Prime Mortgages line in *Loans* report
SELL_PRIME_MORTGAGES | Banks only | `Sell Prime Mortgages` button at end of Prime Mortgages line in *Loans* report
BUY_SUBPRIME_MORTGAGES | Banks only | `Buy Subprime Mortgages` button at end of Subprime Mortgages line in *Loans* report
SELL_SUBPRIME_MORTGAGES | Banks only | `Sell Subprime Mortgages` button at end of Subprime Mortgages line in *Loans* report
SELL_BUSINESS_LOAN | Banks only | `Sell Business Loan` button at the end of each loan line with non-zero loan in *Loans* tab
CALL_IN_LOAN | Banks with loans only | `Call In` button at end of each loan line in *Loans* report
FREEZE_LOAN | Banks with loans only | `Freeze` button at end of each loan line in *Loans* report (`Unfreeze` if loan is frozen)
FREEZE_ALL_LOANS | Banks only | `Freeze All` button at top of *Loans* tab (`Unfreeze All` if any loans are frozen, will need gameState variable)
BUY_BUSINESS_LOANS | Banks only | `Buy Business Loans` button at the top of *Loans* tab
SET_BANK_ALLOCATION | Banks only | `Set Allocation` button at top of *Loans* tab
SELL_LONG_COMMODITY_FUTURES | Any entity with long commodity futures | `Sell` button at end of long commodity futures line in *Commodities* report
SELL_CRYPTO_FUTURES | Any entity with crypto futures | `Sell` button at end of crypto futures line in *Crypto* report
SELL_PHYSICAL_COMMODITY | Any entity with physical commodities | `Sell` button at end of physical commodity line in *Commodities* report
SELL_PHYSICAL_CRYPTO | Any entity with physical crypto | `Sell` button at end of physical crypto line in *Crypto* report
SELL_LONG_GOVT_BOND | Any entity with long government bonds | `Sell` button at end of long bond line in *Stocks & Bonds* report
SELL_SHORT_GOVT_BOND | Any entity with short government bonds | `Sell` button at end of short bond line in *Stocks & Bonds* report
DECREASE_EARNINGS | Any company | `Decrease Earnings` button at top of *Earnings* tab
INCREASE_EARNINGS | Any company | `Increase Earnings` button at top of *Earnings* tab
SELL_CORPORATE_BOND | Any entity with corporate bonds | `Sell` button at end of bond line in *Stocks & Bonds* report
SPIN_OFF | Any company that owns stock in another company (acts like an extraordinary dividend in the form of stock) | `Spin Off` button at end of stock line in *Stocks & Bonds* report
SPLIT_STOCK | Any company | `Split Stock` button at top of *Shareholders* tab
REVERSE_SPLIT_STOCK | Any company | `Reverse Split` button at top of *Shareholders* tab
REDEEM_CORP_BONDS | Any company that has issued bonds | `Redeem Bonds` button at top of *Stocks & Bonds* tab
ISSUE_NEW_CORP_BONDS | Any company | `Issue Bonds` button at top of *Stocks & Bonds* tab
PUBLIC_STOCK_OFFERING | Any company | `Public Offering` button at top of *Shareholders* tab
PRIVATE_STOCK_OFFERING | Any company | `Private Offering` button at top of *Shareholders* tab
CAPITAL_CONTRIBUTION | Any player or company that wholly owns a company | `Capital Contribution` button at top of profile page
STARTUP | Any player or company | `Start Company` button at top of profile page
LBO | Any company | `LBO` button at top of *Shareholders* tab
GREENMAIL | Any company | `Greenmail` button at top of *Shareholders* tab
MERGER | Any company | `Merge` button at top of *Stocks & Bonds* tab
BUY_STOCK | Any entity | `Buy` button under stock chart
SELL_STOCK | Any entity with stock | `Sell` button at end of stock line in *Stocks & Bonds* report
SHORT_STOCK | Players only | `Short` button under stock chart
COVER_SHORT_STOCK | Players with short positions only | `Cover` button at end of short position line in *Stocks & Bonds* report
BUY_LONG_GOVT_BOND | Players, banks, and insurers only | `Buy` button under long bond chart
BUY_SHORT_GOVT_BOND | Players, banks, and insurers only | `Buy` button under short bond chart
BUY_COMMODITY_FUTURES_LONG | All entities except banks (insurers only stock index futures) | `Buy Futures` button under each commodity futures charts under *Commodities* tab
SHORT_COMMODITY_FUTURES | Any entity except banks and insurers | `Short Futures` button under each commodity futures charts under *Commodities* tab
BUY_PHYSICAL_COMMODITY | All entities except banks and insurers | `Buy Physical` button under each commodity futures charts under *Commodities* tab
BUY_CRYPTO_FUTURES_LONG | All entities except banks and insurers | `Buy Futures` button under each crypto futures chart under *Crypto* tab
SHORT_CRYPTO_FUTURES | Any entity except banks and insurers | `Short Futures` button under each crypto futures chart under *Crypto* tab
BUY_PHYSICAL_CRYPTO | All entities except banks and insurers | `Buy` button under each crypto chart under *Crypto* tab
BUY_CRYPTO_FUTURES | All entities except banks and insurers | `Buy Futures` button under each crypto futures chart under *Crypto* tab
BUY_CALLS | All entities (banks and insurers must own stock i.e. covered) | `Buy Calls` button at top of *Options* tab
BUY_PUTS | All entities (banks and insurers must own stock i.e. covered) | `Buy Puts` button at top of *Options* tab
ADVANCE_FUNDS | Players only | `Advance Funds` button at top of *Financials* tab
CALL_IN_ADVANCE | Players who have advanced funds | `Call In Advance` button at top of *Financials* tab
BUY_CORPORATE_BOND | Players, banks, and insurers only | `Buy` button top of *Stocks & Bonds* tab
DATABASE_SEARCH | Players only | `Database Search` button at top window
CHANGE_LAW_FIRM | Player | `Change Law Firm` button at top of the window
SPREAD_RUMORS | Players only | `Spread Rumors` button at top of the window
ADVANCED_OPTIONS_TRADING | All entities (banks and insurers must own stock i.e. covered) | `Advanced Trading Station` button at top of *Options* tab
PREPAY_TAXES | Players only | `Prepay Taxes` button at top of player *Financials* tab
EXTRAORDINARY_DIVIDEND | Any company | `Extraordinary Dividend` button at top of *Financials* tab
TAX_FREE_LIQUIDATION | Any company that wholly owns another company | `Tax-Free Liquidation` button at top of *Financials* tab
TAXABLE_LIQUIDATION | Any company that wholly owns another company | `Taxable Liquidation` button at top of *Financials* tab
BORROW_MONEY | Players, companies, or ETFs whose investment advisor is an insurer or securities broker the player controls | `Borrow Money` button at top of *Financials* tab
REPAY_LOAN | Any entity that has borrowed money | `Repay Loan` button at top of *Financials* tab
INTEREST_RATE_SWAPS | Players and companies | `Interest Rate Swaps` button at top of *Financials* tab
TRADE_TBILLS | Players and companies | `Trade T-Bills` button at top of *Financials* tab
CHANGE_BANK | Any entity | `Change Bank` button at top of *Financials* tab
RESTRUCTURE  | All companies and holding companies | `Restructure` button at top of *Financials* tab
REBRAND | All companies | `Rebrand` button at top of company profile page
BECOME_ETF_ADVISOR | Any insurer or securities broker | `Become ETF Advisor` button at top of company profile page