;(() => {
  const cv = window.CV
  const { month, range, esc } = window.CVfmt

  // references: every project with a repository, numbered in order of appearance
  const refs = cv.projects.filter((p) => p.url)
  const refNo = (id) => refs.findIndex((p) => p.id === id) + 1

  // Figure 1 data: how often each technology appears across real work and projects
  const counts = new Map()
  for (const entry of [...cv.experience, ...cv.projects]) {
    for (const tech of entry.stack) counts.set(tech, (counts.get(tech) ?? 0) + 1)
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12)

  function figure1() {
    const rowH = 24
    const left = 150
    const width = 640
    const height = top.length * rowH + 34
    const max = Math.max(...top.map(([, n]) => n))
    const x = (n) => left + (n / max) * (width - left - 30)
    const ticks = Array.from({ length: max + 1 }, (_, i) => i)
    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Technologies by number of projects and roles using them">
        <g class="axis">
          ${ticks.map((t) => `<line class="tick" x1="${x(t)}" y1="0" x2="${x(t)}" y2="${height - 24}"/><text x="${x(t)}" y="${height - 8}" text-anchor="middle">${t}</text>`).join('')}
        </g>
        ${top
          .map(
            ([tech, n], i) => `
          <text class="label" x="${left - 10}" y="${i * rowH + 16}" text-anchor="end">${esc(tech)}</text>
          <line class="stem" x1="${x(0)}" y1="${i * rowH + 12}" x2="${x(n)}" y2="${i * rowH + 12}"/>
          <circle class="bar-a" cx="${x(n)}" cy="${i * rowH + 12}" r="5"/>`,
          )
          .join('')}
      </svg>`
  }

  // Figure 2: a timeline of roles (bars) and projects (points)
  function figure2() {
    const width = 640
    const left = 150
    const from = new Date(2022, 7).getTime()
    const to = new Date(2026, 11).getTime()
    const x = (ym) => {
      const [y, m] = (ym ?? '2026-09').split('-').map(Number)
      return left + ((new Date(y, m - 1).getTime() - from) / (to - from)) * (width - left - 16)
    }
    const rows = [
      { label: 'Education', items: cv.education.map((e) => ({ start: e.start, end: e.end })), cls: 'bar-c' },
      { label: 'Agency role', items: cv.experience.filter((e) => e.kind === 'work').map((e) => ({ start: e.start, end: e.end })), cls: 'bar-a' },
      { label: 'NDA work', items: cv.experience.filter((e) => e.kind === 'nda').map((e) => ({ start: e.start, end: e.end })), cls: 'bar-b' },
      { label: 'Projects', points: cv.projects.map((p) => p.date), cls: 'bar-a' },
    ]
    const rowH = 30
    const height = rows.length * rowH + 30
    const years = [2023, 2024, 2025, 2026]
    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Timeline of education, roles and projects from 2022 to 2026">
        <g class="axis">
          ${years.map((y) => `<line class="tick" x1="${x(`${y}-01`)}" y1="0" x2="${x(`${y}-01`)}" y2="${height - 24}"/><text x="${x(`${y}-01`)}" y="${height - 8}" text-anchor="middle">${y}</text>`).join('')}
        </g>
        ${rows
          .map((row, i) => {
            const y = i * rowH + 8
            const bars = (row.items ?? [])
              .map((it) => `<rect class="${row.cls}" x="${x(it.start)}" y="${y + 3}" width="${Math.max(4, x(it.end) - x(it.start))}" height="12" rx="2" opacity="0.85"/>`)
              .join('')
            const dots = (row.points ?? []).map((d) => `<circle class="${row.cls}" cx="${x(d)}" cy="${y + 9}" r="5" fill-opacity="0.8"/>`).join('')
            return `<text class="label" x="${left - 10}" y="${y + 13}" text-anchor="end">${row.label}</text>${bars}${dots}`
          })
          .join('')}
      </svg>`
  }

  const ndaMark = '<sup><a href="#fn-nda" aria-label="Footnote: non-disclosure">†</a></sup>'

  const experienceRows = cv.experience
    .map(
      (e) => `
      <tr>
        <td class="when">${range(e.start, e.end)}</td>
        <td><b>${esc(e.title)}</b>${e.kind === 'nda' ? ndaMark : ''}<small>${e.orgUrl ? `<a href="${e.orgUrl}" rel="noopener">${esc(e.org)}</a>` : esc(e.org)}</small></td>
        <td>${esc(e.points[0])}${e.points.length > 1 ? `; ${esc(e.points.slice(1).join('; ').toLowerCase())}` : ''}.<small>${esc(e.stack.join(', '))}</small></td>
      </tr>`,
    )
    .join('')

  const projectSections = cv.projects
    .map(
      (p, i) => `
      <h3><span>3.${i + 1}</span>${esc(p.name)}</h3>
      <p><i>${esc(p.tagline)}.</i> ${esc(p.text)} Built with ${esc(p.stack.join(', '))}.${p.url ? ` <sup><a href="#ref-${p.id}">[${refNo(p.id)}]</a></sup>` : ''}</p>`,
    )
    .join('')

  document.getElementById('app').innerHTML = `
    <article class="page">
      <div class="running" aria-hidden="true"><span>Hovhannisyan · Curriculum Vitae</span><span>Yerevan, 2026</span></div>

      <header class="title">
        <h1>Full-Stack Platforms and Data-Driven Systems: The Work of a Software Engineer</h1>
        <p class="author">${esc(cv.name)}</p>
        <p class="affil">${esc(cv.role)} · Bizzy Agency · French University in Armenia · ${esc(cv.location)}</p>
        <p class="contact"><a href="mailto:${cv.email}">${cv.email}</a><a href="${cv.links.github}" rel="noopener">github.com/emilhovh</a><a href="${cv.links.linkedin}" rel="noopener">LinkedIn</a></p>
      </header>

      <section class="abstract" aria-labelledby="abstract">
        <h2 id="abstract">Abstract</h2>
        <p>${esc(cv.summary)}</p>
        <p class="keywords"><i>Keywords</i> — React, TypeScript, Python, PostgreSQL, machine learning, experimentation, realtime systems.</p>
      </section>

      <div class="body">
        <h2 class="section"><span>1</span>Introduction</h2>
        <p>
          This document summarises ${cv.experience.length} current engagements, ${cv.projects.length} selected projects and a computer-science degree.
          Section 2 lists professional roles, Section 3 describes projects, Section 4 examines the technology involved (Figure 1) and how the work
          unfolded over time (Figure 2), and Section 5 covers languages and education.
        </p>

        <h2 class="section"><span>2</span>Professional experience</h2>
        <div class="table-wrap">
          <table>
            <caption><b>Table 1.</b> Roles and engagements, most recent first.</caption>
            <thead><tr><th>Period</th><th>Role</th><th>Contribution and stack</th></tr></thead>
            <tbody>${experienceRows}</tbody>
          </table>
        </div>

        <h2 class="section"><span>3</span>Selected projects</h2>
        ${projectSections}

        <h2 class="section"><span>4</span>Analysis</h2>
        <p>Figure 1 counts, for each technology, how many of the roles and projects above use it — a measured view of where the experience sits rather than a self-assessment.</p>
        <figure>
          ${figure1()}
          <figcaption><b>Figure 1.</b> The twelve most frequent technologies across ${cv.experience.length + cv.projects.length} roles and projects.</figcaption>
        </figure>
        <figure>
          ${figure2()}
          <figcaption><b>Figure 2.</b> Education and roles as bars, projects as points, August 2022 to present.</figcaption>
        </figure>
        <p>Skills by area: ${cv.skills.map((g) => `<i>${esc(g.group)}</i> (${esc(g.items.join(', '))})`).join('; ')}.</p>

        <h2 class="section"><span>5</span>Languages and education</h2>
        <div class="table-wrap">
          <table>
            <caption><b>Table 2.</b> Spoken languages, proficiency on a five-point scale.</caption>
            <thead><tr><th>Language</th><th>Name</th><th>Level</th></tr></thead>
            <tbody>${cv.languages.map((l) => `<tr><td>${l.name}</td><td>${l.native}</td><td>${l.level} / 5</td></tr>`).join('')}</tbody>
          </table>
        </div>
        ${cv.education.map((ed) => `<p><b>${esc(ed.title)}</b>, ${esc(ed.org)}, ${range(ed.start, ed.end)}. ${esc(ed.note)}</p>`).join('')}

        <h2 class="section">References</h2>
        <ol class="references">
          ${refs.map((p, i) => `<li id="ref-${p.id}"><span>[${i + 1}]</span><span>E. Hovhannisyan, “${esc(p.name)},” GitHub, ${p.date.slice(0, 4)}. <code><a href="${p.url}" rel="noopener">${p.url.replace('https://', '')}</a></code></span></li>`).join('')}
          ${cv.archive.map((a, i) => `<li><span>[${refs.length + i + 1}]</span><span>E. Hovhannisyan, “${esc(a.name)},” GitHub, ${a.year}. <code><a href="${a.url}" rel="noopener">${a.url.replace('https://', '')}</a></code></span></li>`).join('')}
        </ol>

        <div class="footnotes">
          <p id="fn-nda">† Work under a non-disclosure agreement; client names and details are withheld.</p>
        </div>
      </div>
      <div class="page-number" aria-hidden="true">1</div>
    </article>`
})()
