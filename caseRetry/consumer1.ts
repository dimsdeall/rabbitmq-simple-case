import amqlib, { Channel, Connection } from 'amqplib'
import config from '../env.config'

let connection: Connection, channel: Channel
const queueName = 'queueWork'

const maxRetries = 4;

async function processMessage(message:amqlib.ConsumeMessage, retries = 0) {
    try {
      // Proses pesan
      console.log('Processing message:', message.content.toString());
      // Simulasi error untuk contoh
      throw new Error('Simulated processing error');
    } catch (error) {
      console.log(`Error processing message`);
  
      if (retries < maxRetries) {
        const delay = Math.pow(2, retries) * 1000; // Exponential backoff formula
        console.log(`Retrying in ${delay / 1000} seconds...`);
        setTimeout(() => processMessage(message, retries + 1), delay);
      } else {
        console.log('Max retries reached. Discarding message.');
        // Jika sudah mencapai batas percobaan maksimum, kita bisa menolak pesan atau mengantre ke antrian dead-letter.
        // channel.nack(message);
        channel.reject(message, false); // Reject tanpa mengantre ke antrian dead-letter
      }
    }
  }

async function configRabbit() {
    try {
        connection = await amqlib.connect(config.rabbitMqUrl)
        channel = await connection.createChannel()
        await channel.assertQueue(queueName, { durable: true })

        console.log('Consumer 1 subscribe now...')

        channel.consume(queueName, (message) => message && processMessage(message), { noAck: false });

    } catch (error) {
        console.log(error);
    }
}

configRabbit()