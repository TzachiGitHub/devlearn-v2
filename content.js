// DevLearn v2 — Content Data
// All chapter and card data for the learning app

const SUBJECTS = [
  {
    id: 'eda',
    title: 'Event-Driven Architecture',
    emoji: '⚡',
    description: 'Learn how modern systems communicate through events',
    chapters: ['eda-what-is-eda', 'eda-traditional-vs-ed', 'eda-publishers-subscribers', 'eda-pub-sub', 'eda-event-sourcing']
  },
  {
    id: 'redis',
    title: 'Redis',
    emoji: '🔴',
    description: 'In-memory data store, caching, and message broker',
    chapters: ['redis-intro', 'redis-data-types']
  },
  {
    id: 'docker',
    title: 'Docker',
    emoji: '🐳',
    description: 'Containerize and deploy applications anywhere',
    chapters: ['docker-intro', 'docker-containers']
  }
];

const CHAPTERS = {

  // ═══════════════════════════════════════════
  // CHAPTER 1: What is EDA?
  // ═══════════════════════════════════════════
  'eda-what-is-eda': {
    id: 'eda-what-is-eda',
    subject: 'eda',
    title: 'What is EDA?',
    emoji: '⚡',
    estimatedMinutes: 3,
    cards: [
      {
        type: 'concept',
        icon: '⚡',
        title: 'Event-Driven Architecture',
        body: 'EDA is a design pattern where components communicate by producing and reacting to <strong>events</strong>. Instead of asking "did something happen?" over and over, your code just listens and reacts when it does.',
        highlight: 'Uber processes over 1 million events per second using EDA.'
      },
      {
        type: 'analogy',
        realWorld: {
          icon: '🍕',
          title: 'Waiting for Pizza',
          explanation: 'Imagine opening your front door every 30 seconds to check if the delivery person is there. Exhausting! Now imagine you just have a doorbell — when the pizza arrives, it rings, and you react.'
        },
        connection: 'EDA works the same way: instead of constantly checking, your code reacts when something actually happens.'
      },
      {
        type: 'concept',
        icon: '🔑',
        title: 'Three Key Terms',
        body: '<strong>Event</strong> — Something that happened ("user signed up", "payment processed").<br><br><strong>Publisher</strong> — The component that announces the event.<br><br><strong>Subscriber</strong> — The component that listens and reacts.',
        highlight: 'These three pieces make up every event-driven system.'
      },
      {
        type: 'code',
        label: 'Event Structure',
        language: 'json',
        snippet: '{\n  "eventType": "user.registered",\n  "timestamp": "2026-03-09T14:30:00Z",\n  "data": {\n    "userId": "usr_456",\n    "email": "user@example.com"\n  }\n}',
        why: 'Events use past tense — they describe what already happened. "user.registered" not "user.register".'
      },
      {
        type: 'quiz',
        question: 'What is the main idea behind Event-Driven Architecture?',
        options: [
          'Components constantly check each other for updates',
          'Components react when something happens — no constant checking',
          'Components are tightly connected and call each other directly'
        ],
        correct: 1,
        explanation: 'EDA is all about reacting to events as they happen, instead of constantly polling for changes.'
      },
      {
        type: 'fill-blank',
        prefix: 'eventType: "order.',
        suffix: '"',
        blank: 'placed',
        hint: 'Events describe what already happened',
        options: ['place', 'placed', 'placing']
      },
      {
        type: 'summary',
        title: 'You learned the basics of EDA!',
        xpEarned: 120,
        recap: [
          'EDA = react to events, don\'t constantly check',
          'Three building blocks: Event, Publisher, Subscriber',
          'Events are named in past tense',
          'Used by Uber, Netflix, Slack, and more'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // CHAPTER 2: Traditional vs Event-Driven
  // ═══════════════════════════════════════════
  'eda-traditional-vs-ed': {
    id: 'eda-traditional-vs-ed',
    subject: 'eda',
    title: 'Traditional vs Event-Driven',
    emoji: '⚖️',
    estimatedMinutes: 3,
    cards: [
      {
        type: 'concept',
        icon: '⚖️',
        title: 'Two Ways to Build Systems',
        body: 'Traditional architecture does everything step-by-step in sequence. Event-driven announces what happened and lets services react independently.',
        highlight: 'Twitter switched to EDA and went from crashing ("Fail Whale") to handling 500M+ tweets/day.'
      },
      {
        type: 'analogy',
        realWorld: {
          icon: '📋',
          title: 'The Micromanager Boss',
          explanation: 'A boss calls each employee one by one, waits for them to finish, then calls the next. If one person is sick, everything stops. That\'s traditional architecture — tightly coupled and fragile.'
        },
        connection: 'In EDA, the boss just announces "new project started!" — each department hears it and independently does their part.'
      },
      {
        type: 'code',
        label: 'Traditional: Tightly Coupled',
        language: 'javascript',
        snippet: 'function registerUser(userData) {\n  const user = database.save(userData);\n  emailService.sendWelcome(user.email);\n  profileService.create(user.id);\n  analytics.track(\'registered\', user);\n  adminNotifier.notify(user);\n  return user; // User waits for ALL steps\n}',
        why: 'Registration knows about every service — if email breaks, registration breaks too.'
      },
      {
        type: 'code',
        label: 'Event-Driven: Loosely Coupled',
        language: 'javascript',
        snippet: 'function registerUser(userData) {\n  const user = database.save(userData);\n  eventBus.publish(\'user.registered\', user);\n  return user; // Done! 200ms response\n}\n\n// Each service subscribes independently\neventBus.on(\'user.registered\', (user) => {\n  emailService.sendWelcome(user.email);\n});',
        why: 'Registration only publishes an event — services react on their own. User gets instant response.'
      },
      {
        type: 'quiz',
        question: 'What is the main advantage of EDA when adding new features?',
        options: [
          'It\'s always faster to code',
          'You add features without touching existing code',
          'It uses less memory'
        ],
        correct: 1,
        explanation: 'With EDA, you just add a new subscriber — no need to modify the publisher or any existing code.'
      },
      {
        type: 'fill-blank',
        prefix: 'eventBus.',
        suffix: '(\'user.registered\', user);',
        blank: 'publish',
        hint: 'The registration function needs to announce what happened',
        options: ['subscribe', 'publish', 'delete']
      },
      {
        type: 'summary',
        title: 'Traditional vs Event-Driven — done!',
        xpEarned: 120,
        recap: [
          'Traditional = sequential, tightly coupled, slow',
          'Event-Driven = announce + react, loosely coupled, fast',
          'Adding features = just add a new subscriber',
          'User gets 200ms response instead of 2-5 seconds'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // CHAPTER 3: Publishers & Subscribers
  // ═══════════════════════════════════════════
  'eda-publishers-subscribers': {
    id: 'eda-publishers-subscribers',
    subject: 'eda',
    title: 'Publishers & Subscribers',
    emoji: '📢',
    estimatedMinutes: 3,
    cards: [
      {
        type: 'concept',
        icon: '📢',
        title: 'The Building Blocks',
        body: 'Every EDA system has three parts: <strong>Events</strong> (what happened), <strong>Publishers</strong> (who announces it), and <strong>Subscribers</strong> (who reacts). They never need to know about each other.',
        highlight: 'When you tap "Request Uber," at least 12 different services receive that single event.'
      },
      {
        type: 'analogy',
        realWorld: {
          icon: '📻',
          title: 'Radio Station',
          explanation: 'A radio station broadcasts music without knowing who\'s listening or how many. Listeners tune in to the frequency they care about, independently of the station.'
        },
        connection: 'Publishers emit events to the event bus without knowing who subscribes. Subscribers listen for events they care about.'
      },
      {
        type: 'code',
        label: 'Anatomy of an Event',
        language: 'json',
        snippet: '{\n  "eventType": "user.registered",\n  "eventId": "evt_123abc",\n  "timestamp": "2026-03-09T14:30:00Z",\n  "data": {\n    "userId": "usr_456",\n    "email": "user@example.com",\n    "name": "John Doe"\n  },\n  "metadata": {\n    "source": "user-service",\n    "version": "1.0"\n  }\n}',
        why: 'Events are immutable — once created, they never change. They\'re a permanent record of what happened.'
      },
      {
        type: 'code',
        label: 'Publisher Pattern',
        language: 'javascript',
        snippet: 'class UserService {\n  register(userData) {\n    const user = this.saveToDatabase(userData);\n\n    // Publisher announces what happened\n    eventBus.publish({\n      eventType: \'user.registered\',\n      data: user\n    });\n\n    return user; // Fire and forget!\n  }\n}',
        why: 'Publishers don\'t care who listens — they just announce. This is the "fire and forget" principle.'
      },
      {
        type: 'quiz',
        question: 'What is a publisher\'s main responsibility?',
        options: [
          'Call each subscriber directly with the event data',
          'Announce events and not care who handles them',
          'Wait for all subscribers to finish processing'
        ],
        correct: 1,
        explanation: 'Publishers use the "fire and forget" principle — they emit the event and move on.'
      },
      {
        type: 'fill-blank',
        prefix: 'eventBus.',
        suffix: '("user.registered", handleEvent);',
        blank: 'subscribe',
        hint: 'A subscriber needs to register interest in events',
        options: ['publish', 'subscribe', 'emit']
      },
      {
        type: 'summary',
        title: 'Publishers & Subscribers — nailed it!',
        xpEarned: 120,
        recap: [
          'Events = immutable records of what happened',
          'Publishers = announce events (fire and forget)',
          'Subscribers = listen and react independently',
          'They never need to know about each other'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // CHAPTER 4: The Pub/Sub Pattern
  // ═══════════════════════════════════════════
  'eda-pub-sub': {
    id: 'eda-pub-sub',
    subject: 'eda',
    title: 'The Pub/Sub Pattern',
    emoji: '🔔',
    estimatedMinutes: 3,
    cards: [
      {
        type: 'concept',
        icon: '🔔',
        title: 'Publish-Subscribe',
        body: 'Pub/Sub is the most widely used EDA pattern. Publishers send messages to <strong>topics</strong>, subscribers receive messages from topics they\'re interested in. A broker handles delivery.',
        highlight: 'YouTube uses Pub/Sub to instantly notify 50 million subscribers when a creator uploads.'
      },
      {
        type: 'analogy',
        realWorld: {
          icon: '📺',
          title: 'YouTube Subscriptions',
          explanation: 'You subscribe to channels you like. When a creator uploads (publishes), YouTube notifies all subscribers automatically. The creator doesn\'t email each viewer individually.'
        },
        connection: 'Pub/Sub works the same: services subscribe to topics, and when a publisher sends to that topic, all subscribers get the message.'
      },
      {
        type: 'concept',
        icon: '🔀',
        title: 'The Message Flow',
        body: 'Multiple <strong>Publishers</strong> send to a Topic. The <strong>Broker</strong> routes messages. Multiple <strong>Subscribers</strong> receive from that Topic independently.',
        highlight: 'Key pieces: Topic (named channel), Publisher (sends), Subscriber (receives), Broker (routes).'
      },
      {
        type: 'code',
        label: 'Pub/Sub in Action',
        language: 'javascript',
        snippet: '// Publisher sends to a topic\neventBus.publish(\'orders\', {\n  orderId: 123,\n  amount: 99.99,\n  userId: \'usr_456\'\n});\n\n// Multiple subscribers on same topic\neventBus.subscribe(\'orders\', sendConfirmation);\neventBus.subscribe(\'orders\', updateInventory);\neventBus.subscribe(\'orders\', logAnalytics);',
        why: 'One publish, multiple subscribers — each reacts independently. Add new subscribers without changing publisher code.'
      },
      {
        type: 'quiz',
        question: 'In Pub/Sub, what connects publishers to subscribers?',
        options: [
          'Direct function calls between services',
          'Topics (named channels) managed by a broker',
          'A shared database both read from'
        ],
        correct: 1,
        explanation: 'Topics are the key abstraction in Pub/Sub. Publishers send to topics, subscribers listen to topics, and the broker routes messages.'
      },
      {
        type: 'fill-blank',
        prefix: 'eventBus.subscribe("',
        suffix: '", handleOrder);',
        blank: 'orders',
        hint: 'You subscribe to a specific topic name',
        options: ['orders', 'function', 'database']
      },
      {
        type: 'summary',
        title: 'Pub/Sub Pattern — complete!',
        xpEarned: 120,
        recap: [
          'Pub/Sub = topic-based message distribution',
          'Publishers send to topics, subscribers listen to topics',
          'A broker manages delivery between them',
          'Used by YouTube, Slack, Google Cloud, AWS, Redis'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // CHAPTER 5: Event Sourcing
  // ═══════════════════════════════════════════
  'eda-event-sourcing': {
    id: 'eda-event-sourcing',
    subject: 'eda',
    title: 'Event Sourcing',
    emoji: '📜',
    estimatedMinutes: 3,
    cards: [
      {
        type: 'concept',
        icon: '📜',
        title: 'Store Events, Not Just State',
        body: 'Event Sourcing stores every state change as an immutable event. Instead of saving "balance: $500", you save every deposit and withdrawal that led to $500.',
        highlight: 'Banks use Event Sourcing — it\'s why they can show your complete transaction history.'
      },
      {
        type: 'analogy',
        realWorld: {
          icon: '🏦',
          title: 'Your Bank Account',
          explanation: 'Your bank doesn\'t just store "$500." It stores every deposit, withdrawal, and transfer ever made. Your balance is calculated by replaying all those transactions.'
        },
        connection: 'Event Sourcing works the same: instead of UPDATE balance=500, you append events and calculate state by replaying them.'
      },
      {
        type: 'code',
        label: 'Traditional vs Event Sourcing',
        language: 'javascript',
        snippet: '// Traditional: Only current state\n{ userId: 123, balance: 500 }\n// How did we get to 500? No idea.\n\n// Event Sourcing: Full history\n[\n  { type: \'AccountCreated\', balance: 0 },\n  { type: \'Deposited\', amount: 1000 },\n  { type: \'Withdrew\', amount: 300 },\n  { type: \'Withdrew\', amount: 200 }\n]\n// 0 + 1000 - 300 - 200 = 500',
        why: 'Event Sourcing gives you time travel — reconstruct the exact state at any point in the past.'
      },
      {
        type: 'concept',
        icon: '🔑',
        title: 'Key Principles',
        body: '<strong>Immutable</strong> — Events are never changed after creation.<br><br><strong>Append-only</strong> — Always add new events, never modify old ones.<br><br><strong>State is derived</strong> — Current state = replay all events.',
        highlight: 'This gives you a complete audit trail and the ability to debug any past state.'
      },
      {
        type: 'quiz',
        question: 'How does Event Sourcing determine current state?',
        options: [
          'Reads the latest row from a database table',
          'Replays all stored events from the beginning',
          'Asks the user what the current state should be'
        ],
        correct: 1,
        explanation: 'Event Sourcing replays all events in order to calculate the current state. That\'s the "sourcing" — state is sourced from events.'
      },
      {
        type: 'fill-blank',
        prefix: '// Events are ',
        suffix: ' — never changed after creation',
        blank: 'immutable',
        hint: 'Once something happened, you can\'t un-happen it',
        options: ['mutable', 'immutable', 'deletable']
      },
      {
        type: 'summary',
        title: 'Event Sourcing — mastered!',
        xpEarned: 120,
        recap: [
          'Event Sourcing = store events, not just current state',
          'Events are immutable and append-only',
          'Current state = replay all events',
          'Used by banks, Netflix, GitHub for audit trails'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // STUB: Redis Intro (locked)
  // ═══════════════════════════════════════════
  'redis-intro': {
    id: 'redis-intro',
    subject: 'redis',
    title: 'What is Redis?',
    emoji: '🔴',
    estimatedMinutes: 3,
    stub: true,
    cards: [
      {
        type: 'concept',
        icon: '🔴',
        title: 'Redis: Lightning-Fast Data Store',
        body: 'Redis is an in-memory data store that can work as a database, cache, and message broker. It\'s insanely fast because everything lives in RAM.',
        highlight: 'Twitter uses Redis to serve 300,000+ requests per second.'
      },
      {
        type: 'analogy',
        realWorld: {
          icon: '📋',
          title: 'Sticky Notes on Your Desk',
          explanation: 'Your desk has sticky notes with quick info you need often. Way faster to glance at than opening a filing cabinet every time. That\'s Redis vs a traditional database.'
        },
        connection: 'Redis keeps data in RAM (your desk) instead of disk (filing cabinet). Result: microsecond response times.'
      }
    ]
  },

  // ═══════════════════════════════════════════
  // STUB: Redis Data Types (locked)
  // ═══════════════════════════════════════════
  'redis-data-types': {
    id: 'redis-data-types',
    subject: 'redis',
    title: 'Redis Data Types',
    emoji: '📦',
    estimatedMinutes: 3,
    stub: true,
    cards: [
      {
        type: 'concept',
        icon: '📦',
        title: 'More Than Key-Value',
        body: 'Redis isn\'t just key-value. It supports strings, lists, sets, sorted sets, hashes, streams, and more. Each type is optimized for different use cases.',
        highlight: 'Redis Streams power real-time features at companies like Discord.'
      },
      {
        type: 'analogy',
        realWorld: {
          icon: '🧰',
          title: 'A Toolbox',
          explanation: 'A toolbox has different tools for different jobs — hammer, screwdriver, wrench. You pick the right tool for the task, not use a hammer for everything.'
        },
        connection: 'Redis data types are specialized tools: Lists for queues, Sets for unique items, Sorted Sets for leaderboards.'
      }
    ]
  },

  // ═══════════════════════════════════════════
  // STUB: Docker Intro (locked)
  // ═══════════════════════════════════════════
  'docker-intro': {
    id: 'docker-intro',
    subject: 'docker',
    title: 'What is Docker?',
    emoji: '🐳',
    estimatedMinutes: 3,
    stub: true,
    cards: [
      {
        type: 'concept',
        icon: '🐳',
        title: 'Docker: Ship Anywhere',
        body: 'Docker packages your app and everything it needs into a container. It runs the same way on your laptop, your friend\'s machine, and in the cloud.',
        highlight: '"It works on my machine" → "It works in a container, so it works everywhere."'
      },
      {
        type: 'analogy',
        realWorld: {
          icon: '📦',
          title: 'Shipping Container',
          explanation: 'Before shipping containers, loading cargo was chaos — different sizes, shapes, handling. Containers standardized everything. Ship, train, truck — same box works everywhere.'
        },
        connection: 'Docker standardizes app deployment. Your app + dependencies + config = one container that runs identically anywhere.'
      }
    ]
  },

  // ═══════════════════════════════════════════
  // STUB: Docker Containers (locked)
  // ═══════════════════════════════════════════
  'docker-containers': {
    id: 'docker-containers',
    subject: 'docker',
    title: 'Images & Containers',
    emoji: '📸',
    estimatedMinutes: 3,
    stub: true,
    cards: [
      {
        type: 'concept',
        icon: '📸',
        title: 'Images vs Containers',
        body: 'An <strong>image</strong> is a blueprint — it defines what\'s inside. A <strong>container</strong> is a running instance of that image. One image can spawn many containers.',
        highlight: 'Think: Image = recipe, Container = the actual cake.'
      },
      {
        type: 'analogy',
        realWorld: {
          icon: '🍰',
          title: 'Recipe vs Cake',
          explanation: 'A recipe (image) tells you how to make a cake. You can bake many cakes (containers) from one recipe. Each cake is independent and can be eaten separately.'
        },
        connection: 'docker build creates an image. docker run creates a container from it. Run 10 containers from 1 image.'
      }
    ]
  }
};

// ── Add missing subjects to SUBJECTS array ──
SUBJECTS.push(
  {
    id: 'graphql',
    title: 'GraphQL',
    emoji: '🔮',
    description: 'Query your API like a pro — get exactly what you need',
    chapters: ['graphql-intro', 'graphql-queries', 'graphql-mutations']
  },
  {
    id: 'react-query',
    title: 'React Query',
    emoji: '⚛️',
    description: 'Async state management that just works',
    chapters: ['rq-intro', 'rq-queries']
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes',
    emoji: '☸️',
    description: 'Orchestrate containers at scale',
    chapters: ['k8s-intro', 'k8s-pods', 'k8s-services']
  },
  {
    id: 'postgresql',
    title: 'PostgreSQL',
    emoji: '🐘',
    description: 'The world\'s most advanced open source database',
    chapters: ['pg-intro', 'pg-queries', 'pg-indexes']
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    emoji: '🔷',
    description: 'JavaScript with superpowers — types, safety, tooling',
    chapters: ['ts-intro', 'ts-types', 'ts-generics']
  }
);

// ── GraphQL chapters ──
CHAPTERS['graphql-intro'] = {
  id: 'graphql-intro', subject: 'graphql', title: 'What is GraphQL?', emoji: '🔮', estimatedMinutes: 3,
  cards: [
    { type: 'concept', icon: '🔮', title: 'One endpoint, any data', body: 'GraphQL is a query language for your API. Instead of hitting <strong>/users</strong>, <strong>/posts</strong>, <strong>/comments</strong> separately, you send one query describing exactly what you need — and get exactly that back.', highlight: 'Facebook built GraphQL to solve over-fetching in their mobile app (2012).' },
    { type: 'analogy', realWorld: { icon: '🍽️', title: 'Restaurant vs. Buffet', explanation: 'REST is like ordering a fixed combo meal — you get everything in the combo whether you want it or not. GraphQL is a buffet — you pick exactly what you want, nothing more.' }, connection: 'GraphQL: ask for what you need, receive exactly that.' },
    { type: 'quiz', question: 'What problem does GraphQL solve?', options: ['Slow databases', 'Over-fetching and under-fetching data', 'Authentication'], correct: 1, explanation: 'REST APIs often return too much data (over-fetch) or require multiple requests (under-fetch). GraphQL solves both.' },
    { type: 'code', language: 'graphql', label: 'A basic GraphQL query', snippet: 'query {\n  user(id: "123") {\n    name\n    email\n    posts {\n      title\n    }\n  }\n}', why: 'One request. Exactly the fields you asked for. No extra bloat.' },
    { type: 'fill-blank', prefix: 'query {\n  user(id: "1") {\n    ', blank: 'name', suffix: '\n    email\n  }\n}', options: ['name', 'SELECT *', 'GET /user'], hint: 'GraphQL uses field names, not SQL or URL syntax.' },
    { type: 'summary', title: 'GraphQL basics unlocked! 🔮', recap: ['One endpoint replaces many REST routes', 'You describe exactly what data you need', 'No over-fetching or under-fetching'], xpEarned: 110 }
  ]
};
CHAPTERS['graphql-queries'] = {
  id: 'graphql-queries', subject: 'graphql', title: 'Queries & Variables', emoji: '🔍', estimatedMinutes: 3,
  cards: [
    { type: 'concept', icon: '🔍', title: 'Variables make queries reusable', body: 'Instead of hardcoding values in a query, you pass <strong>variables</strong>. This makes queries dynamic and safe — no string concatenation, no injection risk.' },
    { type: 'code', language: 'graphql', label: 'Query with variables', snippet: 'query GetUser($id: ID!) {\n  user(id: $id) {\n    name\n    email\n  }\n}\n\n# Variables:\n# { "id": "123" }', why: '$id is a variable. Pass it at runtime — the query stays the same.' },
    { type: 'quiz', question: 'Why use variables in GraphQL queries?', options: ['To make queries longer', 'To reuse queries safely with dynamic values', 'To bypass authentication'], correct: 1, explanation: 'Variables keep your queries static and safe — they prevent injection attacks and make queries reusable.' },
    { type: 'summary', title: 'Queries mastered! 🔍', recap: ['Variables make queries dynamic and safe', 'Use $variableName syntax in the query', 'Pass actual values separately at runtime'], xpEarned: 90 }
  ]
};
CHAPTERS['graphql-mutations'] = {
  id: 'graphql-mutations', subject: 'graphql', title: 'Mutations', emoji: '✏️', estimatedMinutes: 2,
  cards: [
    { type: 'concept', icon: '✏️', title: 'Mutations change data', body: 'A <strong>query</strong> reads data. A <strong>mutation</strong> writes it — create, update, or delete. Same syntax, different keyword.' },
    { type: 'code', language: 'graphql', label: 'Creating a user via mutation', snippet: 'mutation CreateUser($name: String!, $email: String!) {\n  createUser(name: $name, email: $email) {\n    id\n    name\n  }\n}', why: 'Mutations return data too — you get back the created user with its new ID.' },
    { type: 'quiz', question: 'When do you use a mutation?', options: ['When reading data', 'When writing, updating or deleting data', 'When subscribing to events'], correct: 1, explanation: 'Mutations = writes. Queries = reads. Simple.' },
    { type: 'summary', title: 'Mutations done! ✏️', recap: ['Mutations write data, queries read it', 'Same syntax as queries, different keyword', 'Mutations return the modified data'], xpEarned: 80 }
  ]
};

// ── React Query chapters ──
CHAPTERS['rq-intro'] = {
  id: 'rq-intro', subject: 'react-query', title: 'What is React Query?', emoji: '⚛️', estimatedMinutes: 3,
  cards: [
    { type: 'concept', icon: '⚛️', title: 'Server state, solved', body: 'React Query manages <strong>async state</strong> — fetching, caching, syncing, and updating server data in React. No more useState + useEffect spaghetti for every API call.' },
    { type: 'analogy', realWorld: { icon: '📬', title: 'A very smart postbox', explanation: 'Normally you\'d have to keep checking if new mail arrived. React Query is a postbox that automatically notifies you when mail arrives, remembers what you got last time, and re-fetches when it goes stale.' }, connection: 'React Query: automatic caching + background refetch for your API data.' },
    { type: 'code', language: 'typescript', label: 'Fetching with useQuery', snippet: 'const { data, isLoading, error } = useQuery({\n  queryKey: [\'users\'],\n  queryFn: () => fetch(\'/api/users\').then(r => r.json())\n});', why: 'Three lines replace 20+ lines of useState/useEffect. Plus you get caching, retries, and background sync for free.' },
    { type: 'quiz', question: 'What does React Query automatically handle?', options: ['Rendering components', 'Caching, refetching, and sync of server data', 'Routing between pages'], correct: 1, explanation: 'React Query handles the full async data lifecycle — you just tell it what to fetch and it does the rest.' },
    { type: 'summary', title: 'React Query basics! ⚛️', recap: ['Replaces useState+useEffect for server data', 'Automatic caching and background refetch', 'useQuery for reads, useMutation for writes'], xpEarned: 110 }
  ]
};
CHAPTERS['rq-queries'] = {
  id: 'rq-queries', subject: 'react-query', title: 'Query Keys & Caching', emoji: '🗝️', estimatedMinutes: 3,
  cards: [
    { type: 'concept', icon: '🗝️', title: 'Query keys are the cache key', body: 'Every query has a <strong>key</strong> — an array that uniquely identifies it. React Query uses this key to cache, deduplicate, and invalidate data automatically.' },
    { type: 'code', language: 'typescript', label: 'Query keys in practice', snippet: '// Simple key\nuseQuery({ queryKey: [\'todos\'] })\n\n// Key with params (separate cache per user)\nuseQuery({ queryKey: [\'user\', userId] })\n\n// Invalidate on mutation\nqueryClient.invalidateQueries({ queryKey: [\'todos\'] })', why: 'Different keys = different cache entries. Invalidating a key triggers a fresh fetch everywhere that key is used.' },
    { type: 'quiz', question: 'What happens when you invalidate a query key?', options: ['The component unmounts', 'React Query refetches all queries with that key', 'The cache is deleted permanently'], correct: 1, explanation: 'Invalidation marks data as stale and triggers a background refetch — components update automatically.' },
    { type: 'summary', title: 'Cache keys mastered! 🗝️', recap: ['Query keys uniquely identify cached data', 'Arrays allow parameterized keys', 'Invalidating a key triggers a fresh fetch'], xpEarned: 90 }
  ]
};

// ── Kubernetes chapters ──
CHAPTERS['k8s-intro'] = {
  id: 'k8s-intro', subject: 'kubernetes', title: 'What is Kubernetes?', emoji: '☸️', estimatedMinutes: 3,
  cards: [
    { type: 'concept', icon: '☸️', title: 'The container orchestra conductor', body: 'Kubernetes (K8s) automatically deploys, scales, and manages containerized apps. You say <strong>"I want 5 copies of this app running"</strong> and K8s makes it happen — and keeps it that way.' },
    { type: 'analogy', realWorld: { icon: '🎼', title: 'An orchestra conductor', explanation: 'Imagine 100 musicians (containers). Without a conductor, they play out of sync. The conductor (K8s) tells each musician when to play, fills in when someone is sick, and scales the orchestra up for a big performance.' }, connection: 'Kubernetes: keep your containers playing in sync, at any scale.' },
    { type: 'quiz', question: 'What is Kubernetes\' main job?', options: ['Write application code', 'Automate deployment and scaling of containers', 'Replace Docker'], correct: 1, explanation: 'K8s runs on top of Docker. It orchestrates containers — handles scaling, health checks, rolling updates, and self-healing.' },
    { type: 'code', language: 'yaml', label: 'A basic K8s deployment', snippet: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: my-app\nspec:\n  replicas: 3          # run 3 copies\n  selector:\n    matchLabels:\n      app: my-app\n  template:\n    spec:\n      containers:\n      - name: my-app\n        image: my-app:1.0', why: 'replicas: 3 means K8s will always keep 3 instances running. If one crashes, it starts a new one automatically.' },
    { type: 'summary', title: 'K8s intro done! ☸️', recap: ['K8s orchestrates containers across many machines', 'You declare desired state — K8s makes it real', 'Self-healing: crashed pods restart automatically'], xpEarned: 110 }
  ]
};
CHAPTERS['k8s-pods'] = {
  id: 'k8s-pods', subject: 'kubernetes', title: 'Pods & Nodes', emoji: '📦', estimatedMinutes: 3,
  cards: [
    { type: 'concept', icon: '📦', title: 'Pods are the smallest unit', body: 'A <strong>Pod</strong> is one or more containers that run together. A <strong>Node</strong> is a machine (VM or physical) that runs pods. K8s decides which node to place each pod on.' },
    { type: 'quiz', question: 'What is a Pod in Kubernetes?', options: ['A physical server', 'One or more containers that run together', 'A networking rule'], correct: 1, explanation: 'Pods wrap your containers. Usually 1 container per pod, but related containers (e.g. app + sidecar logger) can share a pod.' },
    { type: 'summary', title: 'Pods understood! 📦', recap: ['Pod = smallest deployable unit in K8s', 'Pods live on Nodes (machines)', 'K8s schedules pods onto nodes automatically'], xpEarned: 90 }
  ]
};
CHAPTERS['k8s-services'] = {
  id: 'k8s-services', subject: 'kubernetes', title: 'Services & Networking', emoji: '🌐', estimatedMinutes: 2,
  cards: [
    { type: 'concept', icon: '🌐', title: 'Services give pods stable addresses', body: 'Pods come and go — they get new IPs every time. A <strong>Service</strong> gives a stable address that always routes to the right pods, even as they restart.' },
    { type: 'quiz', question: 'Why do you need a Service in Kubernetes?', options: ['To write code', 'To give pods a stable network address', 'To store secrets'], correct: 1, explanation: 'Pods are ephemeral — their IPs change. Services provide a stable DNS name and load-balance traffic across all matching pods.' },
    { type: 'summary', title: 'Services done! 🌐', recap: ['Services give stable IPs to groups of pods', 'Load-balances across all matching pods', 'Types: ClusterIP, NodePort, LoadBalancer'], xpEarned: 80 }
  ]
};

// ── PostgreSQL chapters ──
CHAPTERS['pg-intro'] = {
  id: 'pg-intro', subject: 'postgresql', title: 'Why PostgreSQL?', emoji: '🐘', estimatedMinutes: 3,
  cards: [
    { type: 'concept', icon: '🐘', title: 'The reliable workhorse of databases', body: 'PostgreSQL is a <strong>relational database</strong> — data in tables with rows and columns. It\'s been the gold standard for 30 years: ACID transactions, JSON support, full-text search, and extensions for everything.' },
    { type: 'analogy', realWorld: { icon: '🗂️', title: 'A perfectly organized filing cabinet', explanation: 'Imagine every piece of data has a labeled folder, a labeled drawer, and strict rules about what goes where. Nothing is lost, nothing is duplicated, and you can find anything in milliseconds.' }, connection: 'PostgreSQL: structured, reliable, and blazing fast when indexed correctly.' },
    { type: 'quiz', question: 'What does ACID stand for in databases?', options: ['Atomicity, Consistency, Isolation, Durability', 'Arrays, Classes, Indexes, Data', 'Async, Cached, Indexed, Distributed'], correct: 0, explanation: 'ACID = your transactions are safe. Atomic (all or nothing), Consistent (rules enforced), Isolated (no interference), Durable (data survives crashes).' },
    { type: 'summary', title: 'PostgreSQL intro! 🐘', recap: ['Relational = data in tables with strict rules', 'ACID transactions guarantee data safety', 'Supports JSON, full-text search, extensions'], xpEarned: 110 }
  ]
};
CHAPTERS['pg-queries'] = {
  id: 'pg-queries', subject: 'postgresql', title: 'Writing SQL Queries', emoji: '📝', estimatedMinutes: 3,
  cards: [
    { type: 'concept', icon: '📝', title: 'SQL: the language of data', body: 'SQL (Structured Query Language) has 4 main operations: <strong>SELECT</strong> (read), <strong>INSERT</strong> (create), <strong>UPDATE</strong> (modify), <strong>DELETE</strong> (remove). Master these four and you can do almost anything.' },
    { type: 'code', language: 'sql', label: 'The most common SQL pattern', snippet: 'SELECT u.name, COUNT(o.id) as order_count\nFROM users u\nJOIN orders o ON o.user_id = u.id\nWHERE u.created_at > \'2024-01-01\'\nGROUP BY u.id\nORDER BY order_count DESC\nLIMIT 10;', why: 'This finds your top 10 most active users from 2024. JOIN connects tables, GROUP BY aggregates, ORDER BY sorts.' },
    { type: 'fill-blank', prefix: 'SELECT name FROM users WHERE ', blank: 'email', suffix: ' = \'user@example.com\';', options: ['email', 'FROM', 'JOIN'], hint: 'WHERE filters rows by a column value.' },
    { type: 'quiz', question: 'What does JOIN do in SQL?', options: ['Deletes rows from two tables', 'Combines rows from two tables based on a condition', 'Creates a new table'], correct: 1, explanation: 'JOIN links related tables. users JOIN orders gives you user info alongside their order data in one query.' },
    { type: 'summary', title: 'SQL queries! 📝', recap: ['SELECT, INSERT, UPDATE, DELETE are the core 4', 'JOIN combines data from multiple tables', 'WHERE filters, GROUP BY aggregates, ORDER BY sorts'], xpEarned: 110 }
  ]
};
CHAPTERS['pg-indexes'] = {
  id: 'pg-indexes', subject: 'postgresql', title: 'Indexes & Performance', emoji: '⚡', estimatedMinutes: 2,
  cards: [
    { type: 'concept', icon: '⚡', title: 'Indexes make queries fast', body: 'Without an index, Postgres scans <strong>every row</strong> to find your data. With an index on the right column, it jumps straight to the answer — 1000× faster on large tables.' },
    { type: 'analogy', realWorld: { icon: '📖', title: 'Book index vs. reading every page', explanation: 'Finding "PostgreSQL" in a 500-page book without an index means reading every page. With the index at the back, you jump straight to page 347.' }, connection: 'Database indexes work exactly the same — skip the scan, jump to the data.' },
    { type: 'quiz', question: 'When should you add an index?', options: ['On every column always', 'On columns you frequently filter or JOIN on', 'Never — they slow inserts'], correct: 1, explanation: 'Index columns in WHERE clauses, JOIN conditions, and ORDER BY. Too many indexes slow down writes, so be selective.' },
    { type: 'summary', title: 'Indexes mastered! ⚡', recap: ['Indexes make reads fast by skipping full scans', 'Add them to WHERE, JOIN, and ORDER BY columns', 'Too many indexes hurt write performance'], xpEarned: 80 }
  ]
};

// ── TypeScript chapters ──
CHAPTERS['ts-intro'] = {
  id: 'ts-intro', subject: 'typescript', title: 'Why TypeScript?', emoji: '🔷', estimatedMinutes: 3,
  cards: [
    { type: 'concept', icon: '🔷', title: 'JavaScript with a safety net', body: 'TypeScript adds <strong>static types</strong> to JavaScript. You catch bugs before running the code — your editor tells you "this is wrong" as you type, not at 3am when production breaks.' },
    { type: 'analogy', realWorld: { icon: '🪤', title: 'Spell-check for code', explanation: 'Word processors underline misspelled words before you publish. TypeScript underlines type errors before you ship. Both catch mistakes early when they\'re cheap to fix.' }, connection: 'TypeScript = compile-time safety. Catch bugs at dev time, not runtime.' },
    { type: 'quiz', question: 'What is the main benefit of TypeScript?', options: ['It runs faster than JavaScript', 'It catches type errors before runtime', 'It replaces JavaScript entirely'], correct: 1, explanation: 'TypeScript compiles to plain JavaScript. Its value is the type-checking during development — errors surface before they reach users.' },
    { type: 'code', language: 'typescript', label: 'Types in action', snippet: '// JavaScript (no safety)\nfunction add(a, b) { return a + b; }\nadd("5", 3); // "53" — oops!\n\n// TypeScript (safe)\nfunction add(a: number, b: number): number {\n  return a + b;\n}\nadd("5", 3); // ❌ Error: Argument of type string...', why: 'TypeScript catches the string+number bug at compile time. JavaScript lets it silently create a bug.' },
    { type: 'summary', title: 'TypeScript intro! 🔷', recap: ['Types catch bugs before the code runs', 'TypeScript compiles to plain JavaScript', 'Your editor becomes much smarter with types'], xpEarned: 110 }
  ]
};
CHAPTERS['ts-types'] = {
  id: 'ts-types', subject: 'typescript', title: 'Types & Interfaces', emoji: '📐', estimatedMinutes: 3,
  cards: [
    { type: 'concept', icon: '📐', title: 'Describe the shape of your data', body: '<strong>Interfaces</strong> define the shape of an object. <strong>Types</strong> do the same but also work for unions and primitives. Use them to describe every piece of data flowing through your app.' },
    { type: 'code', language: 'typescript', label: 'Interface vs Type', snippet: '// Interface (extendable)\ninterface User {\n  id: number;\n  name: string;\n  email?: string; // optional\n}\n\n// Type alias (flexible)\ntype Status = "active" | "inactive" | "banned";\n\n// Using them\nconst user: User = { id: 1, name: "Tzachi" };\nconst status: Status = "active";', why: 'Interface for objects, type for unions and complex shapes. Both give you autocomplete and error checking.' },
    { type: 'fill-blank', prefix: 'interface User {\n  id: ', blank: 'number', suffix: ';\n  name: string;\n}', options: ['number', 'any', 'String'], hint: 'Use lowercase primitive types in TypeScript: number, string, boolean.' },
    { type: 'quiz', question: 'What does the ? mean in an interface property?', options: ['The property is required', 'The property is optional', 'The property is private'], correct: 1, explanation: 'email?: string means email might be there or it might not. TypeScript won\'t complain if it\'s missing.' },
    { type: 'summary', title: 'Types & Interfaces! 📐', recap: ['Interfaces describe object shapes', 'Use ? for optional properties', 'Type aliases work for unions too'], xpEarned: 110 }
  ]
};
CHAPTERS['ts-generics'] = {
  id: 'ts-generics', subject: 'typescript', title: 'Generics', emoji: '🧬', estimatedMinutes: 3,
  cards: [
    { type: 'concept', icon: '🧬', title: 'Write once, use with any type', body: '<strong>Generics</strong> let you write reusable code that works with any type while staying type-safe. Like a typed variable for your types.' },
    { type: 'code', language: 'typescript', label: 'A generic function', snippet: '// Without generics — loses type info\nfunction first(arr: any[]): any { return arr[0]; }\n\n// With generics — preserves type info\nfunction first<T>(arr: T[]): T { return arr[0]; }\n\nconst num = first([1, 2, 3]);    // type: number ✅\nconst str = first(["a", "b"]);   // type: string ✅', why: 'T is a type variable — filled in automatically. You get type safety without duplicating code for every type.' },
    { type: 'quiz', question: 'What does <T> mean in a generic function?', options: ['A fixed type called T', 'A type variable filled in at call time', 'An error type'], correct: 1, explanation: 'T is a placeholder. When you call first([1,2,3]), TypeScript infers T = number automatically.' },
    { type: 'summary', title: 'Generics unlocked! 🧬', recap: ['Generics write reusable type-safe code', 'T is a type variable, inferred automatically', 'Used everywhere in React, arrays, Promises'], xpEarned: 110 }
  ]
};
SUBJECTS_END