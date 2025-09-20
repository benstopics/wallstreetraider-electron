

### WIP

Main Menu (Splash screen)
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
[ ] Go through Suggestions/Advice panels and make it to where this updates the Advisory panel depending on which tab you're in

Cheat Menu (secret console command)

| Action | Permission  | UI Idea |
|--------|-------------|---------|

#### LINE BUTTONS IN REPORTS
These need improved to sell specific contract, not just send command to sell for that company
    EXERCISE_CALL_OPTIONS_EARLY | Any entity with in-the-money call options | `Exercise` button at end of call line in *Options* report
    EXERCISE_PUT_OPTIONS_EARLY | Any entity with in-the-money put options | `Exercise` button at end of put line in *Options* report
    SELL_CALLS | All entities (banks and insurers must own stock i.e. covered) | `Sell Calls` button at top of *Options* tab and `Sell` button at end of call line in *Options* report
    SELL_PUTS | All entities (banks and insurers must own stock i.e. covered) | `Sell Puts` button at top of *Options* tab and `Sell` button at end of put line in *Options* report
