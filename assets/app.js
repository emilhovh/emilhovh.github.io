// One CV, four views of the same content.js: a git history, a transit map, a research paper and a personnel file.
;(() => {
  const cv = window.CV
  const { month, esc } = window.CVfmt

  // motion is an enhancement: off for visitors who ask for reduced motion, and with ?static (screenshots, tests)
  const MOTION = !matchMedia('(prefers-reduced-motion: reduce)').matches && !new URLSearchParams(location.search).has('static')
  if (MOTION) document.documentElement.classList.add('motion')

  // ---------- shared vocabulary ----------

  const CODE = { web: 'W', data: 'D', ml: 'M', games: 'G', systems: 'S' }
  const DOMAINS = Object.keys(CODE)
  const COLOR = { web: '#e4002b', data: '#0072ce', ml: '#00a651', games: '#f5a300', systems: '#8e44ad' }
  const today = new Date()
  const NOW = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

  /** '2026' as the start of a period is January, as the end it is December */
  const key = (ym, edge = 'start') => (!ym ? NOW : String(ym).length === 4 ? `${ym}-${edge === 'start' ? '01' : '12'}` : ym)

  const when = (e) => {
    if (!e.end) return `${month(e.start)} – Present`
    if (e.start === e.end) return month(e.start)
    return `${month(e.start)} – ${month(e.end)}`
  }

  const badge = (d, cls = '') => `<span class="badge ${cls}" data-d="${d}" title="${esc(cv.domains[d])}">${CODE[d]}</span>`
  const chips = (items) => `<ul class="chips">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
  /** a heading split into letters that can rise one by one; words stay unbreakable */
  const letters = (text) =>
    `<span aria-hidden="true">${text
      .split(' ')
      .map((word) => `<span class="word">${[...word].map((ch) => `<span class="ch">${esc(ch)}</span>`).join('')}</span>`)
      .join(' ')}</span>`
  const redact = () =>
    `<span class="redact" tabindex="0" role="img" aria-label="Client name withheld under a non-disclosure agreement" data-tip="Client name withheld under NDA">████████████</span><span class="nda-tag">NDA</span>`
  const orgOf = (e) => (e.kind === 'nda' ? redact() : e.orgUrl ? `<a href="${e.orgUrl}" rel="noopener">${esc(e.org)}</a>` : esc(e.org))

  // current roles: employers before confidential engagements, newest first
  const roles = cv.experience.slice().sort((a, b) => {
    if (!a.end !== !b.end) return a.end ? 1 : -1
    if (a.kind !== b.kind) return a.kind === 'work' ? -1 : 1
    return key(b.start).localeCompare(key(a.start))
  })
  const earlier = cv.earlier.slice().sort((a, b) => key(b.start).localeCompare(key(a.start)))
  const projects = cv.projects.slice().sort((a, b) => b.date.localeCompare(a.date))
  const education = cv.education
  const everything = [...roles, ...earlier, ...projects]

  // ---------- masthead ----------

  const currentWork = roles.filter((r) => r.kind === 'work' && !r.end)
  const ndaCount = roles.filter((r) => r.kind === 'nda').length

  const masthead = `
    <header class="masthead">
      <div class="wrap masthead__grid">
        <div>
          <p class="place">${esc(cv.location)}</p>
          <h1 aria-label="${esc(cv.name)}">${letters(cv.name)}</h1>
          <p class="lede">${esc(cv.role)} — ${esc(cv.focus)}<span class="caret" aria-hidden="true"></span></p>
          <p class="summary">${esc(cv.summary)}</p>
          <div class="actions">
            <a class="btn btn--solid" href="mailto:${cv.email}">Email me</a>
            <a class="btn" href="${cv.links.github}" rel="noopener">GitHub</a>
            <a class="btn" href="${cv.links.linkedin}" rel="noopener">LinkedIn</a>
          </div>
        </div>
        <aside class="now" aria-labelledby="now-title">
          <h2 id="now-title">Now</h2>
          <ul class="now-list">
            ${currentWork.map((r) => `<li>${badge(r.domains[0])}<div><b>${esc(r.title)}</b><span class="org">${esc(r.org)}, since ${month(r.start)}</span></div></li>`).join('')}
            <li>${badge('games')}<div><b>${ndaCount} confidential client engagements</b><span class="org">Web, mobile and realtime platforms <span class="nda-tag">NDA</span></span></div></li>
          </ul>
          <ul class="legend" aria-label="Colour key for areas of work">
            ${DOMAINS.map((d) => `<li>${badge(d, 'badge--sm')}${esc(cv.domains[d])}</li>`).join('')}
          </ul>
        </aside>
      </div>
    </header>`

  const VIEWS = [
    { id: 'timeline', name: 'Timeline', hint: 'every role as a git history' },
    { id: 'map', name: 'Map', hint: 'the work as a transit network' },
    { id: 'paper', name: 'Paper', hint: 'tables, figures, printable' },
    { id: 'dossier', name: 'Dossier', hint: 'the personnel file' },
  ]

  const switcher = `
    <nav class="views" aria-label="Views of this CV">
      <div class="wrap views__list" role="tablist">
        ${VIEWS.map((v) => `<button class="view-tab" role="tab" id="tab-${v.id}" aria-controls="view-${v.id}" aria-selected="false" tabindex="-1" data-view="${v.id}"><b>${v.name}</b><span>${v.hint}</span></button>`).join('')}
      </div>
    </nav>`

  // ---------- view 1: timeline ----------

  function timelineView() {
    const LANES = ['work', 'nda', 'projects', 'study']
    const hash = (text) => {
      let h = 2166136261
      for (const ch of text) {
        h ^= ch.codePointAt(0)
        h = Math.imul(h, 16777619)
      }
      return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7)
    }

    const commits = [
      ...roles.map((e) => ({ lane: e.kind === 'nda' ? 'nda' : 'work', sort: key(e.start), when: when(e), title: e.title, org: orgOf(e), points: e.points, stack: e.stack, domains: e.domains, current: !e.end })),
      ...earlier.map((e) => ({ lane: e.kind === 'training' ? 'study' : 'work', sort: key(e.start), when: when(e), title: e.title, org: orgOf(e), points: e.points, stack: e.stack, domains: e.domains, current: !e.end })),
      ...projects.map((p) => ({ lane: 'projects', sort: p.date, when: month(p.date), title: p.name, org: esc(p.tagline), text: p.text, stack: p.stack, domains: p.domains, url: p.url, featured: p.featured })),
      ...education.map((ed) => ({ lane: 'study', sort: key(ed.start), when: when(ed), title: ed.title, org: esc(ed.org), text: ed.note, domains: [], current: !ed.end })),
    ].sort((a, b) => b.sort.localeCompare(a.sort))

    const seen = new Set()
    for (const c of commits) {
      c.head = c.current && !seen.has(c.lane)
      if (c.head) seen.add(c.lane)
    }

    const row = (c) => `
      <li class="commit ${c.head ? 'is-head' : ''}" data-lane="${c.lane}" style="--lane:${LANES.indexOf(c.lane)};--dot:${c.domains[0] ? COLOR[c.domains[0]] : 'var(--ink)'}">
        <div class="rail" aria-hidden="true"><span class="dot"></span></div>
        <article class="commit-body">
          <div class="commit-top">
            <p class="meta"><code class="hash">${hash(c.title + c.sort)}</code><time>${c.when}</time>${c.head ? `<span class="ref ref--head">HEAD → ${c.lane}</span>` : ''}${c.featured ? '<span class="ref">featured</span>' : ''}</p>
            <span>${c.domains.map((d) => badge(d, 'badge--sm')).join(' ')}</span>
          </div>
          <h3>${esc(c.title)}</h3>
          <p class="org-line">${c.org}</p>
          ${c.points ? `<ul class="points">${c.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
          ${c.text ? `<p class="text">${esc(c.text)}</p>` : ''}
          ${c.stack ? chips(c.stack) : ''}
          ${c.url ? `<a class="repo-link" href="${c.url}" rel="noopener">view repository</a>` : ''}
        </article>
      </li>`

    const count = (lane) => commits.filter((c) => c.lane === lane).length
    const diff = cv.skills.map((g) => [`<div class="hunk">@@ ${esc(g.group)} @@</div>`, ...g.items.map((i) => `<div class="add">+ ${esc(i)}</div>`)].join('')).join('')

    return `
      <p class="view-intro">Everything as a git history: four branches — work, confidential work, projects and study — one commit per role, project or degree. Toggle branches to filter.</p>
      <div class="timeline">
        <div>
          <div class="branches" role="group" aria-label="Show or hide branches">
            ${LANES.map((l) => `<button class="branch" type="button" aria-pressed="true" data-lane="${l}"><i></i>${l}<small>${count(l)}</small></button>`).join('')}
          </div>
          <ol class="log">${commits.map(row).join('')}</ol>
        </div>
        <aside>
          <section class="aside-block" aria-labelledby="t-skills"><h2 id="t-skills">skills.lock</h2><div class="diff">${diff}</div></section>
          <section class="aside-block" aria-labelledby="t-langs"><h2 id="t-langs">languages</h2>
            ${cv.languages.map((l) => `<div class="lang-row"><div><b>${l.name}</b> <span>${l.cefr}</span></div><div class="meter" aria-label="${l.cefr}">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= l.level ? 'on' : ''}"></i>`).join('')}</div></div>`).join('')}
          </section>
          <section class="aside-block" aria-labelledby="t-certs"><h2 id="t-certs">certificates</h2>
            <ul class="plain-list">${cv.certificates.map((c) => `<li>${esc(c.name)}<small>${esc(c.org)}${c.year ? `, ${c.year}` : ''}</small></li>`).join('')}</ul>
          </section>
          <section class="aside-block" aria-labelledby="t-archive"><h2 id="t-archive">archive</h2>
            <ul class="plain-list">${cv.archive.map((a) => `<li><a href="${a.url}" rel="noopener">${esc(a.name)}</a><small>${a.year}</small></li>`).join('')}</ul>
          </section>
        </aside>
      </div>`
  }

  // ---------- view 2: map ----------

  const SHORT = {
    cretrix: 'Cretrix',
    'nda-games': 'Telegram games',
    'nda-mobile': 'Mobile app',
    'nda-fintech': 'Brokerage platform',
    bizzy: 'Bizzy Agency',
    techx: 'TechX Global',
    synopsys: 'Synopsys course',
    trustedclicks: 'Trusted Clicks',
    gurus: 'R training',
    hpc: 'Supercomputer',
    rag: 'RAG Chatbot',
    statsphere: 'StatSphere',
    airpop: 'AirPop',
    eventsphere: 'EventSphere',
    ecc: 'ECC Validator',
    deepcarex: 'DeepCareX',
    complaint: 'Complaint-O-Tron',
  }

  const stops = [
    ...[...roles, ...earlier].map((e) => ({
      id: e.id,
      title: e.title,
      org: e.kind === 'nda' ? null : e.org,
      nda: e.kind === 'nda',
      when: when(e),
      date: key(e.start),
      label: e.end ? month(e.start) : 'now',
      lines: e.domains,
      points: e.points,
      stack: e.stack,
      url: e.orgUrl,
    })),
    ...projects.map((p) => ({ id: p.id, title: p.name, org: p.tagline, when: month(p.date), date: p.date, label: month(p.date), lines: p.domains, text: p.text, stack: p.stack, url: p.url })),
  ].sort((a, b) => a.date.localeCompare(b.date))

  function mapView() {
    // map units: the drawing is laid out large and scaled down to fit, so text is sized for that scale
    const H = 780
    const depot = { x: 120, y: 400 }
    const trackY = { web: 130, data: 265, ml: 400, games: 535, systems: 660 }
    const [y0, m0] = [2024, 1]
    const monthsFrom = (ym) => {
      const [y, m] = ym.split('-').map(Number)
      return (y - y0) * 12 + (m - m0)
    }
    // stations start clear of the bends where lines leave the depot
    const X0 = 580
    const PER_MONTH = 30
    const SPACING = 170

    // place stations by date, push apart on shared tracks, alternate labels above and below
    const perLine = {}
    const placed = []
    for (const stop of stops) {
      let x = X0 + Math.max(0, monthsFrom(stop.date)) * PER_MONTH
      for (const other of placed) {
        if (other.lines.some((l) => stop.lines.includes(l)) && Math.abs(other.x - x) < SPACING) x = other.x + SPACING
      }
      stop.x = x
      const primary = stop.lines[0]
      perLine[primary] = (perLine[primary] ?? 0) + 1
      stop.above = perLine[primary] % 2 === 1
      placed.push(stop)
    }
    const endX = Math.max(...stops.map((s) => s.x)) + 120
    const W = endX + 90

    const track = (d) => {
      const y = trackY[d]
      return `M ${depot.x + 80} ${depot.y} L ${depot.x + 140} ${depot.y} L ${depot.x + 140 + Math.abs(y - depot.y)} ${y} L ${endX} ${y}`
    }
    const years = ['2024-01', '2025-01', '2026-01']
    const xOf = (ym) => X0 + monthsFrom(ym) * PER_MONTH

    const station = (s) => {
      const ys = s.lines.map((l) => trackY[l])
      const top = Math.min(...ys)
      const bottom = Math.max(...ys)
      const labelY = s.above ? top - 44 : bottom + 42
      return `
        <g class="station" tabindex="0" role="button" data-id="${s.id}" data-lines="${s.lines.join(' ')}" data-x="${s.x}" aria-label="${esc(s.title)}, ${esc(s.when)}">
          ${ys.length > 1 ? `<line class="passage" x1="${s.x}" y1="${top}" x2="${s.x}" y2="${bottom}"/>` : ''}
          ${s.lines.map((l) => `<circle class="ping" data-d="${l}" cx="${s.x}" cy="${trackY[l]}" r="13"/><circle class="ring" cx="${s.x}" cy="${trackY[l]}" r="13"/>`).join('')}
          <text x="${s.x}" y="${labelY}" text-anchor="middle">${esc(SHORT[s.id] ?? s.title)}</text>
          <text class="date" x="${s.x}" y="${labelY + 20}" text-anchor="middle">${esc(s.label)}</text>
        </g>`
    }

    const svg = `
      <svg class="map" viewBox="0 0 ${W} ${H}" role="group" aria-label="Transit map of roles, training and projects">
        <g class="axis">${years.map((ym) => `<line x1="${xOf(ym)}" y1="50" x2="${xOf(ym)}" y2="${H - 40}"/><text x="${xOf(ym)}" y="${H - 12}" text-anchor="middle">${ym.slice(0, 4)}</text>`).join('')}</g>
        ${DOMAINS.map((d) => `<path class="track" data-d="${d}" d="${track(d)}" stroke="${COLOR[d]}"/>`).join('')}
        ${stops.map(station).join('')}
        <g class="trains" aria-hidden="true"></g>
        <g class="depot"${MOTION ? ' role="button" tabindex="0" aria-label="UFAR depot: send out another train"' : ''}>
          <rect x="${depot.x - 96}" y="${depot.y - 52}" width="192" height="104" rx="16"/>
          <circle class="signal" cx="${depot.x + 74}" cy="${depot.y - 32}" r="6" fill="#00a651"/>
          <circle class="signal" cx="${depot.x + 74}" cy="${depot.y - 14}" r="6" fill="#e4002b"/>
          <text x="${depot.x}" y="${depot.y - 6}" text-anchor="middle">UFAR</text><text class="depot-sub" x="${depot.x}" y="${depot.y + 22}" text-anchor="middle">since 2022</text>
        </g>
        ${DOMAINS.map((d) => `<text class="now-label" x="${endX + 18}" y="${trackY[d] + 6}">NOW</text>`).join('')}
      </svg>`

    const timetable = DOMAINS.map((d) => {
      const onLine = stops.filter((s) => s.lines.includes(d)).slice().reverse()
      return `
        <article class="line-card" style="--c:${COLOR[d]}">
          <h3>${badge(d)} ${esc(cv.domains[d])}</h3>
          <ol>${onLine.map((s) => `<li><time>${esc(s.when.replace(' – Present', ' →'))}</time><div><b>${esc(s.title)}</b><span>${s.nda ? 'Confidential client' : esc(s.org)}</span></div></li>`).join('')}</ol>
        </article>`
    }).join('')

    return `
      <p class="view-intro">The work as a transit network. Every line starts at university; roles, courses and projects are stations on the lines of the areas they belong to. Select a station to see it.${MOTION ? ' Tap the UFAR depot to send out another train.' : ''}</p>
      <section class="map-card" aria-label="Network map"><p class="map-hint">Swipe the map sideways to follow the lines →</p><div class="map-scroll">${svg}</div></section>
      <section class="stop-detail" id="stop-detail" aria-live="polite"></section>
      <h2 class="section-title">Timetable by line</h2>
      <div class="timetable">${timetable}</div>`
  }

  const stopDetail = (s) => `
    <div>
      <div class="badges">${s.lines.map((d) => badge(d)).join('')}</div>
      <h3>${esc(s.title)}</h3>
      <p class="sub">${s.nda ? redact() : s.url && s.org ? `<a href="${s.url}" rel="noopener">${esc(s.org)}</a>` : esc(s.org ?? '')}</p>
      <p class="sub">${esc(s.when)}</p>
    </div>
    <div>
      ${s.points ? `<ul>${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : `<p>${esc(s.text)}</p>`}
      ${chips(s.stack)}
      ${s.url && s.url.includes('github') ? `<p style="margin-top:12px"><a href="${s.url}" rel="noopener">View repository →</a></p>` : ''}
    </div>`

  // ---------- view 3: paper ----------

  function paperView() {
    const refs = projects.filter((p) => p.url)
    const refNo = (id) => refs.findIndex((p) => p.id === id) + 1

    const counts = new Map()
    for (const entry of everything) for (const tech of entry.stack) counts.set(tech, (counts.get(tech) ?? 0) + 1)
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 14)

    const figure1 = () => {
      const rowH = 24
      const left = 160
      const width = 660
      const height = top.length * rowH + 34
      const max = Math.max(...top.map(([, n]) => n))
      const x = (n) => left + (n / max) * (width - left - 30)
      return `
        <svg class="fig" viewBox="0 0 ${width} ${height}" role="img" aria-label="Technologies ranked by how many roles and projects use them">
          ${Array.from({ length: max + 1 }, (_, t) => `<line class="grid" x1="${x(t)}" y1="0" x2="${x(t)}" y2="${height - 24}"/><text x="${x(t)}" y="${height - 8}" text-anchor="middle">${t}</text>`).join('')}
          ${top.map(([tech, n], i) => `<text x="${left - 10}" y="${i * rowH + 16}" text-anchor="end">${esc(tech)}</text><line class="stem" pathLength="1" x1="${x(0)}" y1="${i * rowH + 12}" x2="${x(n)}" y2="${i * rowH + 12}" stroke="#c9ced6" style="--i:${i}"/><circle class="dot" cx="${x(n)}" cy="${i * rowH + 12}" r="5" fill="#0c2340" style="--i:${i}"/>`).join('')}
        </svg>`
    }

    const figure2 = () => {
      const width = 660
      const left = 160
      const from = new Date(2019, 0).getTime()
      const to = new Date(2027, 0).getTime()
      const x = (ym, edge) => {
        const [y, m] = key(ym, edge).split('-').map(Number)
        return left + ((new Date(y, m - 1).getTime() - from) / (to - from)) * (width - left - 16)
      }
      const bars = (list, color) =>
        list.map((e, i) => `<rect class="bar" style="--i:${i}" x="${x(e.start)}" width="${Math.max(5, x(e.end, 'end') - x(e.start))}" height="12" rx="2" fill="${color}"/>`).join('')
      const rows = [
        ['Education', bars(education, '#00a651')],
        ['Employment', bars([...roles, ...earlier].filter((e) => e.kind === 'work'), '#0c2340')],
        ['NDA work', bars(roles.filter((e) => e.kind === 'nda'), '#b3261e')],
        ['Training', bars(earlier.filter((e) => e.kind === 'training'), '#8e44ad')],
        ['Projects', projects.map((p, i) => `<circle class="dot" style="--i:${i}" cx="${x(p.date)}" cy="6" r="5" fill="#0072ce" fill-opacity="0.85"/>`).join('')],
      ]
      const rowH = 30
      const height = rows.length * rowH + 30
      return `
        <svg class="fig" viewBox="0 0 ${width} ${height}" role="img" aria-label="Timeline of education, employment, NDA work, training and projects since 2019">
          ${[2019, 2021, 2023, 2025, 2027].map((y) => `<line class="grid" x1="${x(`${y}-01`)}" y1="0" x2="${x(`${y}-01`)}" y2="${height - 24}"/><text x="${x(`${y}-01`)}" y="${height - 8}" text-anchor="middle">${y}</text>`).join('')}
          ${rows.map(([label, marks], i) => `<text x="${left - 10}" y="${i * rowH + 18}" text-anchor="end">${label}</text><g transform="translate(0 ${i * rowH + 6})">${marks}</g>`).join('')}
        </svg>`
    }

    const dagger = '<sup><a href="#fn-nda" aria-label="footnote">†</a></sup>'
    const roleRow = (e) => `
      <tr>
        <td class="when">${when(e)}</td>
        <td><b>${esc(e.title)}</b>${e.kind === 'nda' ? dagger : ''}<small>${e.kind === 'nda' ? redact() : esc(e.org)}</small></td>
        <td>${esc(e.points.join('; '))}.<small>${esc(e.stack.join(', '))}</small></td>
      </tr>`

    return `
      <div class="paper-tools"><button class="btn btn--ink" type="button" data-print>Print or save as PDF</button></div>
      <article class="paper">
        <div class="running" aria-hidden="true"><span>Hovhannisyan · Curriculum Vitae</span><span>${esc(cv.location)}, ${today.getFullYear()}</span></div>
        <header class="paper-title">
          <h2>Applied AI, Web Platforms and Data-Driven Systems: The Work of a Software Engineer</h2>
          <p>${esc(cv.name)}</p>
          <p class="affil">${currentWork.map((r) => esc(r.org)).join(' · ')} · French University in Armenia · ${esc(cv.location)}</p>
          <p class="mono" style="font-size:13px;margin-top:8px"><a href="mailto:${cv.email}">${cv.email}</a> · <a href="${cv.links.github}" rel="noopener">github.com/emilhovh</a> · <a href="${cv.links.linkedin}" rel="noopener">LinkedIn</a></p>
        </header>

        <section class="abstract" aria-labelledby="p-abstract">
          <h3 id="p-abstract">Abstract</h3>
          <p>${esc(cv.summary)}</p>
          <p style="margin-top:8px"><i>Keywords</i> — Python, computer vision, OCR, RAG, React, TypeScript, PostgreSQL, experimentation.</p>
        </section>

        <h3 class="num"><span class="n">1</span>Professional experience</h3>
        <div class="table-wrap"><table>
          <caption><b>Table 1.</b> Current roles and engagements.</caption>
          <thead><tr><th>Period</th><th>Role</th><th>Contribution and stack</th></tr></thead>
          <tbody>${roles.map(roleRow).join('')}</tbody>
        </table></div>
        <div class="table-wrap"><table>
          <caption><b>Table 2.</b> Earlier roles, courses and training.</caption>
          <thead><tr><th>Period</th><th>Role</th><th>Contribution and stack</th></tr></thead>
          <tbody>${earlier.map(roleRow).join('')}</tbody>
        </table></div>

        <h3 class="num"><span class="n">2</span>Selected projects</h3>
        ${projects.map((p, i) => `<h4><span class="n">2.${i + 1}</span>${esc(p.name)}</h4><p><i>${esc(p.tagline)}.</i> ${esc(p.text)} Built with ${esc(p.stack.join(', '))}.${p.url ? ` <sup><a href="#ref-${p.id}">[${refNo(p.id)}]</a></sup>` : ''}</p>`).join('')}

        <h3 class="num"><span class="n">3</span>Analysis</h3>
        <p>Figure 1 counts how many of the ${everything.length} roles, courses and projects above use each technology — a measured view of the experience rather than a self-assessment. Figure 2 places them in time.</p>
        <figure>${figure1()}<figcaption><b>Figure 1.</b> The fourteen most frequent technologies.</figcaption></figure>
        <figure>${figure2()}<figcaption><b>Figure 2.</b> Education, employment, NDA work and training as bars; projects as points.</figcaption></figure>
        <p>Skills by area: ${cv.skills.map((g) => `<i>${esc(g.group)}</i> (${esc(g.items.join(', '))})`).join('; ')}.</p>

        <h3 class="num"><span class="n">4</span>Education, languages and certificates</h3>
        ${education.map((ed) => `<p><b>${esc(ed.title)}</b>, ${esc(ed.org)}, ${when(ed)}. ${esc(ed.note)}</p>`).join('')}
        <div class="table-wrap"><table>
          <caption><b>Table 3.</b> Spoken languages (CEFR).</caption>
          <thead><tr><th>Language</th><th>Name</th><th>Level</th></tr></thead>
          <tbody>${cv.languages.map((l) => `<tr><td>${l.name}</td><td>${l.native}</td><td>${l.cefr}</td></tr>`).join('')}</tbody>
        </table></div>
        <p>Certificates: ${cv.certificates.map((c) => `${esc(c.name)} (${esc(c.org)}${c.year ? `, ${c.year}` : ''})`).join('; ')}.</p>

        <h3 class="num">References</h3>
        <ol class="references">
          ${refs.map((p, i) => `<li id="ref-${p.id}"><span>[${i + 1}]</span><span>E. Hovhannisyan, “${esc(p.name)},” GitHub, ${p.date.slice(0, 4)}. <code><a href="${p.url}" rel="noopener">${p.url.replace('https://', '')}</a></code></span></li>`).join('')}
          ${cv.archive.map((a, i) => `<li><span>[${refs.length + i + 1}]</span><span>E. Hovhannisyan, “${esc(a.name)},” GitHub, ${a.year}. <code><a href="${a.url}" rel="noopener">${a.url.replace('https://', '')}</a></code></span></li>`).join('')}
        </ol>
        <div class="footnotes"><p id="fn-nda">† Work under a non-disclosure agreement; client names and details are withheld.</p></div>
      </article>`
  }

  // ---------- view 4: dossier ----------

  function dossierView() {
    const record = (e) => `
      <div class="record">
        <h4>${esc(e.title)}</h4>
        <p class="when">${when(e)} — ${e.kind === 'nda' ? `Client: ${redact()}` : orgOf(e)}</p>
        <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        <p class="equipment">Equipment: ${esc(e.stack.join(', '))}</p>
      </div>`

    const caseFile = (p, i) => `
      <article class="case" style="--c:${COLOR[p.domains[0]]}">
        <p class="case-no">CASE EH-${p.date.replace('-', '')}-${String(i + 1).padStart(2, '0')}</p>
        <h4>${esc(p.name)}</h4>
        <p><i>${esc(p.tagline)}</i></p>
        <p>${esc(p.text)}</p>
        ${p.url ? `<p><a href="${p.url}" rel="noopener">Open evidence →</a></p>` : '<p style="color:var(--faint)">Evidence held privately</p>'}
      </article>`

    return `
      <p class="view-intro">The same record, filed: a cover sheet, assignments, the earlier record, case files and capabilities. Confidential clients are redacted.</p>
      <div class="dossier">
        <section class="sheet cover" aria-labelledby="d-subject">
          <span class="sheet-tab" aria-hidden="true">PERSONNEL</span>
          <div class="stamp" aria-hidden="true">CLEARED FOR HIRE</div>
          <p class="file-no">File EH-2022-0829 · Yerevan</p>
          <h2 id="d-subject">${esc(cv.name)}</h2>
          <p>${esc(cv.role)} — ${esc(cv.focus)}</p>
          <dl class="fields">
            <dt>Current posts</dt><dd>${currentWork.map((r) => `${esc(r.title)}, ${orgOf(r)}`).join('<br />')}</dd>
            <dt>Classified work</dt><dd>${ndaCount} engagements, clients withheld <span class="nda-tag">NDA</span></dd>
            <dt>Base</dt><dd>${esc(cv.location)}</dd>
            <dt>Training</dt><dd>${education.map((ed) => `${esc(ed.title)}, ${esc(ed.org)}`).join('<br />')}</dd>
            <dt>Languages</dt><dd>${cv.languages.map((l) => `${l.name} (${l.cefr})`).join(', ')}</dd>
            <dt>Contact</dt><dd><a href="mailto:${cv.email}">${cv.email}</a> · <a href="${cv.links.github}" rel="noopener">GitHub</a> · <a href="${cv.links.linkedin}" rel="noopener">LinkedIn</a></dd>
          </dl>
        </section>

        <section class="sheet" aria-labelledby="d-assign">
          <span class="sheet-tab" aria-hidden="true">§ 1</span>
          <h3 class="section" id="d-assign"><span>§1</span> Assignments</h3>
          ${roles.map(record).join('')}
        </section>

        <section class="sheet" aria-labelledby="d-earlier">
          <span class="sheet-tab" aria-hidden="true">§ 2</span>
          <h3 class="section" id="d-earlier"><span>§2</span> Earlier record</h3>
          ${earlier.map(record).join('')}
        </section>

        <section class="sheet" aria-labelledby="d-cases">
          <span class="sheet-tab" aria-hidden="true">§ 3</span>
          <h3 class="section" id="d-cases"><span>§3</span> Case files</h3>
          <div class="cases">${projects.map(caseFile).join('')}</div>
        </section>

        <section class="sheet" aria-labelledby="d-cap">
          <span class="sheet-tab" aria-hidden="true">§ 4</span>
          <h3 class="section" id="d-cap"><span>§4</span> Capabilities</h3>
          <div class="capabilities">${cv.skills.map((g) => `<div><h4>${esc(g.group)}</h4><p>${esc(g.items.join(', '))}</p></div>`).join('')}</div>
          <h3 class="section" style="margin-top:28px"><span>§5</span> Certificates</h3>
          <ul>${cv.certificates.map((c) => `<li>${esc(c.name)} — ${esc(c.org)}${c.year ? `, ${c.year}` : ''}</li>`).join('')}</ul>
          <div class="signoff"><span>Redacted entries concern work under non-disclosure agreements.</span><span class="signature" aria-hidden="true">E. Hovhannisyan</span></div>
        </section>
      </div>`
  }

  // ---------- page ----------

  document.getElementById('app').innerHTML = `
    ${masthead}
    ${switcher}
    <main>
      <section class="view wrap" id="view-timeline" role="tabpanel" aria-labelledby="tab-timeline" hidden>${timelineView()}</section>
      <section class="view wrap" id="view-map" role="tabpanel" aria-labelledby="tab-map" hidden>${mapView()}</section>
      <section class="view wrap" id="view-paper" role="tabpanel" aria-labelledby="tab-paper" hidden>${paperView()}</section>
      <section class="view wrap" id="view-dossier" role="tabpanel" aria-labelledby="tab-dossier" hidden>${dossierView()}</section>
    </main>
    <footer class="site-footer"><div class="wrap"><span>${esc(cv.name)} · <a href="mailto:${cv.email}">${cv.email}</a></span><span>One CV, four views. Confidential client work is listed without client names.</span></div></footer>`

  // view switching, with the view in the URL so a link opens the same one
  const tabs = [...document.querySelectorAll('.view-tab')]
  const show = (id, focus = false) => {
    if (!VIEWS.some((v) => v.id === id)) id = VIEWS[0].id
    for (const tab of tabs) {
      const on = tab.dataset.view === id
      tab.setAttribute('aria-selected', String(on))
      tab.tabIndex = on ? 0 : -1
      if (on && focus) tab.focus()
    }
    for (const v of VIEWS) document.getElementById(`view-${v.id}`).hidden = v.id !== id
    history.replaceState(null, '', `#${id}`)
    window.dispatchEvent(new CustomEvent('cv:view', { detail: id }))
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(tab.dataset.view))
    tab.addEventListener('keydown', (event) => {
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
      if (!step) return
      event.preventDefault()
      show(tabs[(i + step + tabs.length) % tabs.length].dataset.view, true)
    })
  })
  show(location.hash.slice(1))

  // timeline branch filters
  document.querySelectorAll('.branch').forEach((button) => {
    button.addEventListener('click', () => {
      const on = button.getAttribute('aria-pressed') !== 'true'
      button.setAttribute('aria-pressed', String(on))
      document.querySelectorAll(`.commit[data-lane="${button.dataset.lane}"]`).forEach((row) => {
        if (!MOTION) {
          row.hidden = !on
          return
        }
        if (on) {
          row.hidden = false
          row.classList.remove('leaving', 'seen')
          requestAnimationFrame(() => requestAnimationFrame(() => row.classList.add('seen')))
        } else {
          row.classList.add('leaving')
          setTimeout(() => {
            row.hidden = true
            row.classList.remove('leaving')
          }, 260)
        }
      })
    })
  })

  // map stations
  const detail = document.getElementById('stop-detail')
  const select = (id) => {
    const stop = stops.find((s) => s.id === id)
    if (!stop) return
    detail.innerHTML = stopDetail(stop)
    document.querySelectorAll('.station').forEach((g) => g.classList.toggle('is-on', g.dataset.id === id))
  }
  document.querySelectorAll('.station').forEach((g) => {
    g.addEventListener('click', () => select(g.dataset.id))
    g.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        select(g.dataset.id)
      }
    })
  })
  select('cretrix')

  document.querySelector('[data-print]')?.addEventListener('click', () => window.print())

  // ---------- motion ----------
  // Everything below only adds movement; the page above is complete without it.

  if (!MOTION) return

  const reflow = (el) => el.getBoundingClientRect()
  const restart = (el, cls) => {
    el.classList.remove(cls)
    reflow(el)
    el.classList.add(cls)
  }
  const indexChildren = (selector) =>
    document.querySelectorAll(selector).forEach((parent) => [...parent.children].forEach((child, i) => child.style.setProperty('--i', i)))

  indexChildren('.now-list')
  indexChildren('.legend')
  indexChildren('.diff')
  indexChildren('.meter')
  indexChildren('.cases')
  document.querySelectorAll('.masthead .ch').forEach((ch, i) => ch.style.setProperty('--i', i))
  document.querySelectorAll('.map .station').forEach((g, i) => g.style.setProperty('--i', i))
  document.querySelectorAll('.redact').forEach((bar) => bar.style.setProperty('--r', (Math.random() * 4).toFixed(2)))

  // reveal things once, as they scroll into view
  const onSeen = new WeakMap()
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('seen')
        observer.unobserve(entry.target)
        onSeen.get(entry.target)?.(entry.target)
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
  )
  const reveal = (selector, fn) =>
    document.querySelectorAll(selector).forEach((el) => {
      if (fn) onSeen.set(el, fn)
      observer.observe(el)
    })

  // timeline: a commit hash spins through hex before it settles
  const HEX = '0123456789abcdef'
  const scramble = (el) => {
    const final = el.textContent
    let frame = 0
    const step = () => {
      frame++
      el.textContent = [...final].map((c, i) => (frame > i * 2 + 3 ? c : HEX[(Math.random() * 16) | 0])).join('')
      if (frame < final.length * 2 + 4) setTimeout(step, 30)
      else el.textContent = final
    }
    step()
  }
  reveal('.commit', (row) => {
    const hash = row.querySelector('.hash')
    if (hash) scramble(hash)
  })
  reveal('.aside-block')

  // paper: figures grow, headings get their pen stroke
  reveal('.paper figure')
  reveal('.paper h3.num')

  // dossier: sheets come off the stack, the cover is typed, the stamp lands
  const typewrite = (el, delay, speed) => {
    const text = el.textContent
    el.setAttribute('aria-label', text)
    el.textContent = ''
    const caret = document.createElement('span')
    caret.className = 'type-caret'
    caret.setAttribute('aria-hidden', 'true')
    el.append(caret)
    let i = 0
    setTimeout(function tick() {
      caret.before(text[i++])
      if (i < text.length) setTimeout(tick, speed)
      else setTimeout(() => caret.remove(), 900)
    }, delay)
    return delay + text.length * speed
  }
  reveal('.sheet', (sheet) => {
    if (!sheet.classList.contains('cover')) return
    const fileNo = sheet.querySelector('.file-no')
    const name = sheet.querySelector('h2')
    const after = fileNo ? typewrite(fileNo, 200, 20) : 0
    if (name) typewrite(name, after + 120, 55)
  })
  document.querySelectorAll('.stamp').forEach((stamp) => {
    stamp.addEventListener('click', () => {
      restart(stamp, 'restamp')
      restart(stamp.closest('.sheet'), 'thud')
    })
  })

  // view switcher: the underline slides; a new view fades in
  const list = document.querySelector('.views__list')
  const indicator = document.createElement('span')
  indicator.className = 'views__indicator'
  indicator.setAttribute('aria-hidden', 'true')
  list.append(indicator)
  const moveIndicator = () => {
    const tab = list.querySelector('[aria-selected="true"]')
    if (!tab) return
    indicator.style.width = `${tab.offsetWidth}px`
    indicator.style.transform = `translateX(${tab.offsetLeft}px)`
  }
  moveIndicator()
  requestAnimationFrame(() => indicator.classList.add('ready'))
  document.fonts?.ready.then(moveIndicator)
  addEventListener('resize', moveIndicator)

  for (const v of VIEWS) {
    const section = document.getElementById(`view-${v.id}`)
    section.addEventListener('animationend', (event) => {
      if (event.target === section) section.classList.remove('entering')
    })
  }
  addEventListener('cv:view', (event) => {
    moveIndicator()
    restart(document.getElementById(`view-${event.detail}`), 'entering')
    if (event.detail === 'map') startMap()
  })

  // ---------- the map comes alive ----------

  const speed = { factor: 1 }
  let mapStarted = false

  function startMap() {
    if (mapStarted) return
    mapStarted = true
    const svg = document.querySelector('.map')
    svg.querySelectorAll('.track').forEach((path, i) => {
      path.style.setProperty('--len', path.getTotalLength())
      path.style.setProperty('--ti', i)
    })
    svg.classList.add('drawing')
    setTimeout(() => svg.classList.remove('drawing'), 2800)
    setTimeout(() => runTrains(svg), 1400)
  }

  function runTrains(svg) {
    const NS = 'http://www.w3.org/2000/svg'
    const layer = svg.querySelector('.trains')

    const lines = [...svg.querySelectorAll('.track')].map((path) => {
      const d = path.dataset.d
      const length = path.getTotalLength()
      // x only grows along a track, so the distance to a station can be found by bisection
      const distanceAtX = (x) => {
        let lo = 0
        let hi = length
        for (let k = 0; k < 28; k++) {
          const mid = (lo + hi) / 2
          if (path.getPointAtLength(mid).x < x) lo = mid
          else hi = mid
        }
        return hi
      }
      const stations = [...svg.querySelectorAll(`.station[data-lines~="${d}"]`)]
        .map((g) => ({ g, at: distanceAtX(Number(g.dataset.x)) }))
        .sort((a, b) => a.at - b.at)
      return { path, d, length, stations }
    })

    const fleet = []
    const dispatch = (line, at = 0) => {
      const g = document.createElementNS(NS, 'g')
      g.setAttribute('class', 'train')
      g.innerHTML = `<rect class="car" x="-28" y="-10" width="56" height="20" rx="10" fill="${COLOR[line.d]}"/><rect class="win" x="-18" y="-4" width="10" height="7" rx="2"/><rect class="win" x="-5" y="-4" width="10" height="7" rx="2"/><rect class="win" x="8" y="-4" width="10" height="7" rx="2"/>`
      layer.append(g)
      fleet.push({ line, g, pos: at, dwell: 0, pace: 120 + Math.random() * 50 })
    }
    for (const line of lines) {
      dispatch(line, Math.random() * line.length * 0.35)
      dispatch(line, line.length * (0.5 + Math.random() * 0.3))
    }

    const arrive = (station, d) => {
      const ping = station.querySelector(`.ping[data-d="${d}"]`)
      if (ping) restart(ping, 'go')
    }

    let visible = false
    new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(svg)

    let last = performance.now()
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (visible && !document.hidden) {
        for (const train of fleet) {
          const { line } = train
          if (train.dwell > 0) {
            train.dwell -= dt * speed.factor
          } else {
            const next = train.pos + train.pace * speed.factor * dt
            const stop = line.stations.find((s) => s.at > train.pos && s.at <= next)
            if (stop) {
              train.pos = stop.at
              train.dwell = 0.9
              arrive(stop.g, line.d)
            } else {
              train.pos = next
            }
            if (train.pos >= line.length) train.pos = 0
          }
          const p = line.path.getPointAtLength(train.pos)
          const q = line.path.getPointAtLength(Math.min(line.length, train.pos + 2))
          const angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI
          const edge = Math.min(train.pos, line.length - train.pos)
          train.g.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${angle.toFixed(1)})`)
          train.g.style.opacity = Math.max(0, Math.min(1, edge / 70)).toFixed(2)
        }
      }
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)

    // the depot sends out another train on a random line
    const depot = svg.querySelector('.depot')
    const sendTrain = () => {
      restart(depot, 'wiggle')
      if (fleet.length < 30) dispatch(lines[(Math.random() * lines.length) | 0])
    }
    depot.addEventListener('click', sendTrain)
    depot.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        sendTrain()
      }
    })
    svg.querySelectorAll('.station').forEach((g) => g.addEventListener('click', () => g.querySelectorAll('.ping').forEach((ping) => restart(ping, 'go'))))
  }

  // ↑ ↑ ↓ ↓ ← → ← → B A: rush hour
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
  let konami = 0
  addEventListener('keydown', (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
    konami = key === KONAMI[konami] ? konami + 1 : key === KONAMI[0] ? 1 : 0
    if (konami < KONAMI.length) return
    konami = 0
    show('map')
    const card = document.querySelector('.map-card')
    card.classList.add('rush')
    speed.factor = 3.4
    setTimeout(() => {
      card.classList.remove('rush')
      speed.factor = 1
    }, 9000)
  })

  if (!document.getElementById('view-map').hidden) startMap()
})()
