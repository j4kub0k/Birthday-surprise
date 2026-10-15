// Movie Night Planner settings. Paste your Google links here (see SETUP-GOOGLE.md).
window.PLANNER = {
  // "Send form" -> link icon -> the form's public link
  moviesFormUrl: 'https://forms.gle/Hor4xibK7cZXWb4u6',
  datesFormUrl: 'https://forms.gle/M4Y27TwRvHTfVAcUA',
  // Sheet -> File -> Share -> Publish to web -> pick the tab -> "Comma-separated values (.csv)" -> Publish -> copy link
  moviesCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7egcKE-RwZMf3oVBOfqCdDOk8E344-ux2uZ1tZTLkwp27OhIgkqva6Cz0kOYR5lgOTawkuee1kAcY/pub?gid=232171872&single=true&output=csv',
  datesCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7egcKE-RwZMf3oVBOfqCdDOk8E344-ux2uZ1tZTLkwp27OhIgkqva6Cz0kOYR5lgOTawkuee1kAcY/pub?gid=1440545244&single=true&output=csv',
  // The Google Sheet's own link (open it in the browser and copy the address bar, ends in /edit...).
  // Shows a "Tick watched in the sheet" button under the movie list. Leave empty to hide the button.
  sheetUrl: '',
  // Only used when a slash date like 3/4/2026 is ambiguous: 'dmy' = day first, 'mdy' = month first.
  dateOrder: 'dmy',
};
