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
