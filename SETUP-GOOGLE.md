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
5. If there is no column with "watched" in its header, the watched list stays hidden.

## Dates
- Dates that have passed disappear from the site on their own (today's date stays until the day is over). The rows stay in the sheet.
- Upcoming dates are sorted soonest first.
- Entries typed as free text (for example "Fri 14 Nov evening", or older answers from before the question became a Date) cannot be checked, so they always stay visible. Delete those rows in the sheet when they are done.
- Slash dates such as 3/4/2026 are ambiguous. The site works out day-first or month-first from your other dates; if it can't tell, it uses `dateOrder` in `config.js` ('dmy' or 'mdy').

## Notes
- The first column of each tab is the automatic timestamp; the site shows the 2nd column as the title and the others as details, newest first.
- Published sheets and form links are readable by anyone who has the link. Don't put anything private in them.
- New answers show up on the site after about a minute (Google refreshes published sheets on its own).
- To remove an entry, delete its row in the sheet.
