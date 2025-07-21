const { connect, StringCodec } = require('nats');
const axios = require('axios');

const NATS_URL = process.env.NATS_URL || 'nats://nats-server:4222';
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const sc = StringCodec();

async function run() {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('DISCORD_WEBHOOK_URL not set. Broadcaster will run in log-only mode.');
  }

  try {
    const nc = await connect({ servers: NATS_URL });
    console.log(`Connected to NATS at ${nc.getServer()}`);

    // Subscribe to todos.events
    const sub = nc.subscribe('todos.events');
    console.log('Listening for messages on todos.events subject...');

    for await (const m of sub) {
      try {
        const message = JSON.parse(sc.decode(m.data));
        console.log(`Received message: ${JSON.stringify(message)}`);

        let logMessage = '';
        if (message.eventType === 'created') {
          logMessage = `A new todo was created: **${message.todo.task}**`;
        } else if (message.eventType === 'updated') {
          logMessage = `Todo **${message.todo.task}** was marked as **${message.todo.done ? 'done' : 'not done'}**`;
        }

        if (logMessage) {
          // If webhook URL is provided, send to Discord. Otherwise, just log.
          if (DISCORD_WEBHOOK_URL) {
            await axios.post(DISCORD_WEBHOOK_URL, {
              content: logMessage
            });
            console.log('Message sent to Discord.');
          } else {
            console.log(`(Log-Only Mode) Event: ${logMessage}`);
          }
        }
      } catch (parseError) {
        console.error('Error parsing NATS message or processing event:', parseError.message);
      }
    }
  } catch (err) {
    console.error('Error connecting to NATS or during subscription:', err.message);
    process.exit(1);
  }
}

run();