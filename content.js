// Everything the site says about Emil lives here; the site and the design drafts all render this one file.
// Confidential entries are described without client names — edit wording here once.
window.CV = {
  name: 'Emil Hovhannisyan',
  role: 'Software Engineer',
  focus: 'Python AI, full-stack web and data-driven systems',
  location: 'Yerevan, Armenia',
  email: 'emilhovhannisyan44@gmail.com',
  links: {
    github: 'https://github.com/emilhovh',
    linkedin: 'https://www.linkedin.com/in/emil-hovhannisyan-30735124b',
  },
  summary:
    'Software engineer working across applied AI, web platforms and data. At Cretrix I build the Python backend behind two AI document products — reading engineering drawing sets for a chatbot and filling vendor vouchers from invoices, with OCR, vision models and measured per-field accuracy; at Bizzy Agency I ship production React applications; and I deliver realtime platforms for private clients.',

  // current roles and engagements
  experience: [
    {
      id: 'cretrix',
      kind: 'work',
      title: 'Python AI Developer',
      org: 'Cretrix',
      orgUrl: 'https://am.linkedin.com/company/cretrix',
      place: 'Yerevan',
      start: '2026-06',
      end: null,
      points: [
        'Flask backend for two AI document products sharing one deployment, database and vision provider: drawing-sheet extraction for an AI chatbot, and invoice reading for vendor vouchers',
        'Drawing sets: asynchronous ingestion of multi-hundred-MB PDFs from S3, read through the PDF text layer, title-block geometry and Tesseract OCR, escalating to vision models (OpenAI or xAI Grok) only for pages that chain cannot read',
        'Confidence-scored extraction with a review queue, drawing-set assembly and supersession, cross-sheet callout detection with page coordinates, and field regions users draw to correct a reading',
        'Vendor vouchers: reads an invoice and fills 13 voucher fields — vendor, invoice number, date, total and the job-cost coding — each with its measured accuracy (vendor 93.6%, project/job 94.0%), answering null rather than guessing',
        'Coding precedent mined from voucher history and gated on repetition, raising scanned-invoice accuracy from 72–78% with the model alone to 95–100%',
        'Concurrent, batched AI sheet descriptions: a 999-page set went from 241 s to 163 s at the same token spend',
        'Deployment-wide FIFO admission through database leases, threaded workers, nightly retention with disk-headroom checks, fail-closed accuracy feedback and a developer dashboard with searchable pipeline logs',
      ],
      stack: ['Python', 'Flask', 'PyMuPDF', 'Tesseract OCR', 'Computer vision', 'OpenAI API', 'xAI Grok', 'Amazon S3', 'SQLite', 'Gunicorn', 'Kubernetes'],
      domains: ['ml', 'data'],
    },
    {
      id: 'nda-games',
      kind: 'nda',
      title: 'Telegram Mini App game platforms',
      org: 'Confidential client',
      start: '2026',
      end: null,
      points: [
        'Board-game platform (chess, long backgammon, draughts, reversi, four-in-a-row) with bots in a web worker and realtime multiplayer at ~250 ms move delivery',
        'One rules engine shared by client and server, behind nine switchable visual themes',
        'One-on-one card club: provably fair game server, double-entry chip ledger, matchmaking and turn clocks, covered by end-to-end tests',
      ],
      stack: ['React', 'TypeScript', 'Vite', 'Node.js', 'WebSockets', 'Supabase', 'PostgreSQL', 'SQLite'],
      domains: ['games', 'web'],
    },
    {
      id: 'nda-mobile',
      kind: 'nda',
      title: 'Cross-platform mobile app',
      org: 'Confidential client',
      start: '2026',
      end: null,
      points: ['Android and iOS app sharing business logic and UI through Kotlin Multiplatform and Compose Multiplatform'],
      stack: ['Kotlin', 'Compose Multiplatform', 'Android', 'iOS'],
      domains: ['systems'],
    },
    {
      id: 'nda-fintech',
      kind: 'nda',
      title: 'Web platform for an international brokerage',
      org: 'Confidential client',
      start: '2026',
      end: null,
      points: [
        'Public marketing site with CRM-backed sign-up, login and password reset behind CAPTCHA',
        'Multi-language content pipeline on a translation-management system',
        'Internal employee portal and analytics tooling',
        'Card-service backend with JWT auth and a React front end',
      ],
      stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Zod', 'Laravel', 'PHP'],
      domains: ['web'],
    },
    {
      id: 'bizzy',
      kind: 'work',
      title: 'Full Stack Web Developer',
      org: 'Bizzy Agency',
      orgUrl: 'https://bizzy.am/',
      place: 'Yerevan',
      start: '2025-08',
      end: null,
      points: [
        'Develop and maintain production web applications in React',
        'Integrate third-party APIs and implement SEO optimizations',
        'Build WCAG-compliant interfaces with designers in Figma',
        'Improve performance, scalability and reliability; worked on the agency site bizzy.am',
      ],
      stack: ['React', 'JavaScript', 'REST APIs', 'SEO', 'Figma', 'WCAG'],
      domains: ['web'],
    },
  ],

  // earlier roles, courses and training
  earlier: [
    {
      id: 'techx',
      kind: 'training',
      title: 'Full-stack development and DevOps program',
      org: 'TechX Global',
      start: '2025-07',
      end: '2025',
      points: [
        'Intensive training in full-stack development and modern DevOps tools',
        'Hands-on projects in HTML, CSS and JavaScript with responsive, accessible design',
        'Turned Figma mockups into working web interfaces',
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'Figma', 'DevOps'],
      domains: ['web'],
    },
    {
      id: 'synopsys',
      kind: 'training',
      title: 'Integrated circuits and scripting languages',
      org: 'Synopsys',
      start: '2025-01',
      end: '2025-06',
      points: ['Introduction to IC design and device physics', 'Final project presented with a written report'],
      stack: ['IC design', 'Scripting'],
      domains: ['systems'],
    },
    {
      id: 'trustedclicks',
      kind: 'work',
      title: 'Link Building Specialist',
      org: 'Trusted Clicks',
      start: '2025-02',
      end: '2025-02',
      points: ['Backlink research for SEO campaigns', 'Hands-on work with digital-marketing and search-engine tools'],
      stack: ['SEO'],
      domains: ['web'],
    },
    {
      id: 'gurus',
      kind: 'training',
      title: 'Statistical programming in R',
      org: 'Gurus LLC',
      start: '2024-06',
      end: '2024-07',
      points: ['Basics of statistical programming: writing R scripts and functions'],
      stack: ['R'],
      domains: ['data'],
    },
    {
      id: 'hpc',
      kind: 'training',
      title: 'Hands-on training on supercomputer access',
      org: 'Armenian National Supercomputer Center',
      start: '2024-03',
      end: '2024-03',
      points: ['Practical experience with high-performance computing infrastructure'],
      stack: ['HPC'],
      domains: ['systems'],
    },
  ],

  education: [
    {
      id: 'ufar',
      title: 'BSc in Computer Science',
      org: 'French University in Armenia (UFAR)',
      start: '2022-08',
      end: '2026-06',
      note: 'Faculty of Computer Science and Applied Mathematics. Project-based curriculum: software engineering, algorithms, databases, operating systems, networks, AI and data science.',
    },
    {
      id: 'fca',
      title: "Associate's Degree in Economics",
      org: 'French College in Armenia',
      start: '2019',
      end: '2022',
      note: 'Economics foundation before moving into computer science.',
    },
  ],

  certificates: [
    { name: 'Cambridge B2 First (FCE), English at C1 level', org: 'Cambridge English' },
    { name: 'Hands-on training on supercomputer access', org: 'Armenian National Supercomputer Center', year: 2024 },
    { name: 'Guest coordinator, Swiss National Day in Armenia', org: 'Volunteering', year: 2024 },
  ],

  projects: [
    {
      id: 'rag',
      name: 'RAG PDF Chatbot',
      date: '2026-06',
      tagline: 'Private question answering over your PDFs',
      text: 'Answers questions about PDF files with the source cited, fully offline: pdfplumber extraction, ChromaDB embeddings, a local Ollama model, a FastAPI service and a Chainlit chat UI.',
      stack: ['Python', 'ChromaDB', 'Ollama', 'FastAPI', 'Chainlit'],
      url: 'https://github.com/emilhovh/RAG-chatbot',
      domains: ['ml'],
      featured: true,
    },
    {
      id: 'statsphere',
      name: 'StatSphere',
      date: '2026-05',
      tagline: 'A/B testing and statistical modelling pipeline',
      text: 'Simulates and analyses experiments end to end: sample-ratio-mismatch checks, CUPED variance reduction, Benjamini–Hochberg correction, bootstrap intervals, OLS and logistic regression, and an auto-written report.',
      stack: ['Python', 'statsmodels', 'scikit-learn', 'Pandas'],
      url: 'https://github.com/emilhovh/StatSphere',
      domains: ['data'],
      featured: true,
    },
    {
      id: 'airpop',
      name: 'AirPop',
      date: '2026-05',
      tagline: 'A bubble shooter you play with your hands',
      text: 'Touchless, physics-based bubble shooter: MediaPipe tracks 21 hand landmarks at 60 fps, a pinch fires, and a custom collision engine runs the board. Neo-brutalist interface.',
      stack: ['React', 'TypeScript', 'MediaPipe', 'Canvas'],
      url: null,
      domains: ['games', 'ml'],
    },
    {
      id: 'eventsphere',
      name: 'EventSphere Analytics',
      date: '2026-04',
      tagline: 'Behavioural analytics for a simulated SaaS product',
      text: 'Pipeline over 150K+ events from 1,500 users: cohort retention, conversion funnel, RFM segmentation, churn-risk tiers, channel and device breakdowns — eight analyses with static and interactive dashboards, all in Docker.',
      stack: ['PostgreSQL', 'Python', 'Pandas', 'Plotly', 'Docker'],
      url: 'https://github.com/emilhovh/eventsphere-analytics',
      domains: ['data'],
      featured: true,
    },
    {
      id: 'ecc',
      name: 'ECC Singularity Validator',
      date: '2026-01',
      tagline: 'Safety checks for elliptic-curve key generation',
      text: 'Plots elliptic curves, computes the discriminant, detects singular curves (cusps and nodes) and blocks key generation on parameters that would break ECC security.',
      stack: ['Python', 'NumPy', 'Matplotlib'],
      url: 'https://github.com/emilhovh/Elliptic-Curves-and-Singularity-in-Cryptographic-Key-Generation',
      domains: ['systems'],
    },
    {
      id: 'deepcarex',
      name: 'DeepCareX',
      date: '2025-12',
      tagline: 'AI-based healthcare diagnosis system',
      text: 'Capstone web app that screens for several diseases with CNNs, XGBoost and transfer learning at 94–99% accuracy across models. Team of four; I led backend development and ML optimization.',
      stack: ['TensorFlow', 'XGBoost', 'Flask', 'Docker'],
      url: 'https://github.com/emilhovh/Project-S5',
      domains: ['ml', 'web'],
      featured: true,
    },
    {
      id: 'complaint',
      name: 'Complaint-O-Tron 3000',
      date: '2025-04',
      tagline: 'Complaint management with ML insights',
      text: 'Desktop app with accounts, a moderator dashboard, and ML-driven insights such as urgency prediction and sentiment analysis.',
      stack: ['Python', 'tkinter', 'scikit-learn', 'TextBlob'],
      url: 'https://github.com/emilhovh/Complaint-O-Tron-3000',
      domains: ['ml', 'systems'],
    },
  ],

  archive: [
    { name: 'FactCheckBot', year: 2025, url: 'https://github.com/emilhovh/FactCheckBot' },
    { name: 'Diabetic Retinopathy Scanner', year: 2025, url: 'https://github.com/emilhovh/Diabetic-Retinopathy-Scanner' },
    { name: 'Pac-Man in Python', year: 2025, url: 'https://github.com/emilhovh/Pac-Man' },
    { name: 'Library Management (C#, WPF)', year: 2024, url: 'https://github.com/emilhovh/Library-Management' },
    { name: 'Algorithms coursework (C#, C)', year: 2024, url: 'https://github.com/emilhovh/Algorithms_and_Pr_langs' },
    { name: 'Laptop Quality Control System (C)', year: 2023, url: 'https://github.com/emilhovh/Project-S1' },
  ],

  skills: [
    { group: 'AI & computer vision', items: ['Computer vision', 'OCR (Tesseract)', 'PDF extraction (PyMuPDF)', 'Vision LLMs', 'RAG', 'TensorFlow', 'XGBoost'] },
    { group: 'Data & statistics', items: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'statsmodels', 'A/B testing', 'R'] },
    { group: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite', 'Accessibility (WCAG)'] },
    { group: 'Backend', items: ['Node.js', 'Flask', 'FastAPI', 'Laravel', 'REST APIs', 'WebSockets'] },
    { group: 'Storage & infrastructure', items: ['PostgreSQL', 'SQLite', 'Supabase', 'ChromaDB', 'Amazon S3', 'Docker', 'Kubernetes', 'Gunicorn'] },
    { group: 'Mobile & more', items: ['Kotlin Multiplatform', 'C#', 'C', 'Playwright'] },
  ],

  languages: [
    { name: 'Armenian', native: 'Հայերեն', level: 5, cefr: 'Native', hello: 'Բարեւ' },
    { name: 'Russian', native: 'Русский', level: 5, cefr: 'Native', hello: 'Привет' },
    { name: 'English', native: 'English', level: 4, cefr: 'C1', hello: 'Hello' },
    { name: 'French', native: 'Français', level: 3, cefr: 'B1', hello: 'Bonjour' },
  ],

  domains: {
    web: 'Web platforms',
    data: 'Data & analytics',
    ml: 'AI & machine learning',
    games: 'Games & realtime',
    systems: 'Apps & systems',
  },
}

// small shared helpers
window.CVfmt = {
  /** '2026-05' → 'May 2026'; '2026' → '2026'; null → 'Present' */
  month(ym) {
    if (!ym) return 'Present'
    const [y, m] = String(ym).split('-').map(Number)
    if (!m) return String(y)
    return new Date(y, m - 1).toLocaleString('en', { month: 'short', year: 'numeric' })
  },
  range(start, end) {
    if (end && start === end) return window.CVfmt.month(start)
    return `${window.CVfmt.month(start)} – ${end ? window.CVfmt.month(end) : 'Present'}`
  },
  esc(text) {
    return String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
  },
}
