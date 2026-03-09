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
          text: 'You keep opening the door every 30 seconds to check if the delivery person is there. Exhausting and pointless.'
        },
        techEquivalent: {
          icon: '🔔',
          title: 'Event-Driven Pizza',
          text: 'You have a doorbell. When the pizza arrives, it rings. You react only when something actually happens.'
        }
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
        language: 'javascript',
        title: 'A Simple Event',
        code: `// An event is just data about what happened
{
  "eventType": "user.registered",
  "timestamp": "2026-03-09T14:30:00Z",
  "data": {
    "userId": "usr_456",
    "email": "user@example.com"
  }
}`,
        label: 'Events use past tense — they describe what already happened'
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
        instruction: 'Events should be named in which tense?',
        code: 'eventType: "order.___"',
        blank: '___',
        options: ['place', 'placed', 'placing'],
        correct: 1,
        explanation: 'Events describe what already happened, so we use past tense: order.placed, user.registered, payment.processed.'
      },
      {
        type: 'summary',
        learned: [
          'EDA = react to events, don\'t constantly check',
          'Three building blocks: Event, Publisher, Subscriber',
          'Events are named in past tense',
          'Used by Uber, Netflix, Slack, and more'
        ],
        nextChapter: 'Traditional vs Event-Driven'
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
          title: 'Traditional: The Micromanager',
          text: 'A boss calls each employee one by one, waits for them to finish, then calls the next. If one person is sick, everything stops.'
        },
        techEquivalent: {
          icon: '📢',
          title: 'Event-Driven: The Announcement',
          text: 'The boss announces "new project started!" over the PA system. Each department hears it and independently does their part.'
        }
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Traditional: Tightly Coupled',
        code: `function registerUser(userData) {
  const user = database.save(userData);
  emailService.sendWelcome(user.email);
  profileService.create(user.id);
  analytics.track('registered', user);
  adminNotifier.notify(user);
  return user; // User waits for ALL steps
}`,
        label: 'Registration knows about every service — if email breaks, registration breaks'
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Event-Driven: Loosely Coupled',
        code: `function registerUser(userData) {
  const user = database.save(userData);
  eventBus.publish('user.registered', user);
  return user; // Done! 200ms response
}

// Each service subscribes independently
eventBus.on('user.registered', (user) => {
  emailService.sendWelcome(user.email);
});`,
        label: 'Registration only publishes an event — services react on their own'
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
        instruction: 'In EDA, the registration function just needs to:',
        code: 'eventBus.___(\'user.registered\', user);',
        blank: '___',
        options: ['subscribe', 'publish', 'delete'],
        correct: 1,
        explanation: 'The publisher uses eventBus.publish() to announce what happened. Subscribers listen separately.'
      },
      {
        type: 'summary',
        learned: [
          'Traditional = sequential, tightly coupled, slow',
          'Event-Driven = announce + react, loosely coupled, fast',
          'Adding features = just add a new subscriber',
          'User gets 200ms response instead of 2-5 seconds'
        ],
        nextChapter: 'Publishers & Subscribers'
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
          text: 'A radio station broadcasts music. It doesn\'t know who\'s listening or how many. Listeners tune in to the frequency they want.'
        },
        techEquivalent: {
          icon: '🔀',
          title: 'Event Bus',
          text: 'A publisher emits events to the event bus. It doesn\'t know who subscribes. Subscribers listen for events they care about.'
        }
      },
      {
        type: 'code',
        language: 'json',
        title: 'Anatomy of an Event',
        code: `{
  "eventType": "user.registered",
  "eventId": "evt_123abc",
  "timestamp": "2026-03-09T14:30:00Z",
  "data": {
    "userId": "usr_456",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "metadata": {
    "source": "user-service",
    "version": "1.0"
  }
}`,
        label: 'Events are immutable — once created, they never change'
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Publisher Pattern',
        code: `class UserService {
  register(userData) {
    const user = this.saveToDatabase(userData);

    // Publisher announces what happened
    eventBus.publish({
      eventType: 'user.registered',
      data: user
    });

    return user; // Fire and forget!
  }
}`,
        label: 'Publishers don\'t care who listens — they just announce'
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
        explanation: 'Publishers use the "fire and forget" principle — they emit the event and move on. They don\'t know or care who subscribes.'
      },
      {
        type: 'fill-blank',
        instruction: 'A subscriber registers interest in events like this:',
        code: 'eventBus.___("user.registered", handleEvent);',
        blank: '___',
        options: ['publish', 'subscribe', 'emit'],
        correct: 1,
        explanation: 'Subscribers use eventBus.subscribe() to listen for specific event types they care about.'
      },
      {
        type: 'summary',
        learned: [
          'Events = immutable records of what happened',
          'Publishers = announce events (fire and forget)',
          'Subscribers = listen and react independently',
          'They never need to know about each other'
        ],
        nextChapter: 'The Pub/Sub Pattern'
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
          text: 'You subscribe to channels you like. When a creator uploads (publishes), YouTube notifies all subscribers. The creator doesn\'t email each viewer.'
        },
        techEquivalent: {
          icon: '📡',
          title: 'Topic-Based Messaging',
          text: 'Services subscribe to topics like "user.events" or "orders". When a publisher sends to that topic, all subscribers get the message automatically.'
        }
      },
      {
        type: 'diagram',
        title: 'Pub/Sub Message Flow',
        parts: [
          { label: 'Publisher 1', position: 'left-top' },
          { label: 'Publisher 2', position: 'left-mid' },
          { label: 'Publisher 3', position: 'left-bottom' },
          { label: 'Topic: "user.events"', position: 'center' },
          { label: 'Subscriber A', position: 'right-top' },
          { label: 'Subscriber B', position: 'right-mid' },
          { label: 'Subscriber C', position: 'right-bottom' }
        ],
        svg: `<svg viewBox="0 0 400 200" class="diagram-svg">
          <rect x="10" y="15" width="90" height="30" rx="6" fill="#7C3AED" opacity="0.3" stroke="#7C3AED"/>
          <text x="55" y="35" text-anchor="middle" fill="#E5E7EB" font-size="11">Publisher 1</text>
          <rect x="10" y="85" width="90" height="30" rx="6" fill="#7C3AED" opacity="0.3" stroke="#7C3AED"/>
          <text x="55" y="105" text-anchor="middle" fill="#E5E7EB" font-size="11">Publisher 2</text>
          <rect x="10" y="155" width="90" height="30" rx="6" fill="#7C3AED" opacity="0.3" stroke="#7C3AED"/>
          <text x="55" y="175" text-anchor="middle" fill="#E5E7EB" font-size="11">Publisher 3</text>
          <rect x="140" y="70" width="120" height="60" rx="10" fill="#1A1D2E" stroke="#7C3AED" stroke-width="2"/>
          <text x="200" y="95" text-anchor="middle" fill="#7C3AED" font-size="11" font-weight="bold">Topic:</text>
          <text x="200" y="115" text-anchor="middle" fill="#E5E7EB" font-size="10">"user.events"</text>
          <rect x="300" y="15" width="90" height="30" rx="6" fill="#10B981" opacity="0.3" stroke="#10B981"/>
          <text x="345" y="35" text-anchor="middle" fill="#E5E7EB" font-size="11">Sub A</text>
          <rect x="300" y="85" width="90" height="30" rx="6" fill="#10B981" opacity="0.3" stroke="#10B981"/>
          <text x="345" y="105" text-anchor="middle" fill="#E5E7EB" font-size="11">Sub B</text>
          <rect x="300" y="155" width="90" height="30" rx="6" fill="#10B981" opacity="0.3" stroke="#10B981"/>
          <text x="345" y="175" text-anchor="middle" fill="#E5E7EB" font-size="11">Sub C</text>
          <line x1="100" y1="30" x2="140" y2="90" stroke="#7C3AED" stroke-width="1.5" opacity="0.6"/>
          <line x1="100" y1="100" x2="140" y2="100" stroke="#7C3AED" stroke-width="1.5" opacity="0.6"/>
          <line x1="100" y1="170" x2="140" y2="110" stroke="#7C3AED" stroke-width="1.5" opacity="0.6"/>
          <line x1="260" y1="90" x2="300" y2="30" stroke="#10B981" stroke-width="1.5" opacity="0.6"/>
          <line x1="260" y1="100" x2="300" y2="100" stroke="#10B981" stroke-width="1.5" opacity="0.6"/>
          <line x1="260" y1="110" x2="300" y2="170" stroke="#10B981" stroke-width="1.5" opacity="0.6"/>
        </svg>`
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Pub/Sub in Action',
        code: `// Publisher sends to a topic
eventBus.publish('orders', {
  orderId: 123,
  amount: 99.99,
  userId: 'usr_456'
});

// Multiple subscribers on same topic
eventBus.subscribe('orders', sendConfirmation);
eventBus.subscribe('orders', updateInventory);
eventBus.subscribe('orders', logAnalytics);`,
        label: 'One publish, multiple subscribers — each reacts independently'
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
        instruction: 'To receive messages, a service must:',
        code: 'eventBus.subscribe("___", handleOrder);',
        blank: '___',
        options: ['orders', 'function', 'database'],
        correct: 0,
        explanation: 'Subscribers listen to specific topics (like "orders") — they only receive messages published to that topic.'
      },
      {
        type: 'summary',
        learned: [
          'Pub/Sub = topic-based message distribution',
          'Publishers send to topics, subscribers listen to topics',
          'A broker manages delivery between them',
          'Used by YouTube, Slack, Google Cloud, AWS, Redis'
        ],
        nextChapter: 'Event Sourcing'
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
          text: 'Your bank doesn\'t just store "$500." It stores every deposit, withdrawal, and transfer. Your balance is calculated by replaying all transactions.'
        },
        techEquivalent: {
          icon: '📝',
          title: 'Event Store',
          text: 'Instead of UPDATE balance=500, you append events: "deposited $1000", "withdrew $300", "withdrew $200". Current state = replay all events.'
        }
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Traditional vs Event Sourcing',
        code: `// Traditional: Only current state
{ userId: 123, balance: 500 }
// How did we get to 500? No idea.

// Event Sourcing: Full history
[
  { type: 'AccountCreated', balance: 0 },
  { type: 'Deposited', amount: 1000 },
  { type: 'Withdrew', amount: 300 },
  { type: 'Withdrew', amount: 200 }
]
// 0 + 1000 - 300 - 200 = 500 ✓`,
        label: 'Event Sourcing gives you time travel — reconstruct any past state'
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
        instruction: 'Events in Event Sourcing are:',
        code: '// Events are ___ — never changed after creation',
        blank: '___',
        options: ['mutable', 'immutable', 'deletable'],
        correct: 1,
        explanation: 'Events are immutable — once something happened, you can\'t un-happen it. You can only add new events (like a correction).'
      },
      {
        type: 'summary',
        learned: [
          'Event Sourcing = store events, not just current state',
          'Events are immutable and append-only',
          'Current state = replay all events',
          'Used by banks, Netflix, GitHub for audit trails'
        ],
        nextChapter: null
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
          text: 'Your desk has sticky notes with quick info. Way faster to glance at than opening a filing cabinet. That\'s Redis vs a traditional database.'
        },
        techEquivalent: {
          icon: '⚡',
          title: 'In-Memory Speed',
          text: 'Redis keeps data in RAM (your desk) instead of disk (filing cabinet). Result: microsecond response times instead of milliseconds.'
        }
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
          text: 'A toolbox has different tools for different jobs — hammer, screwdriver, wrench. You pick the right tool for the task.'
        },
        techEquivalent: {
          icon: '🗄️',
          title: 'Data Type = Right Tool',
          text: 'Redis data types are specialized tools. Lists for queues, Sets for unique items, Sorted Sets for leaderboards, Hashes for objects.'
        }
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
          text: 'Before shipping containers, loading cargo was chaos — different sizes, shapes, handling. Containers standardized everything. Ship, train, truck — same box.'
        },
        techEquivalent: {
          icon: '🐳',
          title: 'Docker Container',
          text: 'Docker standardizes app deployment. Your app + dependencies + config = one container. Runs identically on any machine with Docker.'
        }
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
          text: 'A recipe (image) tells you how to make a cake. You can bake many cakes (containers) from one recipe. Each cake is independent.'
        },
        techEquivalent: {
          icon: '🏗️',
          title: 'Build Once, Run Many',
          text: 'docker build creates an image. docker run creates a container from that image. You can run 10 containers from 1 image.'
        }
      }
    ]
  }
};
