;(() => {
  const cv = window.CV
  const { month, range, esc } = window.CVfmt

  const LANES = [
    { id: 'work', label: 'work', color: 'var(--work)' },
    { id: 'nda', label: 'nda', color: 'var(--nda)' },
    { id: 'projects', label: 'projects', color: 'var(--projects)' },
    { id: 'study', label: 'study', color: 'var(--study)' },
  ]

  // a stable, git-looking short hash for each entry
  const shortHash = (text) => {
    let h = 2166136261
    for (const ch of text) {
      h ^= ch.codePointAt(0)
      h = Math.imul(h, 16777619)
    }
    return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7)
  }

  const commits = [
    ...cv.experience.map((e) => ({
      lane: e.kind === 'nda' ? 'nda' : 'work',
      date: e.start,
      when: range(e.start, e.end),
      title: e.title,
      org: e.org,
      orgUrl: e.orgUrl,
      nda: e.kind === 'nda',
      points: e.points,
      stack: e.stack,
      head: !e.end,
    })),
    ...cv.projects.map((p) => ({
      lane: 'projects',
      date: p.date,
      when: month(p.date),
      title: p.name,
      org: p.tagline,
      text: p.text,
      stack: p.stack,
      url: p.url,
      tag: p.featured ? 'featured' : null,
    })),
    ...cv.education.map((ed) => ({
      lane: 'study',
      date: ed.start,
      when: range(ed.start, ed.end),
      title: ed.title,
      org: ed.org,
      text: ed.note,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  // a branch has one HEAD: only its newest ongoing commit keeps the marker
  const headSeen = new Set()
  for (const c of commits) {
    if (c.head && headSeen.has(c.lane)) c.head = false
    if (c.head) headSeen.add(c.lane)
  }

  const laneIndex = (id) => LANES.findIndex((lane) => lane.id === id)
  const count = (id) => commits.filter((c) => c.lane === id).length

  const commitHtml = (c) => {
    const lane = LANES[laneIndex(c.lane)]
    const refs = [
      c.head ? `<span class="ref ref--head">HEAD → ${lane.label}</span>` : '',
      c.tag ? `<span class="ref">${c.tag}</span>` : '',
    ].join('')
    const org = c.orgUrl ? `<a href="${c.orgUrl}" rel="noopener">${esc(c.org)}</a>` : esc(c.org)
    return `
      <li class="commit ${c.head ? 'is-head' : ''}" data-lane="${c.lane}" style="--lane:${laneIndex(c.lane)};--c:${lane.color}">
        <div class="rail" aria-hidden="true"></div>
        <article class="card">
          <p class="meta"><code class="hash">${shortHash(c.title + c.date)}</code><time>${c.when}</time>${refs}</p>
          <h3>${esc(c.title)}</h3>
          <p class="org">${org}${c.nda ? '<span class="nda-mark" title="Client name withheld under a non-disclosure agreement">under NDA</span>' : ''}</p>
          ${c.points ? `<ul>${c.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
          ${c.text ? `<p class="text">${esc(c.text)}</p>` : ''}
          ${c.stack ? `<ul class="stack">${c.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
          ${c.url ? `<a class="open" href="${c.url}" rel="noopener">view repository</a>` : ''}
        </article>
      </li>`
  }

  const diff = cv.skills
    .map((group) => [`<div class="hunk">@@ ${esc(group.group)} @@</div>`, ...group.items.map((item) => `<div class="add">+ ${esc(item)}</div>`)].join(''))
    .join('')

  document.getElementById('app').innerHTML = `
    <div class="layout">
      <header class="identity">
        <p class="path">emilhovh / <b>cv</b></p>
        <h1>${esc(cv.name)}</h1>
        <p class="role">${esc(cv.role)} · ${esc(cv.focus.toLowerCase())}</p>
        <p class="summary">${esc(cv.summary)}</p>
        <dl class="config">
          <dt>email</dt><dd><a href="mailto:${cv.email}">${cv.email}</a></dd>
          <dt>github</dt><dd><a href="${cv.links.github}" rel="noopener">github.com/emilhovh</a></dd>
          <dt>linkedin</dt><dd><a href="${cv.links.linkedin}" rel="noopener">in/emil-hovhannisyan</a></dd>
          <dt>based</dt><dd>${esc(cv.location)}</dd>
        </dl>
        <div class="branches" role="group" aria-label="Show branches">
          ${LANES.map((lane) => `<button class="branch" type="button" aria-pressed="true" data-lane="${lane.id}" style="--c:${lane.color}"><i></i>${lane.label}<small>${count(lane.id)}</small></button>`).join('')}
        </div>
      </header>

      <main>
        <p class="prompt">$ <b>git log --graph --all</b></p>
        <ol class="log">${commits.map(commitHtml).join('')}</ol>

        <section class="section" aria-labelledby="skills">
          <h2 id="skills">skills.lock <span>— ${cv.skills.reduce((n, g) => n + g.items.length, 0)} additions</span></h2>
          <div class="diff">${diff}</div>
        </section>

        <section class="section" aria-labelledby="langs">
          <h2 id="langs">i18n <span>— spoken languages</span></h2>
          <div class="langs">
            ${cv.languages
              .map(
                (l) => `<div class="lang"><div><b>${l.name}</b> <span>${l.native}</span></div><div class="meter" aria-label="${l.level} of 5">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= l.level ? 'on' : ''}"></i>`).join('')}</div></div>`,
              )
              .join('')}
          </div>
        </section>

        <section class="section" aria-labelledby="archive">
          <h2 id="archive">archive <span>— older and smaller repositories</span></h2>
          <ul class="archive">${cv.archive.map((a) => `<li><span>${a.year}</span>  <a href="${a.url}" rel="noopener">${esc(a.name)}</a></li>`).join('')}</ul>
        </section>

        <footer>Written as a git history. Confidential client work is listed without client names.</footer>
      </main>
    </div>`

  // branch toggles hide and show their commits
  document.querySelectorAll('.branch').forEach((button) => {
    button.addEventListener('click', () => {
      const on = button.getAttribute('aria-pressed') !== 'true'
      button.setAttribute('aria-pressed', String(on))
      document.querySelectorAll(`.commit[data-lane="${button.dataset.lane}"]`).forEach((row) => (row.hidden = !on))
    })
  })
})()
