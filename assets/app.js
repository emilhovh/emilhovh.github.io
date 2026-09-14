// One CV in four views, four languages and six themes, all rendered from content.js.
//
// A language change re-renders the page (everything visible depends on it); a theme change only
// swaps tokens on <html>. Everything a render sets up — listeners, observers, timers, the trains —
// is registered for teardown, so switching language never leaves work running from the last one.
;(() => {
  const CV = window.CV
  const I18N = window.I18N

  const store = {
    get(key) {
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value)
      } catch {
        // private mode: preferences simply do not persist
      }
    },
  }

  const LOCALES = I18N.locales.map((l) => l.code)
  const THEMES = ['auto', 'daylight', 'night', 'blueprint', 'tuff', 'contrast']
  const VIEWS = ['timeline', 'map', 'paper', 'dossier']
  const DOMAINS = ['web', 'data', 'ml', 'games', 'systems']
  const CODE = { web: 'W', data: 'D', ml: 'M', games: 'G', systems: 'S' }
  const dvar = (d) => `var(--d-${d})`

  const params = new URLSearchParams(location.search)
  // motion is an enhancement: off for visitors who ask for reduced motion, and with ?static (screenshots, tests)
  const MOTION = !matchMedia('(prefers-reduced-motion: reduce)').matches && !params.has('static')
  if (MOTION) document.documentElement.classList.add('motion')

  function initialLocale() {
    const fromUrl = params.get('lang')
    if (LOCALES.includes(fromUrl)) return fromUrl
    const saved = store.get('cv.lang')
    if (LOCALES.includes(saved)) return saved
    for (const tag of navigator.languages ?? [navigator.language]) {
      const base = String(tag).slice(0, 2).toLowerCase()
      if (LOCALES.includes(base)) return base
    }
    return 'en'
  }

  function applyTheme(id) {
    const theme = THEMES.includes(id) ? id : 'auto'
    document.documentElement.dataset.theme = theme
    store.set('cv.theme', theme)
    const plate = getComputedStyle(document.documentElement).getPropertyValue('--plate').trim()
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', plate || '#0c2340')
    return theme
  }

  const initialView = location.hash.slice(1)
  const state = {
    locale: initialLocale(),
    theme: applyTheme(store.get('cv.theme')),
    view: VIEWS.includes(initialView) ? initialView : 'timeline',
    station: 'cretrix',
  }

  let teardown = null
  function mount({ keepScroll = true, focus = null } = {}) {
    const y = window.scrollY
    teardown?.()
    teardown = render()
    if (keepScroll) window.scrollTo(0, y)
    if (focus) document.querySelector(focus)?.focus()
  }

  // ---------- dates and ordering (language-independent) ----------

  const today = new Date()
  const NOW = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  /** '2026' as the start of a period is January, as the end it is December */
  const key = (ym, edge = 'start') => (!ym ? NOW : String(ym).length === 4 ? `${ym}-${edge === 'start' ? '01' : '12'}` : ym)

  const roles = CV.experience.slice().sort((a, b) => {
    if (!a.end !== !b.end) return a.end ? 1 : -1
    if (a.kind !== b.kind) return a.kind === 'work' ? -1 : 1
    return key(b.start).localeCompare(key(a.start))
  })
  const earlier = CV.earlier.slice().sort((a, b) => key(b.start).localeCompare(key(a.start)))
  const projects = CV.projects.slice().sort((a, b) => b.date.localeCompare(a.date))
  const education = CV.education
  const everything = [...roles, ...earlier, ...projects]
  const currentWork = roles.filter((r) => r.kind === 'work' && !r.end)
  const ndaCount = roles.filter((r) => r.kind === 'nda').length

  // ---------- render ----------

  function render() {
    const i18n = I18N.create(state.locale)
    const { t, L, month, list } = i18n
    const esc = (value) => String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

    const cleanups = []
    const on = (target, type, fn, options) => {
      target.addEventListener(type, fn, options)
      cleanups.push(() => target.removeEventListener(type, fn, options))
    }
    const later = (fn, ms) => {
      const id = setTimeout(fn, ms)
      cleanups.push(() => clearTimeout(id))
    }

    const root = document.documentElement
    root.lang = i18n.locale.code
    document.title = `${L(CV.name)} — ${L(CV.role)}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))

    const when = (e) => {
      if (!e.end) return `${month(e.start)} – ${t('dates.present')}`
      if (e.start === e.end) return month(e.start)
      return `${month(e.start)} – ${month(e.end)}`
    }
    const techKey = (item) => (typeof item === 'object' ? item.en : item)
    const stackOf = (items) => items.map(L)

    const badge = (d, cls = '') => `<span class="badge ${cls}" data-d="${d}" title="${esc(L(CV.domains[d]))}">${CODE[d]}</span>`
    const chips = (items) => `<ul class="chips">${items.map((item) => `<li>${esc(L(item))}</li>`).join('')}</ul>`
    const redact = () =>
      `<span class="redact" tabindex="0" role="img" aria-label="${esc(t('nda.aria'))}" data-tip="${esc(t('nda.tip'))}">████████████</span><span class="nda-tag">${t('nda.tag')}</span>`
    const orgOf = (e) => (e.kind === 'nda' ? redact() : e.orgUrl ? `<a href="${e.orgUrl}" rel="noopener">${esc(L(e.org))}</a>` : esc(L(e.org)))
    const cefr = (lang) => (lang.cefr === 'native' ? L(CV.nativeLevel) : lang.cefr)
    /** a heading split into letters that can rise one by one; words stay unbreakable */
    const letters = (text) =>
      `<span aria-hidden="true">${text
        .split(' ')
        .map((word) => `<span class="word">${[...word].map((ch) => `<span class="ch">${esc(ch)}</span>`).join('')}</span>`)
        .join(' ')}</span>`

    // ---------- masthead with language and theme controls ----------

    const swatch = (id) =>
      id === 'auto'
        ? `<span class="theme-swatch" data-theme="daylight" aria-hidden="true"><i></i><i></i><i></i><span class="theme-swatch theme-swatch--half" data-theme="night"><i></i></span></span>`
        : `<span class="theme-swatch" data-theme="${id}" aria-hidden="true"><i></i><i></i><i></i></span>`

    const masthead = `
      <header class="masthead">
        <div class="wrap">
          <div class="utility">
            <p class="place">${esc(L(CV.location))}</p>
            <div class="controls">
              <div class="lang-switch" role="group" aria-label="${esc(t('controls.language'))}">
                ${I18N.locales
                  .map(
                    (l) =>
                      `<button type="button" class="lang-btn" data-lang="${l.code}" lang="${l.code}" aria-pressed="${l.code === i18n.locale.code}" title="${esc(l.label)}"><span aria-hidden="true">${l.short}</span><span class="visually-hidden">${esc(l.label)}</span></button>`,
                  )
                  .join('')}
              </div>
              <div class="theme-picker">
                <button type="button" class="theme-btn" aria-haspopup="true" aria-expanded="false" aria-controls="theme-menu" aria-label="${esc(t('controls.theme'))}: ${esc(t(`themes.${state.theme}.name`))}">
                  <span class="theme-btn__swatch">${swatch(state.theme)}</span><span class="theme-btn__label">${esc(t(`themes.${state.theme}.name`))}</span>
                </button>
                <div class="theme-menu" id="theme-menu" role="radiogroup" aria-label="${esc(t('controls.themeMenu'))}" hidden>
                  ${THEMES.map(
                    (id) =>
                      `<button type="button" role="radio" class="theme-option" data-theme-id="${id}" aria-checked="${id === state.theme}">${swatch(id)}<span><b>${esc(t(`themes.${id}.name`))}</b><small>${esc(t(`themes.${id}.note`))}</small></span></button>`,
                  ).join('')}
                </div>
              </div>
            </div>
          </div>
          <div class="masthead__grid">
            <div>
              <h1 aria-label="${esc(L(CV.name))}">${letters(L(CV.name))}</h1>
              <p class="lede">${esc(L(CV.role))} — ${esc(L(CV.focus))}<span class="caret" aria-hidden="true"></span></p>
              <p class="summary">${esc(L(CV.summary))}</p>
              <div class="actions">
                <a class="btn btn--solid" href="mailto:${CV.email}">${esc(t('masthead.email'))}</a>
                <a class="btn" href="${CV.links.github}" rel="noopener">GitHub</a>
                <a class="btn" href="${CV.links.linkedin}" rel="noopener">LinkedIn</a>
              </div>
            </div>
            <aside class="now" aria-labelledby="now-title">
              <h2 id="now-title">${esc(t('masthead.now'))}</h2>
              <ul class="now-list">
                ${currentWork.map((r) => `<li>${badge(r.domains[0])}<div><b>${esc(L(r.title))}</b><span class="org">${esc(L(r.org))}, ${esc(t('dates.since', { date: month(r.start) }))}</span></div></li>`).join('')}
                <li>${badge('games')}<div><b>${esc(t('masthead.ndaCount', { count: ndaCount }))}</b><span class="org">${esc(t('masthead.ndaKinds'))} <span class="nda-tag">${t('nda.tag')}</span></span></div></li>
              </ul>
              <ul class="legend" aria-label="${esc(t('masthead.legend'))}">
                ${DOMAINS.map((d) => `<li>${badge(d, 'badge--sm')}${esc(L(CV.domains[d]))}</li>`).join('')}
              </ul>
            </aside>
          </div>
        </div>
      </header>`

    const switcher = `
      <nav class="views" aria-label="${esc(t('views.aria'))}">
        <div class="wrap views__list" role="tablist">
          ${VIEWS.map((id) => `<button class="view-tab" role="tab" id="tab-${id}" aria-controls="view-${id}" aria-selected="false" tabindex="-1" data-view="${id}"><b>${esc(t(`views.${id}.name`))}</b><span>${esc(t(`views.${id}.hint`))}</span></button>`).join('')}
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
        ...roles.map((e) => ({ id: e.id, lane: e.kind === 'nda' ? 'nda' : 'work', sort: key(e.start), when: when(e), title: L(e.title), org: orgOf(e), points: e.points, stack: e.stack, domains: e.domains, current: !e.end })),
        ...earlier.map((e) => ({ id: e.id, lane: e.kind === 'training' ? 'study' : 'work', sort: key(e.start), when: when(e), title: L(e.title), org: orgOf(e), points: e.points, stack: e.stack, domains: e.domains, current: !e.end })),
        ...projects.map((p) => ({ id: p.id, lane: 'projects', sort: p.date, when: month(p.date), title: p.name, org: esc(L(p.tagline)), text: p.text, stack: p.stack, domains: p.domains, url: p.url, featured: p.featured })),
        ...education.map((ed) => ({ id: ed.id, lane: 'study', sort: key(ed.start), when: when(ed), title: L(ed.title), org: esc(L(ed.org)), text: ed.note, domains: [], current: !ed.end })),
      ].sort((a, b) => b.sort.localeCompare(a.sort))

      const seen = new Set()
      for (const c of commits) {
        c.head = c.current && !seen.has(c.lane)
        if (c.head) seen.add(c.lane)
      }

      const row = (c) => `
        <li class="commit ${c.head ? 'is-head' : ''}" data-lane="${c.lane}" style="--lane:${LANES.indexOf(c.lane)};--dot:${c.domains[0] ? dvar(c.domains[0]) : 'var(--ink)'}">
          <div class="rail" aria-hidden="true"><span class="dot"></span></div>
          <article class="commit-body">
            <div class="commit-top">
              <p class="meta"><code class="hash">${hash(c.id + c.sort)}</code><time>${esc(c.when)}</time>${c.head ? `<span class="ref ref--head">HEAD → ${esc(t(`timeline.lanes.${c.lane}`))}</span>` : ''}${c.featured ? `<span class="ref">${esc(t('timeline.featured'))}</span>` : ''}</p>
              <span>${c.domains.map((d) => badge(d, 'badge--sm')).join(' ')}</span>
            </div>
            <h3>${esc(c.title)}</h3>
            <p class="org-line">${c.org}</p>
            ${c.points ? `<ul class="points">${c.points.map((p) => `<li>${esc(L(p))}</li>`).join('')}</ul>` : ''}
            ${c.text ? `<p class="text">${esc(L(c.text))}</p>` : ''}
            ${c.stack ? chips(c.stack) : ''}
            ${c.url ? `<a class="repo-link" href="${c.url}" rel="noopener">${esc(t('timeline.repo'))}</a>` : ''}
          </article>
        </li>`

      const count = (lane) => commits.filter((c) => c.lane === lane).length
      const diff = CV.skills
        .map((g) => [`<div class="hunk">@@ ${esc(L(g.group))} @@</div>`, ...g.items.map((item) => `<div class="add">+ ${esc(L(item))}</div>`)].join(''))
        .join('')

      return `
        <p class="view-intro">${esc(t('timeline.intro'))}</p>
        <div class="timeline">
          <div>
            <div class="branches" role="group" aria-label="${esc(t('timeline.branches'))}">
              ${LANES.map((l) => `<button class="branch" type="button" aria-pressed="true" data-lane="${l}"><i></i>${esc(t(`timeline.lanes.${l}`))}<small>${count(l)}</small></button>`).join('')}
            </div>
            <ol class="log">${commits.map(row).join('')}</ol>
          </div>
          <aside>
            <section class="aside-block" aria-labelledby="t-skills"><h2 id="t-skills">${esc(t('timeline.skills'))}</h2><div class="diff">${diff}</div></section>
            <section class="aside-block" aria-labelledby="t-langs"><h2 id="t-langs">${esc(t('timeline.languages'))}</h2>
              ${CV.languages.map((l) => `<div class="lang-row"><div><b>${esc(L(l.name))}</b> <span lang="${l.code}">${esc(l.endonym)}</span> <span>${esc(cefr(l))}</span></div><div class="meter" aria-label="${esc(cefr(l))}">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= l.level ? 'on' : ''}"></i>`).join('')}</div></div>`).join('')}
            </section>
            <section class="aside-block" aria-labelledby="t-certs"><h2 id="t-certs">${esc(t('timeline.certificates'))}</h2>
              <ul class="plain-list">${CV.certificates.map((c) => `<li>${esc(L(c.name))}<small>${esc(L(c.org))}${c.year ? `, ${c.year}` : ''}</small></li>`).join('')}</ul>
            </section>
            ${
              CV.archive.length
                ? `<section class="aside-block" aria-labelledby="t-archive"><h2 id="t-archive">${esc(t('timeline.archive'))}</h2>
              <ul class="plain-list">${CV.archive.map((a) => `<li><a href="${a.url}" rel="noopener">${esc(L(a.name))}</a><small>${a.year}</small></li>`).join('')}</ul></section>`
                : ''
            }
          </aside>
        </div>`
    }

    // ---------- view 2: map ----------

    const stops = [
      ...[...roles, ...earlier].map((e) => ({
        id: e.id,
        title: L(e.title),
        short: L(e.short) || L(e.org) || L(e.title),
        org: e.kind === 'nda' ? null : L(e.org),
        nda: e.kind === 'nda',
        when: when(e),
        date: key(e.start),
        label: e.end ? month(e.start) : t('map.nowStation'),
        lines: e.domains,
        points: e.points,
        stack: e.stack,
        url: e.orgUrl,
      })),
      ...projects.map((p) => ({ id: p.id, title: p.name, short: p.short ?? p.name, org: L(p.tagline), when: month(p.date), date: p.date, label: month(p.date), lines: p.domains, text: p.text, stack: p.stack, url: p.url })),
    ].sort((a, b) => a.date.localeCompare(b.date))

    // "the work" stations for work entries are named by employer, so rename: employer-named stops keep their org
    for (const stop of stops) {
      const entry = [...roles, ...earlier].find((e) => e.id === stop.id)
      if (entry && entry.kind === 'work' && !entry.short) stop.short = L(entry.org)
    }

    function mapView() {
      const H = 780
      const depot = { x: 120, y: 400 }
      const trackY = { web: 130, data: 265, ml: 400, games: 535, systems: 660 }
      const monthsFrom = (ym) => {
        const [y, m] = ym.split('-').map(Number)
        return (y - 2024) * 12 + (m - 1)
      }
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
      const terminus = t('map.terminus')
      const W = endX + 40 + terminus.length * 12

      const track = (d) => {
        const y = trackY[d]
        return `M ${depot.x + 80} ${depot.y} L ${depot.x + 140} ${depot.y} L ${depot.x + 140 + Math.abs(y - depot.y)} ${y} L ${endX} ${y}`
      }
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
            <text x="${s.x}" y="${labelY}" text-anchor="middle">${esc(s.short)}</text>
            <text class="date" x="${s.x}" y="${labelY + 20}" text-anchor="middle">${esc(s.label)}</text>
          </g>`
      }

      const svg = `
        <svg class="map" viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(t('map.aria'))}">
          <g class="axis">${['2024-01', '2025-01', '2026-01'].map((ym) => `<line x1="${xOf(ym)}" y1="50" x2="${xOf(ym)}" y2="${H - 40}"/><text x="${xOf(ym)}" y="${H - 12}" text-anchor="middle">${ym.slice(0, 4)}</text>`).join('')}</g>
          ${DOMAINS.map((d) => `<path class="track" data-d="${d}" d="${track(d)}" style="stroke:${dvar(d)}"/>`).join('')}
          ${stops.map(station).join('')}
          <g class="trains" aria-hidden="true"></g>
          <g class="depot"${MOTION ? ` role="button" tabindex="0" aria-label="${esc(t('map.depotAria'))}"` : ''}>
            <rect x="${depot.x - 96}" y="${depot.y - 52}" width="192" height="104" rx="16"/>
            <circle class="signal" cx="${depot.x + 74}" cy="${depot.y - 32}" r="6" style="fill:var(--d-ml)"/>
            <circle class="signal" cx="${depot.x + 74}" cy="${depot.y - 14}" r="6" style="fill:var(--d-web)"/>
            <text x="${depot.x}" y="${depot.y - 6}" text-anchor="middle">${esc(t('map.depot'))}</text>
            <text class="depot-sub" x="${depot.x}" y="${depot.y + 22}" text-anchor="middle">${esc(t('map.depotSince'))}</text>
          </g>
          ${DOMAINS.map((d) => `<text class="terminus" x="${endX + 18}" y="${trackY[d] + 6}">${esc(terminus)}</text>`).join('')}
        </svg>`

      const timetable = DOMAINS.map((d) => {
        const onLine = stops.filter((s) => s.lines.includes(d)).slice().reverse()
        return `
          <article class="line-card" style="--c:${dvar(d)}">
            <h3>${badge(d)} ${esc(L(CV.domains[d]))}</h3>
            <ol>${onLine.map((s) => `<li><time>${esc(s.when)}</time><div><b>${esc(s.title)}</b><span>${s.nda ? esc(L(roles.find((r) => r.id === s.id).org)) : esc(s.org)}</span></div></li>`).join('')}</ol>
          </article>`
      }).join('')

      return `
        <p class="view-intro">${esc(t('map.intro'))}${MOTION ? ` ${esc(t('map.depotTip'))}` : ''}</p>
        <section class="map-card" aria-label="${esc(t('map.aria'))}" data-rush="${esc(t('map.rush'))}"><p class="map-hint">${esc(t('map.hint'))}</p><div class="map-scroll">${svg}</div></section>
        <section class="stop-detail" id="stop-detail" aria-live="polite"></section>
        <h2 class="section-title">${esc(t('map.timetable'))}</h2>
        <div class="timetable">${timetable}</div>`
    }

    const stopDetail = (s) => `
      <div>
        <div class="badges">${s.lines.map((d) => badge(d)).join('')}</div>
        <h3>${esc(s.title)}</h3>
        <p class="sub">${s.nda ? redact() : s.url && s.org && !s.url.includes('github') ? `<a href="${s.url}" rel="noopener">${esc(s.org)}</a>` : esc(s.org ?? '')}</p>
        <p class="sub">${esc(s.when)}</p>
      </div>
      <div>
        ${s.points ? `<ul>${s.points.map((p) => `<li>${esc(L(p))}</li>`).join('')}</ul>` : `<p>${esc(L(s.text))}</p>`}
        ${chips(s.stack)}
        ${s.url && s.url.includes('github') ? `<p style="margin-top:12px"><a href="${s.url}" rel="noopener">${esc(t('map.repo'))}</a></p>` : ''}
      </div>`

    // ---------- view 3: paper ----------

    function paperView() {
      const refs = projects.filter((p) => p.url)
      const refNo = (id) => refs.findIndex((p) => p.id === id) + 1

      const counts = new Map()
      for (const entry of everything) {
        for (const item of entry.stack) {
          const k = techKey(item)
          const known = counts.get(k) ?? { label: L(item), n: 0 }
          known.n++
          counts.set(k, known)
        }
      }
      const top = [...counts.values()].sort((a, b) => b.n - a.n || a.label.localeCompare(b.label, i18n.locale.intl)).slice(0, 14)

      const figure1 = () => {
        const rowH = 24
        const left = 200
        const width = 700
        const height = top.length * rowH + 34
        const max = Math.max(...top.map((r) => r.n))
        const x = (n) => left + (n / max) * (width - left - 30)
        return `
          <svg class="fig" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(t('paper.fig1Aria'))}">
            ${Array.from({ length: max + 1 }, (_, n) => `<line class="grid" x1="${x(n)}" y1="0" x2="${x(n)}" y2="${height - 24}"/><text x="${x(n)}" y="${height - 8}" text-anchor="middle">${i18n.number(n)}</text>`).join('')}
            ${top.map((r, i) => `<text x="${left - 10}" y="${i * rowH + 16}" text-anchor="end">${esc(r.label)}</text><line class="stem" pathLength="1" x1="${x(0)}" y1="${i * rowH + 12}" x2="${x(r.n)}" y2="${i * rowH + 12}" style="--i:${i}"/><circle class="dot" cx="${x(r.n)}" cy="${i * rowH + 12}" r="5" style="--i:${i}"/>`).join('')}
          </svg>`
      }

      const figure2 = () => {
        const width = 700
        const left = 200
        const from = new Date(2019, 0).getTime()
        const to = new Date(2027, 0).getTime()
        const x = (ym, edge) => {
          const [y, m] = key(ym, edge).split('-').map(Number)
          return left + ((new Date(y, m - 1).getTime() - from) / (to - from)) * (width - left - 16)
        }
        const bars = (entries, kind) =>
          entries.map((e, i) => `<rect class="bar bar--${kind}" style="--i:${i}" x="${x(e.start)}" width="${Math.max(5, x(e.end, 'end') - x(e.start))}" height="12" rx="2"/>`).join('')
        const rows = [
          ['education', bars(education, 'education')],
          ['employment', bars([...roles, ...earlier].filter((e) => e.kind === 'work'), 'employment')],
          ['nda', bars(roles.filter((e) => e.kind === 'nda'), 'nda')],
          ['training', bars(earlier.filter((e) => e.kind === 'training'), 'training')],
          ['projects', projects.map((p, i) => `<circle class="dot dot--project" style="--i:${i}" cx="${x(p.date)}" cy="6" r="5"/>`).join('')],
        ]
        const rowH = 30
        const height = rows.length * rowH + 30
        return `
          <svg class="fig" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(t('paper.fig2Aria'))}">
            ${[2019, 2021, 2023, 2025, 2027].map((y) => `<line class="grid" x1="${x(`${y}-01`)}" y1="0" x2="${x(`${y}-01`)}" y2="${height - 24}"/><text x="${x(`${y}-01`)}" y="${height - 8}" text-anchor="middle">${y}</text>`).join('')}
            ${rows.map(([row, marks], i) => `<text x="${left - 10}" y="${i * rowH + 18}" text-anchor="end">${esc(t(`paper.rows.${row}`))}</text><g transform="translate(0 ${i * rowH + 6})">${marks}</g>`).join('')}
          </svg>`
      }

      const dagger = '<sup><a href="#fn-nda" aria-label="footnote">†</a></sup>'
      const roleRow = (e) => `
        <tr>
          <td class="when">${esc(when(e))}</td>
          <td><b>${esc(L(e.title))}</b>${e.kind === 'nda' ? dagger : ''}<small>${e.kind === 'nda' ? redact() : esc(L(e.org))}</small></td>
          <td>${esc(e.points.map(L).join('; '))}.<small>${esc(stackOf(e.stack).join(', '))}</small></td>
        </tr>`
      const tableHead = `<thead><tr><th>${esc(t('paper.period'))}</th><th>${esc(t('paper.role'))}</th><th>${esc(t('paper.contribution'))}</th></tr></thead>`
      const reference = (name, year) => esc(t('paper.reference', { name, year }))

      return `
        <div class="paper-tools"><button class="btn btn--ink" type="button" data-print>${esc(t('paper.print'))}</button></div>
        <article class="paper">
          <div class="running" aria-hidden="true"><span>${esc(t('paper.running'))}</span><span>${esc(L(CV.location))}, ${today.getFullYear()}</span></div>
          <header class="paper-title">
            <h2>${esc(t('paper.title'))}</h2>
            <p>${esc(L(CV.name))}</p>
            <p class="affil">${esc([...currentWork.map((r) => L(r.org)), L(education[0].org), L(CV.location)].join(' · '))}</p>
            <p class="mono" style="font-size:13px;margin-top:8px"><a href="mailto:${CV.email}">${CV.email}</a> · <a href="${CV.links.github}" rel="noopener">github.com/emilhovh</a> · <a href="${CV.links.linkedin}" rel="noopener">LinkedIn</a></p>
          </header>

          <section class="abstract" aria-labelledby="p-abstract">
            <h3 id="p-abstract">${esc(t('paper.abstract'))}</h3>
            <p>${esc(L(CV.summary))}</p>
            <p style="margin-top:8px"><i>${esc(t('paper.keywords'))}</i> — ${esc(t('paper.keywordList'))}</p>
          </section>

          <h3 class="num"><span class="n">1</span>${esc(t('paper.experience'))}</h3>
          <div class="table-wrap"><table>
            <caption><b>${esc(t('paper.table', { n: 1 }))}</b> ${esc(t('paper.currentCaption'))}</caption>
            ${tableHead}
            <tbody>${roles.map(roleRow).join('')}</tbody>
          </table></div>
          <div class="table-wrap"><table>
            <caption><b>${esc(t('paper.table', { n: 2 }))}</b> ${esc(t('paper.earlierCaption'))}</caption>
            ${tableHead}
            <tbody>${earlier.map(roleRow).join('')}</tbody>
          </table></div>

          <h3 class="num"><span class="n">2</span>${esc(t('paper.projects'))}</h3>
          ${projects.map((p, i) => `<h4><span class="n">2.${i + 1}</span>${esc(p.name)}</h4><p><i>${esc(L(p.tagline))}.</i> ${esc(L(p.text))} ${esc(t('paper.builtWith', { list: list(stackOf(p.stack)) }))}${p.url ? ` <sup><a href="#ref-${p.id}">[${refNo(p.id)}]</a></sup>` : ''}</p>`).join('')}

          <h3 class="num"><span class="n">3</span>${esc(t('paper.analysis'))}</h3>
          <p>${esc(t('paper.analysisText', { count: i18n.number(everything.length) }))}</p>
          <figure>${figure1()}<figcaption><b>${esc(t('paper.figure', { n: 1 }))}</b> ${esc(t('paper.fig1', { n: i18n.number(top.length) }))}</figcaption></figure>
          <figure>${figure2()}<figcaption><b>${esc(t('paper.figure', { n: 2 }))}</b> ${esc(t('paper.fig2'))}</figcaption></figure>
          <p>${esc(t('paper.skillsByArea', { list: CV.skills.map((g) => `${L(g.group)} (${g.items.map(L).join(', ')})`).join('; ') }))}</p>

          <h3 class="num"><span class="n">4</span>${esc(t('paper.education'))}</h3>
          ${education.map((ed) => `<p><b>${esc(L(ed.title))}</b>, ${esc(L(ed.org))}, ${esc(when(ed))}. ${esc(L(ed.note))}</p>`).join('')}
          <div class="table-wrap"><table>
            <caption><b>${esc(t('paper.table', { n: 3 }))}</b> ${esc(t('paper.languagesCaption'))}</caption>
            <thead><tr><th>${esc(t('paper.language'))}</th><th>${esc(t('paper.name'))}</th><th>${esc(t('paper.level'))}</th></tr></thead>
            <tbody>${CV.languages.map((l) => `<tr><td>${esc(L(l.name))}</td><td lang="${l.code}">${esc(l.endonym)}</td><td>${esc(cefr(l))}</td></tr>`).join('')}</tbody>
          </table></div>
          <p>${esc(t('paper.certificates', { list: list(CV.certificates.map((c) => `${L(c.name)} (${L(c.org)}${c.year ? `, ${c.year}` : ''})`)) }))}</p>

          <h3 class="num">${esc(t('paper.references'))}</h3>
          <ol class="references">
            ${refs.map((p, i) => `<li id="ref-${p.id}"><span>[${i + 1}]</span><span>${reference(p.name, p.date.slice(0, 4))} <code><a href="${p.url}" rel="noopener">${p.url.replace('https://', '')}</a></code></span></li>`).join('')}
            ${CV.archive.map((a, i) => `<li><span>[${refs.length + i + 1}]</span><span>${reference(L(a.name), a.year)} <code><a href="${a.url}" rel="noopener">${a.url.replace('https://', '')}</a></code></span></li>`).join('')}
          </ol>
          <div class="footnotes"><p id="fn-nda">${esc(t('paper.footnote'))}</p></div>
        </article>`
    }

    // ---------- view 4: dossier ----------

    function dossierView() {
      const record = (e) => `
        <div class="record">
          <h4>${esc(L(e.title))}</h4>
          <p class="when">${esc(when(e))} — ${e.kind === 'nda' ? `${esc(t('dossier.client'))}: ${redact()}` : orgOf(e)}</p>
          <ul>${e.points.map((p) => `<li>${esc(L(p))}</li>`).join('')}</ul>
          <p class="equipment">${esc(t('dossier.equipment'))}: ${esc(stackOf(e.stack).join(', '))}</p>
        </div>`

      const caseFile = (p, i) => `
        <article class="case" style="--c:${dvar(p.domains[0])}">
          <p class="case-no">${esc(t('dossier.caseNo'))} EH-${p.date.replace('-', '')}-${String(i + 1).padStart(2, '0')}</p>
          <h4>${esc(p.name)}</h4>
          <p><i>${esc(L(p.tagline))}</i></p>
          <p>${esc(L(p.text))}</p>
          ${p.url ? `<p><a href="${p.url}" rel="noopener">${esc(t('dossier.evidence'))}</a></p>` : `<p style="color:var(--faint)">${esc(t('dossier.evidencePrivate'))}</p>`}
        </article>`

      return `
        <p class="view-intro">${esc(t('dossier.intro'))}</p>
        <div class="dossier">
          <section class="sheet cover" aria-labelledby="d-subject">
            <span class="sheet-tab" aria-hidden="true">${esc(t('dossier.tab'))}</span>
            <div class="stamp" aria-hidden="true">${esc(t('dossier.stamp'))}</div>
            <p class="file-no">${esc(t('dossier.fileNo'))}</p>
            <h2 id="d-subject">${esc(L(CV.name))}</h2>
            <p>${esc(L(CV.role))} — ${esc(L(CV.focus))}</p>
            <dl class="fields">
              <dt>${esc(t('dossier.currentPosts'))}</dt><dd>${currentWork.map((r) => `${esc(L(r.title))}, ${orgOf(r)}`).join('<br />')}</dd>
              <dt>${esc(t('dossier.classified'))}</dt><dd>${esc(t('dossier.classifiedValue', { count: ndaCount }))} <span class="nda-tag">${t('nda.tag')}</span></dd>
              <dt>${esc(t('dossier.base'))}</dt><dd>${esc(L(CV.location))}</dd>
              <dt>${esc(t('dossier.training'))}</dt><dd>${education.map((ed) => `${esc(L(ed.title))}, ${esc(L(ed.org))}`).join('<br />')}</dd>
              <dt>${esc(t('dossier.languages'))}</dt><dd>${esc(CV.languages.map((l) => `${L(l.name)} (${cefr(l)})`).join(', '))}</dd>
              <dt>${esc(t('dossier.contact'))}</dt><dd><a href="mailto:${CV.email}">${CV.email}</a> · <a href="${CV.links.github}" rel="noopener">GitHub</a> · <a href="${CV.links.linkedin}" rel="noopener">LinkedIn</a></dd>
            </dl>
          </section>

          <section class="sheet" aria-labelledby="d-assign">
            <span class="sheet-tab" aria-hidden="true">§ 1</span>
            <h3 class="section" id="d-assign"><span>§1</span> ${esc(t('dossier.assignments'))}</h3>
            ${roles.map(record).join('')}
          </section>

          <section class="sheet" aria-labelledby="d-earlier">
            <span class="sheet-tab" aria-hidden="true">§ 2</span>
            <h3 class="section" id="d-earlier"><span>§2</span> ${esc(t('dossier.earlier'))}</h3>
            ${earlier.map(record).join('')}
          </section>

          <section class="sheet" aria-labelledby="d-cases">
            <span class="sheet-tab" aria-hidden="true">§ 3</span>
            <h3 class="section" id="d-cases"><span>§3</span> ${esc(t('dossier.cases'))}</h3>
            <div class="cases">${projects.map(caseFile).join('')}</div>
          </section>

          <section class="sheet" aria-labelledby="d-cap">
            <span class="sheet-tab" aria-hidden="true">§ 4</span>
            <h3 class="section" id="d-cap"><span>§4</span> ${esc(t('dossier.capabilities'))}</h3>
            <div class="capabilities">${CV.skills.map((g) => `<div><h4>${esc(L(g.group))}</h4><p>${esc(g.items.map(L).join(', '))}</p></div>`).join('')}</div>
            <h3 class="section" style="margin-top:28px"><span>§5</span> ${esc(t('dossier.certificates'))}</h3>
            <ul>${CV.certificates.map((c) => `<li>${esc(L(c.name))} — ${esc(L(c.org))}${c.year ? `, ${c.year}` : ''}</li>`).join('')}</ul>
            <div class="signoff"><span>${esc(t('dossier.signoff'))}</span><span class="signature" aria-hidden="true">${esc(t('dossier.signature'))}</span></div>
          </section>
        </div>`
    }

    // ---------- page ----------

    document.getElementById('app').innerHTML = `
      ${masthead}
      ${switcher}
      <main>
        ${VIEWS.map((id) => `<section class="view wrap" id="view-${id}" role="tabpanel" aria-labelledby="tab-${id}" hidden>${{ timeline: timelineView, map: mapView, paper: paperView, dossier: dossierView }[id]()}</section>`).join('')}
      </main>
      <footer class="site-footer"><div class="wrap"><span>${esc(L(CV.name))} · <a href="mailto:${CV.email}">${CV.email}</a></span><span>${esc(t('footer'))}</span></div></footer>`

    // ---------- language and theme ----------

    document.querySelectorAll('.lang-btn').forEach((button) => {
      on(button, 'click', () => {
        const code = button.dataset.lang
        if (code === state.locale) return
        state.locale = code
        store.set('cv.lang', code)
        const url = new URL(location.href)
        url.searchParams.set('lang', code)
        history.replaceState(null, '', url)
        mount({ focus: `.lang-btn[data-lang="${code}"]` })
      })
    })

    const themeButton = document.querySelector('.theme-btn')
    const themeMenu = document.getElementById('theme-menu')
    const setMenu = (open) => {
      themeMenu.hidden = !open
      themeButton.setAttribute('aria-expanded', String(open))
      if (open) themeMenu.querySelector('[aria-checked="true"]')?.focus()
    }
    const chooseTheme = (id) => {
      state.theme = applyTheme(id)
      themeMenu.querySelectorAll('.theme-option').forEach((option) => option.setAttribute('aria-checked', String(option.dataset.themeId === state.theme)))
      themeButton.querySelector('.theme-btn__swatch').innerHTML = swatch(state.theme)
      themeButton.querySelector('.theme-btn__label').textContent = t(`themes.${state.theme}.name`)
      themeButton.setAttribute('aria-label', `${t('controls.theme')}: ${t(`themes.${state.theme}.name`)}`)
    }
    on(themeButton, 'click', () => setMenu(themeMenu.hidden))
    themeMenu.querySelectorAll('.theme-option').forEach((option, index, all) => {
      on(option, 'click', () => {
        chooseTheme(option.dataset.themeId)
        setMenu(false)
        themeButton.focus()
      })
      on(option, 'keydown', (event) => {
        const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
        if (!step) return
        event.preventDefault()
        all[(index + step + all.length) % all.length].focus()
      })
    })
    on(document, 'click', (event) => {
      if (!themeMenu.hidden && !event.target.closest('.theme-picker')) setMenu(false)
    })
    on(document, 'keydown', (event) => {
      if (event.key === 'Escape' && !themeMenu.hidden) {
        setMenu(false)
        themeButton.focus()
      }
    })

    // ---------- views ----------

    const tabs = [...document.querySelectorAll('.view-tab')]
    const show = (id, focus = false) => {
      if (!VIEWS.includes(id)) id = VIEWS[0]
      state.view = id
      for (const tab of tabs) {
        const active = tab.dataset.view === id
        tab.setAttribute('aria-selected', String(active))
        tab.tabIndex = active ? 0 : -1
        if (active && focus) tab.focus()
      }
      for (const v of VIEWS) document.getElementById(`view-${v}`).hidden = v !== id
      history.replaceState(null, '', `${location.pathname}${location.search}#${id}`)
      onViewShown(id)
    }
    tabs.forEach((tab, index) => {
      on(tab, 'click', () => show(tab.dataset.view))
      on(tab, 'keydown', (event) => {
        const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
        if (!step) return
        event.preventDefault()
        show(tabs[(index + step + tabs.length) % tabs.length].dataset.view, true)
      })
    })

    // timeline branch filters
    document.querySelectorAll('.branch').forEach((button) => {
      on(button, 'click', () => {
        const visible = button.getAttribute('aria-pressed') !== 'true'
        button.setAttribute('aria-pressed', String(visible))
        document.querySelectorAll(`.commit[data-lane="${button.dataset.lane}"]`).forEach((row) => {
          if (!MOTION) {
            row.hidden = !visible
            return
          }
          if (visible) {
            row.hidden = false
            row.classList.remove('leaving', 'seen')
            requestAnimationFrame(() => requestAnimationFrame(() => row.classList.add('seen')))
          } else {
            row.classList.add('leaving')
            later(() => {
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
      state.station = id
      detail.innerHTML = stopDetail(stop)
      document.querySelectorAll('.station').forEach((g) => g.classList.toggle('is-on', g.dataset.id === id))
    }
    document.querySelectorAll('.station').forEach((g) => {
      on(g, 'click', () => select(g.dataset.id))
      on(g, 'keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          select(g.dataset.id)
        }
      })
    })
    select(state.station)

    const printButton = document.querySelector('[data-print]')
    if (printButton) on(printButton, 'click', () => window.print())

    // ---------- motion ----------

    let onViewShown = () => {}

    if (MOTION) {
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
      cleanups.push(() => observer.disconnect())
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
          if (frame < final.length * 2 + 4) later(step, 30)
          else el.textContent = final
        }
        step()
      }
      reveal('.commit', (row) => {
        const hash = row.querySelector('.hash')
        if (hash) scramble(hash)
      })
      reveal('.aside-block')
      reveal('.paper figure')
      reveal('.paper h3.num')

      // dossier: the cover is typed out
      const typewrite = (el, delay, speed) => {
        const text = el.textContent
        el.setAttribute('aria-label', text)
        el.textContent = ''
        const caret = document.createElement('span')
        caret.className = 'type-caret'
        caret.setAttribute('aria-hidden', 'true')
        el.append(caret)
        const chars = [...text]
        let i = 0
        const tick = () => {
          caret.before(chars[i++])
          if (i < chars.length) later(tick, speed)
          else later(() => caret.remove(), 900)
        }
        later(tick, delay)
        return delay + chars.length * speed
      }
      reveal('.sheet', (sheet) => {
        if (!sheet.classList.contains('cover')) return
        const fileNo = sheet.querySelector('.file-no')
        const name = sheet.querySelector('h2')
        const after = fileNo ? typewrite(fileNo, 200, 20) : 0
        if (name) typewrite(name, after + 120, 55)
      })
      document.querySelectorAll('.stamp').forEach((stamp) => {
        on(stamp, 'click', () => {
          restart(stamp, 'restamp')
          restart(stamp.closest('.sheet'), 'thud')
        })
      })

      // the view switcher's underline slides; a newly shown view fades in
      const tabList = document.querySelector('.views__list')
      const indicator = document.createElement('span')
      indicator.className = 'views__indicator'
      indicator.setAttribute('aria-hidden', 'true')
      tabList.append(indicator)
      const moveIndicator = () => {
        const tab = tabList.querySelector('[aria-selected="true"]')
        if (!tab) return
        indicator.style.width = `${tab.offsetWidth}px`
        indicator.style.transform = `translateX(${tab.offsetLeft}px)`
      }
      on(window, 'resize', moveIndicator)
      document.fonts?.ready.then(moveIndicator)

      for (const v of VIEWS) {
        const section = document.getElementById(`view-${v}`)
        on(section, 'animationend', (event) => {
          if (event.target === section) section.classList.remove('entering')
        })
      }

      // ---------- the map comes alive ----------

      const speed = { factor: 1 }
      let mapStarted = false
      let alive = true
      cleanups.push(() => (alive = false))

      const runTrains = (svg) => {
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
          g.innerHTML = `<rect class="car" x="-28" y="-10" width="56" height="20" rx="10" style="fill:${dvar(line.d)}"/><rect class="win" x="-18" y="-4" width="10" height="7" rx="2"/><rect class="win" x="-5" y="-4" width="10" height="7" rx="2"/><rect class="win" x="8" y="-4" width="10" height="7" rx="2"/>`
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
        const watch = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
        watch.observe(svg)
        cleanups.push(() => watch.disconnect())

        let last = performance.now()
        const frame = (now) => {
          if (!alive) return
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
        on(depot, 'click', sendTrain)
        on(depot, 'keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            sendTrain()
          }
        })
        svg.querySelectorAll('.station').forEach((g) => on(g, 'click', () => g.querySelectorAll('.ping').forEach((ping) => restart(ping, 'go'))))
      }

      const startMap = () => {
        if (mapStarted) return
        mapStarted = true
        const svg = document.querySelector('.map')
        svg.querySelectorAll('.track').forEach((path, i) => {
          path.style.setProperty('--len', path.getTotalLength())
          path.style.setProperty('--ti', i)
        })
        svg.classList.add('drawing')
        later(() => svg.classList.remove('drawing'), 2800)
        later(() => runTrains(svg), 1400)
      }

      onViewShown = (id) => {
        moveIndicator()
        restart(document.getElementById(`view-${id}`), 'entering')
        if (id === 'map') startMap()
      }

      // ↑ ↑ ↓ ↓ ← → ← → B A: rush hour
      const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
      let progress = 0
      on(window, 'keydown', (event) => {
        const pressed = event.key.length === 1 ? event.key.toLowerCase() : event.key
        progress = pressed === KONAMI[progress] ? progress + 1 : pressed === KONAMI[0] ? 1 : 0
        if (progress < KONAMI.length) return
        progress = 0
        show('map')
        const card = document.querySelector('.map-card')
        card.classList.add('rush')
        speed.factor = 3.4
        later(() => {
          card.classList.remove('rush')
          speed.factor = 1
        }, 9000)
      })

      // the first view: show it without the entrance animation, then let the underline slide from then on
      show(state.view)
      document.getElementById(`view-${state.view}`).classList.remove('entering')
      moveIndicator()
      requestAnimationFrame(() => indicator.classList.add('ready'))
    } else {
      show(state.view)
    }

    return () => cleanups.forEach((fn) => fn())
  }

  mount({ keepScroll: false })
})()
