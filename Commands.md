LoyaltyBot Commands
===================

````<currency>```` is a placeholder for the name of your channel currency

Currency Requests
=================

####Broadcaster / Moderator Commands

- ````!<currency> on```` - turns on currency requests  
- ````!<currency> off```` - turns off currency requests  
- ````!<currency> off repeat on```` - turns off currency requests with a message that repeats every 3 minutes stating that requests have been disabled  
- ````!<currency> off repeat off```` - turns off repeating disabled requests message  
- ````!<currency> timer <time in seconds>```` - adjusts the bots response time to currency requests  
- ````!<currency> timer <time in seconds> reset on```` - after a currency request is made, any requests after that reset the timer. Example: Request is made, 3 second timer started. Second request is made under 3 seconds, timer resets back to 3 seconds  
- ````!<currency> timer <time in seconds> reset off```` - Removes the reset so that the first request starts the response timer and any requests after have no effect

####Broadcaster / Moderator / Viewer Commands

- ````!<currency>```` - view total <currency>

Add/Remove Currency
===================

####Broadcaster Commands

- ````!<currency> add <amount> <twitch name>```` - add currency to the viewers total  
- ````!<currency> remove <amount> <twitch name>```` - remove currency from the viewers total  
- ````!<currency> push <amount> <twitch name>```` - add a new viewer to the database with the specified currency amount

Raffle
======

####Broadcaster Commands

- ````!<currency> raffle open <price> <amount>```` - start raffle, you can adjust raffle cost and ticket amount (both numbers have to be greater than zero) Default is 10 <currency> / 10 tickets max, only one raffle can be open at a time  
- ````!<currency> raffle close```` - close raffle and deduct <currency>  
- ````!<currency> raffle draw```` - draw next winner  
- ````!<currency> raffle cancel```` - cancels the raffle. viewers cannot purchase more tickets or remove their tickets once the raffle is closed  
- ````!<currency> raffle restore```` - if you accidentally open a raffle instead of drawing this will restore the previous raffle tickets

####Broadcaster / Moderator / Viewer Commands

- ````!ticket <amount>```` - viewers can purchase tickets up to the max amount. will only accept what the viewer can afford and will not take a value less than 0 or greater than the max amount. new requests from the same viewer will overwrite their previous amount  
- ````!ticket 0```` - removes tickets

Auction
=======

####Broadcaster Commands

- ````!<currency> auction open```` - start an auction, only one auction can be open at a time  
- ````!<currency> auction close```` - close the auction  
- ````!<currency> auction draw```` - draw next highest bidder  
- ````!<currency> auction cancel```` - cancel the auction

####Broadcaster / Moderator / Viewer Commands

- ````!bid <amount>```` - viewers can bid only up to their max <currency>. Duplicate bids will not be accepted, bids cannot be lowered/cancelled once placed