# Google setup for the Movie Night Planner

No server needed: two Google Forms collect entries, one Google Sheet stores them, and the site reads the sheet.

## 1. Movies form
1. Go to forms.google.com and create a form named "Movies".
2. Questions, in this order: **Movie** (short answer, required), **Who suggested it?** (short answer), **Vibe** (short answer or dropdown, optional).
3. Responses tab -> **Link to Sheets** -> create a new spreadsheet, e.g. "Movie night".
4. Send -> link icon -> copy the link into `moviesFormUrl` in `config.js`.

## 2. Dates form
1. Create another form named "Free dates", questions in this order: **Date** (question type **Date**, so the site can sort the dates and hide the ones that have passed), **Who?** (short answer), **Note** (optional).
2. Responses -> **Link to Sheets** -> choose **Select existing spreadsheet** -> the same "Movie night" sheet (it gets its own tab).
3. Copy its link into `datesFormUrl`.

## 3. Show the lists on the site
For each of the two response tabs in the sheet:
1. File -> Share -> **Publish to web**.
2. Choose that tab (not "Entire document") and **Comma-separated values (.csv)**.
3. Publish, copy the link into `moviesCsvUrl` / `datesCsvUrl`.

## 4. Watched movies (optional)
1. Open the response tab for the **Movies** form in the Google Sheet.
2. In the first empty column to the right of the answers, type the header **Watched**.
3. Select the cells below it (for example D2:D1000) and choose **Insert -> Checkbox**.
4. Tick a movie's box when you have watched it. The site moves it to "Already watched".
5. Paste the sheet's normal link (the address bar while it is open, `https://docs.google.com/spreadsheets/d/.../edit`) into `sheetUrl` in `config.js`. The site then shows a "Tick watched in the sheet" button that opens it. The person must be allowed to edit the sheet (Share -> add her email, or "anyone with the link can edit", which means anyone with the link can change it).
6. If there is no column with "watched" in its header, the watched list stays hidden.

## Dates
- Dates that have passed disappear from the site on their own (today's date stays until the day is over). The rows stay in the sheet.
- Upcoming dates are sorted soonest first, and each has **Add to calendar** (downloads a calendar file with alerts at 18:00 the evening before and 09:00 on the day) and **Google** (opens Google Calendar with the event filled in) buttons. The event title can be changed with `eventTitle` in `config.js`.
- Entries typed as free text (for example "Fri 14 Nov evening", or older answers from before the question became a Date) cannot be checked, so they always stay visible. Delete those rows in the sheet when they are done.
- Slash dates such as 3/4/2026 are ambiguous. The site works out day-first or month-first from your other dates; if it can't tell, it uses `dateOrder` in `config.js` ('dmy' or 'mdy').

## Monthly reminder
- The page has a **Remind me monthly** button (and a **Google** one). It adds a repeating calendar event, "Plan a movie night", on the first Saturday of every month at 17:00, with an alert and a link back to the site. The first one is next month (or this month if the first Saturday is still more than a day away).
- It only works if the person taps it once. After that, his own calendar keeps reminding him.
- Change the title with `reminderTitle` and the link with `siteUrl` in `config.js`. The day and time are in `planner.js` (search for `BYDAY=1SA`).

## Finding when you're both free
- Give the **Free dates** form a second question **Who?** (Multiple choice with your two names is best, so the spelling always matches). The site then merges the same date from both of you into one showtime marked **BOTH FREE**, sorts those first, lights them up in the **Who's free** board (next five weeks, a coloured dot per person), and the header banner shows the next movie night.
- If only one of you has picked a date, the banner shows it with "only <name> so far" and an "I'm free too" button.
- Without a Who question everything still works, it just can't tell who is free.

## Ratings and stats
- In the movies tab, add a column named **Rating** next to Watched and type 1-5 (8/10 and stars like ★★★★ work too). Watched movies show the stars, and the header shows "N watched together · N waiting · N both-free dates · avg ★".
- Every movie has a **ČSFD** button that searches for it on csfd.cz.

## Notes
- The first column of each tab is the automatic timestamp; the site shows the 2nd column as the title and the others as details, newest first.
- Published sheets and form links are readable by anyone who has the link. Don't put anything private in them.
- New answers show up on the site after about a minute (Google refreshes published sheets on its own).
- To remove an entry, delete its row in the sheet.
