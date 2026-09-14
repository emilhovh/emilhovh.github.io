;(() => {
  const cv = window.CV
  const { month, range, esc } = window.CVfmt

  const LINES = [
    { id: 'web', code: 'W', color: 'var(--web)', hex: '#e4002b' },
    { id: 'data', code: 'D', color: 'var(--data)', hex: '#0072ce' },
    { id: 'ml', code: 'M', color: 'var(--ml)', hex: '#00a651' },
    { id: 'games', code: 'G', color: 'var(--games)', hex: '#f5a300' },
    { id: 'systems', code: 'S', color: 'var(--systems)', hex: '#8e44ad' },
  ]
  const lineOf = (id) => LINES.find((l) => l.id === id)

  // every stop on the network: roles and projects
  const stops = [
    ...cv.experience.map((e) => ({
      id: e.id,
      name: e.kind === 'nda' ? e.title : e.org,
      title: e.title,
      sub: `${e.kind === 'nda' ? 'Confidential client' : e.org} — ${range(e.start, e.end)}`,
      date: e.start,
      lines: e.domains,
      points: e.points,
      stack: e.stack,
      url: e.orgUrl,
      nda: e.kind === 'nda',
    })),
    ...cv.projects.map((p) => ({
      id: p.id,
      name: p.name,
      title: p.name,
      sub: `${p.tagline} — ${month(p.date)}`,
      date: p.date,
      lines: p.domains,
      text: p.text,
      stack: p.stack,
      url: p.url,
    })),
  ].sort((a, b) => a.date.localeCompare(b.date))

  // station names as printed on the map; full titles appear in the detail panel
  const SHORT = {
    'nda-games': 'Telegram games',
    'nda-mobile': 'Mobile app',
    'nda-fintech': 'Brokerage platform',
    bizzy: 'Bizzy Agency',
    rag: 'RAG Chatbot',
    statsphere: 'StatSphere',
    airpop: 'AirPop',
    eventsphere: 'EventSphere',
    ecc: 'ECC Validator',
    deepcarex: 'DeepCareX',
    complaint: 'Complaint-O-Tron',
  }

  // ---------- map geometry ----------
  const W = 1400
  const H = 620
  const depot = { x: 92, y: 320 }
  const trackY = { web: 110, data: 215, ml: 320, games: 425, systems: 520 }
  const from = new Date(2025, 0).getTime()
  const to = new Date(2026, 9).getTime()
  const endX = W - 90
  const xOf = (ym) => {
    const [y, m] = ym.split('-').map(Number)
    return 380 + ((new Date(y, m - 1).getTime() - from) / (to - from)) * (endX - 380 - 60)
  }

  // push stations apart on shared tracks, then alternate labels above and below each track
  const SPACING = 130
  const placed = []
  const perLine = {}
  for (const stop of stops) {
    let x = xOf(stop.date)
    for (const other of placed) {
      if (other.lines.some((l) => stop.lines.includes(l)) && Math.abs(other.x - x) < SPACING) x = other.x + SPACING
    }
    stop.x = Math.min(x, endX - 50)
    const primary = stop.lines[0]
    perLine[primary] = (perLine[primary] ?? 0) + 1
    stop.labelAbove = perLine[primary] % 2 === 1
    placed.push(stop)
  }

  const trackPath = (line) => {
    const y = trackY[line.id]
    const dy = y - depot.y
    // leave the depot, bend 45° onto the track, run east to today
    return `M ${depot.x + 60} ${depot.y} L ${depot.x + 110} ${depot.y} L ${depot.x + 110 + Math.abs(dy)} ${y} L ${endX} ${y}`
  }

  const years = ['2025-01', '2025-07', '2026-01', '2026-07']

  const stationSvg = (stop) => {
    const ys = stop.lines.map((l) => trackY[l])
    const top = Math.min(...ys)
    const bottom = Math.max(...ys)
    // an interchange is a ring on each of its lines, joined by a passage — it never claims the lines in between
    const connector = ys.length > 1 ? `<line class="passage" x1="${stop.x}" y1="${top}" x2="${stop.x}" y2="${bottom}"/>` : ''
    const rings = ys.map((y) => `<circle class="ring" cx="${stop.x}" cy="${y}" r="10"/>`).join('')
    const labelY = stop.labelAbove ? top - 34 : bottom + 30
    return `
      <g class="station" tabindex="0" role="button" data-id="${stop.id}" aria-label="${esc(stop.title)}, ${esc(stop.sub)}">
        ${connector}${rings}
        <text x="${stop.x}" y="${labelY}" text-anchor="middle">${esc(SHORT[stop.id] ?? stop.name)}</text>
        <text class="date" x="${stop.x}" y="${labelY + 14}" text-anchor="middle">${month(stop.date)}</text>
      </g>`
  }

  const mapSvg = `
    <svg class="map" viewBox="0 0 ${W} ${H}" role="group" aria-label="Transit map of roles and projects">
      <g class="axis">${years.map((ym) => `<line x1="${xOf(ym)}" y1="40" x2="${xOf(ym)}" y2="${H - 30}"/><text x="${xOf(ym)}" y="${H - 10}" text-anchor="middle">${month(ym)}</text>`).join('')}</g>
      ${LINES.map((line) => `<path class="track" d="${trackPath(line)}" stroke="${line.hex}"/>`).join('')}
      <g class="depot">
        <rect x="${depot.x - 72}" y="${depot.y - 40}" width="144" height="80" rx="12"/>
        <text x="${depot.x}" y="${depot.y - 6}" text-anchor="middle">UFAR</text>
        <text x="${depot.x}" y="${depot.y + 14}" text-anchor="middle" style="font-weight:600;font-size:11px">since Aug 2022</text>
      </g>
      <g class="now">${LINES.map((line) => `<text x="${endX + 14}" y="${trackY[line.id] + 4}">NOW</text>`).join('')}</g>
      ${stops.map(stationSvg).join('')}
    </svg>`

  const badges = (ids) => ids.map((id) => `<span class="badge" style="--c:${lineOf(id).color}" title="${cv.domains[id]}">${lineOf(id).code}</span>`).join('')

  const detailHtml = (stop) => `
    <div>
      <div class="lines-on">${badges(stop.lines)}</div>
      <h3>${esc(stop.title)}</h3>
      <p class="sub">${esc(stop.sub)}</p>
      ${stop.nda ? '<span class="nda">Client withheld under NDA</span>' : ''}
    </div>
    <div>
      ${stop.points ? `<ul>${stop.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : `<p>${esc(stop.text)}</p>`}
      <p class="stack">${esc(stop.stack.join(', '))}</p>
      ${stop.url ? `<a href="${stop.url}" rel="noopener">${stop.url.includes('github') ? 'View repository' : 'Visit site'} →</a>` : ''}
    </div>`

  const timetable = LINES.map((line) => {
    const onLine = stops.filter((s) => s.lines.includes(line.id)).slice().reverse()
    return `
      <article class="line-card" style="--c:${line.color}">
        <h3>${badges([line.id])} ${cv.domains[line.id]}</h3>
        <ol>${onLine.map((s) => `<li><time>${month(s.date)}</time><div><b>${esc(s.title)}</b><span>${esc(s.sub.split(' — ')[0])}</span></div></li>`).join('')}</ol>
      </article>`
  }).join('')

  document.getElementById('app').innerHTML = `
    <div class="wrap">
      <header class="sign">
        <span class="m" aria-hidden="true">E</span>
        <div class="text">
          <h1>${esc(cv.name)}</h1>
          <p>${esc(cv.role)} — ${esc(cv.focus.toLowerCase())}</p>
        </div>
        <div class="lines" aria-hidden="true">${badges(LINES.map((l) => l.id))}</div>
      </header>

      <div class="intro">
        <p>${esc(cv.summary)}</p>
        <div class="contacts">
          <a class="btn btn--plate" href="mailto:${cv.email}">${cv.email}</a>
          <a class="btn" href="${cv.links.github}" rel="noopener">GitHub</a>
          <a class="btn" href="${cv.links.linkedin}" rel="noopener">LinkedIn</a>
        </div>
      </div>

      <section class="map-card" aria-labelledby="network">
        <div class="map-head">
          <h2 id="network">Network map</h2>
          <ul class="legend">${LINES.map((l) => `<li style="--c:${l.color}"><i></i>${cv.domains[l.id]}</li>`).join('')}</ul>
        </div>
        <div class="map-scroll">${mapSvg}</div>
      </section>

      <section class="detail" id="detail" aria-live="polite"></section>

      <section class="section" aria-labelledby="timetable">
        <h2 id="timetable">Timetable by line</h2>
        <div class="timetable">${timetable}</div>
      </section>

      <section class="section two">
        <div class="skills" aria-labelledby="skills">
          <h2 id="skills">Rolling stock</h2>
          <dl>${cv.skills.map((g) => `<dt>${esc(g.group)}</dt><dd>${esc(g.items.join(', '))}</dd>`).join('')}</dl>
        </div>
        <div aria-labelledby="langs">
          <h2 id="langs">Announcements in</h2>
          <ul class="announce">${cv.languages.map((l) => `<li><b>${l.native}</b><span>${l.name}, ${l.level}/5</span></li>`).join('')}</ul>
          <h2 style="margin-top:32px">Depot</h2>
          ${cv.education.map((ed) => `<p><b>${esc(ed.title)}</b><br />${esc(ed.org)}, ${range(ed.start, ed.end)}</p>`).join('')}
        </div>
      </section>

      <footer>Older lines, now closed: ${cv.archive.map((a) => `<a href="${a.url}" rel="noopener">${esc(a.name)}</a> (${a.year})`).join(', ')}.</footer>
    </div>`

  // choosing a station shows its details; the newest stop is shown first
  const detail = document.getElementById('detail')
  const select = (id) => {
    const stop = stops.find((s) => s.id === id)
    if (!stop) return
    detail.innerHTML = detailHtml(stop)
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
  select(stops[stops.length - 1].id)
})()
