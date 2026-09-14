;(() => {
  const cv = window.CV
  const { month, range, esc } = window.CVfmt

  const redacted = (label) =>
    `<span class="redact" tabindex="0" data-note="Withheld under NDA" aria-label="Client name withheld under a non-disclosure agreement">${'█'.repeat(Math.max(8, label.length))}</span>`

  const assignment = (e) => `
    <div class="entry">
      <h3>${esc(e.title)}${e.kind === 'nda' ? '<span class="classified">NDA</span>' : ''}</h3>
      <p class="when">${range(e.start, e.end)} — ${e.kind === 'nda' ? `Client: ${redacted(e.org)}` : `<a href="${e.orgUrl}" rel="noopener">${esc(e.org)}</a>, ${esc(e.place)}`}</p>
      <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      <p class="tools">Equipment: ${esc(e.stack.join(', '))}</p>
    </div>`

  const caseFile = (p, i) => `
    <article class="case">
      <p class="no">CASE EH-${p.date.replace('-', '')}-${String(i + 1).padStart(2, '0')}</p>
      <h3>${esc(p.name)}</h3>
      <p class="tag">${esc(p.tagline)}</p>
      <p>${esc(p.text)}</p>
      <p class="tools">${esc(p.stack.join(' / '))}</p>
      ${p.url ? `<a href="${p.url}" rel="noopener">Open evidence →</a>` : '<span class="tools">Evidence held privately</span>'}
    </article>`

  const work = cv.experience.filter((e) => e.kind === 'work')
  const nda = cv.experience.filter((e) => e.kind === 'nda')

  document.getElementById('app').innerHTML = `
    <main class="folder">
      <section class="sheet" aria-labelledby="subject">
        <span class="tab" aria-hidden="true">PERSONNEL</span>
        <div class="stamp" aria-hidden="true">CLEARED FOR HIRE</div>
        <p class="file-no">File EH-2022-0829 · Opened Yerevan</p>
        <h1 id="subject">${esc(cv.name)}</h1>
        <p class="subject">${esc(cv.role)} — ${esc(cv.focus.toLowerCase())}</p>
        <dl class="fields">
          <dt>Current post</dt><dd>${esc(work[0].title)}, <a href="${work[0].orgUrl}" rel="noopener">${esc(work[0].org)}</a></dd>
          <dt>Base of operations</dt><dd>${esc(cv.location)}</dd>
          <dt>Training</dt><dd>${esc(cv.education[0].title)}, ${esc(cv.education[0].org)}</dd>
          <dt>Languages</dt><dd>${cv.languages.map((l) => l.name).join(', ')}</dd>
          <dt>Contact</dt><dd><a href="mailto:${cv.email}">${cv.email}</a></dd>
          <dt>Known channels</dt><dd><a href="${cv.links.github}" rel="noopener">github.com/emilhovh</a> · <a href="${cv.links.linkedin}" rel="noopener">LinkedIn</a></dd>
        </dl>
        <p class="note">Assessment: ${esc(cv.summary)}</p>
      </section>

      <section class="sheet" aria-labelledby="assignments">
        <span class="tab" aria-hidden="true">§ 1</span>
        <h2 id="assignments"><span>§1</span> Assignments</h2>
        ${work.map(assignment).join('')}
        ${nda.map(assignment).join('')}
      </section>

      <section class="sheet" aria-labelledby="cases">
        <span class="tab" aria-hidden="true">§ 2</span>
        <h2 id="cases"><span>§2</span> Case files</h2>
        <div class="cases">${cv.projects.map(caseFile).join('')}</div>
        <p class="tools" style="margin-top:18px">Minor cases on record:</p>
        <ul class="archive">${cv.archive.map((a) => `<li>${a.year} — <a href="${a.url}" rel="noopener">${esc(a.name)}</a></li>`).join('')}</ul>
      </section>

      <section class="sheet" aria-labelledby="capabilities">
        <span class="tab" aria-hidden="true">§ 3</span>
        <h2 id="capabilities"><span>§3</span> Capabilities</h2>
        <div class="skills">${cv.skills.map((g) => `<div><h3>${esc(g.group)}</h3><p>${esc(g.items.join(', '))}</p></div>`).join('')}</div>

        <h2 style="margin-top:34px"><span>§4</span> Languages</h2>
        <ul class="langs">${cv.languages.map((l) => `<li><span>${l.name} (${l.native})</span><b aria-label="${l.level} of 5">${'■'.repeat(l.level)}${'□'.repeat(5 - l.level)}</b></li>`).join('')}</ul>

        <h2 style="margin-top:34px"><span>§5</span> Training</h2>
        ${cv.education.map((ed) => `<div class="entry"><h3>${esc(ed.title)}</h3><p class="when">${range(ed.start, ed.end)} — ${esc(ed.org)}</p><p>${esc(ed.note)}</p></div>`).join('')}

        <div class="signoff">
          <span>Redacted entries concern work under non-disclosure agreements.<br />Details available where the agreements allow.</span>
          <span class="signature" aria-hidden="true">E. Hovhannisyan</span>
        </div>
      </section>
    </main>`
})()
