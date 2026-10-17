# To do (your side)

Things only you can do in Google / GitHub. Details for every step are in `SETUP-GOOGLE.md`.

## Movie planner

- [ ] **Ratings for watched movies**
  1. Open the "Movie night" spreadsheet, go to the movies tab (the form responses).
  2. In the first empty column to the right (next to **Watched**), type the header **Rating** in row 1.
  3. For a watched movie, type a number **1-5** in its row (8/10 and ★★★★ also work).
  4. Optional: select the Rating column from row 2 down -> **Data -> Data validation** -> "Dropdown" with 1, 2, 3, 4, 5, so you can just pick a number on the phone.
  5. Watched movies then show stars and the header shows the average.
- [ ] **Watched column** (if not done yet): header **Watched** in the movies tab, cells below -> **Insert -> Checkbox**.
- [ ] **Free days tab** (the new tick-your-free-days way): create it as described in `SETUP-GOOGLE.md` -> "Free days tab", then paste the two links into `config.js` (`availabilityCsvUrl`, `availabilitySheetUrl`) or send them to Claude.
  - Pre-fill about 3 months of dates and add more every few months.
  - Optional: evening/afternoon columns, and "Friday"-style rows for days you're usually free.
- [ ] **Share the spreadsheet with her** as **Editor** with "Notify people" **unticked** (keeps the surprise). She needs it to tick free days and watched movies.
- [ ] **Movies form**: make sure the movie question is **Short answer** again (one movie per answer).
- [ ] **Merge the open pull request** (or ask Claude to), wait a few minutes for GitHub Pages, then check the site on your phone:
  tick a free day for both of you -> it shows BOTH FREE, the calendar lights up lime, the banner says NEXT MOVIE NIGHT, and "Lock it in" picks a movie.
- [ ] **Monthly reminder**: send him the link and ask him to tap **Remind me monthly** once.
- [ ] **Hosting**: decide whether the GitHub Pages address is fine or the page should be private (e.g. Cloudflare Pages + Access).

## Birthday surprise

- [ ] Build the birthday experience in Unity (WebGL) and upload it to itch.io (Restricted / password, "mobile friendly", "click to launch fullscreen").
