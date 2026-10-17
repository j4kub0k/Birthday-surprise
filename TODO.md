# To do (your side)

Things only you can do in Google / GitHub. Details for every step are in `SETUP-GOOGLE.md`.

## Movie planner

- [ ] **Ratings for watched movies**
  1. Open the "Movie night" spreadsheet, go to the movies tab (the form responses).
  2. In the first empty column to the right (next to **Watched**), type the header **Rating** in row 1.
  3. For a watched movie, type a number **1-10** in its row (7.5 and 8/10 also work). The "★ Rate it" button on a watched movie opens the sheet for this.
  4. Optional: select the Rating column from row 2 down -> **Data -> Data validation** -> "Dropdown" with 1 to 10, so you can just pick a number on the phone.
  5. Watched movies then show ★ 8/10 and the header shows the average.
- [ ] **Watched column** (if not done yet): header **Watched** in the movies tab, cells below -> **Insert -> Checkbox**.
- [ ] **Name question in the free-dates form**: open the form -> **+** (add question) -> title **Who is free?** -> type **Checkboxes** -> options **Jakub** and **Adela** (spelled exactly like your sheet columns) -> mark it **Required**. Your Jakub / Adela checkbox columns in the sheet keep working too, for ticking later.
  - In the responses tab, select the Jakub and Adela columns from row 2 down -> **Insert -> Checkbox**, so new rows also get checkboxes.
  - Optional cleanup: delete the empty row 2 (it is harmless).
- [ ] *(Optional, instead of the form)* a separate **Free days** tab, see `SETUP-GOOGLE.md` -> "Free days tab". Not needed if you use the form with the name question.
- [ ] *(Optional)* **Delete past dates automatically** so the sheet never fills up: paste `cleanup-old-dates.gs` into the sheet (Extensions -> Apps Script) and run `installDailyCleanup` once. Steps in `SETUP-GOOGLE.md` -> "Automatic cleanup of past dates".
- [ ] **Share the spreadsheet with her** as **Editor** with "Notify people" **unticked** (keeps the surprise). She needs it to tick free days and watched movies.
- [ ] **Movies form**: make sure the movie question is **Short answer** again (one movie per answer).
- [ ] **Merge the open pull request** (or ask Claude to), wait a few minutes for GitHub Pages, then check the site on your phone:
  tick a free day for both of you -> it shows BOTH FREE, the calendar lights up lime, the banner says NEXT MOVIE NIGHT, and "Lock it in" picks a movie.
- [ ] **Monthly reminder**: send him the link and ask him to tap **Remind me monthly** once.
- [ ] **Hosting**: decide whether the GitHub Pages address is fine or the page should be private (e.g. Cloudflare Pages + Access).

## Birthday surprise

- [ ] Build the birthday experience in Unity (WebGL) and upload it to itch.io (Restricted / password, "mobile friendly", "click to launch fullscreen").
