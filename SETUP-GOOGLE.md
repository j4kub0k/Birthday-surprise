# Google setup for the Movie Night Planner

No server needed: two Google Forms collect entries, one Google Sheet stores them, and the site reads the sheet.

## 1. Movies form
1. Go to forms.google.com and create a form named "Movies".
2. Questions, in this order: **Movie** (short answer, required), **Who suggested it?** (short answer), **Vibe** (short answer or dropdown, optional).
3. Responses tab -> **Link to Sheets** -> create a new spreadsheet, e.g. "Movie night".
4. Send -> link icon -> copy the link into `moviesFormUrl` in `config.js`.

## 2. Dates form
1. Create another form named "Free dates", questions in this order: **Date** (short answer, so you can write "Fri 14 Nov evening"), **Who?** (short answer), **Note** (optional).
2. Responses -> **Link to Sheets** -> choose **Select existing spreadsheet** -> the same "Movie night" sheet (it gets its own tab).
3. Copy its link into `datesFormUrl`.

## 3. Show the lists on the site
For each of the two response tabs in the sheet:
1. File -> Share -> **Publish to web**.
2. Choose that tab (not "Entire document") and **Comma-separated values (.csv)**.
3. Publish, copy the link into `moviesCsvUrl` / `datesCsvUrl`.

## Notes
- The first column of each tab is the automatic timestamp; the site shows the 2nd column as the title and the others as details, newest first.
- Published sheets and form links are readable by anyone who has the link. Don't put anything private in them.
- New answers show up on the site after about a minute (Google refreshes published sheets on its own).
- To remove an entry, delete its row in the sheet.
