// One CV, four views of the same content.js: a git history, a transit map, a research paper and a personnel file.
;(() => {
  const cv = window.CV
  const { month, esc } = window.CVfmt

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
          <h1>${esc(cv.name)}</h1>
          <p class="lede">${esc(cv.role)} — ${esc(cv.focus)}</p>
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
        <g class="station" tabindex="0" role="button" data-id="${s.id}" aria-label="${esc(s.title)}, ${esc(s.when)}">
          ${ys.length > 1 ? `<line class="passage" x1="${s.x}" y1="${top}" x2="${s.x}" y2="${bottom}"/>` : ''}
          ${ys.map((y) => `<circle class="ring" cx="${s.x}" cy="${y}" r="13"/>`).join('')}
          <text x="${s.x}" y="${labelY}" text-anchor="middle">${esc(SHORT[s.id] ?? s.title)}</text>
          <text class="date" x="${s.x}" y="${labelY + 20}" text-anchor="middle">${esc(s.label)}</text>
        </g>`
    }

    const svg = `
      <svg class="map" viewBox="0 0 ${W} ${H}" role="group" aria-label="Transit map of roles, training and projects">
        <g class="axis">${years.map((ym) => `<line x1="${xOf(ym)}" y1="50" x2="${xOf(ym)}" y2="${H - 40}"/><text x="${xOf(ym)}" y="${H - 12}" text-anchor="middle">${ym.slice(0, 4)}</text>`).join('')}</g>
        ${DOMAINS.map((d) => `<path class="track" d="${track(d)}" stroke="${COLOR[d]}"/>`).join('')}
        <g class="depot"><rect x="${depot.x - 96}" y="${depot.y - 52}" width="192" height="104" rx="16"/><text x="${depot.x}" y="${depot.y - 6}" text-anchor="middle">UFAR</text><text class="depot-sub" x="${depot.x}" y="${depot.y + 22}" text-anchor="middle">since 2022</text></g>
        ${DOMAINS.map((d) => `<text class="now-label" x="${endX + 18}" y="${trackY[d] + 6}">NOW</text>`).join('')}
        ${stops.map(station).join('')}
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
      <p class="view-intro">The work as a transit network. Every line starts at university; roles, courses and projects are stations on the lines of the areas they belong to. Select a station to see it.</p>
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
          ${top.map(([tech, n], i) => `<text x="${left - 10}" y="${i * rowH + 16}" text-anchor="end">${esc(tech)}</text><line x1="${x(0)}" y1="${i * rowH + 12}" x2="${x(n)}" y2="${i * rowH + 12}" stroke="#c9ced6"/><circle cx="${x(n)}" cy="${i * rowH + 12}" r="5" fill="#0c2340"/>`).join('')}
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
        list.map((e) => `<rect x="${x(e.start)}" width="${Math.max(5, x(e.end, 'end') - x(e.start))}" height="12" rx="2" fill="${color}"/>`).join('')
      const rows = [
        ['Education', bars(education, '#00a651')],
        ['Employment', bars([...roles, ...earlier].filter((e) => e.kind === 'work'), '#0c2340')],
        ['NDA work', bars(roles.filter((e) => e.kind === 'nda'), '#b3261e')],
        ['Training', bars(earlier.filter((e) => e.kind === 'training'), '#8e44ad')],
        ['Projects', projects.map((p) => `<circle cx="${x(p.date)}" cy="6" r="5" fill="#0072ce" fill-opacity="0.85"/>`).join('')],
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
        <section class="sheet" aria-labelledby="d-subject">
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
      document.querySelectorAll(`.commit[data-lane="${button.dataset.lane}"]`).forEach((row) => (row.hidden = !on))
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
})()
