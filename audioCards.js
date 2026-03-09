// DevLearn Audio Cards — Sample Content
// Redis Pub/Sub (4 cards) + Kafka Consumer Groups (4 cards)

const AUDIO_CARDS = [
  // ── Redis Pub/Sub ─────────────────────────────────────────
  {
    id: 'redis-pubsub-1',
    topicId: 'redis-pubsub',
    topicTitle: 'Redis Pub/Sub',
    title: 'What is Pub/Sub?',
    audioUrl: '/audio/redis-pubsub-1.mp3',
    duration: 90,
    reviewLevel: 0,
    lastHeard: null,
    transcript: `Here's something most developers get backwards about messaging.

They think the sender needs to know who's listening. Wrong.

Imagine a radio station. You're broadcasting on 98.6 FM. You have no idea who's tuned in right now. Could be ten people. Could be ten thousand. You don't care. You just broadcast, and whoever's listening — gets it.

That's pub/sub. Publish to a channel, and anyone who subscribed to that channel receives it instantly. No direct connection. No knowledge of each other.

In Redis, it looks like this: one service publishes to a channel called "orders". Any number of other services — inventory, shipping, analytics — subscribe to "orders" and react to every message independently.

So to recap: pub/sub is like a radio broadcast. Publisher talks, subscribers listen, and they never need to meet.

Quick one — in Redis pub/sub, if no one is subscribed when a message arrives, what happens to it?

[pause]

It disappears. Gone. Like a live radio show nobody recorded. That's the key gotcha — and we'll cover why that matters in card 4.`,
    quizPrompt: {
      type: 'tap-binary',
      question: 'In Redis pub/sub, messages are stored if no subscriber is connected.',
      correctAnswer: 'no',
      answerText: 'False — messages vanish if no one is subscribed. No storage, no replay.',
      pauseMs: 5000
    }
  },
  {
    id: 'redis-pubsub-2',
    topicId: 'redis-pubsub',
    topicTitle: 'Redis Pub/Sub',
    title: 'How Redis Channels Work',
    audioUrl: '/audio/redis-pubsub-2.mp3',
    duration: 90,
    reviewLevel: 0,
    lastHeard: null,
    transcript: `Okay, so you understand pub/sub conceptually. Now let's talk about how Redis actually does it.

Think of a Redis channel like a dedicated mailbox at the post office. The mailbox has a name — say "order-events". Anyone can drop a letter in. Anyone with a key can open it and read.

But here's the difference from a real mailbox: when you drop a letter in a Redis channel, everyone with a key gets their own copy instantly. It's not like the first person takes it and it's gone.

In code, subscribing looks like this: you call SUBSCRIBE on a channel name, and Redis holds that connection open. Every time something is PUBLISHed to that channel, Redis pushes the message to all subscribers simultaneously.

One more thing — channels in Redis don't need to be created in advance. You subscribe to "payments-failed", and the channel just... exists when the first message arrives. Zero config.

Pattern-matching is also possible with PSUBSCRIBE — subscribe to "order-*" and you get messages from "order-created", "order-updated", "order-cancelled" all at once.

So: channels are named pipes. PUBLISH drops in, SUBSCRIBE listens. Multiple subscribers each get their own copy.

True or false: you need to create a Redis channel before publishing to it?

[pause]

False. Redis channels are on-demand. Publish to any name and it just works.`,
    quizPrompt: {
      type: 'tap-binary',
      question: 'You must create a Redis channel before publishing to it.',
      correctAnswer: 'no',
      answerText: 'False — channels are created on-demand when the first message arrives.',
      pauseMs: 5000
    }
  },
  {
    id: 'redis-pubsub-3',
    topicId: 'redis-pubsub',
    topicTitle: 'Redis Pub/Sub',
    title: 'Fan-out and Multiple Subscribers',
    audioUrl: '/audio/redis-pubsub-3.mp3',
    duration: 90,
    reviewLevel: 0,
    lastHeard: null,
    transcript: `Here's where pub/sub gets powerful. Fan-out.

Imagine you run a group chat. You send one message. Everyone in the chat gets it. You didn't send ten separate messages — you sent one, and it fanned out.

That's exactly what Redis pub/sub does when multiple services subscribe to the same channel.

Let's say you have an e-commerce platform. When an order is placed, you publish one event to the "orders" channel. What happens next? Your inventory service decrements stock. Your email service sends a confirmation. Your analytics service logs the sale. Your fraud service checks the transaction.

All of those happen in parallel, from one published message. Nobody waits for anybody else.

This is the superpower of pub/sub over direct API calls. Instead of your order service knowing about inventory, email, analytics, and fraud — it knows about nothing. It just shouts "order placed!" into the void. The other services are responsible for reacting.

This is called loose coupling. Each service is independently responsible. Add a new service? Just subscribe it. Remove one? The publisher doesn't even notice.

So: fan-out means one message, many receivers, zero coordination required.

Quick check — if you add a fifth subscriber to a Redis channel, does the publisher need any code changes?

[pause]

Nope. Zero changes. That's the whole point.`,
    quizPrompt: {
      type: 'tap-binary',
      question: 'Adding a new subscriber to a Redis channel requires changes to the publisher.',
      correctAnswer: 'no',
      answerText: 'False — publishers are completely unaware of subscribers. Just subscribe and start receiving.',
      pauseMs: 5000
    }
  },
  {
    id: 'redis-pubsub-4',
    topicId: 'redis-pubsub',
    topicTitle: 'Redis Pub/Sub',
    title: 'The Gotcha — No Persistence',
    audioUrl: '/audio/redis-pubsub-4.mp3',
    duration: 90,
    reviewLevel: 0,
    lastHeard: null,
    transcript: `Alright, here's the thing nobody tells you about Redis pub/sub until it bites you in production.

Think of a phone call versus a voicemail. Phone call: both people have to be on the line at the same time, or the message is lost. Voicemail: you can call, leave a message, and they listen later.

Redis pub/sub is a phone call. If nobody's home — the message is gone.

Here's the scenario: your inventory service goes down for a deployment. While it's down, orders keep coming in. Your order service happily publishes to the "orders" channel. Those messages hit Redis... and vanish. When inventory comes back up, it has no idea anything happened.

This is the critical limitation of Redis pub/sub: no persistence, no replay, no delivery guarantees.

So when should you use it? Real-time notifications where missing a message is acceptable — chat messages, live dashboards, invalidating a cache. When freshness matters more than completeness.

When should you NOT use it? When every message must be processed — financial transactions, order fulfillment, anything where "we lost some messages during a deployment" is unacceptable.

For that, you want Redis Streams — or Kafka — which we'll cover next. Those have persistence baked in.

Final recap: Redis pub/sub = fast, real-time, zero persistence. Great for "nice to have" events. Not for "must not lose" events.

True or false: Redis pub/sub guarantees message delivery even if the subscriber is temporarily offline?

[pause]

False. Offline subscriber means missed messages. Use Redis Streams or Kafka for guaranteed delivery.`,
    quizPrompt: {
      type: 'tap-binary',
      question: 'Redis pub/sub guarantees message delivery if a subscriber reconnects.',
      correctAnswer: 'no',
      answerText: 'False — messages sent while offline are lost. Use Redis Streams or Kafka for durability.',
      pauseMs: 5000
    }
  },

  // ── Kafka Consumer Groups ─────────────────────────────────
  {
    id: 'kafka-consumers-1',
    topicId: 'kafka-consumers',
    topicTitle: 'Kafka Consumer Groups',
    title: 'What is a Consumer Group?',
    audioUrl: '/audio/kafka-consumers-1.mp3',
    duration: 90,
    reviewLevel: 0,
    lastHeard: null,
    transcript: `Here's how Kafka avoids one consumer drowning in messages.

Imagine you run a call center. Phones are ringing non-stop — those are Kafka messages. You've got five agents — those are your consumers. 

Without a system, all five agents might pick up the same call. Chaos. Or one agent handles everything while the others do nothing. Also chaos.

A consumer group is your management solution. You assign each incoming call to exactly one agent. Nobody doubles up. Everybody's busy. Maximum throughput.

In Kafka terms: a consumer group is a named set of consumers sharing a group ID. When multiple consumers have the same group ID, Kafka automatically distributes the partitions of a topic between them. Each partition goes to exactly one consumer in the group.

Here's why that's powerful: if you have ten consumers in a group and ten partitions, each consumer owns one partition. They all process in parallel. Ten times the throughput of a single consumer.

And if one consumer crashes? Kafka detects it and reassigns that partition to another consumer in the group automatically. No data loss. No manual intervention.

So: consumer group equals a coordinated team, each handling their own slice, with automatic failover built in.

Quick one — can two consumers in the same group read the same Kafka partition simultaneously?

[pause]

No. One partition, one consumer per group. That's the fundamental rule.`,
    quizPrompt: {
      type: 'tap-binary',
      question: 'Two consumers in the same group can read the same Kafka partition at the same time.',
      correctAnswer: 'no',
      answerText: 'False — one partition is assigned to exactly one consumer per group at any time.',
      pauseMs: 5000
    }
  },
  {
    id: 'kafka-consumers-2',
    topicId: 'kafka-consumers',
    topicTitle: 'Kafka Consumer Groups',
    title: 'Partition Assignment and Scaling',
    audioUrl: '/audio/kafka-consumers-2.mp3',
    duration: 90,
    reviewLevel: 0,
    lastHeard: null,
    transcript: `Let's talk about how you actually scale a Kafka consumer, because this trips people up.

Picture a highway with multiple lanes. Each lane is a Kafka partition. Cars are messages. You can add more lanes — that's adding partitions. And you can add more toll booths — that's adding consumers.

But here's the rule: you can only have as many active toll booths as you have lanes. Extra booths just sit idle.

Translated: if your topic has 6 partitions, you can have at most 6 active consumers in a group. If you add a 7th consumer, it sits idle — no partition to read from. Wasted resource.

This is why your partition count is your horizontal scale ceiling for consumers. Plan your partitions based on your expected consumer parallelism, not just your expected data volume.

So how do you scale? You need more partitions AND more consumers together. Add 4 partitions? Add 4 consumers to match.

One more thing: Kafka does partition assignment automatically through a process called rebalancing. Add a consumer to the group, Kafka redistributes the partitions. Remove one, Kafka redistributes again.

Rebalancing takes a few seconds. During that time, consumption pauses on the affected partitions. This is why frequent consumer additions and removals slow things down — every change triggers a rebalance.

Rule of thumb: partition count equals max consumer parallelism. Never have more consumers than partitions.

True or false: you can always speed up Kafka processing by adding more consumers to a group?

[pause]

False. Once you match the partition count, adding more consumers does nothing. More lanes, more booths — not more booths alone.`,
    quizPrompt: {
      type: 'tap-binary',
      question: 'You can always increase throughput by adding more consumers to a Kafka group.',
      correctAnswer: 'no',
      answerText: 'False — consumer count is capped by partition count. Extra consumers beyond that sit idle.',
      pauseMs: 5000
    }
  },
  {
    id: 'kafka-consumers-3',
    topicId: 'kafka-consumers',
    topicTitle: 'Kafka Consumer Groups',
    title: 'Offsets and At-Least-Once Delivery',
    audioUrl: '/audio/kafka-consumers-3.mp3',
    duration: 90,
    reviewLevel: 0,
    lastHeard: null,
    transcript: `Here's the thing that makes Kafka fundamentally different from Redis pub/sub: offsets.

Think of a Kafka partition like an append-only book. Every message gets a page number — that's the offset. Page 1, page 2, page 3. The book never shrinks. Pages are never removed while the retention period is active.

Your consumer has a bookmark — that's its committed offset. It says "I've read up to page 247." If your consumer crashes and restarts, it opens the book to page 248 and continues. Nothing lost.

Compare this to Redis pub/sub — no book, no bookmark. If you miss a message, it's gone.

Now here's the "at-least-once" part. Kafka guarantees your consumer will receive each message at least once. The "at least" is important. If your consumer processes a message but crashes before committing the offset, it'll get that message again after restart.

So your consumer code must be idempotent — processing the same message twice should have the same effect as processing it once. Increment a counter? Check if it was already incremented. Create a record? Check if it already exists.

This is the tradeoff: Kafka gives you durability and replay at the cost of handling duplicates.

The offset also enables something powerful — replay. You can reset a consumer's offset to the beginning and reprocess your entire event history. Debugging, backfilling new services, fixing a bug — all possible because the data is still there.

So: offset equals bookmark. Commit the bookmark, survive restarts. Handle duplicates, gain durability.

Quick check — if a Kafka consumer crashes before committing its offset, what happens to that message?

[pause]

It gets redelivered on restart. That's the "at-least-once" guarantee in action. Design your consumers to handle this.`,
    quizPrompt: {
      type: 'tap-binary',
      question: 'If a Kafka consumer crashes before committing its offset, that message is permanently lost.',
      correctAnswer: 'no',
      answerText: 'False — Kafka redelivers the message on restart. That\'s the at-least-once guarantee.',
      pauseMs: 5000
    }
  },
  {
    id: 'kafka-consumers-4',
    topicId: 'kafka-consumers',
    topicTitle: 'Kafka Consumer Groups',
    title: 'Multiple Groups = Multiple Independent Reads',
    audioUrl: '/audio/kafka-consumers-4.mp3',
    duration: 90,
    reviewLevel: 0,
    lastHeard: null,
    transcript: `Here's the superpower that separates Kafka from traditional message queues — and it changes how you architect systems.

Imagine you have a DVD. You can give copies of that DVD to five different people. Each person watches it independently. One is on chapter 3, another finished it last week, another just started. The DVD doesn't care.

In Kafka, your topic is the DVD. Multiple consumer groups can all read the same topic, completely independently.

Here's the practical implication. Your "orders" topic has messages. Your analytics team subscribes with group ID "analytics-service". Your shipping team subscribes with "shipping-service". Your fraud team subscribes with "fraud-detection". 

All three read every single order event. At their own pace. With their own offsets. Without knowing about each other. Without interfering with each other.

This is different from a traditional queue like RabbitMQ, where once a message is consumed by one service, it's gone. In Kafka, consumed means "I read it" — not "it's deleted."

This means you can add a new consumer group at any time and replay the entire history. Your data science team wants to train a model on the last year of orders? Create a new consumer group, reset offset to the beginning, let it run.

And removing a consumer group has zero impact on others. Each group is fully isolated.

So: Kafka topics are like broadcast recordings. Any group can tune in at any time, at any point in history.

Final question — if you add a brand new consumer group to an existing Kafka topic, can it replay historical messages?

[pause]

Yes — if the retention period hasn't expired, you can start from any offset. That's one of Kafka's most powerful features.`,
    quizPrompt: {
      type: 'tap-binary',
      question: 'A new Kafka consumer group can read historical messages from a topic.',
      correctAnswer: 'yes',
      answerText: 'True — as long as messages are within the retention period, any consumer group can read from any offset.',
      pauseMs: 5000
    }
  }
];

// Export for use in other modules
if (typeof module !== 'undefined') module.exports = { AUDIO_CARDS };
