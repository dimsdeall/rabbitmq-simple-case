import amqlib, { Channel, Connection } from 'amqplib'
import config from '../env.config'

let connection: Connection, channel: Channel
const queueName = 'queueWork'

const maxRetries = 4;

async function processMessage(message: amqlib.ConsumeMessage, retries = 0) {
  try {
    // Proses pesan
    console.log('Processing message:', message.content.toString());
    // Simulasi error untuk contoh
    throw new Error('Simulated processing error');
  } catch (error) {
    console.log(`Error processing message`);
    // bisa pake x-delivery-count atau x-death
    const lastDeathCount = message.properties.headers['x-delivery-count'] ? message.properties.headers['x-delivery-count'].count : 1
    
    if (lastDeathCount <= maxRetries) {
      message.properties.headers['x-delivery-count'] = {
        count: lastDeathCount + 1,
        reason: 'rejected',
      }

      console.log('===> Jumlah Retry', lastDeathCount)
      channel.ack(message)
      // Requeue
      channel.sendToQueue(queueName, message.content, message.properties)
    } else {
      // send to DLQ (Dead Letter Queue)
      channel.nack(message, false, false)
    }
  }
}

async function configRabbit() {
  try {
    connection = await amqlib.connect(config.rabbitMqUrl)
    channel = await connection.createChannel()
    
    await channel.prefetch(1)
    await channel.assertQueue(queueName, {
      durable: true,
      deadLetterExchange: "dead.exchange",
      deadLetterRoutingKey: `dead.${queueName}`
    })

    console.log('Consumer 1 subscribe now...')

    channel.consume(queueName, (message) => message && processMessage(message));

  } catch (error) {
    console.log(error);
  }
}

configRabbit()