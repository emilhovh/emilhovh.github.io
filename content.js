// Everything the site says about Emil. A text value is either plain — the same in every language
// (names, technologies) — or { en, hy, ru, fr }; the site falls back to English for anything missing.
// Confidential entries are described without client names.
window.CV = {
  name: { en: 'Emil Hovhannisyan', hy: 'Էմիլ Հովհաննիսյան', ru: 'Emil Hovhannisyan', fr: 'Emil Hovhannisyan' },
  role: { en: 'Software Engineer', hy: 'Ծրագրային ինժեներ', ru: 'Инженер-программист', fr: 'Ingénieur logiciel' },
  focus: {
    en: 'Python AI, full-stack web and data-driven systems',
    hy: 'Python AI, full-stack վեբ և տվյալահեն համակարգեր',
    ru: 'ИИ на Python, full-stack веб и системы на данных',
    fr: 'IA en Python, web full-stack et systèmes pilotés par les données',
  },
  location: { en: 'Yerevan, Armenia', hy: 'Երևան, Հայաստան', ru: 'Ереван, Армения', fr: 'Erevan, Arménie' },
  email: 'emilhovhannisyan44@gmail.com',
  links: {
    github: 'https://github.com/emilhovh',
    linkedin: 'https://www.linkedin.com/in/emil-hovhannisyan-30735124b',
  },
  summary: {
    en: 'Software engineer working across applied AI, web platforms and data. At Cretrix I build the Python backend behind two AI document products — reading engineering drawing sets for a chatbot and filling vendor vouchers from invoices, with OCR, vision models and measured per-field accuracy; at Bizzy Agency I ship production React applications; and I build Telegram Mini App games and bots for private clients.',
    hy: 'Ծրագրային ինժեներ՝ կիրառական արհեստական բանականության, վեբ հարթակների և տվյալների հանգույցում։ Cretrix-ում ստեղծում եմ երկու AI փաստաթղթային արտադրանքի Python backend-ը՝ ինժեներական գծագրերի ընթերցում չաթբոտի համար և մատակարարների վաուչերների լրացում հաշիվ-ապրանքագրերից՝ OCR-ով, vision մոդելներով և յուրաքանչյուր դաշտի չափված ճշգրտությամբ։ Bizzy Agency-ում թողարկում եմ React հավելվածներ, իսկ մասնավոր հաճախորդների համար ստեղծում եմ Telegram Mini App խաղեր և բոտեր։',
    ru: 'Инженер-программист на стыке прикладного ИИ, веб-платформ и данных. В Cretrix разрабатываю Python-бэкенд двух ИИ-продуктов для документов — чтение инженерных чертежей для чат-бота и заполнение ваучеров поставщиков по счетам, с OCR, vision-моделями и измеренной точностью по каждому полю; в Bizzy Agency выпускаю продакшн-приложения на React; для частных клиентов делаю игры и ботов на Telegram Mini Apps.',
    fr: 'Ingénieur logiciel à la croisée de l’IA appliquée, des plateformes web et de la donnée. Chez Cretrix, je développe le backend Python de deux produits d’IA documentaire — la lecture de jeux de plans d’ingénierie pour un chatbot et le remplissage de bons fournisseurs à partir de factures, avec OCR, modèles de vision et précision mesurée champ par champ ; chez Bizzy Agency, je livre des applications React en production ; et je conçois des jeux et des bots Telegram Mini Apps pour des clients privés.',
  },

  // current roles and engagements
  experience: [
    {
      id: 'cretrix',
      kind: 'work',
      title: { en: 'Python AI Developer', hy: 'Python AI ծրագրավորող', ru: 'Python AI-разработчик', fr: 'Développeur IA Python' },
      org: 'Cretrix',
      orgUrl: 'https://am.linkedin.com/company/cretrix',
      start: '2026-06',
      end: null,
      points: [
        {
          en: 'Flask backend for two AI document products sharing one deployment, database and vision provider: drawing-sheet extraction for an AI chatbot, and invoice reading for vendor vouchers',
          hy: 'Flask backend երկու AI փաստաթղթային արտադրանքի համար՝ ընդհանուր deploy-ով, տվյալների բազայով և vision մատակարարով. գծագրերի թերթերի դուրսբերում AI չաթբոտի համար և հաշիվ-ապրանքագրերի ընթերցում մատակարարների վաուչերների համար',
          ru: 'Flask-бэкенд для двух ИИ-продуктов для документов с общим деплоем, базой данных и vision-провайдером: извлечение листов чертежей для ИИ-чат-бота и чтение счетов для ваучеров поставщиков',
          fr: 'Backend Flask pour deux produits d’IA documentaire partageant un même déploiement, une base de données et un fournisseur de vision : extraction de planches de plans pour un chatbot IA et lecture de factures pour les bons fournisseurs',
        },
        {
          en: 'Drawing sets: asynchronous ingestion of multi-hundred-MB PDFs from S3, read through the PDF text layer, title-block geometry and Tesseract OCR, escalating to vision models (OpenAI or xAI Grok) only for pages that chain cannot read',
          hy: 'Գծագրերի փաթեթներ. հարյուրավոր ՄԲ ծավալով PDF-ների ասինխրոն ներբեռնում S3-ից, էջերի ընթերցում PDF-ի տեքստային շերտով, շտամպի երկրաչափությամբ և Tesseract OCR-ով, իսկ vision մոդելներին (OpenAI կամ xAI Grok) դիմում է միայն այն էջերի համար, որոնք այդ շղթան չի կարողանում կարդալ',
          ru: 'Комплекты чертежей: асинхронная загрузка PDF в сотни мегабайт из S3; страницы читаются через текстовый слой PDF, геометрию штампа и Tesseract OCR, а к vision-моделям (OpenAI или xAI Grok) обращение идёт только там, где эта цепочка не справилась',
          fr: 'Jeux de plans : ingestion asynchrone de PDF de plusieurs centaines de Mo depuis S3, lus via la couche texte du PDF, la géométrie du cartouche et l’OCR Tesseract, avec recours aux modèles de vision (OpenAI ou xAI Grok) uniquement pour les pages que cette chaîne ne sait pas lire',
        },
        {
          en: 'Confidence-scored extraction with a review queue, drawing-set assembly and supersession, cross-sheet callout detection with page coordinates, and field regions users draw to correct a reading',
          hy: 'Վստահության գնահատականով դուրսբերում և ստուգման հերթ, փաթեթների հավաքում և փոխարինված թերթերի հետևում, թերթերի միջև հղումների հայտնաբերում էջի կոորդինատներով, և տարածքներ, որոնք օգտատերը գծում է ընթերցումն ուղղելու համար',
          ru: 'Извлечение с оценкой уверенности и очередью проверки, сборка комплектов и отслеживание заменённых листов, поиск перекрёстных ссылок между листами с координатами на странице и области, которыми пользователь исправляет прочитанное',
          fr: 'Extraction notée par niveau de confiance avec file de relecture, assemblage des jeux et suivi des planches remplacées, détection des renvois entre planches avec coordonnées, et zones que l’utilisateur trace pour corriger une lecture',
        },
        {
          en: 'Vendor vouchers: reads an invoice and fills 13 voucher fields — vendor, invoice number, date, total and the job-cost coding — each with its measured accuracy (vendor 93.6%, project/job 94.0%), answering null rather than guessing',
          hy: 'Մատակարարների վաուչերներ. հաշիվ-ապրանքագրի ընթերցում և 13 դաշտի լրացում՝ մատակարար, հաշվի համար, ամսաթիվ, գումար և ծախսերի կոդավորում, յուրաքանչյուրը իր չափված ճշգրտությամբ (մատակարար՝ 93,6%, նախագիծ/job՝ 94,0%), իսկ անհայտ դաշտը մնում է դատարկ՝ առանց կռահման',
          ru: 'Ваучеры поставщиков: чтение счёта и заполнение 13 полей — поставщик, номер и дата счёта, сумма и кодировка затрат — с измеренной точностью для каждого поля (поставщик 93,6%, проект/job 94,0%); если ответа нет, поле остаётся пустым, а не угадывается',
          fr: 'Bons fournisseurs : lecture d’une facture et remplissage de 13 champs — fournisseur, numéro, date, total et imputation analytique — chacun avec sa précision mesurée (fournisseur 93,6 %, projet/job 94,0 %), en laissant vide plutôt qu’en devinant',
        },
        {
          en: 'Coding precedent mined from voucher history and gated on repetition, raising scanned-invoice accuracy from 72–78% with the model alone to 95–100%',
          hy: 'Ծախսերի կոդավորում վաուչերների պատմությունից՝ կրկնվելու շեմով. սկանավորված հաշիվների ճշգրտությունը 72–78%-ից (միայն մոդելը) բարձրացել է մինչև 95–100%',
          ru: 'Кодировка затрат по прецедентам из истории ваучеров с порогом повторяемости: точность на сканах выросла с 72–78% (только модель) до 95–100%',
          fr: 'Imputations tirées de l’historique des bons et soumises à un seuil de répétition : sur les factures scannées, la précision passe de 72–78 % (modèle seul) à 95–100 %',
        },
        {
          en: 'Concurrent, batched AI sheet descriptions: a 999-page set went from 241 s to 163 s at the same token spend',
          hy: 'Թերթերի AI նկարագրություններ՝ զուգահեռ փաթեթներով. 999 էջից բաղկացած փաթեթի մշակումը 241 վ-ից կրճատվեց մինչև 163 վ՝ նույն token ծախսով',
          ru: 'Параллельные пакетные ИИ-описания листов: комплект из 999 страниц — с 241 до 163 секунд при том же расходе токенов',
          fr: 'Descriptions IA des planches en lots concurrents : un jeu de 999 pages passe de 241 s à 163 s pour la même consommation de jetons',
        },
        {
          en: 'Deployment-wide FIFO admission through database leases, threaded workers, nightly retention with disk-headroom checks, fail-closed accuracy feedback and a developer dashboard with searchable pipeline logs',
          hy: 'Ամբողջ deploy-ի համար ընդհանուր FIFO հերթ՝ տվյալների բազայի lease-երով, բազմահոսք worker-ներ, գիշերային մաքրում՝ սկավառակի տեղի ստուգմամբ, առանց նույնականացման փակ ճշգրտության հետադարձ կապ և ծրագրավորողի վահանակ՝ որոնելի լոգերով',
          ru: 'Общая FIFO-очередь на весь деплой через аренды в базе данных, потоковые воркеры, ночная очистка с проверкой свободного места, защищённый сбор обратной связи о точности и дашборд разработчика с поиском по логам',
          fr: 'File FIFO commune à tout le déploiement via des baux en base de données, workers multithread, purge nocturne avec contrôle d’espace disque, retours de précision refusés sans authentification et tableau de bord développeur avec journaux consultables',
        },
      ],
      stack: [
        'Python', 'Flask', 'PyMuPDF', 'Tesseract OCR',
        { en: 'Computer vision', hy: 'Համակարգչային տեսողություն', ru: 'Компьютерное зрение', fr: 'Vision par ordinateur' },
        'OpenAI API', 'xAI Grok', 'Amazon S3', 'SQLite', 'Gunicorn', 'Kubernetes',
      ],
      domains: ['ml', 'data'],
    },
    {
      id: 'nda-games',
      kind: 'nda',
      short: { en: 'Telegram games', hy: 'Telegram խաղեր', ru: 'Telegram-игры', fr: 'Jeux Telegram' },
      title: { en: 'Telegram Mini App games and bots', hy: 'Telegram Mini App խաղեր և բոտեր', ru: 'Игры и боты на Telegram Mini Apps', fr: 'Jeux et bots Telegram Mini Apps' },
      org: { en: 'Confidential client', hy: 'Գաղտնի հաճախորդ', ru: 'Конфиденциальный клиент', fr: 'Client confidentiel' },
      start: '2026',
      end: null,
      points: [
        {
          en: 'Three games shipped as Telegram Mini Apps behind Telegram bots, with sign-in verified from Telegram initData on the server',
          hy: 'Երեք խաղ՝ Telegram Mini App ձևաչափով Telegram բոտերի հետ, մուտքը ստուգվում է սերվերում՝ Telegram-ի initData ստորագրությամբ',
          ru: 'Три игры в формате Telegram Mini Apps с ботами; вход проверяется на сервере по подписи initData от Telegram',
          fr: 'Trois jeux publiés en Telegram Mini Apps derrière des bots Telegram, avec une connexion vérifiée côté serveur à partir des initData de Telegram',
        },
        {
          en: 'Board-game platform (chess, long backgammon, draughts, reversi, four-in-a-row): bots in a web worker, realtime multiplayer at ~250 ms move delivery, one rules engine shared by client and server, nine visual themes',
          hy: 'Սեղանի խաղերի հարթակ (շախմատ, երկար նարդի, շաշկի, ռեվերսի, «չորսը շարքով»). բոտեր web worker-ում, իրական ժամանակի մուլտիփլեյեր՝ քայլի առաքում ~250 մվ-ում, կանոնների մեկ շարժիչ կլիենտի և սերվերի համար, ինը վիզուալ թեմա',
          ru: 'Платформа настольных игр (шахматы, длинные нарды, шашки, реверси, «четыре в ряд»): боты в web worker, мультиплеер в реальном времени с доставкой хода за ~250 мс, единый движок правил для клиента и сервера, девять визуальных тем',
          fr: 'Plateforme de jeux de plateau (échecs, backgammon long, dames, reversi, puissance 4) : IA dans un web worker, multijoueur en temps réel avec ~250 ms par coup, un seul moteur de règles pour le client et le serveur, neuf thèmes visuels',
        },
        {
          en: 'One-on-one card club: provably fair game server, double-entry chip ledger, matchmaking and turn clocks, covered by end-to-end tests',
          hy: 'Մեկը մեկի դեմ քարտային ակումբ. ապացուցելիորեն արդար խաղային սերվեր, չիպերի կրկնակի գրանցման հաշվառում, մրցակցի ընտրություն և քայլի ժամացույցներ՝ ծածկված end-to-end թեստերով',
          ru: 'Карточный клуб один на один: доказуемо честный игровой сервер, учёт фишек по двойной записи, подбор соперников и таймеры ходов, покрытые сквозными тестами',
          fr: 'Club de cartes en un contre un : serveur de jeu à équité prouvable, registre de jetons en partie double, appariement et pendules de coups, couverts par des tests de bout en bout',
        },
        {
          en: 'Satirical bunker idle clicker: server-validated economy with anti-cheat bounds, rewards re-judged on every save, bot referral links, and an analytics pipeline for retention, progression and sessions',
          hy: 'Երգիծական idle-քլիքեր բունկերի մասին. սերվերում ստուգվող էկոնոմիկա՝ հակախաբեության սահմաններով, պարգևների վերստուգում յուրաքանչյուր պահպանման ժամանակ, հրավերի հղումներ բոտի միջոցով և պահպանման, առաջընթացի ու սեսիաների վերլուծություն',
          ru: 'Сатирический idle-кликер про бункер: экономика с проверкой на сервере и античитом, награды перепроверяются при каждом сохранении, реферальные ссылки через бота и аналитика удержания, прогресса и сессий',
          fr: 'Jeu idle satirique dans un bunker : économie validée côté serveur avec bornes anti-triche, récompenses revérifiées à chaque sauvegarde, liens de parrainage via le bot et analytique de rétention, de progression et de sessions',
        },
      ],
      stack: ['Telegram Mini Apps', 'Telegram Bot API', 'React', 'TypeScript', 'Node.js', 'WebSockets', 'Supabase', 'PostgreSQL'],
      domains: ['games', 'web'],
    },
    {
      id: 'nda-mobile',
      kind: 'nda',
      short: { en: 'Mobile app', hy: 'Բջջային հավելված', ru: 'Мобильное приложение', fr: 'App mobile' },
      title: { en: 'Cross-platform mobile app', hy: 'Կրոսպլատֆորմ բջջային հավելված', ru: 'Кроссплатформенное мобильное приложение', fr: 'Application mobile multiplateforme' },
      org: { en: 'Confidential client', hy: 'Գաղտնի հաճախորդ', ru: 'Конфиденциальный клиент', fr: 'Client confidentiel' },
      start: '2026',
      end: null,
      points: [
        {
          en: 'Android and iOS app sharing business logic and UI through Kotlin Multiplatform and Compose Multiplatform',
          hy: 'Android և iOS հավելված՝ ընդհանուր բիզնես տրամաբանությամբ և ինտերֆեյսով Kotlin Multiplatform-ի և Compose Multiplatform-ի միջոցով',
          ru: 'Приложение для Android и iOS с общей бизнес-логикой и интерфейсом на Kotlin Multiplatform и Compose Multiplatform',
          fr: 'Application Android et iOS partageant la logique métier et l’interface via Kotlin Multiplatform et Compose Multiplatform',
        },
      ],
      stack: ['Kotlin', 'Compose Multiplatform', 'Android', 'iOS'],
      domains: ['systems'],
    },
    {
      id: 'nda-fintech',
      kind: 'nda',
      short: { en: 'Brokerage platform', hy: 'Բրոքերային հարթակ', ru: 'Брокерская платформа', fr: 'Plateforme de courtage' },
      title: { en: 'Web platform for an international brokerage', hy: 'Վեբ հարթակ միջազգային բրոքերային ընկերության համար', ru: 'Веб-платформа для международного брокера', fr: 'Plateforme web pour un courtier international' },
      org: { en: 'Confidential client', hy: 'Գաղտնի հաճախորդ', ru: 'Конфиденциальный клиент', fr: 'Client confidentiel' },
      start: '2026',
      end: null,
      points: [
        {
          en: 'Public marketing site with CRM-backed sign-up, login and password reset behind CAPTCHA',
          hy: 'Հանրային մարքեթինգային կայք՝ CRM-ով գրանցմամբ, մուտքով և գաղտնաբառի վերականգնմամբ, CAPTCHA պաշտպանությամբ',
          ru: 'Публичный маркетинговый сайт с регистрацией, входом и сбросом пароля через CRM под защитой CAPTCHA',
          fr: 'Site marketing public avec inscription, connexion et réinitialisation du mot de passe adossées au CRM, protégées par CAPTCHA',
        },
        {
          en: 'Multi-language content pipeline on a translation-management system',
          hy: 'Բազմալեզու բովանդակություն՝ թարգմանությունների կառավարման համակարգով',
          ru: 'Многоязычный контент через систему управления переводами',
          fr: 'Contenu multilingue géré via un système de gestion des traductions',
        },
        {
          en: 'Internal employee portal and analytics tooling',
          hy: 'Աշխատակիցների ներքին պորտալ և վերլուծական գործիքներ',
          ru: 'Внутренний портал сотрудников и инструменты аналитики',
          fr: 'Portail interne des employés et outils d’analyse',
        },
        {
          en: 'Card-service backend with JWT auth and a React front end',
          hy: 'Քարտային ծառայության backend՝ JWT նույնականացմամբ և React front-end-ով',
          ru: 'Бэкенд карточного сервиса с JWT-авторизацией и фронтендом на React',
          fr: 'Backend de service de cartes avec authentification JWT et front-end React',
        },
      ],
      stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Zod', 'Laravel', 'PHP'],
      domains: ['web'],
    },
    {
      id: 'bizzy',
      kind: 'work',
      title: { en: 'Full Stack Web Developer', hy: 'Full-stack վեբ ծրագրավորող', ru: 'Full-stack веб-разработчик', fr: 'Développeur web full-stack' },
      org: 'Bizzy Agency',
      orgUrl: 'https://bizzy.am/',
      start: '2025-08',
      end: null,
      points: [
        {
          en: 'Develop and maintain production web applications in React',
          hy: 'React-ով արտադրական վեբ հավելվածների մշակում և սպասարկում',
          ru: 'Разработка и поддержка продакшн-веб-приложений на React',
          fr: 'Développement et maintenance d’applications web React en production',
        },
        {
          en: 'Integrate third-party APIs and implement SEO optimizations',
          hy: 'Արտաքին API-ների ինտեգրում և SEO օպտիմալացում',
          ru: 'Интеграция сторонних API и SEO-оптимизация',
          fr: 'Intégration d’API tierces et optimisation SEO',
        },
        {
          en: 'Build WCAG-compliant interfaces with designers in Figma',
          hy: 'WCAG համապատասխան ինտերֆեյսներ դիզայներների հետ՝ Figma-ում',
          ru: 'Интерфейсы по стандарту WCAG вместе с дизайнерами в Figma',
          fr: 'Interfaces conformes WCAG conçues avec les designers dans Figma',
        },
        {
          en: 'Improve performance, scalability and reliability; worked on the agency site bizzy.am',
          hy: 'Արագագործության, մասշտաբայնության և հուսալիության բարելավում, աշխատանք գործակալության bizzy.am կայքի վրա',
          ru: 'Повышение производительности, масштабируемости и надёжности; работа над сайтом агентства bizzy.am',
          fr: 'Amélioration des performances, de la scalabilité et de la fiabilité ; travail sur le site de l’agence bizzy.am',
        },
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
      title: { en: 'Full-stack development and DevOps program', hy: 'Full-stack ծրագրավորման և DevOps ծրագիր', ru: 'Программа по full-stack разработке и DevOps', fr: 'Programme de développement full-stack et DevOps' },
      org: 'TechX Global',
      start: '2025-07',
      end: '2025',
      points: [
        {
          en: 'Intensive training in full-stack development and modern DevOps tools',
          hy: 'Ինտենսիվ ուսուցում full-stack ծրագրավորման և ժամանակակից DevOps գործիքների ուղղությամբ',
          ru: 'Интенсивное обучение full-stack разработке и современным DevOps-инструментам',
          fr: 'Formation intensive au développement full-stack et aux outils DevOps modernes',
        },
        {
          en: 'Hands-on projects in HTML, CSS and JavaScript with responsive, accessible design',
          hy: 'Գործնական նախագծեր HTML-ով, CSS-ով և JavaScript-ով՝ ադապտիվ և մատչելի դիզայնով',
          ru: 'Практические проекты на HTML, CSS и JavaScript с адаптивной и доступной вёрсткой',
          fr: 'Projets pratiques en HTML, CSS et JavaScript, responsive et accessibles',
        },
        {
          en: 'Turned Figma mockups into working web interfaces',
          hy: 'Figma-ի մակետների վերածում աշխատող վեբ ինտերֆեյսների',
          ru: 'Перенос макетов из Figma в работающие веб-интерфейсы',
          fr: 'Maquettes Figma transformées en interfaces web fonctionnelles',
        },
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'Figma', 'DevOps'],
      domains: ['web'],
    },
    {
      id: 'synopsys',
      kind: 'training',
      short: { en: 'Synopsys course', hy: 'Synopsys դասընթաց', ru: 'Курс Synopsys', fr: 'Cours Synopsys' },
      title: { en: 'Integrated circuits and scripting languages', hy: 'Ինտեգրալ սխեմաներ և սկրիպտային լեզուներ', ru: 'Интегральные схемы и скриптовые языки', fr: 'Circuits intégrés et langages de script' },
      org: 'Synopsys',
      start: '2025-01',
      end: '2025-06',
      points: [
        {
          en: 'Introduction to IC design and device physics',
          hy: 'Ներածություն ինտեգրալ սխեմաների նախագծման և սարքերի ֆիզիկայի մեջ',
          ru: 'Введение в проектирование интегральных схем и физику приборов',
          fr: 'Introduction à la conception de circuits intégrés et à la physique des composants',
        },
        {
          en: 'Final project presented with a written report',
          hy: 'Ավարտական նախագիծ՝ գրավոր զեկույցով',
          ru: 'Итоговый проект с письменным отчётом',
          fr: 'Projet final présenté avec un rapport écrit',
        },
      ],
      stack: [
        { en: 'IC design', hy: 'ԻՍ նախագծում', ru: 'Проектирование ИС', fr: 'Conception de CI' },
        { en: 'Scripting', hy: 'Սկրիպտավորում', ru: 'Скрипты', fr: 'Scripts' },
      ],
      domains: ['systems'],
    },
    {
      id: 'trustedclicks',
      kind: 'work',
      title: { en: 'Link Building Specialist', hy: 'Link building մասնագետ', ru: 'Специалист по линкбилдингу', fr: 'Spécialiste netlinking' },
      org: 'Trusted Clicks',
      start: '2025-02',
      end: '2025-02',
      points: [
        {
          en: 'Backlink research for SEO campaigns',
          hy: 'Հետադարձ հղումների որոնում SEO արշավների համար',
          ru: 'Поиск обратных ссылок для SEO-кампаний',
          fr: 'Recherche de backlinks pour des campagnes SEO',
        },
        {
          en: 'Hands-on work with digital-marketing and search-engine tools',
          hy: 'Թվային մարքեթինգի և որոնողական համակարգերի գործիքների գործնական կիրառում',
          ru: 'Практика с инструментами цифрового маркетинга и поисковых систем',
          fr: 'Pratique des outils de marketing digital et des moteurs de recherche',
        },
      ],
      stack: ['SEO'],
      domains: ['web'],
    },
    {
      id: 'gurus',
      kind: 'training',
      short: { en: 'R training', hy: 'R դասընթաց', ru: 'Курс R', fr: 'Formation R' },
      title: { en: 'Statistical programming in R', hy: 'Վիճակագրական ծրագրավորում R-ով', ru: 'Статистическое программирование на R', fr: 'Programmation statistique en R' },
      org: 'Gurus LLC',
      start: '2024-06',
      end: '2024-07',
      points: [
        {
          en: 'Basics of statistical programming: writing R scripts and functions',
          hy: 'Վիճակագրական ծրագրավորման հիմունքներ՝ R սկրիպտներ և ֆունկցիաներ',
          ru: 'Основы статистического программирования: скрипты и функции на R',
          fr: 'Bases de la programmation statistique : scripts et fonctions en R',
        },
      ],
      stack: ['R'],
      domains: ['data'],
    },
    {
      id: 'hpc',
      kind: 'training',
      short: { en: 'Supercomputer', hy: 'Գերհամակարգիչ', ru: 'Суперкомпьютер', fr: 'Supercalculateur' },
      title: {
        en: 'Hands-on training on supercomputer access',
        hy: 'Գործնական դասընթաց՝ գերհամակարգչի հասանելիության վերաբերյալ',
        ru: 'Практический курс работы с суперкомпьютером',
        fr: 'Formation pratique à l’accès au supercalculateur',
      },
      org: {
        en: 'Armenian National Supercomputer Center',
        hy: 'Հայաստանի ազգային գերհամակարգչային կենտրոն',
        ru: 'Национальный суперкомпьютерный центр Армении',
        fr: 'Centre national de supercalcul d’Arménie',
      },
      start: '2024-03',
      end: '2024-03',
      points: [
        {
          en: 'Practical experience with high-performance computing infrastructure',
          hy: 'Բարձր արտադրողականությամբ հաշվարկային ենթակառուցվածքի հետ գործնական փորձ',
          ru: 'Практический опыт работы с инфраструктурой высокопроизводительных вычислений',
          fr: 'Expérience pratique d’une infrastructure de calcul haute performance',
        },
      ],
      stack: ['HPC'],
      domains: ['systems'],
    },
  ],

  education: [
    {
      id: 'ufar',
      title: { en: 'BSc in Computer Science', hy: 'Համակարգչային գիտությունների բակալավր', ru: 'Бакалавр компьютерных наук', fr: 'Licence en informatique' },
      org: {
        en: 'French University in Armenia (UFAR)',
        hy: 'Հայաստանում Ֆրանսիական համալսարան (ՀՖՀ)',
        ru: 'Французский университет в Армении (UFAR)',
        fr: 'Université Française en Arménie (UFAR)',
      },
      start: '2022-08',
      end: '2026-06',
      note: {
        en: 'Faculty of Computer Science and Applied Mathematics. Project-based curriculum: software engineering, algorithms, databases, operating systems, networks, AI and data science.',
        hy: 'Ինֆորմատիկայի և կիրառական մաթեմատիկայի ֆակուլտետ։ Նախագծային ուսուցում՝ ծրագրային ճարտարագիտություն, ալգորիթմներ, տվյալների բազաներ, օպերացիոն համակարգեր, ցանցեր, արհեստական բանականություն և տվյալագիտություն։',
        ru: 'Факультет информатики и прикладной математики. Проектное обучение: программная инженерия, алгоритмы, базы данных, операционные системы, сети, ИИ и науки о данных.',
        fr: 'Faculté d’informatique et de mathématiques appliquées. Cursus par projets : génie logiciel, algorithmique, bases de données, systèmes d’exploitation, réseaux, IA et science des données.',
      },
    },
    {
      id: 'fca',
      title: {
        en: "Associate's Degree in Economics",
        hy: 'Միջին մասնագիտական կրթություն, տնտեսագիտություն',
        ru: 'Среднее профессиональное образование, экономика',
        fr: 'Diplôme de premier cycle en économie',
      },
      org: { en: 'French College in Armenia', hy: 'Հայաստանի ֆրանսիական քոլեջ', ru: 'Французский колледж в Армении', fr: 'Collège français d’Arménie' },
      start: '2019',
      end: '2022',
      note: {
        en: 'An economics foundation before moving into computer science.',
        hy: 'Տնտեսագիտական հիմք՝ համակարգչային գիտություններին անցնելուց առաջ։',
        ru: 'Экономическая база перед переходом в компьютерные науки.',
        fr: 'Une base en économie avant de passer à l’informatique.',
      },
    },
  ],

  certificates: [
    {
      name: {
        en: 'Cambridge B2 First (FCE), English at C1 level',
        hy: 'Cambridge B2 First (FCE), անգլերեն՝ C1 մակարդակ',
        ru: 'Cambridge B2 First (FCE), английский на уровне C1',
        fr: 'Cambridge B2 First (FCE), anglais niveau C1',
      },
      org: 'Cambridge English',
    },
    {
      name: {
        en: 'Hands-on training on supercomputer access',
        hy: 'Գործնական դասընթաց՝ գերհամակարգչի հասանելիության վերաբերյալ',
        ru: 'Практический курс работы с суперкомпьютером',
        fr: 'Formation pratique à l’accès au supercalculateur',
      },
      org: {
        en: 'Armenian National Supercomputer Center',
        hy: 'Հայաստանի ազգային գերհամակարգչային կենտրոն',
        ru: 'Национальный суперкомпьютерный центр Армении',
        fr: 'Centre national de supercalcul d’Arménie',
      },
      year: 2024,
    },
    {
      name: {
        en: 'Guest coordinator, Swiss National Day in Armenia',
        hy: 'Հյուրերի համակարգող, Շվեյցարիայի ազգային օրը Հայաստանում',
        ru: 'Координатор гостей, Национальный день Швейцарии в Армении',
        fr: 'Coordinateur des invités, Fête nationale suisse en Arménie',
      },
      org: { en: 'Volunteering', hy: 'Կամավորություն', ru: 'Волонтёрство', fr: 'Bénévolat' },
      year: 2024,
    },
  ],

  projects: [
    {
      id: 'rag',
      name: 'RAG PDF Chatbot',
      short: 'RAG Chatbot',
      date: '2026-06',
      tagline: {
        en: 'Private question answering over your PDFs',
        hy: 'Գաղտնի հարց ու պատասխան ձեր PDF-ների վերաբերյալ',
        ru: 'Приватные ответы на вопросы по вашим PDF',
        fr: 'Questions-réponses privées sur vos PDF',
      },
      text: {
        en: 'Answers questions about PDF files with the source cited, fully offline: pdfplumber extraction, ChromaDB embeddings, a local Ollama model, a FastAPI service and a Chainlit chat UI.',
        hy: 'Պատասխանում է PDF ֆայլերի վերաբերյալ հարցերին՝ նշելով աղբյուրը, ամբողջովին օֆլայն. pdfplumber-ով դուրսբերում, ChromaDB embedding-ներ, տեղային Ollama մոդել, FastAPI ծառայություն և Chainlit չաթի ինտերֆեյս։',
        ru: 'Отвечает на вопросы по PDF-файлам со ссылкой на источник и полностью офлайн: извлечение через pdfplumber, эмбеддинги в ChromaDB, локальная модель Ollama, сервис на FastAPI и чат-интерфейс на Chainlit.',
        fr: 'Répond aux questions sur des PDF en citant la source, entièrement hors ligne : extraction pdfplumber, embeddings ChromaDB, modèle local Ollama, service FastAPI et interface de chat Chainlit.',
      },
      stack: ['Python', 'ChromaDB', 'Ollama', 'FastAPI', 'Chainlit'],
      url: 'https://github.com/emilhovh/RAG-chatbot',
      domains: ['ml'],
      featured: true,
    },
    {
      id: 'statsphere',
      name: 'StatSphere',
      date: '2026-05',
      tagline: {
        en: 'A/B testing and statistical modelling pipeline',
        hy: 'A/B թեստավորման և վիճակագրական մոդելավորման pipeline',
        ru: 'Пайплайн A/B-тестов и статистического моделирования',
        fr: 'Pipeline de tests A/B et de modélisation statistique',
      },
      text: {
        en: 'Simulates and analyses experiments end to end: sample-ratio-mismatch checks, CUPED variance reduction, Benjamini–Hochberg correction, bootstrap intervals, OLS and logistic regression, and an auto-written report.',
        hy: 'Մոդելավորում և վերլուծում է փորձերն ամբողջությամբ. SRM ստուգում, CUPED դիսպերսիայի կրճատում, Բենջամինի–Հոխբերգի ուղղում, bootstrap միջակայքեր, գծային և լոգիստիկ ռեգրեսիա և ավտոմատ ստեղծվող զեկույց։',
        ru: 'Моделирует и анализирует эксперименты от начала до конца: проверка SRM, снижение дисперсии CUPED, поправка Бенджамини–Хохберга, бутстреп-интервалы, линейная и логистическая регрессия и автоматический отчёт.',
        fr: 'Simule et analyse des expériences de bout en bout : contrôle du SRM, réduction de variance CUPED, correction de Benjamini–Hochberg, intervalles par bootstrap, régressions linéaire et logistique, et rapport généré automatiquement.',
      },
      stack: ['Python', 'statsmodels', 'scikit-learn', 'Pandas'],
      url: 'https://github.com/emilhovh/StatSphere',
      domains: ['data'],
      featured: true,
    },
    {
      id: 'eventsphere',
      name: 'EventSphere Analytics',
      short: 'EventSphere',
      date: '2026-04',
      tagline: {
        en: 'Behavioural analytics for a simulated SaaS product',
        hy: 'Վարքագծային վերլուծություն մոդելավորված SaaS արտադրանքի համար',
        ru: 'Поведенческая аналитика для смоделированного SaaS-продукта',
        fr: 'Analytique comportementale pour un produit SaaS simulé',
      },
      text: {
        en: 'Pipeline over 150K+ events from 1,500 users: cohort retention, conversion funnel, RFM segmentation, churn-risk tiers, channel and device breakdowns — eight analyses with static and interactive dashboards, all in Docker.',
        hy: 'Pipeline՝ 1 500 օգտատիրոջ 150 հազարից ավելի իրադարձությունների վրա. կոհորտային պահպանում, փոխակերպման ձագար, RFM սեգմենտավորում, հեռացման ռիսկի մակարդակներ, բաշխում ըստ ալիքների և սարքերի՝ ութ վերլուծություն ստատիկ և ինտերակտիվ վահանակներով, ամբողջը Docker-ում։',
        ru: 'Пайплайн по 150 тыс.+ событий от 1 500 пользователей: удержание когорт, воронка конверсии, RFM-сегментация, уровни риска оттока, разбивка по каналам и устройствам — восемь анализов со статичными и интерактивными дашбордами, всё в Docker.',
        fr: 'Pipeline sur plus de 150 000 événements de 1 500 utilisateurs : rétention par cohorte, entonnoir de conversion, segmentation RFM, niveaux de risque d’attrition, répartition par canal et appareil — huit analyses avec tableaux de bord statiques et interactifs, le tout dans Docker.',
      },
      stack: ['PostgreSQL', 'Python', 'Pandas', 'Plotly', 'Docker'],
      url: 'https://github.com/emilhovh/eventsphere-analytics',
      domains: ['data'],
      featured: true,
    },
    {
      id: 'ecc',
      name: 'ECC Singularity Validator',
      short: 'ECC Validator',
      date: '2026-01',
      tagline: {
        en: 'Safety checks for elliptic-curve key generation',
        hy: 'Էլիպսային կորերի վրա բանալիների գեներացման անվտանգության ստուգում',
        ru: 'Проверка безопасности генерации ключей на эллиптических кривых',
        fr: 'Contrôles de sécurité pour la génération de clés sur courbes elliptiques',
      },
      text: {
        en: 'Plots elliptic curves, computes the discriminant, detects singular curves (cusps and nodes) and blocks key generation on parameters that would break ECC security.',
        hy: 'Կառուցում է էլիպսային կորեր, հաշվում դիսկրիմինանտը, հայտնաբերում եզակի կորեր (կասպեր և հանգույցներ) և արգելափակում է բանալիների գեներացումը այն պարամետրերով, որոնք կխախտեն ECC-ի անվտանգությունը։',
        ru: 'Строит эллиптические кривые, считает дискриминант, находит особые кривые (каспы и узлы) и блокирует генерацию ключей на параметрах, которые ломают безопасность ECC.',
        fr: 'Trace des courbes elliptiques, calcule le discriminant, détecte les courbes singulières (points de rebroussement et nœuds) et bloque la génération de clés pour les paramètres qui briseraient la sécurité ECC.',
      },
      stack: ['Python', 'NumPy', 'Matplotlib'],
      url: 'https://github.com/emilhovh/Elliptic-Curves-and-Singularity-in-Cryptographic-Key-Generation',
      domains: ['systems'],
    },
    {
      id: 'deepcarex',
      name: 'DeepCareX',
      date: '2025-12',
      tagline: {
        en: 'AI-based healthcare diagnosis system',
        hy: 'AI-ի վրա հիմնված բժշկական ախտորոշման համակարգ',
        ru: 'ИИ-система медицинской диагностики',
        fr: 'Système de diagnostic médical fondé sur l’IA',
      },
      text: {
        en: 'Capstone web app that screens for several diseases with CNNs, XGBoost and transfer learning at 94–99% accuracy across models. Team of four; I led backend development and ML optimization.',
        hy: 'Ավարտական վեբ հավելված, որը հայտնաբերում է մի քանի հիվանդություն CNN-ների, XGBoost-ի և transfer learning-ի միջոցով՝ 94–99% ճշգրտությամբ տարբեր մոդելներում։ Չորս հոգանոց թիմ, ես ղեկավարել եմ backend-ը և ML օպտիմալացումը։',
        ru: 'Дипломное веб-приложение, которое выявляет несколько заболеваний с помощью CNN, XGBoost и transfer learning с точностью 94–99% по разным моделям. Команда из четырёх человек; я отвечал за бэкенд и оптимизацию ML.',
        fr: 'Application web de fin d’études qui dépiste plusieurs maladies grâce aux CNN, à XGBoost et à l’apprentissage par transfert, avec 94 à 99 % de précision selon les modèles. Équipe de quatre ; j’ai piloté le backend et l’optimisation ML.',
      },
      stack: ['TensorFlow', 'XGBoost', 'Flask', 'Docker'],
      url: 'https://github.com/emilhovh/Project-S5',
      domains: ['ml', 'web'],
      featured: true,
    },
  ],

  // older, smaller repositories worth linking; empty means the section is not shown
  archive: [],

  skills: [
    {
      group: { en: 'AI & computer vision', hy: 'AI և համակարգչային տեսողություն', ru: 'ИИ и компьютерное зрение', fr: 'IA et vision par ordinateur' },
      items: [
        { en: 'Computer vision', hy: 'Համակարգչային տեսողություն', ru: 'Компьютерное зрение', fr: 'Vision par ordinateur' },
        'OCR (Tesseract)',
        { en: 'PDF extraction (PyMuPDF)', hy: 'PDF դուրսբերում (PyMuPDF)', ru: 'Извлечение из PDF (PyMuPDF)', fr: 'Extraction PDF (PyMuPDF)' },
        'Vision LLMs', 'RAG', 'TensorFlow', 'XGBoost',
      ],
    },
    {
      group: { en: 'Data & statistics', hy: 'Տվյալներ և վիճակագրություն', ru: 'Данные и статистика', fr: 'Données et statistiques' },
      items: [
        'Python', 'Pandas', 'NumPy', 'scikit-learn', 'statsmodels',
        { en: 'A/B testing', hy: 'A/B թեստավորում', ru: 'A/B-тесты', fr: 'Tests A/B' },
        'R',
      ],
    },
    {
      group: { en: 'Frontend', hy: 'Frontend', ru: 'Фронтенд', fr: 'Front-end' },
      items: [
        'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite',
        { en: 'Accessibility (WCAG)', hy: 'Մատչելիություն (WCAG)', ru: 'Доступность (WCAG)', fr: 'Accessibilité (WCAG)' },
      ],
    },
    {
      group: { en: 'Backend', hy: 'Backend', ru: 'Бэкенд', fr: 'Back-end' },
      items: ['Node.js', 'Flask', 'FastAPI', 'Laravel', 'REST APIs', 'WebSockets', 'Telegram Bot API'],
    },
    {
      group: { en: 'Storage & infrastructure', hy: 'Պահպանում և ենթակառուցվածք', ru: 'Хранение и инфраструктура', fr: 'Stockage et infrastructure' },
      items: ['PostgreSQL', 'SQLite', 'Supabase', 'ChromaDB', 'Amazon S3', 'Docker', 'Kubernetes', 'Gunicorn'],
    },
    {
      group: { en: 'Mobile & more', hy: 'Բջջային և այլն', ru: 'Мобильная разработка и другое', fr: 'Mobile et plus' },
      items: ['Telegram Mini Apps', 'Kotlin Multiplatform', 'C#', 'C', 'Playwright'],
    },
  ],

  languages: [
    { code: 'hy', endonym: 'Հայերեն', level: 5, cefr: 'native', name: { en: 'Armenian', hy: 'Հայերեն', ru: 'Армянский', fr: 'Arménien' } },
    { code: 'ru', endonym: 'Русский', level: 5, cefr: 'native', name: { en: 'Russian', hy: 'Ռուսերեն', ru: 'Русский', fr: 'Russe' } },
    { code: 'en', endonym: 'English', level: 4, cefr: 'C1', name: { en: 'English', hy: 'Անգլերեն', ru: 'Английский', fr: 'Anglais' } },
    { code: 'fr', endonym: 'Français', level: 3, cefr: 'B1', name: { en: 'French', hy: 'Ֆրանսերեն', ru: 'Французский', fr: 'Français' } },
  ],

  // what "native" is called, since CEFR levels themselves are international
  nativeLevel: { en: 'Native', hy: 'Մայրենի', ru: 'Родной', fr: 'Langue maternelle' },

  domains: {
    web: { en: 'Web platforms', hy: 'Վեբ հարթակներ', ru: 'Веб-платформы', fr: 'Plateformes web' },
    data: { en: 'Data & analytics', hy: 'Տվյալներ և վերլուծություն', ru: 'Данные и аналитика', fr: 'Données et analytique' },
    ml: { en: 'AI & machine learning', hy: 'AI և մեքենայական ուսուցում', ru: 'ИИ и машинное обучение', fr: 'IA et apprentissage automatique' },
    games: { en: 'Games & realtime', hy: 'Խաղեր և իրական ժամանակ', ru: 'Игры и realtime', fr: 'Jeux et temps réel' },
    systems: { en: 'Apps & systems', hy: 'Հավելվածներ և համակարգեր', ru: 'Приложения и системы', fr: 'Applications et systèmes' },
  },
}
