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
