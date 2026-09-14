# CV site

Personal site for Emil Hovhannisyan, built as plain static files for GitHub Pages —
no build step, no dependencies.

One CV, four views of the same content, on one design system:

| View | What it is |
| --- | --- |
| **Timeline** | every role, project and degree as a git history with filterable branches |
| **Map** | the work as a transit network; areas of work are lines, roles and projects are stations |
| **Paper** | a research article with tables, figures computed from the data, and references — this is also what printing gives |
| **Dossier** | a personnel file with case files; confidential clients are redacted |

The view is kept in the URL (`/#map`, `/#paper`…), so a link opens a specific view.

## Languages

English, Armenian, Russian and French, switchable in the header. The choice is remembered and
kept in the link (`/?lang=hy#map`); a first visit follows the browser's language.

- **Content** lives in `content.js`. A text value is either plain — the same in every language
  (names, technologies) — or `{ en, hy, ru, fr }`. Anything missing falls back to English.
- **Interface text** lives in `assets/i18n.js`, the same keys in every language. Where a number
  changes the words, a message holds plural forms chosen by `Intl.PluralRules`
  (`3 конфиденциальных проекта`, `3 missions confidentielles`).
- **Dates, numbers and lists** are formatted per language with `Intl`; Armenian month names are
  built in because browsers often lack them.
- Armenian letters come from Noto Sans / Serif Armenian, which fill in where IBM Plex has none.

A missing key shows up as `⟦key⟧` on the page and as a console warning.

## Themes

Six themes in the header's theme menu, remembered per browser: **Match system** (daylight or
night, following the device), **Daylight**, **Night shift**, **Blueprint**, **Yerevan tuff** and
**High contrast**. A theme only redefines colour tokens in `assets/site.css`, so every view — the
map lines, trains, figures and the stamp included — follows it. Printing always uses daylight
colours.

## Motion

The rising name, the self-drawing git graph, trains on the map (click the depot to send another;
↑↑↓↓←→←→BA for rush hour), the typed dossier and the stamp are off for visitors who ask for
reduced motion, and with `?static` in the URL.

```
index.html        the site
assets/site.css   the design system: tokens, shared components, the four views, print
assets/app.js     renders everything from content.js
content.js        everything the site says: roles, NDA work, training, projects, skills, languages
variants/         the original design drafts, kept for reference
shots/            screenshots
```

## Design system

- **Type:** IBM Plex — Sans for the interface, Serif for long reading, Mono for dates and data.
- **Colour:** neutral ground, navy plate for identity, a red stamp reserved for confidentiality,
  and five domain colours used identically everywhere: web `#e4002b`, data `#0072ce`,
  AI & ML `#00a651`, games & realtime `#f5a300`, apps & systems `#8e44ad`.
- **Confidential work:** a redaction bar plus an `NDA` stamp, the same in every view.

## Editing content

Change `content.js` only. Confidential work sits in `experience` with `kind: 'nda'` and is
described without client names.

## Previewing

Open `index.html` in a browser, or serve the folder (for example `npx serve .`).

## Publishing on GitHub Pages

1. Create a repository named **`emilhovh.github.io`** (the site then lives at
   https://emilhovh.github.io).
2. Push this folder to it.
3. **Settings → Pages → Deploy from a branch**, branch `main`, folder `/ (root)`.
