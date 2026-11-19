// Interview processes you're preparing for. Each one gets its own prep page at /interviews/<id>.
// Round times, results and ticked prep items are saved in the browser (and in the backup file);
// everything below is the prep content, written from the job description and your resume.
//
// `links` entries are ids of problems ('topic/problem') or concept questions ('ai:…', 'backend:…'),
// or { title, url } for outside pages.

const V = 'ai:voice-';

export const opportunities = [
  {
    id: 'iksha-labs',
    company: 'Iksha Labs',
    role: 'Lead Engineer (full stack, real-time voice AI)',
    location: 'Gurugram, from their office',
    experience: '8–15 years',
    source: 'Cutshort Lightning (exclusive job), recruiter Ariba Khan',
    addedOn: '2026-11-19',
    rounds: [{ id: 'r1', name: 'Round 1', date: '2026-11-23', time: '', type: '', withWhom: '', result: 'upcoming' }],

    about: [
      'Iksha Labs Private Limited, based in Gurugram. Started in 2019. Around 20–100 people.',
      'Bootstrapped and profitable: they grew without outside funding. The founder says bootstrapping is "a feature, not a bug".',
      'Founder and CEO: Hitesh Ganjoo. The job says you will work directly with him, so Round 1 may well be with him.',
      'Main product right now: AI voice agents. Hindi voice agents for hospitals and diagnostic centres in NCR, J&K and Punjab, with more Indian languages (Kannada, Marathi, Telugu) planned.',
      'Voice agents for banks and lenders too: payment reminders and debt-recovery calls that connect to the client\'s CRM. This is close to your lending background.',
      'Other products: Rumi, an AI hiring agent that screens and assesses candidates (launched April 2025), and medical imaging / mixed-reality tools for surgery.',
      'They say their healthcare AI is built with safety, the hospital\'s own policies and human oversight at the centre.',
      'The founder\'s motto: "reduce theory-to-reality latency". They like people who ship fast.',
    ],
    sources: [
      { title: 'Iksha Labs rolls out Hindi AI voice agents for healthcare (Digital Health News)', url: 'https://www.digitalhealthnews.com/exclusive-iksha-labs-rolls-out-hindi-ai-voice-agents-for-healthcare-in-ncr-j-k-punjab' },
      { title: 'Iksha Labs voice agents for BFSI (CRN India)', url: 'https://www.crn.in/?p=72128' },
      { title: 'Hitesh Ganjoo on AI agents and bootstrapping (TimesTech)', url: 'https://timestech.in/ai-agents-bootstrapping-and-beyond-hitesh-ganjoo-on-iksha-labs/' },
      { title: 'Rumi, the AI hiring agent (Business News This Week)', url: 'https://businessnewsthisweek.com/?p=313606' },
      { title: 'Iksha Labs on Cutshort', url: 'https://cutshort.io/company/iksha-labs-74-YmbIZMjY' },
      { title: 'ikshalabs.com', url: 'https://ikshalabs.com' },
    ],

    // The job description in simple words
    want: [
      'A **lead who still codes every day**. Not only a manager: you build the hardest parts yourself.',
      'You **own how the whole product is built**: the real-time voice agents, backend services, data and APIs.',
      '**Strong Python backend.** You have built services that scaled, and you can explain the trade-offs.',
      'You also build **what clients see**: dashboards, review tools and settings pages.',
      'You keep it **fast and reliable**: monitoring, alerts, testing and evals, fixing slow parts.',
      'You **raise the team\'s level**: code reviews, mentoring, standards.',
      'You **work with the founder** on the roadmap and turn vague ideas into shipped features.',
      'Nice to have: LLMs in production, voice or real-time products, healthcare or fintech, startup experience.',
    ],

    // What they need → proof from your resume
    match: [
      { need: 'Lead and still hands-on', proof: 'You lead a team of 6 on OptimaAI and own the architecture, and you built core parts yourself: 5 MCP servers, Temporal workflows.' },
      { need: 'AI agents in production', proof: 'OptimaAI: an agentic credit-underwriting platform on Claude + MCP + Temporal, live with 10 lenders in India and MENA.' },
      { need: 'Strong Python backend', proof: 'Python 3.13 / FastAPI monorepo with an async data layer: PostgreSQL + SQLAlchemy 2.0 + asyncpg, Redis, Qdrant.' },
      { need: 'Architecture and trade-offs', proof: 'You chose MCP (one tool interface, so new tools plug in without changing agent code) and Temporal (durable state, automatic retries, 100+ concurrent workflows).' },
      { need: 'Reliable and fast in production', proof: 'Weekly releases at 99.9%+ uptime with Docker, Kubernetes + Helm and ArgoCD GitOps; Pytest unit / integration / e2e standards you set.' },
      { need: 'Correctness and trust in AI output', proof: 'Citation pipeline: every AI answer links to its source. AI edits have per-turn versioning, audit history and rollback.' },
      { need: 'Client-facing screens', proof: 'React 18 + TypeScript at OptimaAI (AI chat, dashboards, citation UI), early-risk dashboards at Yubi, Angular at Publicis Sapient / Verizon.' },
      { need: 'Data models and APIs across clients', proof: 'Hierarchical RBAC across lender → division → branch for 6 personas; REST + GraphQL APIs; separate India and UAE environments.' },
      { need: 'Regulated, high-stakes domain', proof: 'Lending: OptimaAI for lenders at Accumn, and a loan management system used by 50+ lenders at Yubi.' },
      { need: 'Mentoring and standards', proof: 'Code-review process, mentoring and interviewing at Accumn; led 4 developers at Publicis Sapient.' },
    ],

    // What the JD wants that your resume doesn't show yet
    gaps: [
      {
        gap: 'Real-time voice (the core of this job)',
        why: 'Your resume shows text and chat agents, not live voice calls.',
        how: 'Learn the pipeline: audio → speech-to-text → LLM → text-to-speech → audio, all streaming, in about a second. Be honest: "I haven\'t shipped voice yet. Here is how I would build it, and here is what carries over from OptimaAI: tool calling, streaming, durable workflows, evals."',
        links: [`${V}design-a-real-time-voice-ai-agent-end-to-end`, `${V}where-does-the-latency-go-in-a-voice-call-and-how-do-you-cut-it`, `${V}how-do-you-handle-interruptions-barge-in-and-turn-taking`],
      },
      {
        gap: 'Phone calls and audio transport',
        why: 'Their hospital and bank agents talk to people over normal phone lines.',
        how: 'Know the difference between SIP / phone lines, WebRTC and WebSockets, and what a telephony provider does.',
        links: [`${V}websockets-vs-webrtc-vs-phone-lines-sip-which-and-when`, 'backend:fastapi-how-do-you-stream-responses-sse-from-fastapi'],
      },
      {
        gap: 'Hindi and other Indian languages',
        why: 'Their product is vernacular voice: Hindi now, more languages next.',
        how: 'Think about Hinglish (mixed Hindi and English), accents, saying names, numbers and dates correctly, and testing each language separately.',
        links: [`${V}how-do-you-test-and-monitor-a-voice-agent`],
      },
      {
        gap: 'Healthcare data',
        why: 'Hospitals mean patient data. Your compliance experience is in lending.',
        how: 'Explain consent, collecting less data, redaction, access control, audit logs and data residency. Your India / UAE split and RBAC carry over directly.',
        links: [`${V}how-do-you-keep-patient-data-safe-in-a-voice-ai-product`, 'backend:system-design-design-an-audit-log-system-for-a-regulated-lending-platform'],
      },
      {
        gap: 'Monitoring a live AI product',
        why: 'The JD stresses catching problems before clients notice.',
        how: 'Have clear answers on SLOs, latency per stage, alerts and call-quality metrics.',
        links: ['backend:distributed-observability-logs-metrics-traces-slos', 'ai:evals-what-do-you-log-trace-for-llm-features'],
      },
    ],

    // Day-by-day plan until the interview
    plan: [
      {
        day: 'Thursday, 19 Nov (tonight, 30 minutes)',
        items: [
          { id: 'recruiter', text: 'Message Ariba Khan: ask the round time, length, format (video, phone or in person), who the interviewer is, and whether there is coding. Also ask if the first screen is with Rumi, their AI interviewer.' },
          { id: 'read-page', text: 'Read this page once: the company, what they want, and your gaps.' },
        ],
      },
      {
        day: 'Friday, 20 Nov',
        items: [
          { id: 'intro', text: 'Write your 90-second intro for this role (see "Tell me about yourself" below). Say it out loud 3 times.', links: [] },
          { id: 'stories', text: 'Prepare 3 short stories from OptimaAI: a big technical decision, a production problem you fixed, and someone you mentored.', links: ['backend:leadership-tell-me-about-a-hard-technical-decision-you-made-and-its-trade-offs', 'backend:leadership-how-do-you-handle-a-production-incident', 'backend:leadership-how-do-you-mentor-engineers-and-grow-the-team'] },
          { id: 'voice-basics', text: 'Learn the voice pipeline, latency and barge-in.', links: [`${V}design-a-real-time-voice-ai-agent-end-to-end`, `${V}where-does-the-latency-go-in-a-voice-call-and-how-do-you-cut-it`, `${V}how-do-you-handle-interruptions-barge-in-and-turn-taking`] },
        ],
      },
      {
        day: 'Saturday, 21 Nov',
        items: [
          { id: 'mock-design', text: 'Practise one system design out loud for 45 minutes: "Design a Hindi voice agent that books hospital appointments." Draw it on paper first.', links: [`${V}design-a-real-time-voice-ai-agent-end-to-end`] },
          { id: 'optima-arch', text: 'Draw the OptimaAI architecture from memory in 5 minutes, and say one trade-off for each box.', links: ['ai:ai-design-design-optimaai-an-ai-credit-underwriting-platform'] },
          { id: 'python', text: 'Revise async Python and scaling FastAPI: the event loop, blocking calls, workers.', links: ['backend:python-how-does-asyncio-work-when-is-async-actually-faster', 'backend:python-what-happens-if-you-call-blocking-code-inside-an-async-endpoint', 'backend:fastapi-background-tasks-vs-celery-vs-temporal-when-to-use-which'] },
          { id: 'reliability', text: 'Revise reliability: timeouts, retries, circuit breakers, SLOs, testing and monitoring a voice agent.', links: ['backend:distributed-resilience-patterns-timeouts-retries-circuit-breakers-bulkheads', `${V}how-do-you-test-and-monitor-a-voice-agent`] },
        ],
      },
      {
        day: 'Sunday, 22 Nov',
        items: [
          { id: 'founder', text: 'Read 2 articles about Iksha Labs / Hitesh Ganjoo (Sources, below) and note 2 things you genuinely like about their work.' },
          { id: 'money', text: 'Write down your answers for current CTC, expected CTC (a range), notice period and earliest joining date.' },
          { id: 'office', text: 'Decide your answer on working from their Gurugram office (and relocating, if you need to).' },
          { id: 'ask-list', text: 'Pick 4–5 questions to ask them from the list below.' },
          { id: 'patient-data', text: 'Read how to keep patient data safe.', links: [`${V}how-do-you-keep-patient-data-safe-in-a-voice-ai-product`] },
          { id: 'dsa-warmup', text: 'Light coding warm-up in case there is a coding part: 2 problems you have already solved.', links: ['linked-list/lru-cache', 'linked-list/copy-list-random-pointer'] },
        ],
      },
      {
        day: 'Monday, 23 Nov (interview day)',
        items: [
          { id: 'tech-check', text: '30 minutes before: test your camera, mic and internet, plug in the charger, sit in a quiet room, keep water nearby.' },
          { id: 'open-tabs', text: 'Keep open: this page, your resume, the job description and a notepad for drawing.' },
          { id: 'log', text: 'Right after: log every question you were asked (button on this page), write how it went, and send a short thank-you message.' },
        ],
      },
    ],

    // Questions they will probably ask, with how to answer (simple and short)
    likely: [
      {
        q: 'Tell me about yourself.',
        a: 'Keep it to 90 seconds. **Who:** Lead Engineer, 9+ years across frontend, backend and now AI platforms. **What you built:** OptimaAI, AI agents on Claude, MCP and Temporal, live with 10 lenders in India and MENA. **How you lead:** a team of 6, you own the architecture and still write the hard parts. **Why this role:** you want to take agents into real-time voice, and Iksha\'s mix of healthcare and BFSI fits your regulated-fintech background.',
        links: [],
      },
      {
        q: 'Why Iksha Labs? Why change now?',
        a: 'Be positive. Never criticise your current company. "I\'ve built text agents for a regulated industry, and voice is the next step for agents. Iksha is already live with voice in hospitals and banks, and this role owns the whole system, working directly with the founder." Mention one specific thing you read about them.',
      },
      {
        q: 'Walk me through the architecture of OptimaAI.',
        a: 'Draw it as you talk: React UI → FastAPI services → agents on Claude (mcp-agent) → 5 MCP servers with 30+ tools → Postgres, Redis, Qdrant. Temporal runs the long jobs, and the citation pipeline links every answer to its source; there are separate India and UAE environments. Then give one trade-off ("why MCP, not plain function calling") and one thing that broke and how you fixed it.',
        links: ['ai:ai-design-design-optimaai-an-ai-credit-underwriting-platform', 'ai:mcp-what-is-mcp-and-why-did-you-choose-it'],
      },
      {
        q: 'Design a real-time voice agent (for a hospital or a bank).',
        a: 'Clarify first: phone or app, languages, calls at the same time, what goes to a human. Then the pipeline, latency, barge-in, safety and handoff, scaling live calls, after-call jobs, and metrics.',
        links: [`${V}design-a-real-time-voice-ai-agent-end-to-end`],
      },
      {
        q: 'How do you keep a voice call fast?',
        a: 'Stream every stage. Start speaking on the first sentence of the reply. Use a fast model for the live turn, keep vendors close to India, keep connections open, use a filler line for slow tools, and measure p95 per stage.',
        links: [`${V}where-does-the-latency-go-in-a-voice-call-and-how-do-you-cut-it`],
      },
      {
        q: 'How do you stop an AI agent from saying wrong or unsafe things?',
        a: 'Give it few, well-defined tools, structured outputs and grounded answers (your citation pipeline). Add guardrails: no medical advice, read back details before acting, hand off to a human. Test on recorded and simulated calls before every change.',
        links: ['ai:llm-why-do-llms-hallucinate-and-how-do-you-reduce-it', 'ai:evals-how-do-you-evaluate-an-agentic-system', 'ai:evals-how-do-you-roll-out-a-new-model-or-prompt-safely'],
      },
      {
        q: 'How do you scale a Python backend for many live calls?',
        a: 'Async FastAPI. Never block the event loop; push CPU-heavy work to other workers. Scale stateless workers horizontally on Kubernetes, use sticky sessions plus Redis for call state, connection pools and backpressure, and respect vendor rate limits.',
        links: ['backend:python-what-happens-if-you-call-blocking-code-inside-an-async-endpoint', 'backend:python-the-gil-threads-vs-processes-vs-asyncio'],
      },
      {
        q: 'How do you monitor it in production?',
        a: 'Latency per stage (p50 / p95), errors, task success rate, handoff rate and cost per call. One call ID traced across every service, alerts on SLOs, and a weekly review of sampled calls.',
        links: [`${V}how-do-you-test-and-monitor-a-voice-agent`, 'backend:distributed-observability-logs-metrics-traces-slos'],
      },
      {
        q: 'Tell me about a hard technical decision.',
        a: 'Use MCP or Temporal at OptimaAI. Cover the problem, the 2–3 options, why you picked one, what it cost you, and what you would do differently.',
        links: ['backend:leadership-tell-me-about-a-hard-technical-decision-you-made-and-its-trade-offs', 'ai:temporal-why-temporal-for-agent-and-taskbook-orchestration'],
      },
      {
        q: 'How do you mentor engineers and set standards?',
        a: 'Code reviews with a clear checklist, pairing on hard tasks, testing standards (your Pytest unit / integration / e2e rules) and short design docs before big work. Give one real example of someone who grew.',
        links: ['backend:leadership-how-do-you-run-code-and-design-reviews-for-a-team-of-6', 'backend:testing-what-testing-standards-did-you-set-for-the-team'],
      },
      {
        q: 'The founder gives you a vague idea. What do you do?',
        a: 'Ask what problem it solves and how you will know it worked. Write a one-page plan. Build the smallest version, ship it to one client, measure, then improve. Flag risks early, in plain words.',
        links: ['backend:leadership-how-do-you-plan-estimate-and-deliver-with-product-credit-and-ops-stake'],
      },
      {
        q: 'How would you handle patient data?',
        a: 'Consent, collect less data, encryption, data kept in India, redaction in logs and evals, role-based access and audit logs. Mention the DPDP Act, and HIPAA for US clients, and say you\'d work with compliance.',
        links: [`${V}how-do-you-keep-patient-data-safe-in-a-voice-ai-product`],
      },
    ],

    askThem: [
      'What does the full interview process look like after this round?',
      'What is your voice stack today (speech-to-text, LLM, text-to-speech, telephony)? Which parts are built in-house?',
      'How long does an agent take to reply on a live call today, and what is the target?',
      'What is the biggest technical problem you want this person to solve in the first 90 days?',
      'How big is the engineering team, and who would report to me?',
      'How do you test an agent before a new hospital or bank goes live?',
      'How do you handle patient data and consent today?',
      'How do you split effort between voice agents, Rumi and the medical-imaging work?',
    ],

    // The things people forget
    ready: [
      'Confirm the round time, length, format and interviewer with the recruiter, and save the meeting link.',
      'Current CTC, expected CTC (a range you are happy with) and the reason for your number.',
      'Notice period, earliest joining date, and whether you can buy out or shorten your notice.',
      'Your answer on working from their Gurugram office, and relocating if needed. Public listings say they work on-site.',
      'One positive sentence on why you are looking for a change.',
      'Every number on your resume you can back up: 10 lenders, 30+ tools, 100+ workflows, 99.9%+ uptime, a team of 6, +25% interaction, +10% conversion.',
      'Your resume open in front of you, the same version you sent.',
      'Paper and pen, or a drawing tool like Excalidraw, for system design.',
      'A quiet room, a charged laptop, earphones with a mic, and backup internet (a phone hotspot).',
    ],

    jd: `Lead Engineer, "A design and development studio" (Iksha Labs), via Cutshort Lightning, recruiter Ariba Khan
8–15 years · Gurugram

About the role: a senior, hands-on engineering role at the heart of the product team. Set the architecture for real-time voice AI agents and build the hardest parts yourself, from the systems that power live conversations to the interfaces clients rely on. Work directly with the founder and product leadership.

What you'll own
- Set the technical direction: own the architecture of the core systems (real-time voice agents, backend services, data and APIs); lead the hardest problems personally; establish engineering standards (code quality, reviews, testing, patterns); drive technical strategy with the founder and product leadership.
- Build the product end to end: features across backend services, APIs and front-ends; client-facing dashboards, review tools and configuration interfaces; data models and APIs that scale across clients.
- Make it reliable and fast: monitoring and alerting, performance, testing and evaluation.
- Lead through the team: mentor engineers, multiply output, take features from ambiguity to done.

What they're looking for
- 8+ years, significant backend depth, a track record of owning systems.
- Strong backend engineering, ideally Python; production services and APIs.
- Proven architecture and system-design ability; clear reasoning about trade-offs.
- Solid fundamentals across APIs, databases and cloud infrastructure.
- Experience building real-time and/or AI-powered products.
- Technical leadership while staying hands-on; excellent communication and ownership.

Nice to have: AI / LLMs in production; voice or other real-time products; healthcare, fintech or other regulated domains; early or senior startup experience.`,
  },
];

export const opportunityById = Object.fromEntries(opportunities.map((o) => [o.id, o]));

// Used for interviews you add yourself on the site (no tailored plan yet).
export const genericReady = [
  'Confirm the round time, length, format and interviewer with the recruiter.',
  'Current CTC, expected CTC (a range) and notice period.',
  'Your answer on location / working from office.',
  'One positive sentence on why you are looking for a change.',
  'A 90-second intro tailored to this job description.',
  '3 stories: a big technical decision, a production problem you fixed, someone you mentored.',
  'Every number on your resume you can back up.',
  '4–5 questions to ask them.',
  'Quiet room, charged laptop, mic, backup internet.',
];
