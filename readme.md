MEMORY GAME FOR UDACITY FEND
by pawelp73@gmail.com
VERSION 1.0
12.04.2018

1. The game
The purpose of the game is to reveal 8 pairs of images.
You can reveal 2 images at time. If they match they stay revealed.
If they do not, they are hidden again after a while.
Each of your moves increases move counter.
You should try to finish the game in a least amount of moves possible
as it impacts your final score (one, two or three stars).
The timer (minutes and seconds) is for comparative purposes
and it plays no role in scoring.

2.Files

index.html
readme.txt
/javascript/javasc.js
/css/style.css
/img (images)

3.Game logic (contained in javasc.js file)

1. Generate random order for images.
2. Generate table containing images.
3. Bind relevant data to table cells.
-----listen----
4. Check card validity and number of cards already displayed.
5. Adjust styles and information for revealed cards.
6. Check for victory conditions.
7. Toggle classes back if miss.
8. Update number of moves.







